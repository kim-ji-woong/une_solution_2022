using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsCommunicateSopServer;
using System.Threading.Tasks;

namespace IntegrationServer.Servers.EmergencyBell.MPia
{
    public class MPiaAlarmManager
    {
        //private Dictionary<int, Sensor> m_dicAlarmSensors = new Dictionary<int, Sensor>();
        //private DataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;

        public MPiaAlarmManager(/*DataManager dataManager, */string strSOPWebServerURL)
        {
            //m_dataManager = dataManager;
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);
        }

        // 서버가 동작하기 이전에 발생했던 알람을 읽어온다.
        /*public void SetPrevAlarms(List<Sensor> sensors)
        {
            Sensor alarmSensor;
            DateTime dtNow = DateTime.Now;

            foreach (Sensor sensor in sensors)
            {
                if (m_dicAlarmSensors.TryGetValue(sensor.No, out alarmSensor))
                    alarmSensor.AlarmTime = dtNow;
                else
                {
                    sensor.AlarmTime = dtNow;
                    m_dicAlarmSensors[sensor.No] = sensor;
                }
            }
        }*/

        public void SendAlarm(Sensor sensor)
        {
            ArrayList arrDatas = new ArrayList();

            arrDatas.Add(MPiaSensorManager.EmergencyBellSensorType);
            //arrDatas.Add((int)dnsData.Sensor.Facility.FacilityType.ETC);
            arrDatas.Add(sensor.SensorTagInfoID);
            arrDatas.Add(sensor.SensorZoneID);
            arrDatas.Add(true);

            // 기타 센서의 경우 2단계 알람으로 설정
            arrDatas.Add(2);

            System.Diagnostics.Trace.WriteLine("SendAlarm : " + ArrayToString(arrDatas));
            m_sopQueryManager.SendAlarmQuery(arrDatas, "POST");
        }

        string ArrayToString(ArrayList arrDatas)
        {
            string strDatas = "";

            foreach (object obj in arrDatas)
            {
                if (strDatas.Length == 0)
                    strDatas = obj.ToString();
                else
                    strDatas += "," + obj.ToString();
            }

            return strDatas;
        }
    }
}
