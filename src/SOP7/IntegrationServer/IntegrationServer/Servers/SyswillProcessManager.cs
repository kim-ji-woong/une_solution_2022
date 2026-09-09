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
        protected IDataManager m_syswillDataManager = null;
        private string m_strConfigFile = "syswill.txt";

        public SyswillProcessManager(IDataManager dataManager)
        {
            ReadFile(dataManager);
        }

        private bool ReadFile(IDataManager dataManager)
        {
            string strPath = System.Windows.Forms.Application.StartupPath + m_strConfigFile;

            if (File.Exists(strPath))
            {
                string strDbName = null, strDbHost = null, strDbId = null, strDbPw = null;
                int dbType = 0;
                StreamReader reader = new StreamReader(strPath, Encoding.UTF8);

                while (reader.EndOfStream == false)
                {
                    string strLine = reader.ReadLine().Trim();

                    if (strLine.Length == 0)
                        continue;

                    int index = strLine.IndexOf(':');

                    if (index < 0)
                        continue;

                    string strTagName = strLine.Substring(0, index).Trim().ToLower();
                    string strValue = strLine.Substring(index + 1).Trim();

                    if (strTagName == "dbhost")
                    {
                        if (strValue != null && strValue.Length > 0)
                            strDbHost = AES256Cipher.AES_decrypt(strValue);
                    }
                    else if (strTagName == "dbtype")
                    {
                        if (strValue != null && strValue.Length > 0)
                        {
                            int data;

                            if (int.TryParse(strValue, out data))
                                dbType = data;
                        }
                    }
                    else if (strTagName == "dbname")
                    {
                        if (strValue != null && strValue.Length > 0)
                            strDbName = AES256Cipher.AES_decrypt(strValue);
                    }
                    else if (strTagName == "dbid")
                    {
                        if (strValue != null && strValue.Length > 0)
                            strDbId = AES256Cipher.AES_decrypt(strValue);
                    }
                    else if (strTagName == "dbpw")
                    {
                        if (strValue != null && strValue.Length > 0)
                            strDbPw = AES256Cipher.AES_decrypt(strValue);
                    }
                }

                reader.Close();

                if (strDbId == null || strDbId.Length == 0)
                    strDbId = dataManager.GetDBManager().DbID;

                if (strDbPw == null || strDbPw.Length == 0)
                    strDbPw = dataManager.GetDBManager().DbPw;

                if (strDbName == null || strDbHost == null)
                    return false;

                m_syswillDataManager = new DataManager(dbType, strDbHost, strDbName, strDbId, strDbPw);
                return true;
            }

            return false;
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
            if (m_syswillDataManager == null)
                return false;

            string strErrorMessage;
            string strUniqueKey = GetEmergencyBellUniqueKey(sensorID, dataManager, out strErrorMessage);

            if (strUniqueKey == null)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill EmergencyBell update Error] : " + strErrorMessage);
                return false;
            }

            Dictionary<ViewModels.Syswill.Model.EmergencyBell.Fields, object> dicSets = new Dictionary<ViewModels.Syswill.Model.EmergencyBell.Fields, object>();

            dicSets[ViewModels.Syswill.Model.EmergencyBell.Fields.type] = isIts ? "0" : "1";
            dicSets[ViewModels.Syswill.Model.EmergencyBell.Fields.status] = isAlarm ? "1" : "0";
            dicSets[ViewModels.Syswill.Model.EmergencyBell.Fields.uptime] = DateTime.Now;

            string strCondition = string.Format("{0} = '{1}'", ViewModels.Syswill.Model.EmergencyBell.Fields.uniqueid, strUniqueKey);

            if (m_syswillDataManager.GetUpdate().Update<ViewModels.Syswill.Model.EmergencyBell, ViewModels.Syswill.Model.EmergencyBell.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill EmergencyBell update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        private string GetEmergencyBellUniqueKey(int sensorID, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", ETC.Fields.ID, sensorID);
            ETC sensor = dataManager.GetSelect().SelectFirst<ETC>(strCondition, out strErrorMessage);

            if (sensor == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = string.Format("{0}에 해당하는 비상벨 센서를 찾을수 없습니다.", sensorID);

                return null;
            }

            return sensor.UniqueKey;
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
