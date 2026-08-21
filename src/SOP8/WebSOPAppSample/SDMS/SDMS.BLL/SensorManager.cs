using System.Collections;
using System.Collections.Generic;
using SDMS.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SDMS.IBLL;
using SDMS.DAL;
using SOP.IBLL;

namespace SDMS.BLL
{
    public class SensorManager : ISensorManager
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;
        private ISopManager m_sopManager = null;

        public SensorManager(IDataManager dataManager, ISopManager sopManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(m_dataManager);
            m_sopManager = sopManager;
        }

        public IEnumerable<Fire> GetFireSensors(int? rowCount, out string strErrorMessage)
        {
            return m_joinManager.GetFireSensors(rowCount, out strErrorMessage);
        }

        public ArrayList GetZoneFireSensors(int? rowCount, out string strErrorMessage)
        {
            return m_joinManager.JoinZoneFireSensors(rowCount, out strErrorMessage);
        }

        public bool GetLinkedSOPFromFireSensor(int fireSensorID, out string strDisasterCategoryName, out string strSubDisasterCategory, out string strDisasterName, out string strErrorMessage)
        {
            strDisasterCategoryName = strSubDisasterCategory = strDisasterName = null;

            string strCondition = string.Format("{0} = 'fire'", FacilityType.Fields.TypeName);
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
