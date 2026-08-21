using dnsDapperDBUtil.DataAccessLayer.DAL;
using SenkoPSMServer.ViewModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SenkoPSMServer.Modbus
{
    public class ModbusManager
    {
        private DataManager m_dataManager = null;
        public DataManager DataManager { get { return m_dataManager; } }

        private List<ClientProvider> providers = null;

        private bool m_bIsStart = false;

        private string m_strAlarmURL = null;
        public string AlarmURL
        {
            get { return m_strAlarmURL; }
        }

        public ModbusManager(DataManager dataManager)
        {
            m_dataManager = dataManager;

            Init();
        }

        public void Start()
        {
            if (m_bIsStart == false)
            {
                if (providers == null)
                {
                    Logger.Instance.Write("[ERROR] ModbusManager Start Error : 셋팅된 ClientProvider 정보가 없습니다.");
                    return;
                }

                foreach (ClientProvider provider in providers)
                {
                    provider.Start();
                }

                m_bIsStart = true;
            }
        }

        public void Stop()
        {
            if (m_bIsStart == true)
            {
                if (providers != null)
                {
                    foreach (ClientProvider provider in providers)
                    {
                        provider.Stop();
                    }
                }
               
                m_bIsStart = false;
            }
        }

        private void Init()
        {
            string strAlarmURL = ConfigurationManager.AppSettings.Get("AlarmURL");
            if (strAlarmURL == null || strAlarmURL.Length == 0)
                strAlarmURL = "http://127.0.0.1:44379/api/EnvironmentSensor";

            m_strAlarmURL = strAlarmURL;

            // 셋팅값 불러오기
            List<SenkoSensorData> senkoSensors = InitSensors();

            if (LoadDBSensors(senkoSensors, out string strErrorMessage) == false)
            {
                Logger.Instance.Write("[ERROR] Init Error : " + strErrorMessage);
                return;
            }


            // 센서 데이터를 각각의 ClientProvider 전달
            foreach (SenkoSensorData senkoSensor in senkoSensors)
            {
                ClientProvider provider = new ClientProvider(this, senkoSensor);

                if (providers == null)
                    providers = new List<ClientProvider>();

                providers.Add(provider);
            }
        }

        private List<SenkoSensorData> InitSensors()
        {
            List<SenkoSensorData> senkoSensors = new List<SenkoSensorData>();

            string strSensor1_IP = ConfigurationManager.AppSettings.Get("Sensor1_IP");
            if (strSensor1_IP == null || strSensor1_IP.Length == 0)
                strSensor1_IP = "192.168.0.1";

            string strSensor1_Port = ConfigurationManager.AppSettings.Get("Sensor1_Port");
            if (strSensor1_Port == null || strSensor1_Port.Length == 0)
                strSensor1_Port = "50";

            string strSensor1_UniqueKey = ConfigurationManager.AppSettings.Get("Sensor1_UniqueKey");
            if (strSensor1_UniqueKey == null || strSensor1_UniqueKey.Length == 0)
                strSensor1_UniqueKey = "SenkoSensor_1";

            string strSensor2_IP = ConfigurationManager.AppSettings.Get("Sensor2_IP");
            if (strSensor2_IP == null || strSensor2_IP.Length == 0)
                strSensor2_IP = "192.168.0.2";

            string strSensor2_Port = ConfigurationManager.AppSettings.Get("Sensor2_Port");
            if (strSensor2_Port == null || strSensor2_Port.Length == 0)
                strSensor2_Port = "50";

            string strSensor2_UniqueKey = ConfigurationManager.AppSettings.Get("Sensor2_UniqueKey");
            if (strSensor2_UniqueKey == null || strSensor2_UniqueKey.Length == 0)
                strSensor2_UniqueKey = "SenkoSensor_2";

            int nSensor1_Port = 50, nSensor2_Port = 50;
            int.TryParse(strSensor1_Port.Trim(), out nSensor1_Port);
            int.TryParse(strSensor2_Port.Trim(), out nSensor2_Port);

            SenkoSensorData senkoSensor1 = new SenkoSensorData();
            senkoSensor1.IP = strSensor1_IP;
            senkoSensor1.Port = nSensor1_Port;
            senkoSensor1.UniqueKey = strSensor1_UniqueKey;

            SenkoSensorData senkoSensor2 = new SenkoSensorData();
            senkoSensor2.IP = strSensor2_IP;
            senkoSensor2.Port = nSensor2_Port;
            senkoSensor2.UniqueKey = strSensor2_UniqueKey;

            senkoSensors.Add(senkoSensor1);
            senkoSensors.Add(senkoSensor2);

            return senkoSensors;
        }

        private bool LoadDBSensors(List<SenkoSensorData> senkoSensors, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (senkoSensors == null || senkoSensors.Count == 0)
            {
                strErrorMessage = "1. LoadDBSensors Error: 불러올 센서 데이터가 없습니다.";
                return false;
            }

            string strUniqueKeys = null;

            foreach (SenkoSensorData senkoSensor in senkoSensors)
            {
                if (senkoSensor.UniqueKey == null || senkoSensor.UniqueKey == "")
                    continue;

                if (strUniqueKeys == null)
                    strUniqueKeys = $"'{senkoSensor.UniqueKey}'";
                else
                    strUniqueKeys += $",'{senkoSensor.UniqueKey}'";

            }

            if (strUniqueKeys == null)
            {
                strErrorMessage = "2. LoadDBSensors Error: 불러올 센서의 UniqueKey 데이터가 없습니다.";
                return false;
            }


            string strSQL = $@"
                        select psm.ID, psm.UniqueKey, sz.ID as SensorZoneID, tag.ID as TagInfoID
                          from SdmsSensorPSM psm
                         inner join SdmsSensorZone sz on sz.OrgSensorID = psm.ID 
                         inner join SdmsSensorTagInfo tag on tag.SensorZoneID = sz.ID 
                         where psm.UniqueKey in ({strUniqueKeys}) and sz.SensorType = {(int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR}";

            IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);
            if (dynamics == null)
            {
                strErrorMessage = "3. LoadDBSensors Error: (Join Select Fail : " + strErrorMessage + ")";
                return false;
            }

            foreach (var item in dynamics)
            {
                int? nID = item.ID;
                string strUniqueKey = item.UniqueKey;
                int? nSensorZoneID = item.SensorZoneID;
                int? nTagInfoID = item.TagInfoID;

                if (strUniqueKey != null)
                {
                    SenkoSensorData senkoSensor = senkoSensors.Find(x => x.UniqueKey == strUniqueKey);
                    if (senkoSensor != null)
                    {
                        senkoSensor.SensorID = nID;
                        senkoSensor.SensorZoneID = nSensorZoneID;
                        senkoSensor.TagInfoID = nTagInfoID;
                    }
                }                
            }

            return true;
        }
    }

    public class SenkoSensorData
    {
        public string IP { get; set; }
        public int Port { get; set; }
        public string UniqueKey { get; set; }

        public int? SensorID { get; set; }
        public int? SensorZoneID { get; set; }
        public int? TagInfoID { get; set; }

        private int m_nAlarmDepth = 0;
        public int AlarmDepth
        {
            get { return m_nAlarmDepth; }
            set { m_nAlarmDepth = value; }
        }
    }
}
