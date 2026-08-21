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

namespace YH_SensorServer
{
    public class Startup
    {
        public static Model.DBConfig DBConfig = null;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            string strHost = Configuration["AppConfiguration:host"];
            string strDBName = Configuration["AppConfiguration:dbName"];
            string strConnection = Configuration["AppConfiguration:con"];

            int nIndex = strConnection.IndexOf('_');

            if (nIndex > 0)
            {
                string strID = strConnection.Substring(0, nIndex).Trim();
                string strPW = strConnection.Substring(nIndex + 1).Trim();

                DBConfig = new Model.DBConfig();

                DBConfig.Host = strHost;
                DBConfig.ID = strID;
                DBConfig.PW = strPW;
                DBConfig.DBName = strDBName;
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
