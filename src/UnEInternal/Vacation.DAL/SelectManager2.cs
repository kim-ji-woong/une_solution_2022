using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.DAL
{
    using Model;

    public class SelectManager2 : SelectManager
    {
        public SelectManager2(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public int GetMinimumHistoryYear(List<int> memberIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (memberIDs.Count == 0)
                return 0;

            string strIDs = "";

            foreach (int memberID in memberIDs)
            {
                if (strIDs.Length == 0)
                    strIDs = memberID.ToString();
                else
                    strIDs += ", " + memberID.ToString();
            }

            History history = new History();

            string strSQL = string.Format("Select min({2}) year from {0} where MemberID in ({1})", history.GetTableName(), strIDs, History.Fields.Year);

            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return 0;

            foreach (var item in result)
            {
                if (item.year is int)
                    return item.year;
            }

            return 0;
        }

        public int SelectAdminLength(int teamID, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strSQL = string.Format("Select Count(*) as cnt From {0} Where {1} = 1 And {2} <> {0}", 
                CompanyMember.TableName,
                CompanyMember.Fields.IsAdmin,
                CompanyMember.Fields.TeamID,
                teamID);
            //string strQuery = string.Format("Select Count(*) as cnt From CompanyMember Where IsAdmin = 1 And TeamID <> {0}", teamID);

            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return 0;

            foreach (var item in result)
            {
                if (item.cnt is int)
                    return item.cnt;
            }

            return 0;
        }
    }
}