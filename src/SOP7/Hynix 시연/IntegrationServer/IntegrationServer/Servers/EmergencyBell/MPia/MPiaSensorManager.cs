using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace IntegrationServer.Servers.EmergencyBell.MPia
{
    public class MPiaSensorManager
    {
        private DataManager m_dataManager = null;
        private string m_strSensorUniqueTag = "";
        // Key : Sensor 번호(ID가 아니다.)
        private Dictionary<int, Sensor> m_dicSensors = new Dictionary<int, Sensor>();

        public static int EmergencyBellSensorType
        {
            get { return 114; }
        }

        public MPiaSensorManager(DataManager dataManager, string strSensorUniqueTag)
        {
            m_dataManager = dataManager;
            m_strSensorUniqueTag = strSensorUniqueTag;
            ReadSensors();
        }

        public Sensor GetSensor(int sensorNo)
        {
            Sensor sensor;

            if (m_dicSensors.TryGetValue(sensorNo, out sensor))
                return sensor;

            return null;
        }

        private void ReadSensors()
        {
            Dictionary<int, Sensor> dicSensors = ReadEtcSensors();

            if (dicSensors != null)
            {
                if (ReadSensorZones(dicSensors))
                {
                    foreach (KeyValuePair<int, Sensor> pair in dicSensors)
                    {
                        m_dicSensors[pair.Value.No] = pair.Value;
                    }
                }
            }
        }

        private bool ReadSensorZones(Dictionary<int, Sensor> dicSensors)
        {
            string strSQL = "Select a.ID as SensorZoneID, b.ID as TagInfoID, a.OrgSensorID ";
            strSQL += "from SdmsSensorZone a, SdmsSensorTagInfo b ";
            strSQL += $"where b.SensorZoneID = a.ID and a.SensorType = {EmergencyBellSensorType} and a.OrgSensorID in (Select ID from SdmsSensorETC where UniqueKey like '{m_strSensorUniqueTag}%')";

            string strErrorMessage;
            IEnumerable<dynamic> datas = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (datas == null)
                return false;

            foreach (var data in datas)
            {
                if (data.SensorZoneID != null && data.SensorZoneID is int &&
                    data.TagInfoID != null && data.TagInfoID is int &&
                    data.OrgSensorID != null && data.OrgSensorID is int)
                {
                    Sensor sensor;

                    if (dicSensors.TryGetValue((int)data.OrgSensorID, out sensor))
                    {
                        sensor.SensorZoneID = (int)data.SensorZoneID;
                        sensor.SensorTagInfoID = (int)data.TagInfoID;
                    }
                }
            }

            return true;
        }

        private Dictionary<int, Sensor> ReadEtcSensors()
        {
            string strErrorMessage;
            string strSQL = $"Select ID, Name, UniqueKey from SdmsSensorETC where UniqueKey like '{m_strSensorUniqueTag}%'";
            IEnumerable<dynamic> datas = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (datas == null)
                return null;

            int nTagLen = m_strSensorUniqueTag.Length;
            Dictionary<int, Sensor> dicSensors = new Dictionary<int, Sensor>();

            foreach (var data in datas)
            {
                if (data.ID != null && data.ID is int &&
                    data.Name != null && data.Name is string &&
                    data.UniqueKey != null && data.UniqueKey is string)
                {
                    int no;
                    string strUniqueKey = (string)data.UniqueKey;

                    if (int.TryParse(strUniqueKey.Substring(nTagLen).Trim(), out no))
                    {
                        Sensor sensor = new Sensor();

                        sensor.ID = (int)data.ID;
                        sensor.No = no;
                        sensor.Name = (string)data.Name;

                        dicSensors[sensor.ID] = sensor;
                    }
                }
            }

            return dicSensors;
        }

        public bool UpdateSensor(Sensor sensor, int? data)
        {
            string strSQL = "";

            if (data == null || data == 0)
                strSQL = "Update SdmsSensorETC set CurrentData = NULL where ID = " + sensor.ID.ToString();
            else
                strSQL = "Update SdmsSensorETC set CurrentData = 1 where ID = " + sensor.ID.ToString();

            string strErrorMessage;
            return m_dataManager.GetCreate().Insert(strSQL, out strErrorMessage);
        }
    }

    public class Sensor
    {
        private int m_nNo = -1;
        private int m_nID = -1;
        private string m_strName = "";
        private int m_nSensorZoneID = -1;
        private int m_nSensorTagInfoID = -1;
        private DateTime? m_dtAlarm = null;

        public int No
        {
            get { return m_nNo; }
            set { m_nNo = value; }
        }

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int SensorTagInfoID
        {
            get { return m_nSensorTagInfoID; }
            set { m_nSensorTagInfoID = value; }
        }

        public DateTime? AlarmTime
        {
            get { return m_dtAlarm; }
            set { m_dtAlarm = value; }
        }
    }
}
