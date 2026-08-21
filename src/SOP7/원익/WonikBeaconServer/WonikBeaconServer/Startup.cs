using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
            services.AddCors(o => o.AddPolicy("UnEPolicy", builder =>
            {
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
            }

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/Beacon/swagger.json", "Beacon 데이터 API");

                c.DefaultModelsExpandDepth(-1);
            });

            app.UseSwagger(options =>
            {
                options.SerializeAsV2 = true;
            });

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                // Areas 경로
                endpoints.MapControllerRoute(
                    name: "Beacon",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseAuthorization();

            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //});
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
