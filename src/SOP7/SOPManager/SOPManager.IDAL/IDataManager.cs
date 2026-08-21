namespace SOPManager.IDAL
{
    public interface IDataManager
    {
        int SiteID
        {
            get;
        }

        ICreate GetCreateManager();
        IDelete GetDeleteManager();
        IUpdate GetUpdateManager();
        ISelect GetSelectManager();
        IRollbackData MakeRollbackDataInstance();

        bool BeginBatch();
        bool BatchCommit();
        bool BatchRollback();
        IDataManager Clone();
    }
}
