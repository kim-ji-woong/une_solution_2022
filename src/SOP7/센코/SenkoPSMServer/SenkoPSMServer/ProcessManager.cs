using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using SenkoPSMServer.Modbus;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SenkoPSMServer
{
    public class ProcessManager
    {
        private DataManager m_dataManager = null;
        private ModbusManager m_modbusMgr = null;

        public ProcessManager()
        {
            Init();

            m_modbusMgr = new ModbusManager(m_dataManager);
        }

        public void Start()
        {
            m_modbusMgr.Start();
        }

        public void Stop()
        {
            m_modbusMgr.Stop();
        }

        private void Init()
        {
            string strDBName = ConfigurationManager.AppSettings.Get("DB_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "WSOP_17";

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
            
            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim());
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim());
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim());

            int nDBType;
            int.TryParse(strDBType.Trim(), out nDBType);

            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw);
        }
    }
}
