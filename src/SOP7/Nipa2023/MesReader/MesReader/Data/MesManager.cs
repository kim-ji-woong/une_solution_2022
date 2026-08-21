using System;
using System.Configuration;
using System.Collections.Generic;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Mes.Product;
using Nipa.Model.Mes.Quality;
using Nipa.Model.Mes.Equipment;

namespace MesReader.Data
{
    using Model;

    public class MesManager
    {
        private IDataManager m_dataManager1 = null;
        private IDataManager m_dataManager2 = null;
        private Run m_run = null;
        private List<Performance> m_performances = new List<Performance>();
        private List<NG> m_ngs = new List<NG>();
        private List<NGCategory> m_ngCategories = new List<NGCategory>();
        private List<Nipa.Model.Mes.Buy.Dashboard> m_buyDashboards = new List<Nipa.Model.Mes.Buy.Dashboard>();
        private List<Nipa.Model.Mes.Sell.Dashboard> m_sellDashboards = new List<Nipa.Model.Mes.Sell.Dashboard>();
        private List<Equipment> m_equipments = new List<Equipment>();
        private List<Nipa.Model.Mes.Equipment.Data> m_equipmentDatas = new List<Nipa.Model.Mes.Equipment.Data>();

        public Run Run
        {
            get { return m_run; }
        }

        public List<Performance> Performances
        {
            get { return m_performances; }
        }

        public List<NG> NGs
        {
            get { return m_ngs; }
        }

        public List<NGCategory> NGCategories
        {
            get { return m_ngCategories; }
        }

        public List<Nipa.Model.Mes.Buy.Dashboard> BuyDashboards
        {
            get { return m_buyDashboards; }
        }

        public List<Nipa.Model.Mes.Sell.Dashboard> SellDashboards
        {
            get { return m_sellDashboards; }
        }

        public List<Equipment> Equipments
        {
            get { return m_equipments; }
        }

        public List<Nipa.Model.Mes.Equipment.Data> EquipmentDatas
        {
            get { return m_equipmentDatas; }
        }

        public MesManager()
        {
            SetDataManager();
        }

        private void SetDataManager()
        {
            string strDBHost1 = ConfigurationManager.AppSettings.Get("mesHost1");
            string strDBType1 = ConfigurationManager.AppSettings.Get("mesType1");
            string strDBId1 = ConfigurationManager.AppSettings.Get("mesId1");
            string strDBPw1 = ConfigurationManager.AppSettings.Get("mesPw1");
            string strSid1 = ConfigurationManager.AppSettings.Get("mesSid1");

            string strHost1 = AES256Cipher.AES_decrypt(strDBHost1);
            string strType1 = strDBType1;
            string strID1 = AES256Cipher.AES_decrypt(strDBId1);
            string strPw1 = AES256Cipher.AES_decrypt(strDBPw1);
            string sid1 = AES256Cipher.AES_decrypt(strSid1);

            string strDBHost2 = ConfigurationManager.AppSettings.Get("mesHost2");
            string strDBType2 = ConfigurationManager.AppSettings.Get("mesType2");
            string strDBId2 = ConfigurationManager.AppSettings.Get("mesId2");
            string strDBPw2 = ConfigurationManager.AppSettings.Get("mesPw2");
            string strSid2 = ConfigurationManager.AppSettings.Get("mesSid2");

            string strHost2 = AES256Cipher.AES_decrypt(strDBHost2);
            string strType2 = strDBType2;
            string strID2 = AES256Cipher.AES_decrypt(strDBId2);
            string strPw2 = AES256Cipher.AES_decrypt(strDBPw2);
            string sid2 = AES256Cipher.AES_decrypt(strSid2);

            int dbType1, dbType2;

            if (int.TryParse(strType1, out dbType1) && int.TryParse(strType2, out dbType2))
            {
                m_dataManager1 = new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(dbType1, strHost1, sid1, strID1, strPw1);
                m_dataManager2 = new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(dbType2, strHost2, sid2, strID2, strPw2);
            }
        }

        public bool Read(int siteID, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (m_dataManager1 == null || m_dataManager2 == null)
            {
                strErrorMessage = "설정파일에 MES관련 데이터가 부족합니다.";
                return false;
            }

            m_run = ReadRun(m_dataManager1, siteID, ref strErrorMessage);

            if (m_run == null)
                return false;

            m_performances = ReadPerformance(m_dataManager1, siteID, ref strErrorMessage);

            if (m_performances == null)
                return false;

            m_ngs = ReadNG(m_dataManager1, siteID, ref strErrorMessage);

            if (m_ngs == null)
                return false;

            m_ngCategories = ReadNGCategory(m_dataManager1, siteID, ref strErrorMessage);

            if (m_ngCategories == null)
                return false;

            m_buyDashboards = ReadBuyDashboard(m_dataManager1, siteID, ref strErrorMessage);

            if (m_buyDashboards == null)
                return false;

            m_sellDashboards = ReadSellDashboard(m_dataManager1, siteID, ref strErrorMessage);

            if (m_sellDashboards == null)
                return false;

            m_equipments = ReadEquipment(m_dataManager1, siteID, ref strErrorMessage);

            if (m_equipments == null)
                return false;

            m_equipmentDatas = ReadEquipmentData(m_dataManager2, siteID, ref strErrorMessage);

            if (m_equipmentDatas == null)
                return false;

            return true;
        }

        private List<Nipa.Model.Mes.Equipment.Data> ReadEquipmentData(IDataManager dataManager, int siteID, ref string strErrorMessage)
        {
            DateTime dtNow = DateTime.Now;
            string strCondition = string.Format("({0}, {1}) in (Select {0}, max({1}) from {2} where {1} >= '{3}{4:00}{5:00}' group by {0})",
                ShotData.Fields.RESOURCE_CODE,
                ShotData.Fields.COLLECTION_DATE,
                ShotData.TableName,
                dtNow.Year, dtNow.Month, dtNow.Day);
            IEnumerable<ShotData> datas = dataManager.GetSelect().Select<ShotData>(strCondition, out strErrorMessage);

            if (datas == null)
                return null;

            Nipa.Model.Mes.Equipment.Data equipmentData = null;
            Dictionary<int, Nipa.Model.Mes.Equipment.Data> dicEquipmentDatas = new Dictionary<int, Nipa.Model.Mes.Equipment.Data>();

            foreach (ShotData shotData in datas)
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

                if (strResourceCode.Contains("샷카운트_"))
                    equipmentData.ShotCount = StringToInt(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("샷기록시간_"))
                    equipmentData.ShotTime = StringToTime(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("쿠션_"))
                    equipmentData.CushionPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("최대압력_"))
                    equipmentData.MaxPressure = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("절환위치_"))
                    equipmentData.TransferPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("절환압력_"))
                    equipmentData.TransferPressure = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("사출시간_"))
                    equipmentData.InjectTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("보압시간_"))
                    equipmentData.HoldingPressure = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("계량시간_"))
                    equipmentData.MeasureTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("계량시작위치_"))
                    equipmentData.MeasureStartPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("계량종료위치_"))
                    equipmentData.MeasureEndPos = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("냉각시간_"))
                    equipmentData.IcingTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("형개시간_"))
                    equipmentData.MoldOpenTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("형폐시간_"))
                    equipmentData.MoldCloseTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("압출전진시간_"))
                    equipmentData.FowardTime = StringToDouble(shotData.COLLECTION_VALUE);
                else if (strResourceCode.Contains("압출후진시간_"))
                    equipmentData.BackwardTime = StringToDouble(shotData.COLLECTION_VALUE);
                else
                    continue;

                DateTime time = StringToTime(shotData.COLLECTION_DATE);

                if (equipmentData.TimeStamp < time)
                    equipmentData.TimeStamp = time;
            }

            foreach (var equipment in m_equipments)
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

            return equipments;
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
    }
}
