using System;
using System.Collections.Generic;
using GGH.Model;

namespace GGH.BLL
{
    using Models.Response;
    using IDAL;

    public class EvacuationManager
    {
        private IDataManager m_dataManager = null;

        public EvacuationManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseEvacuations GetEvacuations()
        {
            string strErrorMessage;
            List<Evacuation> evacuations = m_dataManager.GetSelectManager().SelectEvacuations(null, null, out strErrorMessage);

            if (evacuations == null)
                return new ResponseEvacuations(false, strErrorMessage);

            ResponseEvacuations response = new ResponseEvacuations(true, "");
            response.Evacuations.AddRange(evacuations);
            return response;
        }
    }
}
