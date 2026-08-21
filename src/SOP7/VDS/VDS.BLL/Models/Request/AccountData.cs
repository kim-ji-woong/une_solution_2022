using System.Collections.Generic;

namespace VDS.BLL.Models.Request
{
    public class RequestRemoveAccountUsers
    {
        private List<int> m_userIDs = new List<int>();

        public List<int> UserIDs
        {
            get { return m_userIDs; }
            set { m_userIDs = value; }
        }
    }

    public class RequestUpdateAccountUsers2
    {
        private List<UpdateUserData> m_updateUserDatas = new List<UpdateUserData>();

        public List<UpdateUserData> UpdateUserDatas
        {
            get { return m_updateUserDatas; }
            set { m_updateUserDatas = value; }
        }
    }

    public class UpdateUserData
    {
        private int m_nUserID = -1;
        private bool? m_activate = null;
        private string m_strMemo = null;
        private List<int> m_dataCenterIDs = new List<int>();

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public bool? Activate
        {
            get { return m_activate; }
            set { m_activate = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        public List<int> DataCenterIDs
        {
            get { return m_dataCenterIDs; }
            set { m_dataCenterIDs = value; }
        }
    }

    public class RequestValidUserID
    {
        private string m_strUserID = "";

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }
    }

    public class RequestNewUser
    {
        private int m_nSiteID = -1;
        private int m_nLevelID = -1;
        private string m_strUserID = null;
        private string m_strCompanyName = null;
        private string m_strNickName = null;
        private string m_strPassword = null;
        private List<int> m_dataCenterIDs = null;
        private string m_strMemo = null;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public int LevelID
        {
            get { return m_nLevelID; }
            set { m_nLevelID = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public string CompanyName
        {
            get { return m_strCompanyName; }
            set { m_strCompanyName = value; }
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

        public List<int> DataCenterIDs
        {
            get { return m_dataCenterIDs; }
            set { m_dataCenterIDs = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }

    public class RequestUserInfo
    {
        private int m_nUserID = -1;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class RequestAccountLevels
    {
        private int? m_nUserID = null;

        public int? UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    // 사용자 신규등록에서 사용할 계정목록
    public class RequestAccountLevels2
    {
        private int m_nUserID = -1;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class RequestSiteLicense
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }
}
