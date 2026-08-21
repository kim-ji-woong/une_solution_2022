using dnsDBUtil;
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

namespace WishServer
{
    public class Startup
    {
        private ProcessManager m_processManager = null;

        private DirectDBManager m_dbManager = null;

        private static Config.ConfigManager m_configManager = new Config.ConfigManager();
        public static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
        }

        public Startup(IConfiguration configuration)
        {
            //Configuration = configuration;
            m_configManager.ReadConfig(configuration);

            Logger.Instance.Write("Startup 실행");

            if (m_configManager.Site.DBType != null)
            {
                string strDBName = m_configManager.Site.DBName;
                int nDBType = (int)m_configManager.Site.DBType;
                string strDBID = m_configManager.Site.DBID;
                string strDBHost = m_configManager.Site.DBHost;
                string strDBPw = m_configManager.Site.DBPw;

                m_dbManager = new DirectDBManager(nDBType, strDBHost, strDBName, strDBID, strDBPw);
                m_processManager = new ProcessManager(m_dbManager);
            }
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            //services.AddControllers();
            services.AddControllersWithViews();

            if (m_processManager != null)
            {
                services.AddTransient<global::WishServer.ProcessManager>(service => m_processManager);
            }

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WishServer", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WishServer v1"));
            }

            app.UseRouting();

            // Cors Error 관련 설정
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
