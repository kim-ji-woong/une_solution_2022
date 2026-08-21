using System.Configuration;
using System.Collections.Generic;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Mes.Product;
using Nipa.Model.Mes.Quality;
using Nipa.Model.Mes.Equipment;

namespace MesReader.Data
{
    class DataManager
    {
        private IDataManager m_dataManager = null;
        private MesManager m_mesManager = null;
        private bool m_runProcess = false;
        private List<int> m_siteIDs = new List<int>();

        public DataManager()
        {
            SetDataManager();
        }

        private void SetDataManager()
        {
            string strSiteIDs = ConfigurationManager.AppSettings.Get("siteIDs");

            string strDBHost = ConfigurationManager.AppSettings.Get("dbHost");
            string strDBType = ConfigurationManager.AppSettings.Get("dbType");
            string strDBId = ConfigurationManager.AppSettings.Get("dbId");
            string strDBPw = ConfigurationManager.AppSettings.Get("dbPw");
            string strDBName = ConfigurationManager.AppSettings.Get("dbName");

            string strHost = AES256Cipher.AES_decrypt(strDBHost);
            string strType = AES256Cipher.AES_decrypt(strDBType);
            string strID = AES256Cipher.AES_decrypt(strDBId);
            string strPw = AES256Cipher.AES_decrypt(strDBPw);

            string[] tokens = strSiteIDs.Split(',');

            foreach (string strToken in tokens)
            {
                int siteID;

                if (int.TryParse(strToken.Trim(), out siteID))
                    m_siteIDs.Add(siteID);
            }

            int dbType;

            if (int.TryParse(strType, out dbType))
            {
                m_dataManager = new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(dbType, strHost, strDBName, strID, strPw);
                m_mesManager = new MesManager();
            }
        }

        public bool Read(out string strErrorMessage)
        {
            strErrorMessage = null;

            if (m_runProcess || m_dataManager == null || m_mesManager == null)
                return true;

            m_runProcess = true;

            foreach (int siteID in m_siteIDs)
            {
                if (m_mesManager.Read(siteID, out strErrorMessage) == false)
                {
                    m_runProcess = false;
                    return false;
                }

                if (UpdateData(out strErrorMessage) == false)
                {
                    m_runProcess = false;
                    return false;
                }
            }

            m_runProcess = false;
            return true;
        }

        private bool UpdateData(out string strErrorMessage)
        {
            strErrorMessage = null;
            //if (m_dataManager.BeginBatch(out strErrorMessage) == false)
            //    return false;

            if (UpdateRun(ref strErrorMessage) == false)
            {
                string message;
                //m_dataManager.BatchRollback(out message);
                return false;
            }

            if (UpdatePerformance(ref strErrorMessage) == false)
            {
                string message;
                //m_dataManager.BatchRollback(out message);
                return false;
            }

            if (UpdateNG(ref strErrorMessage) == false)
            {
                string message;
                //m_dataManager.BatchRollback(out message);
                return false;
            }

            if (UpdateNGCategory(ref strErrorMessage) == false)
            {
                string message;
                //m_dataManager.BatchRollback(out message);
                return false;
            }

            if (UpdateBuyDashboard(ref strErrorMessage) == false)
            {
                string message;
                //m_dataManager.BatchRollback(out message);
                return false;
            }

            if (UpdateSellDashboard(ref strErrorMessage) == false)
            {
                string message;
                //m_dataManager.BatchRollback(out message);
                return false;
            }

            if (UpdateEquipment(ref strErrorMessage) == false)
            {
                return false;
            }

            if (UpdateEquipmentData(ref strErrorMessage) == false)
            {
                return false;
            }

            return true;
            //return m_dataManager.BatchCommit(out strErrorMessage);
        }

        private bool UpdateEquipmentData(ref string strErrorMessage)
        {
            Dictionary<Nipa.Model.Mes.Equipment.Data.Fields, object> dicSets = new Dictionary<Nipa.Model.Mes.Equipment.Data.Fields, object>();

            foreach (var equipmentData in m_mesManager.EquipmentDatas)
            {
                if (m_dataManager.GetUpdate().Update<Nipa.Model.Mes.Equipment.Data>(equipmentData, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateEquipment(ref string strErrorMessage)
        {
            Dictionary<Equipment.Fields, object> dicSets = new Dictionary<Equipment.Fields, object>();

            foreach (var equipment in m_mesManager.Equipments)
            {
                string strCondition = string.Format("{0} = {1}", Equipment.Fields.ID, equipment.ID);
                dicSets[Equipment.Fields.Usable] = equipment.Usable;

                if (m_dataManager.GetUpdate().Update<Equipment, Equipment.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateSellDashboard(ref string strErrorMessage)
        {
            string strCustomers = "";
            int siteID = -1;

            foreach (var dashboard in m_mesManager.SellDashboards)
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

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", Nipa.Model.Mes.Sell.Dashboard.Fields.SiteID, siteID, Nipa.Model.Mes.Sell.Dashboard.Fields.Customer, strCustomers);
            IEnumerable<Nipa.Model.Mes.Sell.Dashboard> dashboards = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Sell.Dashboard>(strConditions, out strErrorMessage);

            if (dashboards == null)
                return false;

            Dictionary<string, Nipa.Model.Mes.Sell.Dashboard> dicCustomerDatas = new Dictionary<string, Nipa.Model.Mes.Sell.Dashboard>();

            foreach (Nipa.Model.Mes.Sell.Dashboard dashboard in dashboards)
            {
                dicCustomerDatas[dashboard.Customer] = dashboard;
            }

            foreach (var dashboard in m_mesManager.SellDashboards)
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

        private bool UpdateBuyDashboard(ref string strErrorMessage)
        {
            string strCustomers = "";
            int siteID = -1;

            foreach (var dashboard in m_mesManager.BuyDashboards)
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

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", Nipa.Model.Mes.Buy.Dashboard.Fields.SiteID, siteID, Nipa.Model.Mes.Buy.Dashboard.Fields.Customer, strCustomers);
            IEnumerable<Nipa.Model.Mes.Buy.Dashboard> dashboards = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Buy.Dashboard>(strConditions, out strErrorMessage);

            if (dashboards == null)
                return false;

            Dictionary<string, Nipa.Model.Mes.Buy.Dashboard> dicCustomerDatas = new Dictionary<string, Nipa.Model.Mes.Buy.Dashboard>();

            foreach (Nipa.Model.Mes.Buy.Dashboard dashboard in dashboards)
            {
                dicCustomerDatas[dashboard.Customer] = dashboard;
            }

            foreach (var dashboard in m_mesManager.BuyDashboards)
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

        private bool UpdateNGCategory(ref string strErrorMessage)
        {
            string strDetails = "";
            int siteID = -1;

            foreach (var category in m_mesManager.NGCategories)
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

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", NGCategory.Fields.SiteID, siteID, NGCategory.Fields.DetailNG, strDetails);
            IEnumerable<NGCategory> categories = m_dataManager.GetSelect().Select<NGCategory>(strConditions, out strErrorMessage);

            if (categories == null)
                return false;

            Dictionary<string, NGCategory> dicDetailDatas = new Dictionary<string, NGCategory>();

            foreach (NGCategory category in categories)
            {
                dicDetailDatas[category.DetailNG] = category;
            }

            foreach (var category in m_mesManager.NGCategories)
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

        private bool UpdateNG(ref string strErrorMessage)
        {
            string strLineNames = "";
            int siteID = -1;

            foreach (var ng in m_mesManager.NGs)
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

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", NG.Fields.SiteID, siteID, NG.Fields.LineName, strLineNames);
            IEnumerable<NG> ngs = m_dataManager.GetSelect().Select<NG>(strConditions, out strErrorMessage);

            if (ngs == null)
                return false;

            Dictionary<string, NG> dicLineDatas = new Dictionary<string, NG>();

            foreach (NG ng in ngs)
            {
                dicLineDatas[ng.LineName] = ng;
            }

            foreach (var ng in m_mesManager.NGs)
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

        private bool UpdatePerformance(ref string strErrorMessage)
        {
            string strLineNames = "";
            int siteID = -1;

            foreach (var performance in m_mesManager.Performances)
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

            string strConditions = string.Format("{0} = {1} and {2} in ({3})", Performance.Fields.SiteID, siteID, Performance.Fields.LineName, strLineNames);
            IEnumerable<Performance> performances = m_dataManager.GetSelect().Select<Performance>(strConditions, out strErrorMessage);

            if (performances == null)
                return false;

            Dictionary<string, Performance> dicLineDatas = new Dictionary<string, Performance>();

            foreach (Performance performance in performances)
            {
                dicLineDatas[performance.LineName] = performance;
            }

            foreach (var performance in m_mesManager.Performances)
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

        private bool UpdateRun(ref string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Run.Fields.SiteID, m_mesManager.Run.SiteID);
            Run run = m_dataManager.GetSelect().SelectFirst<Run>(strCondition, out strErrorMessage);

            if (run == null)
            {
                if (strErrorMessage != null && strErrorMessage.Length > 0)
                    return false;

                if (m_dataManager.GetCreate().Insert<Run>(m_mesManager.Run, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                if (m_dataManager.GetUpdate().Update<Run>(m_mesManager.Run, strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }
    }
}
