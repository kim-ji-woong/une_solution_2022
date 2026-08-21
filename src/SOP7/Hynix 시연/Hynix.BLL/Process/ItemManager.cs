using System;
using System.Collections.Generic;
using Hynix.IDAL;
using Hynix.Model;

namespace Hynix.BLL.Process
{
    using Request;
    using Response;

    class ItemManager
    {
        private IDataManager m_dataManager = null;

        public ItemManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseWorkerInfo GetWorkerInfo(RequestWorkerInfo data)
        {
            string strErrorMessage;
            Worker worker = m_dataManager.GetSelectManager().SelectHynixWorker(data.WorkerID, out strErrorMessage);

            if (worker == null)
            {
                if (strErrorMessage != null && strErrorMessage.Length > 0)
                    return new ResponseWorkerInfo(false, strErrorMessage);
                else
                    return new ResponseWorkerInfo(false, "주어진 ID에 해당하는 작업자 정보를 찾을수 없습니다.");
            }

            ResponseWorkerInfo response = new ResponseWorkerInfo(true, "");
            response.Worker = worker;
            return response;
        }

        public ResponseItemInfo GetItemInfo(RequestItemInfo data)
        {
            string strErrorMessage;
            Item item = m_dataManager.GetSelectManager().SelectHynixItem(data.ItemID, out strErrorMessage);

            if (item == null)
            {
                if (strErrorMessage != null && strErrorMessage.Length > 0)
                    return new ResponseItemInfo(false, strErrorMessage);
                else
                    return new ResponseItemInfo(false, "주어진 ID에 해당하는 물품 정보를 찾을수 없습니다.");
            }

            ResponseItemInfo response = new ResponseItemInfo(true, "");
            response.Item = item;
            return response;
        }
    }
}
