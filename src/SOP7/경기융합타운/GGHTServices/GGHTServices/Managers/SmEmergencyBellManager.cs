using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GGHTServices.Managers
{
    public class SmEmergencyBellManager
    {
        private BellInfoModel m_model = null;
        private dnsDapperDBUtil.Manager.WebDBManager m_dbManager = null;
        private dnsDapperDBUtil.DataAccessLayer.DAL.DataManager m_syswillDataManager = null;
        public SmEmergencyBellManager(BellInfoModel model, bool isAlarm)
        {
            m_dbManager = new dnsDapperDBUtil.Manager.WebDBManager(ConfigManager.DbType, ConfigManager.DbHost, ConfigManager.DbName, ConfigManager.DbID, ConfigManager.DbPw, null);
            m_syswillDataManager = new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(ConfigManager.SyswillDbType, ConfigManager.SyswillDbHost, ConfigManager.SyswillDbName, ConfigManager.SyswillDbID, ConfigManager.SyswillDbPw);

            m_model = model;
            ProcessData(isAlarm);
        }

        private void ProcessData(bool isAlarm)
        {
            SensorInfoModel sensor = FindSensor();
            if (sensor == null)
                return;

            ArrayList arrList = new ArrayList();
            arrList.Add(sensor.SensorType);
            arrList.Add(sensor.SensorTagInfoID);
            arrList.Add(sensor.SensorZoneID);
            arrList.Add(isAlarm);

            dnsCommunicateSopServer.SopQueryManager sopQueryManager = new dnsCommunicateSopServer.SopQueryManager(ConfigManager.SOPWebServerURL + "/api/etcSensor");
            sopQueryManager.SendAlarmQuery(arrList, "POST");

            SyswillProcessManager processManager = new SyswillProcessManager(m_syswillDataManager, m_dbManager);
            processManager.UpdateEmergencyBell(sensor.OrgSensorID, isAlarm);
        }

        public SensorInfoModel FindSensor()
        {            
            string strSQL = $@"select sz.ID sensorZoneID, sti.ID sensorTagInfoID, sensorType, sz.OrgSensorID sensorID
                                 from SdmsSensorZone sz
                                inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID
                                where sti.SensorServerID=(select id from SdmsSensorServerInfo where ServerType={(int)dnsSopID.ID.ServerTypes.EmergencyBell_Smcom})
                                  and sti.Description='{m_model.iphoneNm}'";
            
            dynamic result = m_dbManager.QueryFirst(strSQL, out string strErrMsg);
            if (result == null)
                return null;

            SensorInfoModel sensor = new SensorInfoModel()
            {
                SensorTagInfoID = result.sensorTagInfoID,
                SensorZoneID = result.sensorZoneID,
                SensorType = result.sensorType,
                OrgSensorID = result.sensorID
            };

            return sensor;
        }
    }

    public class BellInfoModel
    {
        public string iphoneNm { get; set; }
        public string sectnId { get; set; }
        public string empNo { get; set; }
        public string iphoneId { get; set; }
        public string iphoneSt { get; set; }
    }

    public class SensorInfoModel
    {
        public int SensorTagInfoID { get; set; }
        public int SensorZoneID { get; set; }
        public int SensorType { get; set; }
        public int OrgSensorID { get; set; }
    }
}
