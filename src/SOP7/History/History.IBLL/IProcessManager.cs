namespace History.IBLL
{
    using Models.Response;

    public interface IProcessManager
    {
        ResponseSOPComponentHistories DisplaySOPComponentHistories(int nActionStepHistoryID);
    }
}
