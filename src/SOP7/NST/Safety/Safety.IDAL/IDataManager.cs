namespace Safety.IDAL
{
    public interface IDataManager
    {
        ICreate GetCreateManager();
        ISelect GetSelectManager();
        IDelete GetDeleteManager();
        IUpdate GetUpdateManager();
        int SiteID
        {
            get;
        }
    }
}
