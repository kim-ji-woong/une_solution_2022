using System;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Sdms.Sensor;
using dnsCommunicateSopServer;

namespace IntegrationServer.Servers.Worker.SWayM
{
    using Managers;
    using ViewModels.Worker.SWayM;

    public class GasManager : JsonManager
    {
        private const string GasUrl = "extLink/getGasData.do";
        private string m_strBaseUrl = "";

        private SWaymManager m_owner = null;

        // key : gas type
        private Dictionary<string, SensorZoneTagEx> m_dicGasSensors = new Dictionary<string, SensorZoneTagEx>();
        private SopQueryManager m_sopQueryManager = null;
        private string m_strPrevGasLog = "";

        private class SensorZoneTagEx : SensorZoneTag
        {
            private PSM m_sensor = null;

            public PSM Sensor
            {
                get { return m_sensor; }
                set { m_sensor = value; }
            }

            public SensorZoneTagEx(SensorZone sensorZone, TagInfo tagInfo)
                : base(sensorZone, tagInfo)
            {
            }
        }

        public GasManager(string strBaseUrl, SWaymManager owner, string strSOPWebServerURL, IDataManager dataManager)
        {
            m_owner = owner;
            m_strBaseUrl = strBaseUrl;
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            ReadSensors(dataManager);
        }

        public bool ReadSensors(IDataManager dataManager)
        {
            string strErrorMessage;
            IEnumerable<Material> materials = dataManager.GetSelect().Select<Material>(null, out strErrorMessage);

            if (materials == null)
            {
                System.Diagnostics.Trace.WriteLine("Read Material Fail : " + strErrorMessage);
                return false;
            }

            Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();

            foreach (Material material in materials)
            {
                //string strMaterialName = material.MaterialName.ToLower();
                dicMaterials[material.ID] = material;
            }

            string strConditions = string.Format("{0} like 'Fixed_%'", PSM.Fields.UniqueKey);
            IEnumerable<PSM> sensors = dataManager.GetSelect().Select<PSM>(strConditions, out strErrorMessage);

            if (sensors == null)
            {
                System.Diagnostics.Trace.WriteLine("Read PSM Fail : " + strErrorMessage);
                return false;
            }

            Dictionary<int, PSM> dicOriginSensors = new Dictionary<int, PSM>();

            foreach (PSM sensor in sensors)
            {
                dicOriginSensors[sensor.ID] = sensor;
            }

            strConditions = string.Format("{0} in (Select {1} from {2} where {3} like 'Fixed_%')",
                SensorZone.Fields.OrgSensorID,
                PSM.Fields.ID,
                PSM.TableName,
                PSM.Fields.UniqueKey);

            strConditions += string.Format(" and {0} in (Select {1} from {2} where {3} = 'co2' or {3} = 'co' or {3} = 'o2' or {3} = 'h2s' or {3} = 'ch4')",
                SensorZone.Fields.SensorType,
                Material.Fields.ID,
                Material.TableName,
                Material.Fields.MaterialName);

            ArrayList arrDatas = AlarmManager.JoinSensorZoneTagInfo(dataManager, strConditions, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadSensors Fail : " + strErrorMessage);
                return false;
            }

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    PSM sensor;

                    if (sensorZone.OrgSensorID != null && dicOriginSensors.TryGetValue((int)sensorZone.OrgSensorID, out sensor))
                    {
                        Material material;

                        if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                        {
                            SensorZoneTagEx sensorZoneTag = new SensorZoneTagEx(sensorZone, tagInfo);
                            sensorZoneTag.Sensor = sensor;
                            m_dicGasSensors[material.MaterialName.ToLower()] = sensorZoneTag;
                        }
                    }
                }
            }

            return true;
        }

        public bool Read(IDataManager dataManager, int siteID)
        {
            List<Gas> gasList = ReadGas();

            if (gasList == null)
                return false;

            UpdateGasData(gasList, dataManager);
            SendGas(gasList);
            return true;
        }

        private void SendGas(List<Gas> gasList)
        {
            foreach (Gas gas in gasList)
            {
                if (gas.Sensor == null || gas.Sensor.LimitBase == null || gas.Sensor.LimitType == null)
                    continue;

                if (gas.Sensor.MaterialType == null)
                    continue;

                int nAlarmLevel = SensorManager.GetPsmAlarmLevel((double)gas.Sensor.LimitBase, (int)gas.Sensor.LimitType, gas.Sensor.LimitValue, gas.Data);

                ArrayList arrDatas = new ArrayList();

                arrDatas.Add((int)gas.Sensor.MaterialType);
                arrDatas.Add(gas.TagInfoID);
                arrDatas.Add(gas.SensorZoneID);
                arrDatas.Add(nAlarmLevel > 0);

                if (nAlarmLevel > 0)
                    arrDatas.Add(nAlarmLevel);

                m_sopQueryManager.SendAlarmQuery(arrDatas, "POST");
            }
        }

        private List<Gas> ReadGas()
        {
            string strErrorMessage;
            string strUrl = m_strBaseUrl.EndsWith("/") ? m_strBaseUrl + GasUrl : m_strBaseUrl + "/" + GasUrl;
            JObject json = WebServiceManager.ReadPost(strUrl, out strErrorMessage);

            if (json == null)
                return null;

            string strEventLog = json.ToString();

            if (strEventLog != m_strPrevGasLog)
            {
                m_owner.WriteLog(strEventLog);
                m_strPrevGasLog = strEventLog;
            }

            if (json == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadGas Error : " + strErrorMessage);
                return null;
            }
            else
            {
                JToken tags = json.GetValue("gasDataList");

                if (tags != null)
                {
                    Dictionary<string, Gas> dicWorkers = new Dictionary<string, Gas>();
                    double ch4 = 0, o2 = 0, h2s = 0, co2 = 0, co = 0;
                    string strTime = null;

                    foreach (JToken tag in tags)
                    {
                        string strCH4 = GetValue(tag, "gas_ch4");
                        string strO2 = GetValue(tag, "gas_o2");
                        string strCO2 = GetValue(tag, "gas_co2");
                        string strH2S = GetValue(tag, "gas_h2s");
                        string strCO = GetValue(tag, "gas_co");
                        string strTimeStamp = GetValue(tag, "createDate");

                        if (strTime == null || string.Compare(strTime, strTimeStamp) < 0)
                        {
                            if (strCH4 != null && strO2 != null && strCO2 != null && strH2S != null && strCO != null)
                            {
                                ch4 = GetDouble(strCH4);
                                o2 = GetDouble(strO2);
                                co2 = GetDouble(strCO2);
                                h2s = GetDouble(strH2S);
                                co = GetDouble(strCO);

                                strTime = strTimeStamp;
                            }
                        }
                    }

                    List<Gas> gasList = new List<Gas>();

                    if (strTime != null)
                    {
                        AddGas(gasList, "ch4", ch4);
                        AddGas(gasList, "o2", o2);
                        AddGas(gasList, "co2", co2);
                        AddGas(gasList, "h2s", h2s);
                        AddGas(gasList, "co", co);
                    }

                    return gasList;
                }
            }

            return null;
        }

        private void UpdateGasData(List<Gas> gasList, IDataManager dataManager)
        {
            string strErrorMessage;
            Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();

            foreach (Gas gas in gasList)
            {
                string strCondition = string.Format("{0} = {1}", PSM.Fields.ID, gas.Sensor.ID);
                dicSets[PSM.Fields.CurrentData] = gas.Data;
                dataManager.GetUpdate().Update<PSM, PSM.Fields>(dicSets, strCondition, out strErrorMessage);
            }
        }

        private void AddGas(List<Gas> gasList, string strGasType, double value)
        {
            SensorZoneTagEx sensorZoneTag;

            if (m_dicGasSensors.TryGetValue(strGasType, out sensorZoneTag))
            {
                Gas gas = new Gas();

                gas.Data = value;
                gas.SensorZoneID = sensorZoneTag.SensorZone.ID;
                gas.TagInfoID = sensorZoneTag.TagInfo.ID;
                gas.GasType = strGasType;
                gas.Sensor = sensorZoneTag.Sensor;

                gasList.Add(gas);
            }
        }

        private double GetDouble(string strValue)
        {
            int len = strValue.Length;
            double data = 0, point = 0.1;
            bool belowPoint = false;

            for (int i=0;i<len;i++)
            {
                char ch = strValue[i];

                if (ch >= '0' && ch <= '9')
                {
                    if (belowPoint == false)
                        data = data * 10 + (int)(ch - '0');
                    else
                    {
                        data += point * (int)(ch - '0');
                        point *= 0.1;
                    }
                }
                else if (ch == '.')
                {
                    if (belowPoint)
                        break;
                    else
                        belowPoint = true;
                }
                else
                    break;
            }

            return data;
        }
    }
}
