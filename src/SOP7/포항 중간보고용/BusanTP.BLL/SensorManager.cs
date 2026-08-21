using System.Collections;
using SDMS.IDAL;
using SDMS.Model.Sensor;
using System.Collections.Generic;
using BusanTP.BLL.Models.Response;
using BusanTP.BLL.Models.Sensor;
using dnsDBUtil;
using SDMS.BLL.Models.Response;
using SDMS.Model.History;

namespace BusanTP.BLL
{
    using BusanTP.Model;
    using Common.Model;
    using SDMS.Model.Spatial;
    using SOPSimulator.BLL;
    using System;
    using System.Linq;
    using System.Text;
    using TeamEditor.Model.Sop.Team;
    
    public class SensorManager
    {
        private IDataManager m_dataManager = null;
        private BusanTP.IDAL.IDataManager m_externalDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        
        public SensorManager(IDataManager dataManager, BusanTP.IDAL.IDataManager externalDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_dataManager = dataManager;
            m_externalDataManager = externalDataManager;
            m_commonDataManager = commonDataManager;
            m_teamDataManager = teamDataManager;
        }
        
        public ResponseAllSensors ReadAllSensors()
        {
            string strErrorMessage;
            List<SDMS.Model.Sensor.Material> materials =
                m_dataManager.GetSelectManager().SelectMaterials(null, null, out strErrorMessage);
            
            Dictionary<int, SDMS.Model.Sensor.Material> dicMaterials = new Dictionary<int, SDMS.Model.Sensor.Material>();

            foreach (SDMS.Model.Sensor.Material material in materials)
            {
                dicMaterials[material.ID] = material;
            }
            
            List<ETC> sensors = m_dataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            if (sensors == null)
                return new ResponseAllSensors(false, strErrorMessage);
            
            ResponseAllSensors response = new ResponseAllSensors();
            
            ICollection<Atmosphere> atmospheres = Atmosphere.SelectAtmospheres(sensors, dicMaterials);
            ICollection<Weather> weathers = Weather.SelectWeathers(sensors, dicMaterials);
            ICollection<KWeather> kweathers = KWeather.SelectKWeathers(sensors, dicMaterials);

            if (atmospheres != null)
                response.Atmospheres.AddRange(atmospheres);
            
            if (weathers != null)
                response.Weathers.AddRange(weathers);
            
            if (kweathers != null)
                response.KWeathers.AddRange(kweathers);
            
            response.Success = true;
            return response;
        }
        
        public ResponseExternalSensors ReadExternalSensors()
        {
            string strErrorMessage;
            List<BusanTP.Model.Sensor> sensors = m_externalDataManager.GetSelectManager().SelectBusanExternalSensors(null, null, out strErrorMessage);

            if (sensors == null)
                return new ResponseExternalSensors(false, strErrorMessage);
            
            ResponseExternalSensors response = new ResponseExternalSensors();
            response.Sensors.AddRange(sensors);
            response.Success = true;
            return response;
        }

        public ResponseExternalSensorTypes ReadExternalSensorTypes()
        {
            string strErrorMessage;
            List<BusanTP.Model.SensorType> sensorTypes = m_externalDataManager.GetSelectManager().SelectBusanExternalSensorTypes(null, null, out strErrorMessage);
            
            if (sensorTypes == null)
                return new ResponseExternalSensorTypes(false, strErrorMessage);
            
            ResponseExternalSensorTypes response = new ResponseExternalSensorTypes();
            response.SensorTypes.AddRange(sensorTypes);
            response.Success = true;
            return response;
        }

        public ResponseExternalMaterials ReadExternalMaterials()
        {
            string strErrorMessage;
            List<Model.Material> materials = m_externalDataManager.GetSelectManager().SelectBusanExternalMaterials(null, null, out strErrorMessage);
            
            if (materials == null)
                return new ResponseExternalMaterials(false, strErrorMessage);

            string strQuery = $@"Select {Model.Material.TableName}.* , {SDMS.Model.Sensor.Material.TableName}.{SDMS.Model.Sensor.Material.Fields.MaterialName.ToString()} 
                                    from {Model.Material.TableName} Join {SDMS.Model.Sensor.Material.TableName} 
                                        on {Model.Material.TableName}.{Model.Material.Fields.MaterialID.ToString()} = {SDMS.Model.Sensor.Material.TableName}.{SDMS.Model.Sensor.Material.Fields.ID} 
                                            order by {Model.Material.TableName}.{Model.Material.Fields.MaterialID.ToString()}";
            
            ArrayList arrResult = m_dataManager.GetSelectManager().GetResultData(strQuery, out strErrorMessage);
            
            ResponseExternalMaterials response = new ResponseExternalMaterials();
            
            if (arrResult == null || arrResult.Count == 0)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            int nResultCount = arrResult.Count;
            
            for (int i = 0; i < nResultCount - 8; i += 9)
            {
                ExternalMaterialJoinSensorMaterialName externalMaterialJoinSensorMaterialName = new ExternalMaterialJoinSensorMaterialName();

                dnsDBUtil.VariousData<int> m_nMaterialID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString());
                dnsDBUtil.VariousData<int> m_nUniqueID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 1].ToString());
                dnsDBUtil.VariousData<double> m_dMin1 = dnsDBUtil.WebDBManager.GetDoubleField(arrResult[i + 2].ToString());
                dnsDBUtil.VariousData<double> m_dMax1 = dnsDBUtil.WebDBManager.GetDoubleField(arrResult[i + 3].ToString());
                dnsDBUtil.VariousData<double> m_dMin2 = dnsDBUtil.WebDBManager.GetDoubleField(arrResult[i + 4].ToString());
                dnsDBUtil.VariousData<double> m_dMax2 = dnsDBUtil.WebDBManager.GetDoubleField(arrResult[i + 5].ToString());
                dnsDBUtil.VariousData<int> m_nDirection = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 6].ToString());
                string m_strInfo = dnsDBUtil.WebDBManager.GetStringField(arrResult[i + 7].ToString());
                string m_strMaterialName = dnsDBUtil.WebDBManager.GetStringField(arrResult[i + 8].ToString());
                
                externalMaterialJoinSensorMaterialName.MaterialID = m_nMaterialID.Data;
                externalMaterialJoinSensorMaterialName.UniqueID = m_nUniqueID.Data;
                if (m_dMin1 != null) externalMaterialJoinSensorMaterialName.Min1 = m_dMin1?.Data;
                if (m_dMax1 != null) externalMaterialJoinSensorMaterialName.Max1 = m_dMax1?.Data;
                if (m_dMin2 != null) externalMaterialJoinSensorMaterialName.Min2 = m_dMin2?.Data;
                if (m_dMax2 != null) externalMaterialJoinSensorMaterialName.Max2 = m_dMax2?.Data;
                if (m_nDirection != null) externalMaterialJoinSensorMaterialName.Direction = m_nDirection.Data;
                externalMaterialJoinSensorMaterialName.Info = m_strInfo;
                externalMaterialJoinSensorMaterialName.MaterialName = m_strMaterialName;
                response.ExternalMaterialJoinSensorMaterialName.Add(externalMaterialJoinSensorMaterialName);
            }
            
            response.Materials.AddRange(materials);
            response.Success = true;
            return response;
        }

        public ResponseAlarmMemo ReadAlarmMemo()
        {
            ResponseAlarmMemo response = new ResponseAlarmMemo();
            
            Dictionary<int, string> dicAlarmMemos = new Dictionary<int, string>();

            string strQuery = $@"Select {SensorZoneHistory.TableName}.{SensorZoneHistory.Fields.ID.ToString()},
                                        {SensorZoneHistory.TableName}.{SensorZoneHistory.Fields.Memo.ToString()} 
                                        from {SensorZoneHistory.TableName} 
                                            where CONVERT(varchar, {SensorZoneHistory.Fields.Memo.ToString()}) != ''
                                            and {SensorZoneHistory.TableName}.{SensorZoneHistory.Fields.Memo.ToString()} is not null
                                                order by {SensorZoneHistory.TableName}.{SensorZoneHistory.Fields.ID.ToString()}";

            string strErrorMessage;
            ArrayList arrResult = m_dataManager.GetSelectManager().GetResultData(strQuery, out strErrorMessage);
            
            if (arrResult == null || arrResult.Count == 0)
            {
                response.Success = true;
                response.Message = strErrorMessage;
                
                if (response.Message == null)
                    response.Message = "현재 메모된 알람이 없습니다.";
                
                return response;
            }
            
            for (int i = 0; i < arrResult.Count; i += 2)
            {
                dnsDBUtil.VariousData<int> m_nSensorZoneHistoryID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString());
                string m_strMemo = dnsDBUtil.WebDBManager.GetStringField(arrResult[i + 1].ToString());
                
                dicAlarmMemos[m_nSensorZoneHistoryID.Data] = m_strMemo;
            }
            
            response.AlarmMemos = dicAlarmMemos;
            response.Success = true;
            
            return response;
        }

        public ResponseBusanSdmsOption ReadBusanSdmsOptions() {

            string strErrorMessage;

            ResponseBusanSdmsOption response = new ResponseBusanSdmsOption();

            List<SdmsOption> sdmsOptions = m_externalDataManager.GetSelectManager().SelectBusanSdmsOptions(null, null, out strErrorMessage);

            if (sdmsOptions.Count != 0) {
                response.SdmsOptions = sdmsOptions;
                response.Success = true;
                return response;
            }

            response.Success = false;
            response.Message = strErrorMessage;
            return response;
        }
    }
}