using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System.IO;

namespace WebSOPApp.Config
{
    public class ConfigManager
    {
        private Site m_site = new Site();
        private string m_strLoginOption = null;

        public Site Site
        {
            get { return m_site; }
        }

        public string LoginOption
        {
            get { return m_strLoginOption; }
            set { m_strLoginOption = value; }
        }

        private bool m_bUseWorkerInfo = false;
        public bool UseWorkerInfo { get { return m_bUseWorkerInfo; } set { m_bUseWorkerInfo = value; } }

        public void ReadConfig(IConfiguration config)
        {
            JToken json = GetJson(config, "Options");

            if (json != null)
            {
                m_strLoginOption = json.ToString().Replace("\r\n", "");

                if (json["ui"] != null && json["ui"]["useWorkerInfo"] != null)
                    bool.TryParse(json["ui"]["useWorkerInfo"].ToString(), out m_bUseWorkerInfo);
            }

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
