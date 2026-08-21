using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System.IO;

namespace WebSOPApp.Config
{
    public class ConfigManager
    {
        private Site m_site = new Site();
        private string m_strJson = null;

        public Site Site
        {
            get { return m_site; }
        }

        public string LoginOption
        {
            get { return m_strJson; }
            set { m_strJson = value; }
        }

        public bool IsSopAlone { get; set; }

        public void ReadConfig(IConfiguration config)
        {
            JToken json = GetJson(config, "Options");

            if (json != null)
                m_strJson = json.ToString().Replace("\r\n", "");

            m_site.ReadConfig(config);
        }

        private JToken GetJson(IConfiguration config, string strPath)
        {
            string strFilePath = "./appsettings.json";

            if (File.Exists(strFilePath))
            {
                System.IO.StreamReader reader = new System.IO.StreamReader("./appsettings.json");
                string strJson = reader.ReadToEnd();
                reader.Close();

                JObject json = JObject.Parse(strJson);
                return json.GetValue(strPath);
            }

            return null;
        }
    }
}
