using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using BusanSensorServer.DTO;
using BusanSensorServer.Model;
using BusanSensorServer.Model.External;
using BusanSensorServer.Model.Sensor;
using BusanSensorServer.Models;
using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.Extensions.Logging;
using SDMS.Model.Sensor;
using Material = BusanSensorServer.Model.External.Material;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SDMS.Model.Spatial;

namespace BusanSensorServer.Managers
{
    public class SensorManager
    {
        private DataManager m_dataManager = null;
        private DataManager m_externalDataManager = null;
        private SopQueryManager m_sopQueryManager = null;
        private AlarmManager m_alarmManager = null;

        private static int nTemp = 1;
        private static int nHumi = 2;
        
        private static int m_nTemp = 8192;
        private static int m_nHumi = 8448;

        private Dictionary<string, string> DicKWeatherDate = null;
        private Dictionary<string, bool> DicSdmsOptions = null;

        private bool m_bTestOption = false;
        
        private string m_strTestPropertyName = "IsTest";
        private DateTime m_dtLastSensorAccessTime = DateTime.Today;
        private DateTime m_dtLastWeatherSensorAccessTime = DateTime.Today;
        
        private static readonly HttpClient client = new HttpClient();
        
        public SensorManager(DataManager dataManager, DataManager externalDataManager, SopQueryManager sopQueryManager, AlarmManager alarmManager)
        {
            m_dataManager = dataManager;
            m_externalDataManager = externalDataManager;
            m_sopQueryManager = sopQueryManager;
            m_alarmManager = alarmManager;
            
            Logger.Instance.Write("DBHost : " + dataManager.GetDBManager().DbHost);
            Logger.Instance.Write("DBName : " + dataManager.GetDBManager().DbName);
            Logger.Instance.Write("DBID : " + dataManager.GetDBManager().DbID);
            Logger.Instance.Write("DBPW : " + dataManager.GetDBManager().DbPw);
        }
        
        Dictionary<int, SensorTag> m_dicSensorTags = new Dictionary<int, SensorTag>(); // OrgSensor, SensorTag
        
        // 임계치
        Dictionary<int, Material> m_dicMaterials = new Dictionary<int, Material>();

        // <summary>
        // 테스트 신호 처리 - 혀재 미사용
        // </summary>
        #region Process TestEvent
        /// <summary>
        /// GIS 기능테스트 On/Off 트리거 MSSQL 전달 (미사용)
        /// </summary>
        public bool UpdateTest(out string strErrorMessage)
        {
            if (!UpdateTestOption(out strErrorMessage))
            {
                Logger.Instance.Write("[ERROR] TestOption 업데이트 실패 : " + strErrorMessage);
                return false;
            }
            
            if (!UpdateTestEvent(out strErrorMessage))
            {
                Logger.Instance.Write("[ERROR] TestEvent 업데이트 실패 : " + strErrorMessage);
                return false;
            }
            
            return true;
        }

        public bool UpdateTestOption(out string strErrorMessage)
        {
            string strQuery = $@"Select 
                                idx, 
                                dt_op_user_id, 
                                event_use 
                            from dt_op_event_status";
    
            IEnumerable<dynamic> testOptionResult = m_externalDataManager.GetSelect().Select(strQuery, out strErrorMessage);
            // 한개의 계정이라도 이벤트 사용중일 경우 이벤트 모드로 전환
            m_bTestOption = false;
            foreach (var item in testOptionResult)
            {
                if (item.event_use == true)
                {
                    m_bTestOption = true;
                    break;
                }
            }

            string strValue = m_bTestOption ? "True" : "False";

            string strUpdate = $@"Update BusanTestOptions Set PropertyValue = '{strValue}'";

            if (!m_dataManager.GetUpdate().Update(strUpdate, out strErrorMessage))
            {
                return false;
            }
    
            return true;
        }
        
        public bool UpdateTestEvent(out string strErrorMessage)
        {
            if (!m_bTestOption)
            {
                strErrorMessage = string.Empty;
                return true;
            }
            
            string strPrevEventsQuery = $@"Select 
                                        ID,
                                        NodeID,
                                        UniqueID,
                                        Value,
                                        RegDate
                                from BusanTestEvent";
            
            List<TestEvents> prevEventsResult = m_dataManager.GetSelect().Select(strPrevEventsQuery, out strErrorMessage)
                .Where(item => item != null)
                .Select(item => new TestEvents
                {
                    ID = item.ID,
                    NodeID = item.NodeID,
                    UniqueID = item.UniqueID,
                    Value = item.Value,
                    RegDate = item.RegDate
                }).ToList();
            
            
            string strEventsQuery = $@"Select 
                                        idx,
                                        sys_net_node_id,
                                        sensor_unique_id,
                                        event_value,
                                        reg_date
                                from dt_op_event";

            IEnumerable<dynamic> testEventsResult = m_externalDataManager.GetSelect().Select(strEventsQuery, out strErrorMessage);
            
            List<TestEvents> testEventDict = testEventsResult.Select(item => new TestEvents
            {
                ID = item.idx,
                NodeID = item.sys_net_node_id,
                UniqueID = item.sensor_unique_id,
                Value = item.event_value,
                RegDate = item.reg_date
            }).ToList();
            
            if (testEventDict.Count == 0)
            {
                // 새로운 이벤트 없을 시 전체 종료
                if (m_dataManager.GetDelete().Delete<TestEvents>("", out strErrorMessage))
                {
                    return true;
                }
            }
            
            List<int> nodeIDs = testEventDict.Select(item => item.NodeID).ToList();
            
            string strNodeIDs = string.Join(",", nodeIDs);
            string strDeleteConditions = $@"NodeID not in ({strNodeIDs})";
            
            if (!m_dataManager.GetDelete().Delete<TestEvents>(strDeleteConditions, out strErrorMessage))
            {
                return false;
            }

            foreach (var item in testEventDict)
            {
                // 매칭 여부 검사
                if (prevEventsResult.Any(e => e.NodeID == item.NodeID))
                {
                    // 매칭되는 이벤트 1개 가져오기 !-- 여러개가 나올수 없음 그냥 한번 더 검사 --!
                    TestEvents matchingEvent =
                        prevEventsResult.First(e => e.NodeID == item.NodeID);

                    string strUpdateEvent =
                        $@"Update BusanTestEvent 
                            Set Value = {item.Value} , UniqueID = {item.UniqueID} , RegDate = '{item.RegDate:yyyy-MM-dd HH:mm:ss}'
                            Where {TestEvents.Fields.NodeID} = {matchingEvent.NodeID}";

                    if (!m_dataManager.GetUpdate().Update(strUpdateEvent, out strErrorMessage))
                    {
                        return false;
                    }
                    
                }
                else
                {
                    // 새로운 값으로 Insert
                    string strInsertEvent =
                        $@"Insert Into BusanTestEvent
                            (ID, NodeID, UniqueID, Value, RegDate)
                            Values ((SELECT COALESCE(MAX(ID), 0) + 1 FROM BusanTestEvent), {item.NodeID}, {item.UniqueID}, {item.Value}, '{item.RegDate:yyyy-MM-dd HH:mm:ss}')";

                    if (!m_dataManager.GetCreate().Insert(strInsertEvent, out strErrorMessage))
                    {
                        return false;
                    }
                }
            }

            return true;
        }
        

        

        #endregion
        
        
        public bool AreAlmostEqual(double a, double b, double epsilon = 1e-12)
        {
            return Math.Abs(a - b) < epsilon;
        }

        /// <summary>
        /// 센서 값 업데이트 및 알람 처리
        /// </summary>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        public bool EntireProcess(out string strErrorMessage)
        {

            if (!Init(out strErrorMessage))
            {
                strErrorMessage = "초기화 실패 : " + strErrorMessage;
                return false;
            }
            
            Dictionary<int, bool> dicNodeUse = GetValidNodes(out strErrorMessage);
            
            if (dicNodeUse == null || dicNodeUse.Count == 0)
            {
                strErrorMessage = $@"유효한 노드가 없습니다. : {strErrorMessage}";
                return false;
            }

            if (!UpdateSensorData(dicNodeUse, out strErrorMessage))
            {
                Logger.Instance.Write("[ERROR] UpdateSensorData 실패 : " + strErrorMessage);
                return false;
            }

            if (!UpdateKWeatherData(out strErrorMessage))
            {
                Logger.Instance.Write("[ERROR] UpdateKWeatherData 실패" + strErrorMessage);
            }
            
            if (!UpdateWeatherSensorDataHistory(out strErrorMessage))
            {
                Logger.Instance.Write("[ERROR] UpdateWeatherSensorDataHistory 실패" + strErrorMessage);
            }
            
            return true;
        }
        
        /// <summary>
        /// 초기화 메서드
        /// </summary>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private bool Init(out string strErrorMessage)
        {
            m_dicSensorTags.Clear();
            m_dicMaterials.Clear();
            
            string strQuery;

            strQuery = $@"Select SSZ.ID as SensorZoneID, SSZ.OrgSensorID, SSZ.EquipZoneID, SSZ.SensorType, SSTI.ID as TagID 
                            from {SensorZone.TableName} SSZ 
                                JOIN {TagInfo.TableName} SSTI on SSZ.ID = SSTI.SensorZoneID ";
            
            IEnumerable<dynamic> sensorTags = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
            
            if (sensorTags == null || sensorTags.Count() == 0)
            {
                strErrorMessage = "SensorZone Join SensorTagInfo 테이블 조회 실패 : " + strErrorMessage;
                return false;
            }
            
            Dictionary<int, SensorTag> dicSensorTags = new Dictionary<int, SensorTag>();

            foreach (var item in sensorTags)
            {
                SensorTag sensorTag = new SensorTag();
                sensorTag.ID = item.SensorZoneID;
                sensorTag.SensorZoneID = item.SensorZoneID;
                sensorTag.OrgSensorID = item.OrgSensorID;
                sensorTag.SensorType = item.SensorType;
                sensorTag.TagID = item.TagID;
                
                dicSensorTags.Add(item.OrgSensorID, sensorTag);
            }
            
            m_dicSensorTags = dicSensorTags;
            
            strQuery = String.Empty;
            
            strQuery = $@"Select {Material.Fields.MaterialID.ToString()}
                            ,{Material.Fields.UniqueID.ToString()}
                            ,{Material.Fields.Min1.ToString()}
                            ,{Material.Fields.Max1.ToString()}
                            ,{Material.Fields.Min2.ToString()}
                            ,{Material.Fields.Max2.ToString()}
                            ,{Material.Fields.Direction.ToString()}
                            ,{Material.Fields.Info.ToString()}
                            from {Material.TableName}";
            
            IEnumerable<dynamic> materials = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
            
            if (materials == null || materials.Count() == 0)
            {
                strErrorMessage = "BusanExternalMaterial 테이블 조회 실패 : " + strErrorMessage;
                return false;
            }
            
            foreach (var mat in materials)
            {
                Material material = new Material();
                
                material.MaterialID = mat.MaterialID;
                material.UniqueID = mat.UniqueID;
                material.Min1 = mat.Min1;
                material.Max1 = mat.Max1;
                material.Min2 = mat.Min2;
                material.Max2 = mat.Max2;
                material.Direction = mat.Direction;
                material.Info = mat.Info;
                
                m_dicMaterials.Add(mat.UniqueID, material);
            }

            strQuery = string.Empty;
            strQuery = $@"Select {SdmsOption.Fields.PropertyName},
                                 {SdmsOption.Fields.PropertyValue},
                                 {SdmsOption.Fields.Description}
                            from {SdmsOption.TableName}";
            
            IEnumerable<dynamic> sdmsOptions = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
            
            if (sdmsOptions == null || sdmsOptions.Count() == 0)
            {
                strErrorMessage = "SdmsOption 테이블 조회 실패 : " + strErrorMessage;
                return false;
            }
            
            DicSdmsOptions = new Dictionary<string, bool>();
            foreach (var item in sdmsOptions)
            {
                DicSdmsOptions.Add(item.PropertyName, item.PropertyValue);
            }

            return true;
        }
        
        /// <summary>
        /// 유효한 Node를 가져오는 메서드
        /// </summary>
        /// <param name="strErrorMessage">에러 메세지</param>
        /// <returns></returns>
        private Dictionary<int, bool> GetValidNodes(out string strErrorMessage)
        {
            Dictionary<int, bool> dicNodeUse = new Dictionary<int, bool>();
            
            string strQuery = $@"SELECT sys_net_node_id, sys_net_node_name, sys_net_node_use FROM sys_net_node";
            Logger.Instance.Write("GetValidNodes strQuery : " + strQuery);

            IEnumerable<dynamic> sys_net_nodes = m_externalDataManager.GetSelect().Select(strQuery, out strErrorMessage);
            if (sys_net_nodes == null)
            {
                strErrorMessage = "sys_net_node 테이블 조회 실패 : " + strErrorMessage;
                return null;
            }
            
            foreach (var item in sys_net_nodes)
            {
                if (item.sys_net_node_use == 1)
                {
                    dicNodeUse.Add(item.sys_net_node_id, true);
                }
                else
                {
                    dicNodeUse.Add(item.sys_net_node_id, false);
                }
            }
            
            return dicNodeUse;
        }

        private bool UpdateWeatherSensorDataHistory(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            
            if (!IsTimeOnFiveMinutes())
            {
                return true;
            }

            List<string> arrInserts = new List<string>();
            
            string strDate = DateTime.Now.ToString("yyyy-MM-dd");
            
            string strQuery = $@"
                                Select dt_op_report_id, 
                                       sys_net_node_id, 
                                       report_mem_addr, 
                                       report_mem_value / report_valid_cnt as report_mem_value, 
                                       report_mem_extra / report_valid_cnt as report_mem_extra, 
                                       report_valid_cnt, 
                                       report_timestamp
                                    from dt_op_report Where 
                                    dt_op_report_id in (
                                        Select max(dt_op_report_id) from dt_op_report
                                                                    where report_timestamp >= '{strDate}'
                                                                    and sys_net_node_id in (601, 602)
                                                                    group by sys_net_service_id, sys_net_region_id, sys_net_group_id, sys_net_node_id, report_mem_addr    
                                    ) 
                                    and report_timestamp >= '{strDate}'
                                    and sys_net_node_id in (601, 602)
                                    order by sys_net_node_id, report_mem_addr; 
                                ";
            
            IEnumerable<dynamic> dt_op_reports = m_externalDataManager.GetSelect().Select(strQuery, out strErrorMessage);

            Dictionary<string, dt_op_report> dtOpReports = dt_op_reports.ToDictionary(
                dor => $"{dor.sys_net_node_id}_{dor.report_mem_addr}",
                dor => new dt_op_report
                {
                    dt_op_report_id = dor.dt_op_report_id,
                    sys_net_node_id = dor.sys_net_node_id,
                    report_mem_addr = dor.report_mem_addr,
                    report_mem_extra = dor.report_mem_extra,
                    report_valid_cnt = dor.report_valid_cnt,
                    report_timestamp = dor.report_timestamp,
                    report_mem_value = dor.report_mem_extra != null && dor.report_mem_extra != 0 
                        ? GetWindDirection(dor.report_mem_value, dor.report_mem_extra)
                        : dor.report_mem_value
                });
            
            string strSdmsSensorETCSelect = 
                        $@"Select {ETC.Fields.ID.ToString()}
                            , {ETC.Fields.Name.ToString()}
                            , {ETC.Fields.PositionName.ToString()}
                            , {ETC.Fields.MaterialType.ToString()}
                            , {ETC.Fields.UniqueKey.ToString()}
                            , {ETC.Fields.ZoneID.ToString()}
                            , {ETC.Fields.Enabled.ToString()}
                        from {ETC.TableName}
                        ";
            
            IEnumerable<dynamic> sdmsSensorETCs = m_dataManager.GetSelect().Select(strSdmsSensorETCSelect, out strErrorMessage);
            
            foreach(var etc in sdmsSensorETCs)
            {
                ETC etcSensor = new ETC();
                
                etcSensor.ID = etc.ID;
                etcSensor.Name = etc.Name;
                etcSensor.PositionName = etc.PositionName;
                etcSensor.MaterialType = etc.MaterialType;
                etcSensor.UniqueKey = etc.UniqueKey;
                etcSensor.ZoneID = etc.ZoneID;
                etcSensor.Enabled = etc.Enabled;
                
                string strNodeID = etcSensor.UniqueKey.Split('_')[1];
                string strMemAddr = etcSensor.UniqueKey.Split('_')[2];

                if (dtOpReports.TryGetValue($@"{strNodeID}_{strMemAddr}", out dt_op_report dor))
                {
                    string strOriginTimeStamp = dor.report_timestamp.ToString("yyyy-MM-dd HH:mm:ss");
                    string strTimeStamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    string strInsert = $@"('{strOriginTimeStamp}', {etc.ID}, {dor.report_mem_value}, '{strTimeStamp}')";

                    arrInserts.Add(strInsert);
                }
            }
            
            if (arrInserts.Count > 0 && (DateTime.Now - m_dtLastWeatherSensorAccessTime).TotalMinutes >= 5)
            {
                // BusanWeatherSensorDataHistory Inserts (이력 데이터)
                string strInsertQuery = $@"Insert Into {WeatherDataHistory.TableName} 
                                        (
                                        {WeatherDataHistory.Fields.OriginTimeStamp.ToString()},
                                        {WeatherDataHistory.Fields.SensorID.ToString()},
                                        {WeatherDataHistory.Fields.Value.ToString()},
                                        {WeatherDataHistory.Fields.TimeStamp.ToString()}
                                        )
                                        Values {string.Join(",", arrInserts)}";

                if (!m_dataManager.GetCreate().Insert(strInsertQuery, out strErrorMessage))
                {
                    Logger.Instance.Write($@"[ERROR] BusanWeatherSensorDataHistory Insert 실패 : {strErrorMessage}");
                }
                else
                {
                    m_dtLastWeatherSensorAccessTime = DateTime.Now;
                }
            }
            
            return true;
        }

        private bool UpdateSensorData(Dictionary<int, bool> dicNodeUse, out string strErrorMessage)
        {
            DateTime dtNow = DateTime.Now;

            string strSdmsOptionQuery = $@"Select * from {SdmsOption.TableName}";
            IEnumerable<dynamic> sdmsOptionsResults = m_dataManager.GetSelect().Select(strSdmsOptionQuery, out strErrorMessage);

            List<SdmsOption> sdmsOptions = new List<SdmsOption>();
            
            foreach (var item in sdmsOptionsResults)
            {
                SdmsOption sdmsOption = new SdmsOption();
                sdmsOption.ID = item.ID;
                sdmsOption.PropertyName = item.PropertyName;
                sdmsOption.PropertyValue = item.PropertyValue;
                sdmsOption.Description = item.Description;
                
                sdmsOptions.Add(sdmsOption);
            }
            
            if (sdmsOptions == null || sdmsOptions.Count == 0)
            {
                strErrorMessage = "SdmsOption 테이블 조회 실패 : " + strErrorMessage;
                return false;
            }
            
            // 새벽 1시전에는 전날 데이터도 유효하게 취급한다
            if (dtNow.Hour == 0)
                dtNow = dtNow.AddDays(-1);

            string strDate = string.Format("{0}-{1:00}-{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);
            
            List<string> arrInserts = new List<string>();
            
            string strQuery = $@"
                                Select dt_op_report_id, 
                                       sys_net_node_id, 
                                       report_mem_addr, 
                                       report_mem_value / report_valid_cnt as report_mem_value, 
                                       report_mem_extra / report_valid_cnt as report_mem_extra, 
                                       report_valid_cnt, 
                                       report_timestamp
                                    from dt_op_report Where dt_op_report_id in (
                                        Select max(dt_op_report_id) from dt_op_report
                                                                    where report_timestamp >= '{strDate}'
                                                                    group by sys_net_service_id, sys_net_region_id, sys_net_group_id, sys_net_node_id, report_mem_addr    
                                    ) and report_timestamp >= '{strDate}'
                                    order by sys_net_node_id, report_mem_addr; 
                                ";
            
            IEnumerable<dynamic> dt_op_reports = m_externalDataManager.GetSelect().Select(strQuery, out strErrorMessage);

            Dictionary<string,dt_op_report> dtOpReports = new Dictionary<string, dt_op_report>();
            
            foreach (var dor in dt_op_reports)
            {
                dt_op_report dtOpReport = new dt_op_report();
                dtOpReport.dt_op_report_id = dor.dt_op_report_id;
                dtOpReport.sys_net_node_id = dor.sys_net_node_id;
                dtOpReport.report_mem_addr = dor.report_mem_addr;
                dtOpReport.report_mem_extra = dor.report_mem_extra;
                dtOpReport.report_valid_cnt = dor.report_valid_cnt;
                dtOpReport.report_timestamp = dor.report_timestamp;
                dtOpReport.report_mem_value = dor.report_mem_value;
                
                if (dtOpReport.report_mem_extra != null && dtOpReport.report_mem_extra != 0)
                {
                    dtOpReport.report_mem_value = GetWindDirection(dor.report_mem_value, dor.report_mem_extra);
                }
                else
                {
                    dtOpReport.report_mem_value = dor.report_mem_value;
                }

                string strKey = $"{dtOpReport.sys_net_node_id}_{dtOpReport.report_mem_addr}";
                dtOpReports.Add(strKey, dtOpReport);
            }

            strQuery = string.Empty;

            // Mssql SdmsSensorETC의 Unique키와 대조하여 업데이트
            strQuery = $@"
                        Select {ETC.Fields.ID.ToString()}
                            , {ETC.Fields.Name.ToString()}
                            , {ETC.Fields.PositionName.ToString()}
                            , {ETC.Fields.MaterialType.ToString()}
                            , {ETC.Fields.UniqueKey.ToString()}
                            , {ETC.Fields.ZoneID.ToString()}
                            , {ETC.Fields.Enabled.ToString()}
                        from {ETC.TableName}
                        ";
            
            IEnumerable<dynamic> sdmsSensorETCs = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);

            foreach (var sse in sdmsSensorETCs)
            {
                ETC etc = new ETC();
                
                etc.ID = sse.ID;
                etc.Name = sse.Name;
                etc.PositionName = sse.PositionName;
                etc.MaterialType = sse.MaterialType;
                etc.UniqueKey = sse.UniqueKey;
                etc.ZoneID = sse.ZoneID;
                etc.Enabled = sse.Enabled;
                
                string strNodeID = etc.UniqueKey.Split('_')[1];
                string strMemAddr = etc.UniqueKey.Split('_')[2];
                
                string sensorType = etc.UniqueKey.Split('_')[0];

                if (dtOpReports.TryGetValue($@"{strNodeID}_{strMemAddr}", out dt_op_report dor))
                {
                    string strOriginTimeStamp = dor.report_timestamp.ToString("yyyy-MM-dd HH:mm:ss");
                    string strTimeStamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    string strInsert = $@"('{strOriginTimeStamp}', {etc.ID}, {dor.report_mem_value}, '{strTimeStamp}')";
                    
                    Logger.Instance.Write($@"[INFO] SensorData Update : {etc.UniqueKey} / Value : {dor.report_mem_value}");
                    
                    if (etc.UniqueKey.Split('_')[0] != "Electricity")
                    {
                        // 전류센서는 History X
                        arrInserts.Add(strInsert);
                    }
                    
                    bool isNullable;
                    
                    string strUpdateQuery = $"Update {ETC.TableName} Set {ETC.Fields.CurrentData.ToString()} = '{dor.report_mem_value}' Where ID = {etc.ID}";

                    if (!m_dataManager.GetUpdate().Update(strUpdateQuery, out strErrorMessage))
                    {
                        strErrorMessage = $@"Update SdmsSensorETC(ID : {etc.ID}) 실패 : " + strErrorMessage;
                        continue;
                    }

                    int AlarmLevel = GetAlarmLevel(dor.report_mem_value, dor.report_mem_addr);
                    
                    if (!m_dicSensorTags.TryGetValue(etc.ID, out SensorTag sensorTag))
                        {
                            Logger.Instance.Write("[ERROR] ETC.ID에 해당하는 SensorTag 정보가 없습니다.");
                            continue;
                        }
                    
                    // 온도 , 습도는 알람 X
                    if (dor.report_mem_addr == SensorManager.m_nTemp || dor.report_mem_addr == SensorManager.m_nHumi)
                        continue;
                        
                    // 알람 없을경우 새로 생성
                    if (!AlarmManager.Instance.DicCurrentAlarm.TryGetValue(sensorTag.SensorZoneID, out AlarmInfo alarmInfo))
                    {
                        if (AlarmLevel > 3)
                        {
                            if (DicSdmsOptions[("UseReceive" + sensorType)]) // 알람 매우나쁨만 발생
                            {
                                if (!SendAlarm(sensorTag, AlarmLevel, true, out strErrorMessage))
                                {
                                    Logger.Instance.Write(
                                        $@"[ERROR] SendAlarm (발송) 실패 SensorZoneID = {sensorTag.SensorZoneID} : " +
                                        strErrorMessage);
                                }
                            }
                        }
                    }
                    // 해당 센서존에 알람이 있을경우
                    else
                    {
                        if (AlarmLevel < 4)
                        {
                            if (DicSdmsOptions["UseReceive" + sensorType])
                            {
                                if (alarmInfo.AlarmDepth != AlarmLevel)
                                {
                                    if (!SendAlarm(sensorTag, AlarmLevel, false, out strErrorMessage))
                                    {
                                        Logger.Instance.Write($@"[ERROR] SendAlarm (해제) 실패 SensorZoneID = {sensorTag.SensorZoneID} : " + strErrorMessage);
                                    }
                                }                                                         
                            }
                        }
                    }
                }
                else
                {
                    // etc 센서와 매칭되는 report 데이터 없음
                    if (etc.UniqueKey.Contains("KWeather"))
                    {
                        continue;
                    }
                    //Logger.Instance.Write($@"[ERROR] etc 센서와 매칭되는 report 데이터 없음 : {etc.ID} , UniqueKey: {etc.UniqueKey}");
                }
            }

            if (IsTimeOnFiveMinutes()) // 5분단위로 Row데이터 이력저장
            {

                if (!DeleteSensorDataHistory(out strErrorMessage))
                {
                    Logger.Instance.Write("[ERROR] BusanSensorDataHistory 삭제 실패");
                }
                
                if (arrInserts.Count > 0 && (DateTime.Now - m_dtLastWeatherSensorAccessTime).TotalMinutes >= 5)
                {
                    // BusanSensorDataHistory Inserts (이력 데이터)
                    string strInsertQuery = $@"Insert Into {DataHistory.TableName} 
                                        (
                                        {DataHistory.Fields.OriginTimeStamp.ToString()},
                                        {DataHistory.Fields.SensorID.ToString()},
                                        {DataHistory.Fields.Value.ToString()},
                                        {DataHistory.Fields.TimeStamp.ToString()}
                                        )
                                        Values {string.Join(",", arrInserts)}";

                    if (!m_dataManager.GetCreate().Insert(strInsertQuery, out strErrorMessage))
                    {
                        Logger.Instance.Write($@"[ERROR] BusanSensorDataHistory Insert 실패 : {strErrorMessage}");
                    }
                    else
                    {
                        m_dtLastSensorAccessTime = DateTime.Now;
                    }
                }
            }
            
            return true;
        }

        public bool DeleteSensorDataHistory(out string strErrorMessage)
        {
            // 1달전 데이터 삭제
            DateTime dtNow = DateTime.Now;
            dtNow = dtNow.AddMonths(-1);
            string strDate = string.Format("{0}-{1:00}-{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);

            string strConditions = $@"{DataHistory.Fields.TimeStamp.ToString()} < '{strDate}'";
            
            if (!m_dataManager.GetDelete().Delete<DataHistory>(strConditions, out strErrorMessage))
            {
                Logger.Instance.Write("[ERROR] SensorDataHistory 삭제 실패 : " + strErrorMessage);
                return false;
            }
            
            return true;
        }

        public bool UpdateKWeatherData(out string strErrorMessage)
        {
            strErrorMessage = "";

            DicKWeatherDate?.Clear();
            Dictionary<string, double> dicKWeatherData = new Dictionary<string, double>();
            DicKWeatherDate = new Dictionary<string, string>();

            string url = "https://gateway.kweather.co.kr:8443/iot/groups/last?station_type=ALL&id_type=GROUP&id=busantp@btp.or.kr&api_key=kweather-test";

            try
            {
                HttpResponseMessage response = client.GetAsync(url).Result;
                if (response.IsSuccessStatusCode)
                {
                    string strJson = response.Content.ReadAsStringAsync().Result;
                    dynamic json = JsonConvert.DeserializeObject(strJson);

                    if (json == null)
                    {
                        strErrorMessage = "json 데이터가 null입니다.";
                        Logger.Instance.Write(strErrorMessage);
                        return false;
                    }

                    JArray jArray = json["result"]["oaq_list"] as JArray;
                    if (jArray == null)
                        return false;

                    List<KWeather.SensorData> datalist = jArray.ToObject<List<KWeather.SensorData>>();

                    foreach (var data in datalist)
                    {
                        string strUniqueKey = data.serial_no;
                        DicKWeatherDate[strUniqueKey] = data.date;

                        foreach (var property in data.GetType().GetProperties())
                        {
                            string propertyName = property.Name;
                            string uniqueKey = $"{strUniqueKey}_{propertyName}";
                            object value = property.GetValue(data);

                            if (value is double || value is int)
                            {
                                double doubleValue = Convert.ToDouble(value);
                                if (doubleValue != -1)
                                {
                                    dicKWeatherData[uniqueKey] = doubleValue;
                                }
                            }
                        }
                    }
                }
                else
                {
                    strErrorMessage = "KWeather API 호출 실패";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                Logger.Instance.Write("Kweather HttpRequest fail : " + strErrorMessage);
                return false;
            }

            if (!ProcessingKWeather(dicKWeatherData))
            {
                Logger.Instance.Write("[ERROR] KWeather 알람처리 실패");
                return false;
            }

            return true;
        }

        bool IsTimeOnFiveMinutes()
        {
            DateTime dtNow = DateTime.Now;
            return dtNow.Minute % 5 == 0;
        }
 
        public bool ProcessingKWeather(Dictionary<string, double> dicData)
        {
            string strSelect = $@"Select * from {ETC.TableName} Where {ETC.Fields.UniqueKey.ToString()} Like '%OC3KL%'";
            
            IEnumerable<dynamic> etcs = m_dataManager.GetSelect().Select(strSelect, out string strErrorMessage);

            if (etcs == null)
            {
                Logger.Instance.Write("[ERROR] ETC 테이블 조회 실패 : " + strErrorMessage);
            }
            
            List<string> arrInserts = new List<string>();
            
            foreach (var etc in etcs)
            {
                ETC t = new ETC();
                t.ID = etc.ID;
                t.Name = etc.Name;
                t.PositionName = etc.PositionName;
                t.MaterialType = etc.MaterialType;
                t.UniqueKey = etc.UniqueKey;
                t.ZoneID = etc.ZoneID;
                t.Enabled = etc.Enabled;

                double value;
                
                string[] strSplit = t.UniqueKey.Split('_');
                string strSensorUniqueKey = strSplit[1] + "_" + strSplit[2];
                
                if (dicData.TryGetValue(strSensorUniqueKey, out value))
                {
                    t.CurrentData = value.ToString("F4"); // 소수점 넷째자리까지 표현
                    string strUpdate = $@"Update {ETC.TableName} Set {ETC.Fields.CurrentData.ToString()} = '{t.CurrentData}' Where ID = {t.ID}";

                    if (!m_dataManager.GetUpdate().Update(strUpdate, out strErrorMessage))
                    {
                        Logger.Instance.Write("[ERROR] ETC CurrentData 업데이트 실패 ID : " + t.ID + " /" + strErrorMessage);
                    }
                    
                    Logger.Instance.Write($"[INFO] KWeather Data Update : {t.UniqueKey} / Value : {t.CurrentData}");

                    string strOriginTimeStamp = DicKWeatherDate[strSplit[1]];
                    DateTime dtOrigin = DateTime.ParseExact(strOriginTimeStamp, "yyyyMMddHHmm", null);
                    strOriginTimeStamp = dtOrigin.ToString("yyyy-MM-dd HH:mm:ss");
                    
                    string strTimeStamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    string strInsert = $@"('{strOriginTimeStamp}', {t.ID}, {value}, '{strTimeStamp}')" ?? "";
                    arrInserts.Add(strInsert);
                    
                    Material material = null;

                    foreach (var item in m_dicMaterials)
                    {
                        Material m = item.Value;

                        if (m.MaterialID == t.MaterialType)
                        {
                            material = m;
                            break;
                        }
                    }

                    if (material == null)
                    {
                        Logger.Instance.Write($@"[ERROR] MaterialType에 해당하는 Material이 없습니다. MaterialType : {t.MaterialType} / UniqueKey : {t.UniqueKey}");
                        continue;
                    }
                    
                    if (material.MaterialID == nTemp || material.MaterialID == nHumi) // 온습도는 알람 X
                        continue;

                    int nAlarmLevel = GetAlarmLevel(value, material.UniqueID);
                    
                    if (m_dicSensorTags.TryGetValue(t.ID, out SensorTag sensorTag))
                    {
                        if (!AlarmManager.Instance.DicCurrentAlarm.TryGetValue(sensorTag.SensorZoneID, out AlarmInfo alarmInfo))
                        {
                            if (nAlarmLevel > 3 && DicSdmsOptions["UseReceiveKWeather"])
                            {
                                if (!SendAlarm(sensorTag, nAlarmLevel, true, out strErrorMessage))
                                {
                                    Logger.Instance.Write(
                                        $@"[ERROR] SendAlarm (발송) 실패 SensorZoneID = {sensorTag.SensorZoneID} : " +
                                        strErrorMessage);
                                }
                            }
                        }
                        // 해당 센서존에 알람이 있을경우
                        else
                        {
                            if (nAlarmLevel < 4)
                            {
                                if (alarmInfo.AlarmDepth != nAlarmLevel && DicSdmsOptions["UseReceiveKWeather"])
                                {
                                    // 4 이하로 떨어지면 알람 자동해제
                                    if (!SendAlarm(sensorTag, nAlarmLevel, false, out strErrorMessage))
                                    {
                                        Logger.Instance.Write(
                                            $@"[ERROR] SendAlarm (해제) 실패 SensorZoneID = {sensorTag.SensorZoneID} : " +
                                            strErrorMessage);
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        Logger.Instance.Write("[ERROR] SensorTag 정보가 없습니다.");
                        Logger.Instance.Write("Material UniqueID : " + material.UniqueID);
                    }
                    
                }
            }

            if (IsTimeOnFiveMinutes() && (DateTime.Now - m_dtLastWeatherSensorAccessTime).TotalMinutes >= 5)
            {
                // BusanSensorDataHistory Inserts (이력 데이터)
                string inserts = "";
                inserts = string.Join(",", arrInserts);
            
                string strInsertQuery = $@"Insert Into {DataHistory.TableName} 
                                        (
                                        {DataHistory.Fields.OriginTimeStamp.ToString()},
                                        {DataHistory.Fields.SensorID.ToString()},
                                        {DataHistory.Fields.Value.ToString()},
                                        {DataHistory.Fields.TimeStamp.ToString()}
                                        )
                                        Values {inserts}";

                if (!m_dataManager.GetCreate().Insert(strInsertQuery, out strErrorMessage))
                {
                    Logger.Instance.Write("[ERROR] KWeather DataHistory Insert 실패 : " + strErrorMessage);
                }
            }
            
            return true;
        }

        public bool SendAlarm(SensorTag sensorTag, int nAlarmLevel, bool bIsAlarm, out string strErrorMessage)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(sensorTag.SensorType);
            arrDatas.Add(sensorTag.TagID);
            arrDatas.Add(sensorTag.SensorZoneID);
            arrDatas.Add(bIsAlarm);
            if (nAlarmLevel != null && nAlarmLevel > 0 && nAlarmLevel is int)
                arrDatas.Add(nAlarmLevel);
            
            return m_alarmManager.SendAlarm(m_sopQueryManager, arrDatas, out strErrorMessage);
        }
        
        public int GetAlarmLevel(double value, int addr)
        {
            int AlarmLevel = 1;
            
            Material material = m_dicMaterials[addr];

            if (material == null)
            {
                return AlarmLevel;
            }
            
            if ((material.Min1 == null && material.Max1 == null && material.Min2 == null && material.Max2 == null && material.Info == null) ||
                material.Direction == null)
            {
                return AlarmLevel;
            }
            
            int direction = material.Direction;

            double?[] thresholds = direction == 1 ? 
                new double?[] { material.Max1, material.Min2, material.Max2 } : 
                new double?[] { material.Min2, material.Max1, material.Min1 };
            
            Func<double, double?, bool> compare = direction == 1 ? 
                new Func<double, double?, bool>((v, t) => v >= t) : 
                new Func<double, double?, bool>((v, t) => v < t);

            if (direction == 1) // 정방향
            {
                foreach (var threshold in thresholds)
                {
                    if (threshold.HasValue && compare(value, threshold.Value))
                    {
                        AlarmLevel++;
                    }
                }
            }
            else if (direction == 2) // 역방향
            {
                if (value < material.Min2)
                {
                    AlarmLevel = 4;
                }
            } else if (direction == 3) // 임계치 범위형 JSON DATA 사용
            {
                string json = material.Info;
                Dictionary<string, string> data = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);

                string[] array = data.Values.ToArray();

                foreach (var item in array)
                {
                    string[] t = item.Split(",");
                    int low = int.Parse(t[0]);
                    int high = int.Parse(t[1]);

                    if (value < low || value > high)
                    {
                        AlarmLevel++;
                    }
                    else
                        break;

                }
            }
            
            return AlarmLevel;
        }
        
        public double GetWindDirection(double value, double extra)
        {
            double radian = System.Math.Atan2(value , extra);
            double degree = radian * 180 / System.Math.PI;
            double angle = GetDirectionFromDegree(degree);
            
            return angle;
        }

        public static double GetDirectionFromDegree(double angle)
        {
            double result;
            if ((angle > 0) && (angle <= 90))
            {
                result = 90 - angle;
            }
            else if ((angle > 90) && (angle <= 180))
            {
                result = 450 - angle;
            }
            else if (angle < 0)
            {
                result = 90 - angle;
            }
            else
            {
                result = 90;
            }

            return result;
        }
        
    }
}