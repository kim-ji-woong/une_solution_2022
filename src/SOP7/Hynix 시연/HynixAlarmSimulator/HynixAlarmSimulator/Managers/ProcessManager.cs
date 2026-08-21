using dnsDapperDBUtil.DataAccessLayer.DAL;
using HynixAlarmSimulator.Data;

namespace HynixAlarmSimulator.Managers
{
    public class ProcessManager
    {
        
        private DataManager m_dataManager = null;
        private EventInsertManager _mEventInsertManager = null;
        private HistoryDataInsertManager _mHistoryDataInsertManager = null;
        private string m_strSOPWebServerURL = "";
        
        public ProcessManager(DataManager dataManager, string strSOPWebServerURL)
        {
            m_dataManager = dataManager;
            _mEventInsertManager = new EventInsertManager(dataManager, strSOPWebServerURL);
            m_strSOPWebServerURL = strSOPWebServerURL;
        }

        public bool RequestInsertData(Model.Category category)
        {
            int nCategoryID = category.ID;
            switch (nCategoryID)
            {
                case (int)Const.Categories.ForcedOpen:
                    return _mEventInsertManager.InsertForcedOpen();
                case (int)Const.Categories.Stranger:
                    return _mEventInsertManager.InsertStranger();
                case (int)Const.Categories.Detour:
                    return _mEventInsertManager.InsertDetour();
                default:
                    return false;
            }
        }
        
    }
}