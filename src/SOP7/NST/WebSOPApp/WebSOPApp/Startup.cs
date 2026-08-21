using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace WebSOPApp
{
    public class Startup
    {
        public static string SOPWebServerURL = "";
        public static string StreamServerURL = "";
        public static bool IsModelViewer = false;
        public static string MemberIDFormat = "";
        public static string ExternalLogin = null;
        public static int SiteID = -1;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            string strSiteID = Configuration["Site:ID"];
            string strDBName = Configuration["Site:DBName"];
            string strDBType = Configuration["Site:DBType"];
            string strWebServerURL = Configuration["Site:WebServerURL"];
            string strSOPWebServerURL = Configuration["Site:SOPWebServerURL"];
            SOPWebServerURL = strSOPWebServerURL;
            string strStreamServerURL = Configuration["Site:StreamServerURL"];
            StreamServerURL = strStreamServerURL;

            string strDbHost = Configuration["Site:DbHost"];
            string strDbID = Configuration["Site:DbID"];
            string strDbPW = Configuration["Site:DbPw"];

            if (strDbHost != null && strDbID != null && strDbPW != null &&
                strDbHost.Trim().Length > 0 &&
                strDbID.Trim().Length > 0 &&
                strDbPW.Trim().Length > 0)
            {
                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                strDbHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDbHost, key);
                strDbID = dnsDBUtil.AES256Cipher.AES_decrypt(strDbID, key);
                strDbPW = dnsDBUtil.AES256Cipher.AES_decrypt(strDbPW, key);

                int nSiteID, nDBType;

                if (int.TryParse(strSiteID.Trim(), out nSiteID) && int.TryParse(strDBType.Trim(), out nDBType))
                {
                    SiteID = nSiteID;

                    services.AddTransient<global::SOPManager.IDAL.IDataManager>(service => new global::SOPManager.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                    services.AddTransient<global::TeamEditor.IDAL.IDataManager>(service => new global::TeamEditor.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                    services.AddTransient<global::SDMS.IDAL.IDataManager>(service => new global::SDMS.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                    services.AddTransient<global::Common.IDAL.IDataManager>(service => new global::Common.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                    services.AddTransient<global::Weather.IDAL.IDataManager>(service => new global::Weather.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                    services.AddTransient<global::Safety.IDAL.IDataManager>(service => new global::Safety.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                    services.AddTransient<global::SOPSimulator.IDAL.IDataManager>(service => new global::SOPSimulator.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                }

                string strRunMode = Configuration["Site:runMode"];

                if (strRunMode != null && strRunMode.ToLower() == "modelviewer")
                    Startup.IsModelViewer = true;

                string strMemberIDFormat = Configuration["Site:MemberIDFormat"];

                if (strMemberIDFormat != null && strMemberIDFormat.Length > 0)
                    Startup.MemberIDFormat = strMemberIDFormat;

                string strExternalLogin = Configuration["Site:externalLogin"];

                if (strExternalLogin != null && strExternalLogin.Length > 0)
                    Startup.ExternalLogin = strExternalLogin;
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
            string strPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build\\resource\\gltf");

            if (Directory.Exists(strPath))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(strPath),
                    RequestPath = "/resource/gltf",
                    ContentTypeProvider = provider
                });
            }

            // 엑셀 파일 읽기/쓰기 관련 설정 추가
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                // Areas 경로
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
