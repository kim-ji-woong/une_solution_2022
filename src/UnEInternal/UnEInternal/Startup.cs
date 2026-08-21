using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Vacation.IDAL;
using Vacation.DAL;
using Vacation.BLL;

namespace UnEInternal
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
            services.AddCors(o => o.AddPolicy("UnEPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            // 세션 사용
            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                options.IdleTimeout = System.TimeSpan.FromSeconds(10);
                /*options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;*/
            });
            ////////////////////////////////////////////////////

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            string strSiteID = Configuration["AppConfig:Site:ID"];
            string strDBName = Configuration["AppConfig:Site:DBName"];
            string strDBType = Configuration["AppConfig:Site:DBType"];
            string strWebServerURL = Configuration["AppConfig:Site:WebServerURL"];

            int nSiteID, nDBType;

            if (int.TryParse(strSiteID.Trim(), out nSiteID) && int.TryParse(strDBType.Trim(), out nDBType))
            {
                services.AddSingleton<IConfiguration>(Configuration);
                services.AddTransient<IDataManager>(service => new DataManager(strDBName, nDBType, nSiteID, strWebServerURL));
            }

            string strSystemMail = Configuration["AppConfig:Account:SystemMail"];
            string strNoticeMail = Configuration["AppConfig:Account:NoticeMail"];
            string strSystemCode = Configuration["AppConfig:Account:SystemCode"];
            string strURL = Configuration["AppConfig:Common:url"];

            ScheduleManager.SetSystemInfo(strSystemMail, strNoticeMail, strSystemCode, strURL);
            ScheduleManager.InitInstance(null, null);

            string strBeginWorkHour = Configuration["AppConfig:Common:beginWorkHour"];
            string strBeginWorkMinute = Configuration["AppConfig:Common:beginWorkMinute"];
            string strEndWorkHour = Configuration["AppConfig:Common:endWorkHour"];
            string strEndWorkMinute = Configuration["AppConfig:Common:endWorkMinute"];
            int nBeginWorkHour, nBeginWorkMinute, nEndWorkHour, nEndWorkMinute;

            if (strBeginWorkHour != null && strBeginWorkMinute != null && strEndWorkHour != null && strEndWorkMinute != null &&
                int.TryParse(strBeginWorkHour, out nBeginWorkHour) && int.TryParse(strBeginWorkMinute, out nBeginWorkMinute) &&
                int.TryParse(strEndWorkHour, out nEndWorkHour) && int.TryParse(strEndWorkMinute, out nEndWorkMinute))
            {
                VacationManager.SetWorkTimes(nBeginWorkHour, nBeginWorkMinute, nEndWorkHour, nEndWorkMinute);
            }

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
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
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
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
