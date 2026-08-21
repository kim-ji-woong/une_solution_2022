using Airbase20.DAL;
using Airbase20.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace powerDataServer.Data
{
    public class DBDataManager
    {
        public static bool UpdateSwitchDetails(DataManager dataManager, Dictionary<int, SwitchDetail> SwitchDetails, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (SwitchDetails == null && SwitchDetails.Count == 0)
            {
                strErrorMessage = "1. UpdateSwitchDetails Error (SwitchDetails 데이터가 존재하지 않습니다.)";
                return false;
            }

            foreach (KeyValuePair<int, SwitchDetail> pair in SwitchDetails)
            {
                SwitchDetail switchDetail = pair.Value;

                if (dataManager.GetUpdateManager().UpdateSwitchDetail(switchDetail, out strErrorMessage) == false)
                {
                    strErrorMessage = "2. UpdateSwitchDetails Error (" + strErrorMessage + ")";
                    return false;
                }
            }

            return true;
        }

        public static bool UpdateRelay(DataManager dataManager, Relay relay, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (relay == null)
            {
                strErrorMessage = "1. UpdateRelay Error (Relay 데이터가 존재하지 않습니다.)";
                return false;
            }

            if (dataManager.GetUpdateManager().UpdateRelay(relay, out strErrorMessage) == false)
            {
                strErrorMessage = "2. UpdateRelay Error (" + strErrorMessage + ")";
                return false;
            }

            return true;
        }
    }
}
