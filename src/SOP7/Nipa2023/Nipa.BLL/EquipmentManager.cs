using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Mes.Product;
using Nipa.Model.Mes.Quality;
using Nipa.DAL;

namespace Nipa.BLL
{
    using Models.Request;
    using Models.Response.SDMS;

    public class EquipmentManager
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;

        public EquipmentManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(dataManager);
        }

        public ResponseMESData GetMESData(RequestMESData request)
        {
            string strErrorMessage;
            ResponseMESData response = new ResponseMESData(true, "");

            // 생산현황
            if (request.Type == (int)RequestMESData.DataType.Product)
            {
                string strCondition = string.Format("{0} = {1}", Run.Fields.SiteID, request.CampusID);
                Run run = m_dataManager.GetSelect().SelectFirst<Run>(strCondition, out strErrorMessage);

                if (run == null)
                {
                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return new ResponseMESData(false, strErrorMessage);
                    else
                        return new ResponseMESData(false, $"시스템 데이터베이스에 CampusID {request.CampusID}에 대한 생산현황 정보가 존재하지 않습니다.");
                }
                
                response.Run = run;

                strCondition = string.Format("{0} = {1}", Performance.Fields.SiteID, request.CampusID);
                IEnumerable<Performance> performances = m_dataManager.GetSelect().Select<Performance>(strCondition, out strErrorMessage);

                if (performances == null)
                    return new ResponseMESData(false, strErrorMessage);

                response.Performances.AddRange(performances);
            }
            // 품질현황
            else if (request.Type == (int)RequestMESData.DataType.Quality)
            {
                string strCondition = string.Format("{0} = {1}", NG.Fields.SiteID, request.CampusID);
                IEnumerable<NG> ngs = m_dataManager.GetSelect().Select<NG>(strCondition, out strErrorMessage);

                if (ngs == null)
                    return new ResponseMESData(false, strErrorMessage);

                response.Ngs.AddRange(ngs);

                strCondition = string.Format("{0} = {1}", NGCategory.Fields.SiteID, request.CampusID);
                IEnumerable<NGCategory> categories = m_dataManager.GetSelect().Select<NGCategory>(strCondition, out strErrorMessage);

                if (categories == null)
                    return new ResponseMESData(false, strErrorMessage);

                response.NgCategories.AddRange(categories);
            }
            // 구매현황
            else if (request.Type == (int)RequestMESData.DataType.Buy)
            {
                string strCondition = string.Format("{0} = {1}", Nipa.Model.Mes.Buy.Dashboard.Fields.SiteID, request.CampusID);
                IEnumerable<Nipa.Model.Mes.Buy.Dashboard> dashboards = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Buy.Dashboard>(strCondition, out strErrorMessage);

                if (dashboards == null)
                    return new ResponseMESData(false, strErrorMessage);
                else
                    response.BuyDashboards.AddRange(dashboards);
            }
            // 매출현황
            else if (request.Type == (int)RequestMESData.DataType.Sell)
            {
                string strCondition = string.Format("{0} = {1}", Nipa.Model.Mes.Sell.Dashboard.Fields.SiteID, request.CampusID);
                IEnumerable<Nipa.Model.Mes.Sell.Dashboard> dashboards = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Sell.Dashboard>(strCondition, out strErrorMessage);

                if (dashboards == null)
                    return new ResponseMESData(false, strErrorMessage);
                else
                    response.SellDashboards.AddRange(dashboards);
            }

            return response;
        }

        public ResponseMESEquipmentData GetMesEquipmentData(RequestMESEquipmentData data)
        {
            if (data.EquipmentIDs.Count == 0)
                return new ResponseMESEquipmentData(true, "");

            string strIDs = "";

            foreach (int eqID in data.EquipmentIDs)
            {
                if (strIDs.Length == 0)
                    strIDs = eqID.ToString();
                else
                    strIDs += "," + eqID.ToString();
            }

            string strCondition = string.Format("a.{0} in ({1})", Nipa.Model.Mes.Equipment.Equipment.Fields.ID, strIDs);

            string strErrorMessage;
            ArrayList arrDatas = m_joinManager.JoinMesEquipmentMesEquipmentData(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseMESEquipmentData(false, strErrorMessage);

            ResponseMESEquipmentData response = new ResponseMESEquipmentData(true, "");
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Nipa.Model.Mes.Equipment.Equipment && arrDatas[i + 1] is Nipa.Model.Mes.Equipment.Data)
                {
                    var equipment = (Nipa.Model.Mes.Equipment.Equipment)arrDatas[i];
                    var equipmentData = (Nipa.Model.Mes.Equipment.Data)arrDatas[i + 1];

                    Models.MesEquipmentData mesEquipmentData = new Models.MesEquipmentData();
                    mesEquipmentData.Equipment = equipment;
                    mesEquipmentData.Data = equipmentData;

                    response.Datas.Add(mesEquipmentData);
                }
            }

            return response;
        }
    }
}
