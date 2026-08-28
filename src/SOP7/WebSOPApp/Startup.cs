using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace WebSOPApp
{
    public class Startup
    {
        //public static string SOPWebServerURL = "";
        //public static string StreamServerURL = "";
        //public static string SiteID = "";
        public static string ResourceRootPath = "";
        //public static string ExternalLogin = null;
        //public static bool? AutoLogin = null;

        private static Config.ConfigManager m_configManager = new Config.ConfigManager();

        public static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
        }

        public Startup(IConfiguration configuration)
        {
            m_configManager.ReadConfig(configuration);
            //Configuration = configuration;
        }
        //public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("UnEPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            if (m_configManager.Site.SiteID != null && m_configManager.Site.DBType != null)
            {
                string strDBName = m_configManager.Site.DBName;
                int nDBType = (int)m_configManager.Site.DBType;
                int nSiteID = (int)m_configManager.Site.SiteID;
                string strDbID = m_configManager.Site.DbID;
                string strDbHost = m_configManager.Site.DbHost;
                string strDbPW = m_configManager.Site.DbPw;

                services.AddTransient<global::SOPSimulator.IDAL.IDataManager>(service => new global::SOPSimulator.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::SOPManager.IDAL.IDataManager>(service => new global::SOPManager.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::TeamEditor.IDAL.IDataManager>(service => new global::TeamEditor.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::SDMS.IDAL.IDataManager>(service => new global::SDMS.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::Common.IDAL.IDataManager>(service => new global::Common.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::Weather.IDAL.IDataManager>(service => new global::Weather.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::Dashboard.IDAL.IDataManager>(service => new global::Dashboard.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::GGH.IDAL.IDataManager>(service => new global::GGH.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Set up custom content types -associating file extension to MIME type
            var provider = new FileExtensionContentTypeProvider(); 
            // Add new mappings
            provider.Mappings[".glb"] = "model/gltf+binary"; 
            provider.Mappings[".gltf"] = "model/gltf+json";

            app.UseStaticFiles(); 

            // ���뷮 ���� �𵨸� ���� ����
            string strPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build\\resource\\gltf");

            if (Directory.Exists(strPath))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(strPath),
                    RequestPath = "/resource/gltf",
                    ContentTypeProvider = provider,
                    OnPrepareResponse = ctx =>
                    {
                        // ���� �����(ETag/Last-Modified) �� ���� �ٲ�� ��� ���� ����
                        ctx.Context.Response.Headers["Cache-Control"] = "no-cache";
                    }
                });
            }

            // ���뷮 ���� �𵨸� ���� ����
            string strLightPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build\\resource\\gltf_light");

            if (Directory.Exists(strLightPath))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(strLightPath),
                    RequestPath = "/resource/gltf_light",
                    ContentTypeProvider = provider,
                    OnPrepareResponse = ctx =>
                    {
                        // ���� �����(ETag/Last-Modified) �� ���� �ٲ�� ��� ���� ����
                        ctx.Context.Response.Headers["Cache-Control"] = "no-cache";
                    }
                });
            }

            // ���� ���� �б�/���� ���� ���� �߰�
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            if (env.IsDevelopment())
            {
                ResourceRootPath = "ClientApp\\public";
                app.UseDeveloperExceptionPage();
            }
            else
            {
                ResourceRootPath = "ClientApp\\build";
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            // === 서버측 인증 미들웨어 (쿠키 세션) ===
            //   Auth:Enabled = true 일 때만 동작(단계적 적용). 컨트롤러(API) 요청만 검사하고,
            //   정적 파일/SPA 페이지 라우트(endpoint == null)와 로그인/부트스트랩(/Account, /Commons)은 통과시킨다.
            //   로그인/자동로그인 시 발급된 HttpOnly 쿠키(AuthToken) 를 검증하고, 실패 시 401 을 반환한다.
            if (Startup.ConfigManager.AuthEnabled)
            {
                string authSecret = Startup.ConfigManager.AuthSecret;
                string authIssuer = Startup.ConfigManager.AuthIssuer;
                string authAudience = Startup.ConfigManager.AuthAudience;

                app.Use(async (context, next) =>
                {
                    // 컨트롤러(API)에 매칭된 요청만 검사. 정적파일/SPA 페이지는 endpoint 가 null 이라 통과.
                    if (context.GetEndpoint() != null)
                    {
                        string path = context.Request.Path.Value ?? "";
                        bool exempt = path.StartsWith("/Account", StringComparison.OrdinalIgnoreCase)   // 로그인/세션/SSO
                                   || path.StartsWith("/Commons", StringComparison.OrdinalIgnoreCase);  // SiteID 부트스트랩(로그인 전 호출)

                        if (!exempt && !HttpMethods.IsOptions(context.Request.Method))
                        {
                            string token = context.Request.Cookies["AuthToken"];
                            if (string.IsNullOrEmpty(token))
                            {
                                string authz = context.Request.Headers["Authorization"];
                                if (authz != null && authz.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                                    token = authz.Substring(7).Trim();
                            }

                            string err;
                            if (!WebSOPApp.Security.JwtHmac.Validate(token, authSecret, authIssuer, authAudience, out err))
                            {
                                context.Response.StatusCode = 401;
                                await context.Response.WriteAsync("Unauthorized: " + err);
                                return;
                            }
                        }
                    }

                    await next();
                });
            }

            //var options = new StaticFileOptions
            //{
            //    ContentTypeProvider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider()
            //};
            //((Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider)options.ContentTypeProvider).Mappings.Add(
            //    new System.Collections.Generic.KeyValuePair<string, string>(".glb", "model/gltf-buffer"));

            //app.UseStaticFiles(options);

            app.UseEndpoints(endpoints =>
            {
                // Areas ���
                endpoints.MapControllerRoute(
                    name: "WebSOPApp",
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
}
