using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.BLL.Rollback
{
    public interface IRollbackData
    {
        bool Rollback(IDataManager dataManager);
    }
}
