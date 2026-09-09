using dnsDapperDBUtil.Manager;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace GGHTServices
{
    public class SyswillProcessManager
    {
        protected IDataManager m_dataManager = null;
        private WebDBManager m_ownDbManager = null;

        public SyswillProcessManager(IDataManager dataManager, WebDBManager dbManager)
        {
            m_dataManager = dataManager;
            m_ownDbManager = dbManager;
        }

        public bool UpdateEmergencyBell(int sensorID, bool isAlarm)
        {
            string strErrorMessage;
            string strUniqueKey = GetEmergencyBellUniqueKey(sensorID, out strErrorMessage);

            if (strUniqueKey == null)
            {
                //logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill EmergencyBell update Error] : " + strErrorMessage);
                return false;
            }

            Dictionary<Models.EmergencyBell.Fields, object> dicSets = new Dictionary<Models.EmergencyBell.Fields, object>();

            dicSets[Models.EmergencyBell.Fields.type] = "1";
            dicSets[Models.EmergencyBell.Fields.status] = isAlarm ? "1" : "0";
            dicSets[Models.EmergencyBell.Fields.uptime] = DateTime.Now;

            string strCondition = string.Format("{0} = '{1}'", Models.EmergencyBell.Fields.uniqueid, strUniqueKey);

            if (m_dataManager.GetUpdate().Update<Models.EmergencyBell, Models.EmergencyBell.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                //logger.Write(LogTypes.Error, serverType, serverSeqNo, "[Syswill EmergencyBell update Error] : " + strErrorMessage);
                return false;
            }

            return true;
        }

        private string GetEmergencyBellUniqueKey(int sensorID, out string strErrorMessage)
        {
            string strSQL = string.Format("Select {0} from {1} where {2} = {3}",
                ETC.Fields.UniqueKey, ETC.TableName,
                ETC.Fields.ID, sensorID);

            dynamic result = m_ownDbManager.QueryFirst(strSQL, out strErrorMessage);

            if (result == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = string.Format("{0}에 해당하는 비상벨 센서를 찾을수 없습니다.", sensorID);

                return null;
            }

            return result.UniqueKey;
        }
    }
}
