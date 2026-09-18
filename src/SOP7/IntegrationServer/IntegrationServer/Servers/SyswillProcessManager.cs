using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using IntegrationServer.Servers.UPS.GG;
using IntegrationServer.ViewModels.Sdms.Sensor;
using dnsDapperDBUtil;
using Nipa.Model.Sdms.Sensor;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using static dnsSopID.ID;

namespace IntegrationServer.Servers
{
    public class SyswillProcessManager
    {
        // 이 서버의 SiteID에 해당하는 시스윌 DB. syswill.txt에 해당 사이트 설정이 없으면 null이며, 이때는 시스윌로 전송하지 않는다.
        protected IDataManager m_syswillDataManager = null;
        private string m_strConfigFile = "syswill.txt";

        // syswill.txt의 [SiteID] 섹션별 시스윌 DB
        private Dictionary<int, IDataManager> m_dicSyswillDataManagers = new Dictionary<int, IDataManager>();

        // [SiteID] 섹션이 없는 기존 형식의 syswill.txt일 때 모든 사이트가 함께 쓰는 시스윌 DB
        private IDataManager m_commonSyswillDataManager = null;

        public SyswillProcessManager(IDataManager dataManager, int nSiteID)
        {
            ReadFile(dataManager);
            m_syswillDataManager = GetSyswillDataManager(nSiteID);
        }

        // syswill.txt 형식
        //   [41] # 도청         <- 사이트별 섹션. '#' 뒤는 주석
        //   dbHost : ...
        //   dbType : 1
        //   dbName : ...
        //   dbId : ...
        //   dbPw : ...
        // [SiteID] 섹션이 하나도 없으면 기존 형식으로 보고 파일의 설정을 모든 사이트에 사용한다.
        private bool ReadFile(IDataManager dataManager)
        {
            string strPath = System.Windows.Forms.Application.StartupPath + m_strConfigFile;

            if (File.Exists(strPath) == false)
                return false;

            SyswillDbInfo commonInfo = new SyswillDbInfo();
            Dictionary<int, SyswillDbInfo> dicSiteInfos = new Dictionary<int, SyswillDbInfo>();
            SyswillDbInfo currentInfo = commonInfo;

            StreamReader reader = new StreamReader(strPath, Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine();

                // '#' 뒤는 주석
                int commentIndex = strLine.IndexOf('#');
                if (commentIndex >= 0)
                    strLine = strLine.Substring(0, commentIndex);

                strLine = strLine.Trim();

                if (strLine.Length == 0)
                    continue;

                if (strLine.StartsWith("[") && strLine.EndsWith("]"))
                {
                    int nSiteID;

                    if (int.TryParse(strLine.Substring(1, strLine.Length - 2).Trim(), out nSiteID))
                    {
                        currentInfo = new SyswillDbInfo();
                        dicSiteInfos[nSiteID] = currentInfo;
                    }
                    else
                        currentInfo = null;     // SiteID가 잘못된 섹션의 설정은 무시한다.

                    continue;
                }

                int index = strLine.IndexOf(':');

                if (index < 0 || currentInfo == null)
                    continue;

                string strTagName = strLine.Substring(0, index).Trim().ToLower();
                string strValue = strLine.Substring(index + 1).Trim();

                if (strValue.Length == 0)
                    continue;

                if (strTagName == "dbhost")
                    currentInfo.DbHost = AES256Cipher.AES_decrypt(strValue);
                else if (strTagName == "dbtype")
                {
                    int data;

                    if (int.TryParse(strValue, out data))
                        currentInfo.DbType = data;
                }
                else if (strTagName == "dbname")
                    currentInfo.DbName = AES256Cipher.AES_decrypt(strValue);
                else if (strTagName == "dbid")
                    currentInfo.DbId = AES256Cipher.AES_decrypt(strValue);
                else if (strTagName == "dbpw")
                    currentInfo.DbPw = AES256Cipher.AES_decrypt(strValue);
            }

            reader.Close();

            if (dicSiteInfos.Count > 0)
            {
                foreach (KeyValuePair<int, SyswillDbInfo> pair in dicSiteInfos)
                {
                    IDataManager syswillDataManager = CreateDataManager(pair.Value, dataManager);

                    if (syswillDataManager != null)
                        m_dicSyswillDataManagers[pair.Key] = syswillDataManager;
                }
            }
            else
                m_commonSyswillDataManager = CreateDataManager(commonInfo, dataManager);

            return m_dicSyswillDataManagers.Count > 0 || m_commonSyswillDataManager != null;
        }

        private IDataManager CreateDataManager(SyswillDbInfo info, IDataManager dataManager)
        {
            if (info.DbName == null || info.DbHost == null)
                return null;

            string strDbId = info.DbId;
            string strDbPw = info.DbPw;

            if (strDbId == null || strDbId.Length == 0)
                strDbId = dataManager.GetDBManager().DbID;

            if (strDbPw == null || strDbPw.Length == 0)
                strDbPw = dataManager.GetDBManager().DbPw;

            return new DataManager(info.DbType, info.DbHost, info.DbName, strDbId, strDbPw);
        }

        // SiteID에 해당하는 시스윌 DB를 찾는다. 해당 사이트 설정이 없으면 null
        protected IDataManager GetSyswillDataManager(int? nSiteID)
        {
            if (m_commonSyswillDataManager != null)
                return m_commonSyswillDataManager;

            IDataManager syswillDataManager;

            if (nSiteID != null && m_dicSyswillDataManagers.TryGetValue((int)nSiteID, out syswillDataManager))
                return syswillDataManager;

            return null;
        }

        // 서버가 시스윌 설정에 없는 SiteID(예: 0)로 등록된 경우, 센서가 속한 사이트로 시스윌 DB를 다시 정한다.
        protected void SetSyswillSiteID(int nSiteID)
        {
            m_syswillDataManager = GetSyswillDataManager(nSiteID);
        }

        private class SyswillDbInfo
        {
            public int DbType { get; set; }
            public string DbHost { get; set; }
            public string DbName { get; set; }
            public string DbId { get; set; }
            public string DbPw { get; set; }
        }

        protected bool UpdateFire(int tagNo, bool isAlarm, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            if (m_syswillDataManager == null)
                return false;

            Dictionary<ViewModels.Syswill.Model.Fire.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.Fire.Fields, object>();
            dicSets[ViewModels.Syswill.Model.Fire.Fields.val] = isAlarm ? "1" : "0";
            dicSets[ViewModels.Syswill.Model.Fire.Fields.uptime] = DateTime.Now;

            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", ViewModels.Syswill.Model.Fire.Fields.fire_id, tagNo);
            
            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.Fire, ViewModels.Syswill.Model.Fire.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Fire update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        protected bool UpdateUps(int ups1, int ups2, int ups3, int ups4, int ups5, int ups6, int ups1Value, int ups2Value, int ups3Value, int ups4Value, int ups5Value, int ups6Value, int alarmDepth, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            if (m_syswillDataManager == null)
                return false;

            Dictionary<ViewModels.Syswill.Model.Ups.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.Ups.Fields, object>();

            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups1] = GetUpsValue(ups1);
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups2] = GetUpsValue(ups2);
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups3] = GetUpsValue(ups3);
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups4] = GetUpsValue(ups4);
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups5] = GetUpsValue(ups5);
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups6] = GetUpsValue(ups6);

            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups1_val] = ups1Value;
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups2_val] = ups2Value;
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups3_val] = ups3Value;
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups4_val] = ups4Value;
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups5_val] = ups5Value;
            dicSets[ViewModels.Syswill.Model.Ups.Fields.ups6_val] = ups6Value;

            dicSets[ViewModels.Syswill.Model.Ups.Fields.uptime] = DateTime.Now;
            dicSets[ViewModels.Syswill.Model.Ups.Fields.alarm_depth] = alarmDepth;

            string strErrorMessage;

            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.Ups, ViewModels.Syswill.Model.Ups.Fields>(dicSets, null, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Ups update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        private int GetUpsValue(int ups)
        {
            if (ups == UpsGGManager.BLACKOUT_STATE)
                return 1;
            else if (ups == UpsGGManager.BLACKOUT_BYPASS)
                return 2;

            return 0;
        }

        protected bool UpdateSubmerge(int value, int alarmDepth, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            if (m_syswillDataManager == null)
                return false;

            Dictionary<ViewModels.Syswill.Model.Submerge.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.Submerge.Fields, object>();

            dicSets[ViewModels.Syswill.Model.Submerge.Fields.val] = value;
            dicSets[ViewModels.Syswill.Model.Submerge.Fields.uptime] = DateTime.Now;
            dicSets[ViewModels.Syswill.Model.Submerge.Fields.alarm_depth] = alarmDepth;

            string strErrorMessage;

            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.Submerge, ViewModels.Syswill.Model.Submerge.Fields>(dicSets, null, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Submerge update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        protected bool UpdateEmergencyBell(int sensorID, bool isIts, IDataManager dataManager, bool isAlarm, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            // 시스윌 설정이 전혀 없으면 센서 조회도 하지 않는다.
            if (m_commonSyswillDataManager == null && m_dicSyswillDataManagers.Count == 0)
                return false;

            string strErrorMessage;
            EtcSensor sensor = GetEmergencyBellSensor(sensorID, dataManager, out strErrorMessage);

            if (sensor == null)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill EmergencyBell update Error] : " + strErrorMessage);
                return false;
            }

            // 비상벨 서버는 여러 사이트의 비상벨을 함께 처리할 수 있으므로(예: ITS 도청 + 신용보증재단) 센서가 속한 사이트의 시스윌 DB로 보낸다.
            IDataManager syswillDataManager = GetSyswillDataManager(sensor.SiteID) ?? m_syswillDataManager;

            if (syswillDataManager == null)
                return false;

            Dictionary<ViewModels.Syswill.Model.EmergencyBell.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.EmergencyBell.Fields, object>();

            dicSets[ViewModels.Syswill.Model.EmergencyBell.Fields.type] = isIts ? "0" : "1";
            dicSets[ViewModels.Syswill.Model.EmergencyBell.Fields.status] = isAlarm ? "1" : "0";
            dicSets[ViewModels.Syswill.Model.EmergencyBell.Fields.uptime] = DateTime.Now;

            string strCondition = string.Format("{0} = '{1}'", ViewModels.Syswill.Model.EmergencyBell.Fields.uniqueid, sensor.UniqueKey);

            if (syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.EmergencyBell, ViewModels.Syswill.Model.EmergencyBell.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill EmergencyBell update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        private EtcSensor GetEmergencyBellSensor(int sensorID, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", EtcSensor.Fields.ID, sensorID);
            EtcSensor sensor = dataManager.GetSelect().SelectFirst<EtcSensor>(strCondition, out strErrorMessage);

            if (sensor == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = string.Format("{0}에 해당하는 비상벨 센서를 찾을수 없습니다.", sensorID);

                return null;
            }

            return sensor;
        }

        protected bool UpdateDoor(string strUniqueKey, int zoneID, bool? isOpened, IDataManager dataManager, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            if (m_syswillDataManager == null)
                return false;

            string strErrorMessage;
            int? floorIndex = GetFloorIndex(zoneID, dataManager, out strErrorMessage);

            if (floorIndex == null)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Door update Error] : " + strErrorMessage);
                return false;
            }

            Dictionary<ViewModels.Syswill.Model.Door.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.Door.Fields, object>();

            if (isOpened == null)
                dicSets[ViewModels.Syswill.Model.Door.Fields.openStatus] = null;
            else
                dicSets[ViewModels.Syswill.Model.Door.Fields.openStatus] = (bool)isOpened ? "1" : "0";

            dicSets[ViewModels.Syswill.Model.Door.Fields.floorname] = (int)floorIndex;
            dicSets[ViewModels.Syswill.Model.Door.Fields.uptime] = DateTime.Now;

            string strCondition = string.Format("{0} = '{1}'", ViewModels.Syswill.Model.Door.Fields.deviceName, strUniqueKey);

            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.Door, ViewModels.Syswill.Model.Door.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Door update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        private int? GetFloorIndex(int zoneID, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", ViewModels.Sdms.Zone.Fields.ID, zoneID);
            ViewModels.Sdms.Zone zone = dataManager.GetSelect().SelectFirst<ViewModels.Sdms.Zone>(strCondition, out strErrorMessage);

            if (zone == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = string.Format("{0}에 해당하는 Zone을 찾을수 없습니다.", zoneID);

                return null;
            }

            if (zone.FloorIndex == null)
                return 0;

            return zone.FloorIndex;
        }

        protected bool UpdateBlackout(int volA, int volB, int volC, bool isAlarm, IDataManager dataManager, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            if (m_syswillDataManager == null)
                return false;

            string strErrorMessage;
            Dictionary<ViewModels.Syswill.Model.Blackout.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.Blackout.Fields, object>();

            dicSets[ViewModels.Syswill.Model.Blackout.Fields.vol_a] = volA;
            dicSets[ViewModels.Syswill.Model.Blackout.Fields.vol_b] = volB;
            dicSets[ViewModels.Syswill.Model.Blackout.Fields.vol_c] = volC;
            dicSets[ViewModels.Syswill.Model.Blackout.Fields.isAlarm] = isAlarm ? 1 : 0;
            dicSets[ViewModels.Syswill.Model.Blackout.Fields.uptime] = DateTime.Now;

            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.Blackout, ViewModels.Syswill.Model.Blackout.Fields>(dicSets, null, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Blackout update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        protected bool UpdateBlackoutF(float volA, float volB, float volC, bool isAlarm, IDataManager dataManager, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            if (m_syswillDataManager == null)
                return false;

            string strErrorMessage;
            Dictionary<ViewModels.Syswill.Model.BlackoutF.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.BlackoutF.Fields, object>();

            dicSets[ViewModels.Syswill.Model.BlackoutF.Fields.vol_a] = (double)volA;
            dicSets[ViewModels.Syswill.Model.BlackoutF.Fields.vol_b] = (double)volB;
            dicSets[ViewModels.Syswill.Model.BlackoutF.Fields.vol_c] = (double)volC;
            dicSets[ViewModels.Syswill.Model.BlackoutF.Fields.isAlarm] = isAlarm ? 1 : 0;
            dicSets[ViewModels.Syswill.Model.BlackoutF.Fields.uptime] = DateTime.Now;

            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.BlackoutF, ViewModels.Syswill.Model.BlackoutF.Fields>(dicSets, null, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill BlackoutF update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        protected bool UpdateElevator(string strUniqueID, int doorStatus, int floorIndex, int status, int direction, IDataManager dataManager, Logger logger, ServerTypes serverType, int serverSeqNo)
        {
            if (m_syswillDataManager == null)
                return false;

            // uniqueid가 비어 있으면 UPDATE가 0건으로 끝나 오류 없이 누락되므로 명시적으로 기록한다.
            if (string.IsNullOrEmpty(strUniqueID))
            {
                (logger ?? Logger.Instance).Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Elevator update Error] : 엘리베이터 호기명(uniqueid)이 비어 있습니다.");
                return false;
            }

            string strErrorMessage;
            Dictionary<ViewModels.Syswill.Model.Elevator.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.Elevator.Fields, object>();

            dicSets[ViewModels.Syswill.Model.Elevator.Fields.doorstatus] = doorStatus;
            dicSets[ViewModels.Syswill.Model.Elevator.Fields.floor] = floorIndex;
            dicSets[ViewModels.Syswill.Model.Elevator.Fields.status] = status;
            dicSets[ViewModels.Syswill.Model.Elevator.Fields.direction] = direction;
            dicSets[ViewModels.Syswill.Model.Elevator.Fields.uptime] = DateTime.Now;

            string strCondition = string.Format("{0} = '{1}'", ViewModels.Syswill.Model.Elevator.Fields.uniqueid, strUniqueID);

            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.Elevator, ViewModels.Syswill.Model.Elevator.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill Elevator update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }
    }
}
