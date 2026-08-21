using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.IO;
using System.Reflection;

namespace DbBackup
{
    class SettingManager
    {
        private class ServerSetting
        {
            public string DbIP { get; set; }
            public int DbType { get; set; }
            public string DbName { get; set; }
            public string DbID { get; set; }
            public string DbPW { get; set; }
            public string SOPWebServerFrontURL { get; set; }
        }

        private static string m_strSettingFileName = "setting.json";

        public static IDataManager LoadDataManager(out string strSopWebServerUrl)
        {
            strSopWebServerUrl = null;

            try
            {
                string strPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + "\\" + m_strSettingFileName;

                if (!File.Exists(strPath))
                    return null;

                return ReadSetting(strPath, out strSopWebServerUrl);
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
            }

            return null;
        }

        private static IDataManager ReadSetting(string strPath, out string strSopWebServerUrl)
        {
            ServerSetting serverSetting = null;

            using (StreamReader sr = new StreamReader(strPath))
            {
                string strJson = sr.ReadToEnd();
                serverSetting = Newtonsoft.Json.JsonConvert.DeserializeObject<ServerSetting>(strJson);
            }

            if (serverSetting != null)
            {
                strSopWebServerUrl = serverSetting.SOPWebServerFrontURL;
                serverSetting = DecryptServerSetting(serverSetting);
                return new DataManager(serverSetting.DbType, serverSetting.DbIP, serverSetting.DbName, serverSetting.DbID, serverSetting.DbPW);
            }

            strSopWebServerUrl = null;
            return null;
        }

        private static ServerSetting DecryptServerSetting(ServerSetting setting)
        {
            ServerSetting decryptSetting = new ServerSetting();

            decryptSetting.DbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbID);
            decryptSetting.DbName = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbName);
            decryptSetting.DbPW = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbPW);
            decryptSetting.DbIP = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbIP);

            decryptSetting.DbType = setting.DbType;

            return decryptSetting;
        }
    }
}
