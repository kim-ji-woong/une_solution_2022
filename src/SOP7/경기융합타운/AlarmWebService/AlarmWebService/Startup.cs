using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmWebService
{
    public class Startup
    {
        private static Config.ConfigManager m_configManager = new Config.ConfigManager();

        static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }

        }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            m_configManager.ReadConfig(configuration);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            if (m_configManager.Database.DBType != null)
            {
                string strDBName = m_configManager.Database.DBName;
                int nDBType = (int)m_configManager.Database.DBType;
                string strDbID = m_configManager.Database.DbID;
                string strDbHost = m_configManager.Database.DbHost;
                string strDbPW = m_configManager.Database.DbPw;

                DataManager dataManager = new DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW);

                services.AddTransient<IDataManager>(service => new DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW));
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
