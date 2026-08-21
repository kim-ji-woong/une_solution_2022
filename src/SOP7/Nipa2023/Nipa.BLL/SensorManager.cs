using System.Collections;
using System.Collections.Generic;
using System.Collections.Concurrent;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.DAL;
using Nipa.Model.Sdms.Sensor;
using Nipa.Model.Sdms.Spatial;
using Nipa.Model.Sdms.CCTV;

namespace Nipa.BLL
{
    using Models.Request;
    using Models.Response.SDMS;
    using Models;

    public class SensorManager
    {
        private const string FireSensorType = "fire";
        private const string PSMSensorType = "psm";
        private const string EtcSensorType = "etc";
        private const string CCTVType = "cctv";

        // 전체 화재센서
        private Dictionary<int, Dictionary<int, FireSensor>> m_dicSiteFireSensors = new Dictionary<int, Dictionary<int, FireSensor>>();
        // 사용하지 않는 화재센서
        private Dictionary<int, ConcurrentDictionary<int, Fire>> m_dicSiteDisabledFireSensors = new Dictionary<int, ConcurrentDictionary<int, Fire>>();

        // 전체 누출센서
        private Dictionary<int, Dictionary<int, PSMSensor>> m_dicSitePSMSensors = new Dictionary<int, Dictionary<int, PSMSensor>>();
        // 사용하지 않는 누출센서
        private Dictionary<int, ConcurrentDictionary<int, PSM>> m_dicSiteDisabledPSMSensors = new Dictionary<int, ConcurrentDictionary<int, PSM>>();

        // 전체 기타센서
        private Dictionary<int, Dictionary<int, EtcSensor>> m_dicSiteEtcSensors = new Dictionary<int, Dictionary<int, EtcSensor>>();
        // 사용하지 않는 기타센서
        private Dictionary<int, ConcurrentDictionary<int, ETC>> m_dicSiteDisabledEtcSensors = new Dictionary<int, ConcurrentDictionary<int, ETC>>();

        // 전체 CCTV
        private Dictionary<int, Dictionary<int, CCTVSensor>> m_dicSiteCCTVs = new Dictionary<int, Dictionary<int, CCTVSensor>>();
        // 사용하지 않는 CCTV
        private Dictionary<int, ConcurrentDictionary<int, CCTV>> m_dicSiteDisabledCCTVs = new Dictionary<int, ConcurrentDictionary<int, CCTV>>();

        private Dictionary<int, SensorZone> m_dicSensorZones = new Dictionary<int, SensorZone>();
        // 전체 SensorTagInfo
        private Dictionary<int, TagInfo> m_dicSensorTagInfos = new Dictionary<int, TagInfo>();
        // 센서 타입별 SensorTagInfo(m_dicSensorTagInfos와 개수는 동일함)
        // Key : 상위 4바이트(센서타입)
        //       하위 4바이트(Origin Sensor ID)
        private Dictionary<long, TagInfo> m_dicTypeSensorTagInfos = new Dictionary<long, TagInfo>();
        // 사용하지 않는 SensorTagInfo
        private ConcurrentDictionary<long, TagInfo> m_dicDisabledTypeSensorTagInfos = new ConcurrentDictionary<long, TagInfo>();

        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;

        public SensorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(m_dataManager);

        }

        public ResponseSensorList GetSensorList(RequestSensorList request)
        {
            //if (request.CampusID != 1)
            //    return MakeResponseSensorList(request, new List<FireSensor>(), new List<PSMSensor>(), new List<EtcSensor>(), new List<CCTVSensor>(), "");

            SpatialManager spatialManager = new SpatialManager(m_dataManager);
            string strErrorMessage;

            if (spatialManager.LoadSpatial(request.CampusID, out strErrorMessage) == false)
                return new ResponseSensorList(false, strErrorMessage);

            if (LoadSensorList(m_dataManager, spatialManager, request.CampusID) == false)
                return MakeResponseSensorList(request, null, null, null, null, null, null, null, "센서정보를 읽어올수 없습니다.");

            return MakeResponseSensorList(request, this.GetFireSensors(request.CampusID), this.GetGasSensors(request.CampusID), this.GetAtmosphereSensors(request.CampusID), this.GetEmergencyBells(request.CampusID), this.GetAPs(request.CampusID), this.GetThermalCCTVs(request.CampusID), this.GetCCTVs(request.CampusID), "");
        }

        private ResponseSensorList MakeResponseSensorList(RequestSensorList request, ICollection<FireSensor> fireSensors, ICollection<PSMSensor> gasSensors, ICollection<PSMSensor> atmosphereSensors, ICollection<EtcSensor> emergencyBells, ICollection<EtcSensor> aps, ICollection<CCTVSensor> thermalCCTVs, ICollection<CCTVSensor> cctvs, string strMessage)
        {
            ResponseSensorList response = new ResponseSensorList();

            response.Success = strMessage == null || strMessage.Length == 0;
            response.Message = strMessage;

            if (request.RequestFireSensors)
                response.FireSensors = MakeList<FireSensor>(fireSensors);

            if (request.RequestGasSensors)
                response.GasSensors = MakeList<PSMSensor>(gasSensors);

            if (request.RequestAtmosphereSensors)
                response.AtmosphereSensors = MakeList<PSMSensor>(atmosphereSensors);

            if (request.RequestEmergencyBells)
                response.EmergencyBells = MakeList<EtcSensor>(emergencyBells);

            if (request.RequestWorkerTags)
                response.Aps = MakeList<EtcSensor>(aps);

            if (request.RequestThermalCCTVs)
                response.ThermalCCTVs = MakeList<CCTVSensor>(thermalCCTVs);

            if (request.RequestCCTVs)
                response.Cctvs = MakeList<CCTVSensor>(cctvs);

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

        private bool LoadSensorList(IDataManager dataManager, SpatialManager spatialManager, int siteID)
        {
            bool success1 = LoadSensorTagInfo(dataManager, siteID);
            bool success2 = LoadFireSensors(dataManager, spatialManager, siteID);
            bool success3 = LoadPSMSensors(dataManager, spatialManager, siteID);
            bool success4 = LoadEtcSensors(dataManager, spatialManager, siteID);
            bool success5 = LoadCCTVs(dataManager, spatialManager, siteID);

            return success1 && success2 && success3 && success4 && success5;
        }

        private bool LoadSensorTagInfo(IDataManager dataManager, int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("a.{0} in (Select {1} from {2} where {3} = {4})",
                SensorZone.Fields.EquipZoneID,
                EquipmentZone.Fields.ID,
                EquipmentZone.TableName,
                EquipmentZone.Fields.SiteID, siteID);
            ArrayList arrDatas = m_joinManager.JoinSensorZoneTagInfo(strCondition, out strErrorMessage);

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

                    if (tagInfo.Activate == 1)
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

        private bool LoadFireSensors(IDataManager dataManager, SpatialManager spatialManager, int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                Fire.Fields.ZoneID,
                Zone.Fields.ID,
                Zone.TableName,
                Zone.Fields.SiteID, siteID);
            IEnumerable<Fire> fireSensors = dataManager.GetSelect().Select<Fire>(strCondition, out strErrorMessage);

            if (fireSensors == null)
                return false;

            Dictionary<int, FireSensor> dicFireSensors = null;
            ConcurrentDictionary<int, Fire> dicDisabledFireSensors = null;

            if (m_dicSiteFireSensors.TryGetValue(siteID, out dicFireSensors) == false)
            {
                dicFireSensors = new Dictionary<int, FireSensor>();
                m_dicSiteFireSensors[siteID] = dicFireSensors;
            }

            if (m_dicSiteDisabledFireSensors.TryGetValue(siteID, out dicDisabledFireSensors) == false)
            {
                dicDisabledFireSensors = new ConcurrentDictionary<int, Fire>();
                m_dicSiteDisabledFireSensors[siteID] = dicDisabledFireSensors;
            }

            foreach (Fire fireSensor in fireSensors)
            {
                Zone zone = spatialManager.GetZone(fireSensor.ZoneID);

                FireSensor fire = new FireSensor(fireSensor);

                if (zone != null && zone.BuildingID != null)
                    fire.IsIndoor = true;
                else
                    fire.IsIndoor = false;

                dicFireSensors[fireSensor.ID] = fire;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR, fireSensor.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (fire.Enabled != null && fire.Enabled == false))
                {
                    dicDisabledFireSensors[fireSensor.ID] = fire;
                }
            }

            strCondition = string.Format("a.{0} = {1}", SensorZone.Fields.SensorType.ToString(), (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR);
            ArrayList arrDatas = m_joinManager.JoinSensorZoneTagInfo(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    FireSensor fire;

                    if (dicFireSensors.TryGetValue((int)sensorZone.OrgSensorID, out fire))
                    {
                        fire.SensorTagInfoID = tagInfo.ID;
                        fire.SensorZoneID = sensorZone.ID;
                        fire.TagNo = tagInfo.TagNo;
                    }
                }
            }

            return true;
        }

        private bool LoadPSMSensors(IDataManager dataManager, SpatialManager spatialManager, int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                PSM.Fields.ZoneID,
                Zone.Fields.ID,
                Zone.TableName,
                Zone.Fields.SiteID, siteID);
            IEnumerable<PSM> psmSensors = dataManager.GetSelect().Select<PSM>(strCondition, out strErrorMessage);

            if (psmSensors == null)
                return false;

            Dictionary<int, PSMSensor> dicPSMSensors = null;
            ConcurrentDictionary<int, PSM> dicDisabledPSMSensors = null;

            if (m_dicSitePSMSensors.TryGetValue(siteID, out dicPSMSensors) == false)
            {
                dicPSMSensors = new Dictionary<int, PSMSensor>();
                m_dicSitePSMSensors[siteID] = dicPSMSensors;
            }

            if (m_dicSiteDisabledPSMSensors.TryGetValue(siteID, out dicDisabledPSMSensors) == false)
            {
                dicDisabledPSMSensors = new ConcurrentDictionary<int, PSM>();
                m_dicSiteDisabledPSMSensors[siteID] = dicDisabledPSMSensors;
            }

            foreach (PSM psmSensor in psmSensors)
            {
                PSMSensor psmData = new PSMSensor(psmSensor);

                Zone zone = spatialManager.GetZone(psmSensor.ZoneID);
                if (zone != null && zone.BuildingID != null)
                    psmData.IsIndoor = true;
                else
                    psmData.IsIndoor = false;

                EquipmentZoneData equipZoneData = spatialManager.GetEquipmentZone(psmData.EquipZoneID);

                if (equipZoneData != null)
                {
                    psmData.LinkedZones.AddRange(equipZoneData.LinkedZoneDatas);
                }

                dicPSMSensors[psmSensor.ID] = psmData;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, psmSensor.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (psmSensor.Enabled != null && psmSensor.Enabled == false))
                {
                    dicDisabledPSMSensors[psmSensor.ID] = psmData;
                }
            }

            List<int> psmTypeIDs = GetPSMSensorTypeIDs(dataManager);

            ArrayList arrDatas = m_joinManager.JoinSensorZoneTagInfoPSMMaterial(null, out strErrorMessage);
            //ArrayList arrDatas = m_joinManager.JoinSensorZoneTagInfoPSMMaterial((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, null, out strErrorMessage);

            if (arrDatas == null)
                return false;

            Material atmosphereMaterial = null;
            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo && arrDatas[i + 2] is Material)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];
                    Material material = (Material)arrDatas[i + 2];

                    PSMSensor psm;

                    if (dicPSMSensors.TryGetValue((int)sensorZone.OrgSensorID, out psm))
                    {
                        psm.SensorTagInfoID = tagInfo.ID;
                        psm.SensorZoneID = sensorZone.ID;
                        //psm.FacilityType = sensorZone.SensorType;
                        psm.MaterialType = material.ID;
                        psm.FacilityType = material.ID;

                        string strMaterialName = material.MaterialName.ToLower();

                        if (strMaterialName == "o2" ||
                            strMaterialName == "co2" ||
                            strMaterialName == "h2s" ||
                            strMaterialName == "ch4")
                            psm.FacilityType = (int)dnsData.Sensor.Facility.FacilityType.CO;
                        else if (strMaterialName == "ou" ||
                            strMaterialName.StartsWith("미세먼지") ||
                            strMaterialName == "voc" ||
                            strMaterialName.StartsWith("휘발성"))
                        {
                            if (atmosphereMaterial == null)
                            {
                                strCondition = string.Format("{0} = 'OU'", Material.Fields.MaterialName);
                                atmosphereMaterial = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);
                            }

                            if (atmosphereMaterial != null)
                                psm.FacilityType = atmosphereMaterial.ID;
                        }
                    }
                }
            }

            return true;
        }

        private List<int> GetPSMSensorTypeIDs(IDataManager dataManager)
        {
            string strCondition = string.Format("{0} = '{1}'", FacilityType.Fields.LinkedTableName.ToString(), PSM.TableName);

            string strErrorMessage;
            IEnumerable<FacilityType> types = dataManager.GetSelect().Select<FacilityType>(strCondition, out strErrorMessage);

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

        private bool LoadEtcSensors(IDataManager dataManager, SpatialManager spatialManager, int siteID)
        {
            string strErrorMessage;

            string strAdditionalConditions = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                ETC.Fields.ZoneID,
                Zone.Fields.ID,
                Zone.TableName,
                Zone.Fields.SiteID, siteID);
            IEnumerable<ETC> etcSensors = dataManager.GetSelect().Select<ETC>(strAdditionalConditions, out strErrorMessage);

            if (etcSensors == null)
                return false;

            Dictionary<int, EtcSensor> dicEtcSensors = null;
            ConcurrentDictionary<int, ETC> dicDisabledEtcSensors = null;

            if (m_dicSiteEtcSensors.TryGetValue(siteID, out dicEtcSensors) == false)
            {
                dicEtcSensors = new Dictionary<int, EtcSensor>();
                m_dicSiteEtcSensors[siteID] = dicEtcSensors;
            }

            if (m_dicSiteDisabledEtcSensors.TryGetValue(siteID, out dicDisabledEtcSensors) == false)
            {
                dicDisabledEtcSensors = new ConcurrentDictionary<int, ETC>();
                m_dicSiteDisabledEtcSensors[siteID] = dicDisabledEtcSensors;
            }

            foreach (ETC etcSensor in etcSensors)
            {
                EtcSensor etc = new EtcSensor(etcSensor);

                Zone zone = spatialManager.GetZone(etcSensor.ZoneID);

                if (zone != null && zone.BuildingID != null)
                    etc.IsIndoor = true;
                else
                    etc.IsIndoor = false;

                dicEtcSensors[etcSensor.ID] = etc;

                long key = GetSensorTypeKey((int)dnsData.Sensor.Facility.FacilityType.ETC, etc.ID);

                if (m_dicDisabledTypeSensorTagInfos.ContainsKey(key) || (etc.Enabled != null && etc.Enabled == false))
                {
                    dicDisabledEtcSensors[etcSensor.ID] = etc;
                }
            }

            if (strAdditionalConditions != null)
                strAdditionalConditions = "d." + strAdditionalConditions;

            ArrayList arrDatas = m_joinManager.JoinSensorZoneTagInfoEtcMaterial(null, out strErrorMessage);
            //ArrayList arrDatas = m_joinManager.JoinSensorZoneTagInfoEtcMaterial((int)dnsData.Sensor.Facility.FacilityType.ETC, strAdditionalConditions, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo && arrDatas[i + 2] is Material)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];
                    Material material = (Material)arrDatas[i + 2];

                    EtcSensor etc;

                    if (dicEtcSensors.TryGetValue((int)sensorZone.OrgSensorID, out etc))
                    {
                        etc.SensorTagInfoID = tagInfo.ID;
                        etc.SensorZoneID = sensorZone.ID;
                        //etc.FacilityType = sensorZone.SensorType;
                        etc.MaterialType = material.ID;
                        etc.FacilityType = material.ID;
                    }
                }
            }

            return true;
        }

        private bool LoadCCTVs(IDataManager dataManager, SpatialManager spatialManager, int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                CCTV.Fields.ZoneID,
                Zone.Fields.ID,
                Zone.TableName,
                Zone.Fields.SiteID, siteID);
            IEnumerable<CCTV> cctvs = dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);

            if (cctvs == null)
                return false;

            Dictionary<int, CCTVSensor> dicCCTVs = null;
            ConcurrentDictionary<int, CCTV> dicDisabledCCTVs = null;

            if (m_dicSiteCCTVs.TryGetValue(siteID, out dicCCTVs) == false)
            {
                dicCCTVs = new Dictionary<int, CCTVSensor>();
                m_dicSiteCCTVs[siteID] = dicCCTVs;
            }

            if (m_dicSiteDisabledCCTVs.TryGetValue(siteID, out dicDisabledCCTVs) == false)
            {
                dicDisabledCCTVs = new ConcurrentDictionary<int, CCTV>();
                m_dicSiteDisabledCCTVs[siteID] = dicDisabledCCTVs;
            }

            foreach (CCTV cctv in cctvs)
            {
                CCTVSensor cctvSensor = new CCTVSensor(cctv);
                dicCCTVs[cctv.ID] = cctvSensor;

                if (cctv.Enabled != null && cctv.Enabled == false)
                {
                    dicDisabledCCTVs[cctv.ID] = cctvSensor;
                }
            }

            string strConditions = string.Format("{0} in ({1}, {2}, {3}, {4})",
                Material.Fields.ID,
                (int)dnsData.Sensor.Facility.FacilityType.CCTV,
                (int)dnsData.Sensor.Facility.FacilityType.SicFire,
                (int)dnsData.Sensor.Facility.FacilityType.SicIntrusion,
                (int)dnsData.Sensor.Facility.FacilityType.SicTemp);

            IEnumerable<Material> materials = m_dataManager.GetSelect().Select<Material>(strConditions, out strErrorMessage);

            if (materials == null)
                return false;

            Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();

            foreach (Material material in materials)
            {
                dicMaterials[material.ID] = material;
            }

            strConditions = string.Format("a.{0} in ({1}, {2}, {3}, {4})",
                SensorZone.Fields.SensorType,
                (int)dnsData.Sensor.Facility.FacilityType.CCTV,
                (int)dnsData.Sensor.Facility.FacilityType.SicFire,
                (int)dnsData.Sensor.Facility.FacilityType.SicIntrusion,
                (int)dnsData.Sensor.Facility.FacilityType.SicTemp);
            ArrayList arrDatas = m_joinManager.JoinSensorZoneTagInfo(strConditions, out strErrorMessage);

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

                    if (dicCCTVs.TryGetValue((int)sensorZone.OrgSensorID, out cctv))
                    {
                        cctv.SensorTagInfoID = tagInfo.ID;
                        cctv.SensorZoneID = sensorZone.ID;

                        Material material;

                        if (dicMaterials.TryGetValue(sensorZone.SensorType, out material))
                            cctv.FacilityTypeName = material.MaterialName;
                    }
                }
            }

            return true;
        }

        // 전체 Gas 센서
        public ICollection<PSMSensor> GetGasSensors(int siteID)
        {
            Dictionary<int, PSMSensor> dicPSMSensors = null;

            if (m_dicSitePSMSensors.TryGetValue(siteID, out dicPSMSensors) == false)
            {
                dicPSMSensors = new Dictionary<int, PSMSensor>();
                m_dicSitePSMSensors[siteID] = dicPSMSensors;
            }

            List<PSMSensor> gasSensors = new List<PSMSensor>();
            Dictionary<int, MultiSensor> dicEquipZoneMultiSensors = new Dictionary<int, MultiSensor>();

            foreach (KeyValuePair<int, PSMSensor> pair in dicPSMSensors)
            {
                if (IsGasSensor(pair.Value, dicEquipZoneMultiSensors))
                {
                    gasSensors.Add(pair.Value);
                }
            }

            foreach (PSMSensor sensor in gasSensors)
            {
                MultiSensor multiSensor;

                if (dicEquipZoneMultiSensors.TryGetValue(sensor.EquipZoneID, out multiSensor))
                    sensor.MultiSensor = multiSensor;
            }

            return gasSensors;
        }

        // 사용하지 않는 Gas 센서
        public ICollection<PSM> GetDisabledGasSensors(int siteID)
        {
            ConcurrentDictionary<int, PSM> dicPSMSensors = null;

            if (m_dicSiteDisabledPSMSensors.TryGetValue(siteID, out dicPSMSensors) == false)
            {
                dicPSMSensors = new ConcurrentDictionary<int, PSM>();
                m_dicSiteDisabledPSMSensors[siteID] = dicPSMSensors;
            }

            List<PSM> gasSensors = new List<PSM>();
            Dictionary<int, MultiSensor> dicZoneMultiSensors = new Dictionary<int, MultiSensor>();

            foreach (KeyValuePair<int, PSM> pair in dicPSMSensors)
            {
                if (IsGasSensor(pair.Value, dicZoneMultiSensors))
                {
                    gasSensors.Add(pair.Value);
                }
            }

            return gasSensors;
        }

        private bool IsGasSensor(PSM sensor, Dictionary<int, MultiSensor> dicEquipZoneMultiSensors)
        {
            // 대기센서는 복합센서이기 때문에 일산화탄소만 화면에 표시하도록 한다.
            if (sensor.MaterialType != null)
            {
                if ((int)sensor.MaterialType == 216)
                {
                    SetZoneMultiSensor(sensor.ID, sensor.EquipZoneID, (int)sensor.MaterialType, dicEquipZoneMultiSensors);
                    return true;
                }
                else if ((int)sensor.MaterialType == 237 || (int)sensor.MaterialType == 217 || (int)sensor.MaterialType == 239 || (int)sensor.MaterialType == 202)
                {
                    SetZoneMultiSensor(sensor.ID, sensor.EquipZoneID, (int)sensor.MaterialType, dicEquipZoneMultiSensors);
                }
            }

            return false;
        }

        private void SetZoneMultiSensor(int sensorID, int zoneID, int materialType, Dictionary<int, MultiSensor> dicZoneMultiSensors)
        {
            MultiSensor multiSensor;

            if (dicZoneMultiSensors.TryGetValue(zoneID, out multiSensor) == false)
            {
                multiSensor = new MultiSensor();
                multiSensor.IsMultiSensor = true;
                dicZoneMultiSensors[zoneID] = multiSensor;
            }

            multiSensor.IDList.Add(sensorID);
        }

        private bool IsAtmosphereSensor(PSM sensor, Dictionary<int, MultiSensor> dicEquipZoneMultiSensors)
        {
            // 대기센서는 복합센서이기 때문에 악취감지기만 화면에 표시하도록 한다.
            if (sensor.MaterialType != null)
            {
                if ((int)sensor.MaterialType == 240)
                {
                    SetZoneMultiSensor(sensor.ID, sensor.EquipZoneID, (int)sensor.MaterialType, dicEquipZoneMultiSensors);
                    return true;
                }
                else if ((int)sensor.MaterialType == 227 || (int)sensor.MaterialType == 205 || (int)sensor.MaterialType == 206)
                {
                    SetZoneMultiSensor(sensor.ID, sensor.EquipZoneID, (int)sensor.MaterialType, dicEquipZoneMultiSensors);
                }
            }

            return false;
        }

        // 전체 화재센서
        public ICollection<FireSensor> GetFireSensors(int siteID)
        {
            Dictionary<int, FireSensor> dicFireSensors = null;

            if (m_dicSiteFireSensors.TryGetValue(siteID, out dicFireSensors) == false)
            {
                dicFireSensors = new Dictionary<int, FireSensor>();
                m_dicSiteFireSensors[siteID] = dicFireSensors;
            }

            List<FireSensor> fireSensors = new List<FireSensor>();

            foreach (KeyValuePair<int, FireSensor> pair in dicFireSensors)
            {
                fireSensors.Add(pair.Value);
            }

            return fireSensors;
        }

        // 사용하지 않는 화재센서
        public ICollection<Fire> GetDisabledFireSensors(int siteID)
        {
            ConcurrentDictionary<int, Fire> dicFireSensors = null;

            if (m_dicSiteDisabledFireSensors.TryGetValue(siteID, out dicFireSensors) == false)
            {
                dicFireSensors = new ConcurrentDictionary<int, Fire>();
                m_dicSiteDisabledFireSensors[siteID] = dicFireSensors;
            }

            List<Fire> fireSensors = new List<Fire>();

            foreach (KeyValuePair<int, Fire> pair in dicFireSensors)
            {
                fireSensors.Add(pair.Value);
            }

            return fireSensors;
        }

        private Dictionary<int, MultiSensor> GetAtmosphereMultiSensors(Dictionary<int, MultiSensor> dicEquipZoneMultiSensors, Dictionary<int, PSMSensor> dicAtmosphereSensors)
        {
            Dictionary<int, MultiSensor> dicMultiSensors = new Dictionary<int, MultiSensor>();
            Dictionary<string, MultiSensor> dicUniqueKeyMultiSensors = new Dictionary<string, MultiSensor>();

            foreach (var pair in dicEquipZoneMultiSensors)
            {
                MultiSensor multiSensor = pair.Value;

                foreach (int sensorID in multiSensor.IDList)
                {
                    PSMSensor sensor;

                    if (dicAtmosphereSensors.TryGetValue(sensorID, out sensor))
                    {
                        string strUniqueKey = sensor.UniqueKey;

                        if (strUniqueKey == null)
                            continue;

                        int index1 = strUniqueKey.LastIndexOf('_');

                        if (index1 > 0)
                        {
                            int index2 = strUniqueKey.LastIndexOf('_', index1 - 1);

                            if (index2 > 0 && index2 < index1)
                            {
                                MultiSensor _multiSensor;
                                string strKey = strUniqueKey.Substring(0, index2);

                                if (dicUniqueKeyMultiSensors.TryGetValue(strKey, out _multiSensor) == false)
                                {
                                    _multiSensor = new MultiSensor();
                                    dicUniqueKeyMultiSensors[strKey] = _multiSensor;
                                }

                                _multiSensor.IDList.Add(sensor.ID);
                                dicMultiSensors[sensor.ID] = _multiSensor;

                                if (_multiSensor.IDList.Count > 1)
                                    _multiSensor.IsMultiSensor = true;
                                else
                                    _multiSensor.IsMultiSensor = false;
                            }
                        }
                    }
                }
            }

            return dicMultiSensors;
        }

        // 전체 대기센서
        public ICollection<PSMSensor> GetAtmosphereSensors(int siteID)
        {
            Dictionary<int, PSMSensor> dicPsmSensors = null;

            if (m_dicSitePSMSensors.TryGetValue(siteID, out dicPsmSensors) == false)
            {
                dicPsmSensors = new Dictionary<int, PSMSensor>();
                m_dicSitePSMSensors[siteID] = dicPsmSensors;
            }

            List<PSMSensor> atmosphereSensors = new List<PSMSensor>();
            Dictionary<int, MultiSensor> dicEquipZoneMultiSensors = new Dictionary<int, MultiSensor>();

            foreach (KeyValuePair<int, PSMSensor> pair in dicPsmSensors)
            {
                if (IsAtmosphereSensor(pair.Value, dicEquipZoneMultiSensors))
                {
                    atmosphereSensors.Add(pair.Value);
                }
            }

            Dictionary<int, MultiSensor> dicMutlSensors = GetAtmosphereMultiSensors(dicEquipZoneMultiSensors, dicPsmSensors);

            foreach (PSMSensor sensor in atmosphereSensors)
            {
                MultiSensor multiSensor;

                if (dicMutlSensors.TryGetValue(sensor.ID, out multiSensor))
                    sensor.MultiSensor = multiSensor;
                /*if (dicEquipZoneMultiSensors.TryGetValue(sensor.EquipZoneID, out multiSensor))
                    sensor.MultiSensor = multiSensor;*/
            }

            return atmosphereSensors;
        }

        // 사용하지 않는 대기센서
        public ICollection<PSM> GetDisabledAtmosphereSensors(int siteID)
        {
            ConcurrentDictionary<int, PSM> dicPsmSensors = null;

            if (m_dicSiteDisabledPSMSensors.TryGetValue(siteID, out dicPsmSensors) == false)
            {
                dicPsmSensors = new ConcurrentDictionary<int, PSM>();
                m_dicSiteDisabledPSMSensors[siteID] = dicPsmSensors;
            }

            List<PSM> atmosphereSensors = new List<PSM>();
            Dictionary<int, MultiSensor> dicEquipZoneMultiSensors = new Dictionary<int, MultiSensor>();

            foreach (KeyValuePair<int, PSM> pair in dicPsmSensors)
            {
                if (IsAtmosphereSensor(pair.Value, dicEquipZoneMultiSensors))
                {
                    atmosphereSensors.Add(pair.Value);
                }
            }

            return atmosphereSensors;
        }

        // 전체 비상벨
        public ICollection<EtcSensor> GetEmergencyBells(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '비상벨'", Material.Fields.MaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
                return new List<EtcSensor>();

            Dictionary<int, EtcSensor> dicEtcSensors = null;

            if (m_dicSiteEtcSensors.TryGetValue(siteID, out dicEtcSensors) == false)
            {
                dicEtcSensors = new Dictionary<int, EtcSensor>();
                m_dicSiteEtcSensors[siteID] = dicEtcSensors;
            }

            List<EtcSensor> emergencyBells = new List<EtcSensor>();

            foreach (EtcSensor sensor in dicEtcSensors.Values)
            {
                if (sensor.MaterialType == material.ID)
                    emergencyBells.Add(sensor);
            }

            return emergencyBells;
        }

        // 사용하지 않는 비상벨
        public ICollection<ETC> GetDisabledEmergencyBells(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '비상벨'", Material.Fields.MaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
                return new List<ETC>();

            ConcurrentDictionary<int, ETC> dicEtcSensors = null;

            if (m_dicSiteDisabledEtcSensors.TryGetValue(siteID, out dicEtcSensors) == false)
            {
                dicEtcSensors = new ConcurrentDictionary<int, ETC>();
                m_dicSiteDisabledEtcSensors[siteID] = dicEtcSensors;
            }

            List<ETC> emergencyBells = new List<ETC>();

            foreach (ETC sensor in dicEtcSensors.Values)
            {
                if (sensor.MaterialType == material.ID)
                    emergencyBells.Add(sensor);
            }

            return emergencyBells;
        }

        // 전체 AP
        public ICollection<EtcSensor> GetAPs(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 'AP'", Material.Fields.MaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
                return new List<EtcSensor>();

            Dictionary<int, EtcSensor> dicEtcSensors = null;

            if (m_dicSiteEtcSensors.TryGetValue(siteID, out dicEtcSensors) == false)
            {
                dicEtcSensors = new Dictionary<int, EtcSensor>();
                m_dicSiteEtcSensors[siteID] = dicEtcSensors;
            }

            List<EtcSensor> aps = new List<EtcSensor>();
            // 위치별로 AP를 하나씩만 둔다.
            //Dictionary<string, EtcSensor> dicAPs = new Dictionary<string, EtcSensor>();

            // Key : UniqueKey
            Dictionary<string, MultiSensor> dicMultiSensors = new Dictionary<string, MultiSensor>();
            MultiSensor multiSensor;

            foreach (EtcSensor sensor in dicEtcSensors.Values)
            {
                if (sensor.UniqueKey.StartsWith("AP"))
                {
                    string strUniqueKey = GetApUniqueKey(sensor);

                    if (dicMultiSensors.TryGetValue(strUniqueKey, out multiSensor) == false)
                    {
                        multiSensor = new MultiSensor();
                        dicMultiSensors[strUniqueKey] = multiSensor;
                    }

                    multiSensor.IDList.Add(sensor.ID);
                    multiSensor.IsMultiSensor = multiSensor.IDList.Count > 1;
                    sensor.MultiSensor = multiSensor;
                }
            }

            foreach (EtcSensor sensor in dicEtcSensors.Values)
            {
                if (sensor.MaterialType == material.ID)
                {
                    //if (dicAPs.ContainsKey(sensor.PositionName) == false)
                    {
                        //dicAPs[sensor.PositionName] = sensor;
                        //sensor.Name = sensor.PositionName;
                        aps.Add(sensor);

                        if (sensor.MaterialType != null)
                            sensor.FacilityType = (int)sensor.MaterialType;
                    }
                }
            }

            return aps;
        }

        private string GetApUniqueKey(EtcSensor sensor)
        {
            int index = sensor.UniqueKey.IndexOf('_');

            if (index < 0)
                return sensor.UniqueKey;

            return sensor.UniqueKey.Substring(0, index);
        }

        // 사용하지 않는 AP
        public ICollection<ETC> GetDisabledAPs(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 'AP'", Material.Fields.MaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
                return new List<ETC>();

            ConcurrentDictionary<int, ETC> dicEtcSensors = null;

            if (m_dicSiteDisabledEtcSensors.TryGetValue(siteID, out dicEtcSensors) == false)
            {
                dicEtcSensors = new ConcurrentDictionary<int, ETC>();
                m_dicSiteDisabledEtcSensors[siteID] = dicEtcSensors;
            }

            List<ETC> aps = new List<ETC>();

            foreach (ETC sensor in dicEtcSensors.Values)
            {
                if (sensor.MaterialType == material.ID)
                    aps.Add(sensor);
            }

            return aps;
        }

        // 전체 작업자 센서 Tag
        public ICollection<EtcSensor> GetWorkerTags(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '작업자 긴급호출'", Material.Fields.MaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
                return new List<EtcSensor>();

            Dictionary<int, EtcSensor> dicEtcSensors = null;

            if (m_dicSiteEtcSensors.TryGetValue(siteID, out dicEtcSensors) == false)
            {
                dicEtcSensors = new Dictionary<int, EtcSensor>();
                m_dicSiteEtcSensors[siteID] = dicEtcSensors;
            }

            List<EtcSensor> workerTags = new List<EtcSensor>();

            foreach (EtcSensor sensor in dicEtcSensors.Values)
            {
                if (sensor.MaterialType == material.ID)
                    workerTags.Add(sensor);
            }

            return workerTags;
        }

        // 사용하지 않는 작업자 센서 Tag
        public ICollection<ETC> GetDisabledWorkerTags(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '작업자 긴급호출'", Material.Fields.MaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
                return new List<ETC>();

            ConcurrentDictionary<int, ETC> dicEtcSensors = null;

            if (m_dicSiteDisabledEtcSensors.TryGetValue(siteID, out dicEtcSensors) == false)
            {
                dicEtcSensors = new ConcurrentDictionary<int, ETC>();
                m_dicSiteDisabledEtcSensors[siteID] = dicEtcSensors;
            }

            List<ETC> workerTags = new List<ETC>();

            foreach (ETC sensor in dicEtcSensors.Values)
            {
                if (sensor.MaterialType == material.ID)
                    workerTags.Add(sensor);
            }

            return workerTags;
        }

        private bool IsThermalCCTV(CCTV cctv)
        {
            if (cctv.Type != null && cctv.Type.ToLower().EndsWith("thermal"))
                return true;

            return false;
        }

        // 전체 열화상 CCTV
        public ICollection<CCTVSensor> GetThermalCCTVs(int siteID)
        {
            Dictionary<int, CCTVSensor> dicCCTVs = null;

            if (m_dicSiteCCTVs.TryGetValue(siteID, out dicCCTVs) == false)
            {
                dicCCTVs = new Dictionary<int, CCTVSensor>();
                m_dicSiteCCTVs[siteID] = dicCCTVs;
            }

            List<CCTVSensor> thermalCCTVs = new List<CCTVSensor>();

            foreach (KeyValuePair<int, CCTVSensor> pair in dicCCTVs)
            {
                if (IsThermalCCTV(pair.Value))
                    thermalCCTVs.Add(pair.Value);
            }

            return thermalCCTVs;
        }

        // 사용하지 않는 열화상 CCTV
        public ICollection<CCTV> GetDisabledThermalCCTVs(int siteID)
        {
            ConcurrentDictionary<int, CCTV> dicCCTVs = null;

            if (m_dicSiteDisabledCCTVs.TryGetValue(siteID, out dicCCTVs) == false)
            {
                dicCCTVs = new ConcurrentDictionary<int, CCTV>();
                m_dicSiteDisabledCCTVs[siteID] = dicCCTVs;
            }

            List<CCTV> thermalCCTVs = new List<CCTV>();

            foreach (KeyValuePair<int, CCTV> pair in dicCCTVs)
            {
                if (IsThermalCCTV(pair.Value))
                    thermalCCTVs.Add(pair.Value);
            }

            return thermalCCTVs;
        }

        // 전체 CCTV(열화상 제외)
        public ICollection<CCTVSensor> GetCCTVs(int siteID)
        {
            Dictionary<int, CCTVSensor> dicCCTVs = null;

            if (m_dicSiteCCTVs.TryGetValue(siteID, out dicCCTVs) == false)
            {
                dicCCTVs = new Dictionary<int, CCTVSensor>();
                m_dicSiteCCTVs[siteID] = dicCCTVs;
            }

            List<CCTVSensor> normalCCTVs = new List<CCTVSensor>();

            foreach (KeyValuePair<int, CCTVSensor> pair in dicCCTVs)
            {
                if (IsThermalCCTV(pair.Value) == false)
                    normalCCTVs.Add(pair.Value);
            }

            return normalCCTVs;
        }

        // 사용하지 않는 CCTV(열화상 제외)
        public ICollection<CCTV> GetDisabledCCTVs(int siteID)
        {
            ConcurrentDictionary<int, CCTV> dicCCTVs = null;

            if (m_dicSiteDisabledCCTVs.TryGetValue(siteID, out dicCCTVs) == false)
            {
                dicCCTVs = new ConcurrentDictionary<int, CCTV>();
                m_dicSiteDisabledCCTVs[siteID] = dicCCTVs;
            }

            List<CCTV> normalCCTVs = new List<CCTV>();

            foreach (KeyValuePair<int, CCTV> pair in dicCCTVs)
            {
                if (IsThermalCCTV(pair.Value) == false)
                    normalCCTVs.Add(pair.Value);
            }

            return normalCCTVs;
        }

        public ResponsePSMSensorInfo GetGasSensorInfo(RequestPSMSensorInfo request)
        {
            return GetPSMSensorInfo(request);
        }

        public ResponsePSMSensorInfo GetAtmosphereSensorInfo(RequestPSMSensorInfo request)
        {
            return GetPSMSensorInfo(request);
        }

        private ResponsePSMSensorInfo GetPSMSensorInfo(RequestPSMSensorInfo request)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", PSM.Fields.ID, request.SensorID);
            PSM sensor = m_dataManager.GetSelect().SelectFirst<PSM>(strCondition, out strErrorMessage);

            if (strErrorMessage != null)
                return new ResponsePSMSensorInfo(false, strErrorMessage);

            if (sensor != null)
            {
                int index = sensor.UniqueKey.IndexOf('_');
                Dictionary<int, PSM> dicSensors = new Dictionary<int, PSM>();

                if (index > 0)
                {
                    string strMaterialIDs = "", strSensorIDs = "";

                    if (sensor.MaterialType != null)
                    {
                        dicSensors[(int)sensor.MaterialType] = sensor;
                        strMaterialIDs = ((int)sensor.MaterialType).ToString();
                        strSensorIDs = sensor.ID.ToString();
                    }

                    string strTag = GetPsmSensorTag(sensor, index);
                    //string strTag = sensor.UniqueKey.Substring(0, index).Trim();
                    strCondition = string.Format("{0} like '{1}%' and {2} <> {3}", PSM.Fields.UniqueKey, strTag, PSM.Fields.ID, sensor.ID);
                    IEnumerable<PSM> sensors = m_dataManager.GetSelect().Select<PSM>(strCondition, out strErrorMessage);

                    if (sensors == null)
                        return new ResponsePSMSensorInfo(false, strErrorMessage);

                    foreach (PSM _sensor in sensors)
                    {
                        if (_sensor.MaterialType != null)
                        {
                            dicSensors[(int)_sensor.MaterialType] = _sensor;

                            if (strMaterialIDs.Length == 0)
                            {
                                strMaterialIDs = ((int)_sensor.MaterialType).ToString();
                                strSensorIDs = _sensor.ID.ToString();
                            }
                            else
                            {
                                strMaterialIDs += "," + ((int)_sensor.MaterialType).ToString();
                                strSensorIDs += "," + _sensor.ID.ToString();
                            }
                        }
                    }

                    if (strMaterialIDs.Length > 0)
                    {
                        strCondition = string.Format("{0} in ({1})", Material.Fields.ID, strMaterialIDs);
                        IEnumerable<Material> materials = m_dataManager.GetSelect().Select<Material>(strCondition, out strErrorMessage);

                        if (materials == null)
                            return new ResponsePSMSensorInfo(false, strErrorMessage);

                        Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();

                        foreach (Material material in materials)
                        {
                            dicMaterials[material.ID] = material;
                        }

                        ResponsePSMSensorInfo response = new ResponsePSMSensorInfo(true, "");

                        List<PSM> _sensors = new List<PSM>();
                        _sensors.Add(sensor);
                        _sensors.AddRange(sensors);

                        foreach (PSM psmSensor in _sensors)
                        {
                            Material material;

                            if (psmSensor.MaterialType != null && dicMaterials.TryGetValue((int)psmSensor.MaterialType, out material))
                            {
                                PSMSensorData sensorData = new PSMSensorData();

                                if (psmSensor.CurrentData != null)
                                    sensorData.Data = (float)psmSensor.CurrentData;

                                sensorData.MaterialName = material.MaterialName;
                                sensorData.UoM = material.UOM;
                                SetPSMSensorStatus(sensorData, psmSensor);

                                response.SensorInfos.Add(sensorData);
                            }
                        }

                        return response;
                    }
                }
            }

            return new ResponsePSMSensorInfo(true, "");
        }

        private string GetPsmSensorTag(PSM sensor, int index)
        {
            if (sensor.UniqueKey.StartsWith("Senko_"))
            {
                int index2 = sensor.UniqueKey.IndexOf('_', index + 1);

                if (index2 > index)
                {
                    int index3 = sensor.UniqueKey.IndexOf('_', index2 + 1);

                    if (index3 > index2)
                    {
                        return sensor.UniqueKey.Substring(0, index3).Trim();
                    }
                }
            }
            else
            {
                return sensor.UniqueKey.Substring(0, index).Trim();
            }

            return sensor.UniqueKey;
        }

        private void SetPSMSensorStatus(PSMSensorData sensorData, PSM sensor)
        {
            if (sensor.CurrentData != null)
            {
                if (sensor.LimitValue != null && sensor.LimitType != null)
                {
                    if (sensor.LimitType == (int)PSM.Limit_Type.Normal)
                        sensorData.Status = GetNormalPSMStatus(sensor);
                    else if (sensor.LimitType == (int)PSM.Limit_Type.Range)
                        sensorData.Status = GetRangePSMStatus(sensor);
                }
                /*if (sensor.LimitLevel1 != null && (double)sensor.LimitLevel1 > (double)sensor.CurrentData)
                {
                    sensorData.Status = 1;
                }
                else if (sensor.LimitLevel2 != null && (double)sensor.LimitLevel2 > (double)sensor.CurrentData)
                {
                    sensorData.Status = 2;
                }
                else if (sensor.LimitLevel3 != null && sensor.UseLimitLevel3)
                {
                    if ((double)sensor.LimitLevel3 > (double)sensor.CurrentData)
                        sensorData.Status = 3;
                    else
                        sensorData.Status = 4;
                }*/
            }
            else
                sensorData.Status = null;
        }

        private int? GetRangePSMStatus(PSM sensor)
        {
            int index = sensor.LimitValue.IndexOf('|');

            if (index < 0)
                return null;

            string strLeft = sensor.LimitValue.Substring(0, index).Trim();
            string strRight = sensor.LimitValue.Substring(index + 1).Trim();

            string[] leftTokens = strLeft.Split(',');
            string[] rightTokens = strRight.Split(',');

            if (leftTokens.Length >= 3 && rightTokens.Length >= 3)
            {
                if (leftTokens[2].Trim().ToLower() == "true")
                {
                    if (CheckPSMRangeValue(rightTokens[2], sensor))
                        return 4;
                }

                if (leftTokens[1].Trim().ToLower() == "true")
                {
                    if (CheckPSMRangeValue(rightTokens[1], sensor))
                        return 3;
                }

                if (leftTokens[0].Trim().ToLower() == "true")
                {
                    if (CheckPSMRangeValue(rightTokens[0], sensor))
                        return 2;
                }

                return 1;
            }

            return null;
        }

        private bool CheckPSMRangeValue(string strValue, PSM sensor)
        {
            double valueMin, valueMax;
            int indexMiddle = strValue.IndexOf('&');

            if (indexMiddle > 0)
            {
                string strLeftSide = strValue.Substring(0, indexMiddle).Trim();
                string strRightSide = strValue.Substring(indexMiddle + 1).Trim();

                int index1 = strLeftSide.IndexOf('~');
                int index2 = strRightSide.IndexOf('~');

                if (index1 == 0)
                {
                    if (double.TryParse(strLeftSide.Substring(index1 + 1).Trim(), out valueMax) && sensor.CurrentData <= valueMax)
                        return true;
                }
                else if (index1 > 0)
                {
                    if (double.TryParse(strLeftSide.Substring(0, index1).Trim(), out valueMin) && double.TryParse(strLeftSide.Substring(index1 + 1).Trim(), out valueMax))
                    {
                        if (sensor.CurrentData >= valueMin && sensor.CurrentData <= valueMax)
                            return true;
                    }
                }

                if (index2 == strRightSide.Length - 1)
                {
                    if (double.TryParse(strRightSide.Substring(0, index2).Trim(), out valueMin) && sensor.CurrentData >= valueMin)
                        return true;
                }
                else if (index2 > 0)
                {
                    if (double.TryParse(strRightSide.Substring(0, index2).Trim(), out valueMin) && double.TryParse(strRightSide.Substring(index2 + 1).Trim(), out valueMax))
                    {
                        if (sensor.CurrentData >= valueMin && sensor.CurrentData <= valueMax)
                            return true;
                    }
                }
            }
            else
            {
                int index1 = strValue.IndexOf('~');

                if (index1 == 0)
                {
                    if (double.TryParse(strValue.Substring(index1 + 1).Trim(), out valueMax) && sensor.CurrentData <= valueMax)
                        return true;
                }
                else if (index1 == strValue.Length - 1)
                {
                    if (double.TryParse(strValue.Substring(0, index1).Trim(), out valueMin) && sensor.CurrentData >= valueMin)
                        return true;
                }
                else if (index1 > 0)
                {
                    if (double.TryParse(strValue.Substring(0, index1).Trim(), out valueMin) && double.TryParse(strValue.Substring(index1 + 1).Trim(), out valueMax))
                    {
                        if (sensor.CurrentData >= valueMin && sensor.CurrentData <= valueMax)
                            return true;
                    }
                }
                else
                {
                    if (double.TryParse(strValue.Trim(), out valueMin) && sensor.CurrentData >= valueMin)
                        return true;
                }
            }

            return false;
        }

        private int? GetNormalPSMStatus(PSM sensor)
        {
            int index = sensor.LimitValue.IndexOf('|');

            if (index < 0)
                return null;

            string strLeft = sensor.LimitValue.Substring(0, index).Trim();
            string strRight = sensor.LimitValue.Substring(index + 1).Trim();

            string[] leftTokens = strLeft.Split(',');
            string[] rightTokens = strRight.Split(',');

            double value;

            if (leftTokens.Length >= 3 && rightTokens.Length >= 3)
            {
                if (leftTokens[2].Trim().ToLower() == "true")
                {
                    if (double.TryParse(rightTokens[2].Trim(), out value))
                    {
                        if (sensor.CurrentData >= value)
                            return 4;
                    }
                }

                if (leftTokens[1].Trim().ToLower() == "true")
                {
                    if (double.TryParse(rightTokens[1].Trim(), out value))
                    {
                        if (sensor.CurrentData >= value)
                            return 3;
                    }
                }

                if (leftTokens[0].Trim().ToLower() == "true")
                {
                    if (double.TryParse(rightTokens[0].Trim(), out value))
                    {
                        if (sensor.CurrentData >= value)
                            return 2;
                    }
                }

                return 1;
            }

            return null;
        }

        private bool IsSameAtmosphereSensor(PSMSensor sensor, string strTag)
        {
            if (sensor.UniqueKey.StartsWith(strTag))
                return true;

            return false;
        }

        public ResponseAPStatistics GetAPStatistics(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} in (Select {3} from {4} where {5} = (Select {6} from {7} where {8} = 'AP')) order by {2}, {9}",
                EtcData.Fields.SiteID,
                siteID,
                EtcData.Fields.SensorID,
                ETC.Fields.ID,
                ETC.TableName,
                ETC.Fields.MaterialType,
                Material.Fields.ID,
                Material.TableName,
                Material.Fields.MaterialName,
                EtcData.Fields.PropertyName);

            IEnumerable<EtcData> etcDatas = m_dataManager.GetSelect().Select<EtcData>(strCondition, out strErrorMessage);

            if (etcDatas == null)
                return new ResponseAPStatistics(false, strErrorMessage);

            Dictionary<string, int> dicLocationCount = new Dictionary<string, int>();
            int normalCount = 0, lowCount = 0, changingCount = 0;

            string strLocation = "";
            Dictionary<string, int> dicLocationWorkerCount = new Dictionary<string, int>();

            ResponseAPStatistics response = new ResponseAPStatistics(true, "");

            foreach (EtcData etcData in etcDatas)
            {
                if (etcData.PropertyName == "Location")
                {
                    if (etcData.PropertyValue != null && etcData.PropertyValue.Length > 0)
                    {
                        strLocation = etcData.PropertyValue.Trim();
                        int count;

                        if (dicLocationCount.TryGetValue(strLocation, out count))
                            dicLocationCount[strLocation] = count + 1;
                        else
                            dicLocationCount[strLocation] = 1;
                    }
                }
                else if (etcData.PropertyName == "Status")
                {
                    if (etcData.PropertyValue == "Normal")
                        normalCount++;
                    else if (etcData.PropertyValue == "Low")
                        lowCount++;
                    else if (etcData.PropertyValue == "Chaning")
                        changingCount++;
                }
                else if (etcData.PropertyName == "WorkerCount")
                {
                    if (etcData.PropertyValue != null && etcData.PropertyValue.Length > 0)
                    {
                        string strCount = etcData.PropertyValue.Trim();
                        int count1, count2;

                        if (int.TryParse(strCount, out count1))
                        {
                            if (dicLocationWorkerCount.TryGetValue(strLocation, out count2))
                                dicLocationWorkerCount[strLocation] = count2 + count1;
                            else
                                dicLocationWorkerCount[strLocation] = count1;
                        }
                    }
                }
            }

            foreach (KeyValuePair<string, int> pair in dicLocationCount)
            {
                string strData = pair.Key + "_" + pair.Value.ToString();
                response.LocationCount.Add(strData);
            }

            foreach (KeyValuePair<string, int> pair in dicLocationWorkerCount)
            {
                string strData = pair.Key + "_" + pair.Value.ToString();
                response.LocationWorkerCount.Add(strData);
            }

            response.NormalCount = normalCount;
            response.LowCount = lowCount;
            response.ChangingCount = changingCount;

            return response;
        }

        public ResponseWorkerStatistics GetWorkerStatistics(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} in (Select {3} from {4} where {5} = (Select {6} from {7} where {8} = '작업자 긴급호출'))",
                EtcData.Fields.SiteID,
                siteID,
                EtcData.Fields.SensorID,
                ETC.Fields.ID,
                ETC.TableName,
                ETC.Fields.MaterialType,
                Material.Fields.ID,
                Material.TableName,
                Material.Fields.MaterialName);

            IEnumerable<EtcData> etcDatas = m_dataManager.GetSelect().Select<EtcData>(strCondition, out strErrorMessage);

            if (etcDatas == null)
                return new ResponseWorkerStatistics(false, strErrorMessage);

            int normalCount = 0, changingCount = 0;

            ResponseWorkerStatistics response = new ResponseWorkerStatistics(true, "");

            foreach (EtcData etcData in etcDatas)
            {
                if (etcData.PropertyName == "Status")
                {
                    if (etcData.PropertyValue == "Normal")
                        normalCount++;
                    else if (etcData.PropertyValue == "Chaning")
                        changingCount++;
                }
            }

            response.NormalCount = normalCount;
            response.ChangingCount = changingCount;

            return response;
        }

        public ResponseAPList GetAPList(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("b.{0} = {1} and b.{2} in (Select {3} from {4} where {5} = (Select {6} from {7} where {8} = 'AP'))",
                EtcData.Fields.SiteID,
                siteID,
                EtcData.Fields.SensorID,
                ETC.Fields.ID,
                ETC.TableName,
                ETC.Fields.MaterialType,
                Material.Fields.ID,
                Material.TableName,
                Material.Fields.MaterialName);

            ArrayList arrDatas = m_joinManager.JoinSensorEtcSensorEtcData(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseAPList(false, strErrorMessage);

            Dictionary<int, APData> dicApDatas = new Dictionary<int, APData>();
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is ETC && arrDatas[i + 1] is EtcData)
                {
                    ETC etc = (ETC)arrDatas[i];
                    EtcData etcData = (EtcData)arrDatas[i + 1];

                    APData apData;

                    if (dicApDatas.TryGetValue(etc.ID, out apData) == false)
                    {
                        apData = new APData();
                        apData.SensorID = etc.ID;
                        apData.Name = etc.Name;
                        dicApDatas[etc.ID] = apData;
                    }

                    if (etcData.PropertyName == "MacAddr")
                        apData.MacAddress = etcData.PropertyValue;
                    else if (etcData.PropertyName == "Mapping")
                        apData.Mapping = etcData.PropertyValue == "1";
                    else if (etcData.PropertyName == "RegDate")
                        apData.RegDate = etcData.PropertyValue;
                    else if (etcData.PropertyName == "Use")
                        apData.Use = etcData.PropertyValue == "1";
                    else if (etcData.PropertyName == "Location")
                        apData.LocationName = etcData.PropertyValue;
                }
            }

            ResponseAPList response = new ResponseAPList(true, "");

            foreach (KeyValuePair<int, APData> pair in dicApDatas)
            {
                response.ApList.Add(pair.Value);
            }

            return response;
        }

        public ResponseWorkerList GetWorkerList(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("b.{0} = {1} and b.{2} in (Select {3} from {4} where {5} = (Select {6} from {7} where {8} = '작업자 긴급호출'))",
                EtcData.Fields.SiteID,
                siteID,
                EtcData.Fields.SensorID,
                ETC.Fields.ID,
                ETC.TableName,
                ETC.Fields.MaterialType,
                Material.Fields.ID,
                Material.TableName,
                Material.Fields.MaterialName);

            ArrayList arrDatas = m_joinManager.JoinSensorEtcSensorEtcData(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseWorkerList(false, strErrorMessage);

            Dictionary<int, WorkerData> dicWorkerDatas = new Dictionary<int, WorkerData>();
            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is ETC && arrDatas[i + 1] is EtcData)
                {
                    ETC etc = (ETC)arrDatas[i];
                    EtcData etcData = (EtcData)arrDatas[i + 1];

                    WorkerData workerData;

                    if (dicWorkerDatas.TryGetValue(etc.ID, out workerData) == false)
                    {
                        workerData = new WorkerData();
                        workerData.SensorID = etc.ID;
                        workerData.Name = etc.Name;
                        dicWorkerDatas[etc.ID] = workerData;
                    }

                    if (etcData.PropertyName == "MacAddr")
                        workerData.MacAddress = etcData.PropertyValue;
                    else if (etcData.PropertyName == "Mapping")
                        workerData.Mapping = etcData.PropertyValue == "1";
                    else if (etcData.PropertyName == "RegDate")
                        workerData.RegDate = etcData.PropertyValue;
                    else if (etcData.PropertyName == "Use")
                        workerData.Use = etcData.PropertyValue == "1";
                    else if (etcData.PropertyName == "Worker")
                        workerData.WorkerName = etcData.PropertyValue;
                    else if (etcData.PropertyName == "UniqueKey")
                        workerData.TagNo = etcData.PropertyValue;
                }
            }

            ResponseWorkerList response = new ResponseWorkerList(true, "");

            foreach (KeyValuePair<int, WorkerData> pair in dicWorkerDatas)
            {
                response.WorkerList.Add(pair.Value);
            }

            return response;
        }

        public static string GetSensorTypeName(int nFacilityType, Dictionary<int, Material> dicMaterials)
        {
            Material material;

            if (dicMaterials.TryGetValue(nFacilityType, out material))
            {
                string strMaterialName = material.MaterialName.ToLower();

                if (strMaterialName == "co" ||
                    strMaterialName == "o2" ||
                            strMaterialName == "co2" ||
                            strMaterialName == "h2s" ||
                            strMaterialName == "ch4")
                    return "가스";
                else if (strMaterialName == "ou" ||
                    strMaterialName.StartsWith("미세먼지") ||
                    strMaterialName == "voc" ||
                    strMaterialName.StartsWith("휘발성"))
                    return "대기오염";
                else if (strMaterialName == "비상벨")
                    return "비상벨";
                else if (strMaterialName == "화재감지" ||
                    strMaterialName == "비인가구역")
                    return "열화상카메라";
                else if (strMaterialName.StartsWith("작업자") ||
                    strMaterialName == "배터리 교체")
                    return "작업자";
                else if (strMaterialName == "화재")
                    return "화재";
            }

            return "기타";
        }

        public ResponseRealSensorData GetRealSensorData(RequestRealSensorData request)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} in ({3}, {4}) order by {5}",
                ETC.Fields.ZoneID,
                request.ZoneID,
                ETC.Fields.MaterialType,
                request.TargetTypeID,
                request.CurrentTypeID,
                ETC.Fields.ID);

            IEnumerable<ETC> etcSensors = m_dataManager.GetSelect().Select<ETC>(strCondition, out strErrorMessage);

            if (etcSensors == null)
                return new ResponseRealSensorData(false, strErrorMessage);

            int index = 0;
            
            foreach (ETC sensor in etcSensors)
            {
                if (sensor.MaterialType == request.CurrentTypeID)
                {
                    if (sensor.ID == request.SensorID)
                    {
                        int index2 = 0;

                        foreach (ETC _sensor in etcSensors)
                        {
                            if (_sensor.MaterialType == request.TargetTypeID)
                            {
                                if (index2 == index)
                                {
                                    ResponseRealSensorData response = new ResponseRealSensorData(true, "");
                                    response.Etc = _sensor;
                                    return response;
                                }
                                else
                                    index2++;
                            }
                        }
                    }
                    else
                        index++;
                }
            }

            strCondition = string.Format("{0} = {1} and {2} in ({3}, {4}) order by {5}",
                PSM.Fields.ZoneID,
                request.ZoneID,
                PSM.Fields.MaterialType,
                request.TargetTypeID,
                request.CurrentTypeID,
                PSM.Fields.ID);

            IEnumerable<PSM> psmSensors = m_dataManager.GetSelect().Select<PSM>(strCondition, out strErrorMessage);

            if (psmSensors == null)
                return new ResponseRealSensorData(false, strErrorMessage);

            index = 0;

            foreach (PSM sensor in psmSensors)
            {
                if (sensor.MaterialType == request.CurrentTypeID)
                {
                    if (sensor.ID == request.SensorID)
                    {
                        int index2 = 0;

                        foreach (PSM _sensor in psmSensors)
                        {
                            if (_sensor.MaterialType == request.TargetTypeID)
                            {
                                if (index2 == index)
                                {
                                    ResponseRealSensorData response = new ResponseRealSensorData(true, "");
                                    response.Psm = _sensor;
                                    return response;
                                }
                                else
                                    index2++;
                            }
                        }
                    }
                    else
                        index++;
                }
            }

            return new ResponseRealSensorData(false, "해당 센서정보를 찾을수 없습니다.");
        }
    }
}
