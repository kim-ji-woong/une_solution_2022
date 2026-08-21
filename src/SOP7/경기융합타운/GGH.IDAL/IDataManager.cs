namespace GGH.IDAL
{
    public interface IDataManager
    {
        int SiteID
        {
            get;
        }

        ISelect GetSelectManager();
        IUpdate GetUpdateManager();
        ICreate GetCreateManager();
        IDelete GetDeleteManager();

        bool BeginBatch();
        bool BatchCommit();
        bool BatchRollback();
        IDataManager Clone();
        IDataManager Clone(string strDbHost, string strDbName, string strDbID, string strDbPw, int siteID);
    }
}
