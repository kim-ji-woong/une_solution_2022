using System.Collections.Generic;

namespace Nipa.BLL.Models.Request
{
    public class RequestResetPopup
    {
        private int m_nUserID = -1;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class RequestOptions
    {
        private int m_nCampusID = -1;
        private int m_nUserID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class UpdateSettings
    {
        private UpdateOptions m_updateOptions = null;
        private List<UpdateLinkedSOP> m_updateLinkedSOPList = new List<UpdateLinkedSOP>();

        public UpdateOptions UpdateOptions
        {
            get { return m_updateOptions; }
            set { m_updateOptions = value; }
        }

        public List<UpdateLinkedSOP> UpdateLinkedSOPList
        {
            get { return m_updateLinkedSOPList; }
            set { m_updateLinkedSOPList = value; }
        }
    }

    public class UpdateOptions
    {
        private int m_nUserID = -1;
        private int m_nCampusID = -1;
        private Option3DNormal m_option3DNormal = null;
        private Option3DSensor m_option3DSensor = null;
        private OptionSopNormal m_optionSopNormal = null;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }

        // 3D 관제 시스템 / 일반
        public Option3DNormal Option3DNormal
        {
            get { return m_option3DNormal; }
            set { m_option3DNormal = value; }
        }

        // 3D 관제 시스템 / 센서감지관리
        public Option3DSensor Option3DSensor
        {
            get { return m_option3DSensor; }
            set { m_option3DSensor = value; }
        }

        public OptionSopNormal OptionSopNormal
        {
            get { return m_optionSopNormal; }
            set { m_optionSopNormal = value; }
        }
    }

    public class RequestLinkedSOPList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestSOPList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class UpdateLinkedSOP
    {
        private int m_nCampusID = -1;
        private int m_nID = -1;
        private int m_nFacilityTypeID = -1;
        private int m_nDisasterCategoryID = -1;
        private int m_nSubDisasterCategoryID = -1;
        private string m_strDisasterName = "";
        private int? m_linkedBuildingGroupID = null;
        private int? m_linkedBuildingID = null;
        private int? m_linkedZoneID = null;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }
        public int FacilityTypeID
        {
            get { return m_nFacilityTypeID; }
            set { m_nFacilityTypeID = value; }
        }

        public int DisasterCategoryID
        {
            get { return m_nDisasterCategoryID; }
            set { m_nDisasterCategoryID = value; }
        }

        public int SubDisasterCategoryID
        {
            get { return m_nSubDisasterCategoryID; }
            set { m_nSubDisasterCategoryID = value; }
        }

        public string DisasterName
        {
            get { return m_strDisasterName; }
            set { m_strDisasterName = value; }
        }

        public int? LinkedBuildingGroupID
        {
            get { return m_linkedBuildingGroupID; }
            set { m_linkedBuildingGroupID = value; }
        }

        public int? LinkedBuildingID
        {
            get { return m_linkedBuildingID; }
            set { m_linkedBuildingID = value; }
        }

        public int? LinkedZoneID
        {
            get { return m_linkedZoneID; }
            set { m_linkedZoneID = value; }
        }
    }

    public class RemoveLinkedSOP
    {
        private int m_nCampusID = -1;
        private int m_nFacilityTypeID = -1;
        private int? m_linkedBuildingID = null;
        private int? m_linkedZoneID = null;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }

        public int FacilityTypeID
        {
            get { return m_nFacilityTypeID; }
            set { m_nFacilityTypeID = value; }
        }

        public int? LinkedBuildingID
        {
            get { return m_linkedBuildingID; }
            set { m_linkedBuildingID = value; }
        }

        public int? LinkedZoneID
        {
            get { return m_linkedZoneID; }
            set { m_linkedZoneID = value; }
        }
    }

    public class RequestSaveSetting
    {
        private string m_strPropertyName = "";
        private string m_strPropertyValue = "";
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
        public string PropertyName
        {
            get { return m_strPropertyName; }
            set { m_strPropertyName = value; }
        }
        public string PropertyValue
        {
            get { return m_strPropertyValue; }
            set { m_strPropertyValue = value; }
        }
    }
}
