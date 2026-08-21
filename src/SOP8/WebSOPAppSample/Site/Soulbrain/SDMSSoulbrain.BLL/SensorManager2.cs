using System.Collections.Generic;
using SDMS.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOP.IBLL;

namespace SDMSSoulbrain.BLL
{
    using DAL;

    public class SensorManager2
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;
        private ISopManager m_sopManager = null;

        public SensorManager2(IDataManager dataManager, ISopManager sopManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(dataManager);
            m_sopManager = sopManager;
        }

        public IEnumerable<PSM> GetPSMSensors(int? rowCount, out string strErrorMessage)
        {
            return m_joinManager.GetPsmSensors(rowCount, out strErrorMessage);
        }

        public bool GetLinkedSOPFromPsmSensor(int psmSensorID, out string strDisasterCategoryName, out string strSubDisasterCategory, out string strDisasterName, out string strErrorMessage)
        {
            strDisasterCategoryName = strSubDisasterCategory = strDisasterName = null;

            string strCondition = string.Format("{0} = 'psm'", FacilityType.Fields.TypeName);
            IEnumerable<FacilityType> facilityTypes = m_dataManager.GetSelect().Select<FacilityType>(strCondition, out strErrorMessage);

            if (facilityTypes == null)
                return false;

            foreach (FacilityType facilityType in facilityTypes)
            {
                return m_sopManager.GetLinkedSOP(facilityType.ID, out strDisasterCategoryName, out strSubDisasterCategory, out strDisasterName, out strErrorMessage);
            }

            strErrorMessage = "연결된 SOP가 존재하지 않습니다.";
            return false;
        }
    }
}
