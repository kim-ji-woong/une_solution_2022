namespace SOP.IBLL
{
    public interface ISopManager
    {
        bool GetLinkedSOP(int facilityType, out string strDisasterCategoryName, out string strSubDisasterCategory, out string strDisasterName, out string strErrorMessage);
    }
}
