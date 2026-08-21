using System;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Mes.Product;
using Nipa.Model.Mes.Quality;
using Nipa.Model.Mes.Equipment;
using System.Collections.Generic;
using Nipa.Model.Sdms.Sensor;
using System.Collections;
using dnsCommunicateSopServer;

namespace IntegrationServer.Servers.MES.Hansol
{
    using Datas;
    using ViewModels.MES.Hansol;
    using ViewModels.MES.Hansol.Oracle;
    using static AgentFactory.BLL.ServerType;

    public class HansolManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private bool m_runThread = false;
        private int m_nSiteID = -1;

        private IDataManager m_mesDataManager1 = null;
        private IDataManager m_mesDataManager2 = null;
        private IDataManager m_dataManager = null;

        // Key : 설비번호
        private Dictionary<int, SensorZoneTagMaterial> m_dicEquipmentSensorZones = new Dictionary<int, SensorZoneTagMaterial>();

        private SopQueryManager m_sopQueryManager = null;

        // 호기별 가동여부
        private Dictionary<int, bool> m_dicEquipmentStatus = new Dictionary<int, bool>();
        // 호기별 알람여부
        private Dictionary<int, bool> m_dicEquipmentAlarmStatus = new Dictionary<int, bool>();

        public Logger Logger { get; set; }

        public int ServerSeqNo
        {
            get
            {
                return m_nServerSeqNo;
            }
        }

        public ServerTypes ServerType
        {
            get
            {
                return ServerTypes.MES_Hansol;
            }
        }

        public bool IsConnected
        {
            get
            {
                return m_runThread;
            }
        }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public HansolManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strDBHost, string strDbId, string strDbPw, string strSid, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;
            m_strServerAlias = strServerAlias;

            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_dataManager = (DataManager)dataManager.Clone();
            SetMesDataManager(strDBHost, strDbId, strDbPw, strSid);

            ReadEquipmentSensorZone();
        }

        private void SetMesDataManager(string strDBHost, string strDbId, string strDbPw, string strSid)
        {
            string strDbHost1 = "", strDbHost2 = "";
            string strDbId1 = "", strDbId2 = "";
            string strDbPw1 = "", strDbPw2 = "";
            string strSid1 = "", strSid2 = "";

            if (SetData(strDBHost, ref strDbHost1, ref strDbHost2) &&
                SetData(strDbId, ref strDbId1, ref strDbId2) &&
                SetData(strDbPw, ref strDbPw1, ref strDbPw2) &&
                SetData(strSid, ref strSid1, ref strSid2))
            {
                m_mesDataManager1 = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.oracle, strDbHost1, strSid1, strDbId1, strDbPw1);
                m_mesDataManager2 = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.oracle, strDbHost2, strSid2, strDbId2, strDbPw2);
            }
        }

        private bool SetData(string strValue, ref string strTarget1, ref string strTarget2)
        {
            int index = strValue.IndexOf('_');

            if (index > 0)
            {
                strTarget1 = strValue.Substring(0, index).Trim();
                strTarget2 = strValue.Substring(index + 1).Trim();
                return true;
            }

            return false;
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void MonitoringThread()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            while (m_runThread)
            {
                try
                {
                    Run run = null;
                    List<Performance> performances = null;
                    List<NG> ngs = null;
                    List<NGCategory> ngCategories = null;
                    List<Nipa.Model.Mes.Buy.Dashboard> buyDashboards = null;
                    List<Nipa.Model.Mes.Sell.Dashboard> sellDashboards = null;
                    List<Equipment> equipments = null;
                    List<Nipa.Model.Mes.Equipment.Data> equipmentDatas = null;
                    string strErrorMessage;

                    List<AlarmData> alarmDatas = Read(m_nSiteID, ref run, ref performances, ref ngs, ref ngCategories, ref buyDashboards, ref sellDashboards, ref equipments, ref equipmentDatas, out strErrorMessage);

                    if (alarmDatas != null)
                    {
                        if (UpdateData(run, performances, ngs, ngCategories, buyDashboards, sellDashboards, equipments, equipmentDatas, out strErrorMessage) == false)
                        {
                            WriteLog(strErrorMessage, LogTypes.Error);
                        }

                        SendAlarmMessage(alarmDatas);
                    }
                    else
                    {
                        WriteLog(strErrorMessage, LogTypes.Error);
                    }

                    for (int i=0;i<1;i++)
                    {
                        if (m_runThread == false)
                            break;

                        System.Threading.Thread.Sleep(1000);
                    }
                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);
                }
            }
        }

        private void SendAlarmMessage(List<AlarmData> alarmDatas)
        {
            foreach (AlarmData alarmData in alarmDatas)
            {
                if (alarmData.EquipmentData != null && alarmData.EquipmentData.OK)
                {
                    if (alarmData.SensorZoneTag != null && alarmData.SensorZoneTag.SensorZone != null && alarmData.SensorZoneTag.TagInfo != null)
                    {
                        if (IsValidAlarm(alarmData) == false)
                            continue;

                        ArrayList arrDatas = new ArrayList();

                        arrDatas.Add(alarmData.SensorZoneTag.SensorZone.SensorType);
                        arrDatas.Add(alarmData.SensorZoneTag.TagInfo.ID);
                        arrDatas.Add(alarmData.SensorZoneTag.SensorZone.ID);
                        arrDatas.Add(alarmData.IsAlarm);

                        int? prevSensorZoneHistoryID = GetLastSensorZoneHistoryID(alarmData);
                        m_sopQueryManager.SendAlarmQuery(arrDatas, "POST");

                        if (prevSensorZoneHistoryID != null)
                        {
                            // SensorZoneHistory가 생성될때까지 최대 3초까지 기다린다.
                            for (int i = 0; i < 3; i++)
                            {
                                int? currentSensorZoneHistoryID = GetLastSensorZoneHistoryID(alarmData);

                                if (currentSensorZoneHistoryID != null && currentSensorZoneHistoryID > prevSensorZoneHistoryID)
                                {
                                    System.Diagnostics.Trace.WriteLine("New Alarm : " + currentSensorZoneHistoryID);
                                    // 새로운 알람이 발생했으면 DB에 알람 부가정보를 입력한다.
                                    AddSensorZoneHistoryData((int)currentSensorZoneHistoryID, alarmData.EquipmentData, alarmData.AlarmType, alarmData.ImagePath);
                                    break;
                                }

                                Thread.Sleep(1000);
                            }
                        }
                    }
                }
            }
        }

        // DB에 이미 기록된 알람인지 검사한다.
        private bool IsValidAlarm(AlarmData alarmData)
        {
            if (alarmData.IsAlarm)
            {
                string strSQL = string.Format("Select {0} time from {1} where {2} in (Select max({2}) from {1} where {3} = 'EqID' and {0} = '{4}') and {3} = 'TimeStamp'",
                    Nipa.Model.Sdms.History.SensorZoneData.Fields.PropertyValue,
                    Nipa.Model.Sdms.History.SensorZoneData.TableName,
                    Nipa.Model.Sdms.History.SensorZoneData.Fields.SensorZoneHistoryID,
                    Nipa.Model.Sdms.History.SensorZoneData.Fields.PropertyName,
                    alarmData.EquipmentData.EqID);

                string strErrorMessage;
                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

                if (results == null)
                {
                    System.Diagnostics.Trace.WriteLine("Check ValidAlarm Fail : " + strErrorMessage);
                    return false;
                }

                foreach (var result in results)
                {
                    if (result.Time == DateTimeString(alarmData.EquipmentData.TimeStamp))
                    {
                        // 이미 처리된 알람이다.
                        return false;
                    }
                }
            }

            return true;
        }

        private bool AddSensorZoneHistoryData(int nSensorZoneHistoryID, Data equipmentData, string strAlarmType, string strImagePath)
        {
            List<Nipa.Model.Sdms.History.SensorZoneData> sensorZoneHistoryDatas = new List<Nipa.Model.Sdms.History.SensorZoneData>();

            // 샷 기록시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "ShotTime", DateTimeString(equipmentData.ShotTime)));
            // 샷 카운트
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "ShotCount", equipmentData.ShotCount.ToString()));
            // 전체공정시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "ProcessTime", GetDoubleString(equipmentData.ProcessTime)));
            // 쿠션위치
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "CushionPos", GetDoubleString(equipmentData.CushionPos)));
            // 최대압력
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "MaxPressure", GetDoubleString(equipmentData.MaxPressure)));
            // 절환위치
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "TransferPos", GetDoubleString(equipmentData.TransferPos)));
            // 절환압력
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "TransferPressure", GetDoubleString(equipmentData.TransferPressure)));
            // 사출시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "InjectTime", GetDoubleString(equipmentData.InjectTime)));
            // 보압시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "HoldingPressure", GetDoubleString(equipmentData.HoldingPressure)));
            // 계량시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "MeasureTime", GetDoubleString(equipmentData.MeasureTime)));
            // 계량시작위치
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "MeasureStartPos", GetDoubleString(equipmentData.MeasureStartPos)));
            // 계량완료위치
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "MeasureEndPos", GetDoubleString(equipmentData.MeasureEndPos)));
            // 냉각시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "IcingTime", GetDoubleString(equipmentData.IcingTime)));
            // 형개시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "MoldOpenTime", GetDoubleString(equipmentData.MoldOpenTime)));
            // 형폐시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "MoldCloseTime", GetDoubleString(equipmentData.MoldCloseTime)));
            // 압출전진시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "FowardTime", GetDoubleString(equipmentData.FowardTime)));
            // 압출후진시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "BackwardTime", GetDoubleString(equipmentData.BackwardTime)));
            // 알람타입
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "AlarmType", strAlarmType));
            // 알람발생시간
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "TimeStamp", DateTimeString(equipmentData.TimeStamp)));
            // 설비번호
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "EqID", equipmentData.EqID.ToString()));
            sensorZoneHistoryDatas.Add(MakeSensorZoneHistoryData(nSensorZoneHistoryID, "ImagePath", strImagePath));

            System.Diagnostics.Trace.WriteLine("MakeSensorZoneHistoryDatas : " + sensorZoneHistoryDatas.Count);
            string strErrorMessage;
            
            if (m_dataManager.GetCreate().Insert<Nipa.Model.Sdms.History.SensorZoneData>(sensorZoneHistoryDatas, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("SensorZoneHistoryData Insert Fail : " + strErrorMessage);
                return false;
            }
            else
            {
                System.Diagnostics.Trace.WriteLine("MakeSensorZoneHistoryDatas Success");
            }

            return true;
        }

        private string GetDoubleString(double data)
        {
            string strData = string.Format("{0:F1}", data);

            if (strData.EndsWith("0"))
                strData = strData.Substring(0, strData.Length - 2);

            return strData;
        }

        private string DateTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private Nipa.Model.Sdms.History.SensorZoneData MakeSensorZoneHistoryData(int nSensorZoneHistoryID, string strPropertyName, string strPropertyValue)
        {
            Nipa.Model.Sdms.History.SensorZoneData sensorZoneHistoryData = new Nipa.Model.Sdms.History.SensorZoneData();

            sensorZoneHistoryData.SensorZoneHistoryID = nSensorZoneHistoryID;
            sensorZoneHistoryData.PropertyName = strPropertyName;
            sensorZoneHistoryData.PropertyValue = strPropertyValue;

            return sensorZoneHistoryData;
        }

        private int? GetLastSensorZoneHistoryID(AlarmData alarmData)
        {
            if (alarmData.IsAlarm)
            {
                string strSQL = string.Format("Select max({0}) id from {1} where {2} = {3}",
                    Nipa.Model.Sdms.History.SensorZone.Fields.ID,
                    Nipa.Model.Sdms.History.SensorZone.TableName,
                    Nipa.Model.Sdms.History.SensorZone.Fields.SensorZoneID,
                    alarmData.SensorZoneTag.SensorZone.ID);

                string strErrorMessage;
                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

                if (results == null)
                {
                    System.Diagnostics.Trace.WriteLine("Read max SensorZoneHistoryID fail : " + strErrorMessage);
                    return null;
                }
                else
                {
                    foreach (var result in results)
                    {
                        if (result.id != null)
                            return (int)result.id;
                    }
                }
            }

            return null;
        }

        private bool UpdateData(Run run, List<Performance> performances, List<NG> ngs, List<NGCategory> ngCategories, List<Nipa.Model.Mes.Buy.Dashboard> buyDashboards, List<Nipa.Model.Mes.Sell.Dashboard> sellDashboards, List<Equipment> equipments, List<Nipa.Model.Mes.Equipment.Data> equipmentDatas, out string strErrorMessage)
        {
            strErrorMessage = null;
            
            if (UpdateRun(run, ref strErrorMessage) == false)
                return false;

            if (UpdatePerformance(performances, ref strErrorMessage) == false)
                return false;

            if (UpdateNG(ngs, ref strErrorMessage) == false)
                return false;

            if (UpdateNGCategory(ngCategories, ref strErrorMessage) == false)
                return false;

            if (UpdateBuyDashboard(buyDashboards, ref strErrorMessage) == false)
                return false;

            if (UpdateSellDashboard(sellDashboards, ref strErrorMessage) == false)
                return false;

            if (UpdateEquipment(equipments, ref strErrorMessage) == false)
                return false;

            if (UpdateEquipmentData(equipmentDatas, ref strErrorMessage) == false)
                return false;

            return true;
        }

        private bool UpdateEquipmentData(List<Nipa.Model.Mes.Equipment.Data> equipmentDatas, ref string strErrorMessage)
        {
            Dictionary<Nipa.Model.Mes.Equipment.Data.Fields, object> dicSets = new Dictionary<Nipa.Model.Mes.Equipment.Data.Fields, object>();

            foreach (var equipmentData in equipmentDatas)
            {
                if (m_dataManager.GetUpdate().Update<Nipa.Model.Mes.Equipment.Data>(equipmentData, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateEquipment(List<Equipment> equipments, ref string strErrorMessage)
        {
            Dictionary<Equipment.Fields, object> dicSets = new Dictionary<Equipment.Fields, object>();

            foreach (var equipment in equipments)
            {
                string strCondition = string.Format("{0} = {1}", Equipment.Fields.ID, equipment.ID);
                dicSets[Equipment.Fields.Usable] = equipment.Usable;

                if (m_dataManager.GetUpdate().Update<Equipment, Equipment.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateSellDashboard(List<Nipa.Model.Mes.Sell.Dashboard> sellDashboards, ref string strErrorMessage)
        {
            string strCustomers = "";
            int siteID = -1;

            foreach (var dashboard in sellDashboards)
            {
                if (strCustomers.Length == 0)
                    strCustomers = "'" + dashboard.Customer + "'";
                else
                    strCustomers += ", '" + dashboard.Customer + "'";

                siteID = dashboard.SiteID;
            }

            if (strCustomers.Length > 0)
            {
                string strCondition = string.Format("{0} = {1} and {2} not in ({3})", Nipa.Model.Mes.Sell.Dashboard.Fields.SiteID, siteID, Nipa.Model.Mes.Sell.Dashboard.Fields.Customer, strCustomers);

                if (m_dataManager.GetDelete().Delete<Nipa.Model.Mes.Sell.Dashboard>(strCondition, out strErrorMessage) == false)
                    return false;
            }
            else
                return true;

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", Nipa.Model.Mes.Sell.Dashboard.Fields.SiteID, siteID, Nipa.Model.Mes.Sell.Dashboard.Fields.Customer, strCustomers);
            IEnumerable<Nipa.Model.Mes.Sell.Dashboard> dashboards = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Sell.Dashboard>(strConditions, out strErrorMessage);

            if (dashboards == null)
                return false;

            Dictionary<string, Nipa.Model.Mes.Sell.Dashboard> dicCustomerDatas = new Dictionary<string, Nipa.Model.Mes.Sell.Dashboard>();

            foreach (Nipa.Model.Mes.Sell.Dashboard dashboard in dashboards)
            {
                dicCustomerDatas[dashboard.Customer] = dashboard;
            }

            foreach (var dashboard in sellDashboards)
            {
                Nipa.Model.Mes.Sell.Dashboard _dashboard;

                if (dicCustomerDatas.TryGetValue(dashboard.Customer, out _dashboard) == false)
                {
                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return false;

                    if (m_dataManager.GetCreate().Insert<Nipa.Model.Mes.Sell.Dashboard>(dashboard, out strErrorMessage) == false)
                        return false;
                }
                else
                {
                    dashboard.ID = _dashboard.ID;

                    if (m_dataManager.GetUpdate().Update<Nipa.Model.Mes.Sell.Dashboard>(dashboard, null, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool UpdateBuyDashboard(List<Nipa.Model.Mes.Buy.Dashboard> buyDashboards, ref string strErrorMessage)
        {
            string strCustomers = "";
            int siteID = -1;

            foreach (var dashboard in buyDashboards)
            {
                if (strCustomers.Length == 0)
                    strCustomers = "'" + dashboard.Customer + "'";
                else
                    strCustomers += ", '" + dashboard.Customer + "'";

                siteID = dashboard.SiteID;
            }

            if (strCustomers.Length > 0)
            {
                string strCondition = string.Format("{0} = {1} and {2} not in ({3})", Nipa.Model.Mes.Buy.Dashboard.Fields.SiteID, siteID, Nipa.Model.Mes.Buy.Dashboard.Fields.Customer, strCustomers);

                if (m_dataManager.GetDelete().Delete<Nipa.Model.Mes.Buy.Dashboard>(strCondition, out strErrorMessage) == false)
                    return false;
            }
            else
                return true;

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", Nipa.Model.Mes.Buy.Dashboard.Fields.SiteID, siteID, Nipa.Model.Mes.Buy.Dashboard.Fields.Customer, strCustomers);
            IEnumerable<Nipa.Model.Mes.Buy.Dashboard> dashboards = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Buy.Dashboard>(strConditions, out strErrorMessage);

            if (dashboards == null)
                return false;

            Dictionary<string, Nipa.Model.Mes.Buy.Dashboard> dicCustomerDatas = new Dictionary<string, Nipa.Model.Mes.Buy.Dashboard>();

            foreach (Nipa.Model.Mes.Buy.Dashboard dashboard in dashboards)
            {
                dicCustomerDatas[dashboard.Customer] = dashboard;
            }

            foreach (var dashboard in buyDashboards)
            {
                Nipa.Model.Mes.Buy.Dashboard _dashboard;

                if (dicCustomerDatas.TryGetValue(dashboard.Customer, out _dashboard) == false)
                {
                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return false;

                    if (m_dataManager.GetCreate().Insert<Nipa.Model.Mes.Buy.Dashboard>(dashboard, out strErrorMessage) == false)
                        return false;
                }
                else
                {
                    dashboard.ID = _dashboard.ID;

                    if (m_dataManager.GetUpdate().Update<Nipa.Model.Mes.Buy.Dashboard>(dashboard, null, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool UpdateNGCategory(List<NGCategory> ngCategories, ref string strErrorMessage)
        {
            string strDetails = "";
            int siteID = -1;

            foreach (var category in ngCategories)
            {
                if (strDetails.Length == 0)
                    strDetails = "'" + category.DetailNG + "'";
                else
                    strDetails += ", '" + category.DetailNG + "'";

                siteID = category.SiteID;
            }

            if (strDetails.Length > 0)
            {
                string strCondition = string.Format("{0} = {1} and {2} not in ({3})", NGCategory.Fields.SiteID, siteID, NGCategory.Fields.DetailNG, strDetails);

                if (m_dataManager.GetDelete().Delete<NGCategory>(strCondition, out strErrorMessage) == false)
                    return false;
            }
            else
                return true;

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", NGCategory.Fields.SiteID, siteID, NGCategory.Fields.DetailNG, strDetails);
            IEnumerable<NGCategory> categories = m_dataManager.GetSelect().Select<NGCategory>(strConditions, out strErrorMessage);

            if (categories == null)
                return false;

            Dictionary<string, NGCategory> dicDetailDatas = new Dictionary<string, NGCategory>();

            foreach (NGCategory category in categories)
            {
                dicDetailDatas[category.DetailNG] = category;
            }

            foreach (var category in ngCategories)
            {
                NGCategory _category;

                if (dicDetailDatas.TryGetValue(category.DetailNG, out _category) == false)
                {
                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return false;

                    if (m_dataManager.GetCreate().Insert<NGCategory>(category, out strErrorMessage) == false)
                        return false;
                }
                else
                {
                    category.ID = _category.ID;

                    if (m_dataManager.GetUpdate().Update<NGCategory>(category, null, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool UpdateNG(List<NG> ngs, ref string strErrorMessage)
        {
            string strLineNames = "";
            int siteID = -1;

            foreach (var ng in ngs)
            {
                if (strLineNames.Length == 0)
                    strLineNames = "'" + ng.LineName + "'";
                else
                    strLineNames += ", '" + ng.LineName + "'";

                siteID = ng.SiteID;
            }

            if (strLineNames.Length > 0)
            {
                string strCondition = string.Format("{0} = {1} and {2} not in ({3})", NG.Fields.SiteID, siteID, NG.Fields.LineName, strLineNames);

                if (m_dataManager.GetDelete().Delete<NG>(strCondition, out strErrorMessage) == false)
                    return false;
            }
            else
                return true;

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", NG.Fields.SiteID, siteID, NG.Fields.LineName, strLineNames);
            IEnumerable<NG> _ngs = m_dataManager.GetSelect().Select<NG>(strConditions, out strErrorMessage);

            if (_ngs == null)
                return false;

            Dictionary<string, NG> dicLineDatas = new Dictionary<string, NG>();

            foreach (NG ng in _ngs)
            {
                dicLineDatas[ng.LineName] = ng;
            }

            foreach (var ng in ngs)
            {
                NG _ng;

                if (dicLineDatas.TryGetValue(ng.LineName, out _ng) == false)
                {
                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return false;

                    if (m_dataManager.GetCreate().Insert<NG>(ng, out strErrorMessage) == false)
                        return false;
                }
                else
                {
                    ng.ID = _ng.ID;

                    if (m_dataManager.GetUpdate().Update<NG>(ng, null, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool UpdatePerformance(List<Performance> performances, ref string strErrorMessage)
        {
            string strLineNames = "";
            int siteID = -1;

            foreach (var performance in performances)
            {
                if (strLineNames.Length == 0)
                    strLineNames = "'" + performance.LineName + "'";
                else
                    strLineNames += ", '" + performance.LineName + "'";

                siteID = performance.SiteID;
            }

            if (strLineNames.Length > 0)
            {
                string strCondition = string.Format("{0} = {1} and {2} not in ({3})", Performance.Fields.SiteID, siteID, Performance.Fields.LineName, strLineNames);

                if (m_dataManager.GetDelete().Delete<Performance>(strCondition, out strErrorMessage) == false)
                    return false;
            }
            else
                return true;

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", Performance.Fields.SiteID, siteID, Performance.Fields.LineName, strLineNames);
            IEnumerable<Performance> _performances = m_dataManager.GetSelect().Select<Performance>(strConditions, out strErrorMessage);

            if (_performances == null)
                return false;

            Dictionary<string, Performance> dicLineDatas = new Dictionary<string, Performance>();

            foreach (Performance performance in _performances)
            {
                dicLineDatas[performance.LineName] = performance;
            }

            foreach (var performance in performances)
            {
                Performance _performance;

                if (dicLineDatas.TryGetValue(performance.LineName, out _performance) == false)
                {
                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return false;

                    if (m_dataManager.GetCreate().Insert<Performance>(performance, out strErrorMessage) == false)
                        return false;
                }
                else
                {
                    performance.ID = _performance.ID;

                    if (m_dataManager.GetUpdate().Update<Performance>(performance, null, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool UpdateRun(Run run, ref string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Run.Fields.SiteID, run.SiteID);
            Run _run = m_dataManager.GetSelect().SelectFirst<Run>(strCondition, out strErrorMessage);

            if (_run == null)
            {
                if (strErrorMessage != null && strErrorMessage.Length > 0)
                    return false;

                if (m_dataManager.GetCreate().Insert<Run>(run, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                if (m_dataManager.GetUpdate().Update<Run>(run, strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private List<AlarmData> Read(int siteID, ref Run run, ref List<Performance> performances, ref List<NG> ngs, ref List<NGCategory> ngCategories, ref List<Nipa.Model.Mes.Buy.Dashboard> buyDashboards, ref List<Nipa.Model.Mes.Sell.Dashboard> sellDashboards, ref List<Equipment> equipments, ref List<Nipa.Model.Mes.Equipment.Data> equipmentDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (m_mesDataManager1 == null || m_mesDataManager2 == null)
            {
                strErrorMessage = "설정파일에 MES관련 데이터가 부족합니다.";
                return null;
            }

            run = ReadRun(m_mesDataManager1, siteID, ref strErrorMessage);

            if (run == null)
                return null;

            performances = ReadPerformance(m_mesDataManager1, siteID, ref strErrorMessage);

            if (performances == null)
                return null;

            ngs = ReadNG(m_mesDataManager1, siteID, ref strErrorMessage);

            if (ngs == null)
                return null;

            ngCategories = ReadNGCategory(m_mesDataManager1, siteID, ref strErrorMessage);

            if (ngCategories == null)
                return null;

            buyDashboards = ReadBuyDashboard(m_mesDataManager1, siteID, ref strErrorMessage);

            if (buyDashboards == null)
                return null;

            sellDashboards = ReadSellDashboard(m_mesDataManager1, siteID, ref strErrorMessage);

            if (sellDashboards == null)
                return null;

            equipments = ReadEquipment(m_mesDataManager2, siteID, ref strErrorMessage);

            if (equipments == null)
                return null;

            /*equipmentDatas = ReadEquipmentData(m_mesDataManager2, equipments, siteID, ref strErrorMessage);

            if (equipmentDatas == null)
                return null;*/

            return ReadProductFail(m_mesDataManager2, equipments, ref equipmentDatas, ref strErrorMessage);
        }

        private List<AlarmData> ReadProductFail(IDataManager dataManager, List<Equipment> equipments, ref List<Nipa.Model.Mes.Equipment.Data> equipmentDatas, ref string strErrorMessage)
        {
            IEnumerable<V_Matching_Data> matchingDatas = dataManager.GetSelect().Select<V_Matching_Data>(null, out strErrorMessage);

            if (matchingDatas == null)
                return null;

            // Key : 설비번호
            Dictionary<int, AlarmData> dicAlarmDatas = new Dictionary<int, AlarmData>();

            Data equipmentData = null;
            Dictionary<int, Data> dicEquipmentDatas = new Dictionary<int, Data>();

            foreach (var data in matchingDatas)
            {
                if (data.RESOURCE_CODE == null)
                    continue;

                int equipID = -1;
                string strResourceCode = data.RESOURCE_CODE.ToLower();

                if (strResourceCode.Contains("dk14"))
                    equipID = 14;
                else if (strResourceCode.Contains("dk22"))
                    equipID = 22;
                else if (strResourceCode.Contains("dk23"))
                    equipID = 23;
                else
                    continue;

                if (dicEquipmentDatas.TryGetValue(equipID, out equipmentData) == false)
                {
                    equipmentData = new Data();
                    equipmentData.EqID = equipID;
                    dicEquipmentDatas[equipID] = equipmentData;
                    equipmentData.TimeStamp = StringToTime(data.COLLECTION_DATE);
                }

                AlarmData alarmData = null;

                if (dicAlarmDatas.TryGetValue(equipID, out alarmData) == false)
                {
                    SensorZoneTagMaterial sensorZoneTag;

                    if (m_dicEquipmentSensorZones.TryGetValue(equipID, out sensorZoneTag))
                    {
                        alarmData = new AlarmData();

                        alarmData.SensorZoneTag = sensorZoneTag;
                        alarmData.EquipmentData = equipmentData;
                        dicAlarmDatas[equipID] = alarmData;
                    }
                }

                if (strResourceCode.EndsWith("샷카운트"))
                    equipmentData.ShotCount = StringToInt(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("샷기록시간"))
                    equipmentData.ShotTime = StringToTime(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("쿠션"))
                    equipmentData.CushionPos = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("최대압력"))
                    equipmentData.MaxPressure = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("절환위치"))
                    equipmentData.TransferPos = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("절환압력"))
                    equipmentData.TransferPressure = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("사출시간"))
                    equipmentData.InjectTime = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("보압시간"))
                    equipmentData.HoldingPressure = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("계량시간"))
                    equipmentData.MeasureTime = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("계량시작위치"))
                    equipmentData.MeasureStartPos = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("계량종료위치"))
                    equipmentData.MeasureEndPos = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("냉각시간"))
                    equipmentData.IcingTime = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("형개시간"))
                    equipmentData.MoldOpenTime = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("형폐시간"))
                    equipmentData.MoldCloseTime = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("압출전진시간"))
                    equipmentData.FowardTime = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("압출후진시간"))
                    equipmentData.BackwardTime = StringToDouble(data.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("공정시간"))
                    equipmentData.ProcessTime = StringToDouble(data.COLLECTION_VALUE);
                else
                    continue;

                if (alarmData != null)
                {
                    if (data.TYPE != null && data.TYPE.Length > 0)
                    {
                        if (data.TYPE == "불량")
                            alarmData.IsAlarm = true;
                        else if (data.TYPE == "양품")
                            alarmData.IsAlarm = false;
                    }

                    if (data.NG_NM != null && data.NG_NM.Length > 0)
                        alarmData.AlarmType = data.NG_NM;

                    if (data.IMAGEPATH != null)
                        alarmData.ImagePath = data.IMAGEPATH;
                }

                DateTime time = StringToTime(data.COLLECTION_DATE);

                if (equipmentData.TimeStamp < time)
                    equipmentData.TimeStamp = time;
            }

            foreach (var equipment in equipments)
            {
                if (dicEquipmentDatas.TryGetValue(equipment.ID, out equipmentData))
                    equipmentData.OK = equipment.Usable;
            }

            equipmentDatas = new List<Data>();
            equipmentDatas.AddRange(dicEquipmentDatas.Values);

            List<AlarmData> alarmDatas = new List<AlarmData>();
            alarmDatas.AddRange(dicAlarmDatas.Values);

            string strLog = "";

            if (IsEquipmentAlarmStatusChanged(alarmDatas, ref strLog))
                WriteLog(strLog);

            return alarmDatas;
        }

        private bool IsEquipmentAlarmStatusChanged(List<AlarmData> alarmDatas, ref string strLog)
        {
            bool isChanged = false;

            foreach (AlarmData alarm in alarmDatas)
            {
                if (alarm.EquipmentData == null)
                    continue;

                bool isAlarm;

                if (m_dicEquipmentAlarmStatus.TryGetValue(alarm.EquipmentData.EqID, out isAlarm) == false || isAlarm != alarm.IsAlarm)
                {
                    m_dicEquipmentAlarmStatus[alarm.EquipmentData.EqID] = alarm.IsAlarm;
                    isChanged = true;
                }

                string strMessage = string.Format("{0}호기 {1}: {2}", alarm.EquipmentData.EqID, alarm.IsAlarm ? "불량 " : "", alarm.AlarmType);

                if (strLog.Length == 0)
                    strLog = strMessage;
                else
                    strLog += ", " + strMessage;
            }

            return isChanged;
        }

        private List<Data> ReadEquipmentData(IDataManager dataManager, List<Equipment> equipments, int siteID, ref string strErrorMessage)
        {
            DateTime dtNow = DateTime.Now;

            string strTempTable = "shotdata";
            string strSQL = string.Format("with {0} as (select * from {1} where {2} >= '{3}{4:00}{5:00}') ",
                strTempTable,
                ShotData.TableName,
                ShotData.Fields.COLLECTION_DATE,
                dtNow.Year, dtNow.Month, dtNow.Day);

            strSQL += string.Format("select * from {0} where ({1}, {2}) in (select {1}, max({2}) from {0} group by {1}) order by {1}",
                strTempTable,
                ShotData.Fields.RESOURCE_CODE,
                ShotData.Fields.COLLECTION_DATE);

            IEnumerable<dynamic> datas = dataManager.GetSelect().Select(strSQL, out strErrorMessage);
            if (datas == null)
                return null;

            Nipa.Model.Mes.Equipment.Data equipmentData = null;
            Dictionary<int, Nipa.Model.Mes.Equipment.Data> dicEquipmentDatas = new Dictionary<int, Nipa.Model.Mes.Equipment.Data>();

            foreach (var shotData in datas)
            {
                if (shotData.RESOURCE_CODE == null)
                    continue;

                int equipID = -1;
                string strResourceCode = shotData.RESOURCE_CODE.ToLower();

                if (strResourceCode.Contains("dk14"))
                    equipID = 14;
                else if (strResourceCode.Contains("dk22"))
                    equipID = 22;
                else if (strResourceCode.Contains("dk23"))
                    equipID = 23;
                else
                    continue;

                if (dicEquipmentDatas.TryGetValue(equipID, out equipmentData) == false)
                {
                    equipmentData = new Nipa.Model.Mes.Equipment.Data();
                    equipmentData.EqID = equipID;
                    dicEquipmentDatas[equipID] = equipmentData;
                    equipmentData.TimeStamp = StringToTime(shotData.COLLECTION_DATE);
                }

                if (strResourceCode.EndsWith("샷카운트"))
                    equipmentData.ShotCount = StringToInt(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("샷기록시간"))
                    equipmentData.ShotTime = StringToTime(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("쿠션"))
                    equipmentData.CushionPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("최대압력"))
                    equipmentData.MaxPressure = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("절환위치"))
                    equipmentData.TransferPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("절환압력"))
                    equipmentData.TransferPressure = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("사출시간"))
                    equipmentData.InjectTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("보압시간"))
                    equipmentData.HoldingPressure = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("계량시간"))
                    equipmentData.MeasureTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("계량시작위치"))
                    equipmentData.MeasureStartPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("계량종료위치"))
                    equipmentData.MeasureEndPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("냉각시간"))
                    equipmentData.IcingTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("형개시간"))
                    equipmentData.MoldOpenTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("형폐시간"))
                    equipmentData.MoldCloseTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("압출전진시간"))
                    equipmentData.FowardTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("압출후진시간"))
                    equipmentData.BackwardTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.EndsWith("공정시간"))
                    equipmentData.ProcessTime = StringToDouble(shotData.COLLECTION_VALUE);
                else
                    continue;

                DateTime time = StringToTime(shotData.COLLECTION_DATE);

                if (equipmentData.TimeStamp < time)
                    equipmentData.TimeStamp = time;
            }

            foreach (var equipment in equipments)
            {
                if (dicEquipmentDatas.TryGetValue(equipment.ID, out equipmentData))
                    equipmentData.OK = equipment.Usable;
            }

            List<Nipa.Model.Mes.Equipment.Data> equipmentDatas = new List<Nipa.Model.Mes.Equipment.Data>();
            equipmentDatas.AddRange(dicEquipmentDatas.Values);
            return equipmentDatas;
        }

        private DateTime StringToTime(string strValue)
        {
            if (strValue == null)
                return new DateTime();

            int len = strValue.Length;

            if (len == 14)
            {
                int year, month, day, hour, min, sec;

                if (int.TryParse(strValue.Substring(0, 4), out year) &&
                    int.TryParse(strValue.Substring(4, 2), out month) &&
                    int.TryParse(strValue.Substring(6, 2), out day) &&
                    int.TryParse(strValue.Substring(8, 2), out hour) &&
                    int.TryParse(strValue.Substring(10, 2), out min) &&
                    int.TryParse(strValue.Substring(12, 2), out sec))
                    return new DateTime(year, month, day, hour, min, sec);
            }
            else
            {
                DateTime time;

                if (DateTime.TryParse(strValue, out time))
                    return time;
            }

            // 실패
            return new DateTime();
        }

        private double StringToDouble(string strValue)
        {
            if (strValue == null)
                return -1;

            double data;

            if (double.TryParse(strValue, out data))
                return data;

            return -1;
        }

        private int StringToInt(string strValue)
        {
            if (strValue == null)
                return -1;

            double data;

            if (double.TryParse(strValue, out data))
                return (int)data;

            return -1;
        }

        private List<Equipment> ReadEquipment(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            IEnumerable<LineStatus> lineStatusList = dataManager.GetSelect().Select<LineStatus>(null, out strErrorMessage);

            if (lineStatusList == null)
                return null;

            List<Equipment> equipments = new List<Equipment>();

            foreach (LineStatus lineStatus in lineStatusList)
            {
                if (lineStatus.LINE_CD == null)
                    continue;

                Equipment equipment = null;
                string strLineCode = lineStatus.LINE_CD.ToLower();

                if (strLineCode.EndsWith("ml14"))
                {
                    equipment = new Equipment();
                    equipment.ID = 14;
                }
                else if (strLineCode.EndsWith("ml22"))
                {
                    equipment = new Equipment();
                    equipment.ID = 22;
                }
                else if (strLineCode.EndsWith("ml23"))
                {
                    equipment = new Equipment();
                    equipment.ID = 23;
                }
                else
                    continue;

                equipment.Usable = lineStatus.설비상태 == "가동";
                equipments.Add(equipment);
            }

            string strLog = "";

            if (IsEquipmentStatusChanged(equipments, ref strLog))
                WriteLog(strLog);

            return equipments;
        }

        private bool IsEquipmentStatusChanged(List<Equipment> equipments, ref string strLog)
        {
            bool isChanged = false;

            foreach (Equipment equipment in equipments)
            {
                bool usable;

                if (m_dicEquipmentStatus.TryGetValue(equipment.ID, out usable) == false || equipment.Usable != usable)
                {
                    m_dicEquipmentStatus[equipment.ID] = equipment.Usable;
                    isChanged = true;
                }

                if (strLog.Length == 0)
                    strLog = string.Format("{0}호기 : {1}", equipment.ID, equipment.Usable ? "가동" : "비가동");
                else
                    strLog += string.Format(", {0}호기 : {1}", equipment.ID, equipment.Usable ? "가동" : "비가동");
            }

            return isChanged;
        }

        private List<Nipa.Model.Mes.Sell.Dashboard> ReadSellDashboard(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            IEnumerable<V_smsaf08> datas = dataManager.GetSelect().Select<V_smsaf08>(null, out strErrorMessage);

            if (datas == null)
                return null;

            List<Nipa.Model.Mes.Sell.Dashboard> dashboards = new List<Nipa.Model.Mes.Sell.Dashboard>();

            foreach (var data in datas)
            {
                Nipa.Model.Mes.Sell.Dashboard dashboard = new Nipa.Model.Mes.Sell.Dashboard();

                dashboard.Customer = data.CUST_NM;

                if (data.전일수량 != null)
                    dashboard.YesterdayCount = (double)data.전일수량;

                if (data.전일금액 != null)
                    dashboard.YesterdayMoney = (long)data.전일금액;

                if (data.당일수량 != null)
                    dashboard.TodayCount = (double)data.당일수량;

                if (data.당일금액 != null)
                    dashboard.TodayMoney = (long)data.당일금액;

                if (data.월간수량 != null)
                    dashboard.MonthlyCount = (double)data.월간수량;

                if (data.월간금액 != null)
                    dashboard.MonthlyMoney = (long)data.월간금액;

                dashboard.SiteID = siteID;
                dashboards.Add(dashboard);
            }

            return dashboards;
        }

        private List<Nipa.Model.Mes.Buy.Dashboard> ReadBuyDashboard(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            IEnumerable<V_dashboard> datas = dataManager.GetSelect().Select<V_dashboard>(null, out strErrorMessage);

            if (datas == null)
                return null;

            List<Nipa.Model.Mes.Buy.Dashboard> dashboards = new List<Nipa.Model.Mes.Buy.Dashboard>();

            foreach (var data in datas)
            {
                Nipa.Model.Mes.Buy.Dashboard dashboard = new Nipa.Model.Mes.Buy.Dashboard();

                dashboard.Customer = data.고객명;

                if (data.발주수량 != null)
                    dashboard.RequestCount = (double)data.발주수량;

                if (data.입고수량 != null)
                    dashboard.IncomeCount = (double)data.입고수량;

                if (data.차이수량 != null)
                    dashboard.DiffCount = (double)data.차이수량;

                if (data.재고수량 != null)
                    dashboard.RemainCount = (double)data.재고수량;

                dashboard.SiteID = siteID;
                dashboards.Add(dashboard);
            }

            return dashboards;
        }

        private List<NGCategory> ReadNGCategory(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            IEnumerable<Category_ng> datas = dataManager.GetSelect().Select<Category_ng>(null, out strErrorMessage);

            if (datas == null)
                return null;

            List<NGCategory> categories = new List<NGCategory>();

            foreach (var data in datas)
            {
                NGCategory ng = new NGCategory();

                ng.DetailNG = data.NG_DTL_NM;
                ng.SiteID = siteID;

                if (data.Total != null)
                    ng.Total = (int)data.Total;

                if (data.Total != null)
                    ng.Total = (double)data.Total;

                if (data.D01 != null)
                    ng.D01 = (double)data.D01;

                if (data.D02 != null)
                    ng.D02 = (double)data.D02;

                if (data.D03 != null)
                    ng.D03 = (double)data.D03;

                if (data.D04 != null)
                    ng.D04 = (double)data.D04;

                if (data.D05 != null)
                    ng.D05 = (double)data.D05;

                if (data.D06 != null)
                    ng.D06 = (double)data.D06;

                if (data.D07 != null)
                    ng.D07 = (double)data.D07;

                if (data.D08 != null)
                    ng.D08 = (double)data.D08;

                if (data.D09 != null)
                    ng.D09 = (double)data.D09;

                if (data.D10 != null)
                    ng.D10 = (double)data.D10;

                if (data.D11 != null)
                    ng.D11 = (double)data.D11;

                if (data.D12 != null)
                    ng.D12 = (double)data.D12;

                if (data.D13 != null)
                    ng.D13 = (double)data.D13;

                if (data.D14 != null)
                    ng.D14 = (double)data.D14;

                if (data.D15 != null)
                    ng.D15 = (double)data.D15;

                if (data.D16 != null)
                    ng.D16 = (double)data.D16;

                if (data.D17 != null)
                    ng.D17 = (double)data.D17;

                if (data.D18 != null)
                    ng.D18 = (double)data.D18;

                if (data.D19 != null)
                    ng.D19 = (double)data.D19;

                if (data.D20 != null)
                    ng.D20 = (double)data.D20;

                if (data.D21 != null)
                    ng.D21 = (double)data.D21;

                if (data.D22 != null)
                    ng.D22 = (double)data.D22;

                if (data.D23 != null)
                    ng.D23 = (double)data.D23;

                if (data.D24 != null)
                    ng.D24 = (double)data.D24;

                if (data.D25 != null)
                    ng.D25 = (double)data.D25;

                if (data.D26 != null)
                    ng.D26 = (double)data.D26;

                if (data.D27 != null)
                    ng.D27 = (double)data.D27;

                if (data.D28 != null)
                    ng.D28 = (double)data.D28;

                if (data.D29 != null)
                    ng.D29 = (double)data.D29;

                if (data.D30 != null)
                    ng.D30 = (double)data.D30;

                if (data.D31 != null)
                    ng.D31 = (double)data.D31;

                categories.Add(ng);
            }

            return categories;
        }

        private List<NG> ReadNG(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            IEnumerable<Division_ng> datas = dataManager.GetSelect().Select<Division_ng>(null, out strErrorMessage);

            if (datas == null)
                return null;

            List<NG> ngs = new List<NG>();

            foreach (var data in datas)
            {
                NG ng = new NG();

                ng.LineName = data.Type;
                ng.SiteID = siteID;

                if (data.Total != null)
                    ng.Total = (int)data.Total;

                if (data.D01 != null)
                    ng.D01 = (int)data.D01;

                if (data.D02 != null)
                    ng.D02 = (int)data.D02;

                if (data.D03 != null)
                    ng.D03 = (int)data.D03;

                if (data.D04 != null)
                    ng.D04 = (int)data.D04;

                if (data.D05 != null)
                    ng.D05 = (int)data.D05;

                if (data.D06 != null)
                    ng.D06 = (int)data.D06;

                if (data.D07 != null)
                    ng.D07 = (int)data.D07;

                if (data.D08 != null)
                    ng.D08 = (int)data.D08;

                if (data.D09 != null)
                    ng.D09 = (int)data.D09;

                if (data.D10 != null)
                    ng.D10 = (int)data.D10;

                if (data.D11 != null)
                    ng.D11 = (int)data.D11;

                if (data.D12 != null)
                    ng.D12 = (int)data.D12;

                if (data.D13 != null)
                    ng.D13 = (int)data.D13;

                if (data.D14 != null)
                    ng.D14 = (int)data.D14;

                if (data.D15 != null)
                    ng.D15 = (int)data.D15;

                if (data.D16 != null)
                    ng.D16 = (int)data.D16;

                if (data.D17 != null)
                    ng.D17 = (int)data.D17;

                if (data.D18 != null)
                    ng.D18 = (int)data.D18;

                if (data.D19 != null)
                    ng.D19 = (int)data.D19;

                if (data.D20 != null)
                    ng.D20 = (int)data.D20;

                if (data.D21 != null)
                    ng.D21 = (int)data.D21;

                if (data.D22 != null)
                    ng.D22 = (int)data.D22;

                if (data.D23 != null)
                    ng.D23 = (int)data.D23;

                if (data.D24 != null)
                    ng.D24 = (int)data.D24;

                if (data.D25 != null)
                    ng.D25 = (int)data.D25;

                if (data.D26 != null)
                    ng.D26 = (int)data.D26;

                if (data.D27 != null)
                    ng.D27 = (int)data.D27;

                if (data.D28 != null)
                    ng.D28 = (int)data.D28;

                if (data.D29 != null)
                    ng.D29 = (int)data.D29;

                if (data.D30 != null)
                    ng.D30 = (int)data.D30;

                if (data.D31 != null)
                    ng.D31 = (int)data.D31;

                ngs.Add(ng);
            }

            return ngs;
        }

        private List<Performance> ReadPerformance(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            IEnumerable<Productivity_now> datas = dataManager.GetSelect().Select<Productivity_now>(null, out strErrorMessage);

            if (datas == null)
                return null;

            List<Performance> performances = new List<Performance>();

            foreach (Productivity_now data in datas)
            {
                Performance performance = new Performance();

                performance.LineName = data.라인;

                if (data.생산성 != null)
                    performance.Product = (double)data.생산성;

                if (data.달성율 != null)
                    performance.PerformanceRate = (double)data.달성율;

                performance.SiteID = siteID;
                performances.Add(performance);
            }

            return performances;
        }

        private Run ReadRun(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            Factory_operating data = dataManager.GetSelect().SelectFirst<Factory_operating>(null, out strErrorMessage);

            if (data == null)
                return null;

            Run run = new Run();

            run.SiteID = siteID;

            if (data.계획없음 != null)
                run.NoPlan = (int)data.계획없음;

            if (data.비가동 != null)
                run.NotRun = (int)data.비가동;

            if (data.준비 != null)
                run.Ready = (int)data.준비;

            if (data.가동 != null)
                run.RunCount = (int)data.가동;

            if (data.대수 != null)
                run.TotalCount = (int)data.대수;

            string strPercent = data.가동률;

            if (strPercent != null)
            {
                int index = strPercent.LastIndexOf('%');
                strPercent = index > 0 ? strPercent.Substring(0, index).Trim() : strPercent.Trim();

                double percent;

                if (double.TryParse(strPercent, out percent))
                    run.RunPercentage = percent;
            }

            return run;
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        private bool ReadEquipmentSensorZone()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '사출설비'", Material.Fields.MaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
            {
                System.Diagnostics.Trace.WriteLine("사출설비 materialType이 DB에 등록되어 있지 않습니다.");
                return false;
            }

            strCondition = string.Format("{0} like 'Eq%' and {1} = {2}",
                ETC.Fields.UniqueKey,
                ETC.Fields.MaterialType,
                material.ID);
            IEnumerable<ETC> sensors = m_dataManager.GetSelect().Select<ETC>(strCondition, out strErrorMessage);

            if (sensors == null)
            {
                System.Diagnostics.Trace.WriteLine("Read ETC Fail : " + strErrorMessage);
                return false;
            }

            // Key : OrgSensor ID
            // Value : 설비번호
            Dictionary<int, int> dicSensorNo = new Dictionary<int, int>();
            string strSensorIDs = "";

            foreach (ETC sensor in sensors)
            {
                if (strSensorIDs.Length == 0)
                    strSensorIDs = sensor.ID.ToString();
                else
                    strSensorIDs += "," + sensor.ID.ToString();

                int eqNo = GetEqID(sensor.UniqueKey);

                if (eqNo > 0)
                    dicSensorNo[sensor.ID] = eqNo;
            }

            if (strSensorIDs.Length == 0)
                return true;

            strCondition = string.Format("a.{0} = {1} and a.{2} in ({3})",
                SensorZone.Fields.SensorType,
                material.ID,
                SensorZone.Fields.OrgSensorID,
                strSensorIDs);
            ArrayList arrDatas = Worker.SWayM.AlarmManager.JoinSensorZoneTagInfo(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("JoinSensorZoneTagInfo Fail : " + strErrorMessage);
                return false;
            }

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    int eqNo;

                    if (sensorZone.OrgSensorID != null && dicSensorNo.TryGetValue((int)sensorZone.OrgSensorID, out eqNo))
                    {
                        SensorZoneTagMaterial sensorZoneTag = new SensorZoneTagMaterial();

                        sensorZoneTag.SensorZone = sensorZone;
                        sensorZoneTag.TagInfo = tagInfo;
                        sensorZoneTag.Material = material;

                        m_dicEquipmentSensorZones[eqNo] = sensorZoneTag;
                    }
                }
            }

            return true;
        }

        private int GetEqID(string strName)
        {
            int len = strName.Length;

            int num = 0;
            bool begin = false;

            for (int i = 0; i < len; i++)
            {
                char ch = strName[i];

                if (begin == false)
                {
                    if (ch >= '0' && ch <= '9')
                    {
                        begin = true;
                        num = num * 10 + (int)(ch - '0');
                    }
                }
                else
                {
                    if (ch < '0' || ch > '9')
                        break;
                    else
                        num = num * 10 + (int)(ch - '0');
                }
            }

            return num;
        }
    }
}
