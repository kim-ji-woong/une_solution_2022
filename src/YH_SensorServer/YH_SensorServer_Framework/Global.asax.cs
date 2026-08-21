using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace YH_SensorServer_Framework
{
    using Models;

    public class WebApiApplication : System.Web.HttpApplication
    {
        public static DBConfig DBConfig = null;

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            string strHost = System.Configuration.ConfigurationManager.AppSettings["host"];
            string strDBName = System.Configuration.ConfigurationManager.AppSettings["dbName"];
            string strConnection = System.Configuration.ConfigurationManager.AppSettings["con"];

            int nIndex = strConnection.IndexOf('_');

            if (nIndex > 0)
            {
                string strID = strConnection.Substring(0, nIndex).Trim();
                string strPW = strConnection.Substring(nIndex + 1).Trim();

                DBConfig = new DBConfig();

                DBConfig.Host = strHost;
                DBConfig.ID = strID;
                DBConfig.PW = strPW;
                DBConfig.DBName = strDBName;
            }
        }
    }
}
