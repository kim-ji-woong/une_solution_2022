using System;
using System.Collections;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOP.IBLL;

namespace SOP.BLL
{
    using SOP.DAL;
    using SOP.Model.Category;

    class SopManager : ISopManager
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;

        public SopManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(dataManager);
        }

        public bool GetLinkedSOP(int facilityType, out string strDisasterCategoryName, out string strSubDisasterCategory, out string strDisasterName, out string strErrorMessage)
        {
            strDisasterCategoryName = strSubDisasterCategory = strDisasterName = null;
            ArrayList arrDatas = m_joinManager.JoinDisasterCategorySubDisasterCategoryDisaster(facilityType, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is DisasterCategory && arrDatas[i + 1] is SubDisasterCategory && arrDatas[i + 2] is Disaster)
                {
                    DisasterCategory dc = (DisasterCategory)arrDatas[i];
                    SubDisasterCategory sdc = (SubDisasterCategory)arrDatas[i + 1];
                    Disaster disaster = (Disaster)arrDatas[i + 2];

                    strDisasterCategoryName = dc.CategoryName;
                    strSubDisasterCategory = sdc.SubCategoryName;
                    strDisasterName = disaster.DisasterName;
                    return true;
                }
            }

            if (strErrorMessage != null)
                strErrorMessage = "연결된 SOP가 존재하지 않습니다.";

            return false;
        }
    }
}
