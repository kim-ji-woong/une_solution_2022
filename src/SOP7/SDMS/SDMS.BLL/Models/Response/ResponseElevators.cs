using SDMS.Model.Facility;
using System.Collections.Generic;

namespace SDMS.BLL.Models.Response
{
    public class ResponseElevators : MessageResult
    {
        private List<ElevatorData> m_elevators = new List<ElevatorData>();

        public List<ElevatorData> Elevators
        {
            get { return m_elevators; }
        }

        public ResponseElevators()
            : base()
        {
        }

        public ResponseElevators(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }

    public class ElevatorData
    {
        private string m_strName = "";
        private bool m_isNormal = true;
        private bool m_isOpened = false;
        private bool? m_up = null;
        private int m_nFloorIndex = 0;
        private int m_nSiteID = 0;

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public bool IsNormal
        {
            get { return m_isNormal; }
            set { m_isNormal = value; }
        }

        public bool IsOpened
        {
            get { return m_isOpened; }
            set { m_isOpened = value; }
        }

        public bool? Up
        {
            get { return m_up; }
            set { m_up = value; }
        }

        public int FloorIndex
        {
            get { return m_nFloorIndex; }
            set { m_nFloorIndex = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }
}
