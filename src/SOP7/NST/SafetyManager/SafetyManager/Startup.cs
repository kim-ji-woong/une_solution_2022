using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace TestWebServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            string strSiteID = Configuration["Site:ID"];
            string strDBName = Configuration["Site:DBName"];
            string strDBType = Configuration["Site:DBType"];
            string strWebServerURL = Configuration["Site:WebServerURL"];
            string strDbHost = Configuration["Site:DbHost"];
            string strDbID = Configuration["Site:DbID"];
            string strDbPW = Configuration["Site:DbPw"];

            int nSiteID, nDBType;

            if (int.TryParse(strSiteID.Trim(), out nSiteID) && int.TryParse(strDBType.Trim(), out nDBType))
            {
                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                strDbHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDbHost, key);
                strDbID = dnsDBUtil.AES256Cipher.AES_decrypt(strDbID, key);
                strDbPW = dnsDBUtil.AES256Cipher.AES_decrypt(strDbPW, key);

                services.AddTransient<global::SDMS.IDAL.IDataManager>(service => new global::SDMS.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::Common.IDAL.IDataManager>(service => new global::Common.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::TeamEditor.IDAL.IDataManager>(service => new global::TeamEditor.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
                services.AddTransient<global::Safety.IDAL.IDataManager>(service => new global::Safety.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, nSiteID));
            }

            string strLogFolder = Configuration["Logger:logFolder"];
            string strLogTag = Configuration["Logger:logTag"];

            SafetyServer.BLL.Logger.LogFolder = strLogFolder;
            SafetyServer.BLL.Logger.LogTag = strLogTag;

            string strNetvisionBaseURL = Configuration["External:netvisionBaseURL"];
            SafetyServer.BLL.Process.ProcessManager.SetNetVisionBaseURL(strNetvisionBaseURL);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(env.ContentRootPath, "Image")),
                RequestPath = "/Image"
            });
        }
    }
}
