using dnsData.Sensor;
using Hydrogen.BLL.Models;
using Hydrogen.BLL.Models.Sensor;
using SDMS.IDAL;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.BLL
{
    public class SensorManager
    {
        private const string H2SensorType = "h2";
        private const string TempSensorType = "temp";
        private const string FlowSensorType = "flow";
        private const string ConductSensorType = "conduct";
        private const string GasSensorType = "gas";
        private const string PressureSensorType = "pressure";

        private const string H2LowSensorType = "h2low";
        private const string O2SensorType = "o2";

        private const string H2JAGSensorType = "h2jag";
        private const string O2JAGSensorType = "o2jag";



        private IDataManager m_dataManager = null;
        private Dictionary<int, EtcSensor> m_dicH2Sensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledH2Sensors = null;
        private Dictionary<int, EtcSensor> m_dicTempSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledTempSensors = null;
        private Dictionary<int, EtcSensor> m_dicFlowSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledFlowSensors = null;
        private Dictionary<int, EtcSensor> m_dicConductSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledConductSensors = null;
        private Dictionary<int, EtcSensor> m_dicGASSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledGASSensors = null;
        private Dictionary<int, EtcSensor> m_dicPressureSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledPressureSensors = null;

        private Dictionary<int, EtcSensor> m_dicH2LowSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledH2LowSensors = null;
        private Dictionary<int, EtcSensor> m_dicO2Sensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledO2Sensors = null;

        private Dictionary<int, EtcSensor> m_dicH2JAGSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledH2JAGSensors = null;
        private Dictionary<int, EtcSensor> m_dicO2JAGSensors = null;
        private Dictionary<int, EtcSensor> m_dicDisabledO2JAGSensors = null;

        public SensorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSensorList GetSensorList()
        {
            ResponseSensorList response = new ResponseSensorList();

            if (LoadSensorList(out string strErrorMessage) == false)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            ICollection<EtcSensor> h2Sensors = m_dicH2Sensors.Values;
            response.H2Sensors = MakeList<EtcSensor>(h2Sensors);

            ICollection<EtcSensor> tempSensors = m_dicTempSensors.Values;
            response.TempSensors = MakeList<EtcSensor>(tempSensors);

            ICollection<EtcSensor> flowSensors = m_dicFlowSensors.Values;
            response.FlowSensors = MakeList<EtcSensor>(flowSensors);

            ICollection<EtcSensor> conductSensors = m_dicConductSensors.Values;
            response.ConductSensors = MakeList<EtcSensor>(conductSensors);

            ICollection<EtcSensor> gasSensors = m_dicGASSensors.Values;
            response.GASSensors = MakeList<EtcSensor>(gasSensors);

            ICollection<EtcSensor> pressureSensors = m_dicPressureSensors.Values;
            response.PressureSensors = MakeList<EtcSensor>(pressureSensors);

            ICollection<EtcSensor> h2LowSensors = m_dicH2LowSensors.Values;
            response.H2LowSensors = MakeList<EtcSensor>(h2LowSensors);
            ICollection<EtcSensor> o2Sensors = m_dicO2Sensors.Values;
            response.O2Sensors = MakeList<EtcSensor>(o2Sensors);

            ICollection<EtcSensor> h2JAGSensors = m_dicH2JAGSensors.Values;
            response.H2JAGSensors = MakeList<EtcSensor>(h2JAGSensors);
            ICollection<EtcSensor> o2JAGSensors = m_dicO2JAGSensors.Values;
            response.O2JAGSensors = MakeList<EtcSensor>(o2JAGSensors);




            response.Success = true;
            return response;
        }

        private List<DataType> MakeList<DataType>(ICollection<DataType> datas)
        {
            if (datas == null)
                return null;

            List<DataType> dataList = new List<DataType>();

            foreach (DataType data in datas)
            {
                dataList.Add(data);
            }

            return dataList;
        }

        public bool LoadSensorList(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;

            bool bRet = LoadH2Sensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadTempSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadFlowSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadConductSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadGASSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadPressureSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;


            bRet = LoadH2LowSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadO2Sensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadH2JAGSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;

            bRet = LoadO2JAGSensors(m_dataManager, out strErrorMessage);
            if (bRet == false)
                return bRet;



            return bRet;
        }


        private bool LoadH2Sensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.H2;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicH2Sensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicH2Sensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.H2}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledH2Sensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicH2Sensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledH2Sensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicH2Sensors = dicH2Sensors;
            m_dicDisabledH2Sensors = dicDisabledH2Sensors;
            return true;
        }

        private bool LoadTempSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Temp;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicTempSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicTempSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.Temp}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledTempSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicTempSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledTempSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicTempSensors = dicTempSensors;
            m_dicDisabledTempSensors = dicDisabledTempSensors;
            return true;
        }

        private bool LoadFlowSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Flow;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicFlowSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicFlowSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.Flow}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledFlowSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicFlowSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledFlowSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicFlowSensors = dicFlowSensors;
            m_dicDisabledFlowSensors = dicDisabledFlowSensors;
            return true;
        }

        private bool LoadConductSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Conductivity;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicConductSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicConductSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.Conductivity}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledConductSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicConductSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledConductSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicConductSensors = dicConductSensors;
            m_dicDisabledConductSensors = dicDisabledConductSensors;
            return true;
        }

        private bool LoadGASSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.GAS;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicGASSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicGASSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.GAS}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledGASSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicGASSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledGASSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicGASSensors = dicGASSensors;
            m_dicDisabledGASSensors = dicDisabledGASSensors;
            return true;
        }

        private bool LoadPressureSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.PRESSURE_SENSOR;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicPressureSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicPressureSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.PRESSURE_SENSOR}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledPressureSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicPressureSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledPressureSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicPressureSensors = dicPressureSensors;
            m_dicDisabledPressureSensors = dicDisabledPressureSensors;
            return true;
        }

        public ResponseSensorCount GetSensorCount(int? nSiteID = null)
        {
            ResponseSensorCount response = new ResponseSensorCount();

            if (LoadSensorList(out string strErrorMessage) == false)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            response.H2SensorCount = m_dicH2Sensors.Count;
            response.DisabledH2SensorCount = m_dicDisabledH2Sensors.Count;
            response.TempSensorCount = m_dicTempSensors.Count;
            response.DisabledTempSensorCount = m_dicDisabledTempSensors.Count;
            response.FlowSensorCount = m_dicFlowSensors.Count;
            response.DisabledFlowSensorCount = m_dicDisabledFlowSensors.Count;
            response.ConductSensorCount = m_dicConductSensors.Count;
            response.DisabledConductSensorCount = m_dicDisabledConductSensors.Count;
            response.GASSensorCount = m_dicGASSensors.Count;
            response.DisabledGASSensorCount = m_dicDisabledGASSensors.Count;
            response.PressureSensorCount = m_dicPressureSensors.Count;
            response.DisabledPressureSensorCount = m_dicDisabledPressureSensors.Count;

            response.H2LowSensorCount = m_dicH2LowSensors.Count;
            response.DisabledH2LowSensorCount = m_dicDisabledH2LowSensors.Count;
            response.O2SensorCount = m_dicO2Sensors.Count;
            response.DisabledH2SensorCount = m_dicDisabledO2Sensors.Count;
            response.H2JAGSensorCount = m_dicH2JAGSensors.Count;
            response.DisabledH2JAGSensorCount = m_dicDisabledH2JAGSensors.Count;
            response.O2JAGSensorCount = m_dicO2JAGSensors.Count;
            response.DisabledO2JAGSensorCount = m_dicDisabledO2JAGSensors.Count;

            response.Success = true;
            return response;
        }

        private bool LoadH2LowSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.H2Low_Senko;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicH2LowSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicH2LowSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.H2Low_Senko}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledH2LowSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicH2LowSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledH2LowSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicH2LowSensors = dicH2LowSensors;
            m_dicDisabledH2LowSensors = dicDisabledH2LowSensors;
            return true;
        }

        private bool LoadO2Sensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.O2_Senko;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicO2Sensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicO2Sensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.O2_Senko}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledO2Sensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicO2Sensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledO2Sensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicO2Sensors = dicO2Sensors;
            m_dicDisabledO2Sensors = dicDisabledO2Sensors;
            return true;
        }

        private bool LoadH2JAGSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.H2JAG;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicH2JAGSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicH2JAGSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.H2JAG}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledH2JAGSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicH2JAGSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledH2JAGSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicH2JAGSensors = dicH2JAGSensors;
            m_dicDisabledH2JAGSensors = dicDisabledH2JAGSensors;
            return true;
        }

        private bool LoadO2JAGSensors(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            string strConditions = string.Empty;

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.O2JAG;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            Dictionary<int, EtcSensor> dicO2JAGSensors = new Dictionary<int, EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    etc.IsIndoor = false;

                    etc.MaterialType = etcSensor.MaterialType;

                    dicO2JAGSensors[etcSensor.ID] = etc;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.O2JAG}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            Dictionary<int, EtcSensor> dicDisabledO2JAGSensors = new Dictionary<int, EtcSensor>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && dicO2JAGSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;

                        if (tagInfo.IsActivate == false || (etc.Enabled != null && etc.Enabled == false))
                        {
                            dicDisabledO2JAGSensors[etc.ID] = etc;
                        }
                    }
                }
            }

            m_dicO2JAGSensors = dicO2JAGSensors;
            m_dicDisabledO2JAGSensors = dicDisabledO2JAGSensors;
            return true;
        }

        public ResponseHydrogenEquipZoneSensorList GetHydrogenEquipZoneSensorList(string strSensorType, int nSensorID)
        {
            ResponseHydrogenEquipZoneSensorList response = new ResponseHydrogenEquipZoneSensorList();

            string strErrorMessage;
            SensorZone sensorZone = GetSensorZoneFromSensor(strSensorType, nSensorID, out strErrorMessage);

            if (sensorZone == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            dicConditions[SensorZone.Fields.SensorType] = sensorZone.SensorType;
            dicConditions[SensorZone.Fields.EquipZoneID] = sensorZone.EquipZoneID;

            List<SensorZone> sensorZones = m_dataManager.GetSelectManager().SelectSensorZones(dicConditions, null, out strErrorMessage);

            if (sensorZones == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            EquipmentZone equipZone = m_dataManager.GetSelectManager().SelectEquipmentZone(sensorZone.EquipZoneID, out strErrorMessage);

            if (equipZone == null)
            {
                response.Success = false;
                response.Message = "센서가 위치한 곳의 구역이름이 설정되어 있지 않습니다.";
                return response;
            }

            response.Success = true;
            response.EquipZoneID = equipZone.ID;
            response.EquipZoneName = equipZone.ZoneName;
            response.SensorType = strSensorType;

            foreach (SensorZone sz in sensorZones)
            {
                if (sz.OrgSensorID != null)
                    response.SensorIDs.Add((int)sz.OrgSensorID);
            }

            return response;
        }

        private SensorZone GetSensorZoneFromSensor(string strSensorType, int nSensorID, out string strErrorMessage)
        {
            strErrorMessage = null;

            int nSensorType = -1;

            if (SensorManager.IsH2Sensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.H2;
            else if (SensorManager.IsTempSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.Temp;
            else if (SensorManager.IsFlowSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.Flow;
            else if (SensorManager.IsConductSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.Conductivity;
            else if (SensorManager.IsGasSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.GAS;
            else if (SensorManager.IsPressureSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.PRESSURE_SENSOR;
            else if (SensorManager.IsH2LowSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.H2Low_Senko;
            else if (SensorManager.IsO2Sensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.O2_Senko;
            else if (SensorManager.IsH2JAGSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.H2JAG;
            else if (SensorManager.IsO2JAGSensor(strSensorType))
                nSensorType = (int)dnsData.Sensor.Facility.FacilityType.O2JAG;

            else
            {
                strErrorMessage = "알수없는 형식의 SensorType입니다. : " + strSensorType;
                return null;
            }

            string strAdditionalConditions = null;

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            dicConditions[SensorZone.Fields.OrgSensorID] = nSensorID;            
            dicConditions[SensorZone.Fields.SensorType] = nSensorType;


            List<SensorZone> sensorZones = m_dataManager.GetSelectManager().SelectSensorZones(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (sensorZones == null)
                return null;

            if (sensorZones.Count == 0)
            {
                strErrorMessage = "해당 센서에 대한 구역설정이 되어있지 않습니다.(이벤트 처리를 하지 않는 센서입니다.)";
                return null;
            }

            return sensorZones[0];
        }

        public static bool IsH2Sensor(string strSensorType)
        {
            if (string.Compare(strSensorType, H2SensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsTempSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, TempSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsFlowSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, FlowSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsConductSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, ConductSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsGasSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, GasSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsPressureSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, PressureSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsH2LowSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, H2LowSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsO2Sensor(string strSensorType)
        {
            if (string.Compare(strSensorType, O2SensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsH2JAGSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, H2JAGSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsO2JAGSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, O2JAGSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }
    }
}
