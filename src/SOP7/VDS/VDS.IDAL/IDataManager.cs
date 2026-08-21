namespace VDS.IDAL
{
    public interface IDataManager
    {
        ICreate GetCreateManager();
        ISelect GetSelectManager();
        IDelete GetDeleteManager();
        IUpdate GetUpdateManager();
        bool BeginTransaction();
        bool Commit();
        bool Rollback();
    }
}
