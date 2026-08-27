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

        // JWT(WonikBeaconServer 토큰) 설정. Secret 은 BeaconServer 와 동일해야 한다.
        private string m_strAuthSecret = "";
        private string m_strAuthIssuer = "WebSOPApp";
        private string m_strAuthAudience = "WonikBeaconServer";
        private int m_nAuthExpireMinutes = 10080;   // 7일

        public string AuthSecret { get { return m_strAuthSecret; } }
        public string AuthIssuer { get { return m_strAuthIssuer; } }
        public string AuthAudience { get { return m_strAuthAudience; } }
        public int AuthExpireMinutes { get { return m_nAuthExpireMinutes; } }

        public void ReadConfig(IConfiguration config)
        {
            JToken json = GetJson(config, "Options");

            if (json != null)
            {
                m_strLoginOption = json.ToString().Replace("\r\n", "");

                if (json["ui"] != null && json["ui"]["useWorkerInfo"] != null)
                    bool.TryParse(json["ui"]["useWorkerInfo"].ToString(), out m_bUseWorkerInfo);
            }

            var auth = config.GetSection("Auth");
            if (auth != null)
            {
                if (!string.IsNullOrEmpty(auth["Secret"])) m_strAuthSecret = auth["Secret"];
                if (!string.IsNullOrEmpty(auth["Issuer"])) m_strAuthIssuer = auth["Issuer"];
                if (!string.IsNullOrEmpty(auth["Audience"])) m_strAuthAudience = auth["Audience"];
                int em;
                if (int.TryParse(auth["ExpireMinutes"], out em) && em > 0) m_nAuthExpireMinutes = em;
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
