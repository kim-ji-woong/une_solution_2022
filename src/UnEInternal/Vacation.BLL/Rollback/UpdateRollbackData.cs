using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.BLL.Rollback
{
    using Model;

    public class UpdateRollbackData : IRollbackData
    {
        private List<Response> m_updateResponses = new List<Response>();
        private List<Request> m_updateRequests = new List<Request>();
        private List<History> m_updateHistories = new List<History>();

        public void AddUpdateResponse(Response response)
        {
            m_updateResponses.Add(response);
        }

        public void AddUpdateRequest(Request request)
        {
            m_updateRequests.Add(request);
        }

        public void AddUpdateHistory(History history)
        {
            m_updateHistories.Add(history);
        }

        public bool Rollback(IDataManager dataManager)
        {
            string strErrorMessage;

            foreach (Response response in m_updateResponses)
            {
                if (dataManager.GetUpdate().Update<Response>(response, null, out strErrorMessage) == false)
                    return false;
            }

            foreach (Request request in m_updateRequests)
            {
                if (dataManager.GetUpdate().Update<Request>(request, null, out strErrorMessage) == false)
                    return false;
            }

            foreach (History history in m_updateHistories)
            {
                if (dataManager.GetUpdate().Update<History>(history, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }
    }
}
