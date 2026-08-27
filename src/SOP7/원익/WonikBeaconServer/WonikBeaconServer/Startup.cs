using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WonikBeaconServer
{
    public class Startup
    {
        private SDMS.DAL.DataManager m_dataManager = null;
        private TeamEditor.DAL.DataManager m_teamDataManager = null;
        private Wonik.IDAL.IDataManager m_wonikDataManager = null;
        private ProcessManager m_processManager = null;

        private static Config.ConfigManager m_configManager = new Config.ConfigManager();
        public static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
        }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            m_configManager.ReadConfig(configuration);

            Logger.Instance.Write("Startup 실행");

            if (m_configManager.Site.SiteID != null && m_configManager.Site.DBType != null)
            {
                string strDBName = m_configManager.Site.DBName;
                int nDBType = (int)m_configManager.Site.DBType;
                int nSiteID = (int)m_configManager.Site.SiteID;
                string strDBID = m_configManager.Site.DBID;
                string strDBHost = m_configManager.Site.DBHost;
                string strDBPw = m_configManager.Site.DBPw;

                m_dataManager = new SDMS.DAL.DataManager(nDBType, strDBHost, strDBName, strDBID, strDBPw, nSiteID);
                m_teamDataManager = new TeamEditor.DAL.DataManager(nDBType, strDBHost, strDBName, strDBID, strDBPw, nSiteID);
                m_wonikDataManager = new Wonik.DAL.DataManager(nDBType, strDBHost, strDBName, strDBID, strDBPw, nSiteID);
                m_processManager = new ProcessManager(m_dataManager, m_teamDataManager, m_wonikDataManager);
            }
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // CORS: appsettings.json 의 Cors:AllowedOrigins 에 지정된 출처만 허용.
            //       (미지정 시에는 임시로 전체 허용 - 반드시 배포 전 WebSOPApp 주소를 넣어 제한할 것)
            string[] allowedOrigins = Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
            services.AddCors(o => o.AddPolicy("UnEPolicy", builder =>
            {
                if (allowedOrigins != null && allowedOrigins.Length > 0)
                    builder.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader();
                else
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            //services.AddControllers();
            services.AddControllersWithViews();

            if (m_dataManager != null && m_processManager != null)
            {
                services.AddTransient<global::SDMS.IDAL.IDataManager>(service => m_dataManager);
                services.AddTransient<global::WonikBeaconServer.ProcessManager>(service => m_processManager);
            }


            services.AddSwaggerGen(c =>
            {
                c.CustomSchemaIds(type => type.ToString());
                c.SwaggerDoc("Beacon", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "Beacon",
                    Title = "Beacon 데이터",
                    Description = "Beacon 데이터를 위한 API"
                });

                c.DocumentFilter<HideInDocsFilter>();

                // XML을 통한 Swagger Description 사용
                var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(System.AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // Swagger 는 개발 환경에서만 노출한다. (운영에서는 API 스펙 비공개)
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/Beacon/swagger.json", "Beacon API");
                    c.DefaultModelsExpandDepth(-1);
                });

                app.UseSwagger(options =>
                {
                    options.SerializeAsV2 = true;
                });
            }

            app.UseRouting();

            // CORS: ConfigureServices 에서 정의한 정책(허용 출처 제한) 적용
            app.UseCors("UnEPolicy");

            // === JWT(Bearer) 토큰 검증 미들웨어 ===
            //   Auth:Enabled = true 일 때만 동작한다(단계적 적용). 보호 대상 API(/Detection, /Beacon)에
            //   대해 Authorization: Bearer <token> 을 검증하고, 실패 시 401 을 반환한다.
            //   (OPTIONS 프리플라이트/그 외 경로는 통과)
            bool authEnabled = Configuration.GetValue<bool>("Auth:Enabled");
            if (authEnabled)
            {
                string secret = Configuration["Auth:Secret"];
                string issuer = Configuration["Auth:Issuer"];
                string audience = Configuration["Auth:Audience"];

                app.Use(async (context, next) =>
                {
                    string path = context.Request.Path.Value ?? "";
                    bool isProtected = path.StartsWith("/Detection", StringComparison.OrdinalIgnoreCase)
                                    || path.StartsWith("/Beacon", StringComparison.OrdinalIgnoreCase);

                    if (isProtected && !HttpMethods.IsOptions(context.Request.Method))
                    {
                        string authz = context.Request.Headers["Authorization"];
                        string token = (authz != null && authz.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                            ? authz.Substring(7).Trim() : null;

                        string err;
                        if (!Security.JwtHmac.Validate(token, secret, issuer, audience, out err))
                        {
                            context.Response.StatusCode = 401;
                            await context.Response.WriteAsync("Unauthorized: " + err);
                            return;
                        }
                    }

                    await next();
                });
            }

            app.UseEndpoints(endpoints =>
            {
                // Areas
                endpoints.MapControllerRoute(
                    name: "Beacon",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
        }
    }

    public class HideInDocsFilter : Swashbuckle.AspNetCore.SwaggerGen.IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            foreach (var apiDescription in context.ApiDescriptions)
            {
                // replace the data to your controller name
                if (apiDescription.RelativePath.ToLower().StartsWith(context.DocumentName.ToLower()) == false)
                {
                    var route = "/" + apiDescription.RelativePath.TrimEnd('/');
                    swaggerDoc.Paths.Remove(route);
                }
            }
        }
    }
}
