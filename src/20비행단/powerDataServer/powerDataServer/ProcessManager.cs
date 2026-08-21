using Airbase20.DAL;
using dnsDBUtil;
using powerDataServer.Data;
using powerDataServer.Network;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace powerDataServer
{
    public class ProcessManager
    {
        private DataManager m_dataManager = null;
        private PowerDataManager m_powerDataManager = null;
        private ModbusManager m_modbusManager = null;

        public ProcessManager()
        {
            Init();
        }

        public void Start()
        {
            m_modbusManager.Start();
        }

        public void Stop()
        {
            m_modbusManager.Stop();
        }

        private void Init()
        {
            string strDBName = ConfigurationManager.AppSettings.Get("DB_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "Airbase20";

            string strDBType = ConfigurationManager.AppSettings.Get("DB_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "0";

            string strDBHost = ConfigurationManager.AppSettings.Get("DB_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "AwVB0IrUXAghp5PlaWuqWg==";

            string strDBId = ConfigurationManager.AppSettings.Get("DB_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "GUk6cJACqVBoIFh7ny7mqQ==";

            string strDBPw = ConfigurationManager.AppSettings.Get("DB_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "SezOwMM9A2mIbUk5DCW/eQ==";


            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim(), key);
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim(), key);
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim(), key);

            int nDBType;
            int.TryParse(strDBType.Trim(), out nDBType);

            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw);

            m_powerDataManager = new PowerDataManager(m_dataManager);

            m_modbusManager = new ModbusManager(m_dataManager, m_powerDataManager);

        }
    }
}
