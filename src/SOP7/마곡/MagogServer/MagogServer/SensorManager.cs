using dnsDBUtil;
using SDMS.DAL;
using SDMS.Model.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace MagogServer
{
    public class SensorManager
    {
        private DataManager m_dataManager = null;

        private Dictionary<int, SensorData> m_fireSensors = new Dictionary<int, SensorData>();
        public Dictionary<int, SensorData> FireSensors { get { return m_fireSensors; } }

        public SensorManager(DataManager dataManager)
        {
            m_dataManager = dataManager;

            Init();
        }

        public void Init()
        {
            string strErrorMessage = "";

            m_fireSensors.Clear();

            Dictionary<int, SensorData> fireSensors = LoadFireSensors(out strErrorMessage);
            if (fireSensors == null)
            {
                Logger.Instance.Write("SensorManager Init() Error : " + strErrorMessage);
            }

            m_fireSensors = fireSensors;
        }

        private Dictionary<int, SensorData> LoadFireSensors(out string strErrorMessage)
        {
            strErrorMessage = "";
            Dictionary<int, SensorData> fireSensors = new Dictionary<int, SensorData>();

            StringBuilder sb = new StringBuilder();
            sb.Append("Select tag.ID, tag.TagNo, fire.Name, SensorType, sz.ID as SensorZoneID, fire.ID ");
            sb.Append("  From SdmsSensorFire as fire, SdmsSensorZone as sz, SdmsSensorTagInfo as tag ");
            sb.Append(" Where fire.ID = sz.OrgSensorID ");
            sb.Append("   And sz.ID = tag.SensorZoneID ");
            sb.Append("   And sz.SensorType = 0 ");

            ArrayList arrResult = m_dataManager.GetSelectManager().GetResultData(sb.ToString(), out strErrorMessage);
            if (arrResult == null)
                return null;

            int nResultCount = arrResult.Count;

            for (int i = 0; i < nResultCount - 5; i += 6)
            {
                VariousData<int> id = WebDBManager.GetIntField(arrResult[i].ToString());
                VariousData<int> tagNo = WebDBManager.GetIntField(arrResult[i + 1].ToString());
                string strSensorName = WebDBManager.GetStringField(arrResult[i + 2]);
                VariousData<int> sensorType = WebDBManager.GetIntField(arrResult[i + 3].ToString());
                VariousData<int> sensorZoneID = WebDBManager.GetIntField(arrResult[i + 4].ToString());
                VariousData<int> sensorID = WebDBManager.GetIntField(arrResult[i + 5].ToString());

                if (id == null || tagNo == null || strSensorName == null || sensorType == null || sensorZoneID == null || sensorID == null)
                    continue;

                SensorData sensor = new SensorData();

                sensor.TagID = id.Data;
                sensor.TagNo = tagNo.Data;
                sensor.SensorName = strSensorName;
                sensor.SensorType = sensorType.Data;
                sensor.SensorZoneID = sensorZoneID.Data;
                sensor.SensorID = sensorID.Data;

                fireSensors[sensor.TagNo] = sensor;
            }

            return fireSensors;
        }

        public bool UpdateDoorState(List<string> doorStates, int nState, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (doorStates == null || doorStates.Count == 0)
            {
                strErrorMessage = "TagID 정보가 없습니다.";
                return false;
            }

            Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
            dicSets[ETC.Fields.Status] = nState;            

            string strUniqueKeys = null;

            foreach (string strTagID in doorStates)
            {
                if (strUniqueKeys == null)
                    strUniqueKeys = "'" + strTagID + "'";
                else
                    strUniqueKeys = strUniqueKeys + ",'" + strTagID + "'";
            }

            string strAdditionalConditions = $"{ETC.TableName}.{ETC.Fields.UniqueKey} in ({strUniqueKeys})";

            return m_dataManager.GetUpdateManager().UpdateETCSensor(dicSets, null, strAdditionalConditions, out strErrorMessage);
        }

        public void UpdateFireSensorName()
        {

            foreach (KeyValuePair<int, SensorData> pair in m_fireSensors)
            {
                SensorData data = pair.Value;

                string strSensorName = data.SensorName;

                string[] splits = strSensorName.Split('-');

                if (splits.Length != 5)
                    continue;

                if (Int32.TryParse(splits[0], out int nFileNum) && Int32.TryParse(splits[1], out int nUnitNum1) && Int32.TryParse(splits[2], out int nUnitNum2) && Int32.TryParse(splits[3], out int nUnitNum3))
                {
                    string strUnit1 = string.Format("{0:D2}", nFileNum) + string.Format("{0:D2}", nUnitNum1);
                    string strUnit2 = nUnitNum2.ToString() + string.Format("{0:D3}", nUnitNum3);

                    string strName = $"{strUnit1}-{strUnit2}";

                    Dictionary<Fire.Fields, object> dicSets = new Dictionary<Fire.Fields, object>();
                    dicSets[Fire.Fields.Name] = strName;
                    dicSets[Fire.Fields.Department] = data.SensorName;

                    Dictionary<Fire.Fields, object> dicConditions = new Dictionary<Fire.Fields, object>();
                    dicConditions[Fire.Fields.ID] = data.SensorID;

                    if (m_dataManager.GetUpdateManager().UpdateFireSensor(dicSets, dicConditions, null, out string strErrorMessage) == false)
                        Console.WriteLine(strErrorMessage);
                }

            }


        }

    }

    public class SensorData
    {
        public int TagID { get; set; }
        public int TagNo { get; set; }
        public int SensorZoneID { get; set; }
        public int SensorID { get; set; }
        public string SensorName { get; set; }
        public int SensorType { get; set; }

    }
}
