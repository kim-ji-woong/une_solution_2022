using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using IntegrationServer.ViewModels.Sdms;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static dnsSopID.ID;

namespace IntegrationServer.Managers
{
    public class SettingManager
    {
        private DataManager m_dataManager = null;
        public DataManager DataManager
        {
            get { return m_dataManager; }
            set { m_dataManager = value; }
        }
        
        private string m_strSettingFileName = "setting.json";

        public SettingManager()
        {
        }

        public SettingManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            m_dataManager = new DataManager(nDbType, strDbHost, strDbName, strDbID, strDbPw);
        }

        /// <summary>
        /// setting.json + DB 설정값 합치기
        /// </summary>
        /// <param name="serverSetting"></param>
        public void LoadServerInfoDB(ServerSetting serverSetting)
        {            
            //string strConditions = serverSetting.SiteID > 0 ? SensorServerInfo.Fields.SiteID + " = " + serverSetting.SiteID : "";

            string strError;
            IEnumerable<SensorServerInfo> serverInfos = m_dataManager.GetSelect().Select<SensorServerInfo>(null, out strError);
            if (serverInfos == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadServerInfoDB : " + strError);
                return;
            }
            
            if (serverInfos.ToList().Count > 0)
            {
                // DB ID가 우선이기 때문에 setting.json에 입력된 SeqNo는 날린 후 마지막에 DB MaxID를 SeqNo로 넣어준다
                foreach (var item in serverSetting.ServerDatas)
                    item.SeqNo = -1;

                int nMaxID = 0;

                List<SensorServerInfo> addSetting = new List<SensorServerInfo>();
                foreach (var dbData in serverInfos)
                {
                    bool bHave = false;
                    foreach (var settingData in serverSetting.ServerDatas)
                    {
                        string strIP1 = dbData.IP == null ? "" : dbData.IP.Trim();
                        string strIP2 = settingData.IP == null ? "" : settingData.IP.Trim();
                        // 서버종류, 서버IP가 같으면 같은 서버로 인식한다
                        if (dbData.ServerType == settingData.ServerType && strIP1 == strIP2 && dbData.Place.Trim() == settingData.ServerAlias?.Trim())
                        {
                            settingData.SeqNo = dbData.ID;
                            settingData.IP = dbData.IP;
                            settingData.Port = dbData.Port == null ? 0 : (int)dbData.Port;
                            settingData.SOPWebServerURL = dbData.SOPWebServerURL == null ? "" : dbData.SOPWebServerURL;
                            settingData.Use = dbData.bUse == null ? false : (bool)dbData.bUse;
                            settingData.SiteID = dbData.SiteID != null ? (int)dbData.SiteID : 0;
                            settingData.ServerAlias = dbData.Place;
                            bHave = true;
                            break;
                        }
                    }

                    if (!bHave)
                        addSetting.Add(dbData);

                    nMaxID = Math.Max(nMaxID, dbData.ID);
                }

                foreach (var item in addSetting)
                {
                    serverSetting.ServerDatas.Add(new ServerData()
                    {
                        SeqNo = item.ID,
                        IP = item.IP,
                        Port = item.Port == null ? 0 : (int)item.Port,
                        ServerType = item.ServerType == null ? (int)ServerTypes.None : (int)item.ServerType,
                        SOPWebServerURL = item.SOPWebServerURL,
                        Use = item.bUse == null ? false : (bool)item.bUse,
                        ServerName = item.ServerType == null ? GetServerText(ServerTypes.None) : GetServerText((ServerTypes)item.ServerType),
                        ServerProperties = new Dictionary<ServerProperty, object>(),
                        ServerAlias = item.Place,
                        SiteID = item.SiteID == null ? 0 : item.SiteID.Value
                    });
                }

                foreach (var item in serverSetting.ServerDatas)
                {
                    if (item.SeqNo < 0)
                        item.SeqNo = ++nMaxID;
                }
            }
        }

        public ServerSetting LoadSetting()
        {
            try
            {
                string strPath = Application.StartupPath + m_strSettingFileName;
                if (!File.Exists(strPath))
                    CreateSetting();

                return ReadSetting();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return null;
            }
        }

        private ServerSetting CreateSetting()
        {
            // 설정 양식 세팅
            ServerSetting serverSetting = new ServerSetting();
            serverSetting.DbIP = "";
            serverSetting.DbType = 0;
            serverSetting.DbName = "";
            serverSetting.DbID = "";
            serverSetting.DbPW = "";
            serverSetting.LogPath = "";
            serverSetting.SOPWebServerFrontURL = "";

            List<ServerData> serverDatas = new List<ServerData>();
            serverSetting.ServerDatas = serverDatas;
            
            string strPath = Application.StartupPath + m_strSettingFileName;
            using (File.Create(strPath))
            {
            }

            File.WriteAllText(strPath, Newtonsoft.Json.JsonConvert.SerializeObject(serverSetting));

            return serverSetting;
        }

        public ServerSetting ReadDBInfo()
        {
            string strPath = Application.StartupPath + m_strSettingFileName;
            if (File.Exists(strPath))
            {
                using (StreamReader sr = new StreamReader(strPath))
                {
                    using (JsonTextReader jr = new JsonTextReader(sr))
                    {
                        JObject json = (JObject)JToken.ReadFrom(jr);
                        
                        ServerSetting setting = new ServerSetting();
                        setting.DbIP = json["DbIP"].ToString();
                        setting.DbType = (int)json["DbType"];
                        setting.DbName = json["DbName"].ToString();
                        setting.DbID = json["DbID"].ToString();
                        setting.DbPW = json["DbPW"].ToString();
                        setting.LogPath = json["LogPath"].ToString();
                        setting.SOPWebServerFrontURL = json["SOPWebServerFrontURL"].ToString();

                        setting = DecryptServerSetting(setting);
                        return setting;
                    }
                }
            }
            else
                return CreateSetting();
        }

        private ServerSetting ReadSetting()
        {
            ServerSetting serverSetting = null;

            string strPath = Application.StartupPath + m_strSettingFileName;
            using (StreamReader sr = new StreamReader(strPath))
            {
                string strJson = sr.ReadToEnd();
                serverSetting = Newtonsoft.Json.JsonConvert.DeserializeObject<ServerSetting>(strJson);                
            }

            if (serverSetting == null)
            {
                serverSetting = new ServerSetting();
                serverSetting.ServerDatas = new List<ServerData>();
            }

            serverSetting = DecryptServerSetting(serverSetting);

            if (serverSetting.DbIP?.Length > 0 && serverSetting.DbType >= 0 && serverSetting.DbName?.Length > 0 && serverSetting.DbID?.Length > 0 && serverSetting.DbPW?.Length > 0)
            {
                m_dataManager = new DataManager(serverSetting.DbType, serverSetting.DbIP, serverSetting.DbName, serverSetting.DbID, serverSetting.DbPW);
                LoadServerInfoDB(serverSetting);
            }

            return serverSetting;
        }

        public bool SaveSetting(ServerSetting serverSetting, out string strError)
        {
            strError = null;
            try
            {
                bool result = SaveSettingDB(serverSetting, out strError);
                if (result)
                {
                    string strPath = Application.StartupPath + m_strSettingFileName;
                    using (File.Create(strPath))
                    {
                    }

                    File.WriteAllText(strPath, Newtonsoft.Json.JsonConvert.SerializeObject(EncryptServerSetting(serverSetting)));
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private ServerSetting DecryptServerSetting(ServerSetting setting)
        {
            ServerSetting decryptSetting = new ServerSetting();

            decryptSetting.DbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbID);
            decryptSetting.DbName = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbName);
            decryptSetting.DbPW = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbPW);
            decryptSetting.DbIP = dnsDapperDBUtil.AES256Cipher.AES_decrypt(setting.DbIP);

            decryptSetting.DbType = setting.DbType;
            decryptSetting.LogPath = setting.LogPath;
            decryptSetting.ServerDatas = setting.ServerDatas;
            decryptSetting.SOPWebServerFrontURL = setting.SOPWebServerFrontURL;

            return decryptSetting;
        }

        private ServerSetting EncryptServerSetting(ServerSetting setting)
        {
            ServerSetting encryptSetting = new ServerSetting();

            encryptSetting.DbID = dnsDapperDBUtil.AES256Cipher.AES_encrypt(setting.DbID);
            encryptSetting.DbName = dnsDapperDBUtil.AES256Cipher.AES_encrypt(setting.DbName);
            encryptSetting.DbPW = dnsDapperDBUtil.AES256Cipher.AES_encrypt(setting.DbPW);
            encryptSetting.DbIP = dnsDapperDBUtil.AES256Cipher.AES_encrypt(setting.DbIP);

            encryptSetting.DbType = setting.DbType;
            encryptSetting.LogPath = setting.LogPath;
            encryptSetting.ServerDatas = setting.ServerDatas;
            encryptSetting.SOPWebServerFrontURL = setting.SOPWebServerFrontURL;

            return encryptSetting;
        }

        private bool SaveSettingDB(ServerSetting serverSetting, out string strError)
        {
            IDataManager dataManager = m_dataManager.Clone();
            try
            {
                if (!dataManager.BeginBatch(out strError))
                    throw new ApplicationException(strError);
                                
                // SdmsSensorServerInfo 테이블 ID IDENTITY 사용 여부에 따른 조건
                // SdmsSensorServerInfo > 테이블은 ID IDENTITY 사용 안하는게 나을듯
                //if (serverSetting.SiteID == 10 || /*솔브레인*/
                //    serverSetting.SiteID == 12 || /*녹십자*/
                //    serverSetting.SiteID == 30 || serverSetting.SiteID == 31 || serverSetting.SiteID == 32 || serverSetting.SiteID == 33 || serverSetting.SiteID == 34 /*원익*/)
                {
                    List<int> seqNos = new List<int>();
                    List<SensorServerInfo> addServerInfos = new List<SensorServerInfo>();
                    foreach (var item in serverSetting.ServerDatas)
                    {
                        dynamic resultCnt = dataManager.GetSelect().SelectFirst($"select count(*) cnt from {SensorServerInfo.TableName} where ID={item.SeqNo}", out strError);
                        if (resultCnt == null)
                            throw new ApplicationException(strError);

                        int cnt = resultCnt.cnt;

                        if (cnt > 0)
                        {
                            SensorServerInfo serverInfo = new SensorServerInfo()
                            {
                                ID = item.SeqNo,
                                ServerType = item.ServerType,
                                Place = item.ServerAlias, // item.ServerAlias?.Length > 0 ? item.ServerAlias : GetServerText((ServerTypes)item.ServerType),
                                IP = item.IP,
                                Port = item.Port,
                                Status = null,
                                SOPWebServerURL = item.SOPWebServerURL,
                                bUse = item.Use,
                                SiteID = item.SiteID
                            };

                            if (!dataManager.GetUpdate().Update<SensorServerInfo>(serverInfo, "ID=" + item.SeqNo, out strError))
                                throw new ApplicationException(strError);
                        }
                        else
                        {
                            addServerInfos.Add(new SensorServerInfo()
                            {
                                ID = item.SeqNo,
                                ServerType = item.ServerType,
                                Place = item.ServerAlias, //item.ServerAlias?.Length > 0 ? item.ServerAlias : GetServerText((ServerTypes)item.ServerType),
                                IP = item.IP == null ? "" : item.IP,
                                Port = item.Port,
                                Status = null,
                                SOPWebServerURL = item.SOPWebServerURL,
                                bUse = item.Use,
                                SiteID = item.SiteID
                            });                            
                        }

                        seqNos.Add(item.SeqNo);
                    }

                    if (addServerInfos.Count > 0)
                    {
                        if (!dataManager.GetCreate().Insert<SensorServerInfo>(addServerInfos, out strError))
                            throw new ApplicationException(strError); 
                    }

                    //foreach (int seqNo in seqNos)
                    //{
                    //    if (!CheckDeleteServerInfo(DataManager, seqNo, out strError))
                    //        throw new ApplicationException(strError);
                    //}

                    string strConditions = "";
                    if (seqNos.Count > 0)
                        strConditions = $"ID not in ({string.Join(",", seqNos)})";

                    if (!dataManager.GetDelete().Delete<SensorServerInfo>(strConditions, out strError))
                        throw new ApplicationException(strError);

                    if (!dataManager.BatchCommit(out strError))
                        throw new ApplicationException(strError);

                    return true;
                }
            }
            catch (Exception ex)
            {
                dataManager.BatchRollback(out strError);
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "SaveSettingDB : " + ex.Message);
                strError = ex.Message;
                return false;
            }
        }

        public bool CheckDeleteServerInfo(int nSeqNo, out string strError)
        {
            return CheckDeleteServerInfo(m_dataManager, nSeqNo, out strError);
        }

        public bool CheckDeleteServerInfo(DataManager dataManager, int nSeqNo, out string strError)
        {
            try
            {
                dynamic useServerInfos = dataManager.GetSelect().SelectFirst($"select count(*) cnt from SdmsSensorTagInfo where SensorServerID={nSeqNo}", out strError);
                if (useServerInfos == null)
                    throw new ApplicationException(strError);

                int cnt = useServerInfos.cnt;
                if (cnt > 0)
                {
                    strError = $"[ERROR01] SeqNo : [{nSeqNo}] SensorTagInfo에 이미 링크된 서버정보는 삭제 할 수 없습니다";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                strError = ex.Message;
                return false;
            }
        }
    }
}
