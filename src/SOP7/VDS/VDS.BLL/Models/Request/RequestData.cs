using System.Collections.Generic;
using VDS.Model;
using VDS.Model.Account;
using VDS.Model.ItemData;

namespace VDS.BLL.Models.Request
{
    public class RequestData
    {
        private LoginData m_requestLogin = null;
        private RequestLoginKey m_requestLoginKey = null;
        private CheckLoginSession m_checkLoginSession = null;
        private bool? m_requestCountries = null;
        private RequestUserDataCenters m_requestDataCenters = null;
        private RequestRackNItems m_requestRackNItems = null;
        private RequestOption m_requestOption = null;
        private RequestSaveOption m_requestSaveOption = null;
        private bool? m_requestRackTypeList = null;
        private bool? m_requestItemTypeList = null;
        private bool? m_requestFacilityTypeList = null;
        private bool? m_requestSensorTypeList = null;
        private RequestSaveViewport m_requestSaveViewport = null;
        private RequestViewport m_requestViewport = null;
        private bool? m_requestAccountUserList = null;
        private RequestUpdateAccountUsers m_requestUpdateAccountUsers = null;
        private bool? m_requestRackNItemTypes = null;
        private UpdateEditData m_updateEditData = null;
        private RequestNewItem m_requestNewItem = null;
        private RequestNewRack m_requestNewRack = null;
        private RequestNewRacks m_requestNewRacks = null;
        private RequestItemDetails m_requestItemDetails = null;
        private RequesSavetItemDetails m_requesSavetItemDetails = null;
        private RequestSiteNDataCenters m_requestSiteNDataCenters = null;
        private RequestNewRackGroup m_requestNewRackGroup = null;
        private RequestAddDataCenter m_requestAddDataCenter = null;
        private RequestGetDataCenters m_requestGetDataCenters = null;
        private RequestSiteNNation m_requestSiteNNation = null;
        private RequestUpdateDataCenter m_requestUpdateDataCenter = null;
        private RequestGetDataCenter m_requestGetDataCenter = null;
        private RequestDeleteDataCenters m_requestDeleteDataCenters = null;
        private RequestDownloadITProperty m_requestDownloadITProperty = null;
        private RequestDownloadRack m_requestDownloadRack = null;
        private RequestAccountLevels m_requestAccountLevels = null;
        // 사용자 신규등록 화면에서 사용
        private RequestAccountLevels2 m_requestAccountLevels2 = null;
        private RequestSearchUserList m_requestSearchUserList = null;
        private RequestRemoveAccountUsers m_requestRemoveAccountUsers = null;
        private RequestUpdateAccountUsers2 m_requestUpdateAccountUsers2 = null;
        private RequestSiteDataCenters m_requestSiteDataCenters = null;
        private RequestValidUserID m_requestValidUserID = null;
        private RequestNewUser m_requestNewUser = null;
        private RequestUserInfo m_requestUserInfo = null;
        private RequestUpdateDataCenters m_requestUpdateDataCenters = null;
        private RequestSiteLicense m_requestSiteLicense = null;
        private RequestNewFacility m_requestNewFacility = null;
        private RequestNewSensor m_requestNewSensor = null;
        private EditTypeData m_editTypeData = null;
        private bool? m_requestEmptyItemDetails = null;
        private bool? m_requestSensorTypes = null;
        private RequestWorkData m_requestWorkData = null;
        private RequestCFDImages m_requestCFDImages = null;
        private bool? m_requestCompanyList = null;
        private int? m_requestSite = null;
        private RequestSiteWorkData m_requestSiteWorkData = null;
        private RequestSiteCompanies m_requestSiteCompanies = null;
        private RequestItem m_requestItem = null;
        private CheckValidItemName m_checkValidItemName = null;
        private RequestVdcStatistics m_requestVdcStatistics = null;

        public LoginData RequestLogin
        {
            get { return m_requestLogin; }
            set { m_requestLogin = value; }
        }

        public RequestLoginKey RequestLoginKey
        {
            get { return m_requestLoginKey; }
            set { m_requestLoginKey = value; }
        }

        public CheckLoginSession CheckLoginSession
        {
            get { return m_checkLoginSession; }
            set { m_checkLoginSession = value; }
        }

        public bool? RequestCountries
        {
            get { return m_requestCountries; }
            set { m_requestCountries = value; }
        }

        public RequestUserDataCenters RequestDataCenters
        {
            get { return m_requestDataCenters; }
            set { m_requestDataCenters = value; }
        }

        public RequestRackNItems RequestRackNItems
        {
            get { return m_requestRackNItems; }
            set { m_requestRackNItems = value; }
        }

        public RequestOption RequestOption
        {
            get { return m_requestOption; }
            set { m_requestOption = value; }
        }

        public RequestSaveOption RequestSaveOption
        {
            get { return m_requestSaveOption; }
            set { m_requestSaveOption = value; }
        }

        public bool? RequestRackTypeList
        {
            get { return m_requestRackTypeList; }
            set { m_requestRackTypeList = value; }
        }

        public bool? RequestItemTypeList
        {
            get { return m_requestItemTypeList; }
            set { m_requestItemTypeList = value; }
        }

        public bool? RequestFacilityTypeList
        {
            get { return m_requestFacilityTypeList; }
            set { m_requestFacilityTypeList = value; }
        }

        public bool? RequestSensorTypeList
        {
            get { return m_requestSensorTypeList; }
            set { m_requestSensorTypeList = value; }
        }

        public RequestSaveViewport RequestSaveViewport
        {
            get { return m_requestSaveViewport; }
            set { m_requestSaveViewport = value; }
        }

        public RequestViewport RequestViewport
        {
            get { return m_requestViewport; }
            set { m_requestViewport = value; }
        }

        public bool? RequestAccountUserList
        {
            get { return m_requestAccountUserList; }
            set { m_requestAccountUserList = value; }
        }

        public RequestUpdateAccountUsers RequestUpdateAccountUsers
        {
            get { return m_requestUpdateAccountUsers; }
            set { m_requestUpdateAccountUsers = value; }
        }

        public bool? RequestRackNItemTypes
        {
            get { return m_requestRackNItemTypes; }
            set { m_requestRackNItemTypes = value; }
        }

        public UpdateEditData RequestUpdateEditData
        {
            get { return m_updateEditData; }
            set { m_updateEditData = value; }
        }

        public RequestNewItem RequestNewItem
        {
            get { return m_requestNewItem; }
            set { m_requestNewItem = value; }
        }

        public RequestNewRack RequestNewRack
        {
            get { return m_requestNewRack; }
            set { m_requestNewRack = value; }
        }

        public RequestNewRacks RequestNewRacks
        {
            get { return m_requestNewRacks; }
            set { m_requestNewRacks = value; }
        }

        public RequestItemDetails RequestItemDetails
        {
            get { return m_requestItemDetails; }
            set { m_requestItemDetails = value; }
        }

        public RequesSavetItemDetails RequesSavetItemDetails
        {
            get { return m_requesSavetItemDetails; }
            set { m_requesSavetItemDetails = value; }
        }

        public RequestSiteNDataCenters RequestSiteNDataCenters
        {
            get { return m_requestSiteNDataCenters; }
            set { m_requestSiteNDataCenters = value; }
        }

        public RequestNewRackGroup RequestNewRackGroup
        {
            get { return m_requestNewRackGroup; }
            set { m_requestNewRackGroup = value; }
        }

        public RequestAddDataCenter RequestAddDataCenter
        {
            get { return m_requestAddDataCenter; }
            set { m_requestAddDataCenter = value; }
        }

        public RequestGetDataCenters RequestGetDataCenters
        {
            get { return m_requestGetDataCenters; }
            set { m_requestGetDataCenters = value; }
        }

        public RequestSiteNNation RequestSiteNNation
        {
            get { return m_requestSiteNNation; }
            set { m_requestSiteNNation = value; }
        }

        public RequestUpdateDataCenter RequestUpdateDataCenter
        {
            get { return m_requestUpdateDataCenter; }
            set { m_requestUpdateDataCenter = value; }
        }

        public RequestGetDataCenter RequestGetDataCenter
        {
            get { return m_requestGetDataCenter; }
            set { m_requestGetDataCenter = value; }
        }

        public RequestDeleteDataCenters RequestDeleteDataCenters
        {
            get { return m_requestDeleteDataCenters; }
            set { m_requestDeleteDataCenters = value; }
        }

        public RequestDownloadITProperty RequestDownloadITProperty
        {
            get { return m_requestDownloadITProperty; }
            set { m_requestDownloadITProperty = value; }
        }

        public RequestDownloadRack RequestDownloadRack
        {
            get { return m_requestDownloadRack; }
            set { m_requestDownloadRack = value; }
        }

        public RequestAccountLevels RequestAccountLevels
        {
            get { return m_requestAccountLevels; }
            set { m_requestAccountLevels = value; }
        }

        public RequestAccountLevels2 RequestAccountLevels2
        {
            get { return m_requestAccountLevels2; }
            set { m_requestAccountLevels2 = value; }
        }

        public RequestSearchUserList RequestSearchUserList
        {
            get { return m_requestSearchUserList; }
            set { m_requestSearchUserList = value; }
        }

        public RequestRemoveAccountUsers RequestRemoveAccountUsers
        {
            get { return m_requestRemoveAccountUsers; }
            set { m_requestRemoveAccountUsers = value; }
        }

        public RequestUpdateAccountUsers2 RequestUpdateAccountUsers2
        {
            get { return m_requestUpdateAccountUsers2; }
            set { m_requestUpdateAccountUsers2 = value; }
        }

        public RequestSiteDataCenters RequestSiteDataCenters
        {
            get { return m_requestSiteDataCenters; }
            set { m_requestSiteDataCenters = value; }
        }

        public RequestValidUserID RequestValidUserID
        {
            get { return m_requestValidUserID; }
            set { m_requestValidUserID = value; }
        }

        public RequestNewUser RequestNewUser
        {
            get { return m_requestNewUser; }
            set { m_requestNewUser = value; }
        }

        public RequestUserInfo RequestUserInfo
        {
            get { return m_requestUserInfo; }
            set { m_requestUserInfo = value; }
        }

        public RequestUpdateDataCenters RequestUpdateDataCenters
        {
            get { return m_requestUpdateDataCenters; }
            set { m_requestUpdateDataCenters = value; }
        }

        public RequestSiteLicense RequestSiteLicense
        {
            get { return m_requestSiteLicense; }
            set { m_requestSiteLicense = value; }
        }

        public RequestNewFacility RequestNewFacility
        {
            get { return m_requestNewFacility; }
            set { m_requestNewFacility = value; }
        }

        public RequestNewSensor RequestNewSensor
        {
            get { return m_requestNewSensor; }
            set { m_requestNewSensor = value; }
        }

        public EditTypeData EditTypeData
        {
            get { return m_editTypeData; }
            set { m_editTypeData = value; }
        }

        public bool? RequestEmptyItemDetails
        {
            get { return m_requestEmptyItemDetails; }
            set { m_requestEmptyItemDetails = value; }
        }

        public bool? RequestSensorTypes
        {
            get { return m_requestSensorTypes; }
            set { m_requestSensorTypes = value; }
        }

        public RequestWorkData RequestWorkData
        {
            get { return m_requestWorkData; }
            set { m_requestWorkData = value; }
        }

        public RequestCFDImages RequestCFDImages
        {
            get { return m_requestCFDImages; }
            set { m_requestCFDImages = value; }
        }

        public bool? RequestCompanyList
        {
            get { return m_requestCompanyList; }
            set { m_requestCompanyList = value; }
        }

        public int? RequestSite
        {
            get { return m_requestSite; }
            set { m_requestSite = value; }
        }

        public RequestSiteWorkData RequestSiteWorkData
        {
            get { return m_requestSiteWorkData; }
            set { m_requestSiteWorkData = value; }
        }

        public RequestSiteCompanies RequestSiteCompanies
        {
            get { return m_requestSiteCompanies; }
            set { m_requestSiteCompanies = value; }
        }

        public RequestItem RequestItem
        {
            get { return m_requestItem; }
            set { m_requestItem = value; }
        }

        public CheckValidItemName CheckValidItemName
        {
            get { return m_checkValidItemName; }
            set { m_checkValidItemName = value; }
        }

        public RequestVdcStatistics RequestVdcStatistics
        {
            get { return m_requestVdcStatistics; }
            set { m_requestVdcStatistics = value; }
        }
    }

    public class LoginData
    {
        private string m_strValue = "";
        private string m_strKey = "";
        
        public string Value
        {
            get { return m_strValue; }
            set { m_strValue = value; }
        }

        public string Key
        {
            get { return m_strKey; }
            set { m_strKey = value; }
        }
    }

    public class RequestLoginKey
    {
        private long? num = null;
        private string m_strUserID = null;
        
        public long? Num
        {
            get { return num; }
            set { num = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }
    }

    public class CheckLoginSession
    {
        private int m_nUserID = -1;
        private string m_strSessionKey = "";


        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public string SessionKey
        {
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }
    }

    public class RequestOption
    {
        private int m_nUserID = -1;
        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        private string m_strCategory = "";
        public string Category
        {
            get { return m_strCategory; }
            set { m_strCategory = value; }
        }
    }

    public class RequestSaveOption
    {
        private Option m_saveOption = null;
        public Option SaveOption
        {
            get { return m_saveOption; }
            set { m_saveOption = value; }
        }
    }

    public class RequestSaveViewport
    {
        private int m_nDataCenterID = -1;
        private float m_fPosX = 0;
        private float m_fPosY = 0;
        private float m_fPosZ = 0;
        private float m_fRotationX = 0;
        private float m_fRotationY = 0;
        private float m_fRotationZ = 0;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public float PositionX
        {
            get { return m_fPosX; }
            set { m_fPosX = value; }
        }

        public float PositionY
        {
            get { return m_fPosY; }
            set { m_fPosY = value; }
        }

        public float PositionZ
        {
            get { return m_fPosZ; }
            set { m_fPosZ = value; }
        }

        public float RotationX
        {
            get { return m_fRotationX; }
            set { m_fRotationX = value; }
        }

        public float RotationY
        {
            get { return m_fRotationY; }
            set { m_fRotationY = value; }
        }

        public float RotationZ
        {
            get { return m_fRotationZ; }
            set { m_fRotationZ = value; }
        }
    }

    public class RequestViewport
    {
        private int m_nDataCenterID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }
    }

    public class RequestUpdateAccountUsers
    {
        private List<AccountUserData> m_userDatas = new List<AccountUserData>();

        public List<AccountUserData> UserDatas
        {
            get { return m_userDatas; }
            set { m_userDatas = value; }
        }
    }

    public class AccountUserData
    {
        private int? m_id = null;
        private string m_strUserID = "";
        private int m_nLevelID = -1;
        private string m_strNickName = "";
        private string m_strPassword = null;

        public int? Id
        {
            get { return m_id; }
            set { m_id = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public int LevelID
        {
            get { return m_nLevelID; }
            set { m_nLevelID = value; }
        }

        public string NickName
        {
            get { return m_strNickName; }
            set { m_strNickName = value; }
        }

        public string Password
        {
            get { return m_strPassword; }
            set { m_strPassword = value; }
        }
    }

    public class RequestItemDetails
    {
        public enum ItemTypeID { Server = 1, Box, Network, SanSwitch, Security, BackUp, Storage, Etc }

        private int m_nDataCenterID = -1;
        private int? m_nItemType = null;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int? ItemType 
        {
            get { return m_nItemType; }
            set { m_nItemType = value; }
        }
    }

    public class RequesSavetItemDetails
    {
        public enum ItemTypeID { Server = 1, Box, Network, SanSwitch, Security, BackUp, Storage, Etc }

        private int m_nDataCenterID = -1;
        private int m_nItemType = -1;
        private List<Backup> m_backups = new List<Backup>();
        private List<Box> m_boxs = new List<Box>();
        private List<Etc> m_etcs = new List<Etc>();
        private List<Network> m_networks = new List<Network>();
        private List<SanSwitch> m_sanSwitches = new List<SanSwitch>();
        private List<Security> m_securities = new List<Security>();
        private List<Storage> m_storages = new List<Storage>();
        private List<ItemServer> m_itemServers = new List<ItemServer>();
        private List<Item> m_items = new List<Item>();

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int ItemType
        {
            get { return m_nItemType; }
            set { m_nItemType = value; }
        }

        public List<Backup> Backups
        {
            get { return m_backups; }
            set { m_backups = value; }
        }
        public List<Box> Boxs
        {
            get { return m_boxs; }
            set { m_boxs = value; }
        }
        public List<Etc> Etcs
        {
            get { return m_etcs; }
            set { m_etcs = value; }
        }
        public List<Network> Networks
        {
            get { return m_networks; }
            set { m_networks = value; }
        }
        public List<SanSwitch> SanSwitchs
        {
            get { return m_sanSwitches; }
            set { m_sanSwitches = value; }
        }
        public List<Security> Securitys
        {
            get { return m_securities; }
            set { m_securities = value; }
        }
        public List<Storage> Storages
        {
            get { return m_storages; }
            set { m_storages = value; }
        }
        public List<ItemServer> ItemServers
        {
            get { return m_itemServers; }
            set { m_itemServers = value; }
        }
        public List<Item> Items
        {
            get { return m_items; }
            set { m_items = value; }
        }
    }

    public class RequestSiteNNation
    {
        private int m_nSiteID = -1;
        private int m_nNationID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public int NationID
        {
            get { return m_nNationID; }
            set { m_nNationID = value; }
        }
    }

    public class RequestSearchUserList
    {
        private int? m_nSiteID = null;
        private int m_nUserID = -1;
        private int? m_nLevelID = null;

        public int? SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public int? LevelID
        {
            get { return m_nLevelID; }
            set { m_nLevelID = value; }
        }
    }
}
