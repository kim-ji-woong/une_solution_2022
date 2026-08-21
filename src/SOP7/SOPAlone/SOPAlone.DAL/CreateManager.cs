using dnsDBUtil;
using SOPAlone.IDAL;
using System;

namespace SOPAlone.DAL
{
    public class CreateManager : QueryManager, ICreate
    {
        private DataManager m_dataManager = null;
        public CreateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }

        private bool EqualsValue(object oldObj, object newObj)
        {
            if (oldObj == null && newObj == null)
                return true;

            if (oldObj is DateTime)
            {
                DateTime dt1, dt2;
                if (DateTime.TryParse(oldObj.ToString(), out dt1) && DateTime.TryParse(newObj.ToString(), out dt2))
                {
                    if (Convert.ToDateTime(oldObj).ToString("yyyyMMddHHmmss") == Convert.ToDateTime(newObj).ToString("yyyyMMddHHmmss"))
                        return true;
                }
            }
            else
            {
                if (oldObj?.ToString().Trim() == newObj?.ToString().Trim())
                    return true;
            }

            return false;
        }
    }
}
