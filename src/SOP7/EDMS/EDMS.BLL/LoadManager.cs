using System.Collections.Generic;

namespace EDMS.BLL
{
    using IDAL;
    using Model;
    using Response;

    public class LoadManager
    {
        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseFacilities GetFacilities()
        {
            string strErrorMessage;
            List<Facility> facilities = m_dataManager.GetSelectManager().SelectEdmsFacilities(null, null, out strErrorMessage);

            if (facilities == null)
                return new ResponseFacilities(false, strErrorMessage);

            List<FacilityCameraData> cameraDatas = m_dataManager.GetSelectManager().SelectEdmsFacilityCameraDatas(null, null, out strErrorMessage);

            if (cameraDatas == null)
                return new ResponseFacilities(false, strErrorMessage);

            Dictionary<int, FacilityEx> dicFacilities = new Dictionary<int, FacilityEx>();

            foreach (Facility facility in facilities)
            {
                dicFacilities[facility.ID] = new FacilityEx(facility);
            }

            foreach (FacilityCameraData cameraData in cameraDatas)
            {
                FacilityEx facility;

                if (dicFacilities.TryGetValue(cameraData.FacilityID, out facility))
                    facility.CameraData = cameraData;
            }

            ResponseFacilities response = new ResponseFacilities(true, "");
            response.Facilities.AddRange(dicFacilities.Values);
            return response;
        }
    }
}
