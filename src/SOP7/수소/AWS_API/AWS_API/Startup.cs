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

namespace AWS_API
{
    public class Startup
    {
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

            m_processManager = new ProcessManager();
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

            services.AddSwaggerGen(c =>
            {
                //c.SwaggerDoc("v1", new OpenApiInfo { Title = "AWS_API", Version = "v1" });
                c.SwaggerDoc("KETI", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "KETI",
                    Title = "KETI 연동 API",
                    Description = "KETI 연동을 위한 API"
                });

                c.SwaggerDoc("UNE", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "UNE",
                    Title = "UNE 연동 API",
                    Description = "UNE 연동을 위한 API"
                });

                c.SwaggerDoc("KGS", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "KGS",
                    Title = "KGS 연동 API",
                    Description = "KGS 연동을 위한 API"
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
                //app.UseSwagger();
                //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AWS_API v1"));
            }

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/KETI/swagger.json", "KETI 연동 API");                
                c.SwaggerEndpoint("/swagger/KGS/swagger.json", "KGS 연동 API");
                c.SwaggerEndpoint("/swagger/UNE/swagger.json", "UNE 연동 API");

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
                //endpoints.MapControllers();
                // Areas 경로
                endpoints.MapControllerRoute(
                    name: "KETI",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseAuthorization();
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
