namespace SDMS.BLL.Models.Data
{
    public interface IUpdateDataManager
    {
        object DataManager { get; set; }
        bool MakeUpdateData(object dataManager, string strTableName, string strFields, string strValues, string strCondition, out string strErrorMessage);
    }
}
