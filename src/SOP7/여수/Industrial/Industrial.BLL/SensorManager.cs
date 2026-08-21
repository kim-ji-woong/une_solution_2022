using SDMS.IDAL;
using SDMS.Model.Sensor;
using System.Collections.Generic;
using SensorServer.Model.Yeosu.External;
using Industrial.BLL.Model;

namespace Industrial.BLL
{
    using Common.Model;
    using Industrial.BLL.Model.Etc;
    using Industrial.BLL.Model.Excel.Writer;
    using Industrial.BLL.Model.Request;
    using Model.Response;
    using Model.Sensors;
    using SDMS.Model.Spatial;
    using SensorServer.Model.Yeosu;
    using SensorServer.Model.Yeosu.Option;
    using SensorServer.Model.Yeosu.Public;
    using SOPSimulator.BLL;
    using System;
    using System.Linq;
    using System.Text;
    using TeamEditor.Model.Sop.Team;

    public class SensorManager
    {
        private IDataManager m_dataManager = null;
        private SensorServer.IDAL.IDataManager m_sensorServerDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;

        public SensorManager(IDataManager dataManager, SensorServer.IDAL.IDataManager sensorServerDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_dataManager = dataManager;
            m_sensorServerDataManager = sensorServerDataManager;
            m_commonDataManager = commonDataManager;
            m_teamDataManager = teamDataManager;
        }

        public List<RegularMember> GetRegulars()
        {
            string strErrorMessage;

            List<RegularMember> list = null;

            list = m_teamDataManager.GetSelectManager().SelectRegularMembers(out strErrorMessage);
            
            if (list != null)
                return list;

            return null;
        }


        public ResponseAllSensors ReadAllSensors()
        {
            string strErrorMessage;
            List<Material> materials = m_dataManager.GetSelectManager().SelectMaterials(null, null, out strErrorMessage);

            if (materials == null)
                return new ResponseAllSensors(false, strErrorMessage);

            Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();

            foreach (Material material in materials)
            {
                dicMaterials[material.ID] = material;
            }

            List<ETC> sensors = m_dataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            if (sensors == null)
                return new ResponseAllSensors(false, strErrorMessage);

            ICollection<Atmosphere> atmospheres = Atmosphere.SelectAtmosphers(sensors, dicMaterials);
            ICollection<Water> waters = Water.SelectWaters(sensors, dicMaterials);
            ICollection<Weather> weathers = Weather.SelectWeathers(sensors, dicMaterials);
            ICollection<VOC> vocs = VOC.SelectVOCs(sensors, dicMaterials);
            ICollection<Stink> stinks = Stink.SelectStinks(sensors, dicMaterials);

            ResponseAllSensors response = new ResponseAllSensors(true, "");

            if (atmospheres != null)
                response.Atmospheres.AddRange(atmospheres);

            if (waters != null)
                response.Waters.AddRange(waters);

            if (weathers != null)
                response.Weathers.AddRange(weathers);

            if (vocs != null)
                response.Vocs.AddRange(vocs);

            if (stinks != null)
                response.Stinks.AddRange(stinks);

            return response;
        }

        public ResponseMaterialAlarmDatas ReadMaterialLinks()
        {
            string strErrorMessage;
            List<MaterialLink> materialLinks = m_sensorServerDataManager.GetSelectManager().SelectMaterialLinks(null, null, out strErrorMessage);

            if (materialLinks == null)
                return new ResponseMaterialAlarmDatas(false, strErrorMessage);

            ResponseMaterialAlarmDatas response = new ResponseMaterialAlarmDatas(true, "");
            response.MaterialLinks.AddRange(materialLinks);
            return response;
        }

        public ResponseSensorDatas ReadSensorDatas() {
            string strErrorMessage;

            List<EtcSensorData> etcSensorDatas = m_sensorServerDataManager.GetSelectManager().SelectEtcSensorDatas(null, null, out strErrorMessage);

            List<Zone> zones = m_dataManager.GetSelectManager().SelectZones(null, null, out strErrorMessage);
            
            if (etcSensorDatas == null)
                return new ResponseSensorDatas(false, strErrorMessage);

            List<SensorData> sensorDatas = new List<SensorData>();

            foreach (EtcSensorData sensorData in etcSensorDatas)
            {
                foreach (Zone zone in zones)
                {
                    if (sensorData.SensorID == zone.ID)
                    {
                        SensorData sd = new SensorData();
                        sd.SensorType = sensorData.SensorType;
                        sd.SensorID = sensorData.SensorID;
                        sd.SensorName = zone.ZoneName;
                        sd.Longitude = sensorData.Longitude; 
                        sd.Latitude = sensorData.Latitude;
                        sd.X = sensorData.X;
                        sd.Y = sensorData.Y;

                        sensorDatas.Add(sd);
                    }
                }
            }

            ResponseSensorDatas response = new ResponseSensorDatas(true, "");
            response.SensorDatas.AddRange(sensorDatas);
            return response;
        }

        public MessageResult UpdateSensorCoordinates(UpdateSensorCoordinates datas)
        {
            string strErrorMessage;

            MessageResult result = new MessageResult();

            if (datas.Coordinates.Count == 0)
            {
                result.Success = true;
                result.Message = "Coordinates.Count = 0";
                return result;
            } 

            Dictionary<EtcSensorData.Fields, object> dicSets = new Dictionary<EtcSensorData.Fields, object>();
            Dictionary<EtcSensorData.Fields, object> dicConditions = new Dictionary<EtcSensorData.Fields, object>();

            foreach (var sensorData in datas.Coordinates)
            {
                dicSets[EtcSensorData.Fields.X] = sensorData.X;
                dicSets[EtcSensorData.Fields.Y] = sensorData.Y;

                dicConditions[EtcSensorData.Fields.SensorID] = sensorData.ID;

                if (m_sensorServerDataManager.GetUpdateManager().UpdateEtcSensorData(dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            result.Success = true;
            return result;
        }

        public ResponseSensorLink ReadSensorLink()
        {
            string strErrorMessage;

            List<SensorLink> sensorLinks = m_sensorServerDataManager.GetSelectManager().SelectSensorLinks(null, null, out strErrorMessage);

            if (sensorLinks == null)
            {
                return new ResponseSensorLink(false, strErrorMessage); // 예외처리
            }

            ResponseSensorLink response = new ResponseSensorLink(true, "");
            response.SensorLinks.AddRange(sensorLinks);
            return response;
                
        }

        public ResponseYeosuSettings ReadYeosuSettings()
        {
            string strErrorMessage;

            string strUseReceiveAtmosphere = "UseReceiveAtmosphere";
            string strUseReceiveWater = "UseReceiveWater";
            string strUseReceiveVOC = "UseReceiveVOC";
            string strUseReceiveOU = "UseReceiveOU";

            List<OptionSDMS> yeosuSettings = m_sensorServerDataManager.GetSelectManager().SelectAllYeosuOptionSDMS(null, null, out strErrorMessage);

            ResponseYeosuSettings response = new ResponseYeosuSettings();

            // 기본 설정 사항이 없으면 기본값
            response.UseReceiveAtmosphere = "true";
            response.UseReceiveWater = "true";
            response.UseReceiveVOC = "true";
            response.UseReceiveOU = "true";

            foreach (OptionSDMS option in yeosuSettings)
            {
                if (option.PropertyName == strUseReceiveAtmosphere)
                    response.UseReceiveAtmosphere = option.PropertyValue;
                else if (option.PropertyName == strUseReceiveWater)
                    response.UseReceiveWater = option.PropertyValue;
                else if (option.PropertyName == strUseReceiveVOC)
                    response.UseReceiveVOC = option.PropertyValue;
                else if (option.PropertyName == strUseReceiveOU)
                    response.UseReceiveOU = option.PropertyValue;
            }

            response.Success = true;
            return response;
        }

        public MessageResult SaveYeosuSettings(Industrial.BLL.Model.Request.RequestYeosuSaveSettings data)
        {
            string strErrorMessage;

            MessageResult response = new MessageResult();

            int nSiteID = -1;
            List<Site> nSiteIDs = m_commonDataManager.GetSelectManager().SelectSites(null, out strErrorMessage);
            if (nSiteIDs.Count == 0 || nSiteIDs == null)
            {
                response.Success = false;
                response.Message = strErrorMessage = "SiteID를 조회할 수 없습니다.";
                return response;
            }
            else
                nSiteID = nSiteIDs[0].ID;

            string strUseReceiveAtmosphere = "UseReceiveAtmosphere";
            string strUseReceiveWater = "UseReceiveWater";
            string strUseReceiveVOC = "UseReceiveVOC";
            string strUseReceiveOU = "UseReceiveOU";

            string strAtmosDescription = "대기오염센서 사용여부";
            string strWaterDescription = "수질오염센서 사용여부";
            string strVOCDescription = "VOC오염센서 사용여부";
            string strOUDescription = "악취센서 사용여부";

            if (data != null)
            {
                if (!UpdateOption(strUseReceiveAtmosphere, data.UseReceiveAtmosphere, nSiteID, strAtmosDescription, out strErrorMessage))
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }

                if (!UpdateOption(strUseReceiveWater, data.UseReceiveWater, nSiteID, strWaterDescription, out strErrorMessage))
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }

                if (!UpdateOption(strUseReceiveVOC, data.UseReceiveWater, nSiteID, strVOCDescription, out strErrorMessage))
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }

                if (!UpdateOption(strUseReceiveOU, data.UseReceiveOU, nSiteID, strOUDescription, out strErrorMessage))
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }
            }
            response.Success = true;
            return response;
        }

        private bool UpdateOption(string strPropertyName, string strPropertyValue, int nSiteID, string strDescription, out string strErrorMessage)
        {

            OptionSDMS option = new OptionSDMS();
            option.PropertyName = strPropertyName;
            option.PropertyValue = strPropertyValue;
            option.SiteID = nSiteID;
            option.Description = strDescription;

            string strAdditionalConditions = string.Format("PropertyName = '{0}'", strPropertyName);

            List<OptionSDMS> options = m_sensorServerDataManager.GetSelectManager().SelectAllYeosuOptionSDMS(null, strAdditionalConditions, out strErrorMessage);
            if (options == null)
            {
                strErrorMessage = "OptionSDMS is Null";
            }

            if (options.Count == 0)
            {
                OptionSDMS _option = m_sensorServerDataManager.GetCreateManager().CreateYeosuOptionSDMS(option, out strErrorMessage);
                if (_option == null)
                {
                    strErrorMessage = strPropertyName + " CreateOption 실패";
                    return false;
                }
            }
            else if (options.Count > 0)
            {
                OptionSDMS optionData = options[0];
                optionData.PropertyValue = strPropertyValue;
                string strCondition = "ID = " + optionData.ID.ToString();

                if (!m_sensorServerDataManager.GetUpdateManager().UpdateYeosuOptionSDMS(optionData, out strErrorMessage))
                {
                    strErrorMessage = strPropertyName + " UpdateOption 실패";
                    return false;
                }
            }

            return true;
        }

        public ResponseSensorDataHistory ReadSensorDataHistories2()
        {
            string strErrorMessage;

            List<ETC> etcs = m_dataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            List<EtcSensorDataHistory> etcSensorDataHistories = new List<EtcSensorDataHistory>();

            Dictionary<int, List<EtcSensorDataHistory>> dicEtcSensorDataHistory = new Dictionary<int, List<EtcSensorDataHistory>>();

            bool isNullable;
            int nSensorID;

            string strAdditionalCondition;

            DateTime dt = DateTime.Now.AddHours(-3);
            string strDt = dt.ToString("yyyyMMdd HH:mm:ss");

            for (int i = 0; i < etcs.Count; i++)
            {
                nSensorID = etcs[i].ID;

                strAdditionalCondition = string.Format("{0} = {1} and {2} > '{3}' order by {0} desc, {2} desc", EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.SensorID, out isNullable),
                                                                                      nSensorID,
                                                                                      EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out isNullable),
                                                                                      strDt);
                List<EtcSensorDataHistory> result = m_sensorServerDataManager.GetSelectManager().SelectEtcSensorDataHistorys(null, strAdditionalCondition, out strErrorMessage);
                if (result.Count != 0 || result != null)
                {
                    foreach (EtcSensorDataHistory item in result)
                    {
                        etcSensorDataHistories.Add(item);
                    }

                }
                else
                {
                    return new ResponseSensorDataHistory(false, strErrorMessage);
                }
            }


            ResponseSensorDataHistory response = new ResponseSensorDataHistory();

            return response;
        }
        
        public ResponseSensorDataHistory ReadSensorDataHistories()
        {
            string strErrorMessage;
            
            
            
            List<ETC> etcs = m_dataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            List<EtcSensorDataHistory> etcSensorDataHistories = new List<EtcSensorDataHistory>();
            
            Dictionary<EtcSensorDataHistory.Fields, object> dicConditions = new Dictionary<EtcSensorDataHistory.Fields, object>();

            //dicConditions[EtcSensorDataHistory.Fields.SensorID] = 2;
            bool isNullable;
            int nSensorID;

            DateTime dt = DateTime.Now.AddHours(-3);
            string strDt = dt.ToString("yyyyMMdd HH:mm:ss");

            string strAdditionalCondition = null;

            for (int i = 0; i < etcs.Count; i++)
            {
                nSensorID = etcs[i].ID;

                strAdditionalCondition = string.Format("{0} = {1} and {2} > '{3}' order by {0} desc, {2} desc", EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.SensorID, out isNullable),
                                                                                        nSensorID,
                                                                                        EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out isNullable),
                                                                                        strDt);
                List<EtcSensorDataHistory> result = m_sensorServerDataManager.GetSelectManager().SelectEtcSensorDataHistorys(null, strAdditionalCondition, out strErrorMessage);
                if (result != null)
                {
                    foreach(EtcSensorDataHistory item in result)
                    {
                        etcSensorDataHistories.Add(item);
                    }
                } else
                {
                    return new ResponseSensorDataHistory(false, strErrorMessage);
                }
            }

            if (etcSensorDataHistories == null)
                return new ResponseSensorDataHistory(false, strErrorMessage);

            ResponseSensorDataHistory response = new ResponseSensorDataHistory(true, "");
            response.EtcSensorDataHistories.AddRange(etcSensorDataHistories);
            return response;
        }

        public ResponseSensorDataHistory ReadSensorDataHistoryByConditions(RequestSensorDataHistoryByConditions datas)
        {
            string strErrorMessage;
            
            List<int> zoneIDs = datas.ZoneIDs;
            List<int> materials = datas.Materials;
            
            StringBuilder sbZoneIDs = new StringBuilder();
            StringBuilder sbMaterials = new StringBuilder();
            
            if (zoneIDs != null)
            {
                for (int i = 0; i < zoneIDs.Count; i++)
                {
                    sbZoneIDs.Append(zoneIDs[i]);
                    if (i != zoneIDs.Count - 1)
                        sbZoneIDs.Append(",");
                }
            }
            
            if (materials != null)
            {
                for (int i = 0; i < materials.Count; i++)
                {
                    sbMaterials.Append(materials[i]);
                    if (i != materials.Count - 1)
                        sbMaterials.Append(",");
                }
            }
            
            string strZoneIDs = sbZoneIDs.ToString();
            string strMaterials = sbMaterials.ToString();
            
            string strAdditionalCondition = string.Format("ZoneID in ({0}) and MaterialType in ({1})", strZoneIDs, strMaterials);
            
            List<ETC> etcs = m_dataManager.GetSelectManager().SelectETCSensors(null, strAdditionalCondition, out strErrorMessage);
            
            string beginTime = GetDateTime(datas.BeginDate).ToString("yyyy-MM-dd 00:00:000");
            string endTime = GetDateTime(datas.EndDate).ToString("yyyy-MM-dd 23:59:000");
            
            List<EtcSensorDataHistory> etcSensorDataHistories = new List<EtcSensorDataHistory>();
            
            strAdditionalCondition = string.Format("{0} > '{1}' and {0} < '{2}'", EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out bool isNullable), beginTime, endTime);
            
            Dictionary<int, EtcSensorDataHistory> dicEtcSensorDataHistory = new Dictionary<int, EtcSensorDataHistory>();
            
            StringBuilder sbSensorIDs = new StringBuilder();
            for (int i = 0; i < etcs.Count; i++)
            {
                sbSensorIDs.Append(etcs[i].ID);
                if (i != etcs.Count - 1)
                    sbSensorIDs.Append(",");
            }
            string strSensorIDs = sbSensorIDs.ToString();
            
            // timeStamp >= beginTime and timeStamp <= endTime
            string strAdditionalHistoryConditions = string.Format("{0} >= '{1}' and {0} <= '{2}'", EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out isNullable), beginTime, endTime);
            strAdditionalHistoryConditions += string.Format(" and {0} in ({1})", EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.SensorID, out isNullable), strSensorIDs);
            strAdditionalHistoryConditions += string.Format(" order by {0}, {1}", EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.SensorID, out isNullable), EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out isNullable));
            
            etcSensorDataHistories = m_sensorServerDataManager.GetSelectManager().SelectEtcSensorDataHistorys(null, strAdditionalHistoryConditions, out strErrorMessage);
            
            ResponseSensorDataHistory response = new ResponseSensorDataHistory(true, "");

            if (strErrorMessage != "" && etcSensorDataHistories == null)
            {
                response.Message = strErrorMessage;
                response.Success = false;
                return response;
            }
            
            response.EtcSensorDataHistories.AddRange(etcSensorDataHistories);
            return response;
        }
        
        public DateTime GetDateTime(string strDate)
        {
            DateTime dt;
            // get DateTime like 2023-10-31 15:10:00 from '20240225'
            if (strDate.Length == 8)
            {
                string year = strDate.Substring(0, 4);
                string month = strDate.Substring(4, 2);
                string day = strDate.Substring(6, 2);
                dt = new DateTime(int.Parse(year), int.Parse(month), int.Parse(day));
            }
            else
            {
                dt = DateTime.Now;
            }
            return dt;
        }

        public ResponsePublicData ResponsePublicDatas()
        {
            string strErrorMessage;

            List<KmaAsos> kmaAsos = m_sensorServerDataManager.GetSelectManager().SelectKmaAsoses(null, null, null, out strErrorMessage);

            List<AirDataHistory> airDataHistories = m_sensorServerDataManager.GetSelectManager().SelectAirDataHistories(null, null, null, out strErrorMessage);

            List<CleanSYS> cleanSYSs = m_sensorServerDataManager.GetSelectManager().SelectCleanSYSs(null, null, null, out strErrorMessage);

            List<AirNode> airNodes = m_sensorServerDataManager.GetSelectManager().SelectAirNodes(null, null, null, out strErrorMessage);

            var groupedCleanSYSs = cleanSYSs.GroupBy(obj => obj.FactManageNM).Select(g => g.First()).ToList();
            
            List<Dictionary<string, List<CleanSYS>>> resultDatas = new List<Dictionary<string, List<CleanSYS>>>();

            foreach(var groupedCleanSYS in groupedCleanSYSs)
            {
                Dictionary<string, List<CleanSYS>> elements = new Dictionary<string, List<CleanSYS>>();

                List<CleanSYS> csList = cleanSYSs.FindAll(r => r.FactManageNM == groupedCleanSYS.FactManageNM);

                csList.Sort((p1, p2) => p1.StackCode.CompareTo(p2.StackCode));

                elements.Add(groupedCleanSYS.FactManageNM, csList);

                resultDatas.Add(elements);
            }

            if (kmaAsos == null && airDataHistories == null && cleanSYSs == null && airNodes == null)
            {
                return new ResponsePublicData(false, strErrorMessage);
            }
                
            ResponsePublicData response = new ResponsePublicData(true, "");

            if (airNodes != null)
            {
                response.AirNodes = airNodes;
            }

            if (kmaAsos != null)
            {
                response.KmaAsos = kmaAsos;
            } 
            else
            {
                response.Message = strErrorMessage + " kmaAsos가 Null입니다.";
            }

            if (airDataHistories != null)
            {
                response.AirDataHistories = airDataHistories;
            }
            else
            {
                response.Message = strErrorMessage + " airDataHistories가 Null입니다.";
            }

            if (cleanSYSs != null)
            {
                response.CleanSYSs = cleanSYSs;
            }
            else
            {
                response.Message = strErrorMessage + " cleanSYSs가 Null입니다.";
            }

            if (resultDatas != null)
            {
                response.SortedCleanSYSs = resultDatas;
            } 
            else
            {
                response.Message = strErrorMessage + " sortedCleansys가 Null입니다";
            }

            return response;
        }

        public Industrial.BLL.Model.Response.ResponseExcelInfo DownloadSensor()
        {

            string strErrorMessage = "";
            ResponseExcelInfo result = new ResponseExcelInfo();
            ExcelWriter writer = ExcelWriter.MakeInstance(DataMode.SensorInfo, m_sensorServerDataManager, m_dataManager);

            if (writer == null)
            {
                result.Message = "ExcelWriter 생성 실패";
                result.Success = false;
                return result;
            }

            byte[] bytes = writer.Run(out strErrorMessage);

            if (bytes == null)
            {
                result.Message = strErrorMessage;
                result.Success = false;
                return result;
            }

            result.Bytes = bytes;
            result.Success = true;
            return result;
        }

        public bool SendSMS(string message, SOPSimulator.BLL.ProcessManager sopProcessManager)
        {

            string strCaller = "0616592812";

            if (message == "")
            {
                message = "가상상황 테스트 문자입니다.\nSOP 유형 : 화학사고(가스누출)\n재난 위치 : LG화학 PE 사거리\n발생 시간 : 2023/10/31 15:10:00\n누출 가스 : 어크릴로니트릴\n위험단계 : 경계";
            }

            List<RegularMember> list = GetRegulars();
            List<string> numbers = new List<string>();

            SMSManager m_smsManager = sopProcessManager.GetSMSManager();

            foreach (RegularMember member in list)
            {
                if (member.PhoneNumber != "" && member.PhoneNumber != null)
                {
                    string phoneNum = m_smsManager.DecryptString(member.PhoneNumber);
                    numbers.Add(phoneNum);
                }
            }

            if (message != "")
            {
                if (m_smsManager.SendSMS(strCaller, numbers, message))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
