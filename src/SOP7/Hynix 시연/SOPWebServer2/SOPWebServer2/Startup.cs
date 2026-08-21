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

namespace SOPWebServer2
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

            if (strDBHost != null && strDbId != null && strDbPw != null &&
                strDBHost.Trim().Length > 0 && strDbId.Trim().Length > 0 && strDbPw.Trim().Length > 0)
            {
                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                strDBHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDBHost, key);
                strDbId = dnsDBUtil.AES256Cipher.AES_decrypt(strDbId, key);
                strDbPw = dnsDBUtil.AES256Cipher.AES_decrypt(strDbPw, key);

                int nSiteID, nDBType;

                if (int.TryParse(strSiteID.Trim(), out nSiteID) && int.TryParse(strDBType.Trim(), out nDBType))
                {
                    services.AddTransient<global::Common.IDAL.IDataManager>(service => new global::Common.DAL.DataManager(nDBType, strDBHost, strDBName, strDbId, strDbPw, nSiteID));
                    services.AddTransient<global::TeamEditor.IDAL.IDataManager>(service => new global::TeamEditor.DAL.DataManager(nDBType, strDBHost, strDBName, strDbId, strDbPw, nSiteID));
                    services.AddTransient<global::SDMS.IDAL.IDataManager>(service => new global::SDMS.DAL.DataManager(nDBType, strDBHost, strDBName, strDbId, strDbPw, nSiteID));
                    services.AddTransient<global::Hynix.IDAL.IDataManager>(service => new global::Hynix.DAL.DataManager(nDBType, strDBHost, strDBName, strDbId, strDbPw, nSiteID));
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
