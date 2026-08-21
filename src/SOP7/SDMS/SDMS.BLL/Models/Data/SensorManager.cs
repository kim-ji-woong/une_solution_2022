using SDMS.Model.Sensor;
using SDMS.IDAL;
using System.Collections.Generic;
using System.Collections;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace SDMS.BLL.Models.Data
{
    using Models.Response;
    using Models.Data.Sensor;
    using Model.CCTV;
    using Model.Spatial;

    public class SensorManager
    {
        private const string FireSensorType = "fire";
        private const string PSMSensorType = "psm";
        private const string EtcSensorType = "etc";
        private const string EnvironmentSensorType = "environment";
        private const string ManufactureSensorType = "manufacture";
        private const string SpeedDetectionSensorType = "speedDetection";
        private const string CCTVType = "cctv";

        // 전체 화재센서
        private Dictionary<int, FireSensor> m_dicFireSensors = new Dictionary<int, FireSensor>();
        // 사용하지 않는 화재센서
        private ConcurrentDictionary<int, FireSensor> m_dicDisabledFireSensors = new ConcurrentDictionary<int, FireSensor>();

        // 전체 화재센서
        public ICollection<FireSensor> FireSensors
        {
            get { return m_dicFireSensors.Values; }
        }

        // 사용하지 않는 화재센서
        public ICollection<FireSensor> DisabledFireSensors
        {
            get { return m_dicDisabledFireSensors.Values; }
        }

        // 전체 누출센서
        private Dictionary<int, PSMSensor> m_dicPSMSensors = new Dictionary<int, PSMSensor>();
        // 사용하지 않는 누출센서
        private ConcurrentDictionary<int, PSMSensor> m_dicDisabledPSMSensors = new ConcurrentDictionary<int, PSMSensor>();

        // 수치정보를 표현하기 위한 누출센서 리스트
        private static ConcurrentDictionary<int, RangeSensor> m_dicRangePSMSensors = new ConcurrentDictionary<int, RangeSensor>();
        // 수치정보를 표현하기 위한 ETC센서 리스트
        private static ConcurrentDictionary<int, RangeSensor> m_dicRangeETCSensors = new ConcurrentDictionary<int, RangeSensor>();
        private static bool m_readRangeSensors = false;
        private static string m_strRangeSensorErrorMessage = null;

        // 전체 누출센서
        public ICollection<PSMSensor> PSMSensors
        {
            get { return m_dicPSMSensors.Values; }
        }

        // 사용하지 않는 누출센서
        public ICollection<PSMSensor> DisabledPSMSensors
        {
            get { return m_dicDisabledPSMSensors.Values; }
        }

        // 전체 기타센서
        private Dictionary<int, EtcSensor> m_dicEtcSensors = new Dictionary<int, EtcSensor>();
        // 사용하지 않는 기타센서
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledEtcSensors = new ConcurrentDictionary<int, EtcSensor>();

        // 전체 기타센서
        public ICollection<EtcSensor> EtcSensors
        {
            get { return m_dicEtcSensors.Values; }
        }

        // 사용하지 않는 기타센서
        public ICollection<EtcSensor> DisabledEtcSensors
        {
            get { return m_dicDisabledEtcSensors.Values; }
        }

        // 전체 CCTV
        private Dictionary<int, CCTVSensor> m_dicCCTVs = new Dictionary<int, CCTVSensor>();
        // 사용하지 않는 CCTV
        private ConcurrentDictionary<int, CCTVSensor> m_dicDisabledCCTVs = new ConcurrentDictionary<int, CCTVSensor>();

        // 전체 CCTV
        public ICollection<CCTVSensor> CCTVs
        {
            get { return m_dicCCTVs.Values; }
        }

        // 사용하지 않는 CCTV
        public ICollection<CCTVSensor> DisabledCCTVs
        {
            get { return m_dicDisabledCCTVs.Values; }
        }

        private Dictionary<int, SensorZone> m_dicSensorZones = new Dictionary<int, SensorZone>();
        // 전체 SensorTagInfo
        private Dictionary<int, TagInfo> m_dicSensorTagInfos = new Dictionary<int, TagInfo>();
        // 센서 타입별 SensorTagInfo(m_dicSensorTagInfos와 개수는 동일함)
        // Key : 상위 4바이트(센서타입)
        //       하위 4바이트(Origin Sensor ID)
        private Dictionary<long, TagInfo> m_dicTypeSensorTagInfos = new Dictionary<long, TagInfo>();
        // 사용하지 않는 SensorTagInfo
        private ConcurrentDictionary<long, TagInfo> m_dicDisabledTypeSensorTagInfos = new ConcurrentDictionary<long, TagInfo>();


        // 전체 지진센서
        private Dictionary<int, EtcSensor> m_dicEarthquakeSensors = new Dictionary<int, EtcSensor>();
        // 사용하지 않는 지진센서
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledEarthquakeSensors = new ConcurrentDictionary<int, EtcSensor>();

        // 전체 지진센서
        public ICollection<EtcSensor> EarthquakeSensors
        {
            get { return m_dicEarthquakeSensors.Values; }
        }

        // 사용하지 않는 지진센서
        public ICollection<EtcSensor> DisabledEarthquakeSensors
        {
            get { return m_dicDisabledEarthquakeSensors.Values; }
        }

        // 전체 강풍센서
        private Dictionary<int, EtcSensor> m_dicStrongWindSensors = new Dictionary<int, EtcSensor>();
        // 사용하지 않는 강풍센서
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledStrongWindSensors = new ConcurrentDictionary<int, EtcSensor>();

        // 전체 강풍센서
        public ICollection<EtcSensor> StrongWindSensors
        {
            get { return m_dicStrongWindSensors.Values; }
        }

        // 사용하지 않는 강풍센서
        public ICollection<EtcSensor> DisabledStrongWindSensors
        {
            get { return m_dicDisabledStrongWindSensors.Values; }
        }


        private Dictionary<int, EtcSensor> m_dicEnvironmentSensors = new Dictionary<int, EtcSensor>();
        // 사용하지 않는 환경설비 센서
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledEnvironmentSensors = new ConcurrentDictionary<int, EtcSensor>();

        // 전체 환경설비 센서
        public ICollection<EtcSensor> EnvironmentSensors
        {
            get { return m_dicEnvironmentSensors.Values; }
        }

        // 사용하지 않는 환경설비 센서
        public ICollection<EtcSensor> DisabledEnvironmentSensors
        {
            get { return m_dicDisabledEnvironmentSensors.Values; }
        }



        private Dictionary<int, EtcSensor> m_dicManufactureSensors = new Dictionary<int, EtcSensor>();
        // 사용하지 않는 제조설비 센서
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledManufactureSensors = new ConcurrentDictionary<int, EtcSensor>();

        // 전체 환경설비 제조센서
        public ICollection<EtcSensor> ManufactureSensors
        {
            get { return m_dicManufactureSensors.Values; }
        }

        // 사용하지 않는 제조설비 센서
        public ICollection<EtcSensor> DisabledManufactureSensors
        {
            get { return m_dicDisabledManufactureSensors.Values; }
        }

        private Dictionary<int, EtcSensor> m_dicEmergencyBellSensors = new Dictionary<int, EtcSensor>();
        // 사용하지 않는 비상벨 센서
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledEmergencyBellSensors = new ConcurrentDictionary<int, EtcSensor>();

        // 전체 비상벨 제조센서
        public ICollection<EtcSensor> EmergencyBellSensors
        {
            get { return m_dicEmergencyBellSensors.Values; }
        }

        // 사용하지 않는 비상벨 센서
        public ICollection<EtcSensor> DisabledEmergencyBellSensors
        {
            get { return m_dicDisabledEmergencyBellSensors.Values; }
        }

        private Dictionary<int, EtcSensor> m_dicLaserSensors = new Dictionary<int, EtcSensor>();
        
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledLaserSensors = new ConcurrentDictionary<int, EtcSensor>();
        
        public ICollection<EtcSensor> LaserSensors
        {
            get { return m_dicLaserSensors.Values; }
        }
        
        public ICollection<EtcSensor> DisabledLaserSensors
        {
            get { return m_dicDisabledLaserSensors.Values; }
        }

        private Dictionary<int, EtcSensor> m_dicDoorSensors = new Dictionary<int, EtcSensor>();

        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledDoorSensors = new ConcurrentDictionary<int, EtcSensor>();
        
        public ICollection<EtcSensor> DoorSensors
        {
            get { return m_dicDoorSensors.Values; }
        }
        
        public ICollection<EtcSensor> DisabledDoorSensors
        {
            get { return m_dicDisabledDoorSensors.Values; }
        }

        private Dictionary<int, EtcSensor> m_dicLowBatterySensors = new Dictionary<int, EtcSensor>();

        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledLowBatterySensors = new ConcurrentDictionary<int, EtcSensor>();

        public ICollection<EtcSensor> LowBatterySensors
        {
            get { return m_dicLowBatterySensors.Values; }
        }

        public ICollection<EtcSensor> DisabledLowBatterySensors
        {
            get { return m_dicDisabledLowBatterySensors.Values; }
        }

        private Dictionary<int, EtcSensor> m_dicSpeedDetectionSensors = new Dictionary<int, EtcSensor>();
        private ConcurrentDictionary<int, EtcSensor> m_dicDisabledSpeedDetectionSensors = new ConcurrentDictionary<int, EtcSensor>();

        public ICollection<EtcSensor> SpeedDetectionSensors
        {
            get { return m_dicSpeedDetectionSensors.Values; }
        }

        public ICollection<EtcSensor> DisabledSpeedDetectionSensors
        {
            get { return m_dicDisabledSpeedDetectionSensors.Values; }
        }

        public bool LoadSensorList(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            m_dicFireSensors.Clear();
            m_dicPSMSensors.Clear();
            m_dicEtcSensors.Clear();
            m_dicSensorZones.Clear();
            m_dicCCTVs.Clear();
            m_dicEarthquakeSensors.Clear();
            m_dicStrongWindSensors.Clear();
            m_dicEnvironmentSensors.Clear();
            m_dicManufactureSensors.Clear();
            m_dicDoorSensors.Clear();
            m_dicLaserSensors.Clear();
            m_dicLowBatterySensors.Clear();
            m_dicSpeedDetectionSensors.Clear();

            bool success1 = LoadSensorTagInfo(dataManager);
            bool success2 = LoadFireSensors(dataManager, spatialManager, siteIDs);
            bool success3 = LoadPSMSensors(dataManager, spatialManager, siteIDs);
            bool success4 = LoadEtcSensors(dataManager, spatialManager, siteIDs);
            bool success5 = LoadCCTVs(dataManager, spatialManager, siteIDs);
            bool success6 = LoadEarthquakeSensors(dataManager, spatialManager, siteIDs);
            bool success7 = LoadStrongWindSensors(dataManager, spatialManager, siteIDs);
            bool success8 = LoadEnvironmentSensors(dataManager, spatialManager, siteIDs);
            bool success9 = LoadManufactureSensors(dataManager, spatialManager, siteIDs);
            bool success10 = LoadEmergencyBellSensors(dataManager, spatialManager, siteIDs);
            bool success11 = LoadLaserSensors(dataManager, spatialManager, siteIDs);
            bool success12 = LoadDoorSensors(dataManager, spatialManager, siteIDs);
            bool success13 = LoadLowBatterySensors(dataManager, spatialManager, siteIDs);
            bool success14 = LoadSpeedDetectionSensors(dataManager, spatialManager, siteIDs);

            return success1 && success2 && success3 && success4 && success5 && success6 && success7 && success8 && success9 && success10 && success11 && success12 && success13 && success14;
        }

        private bool LoadSensorTagInfo(IDataManager dataManager)
        {
            string strErrorMessage;
            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(null, null, null, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadSensorTagInfo Error : " + strErrorMessage);
                return false;
            }

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    m_dicSensorTagInfos[tagInfo.ID] = tagInfo;
                    m_dicSensorZones[sensorZone.ID] = sensorZone;

                    if (sensorZone.OrgSensorID.HasValue == false)
                        continue;

                    long key = GetSensorTypeKey(sensorZone.SensorType, sensorZone.OrgSensorID.Value);
                    m_dicTypeSensorTagInfos[key] = tagInfo;

                    if (tagInfo.IsActivate == false)
                    {
                        m_dicDisabledTypeSensorTagInfos[key] = tagInfo;
                    }
                }
            }

            return true;
        }

        private long GetSensorTypeKey(int nSensorType, int nSensorID)
        {
            return ((((long)nSensorType) << 32) | (long)nSensorID);
        }

        private int GetSensorType(long key, out int nSensorID)
        {
            nSensorID = (int)(key & 0xffffffff);
            return (int)(key >> 32);
        }

        private bool LoadFireSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            List<Fire> fireSensors = dataManager.GetSelectManager().SelectFireSensors(null, strConditions, out strErrorMessage);

            if (fireSensors == null)
                return false;

            foreach (Fire fireSensor in fireSensors)
            {
                Zone zone = spatialManager.GetZone(fireSensor.ZoneID);

                FireSensor fire = new FireSensor(fireSensor);

                if (zone != null && zone.BuildingID != null)
                    fire.IsIndoor = true;
                else
                    fire.IsIndoor = false;

                if (zone != null)
                    fire.SiteID = zone.SiteID;

                m_dicFireSensors[fireSensor.ID] = fire;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR, fireSensor.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (fire.Enabled != null && fire.Enabled == false))
                {
                    m_dicDisabledFireSensors[fireSensor.ID] = fire;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            dicConditions[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions , null, null, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    FireSensor fire;
                    
                    if (sensorZone.OrgSensorID != null && m_dicFireSensors.TryGetValue((int)sensorZone.OrgSensorID, out fire))
                    {
                        fire.SensorTagInfoID = tagInfo.ID;
                        fire.SensorZoneID = sensorZone.ID;
                        fire.TagNo = tagInfo.TagNo;
                        fire.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool ReloadFireSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<FireSensor> fireSensors, out string strErrorMessage)
        {
            fireSensors = null;

            Dictionary<Fire.Fields, object> dicConditions = new Dictionary<Fire.Fields, object>();
            dicConditions[Fire.Fields.ZoneID] = nZoneID;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{FireSensor.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            List<Fire> sensors = dataManager.GetSelectManager().SelectFireSensors(dicConditions, strConditions, out strErrorMessage);

            if (sensors == null)
                return false;

            FireSensor fireSensor;
            fireSensors = new List<FireSensor>();

            foreach (Fire sensor in sensors)
            {
                if (m_dicFireSensors.TryGetValue(sensor.ID, out fireSensor))
                {
                    fireSensor.Name = sensor.Name;
                    fireSensor.PositionName = sensor.PositionName;
                    fireSensor.Department = sensor.Department;
                    fireSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                    fireSensor.Enabled = sensor.Enabled;
                    fireSensor.SensorSubType = sensor.SensorSubType;
                    fireSensor.X = sensor.X;
                    fireSensor.Y = sensor.Y;
                    fireSensor.Z = sensor.Z;

                    fireSensors.Add(fireSensor);

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR, fireSensor.ID);

                    if (fireSensor.Enabled != null && fireSensor.Enabled == false)
                    {
                        m_dicDisabledFireSensors[fireSensor.ID] = fireSensor;
                    }
                    else
                    {
                        FireSensor temp;
                        m_dicDisabledFireSensors.TryRemove(fireSensor.ID, out temp);
                    }
                }
            }

            return true;
        }

        private bool LoadPSMSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{PSM.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            List<PSM> psmSensors = dataManager.GetSelectManager().SelectPSMSensors(null, strConditions, out strErrorMessage);

            if (psmSensors == null)
                return false;

            foreach (PSM psmSensor in psmSensors)
            {
                PSMSensor psmData = new PSMSensor(psmSensor);

                Zone zone = spatialManager.GetZone(psmSensor.ZoneID);
                if (zone != null && zone.BuildingID != null)
                    psmData.IsIndoor = true;
                else
                    psmData.IsIndoor = false;

                if (zone != null)
                    psmData.SiteID = zone.SiteID;

                EquipmentZoneData equipZoneData = spatialManager.GetEquipmentZone(psmData.EquipZoneID);

                if (equipZoneData != null)
                {
                    psmData.LinkedZones.AddRange(equipZoneData.LinkedZoneDatas);

                    //if (equipZoneData.LinkedZoneDatas.Count > 0)
                    //{
                    //    Zone zone = equipZoneData.LinkedZoneDatas[0];
                    //    psmData.IsIndoor = zone.BuildingID != null;
                    //}
                }

                psmData.MaterialType = psmSensor.MaterialType;

                m_dicPSMSensors[psmSensor.ID] = psmData;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, psmSensor.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (psmSensor.Enabled != null && psmSensor.Enabled == false))
                {
                    m_dicDisabledPSMSensors[psmSensor.ID] = psmData;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR}";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    PSMSensor psm;

                    if (sensorZone.OrgSensorID != null && m_dicPSMSensors.TryGetValue((int)sensorZone.OrgSensorID, out psm))
                    {
                        psm.SensorTagInfoID = tagInfo.ID;
                        psm.SensorZoneID = sensorZone.ID;
                        psm.FacilityType = sensorZone.SensorType;
                    }
                }
            }

            return true;
        }

        private List<int> GetPSMSensorTypeIDs(IDataManager dataManager)
        {
            Dictionary<FacilityType.Fields, object> dicConditions = new Dictionary<FacilityType.Fields, object>();
            dicConditions[FacilityType.Fields.LinkedTableName] = PSM.TableName;

            string strErrorMessage;
            List<FacilityType> types = dataManager.GetSelectManager().SelectFacilityTypes(dicConditions, null, out strErrorMessage);

            List<int> ids = new List<int>();

            if (types == null)
            {
                System.Diagnostics.Trace.WriteLine("GetPSMSensorTypeIDs Error : " + strErrorMessage);
                return ids;
            }

            foreach (FacilityType type in types)
            {
                ids.Add(type.ID);
            }

            return ids;
        }

        private bool ReloadPSMSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<PSMSensor> psmSensors, out string strErrorMessage)
        {
            strErrorMessage = null;
            psmSensors = null;

            Dictionary<PSM.Fields, object> dicConditions = new Dictionary<PSM.Fields, object>();
            dicConditions[PSM.Fields.ZoneID] = nZoneID;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{PSMSensor.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            List<PSM> sensors = dataManager.GetSelectManager().SelectPSMSensors(dicConditions, strConditions, out strErrorMessage);

            if (sensors == null)
                return false;

            PSMSensor psmSensor;
            psmSensors = new List<PSMSensor>();

            foreach (PSM sensor in sensors)
            {
                if (m_dicPSMSensors.TryGetValue(sensor.ID, out psmSensor))
                {
                    psmSensor.Name = sensor.Name;
                    psmSensor.PositionName = sensor.PositionName;
                    psmSensor.Department = sensor.Department;
                    psmSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                    psmSensor.Enabled = sensor.Enabled;
                    psmSensor.Status = sensor.Status;
                    psmSensor.X = sensor.X;
                    psmSensor.Y = sensor.Y;
                    psmSensor.Z = sensor.Z;

                    psmSensors.Add(psmSensor);

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, psmSensor.ID);

                    if (psmSensor.Enabled != null && psmSensor.Enabled == false)
                    {
                        m_dicDisabledPSMSensors[psmSensor.ID] = psmSensor;
                    }
                    else
                    {
                        PSMSensor temp;
                        m_dicDisabledPSMSensors.TryRemove(psmSensor.ID, out temp);
                    }
                }
            }

            return true;
        }

        private bool LoadEtcSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            /*
            string strAdditionalConditions = string.Format("{0}.{1} not in ({2}, {3})", ETC.TableName, ETC.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.Earthquake, (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND);
            List<ETC> etcSensors = dataManager.GetSelectManager().SelectETCSensors(null, strAdditionalConditions, out strErrorMessage);

            if (etcSensors == null)
                return false;

            foreach (ETC etcSensor in etcSensors)
            {
                EtcSensor etc = new EtcSensor(etcSensor);

                Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                if (zone != null && zone.BuildingID != null)
                    etc.IsIndoor = true;
                else
                    etc.IsIndoor = false;

                if (zone != null)
                    etc.SiteID = zone.SiteID;

                etc.MaterialType = etcSensor.MaterialType;

                m_dicEtcSensors[etcSensor.ID] = etc;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.ETC, etc.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                {
                    m_dicDisabledEtcSensors[etcSensor.ID] = etc;
                }
            }
            */

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();            
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.ETC;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicEtcSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.ETC, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledEtcSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.ETC}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicEtcSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool ReloadEtcSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<EtcSensor> etcSensors, out string strErrorMessage)
        {
            etcSensors = null;
            /*
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.ZoneID] = nZoneID;

            string strAdditionalConditions = string.Format("{0}.{1} not in ({2}, {3})", ETC.TableName, ETC.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.Earthquake, (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND);

            List<ETC> sensors = dataManager.GetSelectManager().SelectETCSensors(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (sensors == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            foreach (ETC sensor in sensors)
            {
                if (m_dicEtcSensors.TryGetValue(sensor.ID, out etcSensor))
                {
                    etcSensor.Name = sensor.Name;
                    etcSensor.PositionName = sensor.PositionName;
                    etcSensor.Department = sensor.Department;
                    etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                    etcSensor.Enabled = sensor.Enabled;
                    etcSensor.MaterialType = sensor.MaterialType;
                    etcSensor.Status = sensor.Status;
                    etcSensor.X = sensor.X;
                    etcSensor.Y = sensor.Y;
                    etcSensor.Z = sensor.Z;


                    etcSensors.Add(etcSensor);

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.ETC, etcSensor.ID);

                    if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                    {
                        m_dicDisabledEtcSensors[etcSensor.ID] = etcSensor;
                    }
                    else
                    {
                        EtcSensor temp;
                        m_dicDisabledEtcSensors.TryRemove(etcSensor.ID, out temp);
                    }
                }
            }
            */
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.ETC;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC sensor = (ETC)arrDatas[i + 1];

                    if (m_dicEtcSensors.TryGetValue(sensor.ID, out etcSensor))
                    {
                        etcSensor.Name = sensor.Name;
                        etcSensor.PositionName = sensor.PositionName;
                        etcSensor.Department = sensor.Department;
                        etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                        etcSensor.Enabled = sensor.Enabled;
                        etcSensor.MaterialType = sensor.MaterialType;
                        etcSensor.Status = sensor.Status;
                        etcSensor.X = sensor.X;
                        etcSensor.Y = sensor.Y;
                        etcSensor.Z = sensor.Z;


                        etcSensors.Add(etcSensor);

                        long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.ETC, etcSensor.ID);

                        if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                        {
                            m_dicDisabledEtcSensors[etcSensor.ID] = etcSensor;
                        }
                        else
                        {
                            EtcSensor temp;
                            m_dicDisabledEtcSensors.TryRemove(etcSensor.ID, out temp);
                        }
                    }
                }
            }

            return true;
        }

        /*private bool LoadSensorZones(IDataManager dataManager)
        {
            string strErrorMessage;
            List<SensorZone> sensorZones = dataManager.GetSelectManager().SelectSensorZones(null, null, out strErrorMessage);

            if (sensorZones == null)
                return false;

            foreach (SensorZone sensorZone in sensorZones)
            {
                m_dicSensorZones[sensorZone.ID] = sensorZone;
            }

            return true;
        }*/

        private bool LoadCCTVs(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            List<CCTV> cctvs = dataManager.GetSelectManager().SelectCCTVs(null, strConditions, out strErrorMessage);

            if (cctvs == null)
                return false;

            foreach (CCTV cctv in cctvs)
            {
                CCTVSensor cctvSensor = new CCTVSensor(cctv);
                m_dicCCTVs[cctv.ID] = cctvSensor;

                if (cctv.ZoneID.HasValue)
                {
                    Zone zone = spatialManager.GetZone(cctv.ZoneID.Value);

                    if (zone != null)
                        cctvSensor.SiteID = zone.SiteID;
                }
                else
                {
                    cctvSensor.SiteID = null;
                }
                
                if (cctv.Enabled != null && cctv.Enabled == false)
                {
                    m_dicDisabledCCTVs[cctv.ID] = cctvSensor;
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            dicConditions[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Intrusion_S1;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, null, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    CCTVSensor cctv;

                    if (sensorZone.OrgSensorID != null && m_dicCCTVs.TryGetValue((int)sensorZone.OrgSensorID, out cctv))
                    {
                        cctv.SensorTagInfoID = tagInfo.ID;
                        cctv.SensorZoneID = sensorZone.ID;
                        cctv.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool ReloadCCTVs(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<CCTVSensor> cctvSensors, out string strErrorMessage)
        {
            cctvSensors = null;

            Dictionary<CCTV.Fields, object> dicConditions = new Dictionary<CCTV.Fields, object>();
            dicConditions[CCTV.Fields.ZoneID] = nZoneID;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{CCTV.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            List<CCTV> sensors = dataManager.GetSelectManager().SelectCCTVs(dicConditions, strConditions, out strErrorMessage);

            if (sensors == null)
                return false;

            CCTVSensor cctvSensor;
            cctvSensors = new List<CCTVSensor>();

            foreach (CCTV sensor in sensors)
            {
                if (m_dicCCTVs.TryGetValue(sensor.ID, out cctvSensor))
                {
                    cctvSensor.CameraName = sensor.CameraName;
                    cctvSensor.PositionName = sensor.PositionName;
                    cctvSensor.Enabled = sensor.Enabled;
                    cctvSensor.Type = sensor.Type;
                    cctvSensor.URL = sensor.URL;
                    cctvSensor.BigURL = sensor.BigURL;
                    cctvSensor.SmallURL = sensor.SmallURL;
                    cctvSensor.X = sensor.X;
                    cctvSensor.Y = sensor.Y;
                    cctvSensor.Z = sensor.Z;

                    cctvSensors.Add(cctvSensor);

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.CCTV, cctvSensor.ID);

                    if (cctvSensor.Enabled != null && cctvSensor.Enabled == false)
                    {
                        m_dicDisabledCCTVs[cctvSensor.ID] = cctvSensor;
                    }
                    else
                    {
                        CCTVSensor temp;
                        m_dicDisabledCCTVs.TryRemove(cctvSensor.ID, out temp);
                    }
                }
            }

            return true;
        }

        private bool LoadEarthquakeSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            /*
            string strAdditionalConditions = string.Format("{0}.{1} in ({2})", ETC.TableName, ETC.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.Earthquake);
            List<ETC> etcSensors = dataManager.GetSelectManager().SelectETCSensors(null, strAdditionalConditions, out strErrorMessage);

            if (etcSensors == null)
                return false;

            foreach (ETC etcSensor in etcSensors)
            {
                EtcSensor etc = new EtcSensor(etcSensor);

                Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                if (zone != null && zone.BuildingID != null)
                    etc.IsIndoor = true;
                else
                    etc.IsIndoor = false;

                if (zone != null)
                    etc.SiteID = zone.SiteID;

                etc.MaterialType = etcSensor.MaterialType;

                m_dicEarthquakeSensors[etcSensor.ID] = etc;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Earthquake, etc.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                {
                    m_dicDisabledEarthquakeSensors[etcSensor.ID] = etc;
                }
            }
            */
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Earthquake;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicEarthquakeSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Earthquake, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledEarthquakeSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.Earthquake}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicEarthquakeSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool ReloadEarthquakeSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<EtcSensor> etcSensors, out string strErrorMessage)
        {
            etcSensors = null;
            /*
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.ZoneID] = nZoneID;

            string strAdditionalConditions = string.Format("{0}.{1} in ({2})", ETC.TableName, ETC.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.Earthquake);

            List<ETC> sensors = dataManager.GetSelectManager().SelectETCSensors(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (sensors == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            foreach (ETC sensor in sensors)
            {
                if (m_dicEarthquakeSensors.TryGetValue(sensor.ID, out etcSensor))
                {
                    etcSensor.Name = sensor.Name;
                    etcSensor.PositionName = sensor.PositionName;
                    etcSensor.Department = sensor.Department;
                    etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                    etcSensor.Enabled = sensor.Enabled;
                    etcSensor.MaterialType = sensor.MaterialType;
                    etcSensor.Status = sensor.Status;
                    etcSensor.X = sensor.X;
                    etcSensor.Y = sensor.Y;
                    etcSensor.Z = sensor.Z;


                    etcSensors.Add(etcSensor);

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Earthquake, etcSensor.ID);

                    if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                    {
                        m_dicDisabledEarthquakeSensors[etcSensor.ID] = etcSensor;
                    }
                    else
                    {
                        EtcSensor temp;
                        m_dicDisabledEarthquakeSensors.TryRemove(etcSensor.ID, out temp);
                    }
                }
            }
            */
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Earthquake;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC sensor = (ETC)arrDatas[i + 1];

                    if (m_dicEtcSensors.TryGetValue(sensor.ID, out etcSensor))
                    {
                        etcSensor.Name = sensor.Name;
                        etcSensor.PositionName = sensor.PositionName;
                        etcSensor.Department = sensor.Department;
                        etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                        etcSensor.Enabled = sensor.Enabled;
                        etcSensor.MaterialType = sensor.MaterialType;
                        etcSensor.Status = sensor.Status;
                        etcSensor.X = sensor.X;
                        etcSensor.Y = sensor.Y;
                        etcSensor.Z = sensor.Z;


                        etcSensors.Add(etcSensor);

                        long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Earthquake, etcSensor.ID);

                        if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                        {
                            m_dicDisabledEarthquakeSensors[etcSensor.ID] = etcSensor;
                        }
                        else
                        {
                            EtcSensor temp;
                            m_dicDisabledEarthquakeSensors.TryRemove(etcSensor.ID, out temp);
                        }
                    }
                }
            }

            return true;
        }

        private bool LoadStrongWindSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            /*
            string strAdditionalConditions = string.Format("{0}.{1} in ({2})", ETC.TableName, ETC.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND);
            List<ETC> etcSensors = dataManager.GetSelectManager().SelectETCSensors(null, strAdditionalConditions, out strErrorMessage);

            if (etcSensors == null)
                return false;

            foreach (ETC etcSensor in etcSensors)
            {
                EtcSensor etc = new EtcSensor(etcSensor);

                Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                if (zone != null && zone.BuildingID != null)
                    etc.IsIndoor = true;
                else
                    etc.IsIndoor = false;

                if (zone != null)
                    etc.SiteID = zone.SiteID;

                etc.MaterialType = etcSensor.MaterialType;

                m_dicStrongWindSensors[etcSensor.ID] = etc;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND, etc.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                {
                    m_dicDisabledStrongWindSensors[etcSensor.ID] = etc;
                }
            }
            */
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicStrongWindSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledStrongWindSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicStrongWindSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool ReloadStrongWindSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<EtcSensor> etcSensors, out string strErrorMessage)
        {
            etcSensors = null;
            /*
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.ZoneID] = nZoneID;

            string strAdditionalConditions = string.Format("{0}.{1} in ({2})", ETC.TableName, ETC.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND);

            List<ETC> sensors = dataManager.GetSelectManager().SelectETCSensors(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (sensors == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            foreach (ETC sensor in sensors)
            {
                if (m_dicStrongWindSensors.TryGetValue(sensor.ID, out etcSensor))
                {
                    etcSensor.Name = sensor.Name;
                    etcSensor.PositionName = sensor.PositionName;
                    etcSensor.Department = sensor.Department;
                    etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                    etcSensor.Enabled = sensor.Enabled;
                    etcSensor.MaterialType = sensor.MaterialType;
                    etcSensor.Status = sensor.Status;
                    etcSensor.X = sensor.X;
                    etcSensor.Y = sensor.Y;
                    etcSensor.Z = sensor.Z;


                    etcSensors.Add(etcSensor);

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Earthquake, etcSensor.ID);

                    if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                    {
                        m_dicDisabledStrongWindSensors[etcSensor.ID] = etcSensor;
                    }
                    else
                    {
                        EtcSensor temp;
                        m_dicDisabledStrongWindSensors.TryRemove(etcSensor.ID, out temp);
                    }
                }
            }
            */
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC sensor = (ETC)arrDatas[i + 1];

                    if (m_dicEtcSensors.TryGetValue(sensor.ID, out etcSensor))
                    {
                        etcSensor.Name = sensor.Name;
                        etcSensor.PositionName = sensor.PositionName;
                        etcSensor.Department = sensor.Department;
                        etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                        etcSensor.Enabled = sensor.Enabled;
                        etcSensor.MaterialType = sensor.MaterialType;
                        etcSensor.Status = sensor.Status;
                        etcSensor.X = sensor.X;
                        etcSensor.Y = sensor.Y;
                        etcSensor.Z = sensor.Z;


                        etcSensors.Add(etcSensor);

                        long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND, etcSensor.ID);

                        if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                        {
                            m_dicDisabledStrongWindSensors[etcSensor.ID] = etcSensor;
                        }
                        else
                        {
                            EtcSensor temp;
                            m_dicDisabledStrongWindSensors.TryRemove(etcSensor.ID, out temp);
                        }
                    }
                }
            }

            return true;
        }

        private bool LoadEnvironmentSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Environment;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicEnvironmentSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Environment, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledEnvironmentSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.Environment}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicEnvironmentSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool ReloadEnvironmentSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<EtcSensor> etcSensors, out string strErrorMessage)
        {
            etcSensors = null;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Environment;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC sensor = (ETC)arrDatas[i + 1];

                    if (m_dicEtcSensors.TryGetValue(sensor.ID, out etcSensor))
                    {
                        etcSensor.Name = sensor.Name;
                        etcSensor.PositionName = sensor.PositionName;
                        etcSensor.Department = sensor.Department;
                        etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                        etcSensor.Enabled = sensor.Enabled;
                        etcSensor.MaterialType = sensor.MaterialType;
                        etcSensor.Status = sensor.Status;
                        etcSensor.X = sensor.X;
                        etcSensor.Y = sensor.Y;
                        etcSensor.Z = sensor.Z;


                        etcSensors.Add(etcSensor);

                        long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Environment, etcSensor.ID);

                        if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                        {
                            m_dicDisabledEnvironmentSensors[etcSensor.ID] = etcSensor;
                        }
                        else
                        {
                            EtcSensor temp;
                            m_dicDisabledEnvironmentSensors.TryRemove(etcSensor.ID, out temp);
                        }
                    }
                }
            }

            return true;
        }

        private bool LoadManufactureSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Manufacture;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicManufactureSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Manufacture, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledManufactureSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.Manufacture}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicManufactureSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool LoadSpeedDetectionSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.SpeedDetection;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicSpeedDetectionSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.SpeedDetection, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledSpeedDetectionSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.SpeedDetection}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicSpeedDetectionSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool LoadEmergencyBellSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.EmergencyBell;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicEmergencyBellSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.EmergencyBell, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledEmergencyBellSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.EmergencyBell}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicEmergencyBellSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }
        
        private bool LoadLaserSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Laser;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicLaserSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Laser, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledLaserSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.Laser}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicLaserSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }
        
        private bool LoadDoorSensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.DOOR;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicDoorSensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.DOOR, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledDoorSensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.DOOR}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicDoorSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool LoadLowBatterySensors(IDataManager dataManager, SpatialManager spatialManager, List<int> siteIDs)
        {
            string strErrorMessage;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.LowBattery;

            string strConditions = string.Empty;
            if (siteIDs?.Count > 0)
                strConditions = $"{Fire.Fields.SiteID} in ({string.Join(",", siteIDs)})";

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC etcSensor = (ETC)arrDatas[i + 1];

                    EtcSensor etc = new EtcSensor(etcSensor);

                    Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                    if (zone != null && zone.BuildingID != null)
                        etc.IsIndoor = true;
                    else
                        etc.IsIndoor = false;

                    if (zone != null)
                        etc.SiteID = zone.SiteID;

                    etc.MaterialType = etcSensor.MaterialType;

                    m_dicLowBatterySensors[etcSensor.ID] = etc;

                    long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.LowBattery, etc.ID);

                    if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                    {
                        m_dicDisabledLowBatterySensors[etcSensor.ID] = etc;
                    }
                }
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            string strAdditionalConditions = $"SensorType = {(int)dnsData.Sensor.Facility.FacilityType.LowBattery}";

            arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    EtcSensor etc;

                    if (sensorZone.OrgSensorID != null && m_dicDoorSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        etc.FacilityType = sensorZone.SensorType;
                        etc.EquipZoneID = sensorZone.EquipZoneID;
                    }
                }
            }

            return true;
        }

        private bool ReloadManufactureSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<EtcSensor> etcSensors, out string strErrorMessage)
        {
            etcSensors = null;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Manufacture;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC sensor = (ETC)arrDatas[i + 1];

                    if (m_dicManufactureSensors.TryGetValue(sensor.ID, out etcSensor))
                    {
                        etcSensor.Name = sensor.Name;
                        etcSensor.PositionName = sensor.PositionName;
                        etcSensor.Department = sensor.Department;
                        etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                        etcSensor.Enabled = sensor.Enabled;
                        etcSensor.MaterialType = sensor.MaterialType;
                        etcSensor.Status = sensor.Status;
                        etcSensor.X = sensor.X;
                        etcSensor.Y = sensor.Y;
                        etcSensor.Z = sensor.Z;


                        etcSensors.Add(etcSensor);

                        long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.Manufacture, etcSensor.ID);

                        if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                        {
                            m_dicDisabledManufactureSensors[etcSensor.ID] = etcSensor;
                        }
                        else
                        {
                            EtcSensor temp;
                            m_dicDisabledManufactureSensors.TryRemove(etcSensor.ID, out temp);
                        }
                    }
                }
            }

            return true;
        }

        private bool ReloadSpeedDetectionSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<EtcSensor> etcSensors, out string strErrorMessage)
        {
            etcSensors = null;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.SpeedDetection;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC sensor = (ETC)arrDatas[i + 1];

                    if (m_dicSpeedDetectionSensors.TryGetValue(sensor.ID, out etcSensor))
                    {
                        etcSensor.Name = sensor.Name;
                        etcSensor.PositionName = sensor.PositionName;
                        etcSensor.Department = sensor.Department;
                        etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                        etcSensor.Enabled = sensor.Enabled;
                        etcSensor.MaterialType = sensor.MaterialType;
                        etcSensor.Status = sensor.Status;
                        etcSensor.X = sensor.X;
                        etcSensor.Y = sensor.Y;
                        etcSensor.Z = sensor.Z;


                        etcSensors.Add(etcSensor);

                        long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.SpeedDetection, etcSensor.ID);

                        if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                        {
                            m_dicDisabledSpeedDetectionSensors[etcSensor.ID] = etcSensor;
                        }
                        else
                        {
                            EtcSensor temp;
                            m_dicDisabledSpeedDetectionSensors.TryRemove(etcSensor.ID, out temp);
                        }
                    }
                }
            }

            return true;
        }

        private bool ReloadEmergencyBellSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, out List<EtcSensor> etcSensors, out string strErrorMessage)
        {
            etcSensors = null;
            Dictionary<SensorZone.Fields, object> dicConditions1 = new Dictionary<SensorZone.Fields, object>();
            dicConditions1[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.EmergencyBell;

            string strConditions = string.Empty;
            /*if (siteIDs?.Count > 0)
            {
                strConditions = $"{ETC.Fields.SiteID} in ({string.Join(",", siteIDs)})";
            }*/

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
            if (arrDatas == null)
                return false;

            EtcSensor etcSensor;
            etcSensors = new List<EtcSensor>();

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    ETC sensor = (ETC)arrDatas[i + 1];

                    if (m_dicEmergencyBellSensors.TryGetValue(sensor.ID, out etcSensor))
                    {
                        etcSensor.Name = sensor.Name;
                        etcSensor.PositionName = sensor.PositionName;
                        etcSensor.Department = sensor.Department;
                        etcSensor.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
                        etcSensor.Enabled = sensor.Enabled;
                        etcSensor.MaterialType = sensor.MaterialType;
                        etcSensor.Status = sensor.Status;
                        etcSensor.X = sensor.X;
                        etcSensor.Y = sensor.Y;
                        etcSensor.Z = sensor.Z;


                        etcSensors.Add(etcSensor);

                        long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.EmergencyBell, etcSensor.ID);

                        if (etcSensor.Enabled != null && etcSensor.Enabled == false)
                        {
                            m_dicDisabledEmergencyBellSensors[etcSensor.ID] = etcSensor;
                        }
                        else
                        {
                            EtcSensor temp;
                            m_dicDisabledEmergencyBellSensors.TryRemove(etcSensor.ID, out temp);
                        }
                    }
                }
            }

            return true;
        }

        public bool MoveSensor(IDataManager dataManager, string strSensorType, int nSensorID, float x, float z, out string strErrorMessage)
        {
            if (strSensorType == FireSensorType)
            {
                Fire sensor = dataManager.GetSelectManager().SelectFireSensor(nSensorID, out strErrorMessage);

                if (sensor == null)
                {
                    if (strErrorMessage != null)
                        return false;
                    else
                    {
                        strErrorMessage = string.Format("[{0}] Sensor ID {1}에 해당하는 센서가 존재하지 않습니다.", strSensorType, nSensorID);
                        return false;
                    }
                }

                sensor.X = x;
                sensor.Z = z;
                return dataManager.GetUpdateManager().UpdateFireSensor(sensor, out strErrorMessage);
            }
            else if (strSensorType == PSMSensorType)
            {
                PSM sensor = dataManager.GetSelectManager().SelectPSMSensor(nSensorID, out strErrorMessage);

                if (sensor == null)
                {
                    if (strErrorMessage != null)
                        return false;
                    else
                    {
                        strErrorMessage = string.Format("[{0}] Sensor ID {1}에 해당하는 센서가 존재하지 않습니다.", strSensorType, nSensorID);
                        return false;
                    }
                }

                sensor.X = x;
                sensor.Z = z;
                return dataManager.GetUpdateManager().UpdatePSMSensor(sensor, out strErrorMessage);
            }
            else if (strSensorType == EtcSensorType)
            {
                ETC sensor = dataManager.GetSelectManager().SelectETCSensor(nSensorID, out strErrorMessage);

                if (sensor == null)
                {
                    if (strErrorMessage != null)
                        return false;
                    else
                    {
                        strErrorMessage = string.Format("[{0}] Sensor ID {1}에 해당하는 센서가 존재하지 않습니다.", strSensorType, nSensorID);
                        return false;
                    }
                }

                sensor.X = x;
                sensor.Z = z;
                return dataManager.GetUpdateManager().UpdateETCSensor(sensor, out strErrorMessage);
            }
            else if (strSensorType.StartsWith(CCTVType))
            {
                CCTV cctv = dataManager.GetSelectManager().SelectCCTV(nSensorID, out strErrorMessage);

                if (cctv == null)
                {
                    if (strErrorMessage != null)
                        return false;
                    else
                    {
                        strErrorMessage = string.Format("[{0}] Sensor ID {1}에 해당하는 센서가 존재하지 않습니다.", strSensorType, nSensorID);
                        return false;
                    }
                }

                cctv.X = x;
                cctv.Z = z;
                return dataManager.GetUpdateManager().UpdateCCTV(cctv, out strErrorMessage);
            }

            strErrorMessage = "알려지지 않은 센서타입입니다. : " + strSensorType;
            return false;
        }

        public void CheckDisabledSensors(IDataManager dataManager)
        {
            ReadDisabledSenosrZones(dataManager);
            ReadDisabledFireSensors(dataManager);
            ReadDisabledPSMSensors(dataManager);
            ReadDisabledEtcSensors(dataManager);
            ReadDisabledCCTVs(dataManager);
        }

        private bool ReadDisabledFireSensors(IDataManager dataManager)
        {
            Dictionary<Fire.Fields, object> dicConditions = new Dictionary<Fire.Fields, object>();
            dicConditions[Fire.Fields.Enabled] = false;

            string strErrorMessage;
            List<Fire> fireSensors = dataManager.GetSelectManager().SelectFireSensors(dicConditions, null, out strErrorMessage);

            if (fireSensors == null)
                return false;

            Dictionary<int, int> prevIDs = new Dictionary<int, int>();
            Dictionary<int, FireSensor> disabledSensors = new Dictionary<int, FireSensor>();

            foreach (int id in m_dicDisabledFireSensors.Keys)
            {
                prevIDs[id] = id;
            }

            foreach (Fire sensor in fireSensors)
            {
                prevIDs.Remove(sensor.ID);

                FireSensor fire = new FireSensor(sensor);
                disabledSensors[sensor.ID] = fire;
            }

            FireSensor temp;

            foreach (KeyValuePair<int, int> pair in prevIDs)
            {
                m_dicDisabledFireSensors.TryRemove(pair.Key, out temp);
            }

            foreach (KeyValuePair<int, FireSensor> pair in disabledSensors)
            {
                m_dicDisabledFireSensors[pair.Key] = pair.Value;
            }

            foreach (KeyValuePair<long, TagInfo> pair in m_dicDisabledTypeSensorTagInfos)
            {
                int nSensorID;
                int nSensorType = GetSensorType(pair.Key, out nSensorID);
                dnsData.Sensor.Facility.FacilityType type = dnsData.Sensor.Facility.ToFacilityType(nSensorType);

                if (dnsData.Sensor.Facility.IsFireSensorType(type))
                {
                    FireSensor fire;

                    if (m_dicFireSensors.TryGetValue(nSensorID, out fire))
                    {
                        m_dicDisabledFireSensors[nSensorID] = fire;
                    }
                }
            }

            return true;
        }

        private bool ReadDisabledPSMSensors(IDataManager dataManager)
        {
            Dictionary<PSM.Fields, object> dicConditions = new Dictionary<PSM.Fields, object>();
            dicConditions[PSM.Fields.Enabled] = false;

            string strErrorMessage;
            List<PSM> psmSensors = dataManager.GetSelectManager().SelectPSMSensors(dicConditions, null, out strErrorMessage);

            if (psmSensors == null)
                return false;

            Dictionary<int, int> prevIDs = new Dictionary<int, int>();
            Dictionary<int, PSMSensor> disabledSensors = new Dictionary<int, PSMSensor>();

            foreach (int id in m_dicDisabledPSMSensors.Keys)
            {
                prevIDs[id] = id;
            }

            foreach (PSM sensor in psmSensors)
            {
                prevIDs.Remove(sensor.ID);
                PSMSensor psmData = new PSMSensor(sensor);

                disabledSensors[sensor.ID] = psmData;
            }

            PSMSensor temp;

            foreach (KeyValuePair<int, int> pair in prevIDs)
            {
                m_dicDisabledPSMSensors.TryRemove(pair.Key, out temp);
            }

            foreach (KeyValuePair<int, PSMSensor> pair in disabledSensors)
            {
                m_dicDisabledPSMSensors[pair.Key] = pair.Value;
            }

            foreach (KeyValuePair<long, TagInfo> pair in m_dicDisabledTypeSensorTagInfos)
            {
                int nSensorID;
                int nSensorType = GetSensorType(pair.Key, out nSensorID);
                dnsData.Sensor.Facility.FacilityType type = dnsData.Sensor.Facility.ToFacilityType(nSensorType);

                if (dnsData.Sensor.Facility.IsPSMSensorType(type))
                {
                    PSMSensor psm;

                    if (m_dicPSMSensors.TryGetValue(nSensorID, out psm))
                    {
                        m_dicDisabledPSMSensors[nSensorID] = psm;
                    }
                }
            }

            return true;
        }

        private bool ReadDisabledEtcSensors(IDataManager dataManager)
        {
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.Enabled] = false;

            string strErrorMessage;
            List<ETC> etcSensors = dataManager.GetSelectManager().SelectETCSensors(dicConditions, null, out strErrorMessage);

            if (etcSensors == null)
                return false;

            Dictionary<int, int> prevIDs = new Dictionary<int, int>();
            Dictionary<int, EtcSensor> disabledSensors = new Dictionary<int, EtcSensor>();

            foreach (int id in m_dicDisabledEtcSensors.Keys)
            {
                prevIDs[id] = id;
            }

            foreach (ETC sensor in etcSensors)
            {
                prevIDs.Remove(sensor.ID);
                EtcSensor etc = new EtcSensor(sensor);

                disabledSensors[sensor.ID] = etc;
            }

            EtcSensor temp;

            foreach (KeyValuePair<int, int> pair in prevIDs)
            {
                m_dicDisabledEtcSensors.TryRemove(pair.Key, out temp);
            }

            foreach (KeyValuePair<int, EtcSensor> pair in disabledSensors)
            {
                m_dicDisabledEtcSensors[pair.Key] = pair.Value;
            }

            foreach (KeyValuePair<long, TagInfo> pair in m_dicDisabledTypeSensorTagInfos)
            {
                int nSensorID;
                int nSensorType = GetSensorType(pair.Key, out nSensorID);
                dnsData.Sensor.Facility.FacilityType type = dnsData.Sensor.Facility.ToFacilityType(nSensorType);

                if (dnsData.Sensor.Facility.IsETCSensorType(type))
                {
                    EtcSensor etc;

                    if (m_dicEtcSensors.TryGetValue(nSensorID, out etc))
                    {
                        m_dicDisabledEtcSensors[nSensorID] = etc;
                    }
                }
            }

            return true;
        }

        private bool ReadDisabledCCTVs(IDataManager dataManager)
        {
            Dictionary<CCTV.Fields, object> dicConditions = new Dictionary<CCTV.Fields, object>();
            dicConditions[CCTV.Fields.Enabled] = false;

            string strErrorMessage;
            List<CCTV> cctvSensors = dataManager.GetSelectManager().SelectCCTVs(dicConditions, null, out strErrorMessage);

            if (cctvSensors == null)
                return false;

            Dictionary<int, int> prevIDs = new Dictionary<int, int>();
            Dictionary<int, CCTVSensor> disabledSensors = new Dictionary<int, CCTVSensor>();

            foreach (int id in m_dicDisabledCCTVs.Keys)
            {
                prevIDs[id] = id;
            }

            foreach (CCTV sensor in cctvSensors)
            {
                prevIDs.Remove(sensor.ID);
                CCTVSensor cctvSensor = new CCTVSensor(sensor);

                disabledSensors[sensor.ID] = cctvSensor;
            }

            CCTVSensor temp;

            foreach (KeyValuePair<int, int> pair in prevIDs)
            {
                m_dicDisabledCCTVs.TryRemove(pair.Key, out temp);
            }

            foreach (KeyValuePair<int, CCTVSensor> pair in disabledSensors)
            {
                m_dicDisabledCCTVs[pair.Key] = pair.Value;
            }

            return true;
        }

        private bool ReadDisabledSenosrZones(IDataManager dataManager)
        {
            Dictionary<TagInfo.Fields, object> dicConditions = new Dictionary<TagInfo.Fields, object>();
            dicConditions[TagInfo.Fields.Activate] = false;

            string strErrorMessage;
            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(null, dicConditions, null, out strErrorMessage);

            if (arrDatas == null)
                return false;

            Dictionary<long, long> prevKeys = new Dictionary<long, long>();
            
            foreach (long key in m_dicDisabledTypeSensorTagInfos.Keys)
            {
                prevKeys[key] = key;
            }

            int nDataCount = arrDatas.Count;
            Dictionary<long, TagInfo> disabledTagInfos = new Dictionary<long, TagInfo>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tag = (TagInfo)arrDatas[i + 1];

                    long key = GetSensorTypeKey(sensorZone.SensorType, (int)sensorZone.OrgSensorID);
                    disabledTagInfos[key] = tag;

                    prevKeys.Remove(key);
                }
            }

            TagInfo temp;

            foreach (KeyValuePair<long, long> pair in prevKeys)
            {
                m_dicDisabledTypeSensorTagInfos.TryRemove(pair.Key, out temp);
            }

            foreach (KeyValuePair<long, TagInfo> pair in disabledTagInfos)
            {
                m_dicDisabledTypeSensorTagInfos[pair.Key] = pair.Value;
            }

            return true;
        }

        public bool ReloadSensors(IDataManager dataManager, int nZoneID, List<int> siteIDs, 
            out List<FireSensor> fireSensors, 
            out List<PSMSensor> psmSensors, 
            out List<EtcSensor> etcSensors, 
            out List<CCTVSensor> cctvSensors, 
            out List<EtcSensor> earthquakeSensors, 
            out List<EtcSensor> strongWindSensors, 
            out List<EtcSensor> environmentSensors, 
            out List<EtcSensor> manufactureSensors,
            out List<EtcSensor> emergencyBellSensors,
            out List<EtcSensor> speedDetectionSensors,
            out string strErrorMessage)
        {
            psmSensors = null;
            etcSensors = null;
            cctvSensors = null;
            earthquakeSensors = null;
            strongWindSensors = null;
            environmentSensors = null;
            manufactureSensors = null;
            emergencyBellSensors = null;
            speedDetectionSensors = null;

            if (ReloadFireSensors(dataManager, nZoneID, siteIDs, out fireSensors, out strErrorMessage) == false)
                return false;
            if (ReloadPSMSensors(dataManager, nZoneID, siteIDs, out psmSensors, out strErrorMessage) == false)
                return false;
            if (ReloadEtcSensors(dataManager, nZoneID, siteIDs, out etcSensors, out strErrorMessage) == false)
                return false;
            if (ReloadCCTVs(dataManager, nZoneID, siteIDs, out cctvSensors, out strErrorMessage) == false)
                return false;
            if (ReloadEarthquakeSensors(dataManager, nZoneID, siteIDs, out earthquakeSensors, out strErrorMessage) == false)
                return false;
            if (ReloadStrongWindSensors(dataManager, nZoneID, siteIDs, out strongWindSensors, out strErrorMessage) == false)
                return false;
            if (ReloadEnvironmentSensors(dataManager, nZoneID, siteIDs, out environmentSensors, out strErrorMessage) == false)
                return false;
            if (ReloadManufactureSensors(dataManager, nZoneID, siteIDs, out manufactureSensors, out strErrorMessage) == false)
                return false;
            if (ReloadEmergencyBellSensors(dataManager, nZoneID, siteIDs, out emergencyBellSensors, out strErrorMessage) == false)
                return false;
            if (ReloadSpeedDetectionSensors(dataManager, nZoneID, siteIDs, out speedDetectionSensors, out strErrorMessage) == false)
                return false;

            return true;
        }

        public static bool IsFireSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, FireSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsPSMSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, PSMSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsEtcSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, EtcSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsEnvironmentSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, EnvironmentSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsManufactureSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, ManufactureSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsSpeedDetectionSensor(string strSensorType)
        {
            if (string.Compare(strSensorType, SpeedDetectionSensorType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public static bool IsCCTVType(string strSensorType)
        {
            if (strSensorType.StartsWith(CCTVType))
            //if (string.Compare(strSensorType, CCTVType, true) == 0)
            {
                return true;
            }

            return false;
        }

        public async static void ReadRangeSensors(IDataManager dataManager)
        {
            if (m_readRangeSensors)
                return;

            m_readRangeSensors = true;
            ConcurrentDictionary<int, RangeSensor> dicRangePSMSensors = new ConcurrentDictionary<int, RangeSensor>();
            ConcurrentDictionary<int, RangeSensor> dicRangeETCSensors = new ConcurrentDictionary<int, RangeSensor>();

            Dictionary<int, BuildingGroup> dicBuildingGroups = new Dictionary<int, BuildingGroup>();
            Dictionary<int, Building> dicBuildings = new Dictionary<int, Building>();
            Dictionary<int, Zone> dicZones = new Dictionary<int, Zone>();
            Dictionary<int, EquipmentZone> dicEquipZones = new Dictionary<int, EquipmentZone>();

            string strErrorMessage = await ReadBuildingGroups(dataManager, dicBuildingGroups);

            if (strErrorMessage == null)
            {
                strErrorMessage = await ReadBuildings(dataManager, dicBuildings);

                if (strErrorMessage == null)
                {
                    strErrorMessage = await ReadZones(dataManager, dicZones);

                    if (strErrorMessage == null)
                    {
                        strErrorMessage = await ReadEquipZones(dataManager, dicEquipZones);

                        if (strErrorMessage == null)
                        {
                            Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();
                            strErrorMessage = await ReadMaterials(dataManager, dicMaterials);

                            if (strErrorMessage == null)
                            {
                                strErrorMessage = await ReadPSMSensors(dataManager, dicMaterials, dicBuildingGroups, dicBuildings, dicZones, dicEquipZones, dicRangePSMSensors);

                                if (strErrorMessage != null)
                                {
                                    System.Diagnostics.Trace.WriteLine("ReadRangeSensors Error : " + strErrorMessage);
                                    dicRangePSMSensors.Clear();
                                }

                                strErrorMessage = await ReadETCSensors(dataManager, dicMaterials, dicBuildingGroups, dicBuildings, dicZones, dicEquipZones, dicRangeETCSensors);

                                if (strErrorMessage != null)
                                {
                                    System.Diagnostics.Trace.WriteLine("ReadRangeSensors Error : " + strErrorMessage);
                                    dicRangeETCSensors.Clear();
                                }
                            }
                        }
                    }
                }
            }

            m_strRangeSensorErrorMessage = strErrorMessage;
            m_dicRangePSMSensors = dicRangePSMSensors;
            m_dicRangeETCSensors = dicRangeETCSensors;

            // 대기시간
            System.Threading.Thread.Sleep(1500);
            m_readRangeSensors = false;
        }

        private async static Task<string> ReadBuildingGroups(IDataManager dataManager, Dictionary<int, BuildingGroup> dicBuildingGroups)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            string strErrorMessage;
            List<BuildingGroup> buildingGroups = dataManager.GetSelectManager().SelectBuildingGroups(null, null, out strErrorMessage);

            if (buildingGroups == null)
                return strErrorMessage;

            foreach (BuildingGroup buildingGroup in buildingGroups)
            {
                dicBuildingGroups[buildingGroup.ID] = buildingGroup;
            }

            return strErrorMessage;
        }

        private async static Task<string> ReadBuildings(IDataManager dataManager, Dictionary<int, Building> dicBuildings)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            string strErrorMessage;
            List<Building> buildings = dataManager.GetSelectManager().SelectBuildings(null, null, out strErrorMessage);

            if (buildings == null)
                return strErrorMessage;

            foreach (Building building in buildings)
            {
                dicBuildings[building.ID] = building;
            }

            return strErrorMessage;
        }

        private async static Task<string> ReadZones(IDataManager dataManager, Dictionary<int, Zone> dicZones)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            string strErrorMessage;
            List<Zone> zones = dataManager.GetSelectManager().SelectZones(null, null, out strErrorMessage);

            if (zones == null)
                return strErrorMessage;

            foreach (Zone zone in zones)
            {
                dicZones[zone.ID] = zone;
            }

            return strErrorMessage;
        }

        private async static Task<string> ReadEquipZones(IDataManager dataManager, Dictionary<int, EquipmentZone> dicEquipZones)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            string strErrorMessage;
            List<EquipmentZone> equipZones = dataManager.GetSelectManager().SelectEquipmentZones(null, null, out strErrorMessage);

            if (equipZones == null)
                return strErrorMessage;

            foreach (EquipmentZone zone in equipZones)
            {
                dicEquipZones[zone.ID] = zone;
            }

            return strErrorMessage;
        }

        private async static Task<string> ReadPSMSensors(IDataManager dataManager, Dictionary<int, Material> dicMaterials, Dictionary<int, BuildingGroup> dicBuildingGroups, Dictionary<int, Building> dicBuildings, Dictionary<int, Zone> dicZones, Dictionary<int, EquipmentZone> dicEquipZones, ConcurrentDictionary<int, RangeSensor> dicRangePSMSensors)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            Dictionary<PSM.Fields, object> dicConditions = new Dictionary<PSM.Fields, object>();
            //dicConditions[PSM.Fields.Enabled] = true;

            //bool isNullable;
            //string strAdditionalConditions = string.Format("({0} = 1 or {1} = 1 or {2} = 1)",
            //    PSM.GetFieldName(PSM.Fields.UseLimitLevel1, out isNullable),
            //    PSM.GetFieldName(PSM.Fields.UseLimitLevel2, out isNullable),
            //    PSM.GetFieldName(PSM.Fields.UseLimitLevel3, out isNullable));
            string strAdditionalConditions = string.Format("{0} Is Not NULL", PSM.Fields.LimitType);

            string strErrorMessage = null;
            List<PSM> psmSensors = dataManager.GetSelectManager().SelectPSMSensors(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (psmSensors == null)
                return strErrorMessage;

            BuildingGroup buildingGroup;
            Building building;
            Zone zone;
            EquipmentZone equipZone;
            Material material;

            foreach (PSM sensor in psmSensors)
            {
                RangeSensor rangeSensor = new RangeSensor();

                rangeSensor.EquipZoneID = sensor.EquipZoneID;
                rangeSensor.ID = sensor.ID;
                rangeSensor.Name = sensor.Name;
                rangeSensor.SensorType = "psm";
                rangeSensor.SensorTypeID = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;
                rangeSensor.UniqueKey = sensor.UniqueKey;
                rangeSensor.ZoneID = sensor.ZoneID;
                //rangeSensor.UseLimitLevel1 = sensor.UseLimitLevel1;
                //rangeSensor.UseLimitLevel2 = sensor.UseLimitLevel2;
                //rangeSensor.UseLimitLevel3 = sensor.UseLimitLevel3;
                rangeSensor.Status = sensor.Status;
                rangeSensor.Enabled = sensor.Enabled;

                if (sensor.LimitBase.HasValue)
                    rangeSensor.LimitBase = sensor.LimitBase.Value.ToString();
                rangeSensor.LimitType = sensor.LimitType;
                rangeSensor.LimitValue = sensor.LimitValue;

                if (sensor.EquipZoneID > 0)
                {
                    if (dicEquipZones.TryGetValue(sensor.EquipZoneID, out equipZone))
                        rangeSensor.EquipZoneName = equipZone.ZoneName;
                }

                if (dicZones.TryGetValue(rangeSensor.ZoneID, out zone))
                {
                    rangeSensor.ZoneName = zone.ZoneName;

                    if (zone.BuildingID != null && dicBuildings.TryGetValue((int)zone.BuildingID, out building))
                    {
                        rangeSensor.BuildingID = building.ID;
                        rangeSensor.BuildingName = building.BuildingName;

                        if (dicBuildingGroups.TryGetValue(building.BuildingGroupID, out buildingGroup))
                        {
                            rangeSensor.BuildingGroupID = buildingGroup.ID;
                            rangeSensor.BuildingGroupName = buildingGroup.GroupName;
                        }
                    }
                }

                if (sensor.CurrentData.HasValue)
                    rangeSensor.CurrentData = sensor.CurrentData.Value.ToString();

                //if (sensor.LimitLevel1 == null)
                //    rangeSensor.LimitLevel1 = null;
                //else
                //    rangeSensor.LimitLevel1 = (double)sensor.LimitLevel1;

                //if (sensor.LimitLevel2 == null)
                //    rangeSensor.LimitLevel2 = null;
                //else
                //    rangeSensor.LimitLevel2 = (double)sensor.LimitLevel2;

                //if (sensor.LimitLevel3 == null)
                //    rangeSensor.LimitLevel3 = null;
                //else
                //    rangeSensor.LimitLevel3 = (double)sensor.LimitLevel3;

                if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                {
                    rangeSensor.MaterialType = material.MaterialName;
                    rangeSensor.Uom = material.UOM;
                }

                //if ((sensor.UseLimitLevel1 && sensor.LimitLevel1 != null) ||
                //    (sensor.UseLimitLevel2 && sensor.LimitLevel2 != null) ||
                //    (sensor.UseLimitLevel3 && sensor.LimitLevel3 != null))
                dicRangePSMSensors[rangeSensor.ID] = rangeSensor;
            }

            return strErrorMessage;
        }

        private async static Task<string> ReadETCSensors(IDataManager dataManager, Dictionary<int, Material> dicMaterials, Dictionary<int, BuildingGroup> dicBuildingGroups, Dictionary<int, Building> dicBuildings, Dictionary<int, Zone> dicZones, Dictionary<int, EquipmentZone> dicEquipZones, ConcurrentDictionary<int, RangeSensor> dicRangeETCSensors)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            Dictionary<ETC.Fields, object> dicConditions_ETC = new Dictionary<ETC.Fields, object>();
            //dicConditions_ETC[ETC.Fields.Enabled] = true;

            string strAdditionalConditions = string.Format("{0} Is Not NULL", ETC.Fields.LimitType);

            string strErrorMessage = null;
            List<ETC> etcSensors = dataManager.GetSelectManager().SelectETCSensors(dicConditions_ETC, strAdditionalConditions, out strErrorMessage);

            if (etcSensors == null)
                return strErrorMessage;

            BuildingGroup buildingGroup;
            Building building;
            Zone zone;
            //EquipmentZone equipZone;
            Material material;

            foreach (ETC sensor in etcSensors)
            {
                RangeSensor rangeSensor = new RangeSensor();

                rangeSensor.ID = sensor.ID;
                rangeSensor.Name = sensor.Name;
                rangeSensor.SensorType = "etc";
                rangeSensor.SensorTypeID = (int)dnsData.Sensor.Facility.FacilityType.ETC;
                rangeSensor.UniqueKey = sensor.UniqueKey;
                rangeSensor.ZoneID = sensor.ZoneID;
                rangeSensor.Status = sensor.Status;
                rangeSensor.Enabled = sensor.Enabled;

                rangeSensor.LimitBase = sensor.LimitBase;
                rangeSensor.LimitType = sensor.LimitType;
                rangeSensor.LimitValue = sensor.LimitValue;


                if (dicZones.TryGetValue(rangeSensor.ZoneID, out zone))
                {
                    rangeSensor.ZoneName = zone.ZoneName;

                    if (zone.BuildingID != null && dicBuildings.TryGetValue((int)zone.BuildingID, out building))
                    {
                        rangeSensor.BuildingID = building.ID;
                        rangeSensor.BuildingName = building.BuildingName;

                        if (dicBuildingGroups.TryGetValue(building.BuildingGroupID, out buildingGroup))
                        {
                            rangeSensor.BuildingGroupID = buildingGroup.ID;
                            rangeSensor.BuildingGroupName = buildingGroup.GroupName;
                        }
                    }
                }

                rangeSensor.CurrentData = sensor.CurrentData;

                if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                {
                    rangeSensor.MaterialType = material.MaterialName;
                    rangeSensor.Uom = material.UOM;
                }

                dicRangeETCSensors[rangeSensor.ID] = rangeSensor;
            }

            return strErrorMessage;
        }

        private async static Task<string> ReadMaterials(IDataManager dataManager, Dictionary<int, Material> dicMaterials)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            string strErrorMessage = null;
            List<Material> materials = dataManager.GetSelectManager().SelectMaterials(null, null, out strErrorMessage);

            if (materials == null)
                return strErrorMessage;

            foreach (Material material in materials)
            {
                dicMaterials[material.ID] = material;
            }

            return strErrorMessage;
        }

        public static ResponseRangeSensors GetRangeSensors()
        {
            ResponseRangeSensors response = null;

            if (m_strRangeSensorErrorMessage == null)
            {
                response = new ResponseRangeSensors(true, "");
                response.Sensors = m_dicRangePSMSensors.Values;
                response.PsmSensors = m_dicRangePSMSensors.Values;
                response.EtcSensors = m_dicRangeETCSensors.Values;
            }
            else
                response = new ResponseRangeSensors(false, m_strRangeSensorErrorMessage);

            return response;
        }
    }
}
