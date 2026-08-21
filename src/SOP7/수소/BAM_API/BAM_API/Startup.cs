using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API
{
    public class Startup
    {
        private DataManager m_dataManager = null;
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

            Logger.Instance.Write("Startup ½ÇÇà");            
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "BAM_API", Version = "v1" });
            });

            if (m_configManager.Site.SiteID != null && m_configManager.Site.DBType != null)
            {
                string strDBName = m_configManager.Site.DBName;
                int nDBType = (int)m_configManager.Site.DBType;
                int nSiteID = (int)m_configManager.Site.SiteID;
                string strDBID = m_configManager.Site.DBID;
                string strDBHost = m_configManager.Site.DBHost;
                string strDBPw = m_configManager.Site.DBPw;

                DataManager dataManager = new global::dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(nDBType, strDBHost, strDBName, strDBID, strDBPw);

                services.AddTransient<global::dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager>(service => dataManager);

                m_processManager = new ProcessManager(dataManager);
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseSwagger();
                //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BAM_API v1"));
            }

            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BAM_API v1"));

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
