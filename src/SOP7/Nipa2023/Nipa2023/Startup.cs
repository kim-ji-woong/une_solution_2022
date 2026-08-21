using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.IO;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Nipa2023
{
    public class Startup
    {
        private static Config.ConfigManager m_configManager = new Config.ConfigManager();
        private static string m_strResourceRootPath = "";

        public static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
        }

        public static string ResourceRootPath
        {
            get { return m_strResourceRootPath; }
        }

        public Startup(IConfiguration configuration)
        {
            m_configManager.ReadConfig(configuration);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("UnEPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            services.AddAuthentication(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
            {
                options.Cookie.Path = "";
                options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.None;
            });
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            if (m_configManager.Site.DBType != null)
            {
                string strDBName = m_configManager.Site.DBName;
                int nDBType = (int)m_configManager.Site.DBType;
                string strDbID = m_configManager.DB.DbID;
                string strDbHost = m_configManager.DB.DbHost;
                string strDbPW = m_configManager.DB.DbPw;
                int nSiteID = m_configManager.Site.ExternalSiteID == null ? -1 : (int)m_configManager.Site.ExternalSiteID;

                services.AddTransient<dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager >(service => new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW));
                services.AddTransient<global::SOPSimulator.IDAL.IDataManager>(service => new global::SOPSimulator.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::SOPManager.IDAL.IDataManager>(service => new global::SOPManager.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::TeamEditor.IDAL.IDataManager>(service => new global::TeamEditor.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::SDMS.IDAL.IDataManager>(service => new global::SDMS.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::Common.IDAL.IDataManager>(service => new global::Common.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
            }

            services.AddSwaggerGen(c =>
            {
                c.CustomSchemaIds(type => type.ToString());

                c.SwaggerDoc("Account", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "Account",
                    Title = "계정관리",
                    Description = "계정관리를 위한 API"
                });

                c.SwaggerDoc("SDMS", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "SDMS",
                    Title = "재난 모니터링",
                    Description = "재난 모니터링을 위한 API"
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
                m_strResourceRootPath = "ClientApp\\public";
                app.UseDeveloperExceptionPage();
            }
            else
            {
                m_strResourceRootPath = "ClientApp\\build";
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // 정식버전에는 UseSwagger를 IsDevelopment 안에 넣어야함
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/Account/swagger.json", "계정관리 API");
                c.SwaggerEndpoint("/swagger/SDMS/swagger.json", "모니터링 API");

                c.DefaultModelsExpandDepth(-1);
            });

            app.UseSwagger(options =>
            {
                options.SerializeAsV2 = true;
            });

            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                // Areas 경로
                endpoints.MapControllerRoute(
                    name: "Nipa",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
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
