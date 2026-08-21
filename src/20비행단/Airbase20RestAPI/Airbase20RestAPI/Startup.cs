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

namespace Airbase20RestAPI
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

            string strDBName = Configuration["Site:DBName"];
            string strDBType = Configuration["Site:DBType"];
            string strDBHost = Configuration["Site:DBHost"];
            string strDBID = Configuration["Site:DBID"];
            string strDBPw = Configuration["Site:DBPw"];

            int nDBType;

            if (int.TryParse(strDBType.Trim(), out nDBType) &&
                strDBHost.Trim().Length > 0 && strDBID.Trim().Length > 0 && strDBPw.Trim().Length > 0)
            {
                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                strDBHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDBHost, key);
                strDBID = dnsDBUtil.AES256Cipher.AES_decrypt(strDBID, key);
                strDBPw = dnsDBUtil.AES256Cipher.AES_decrypt(strDBPw, key);

                services.AddTransient<global::Airbase20.IDAL.IDataManager>(service => new global::Airbase20.DAL.DataManager(nDBType, strDBHost, strDBName, strDBID, strDBPw));
            }

            services.AddSwaggerGen(c =>
            {
                c.CustomSchemaIds(type => type.ToString());
                c.SwaggerDoc("Data", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Version = "Data",
                    Title = "데이터",
                    Description = "데이터를 위한 API"
                });

                //c.SwaggerDoc("WorkSpaceReport", new Microsoft.OpenApi.Models.OpenApiInfo
                //{
                //    Version = "WorkSpaceReport",
                //    Title = "사업장 보고서 관리",
                //    Description = "사업장 보고서 관리를 위한 API"
                //});

                //c.SwaggerDoc("Status", new Microsoft.OpenApi.Models.OpenApiInfo
                //{
                //    Version = "Status",
                //    Title = "상태보고서",
                //    Description = "상태 보고서 관리를 위한 API"
                //});

                //c.SwaggerDoc("Schedule", new Microsoft.OpenApi.Models.OpenApiInfo
                //{
                //    Version = "Schedule",
                //    Title = "일정관리",
                //    Description = "일정 관리를 위한 API"
                //});

                //c.SwaggerDoc("Notice", new Microsoft.OpenApi.Models.OpenApiInfo
                //{
                //    Version = "Notice",
                //    Title = "게시판/통계관리",
                //    Description = "게시판/통계 관리를 위한 API"
                //});

                //c.SwaggerDoc("DBManage", new Microsoft.OpenApi.Models.OpenApiInfo
                //{
                //    Version = "DBManage",
                //    Title = "DB관리",
                //    Description = "DB(관리 및 작업장, 위험성평가, 별지) 관리를 위한 API"
                //});

                //c.SwaggerDoc("Common", new Microsoft.OpenApi.Models.OpenApiInfo
                //{
                //    Version = "Common",
                //    Title = "공통/기타",
                //    Description = "공통/기타 API"
                //});

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

            // 정식버전에는 UseSwagger를 IsDevelopment 안에 넣어야함
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/Data/swagger.json", "데이터 API");
                //c.SwaggerEndpoint("/swagger/WorkSpaceReport/swagger.json", "사업장 보고서 관리 API");
                //c.SwaggerEndpoint("/swagger/Status/swagger.json", "상태 보고서 관리 API");
                //c.SwaggerEndpoint("/swagger/Schedule/swagger.json", "일정 관리 API");
                //c.SwaggerEndpoint("/swagger/Notice/swagger.json", "게시판/통계 관리 API");
                //c.SwaggerEndpoint("/swagger/DBManage/swagger.json", "DB관리 API");
                //c.SwaggerEndpoint("/swagger/Common/swagger.json", "공통/기타 API");

                c.DefaultModelsExpandDepth(-1);
            });

            app.UseSwagger(options =>
            {
                options.SerializeAsV2 = true;
            });

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
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
