using GGHTServices.Managers;
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
using System.Threading.Tasks;

namespace GGHTServices
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
            string strDBHost = Configuration["Site:DbHost"];
            string strDbId = Configuration["Site:DbID"];
            string strDbPw = Configuration["Site:DbPw"];
            string strSOPWebServerURL = Configuration["Site:SOPWebServerURL"];
            string strLogFolder = Configuration["Site:LogFolder"];
            string strLogFileTag = Configuration["Site:LogFileTag"];
            string strLogLifeDays = Configuration["Site:LogLifeDays"];

            if (strDBHost != null && strDbId != null && strDbPw != null &&
                strDBHost.Trim().Length > 0 && strDbId.Trim().Length > 0 && strDbPw.Trim().Length > 0)
            {
                ConfigManager.DbHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDBHost);
                ConfigManager.DbName = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDBName);
                ConfigManager.DbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbId);
                ConfigManager.DbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbPw);
                ConfigManager.SOPWebServerURL = strSOPWebServerURL;

                int lifeDays;

                if (int.TryParse(strLogLifeDays.Trim(), out lifeDays))
                {
                    ConfigManager.LogFolder = strLogFolder.Trim();
                    ConfigManager.LogFileTag = strLogFileTag.Trim();
                    ConfigManager.LogLifeDays = lifeDays;
                }

                int nSiteID, nDBType;

                if (int.TryParse(strSiteID.Trim(), out nSiteID) && int.TryParse(strDBType.Trim(), out nDBType))
                {
                    ConfigManager.SiteID = nSiteID;
                    ConfigManager.DbType = nDBType;
                }
            }
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
        }
    }
}
