using System.Collections.Generic;

namespace EDMS.BLL.Response
{
    using Model;

    public class ResponseFacilities : MessageResult
    {
        public ResponseFacilities()
            : base()
        {
        }

        public ResponseFacilities(bool success, string message)
            : base(success, message)
        {
        }

        public List<FacilityEx> m_facilities = new List<FacilityEx>();

        public List<FacilityEx> Facilities
        {
            get { return m_facilities; }
            set { m_facilities = value; }
        }
    }

    public class FacilityEx : Facility
    {
        private FacilityCameraData m_cameraData = null;

        public FacilityCameraData CameraData
        {
            get { return m_cameraData; }
            set { m_cameraData = value; }
        }

        public FacilityEx()
        {
        }

        public FacilityEx(Facility facility)
        {
            this.ID = facility.ID;
            this.IsPoi = facility.IsPoi;
            this.LinkedPipe = facility.LinkedPipe;
            this.MaterialTypeID = facility.MaterialTypeID;
            this.ModelName = facility.ModelName;
            this.RunPipeBall = facility.RunPipeBall;
            this.SensorName = facility.SensorName;
            this.ShowPopup = facility.ShowPopup;
            this.ShowTreeView = facility.ShowTreeView;
            this.ZoneID = facility.ZoneID;
        }
    }
}
