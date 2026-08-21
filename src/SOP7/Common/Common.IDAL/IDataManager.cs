namespace Common.IDAL
{
    public interface IDataManager
    {
        int SiteID
        {
            get;
        }

        ISelect GetSelectManager();
        ICreate GetCreateManager();
        IDelete GetDeleteManager();
        IUpdate GetUpdateManager();

        IDataManager Clone();
        IDataManager Clone(string strDbHost, string strDbName, string strDbID, string strDbPw, int siteID);
    }
}
