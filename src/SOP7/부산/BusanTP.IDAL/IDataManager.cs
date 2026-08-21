namespace BusanTP.IDAL
{
    public interface IDataManager
    {
        ICreate GetCreateManager();
        ISelect GetSelectManager();
        IDelete GetDeleteManager();
        IUpdate GetUpdateManager();

        bool BeginBatch();
        
        bool BatchCommit();
        
        bool BatchRollback();
        
        IDataManager Clone();
    }
}