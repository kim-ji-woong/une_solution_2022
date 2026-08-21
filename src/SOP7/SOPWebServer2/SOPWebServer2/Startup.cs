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
                }
            }
        }

        /// <summary>
        /// MainManager를 기동 시점에 미리 만들어 둔다.
        ///
        /// MainManager 생성자는 센서·구역·직원 정보를 전부 DB에서 읽는 무거운 작업인데,
        /// 이걸 컨트롤러 생성자에서 하기 때문에 그동안 "앱 기동 후 첫 신호"가 그 비용을 떠안았다.
        /// 초기화가 실패하면 그 첫 신호는 500으로 사라졌다.
        ///
        /// 여기서 미리 만들어 두면 신호 처리 경로에서 초기화가 빠지고,
        /// 실패하더라도 사유가 로그에 남는다. (컨트롤러 생성자에서 터지면 아무 흔적이 없다)
        /// </summary>
        private void WarmUpMainManager(IApplicationBuilder app)
        {
            try
            {
                using (var scope = app.ApplicationServices.CreateScope())
                {
                    var sdmsDataManager = scope.ServiceProvider.GetService<global::SDMS.IDAL.IDataManager>();
                    var commonDataManager = scope.ServiceProvider.GetService<global::Common.IDAL.IDataManager>();
                    var teamDataManager = scope.ServiceProvider.GetService<global::TeamEditor.IDAL.IDataManager>();

                    if (sdmsDataManager == null || commonDataManager == null || teamDataManager == null)
                    {
                        global::SOPWebServer.BLL.Logger.Instance.Write("MainManager 사전 초기화 건너뜀 : DB 설정이 없습니다.");
                        return;
                    }

                    System.Diagnostics.Stopwatch stopwatch = System.Diagnostics.Stopwatch.StartNew();
                    global::SOPWebServer.BLL.MainManager.GetMainManager(sdmsDataManager, commonDataManager, teamDataManager);
                    stopwatch.Stop();

                    global::SOPWebServer.BLL.Logger.Instance.Write("MainManager 사전 초기화 완료 : " + stopwatch.ElapsedMilliseconds.ToString() + " ms");
                }
            }
            catch (System.Exception ex)
            {
                // 여기서 예외를 밖으로 던지면 앱 기동 자체가 실패한다.
                // 사전 초기화가 실패해도 첫 요청에서 다시 시도되므로 로그만 남기고 계속 진행한다.
                global::SOPWebServer.BLL.Logger.Instance.Write("MainManager 사전 초기화 실패(첫 요청에서 재시도됨) : " + ex.ToString());
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            WarmUpMainManager(app);

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
