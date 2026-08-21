//using dnsDapperDBUtil;
//using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Configuration;
using System.Collections.Generic;
using System.Drawing;

namespace UnEcctv
{
    using Data;

    class DBManager
    {
        /*private DataManager m_dataManager = null;

        public void ReadConfig()
        {
            string strDBName = ConfigurationManager.AppSettings.Get("Name");
            string strDBInfo = ConfigurationManager.AppSettings.Get("Info");

            if (strDBName == null || strDBName.Trim().Length == 0 ||
                strDBInfo == null || strDBInfo.Trim().Length == 0)
                return;

            string strInfo = AES256Cipher.AES_decrypt(strDBInfo);

            int index1 = strInfo.IndexOf('-');

            if (index1 > 0)
            {
                int index2 = strInfo.IndexOf('-', index1 + 1);

                string strIP = strInfo.Substring(0, index1).Trim();
                string strID = strInfo.Substring(index1 + 1, index2 - index1 - 1).Trim();
                string strPW = strInfo.Substring(index2 + 1).Trim();

                m_dataManager = new DataManager(0, strIP, strDBName, strID, strPW);
            }
        }

        public CCTVStatus RunCommand(string strCommand, List<CCTVData> cctvDatas, out Point? ptLocation)
        {
            ptLocation = null;

            if (strCommand == null || m_dataManager == null)
                return null;

            strCommand = strCommand.Trim();

            if (strCommand.Length == 0)
                return null;

            List<int> cctvIDs = new List<int>();
            string[] tokens = strCommand.Split('/');
            int len = tokens.Length;

            if (len < 5)
                return null;

            CCTVStatus status = new CCTVStatus();

            status.Guid = tokens[0].Trim();

            int userID, sensorZoneHistoryID;

            if (int.TryParse(tokens[1].Trim(), out userID))
                status.UserID = userID;
            else
                return null;

            status.Title = tokens[2].Trim();

            if (int.TryParse(tokens[3].Trim(), out sensorZoneHistoryID))
                status.SensorZoneHistoryID = sensorZoneHistoryID;
            else
                status.SensorZoneHistoryID = null;

            string strLocation = tokens[4].Trim();
            int index = strLocation.IndexOf(',');

            if (index > 0)
            {
                string strX = strLocation.Substring(0, index).Trim();
                string strY = strLocation.Substring(index + 1).Trim();

                int x, y;

                if (int.TryParse(strX, out x) && int.TryParse(strY, out y))
                {
                    ptLocation = new Point(x, y);
                }
            }

            for (int i=5;i<len;i++)
            {
                string strToken = tokens[i].Trim();
                int cctvID;

                if (int.TryParse(strToken, out cctvID))
                {
                    cctvIDs.Add(cctvID);
                    SetCCTV(status, cctvID, cctvIDs.Count);
                }
            }

            if (cctvIDs.Count > 0)
            {
                string strErrorMessage;
                string strCondition = string.Format("{0} in ({1})", CCTV.Fields.ID, string.Join(',', cctvIDs.ToArray()));
                IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);

                if (cctvs == null)
                {
                    System.Diagnostics.Trace.WriteLine("Read CCTV Error : " + strErrorMessage);
                    return null;
                }

                foreach (CCTV cctv in cctvs)
                {
                    cctvDatas.Add(ToCCTVData(cctv));
                }

                status.Visible = ptLocation != null;
                return status;
            }

            return null;
        }

        private CCTVData ToCCTVData(CCTV cctv)
        {
            CCTVData data = new CCTVData();

            data.ID = cctv.ID;
            data.Title = cctv.CameraName;
            data.Url = cctv.URL;

            return data;
        }

        private void SetCCTV(CCTVStatus status, int cctvID, int index)
        {
            if (index == 1)
                status.CCTV1 = cctvID;
            else if (index == 2)
                status.CCTV2 = cctvID;
            else if (index == 3)
                status.CCTV3 = cctvID;
            else if (index == 4)
                status.CCTV4 = cctvID;
        }

        public bool CreateStatus(CCTVStatus status, out string strErrorMessage)
        {
            status.HeartBeat = DateTime.Now;

            if (m_dataManager.GetCreate().Insert<CCTVStatus>(status, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("CCTVStatus Insert Error : " + strErrorMessage);
                return false;
            }

            return true;
        }

        public bool UpdateStatus(CCTVStatus status)
        {
            string strErrorMessage;

            status.HeartBeat = DateTime.Now;

            if (m_dataManager.GetUpdate().Update<CCTVStatus>(status, null, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("CCTVStatus Update Error : " + strErrorMessage);
                return false;
            }

            return true;
        }

        public bool DeleteStatus(CCTVStatus status)
        {
            string strErrorMessage;

            status.HeartBeat = DateTime.Now;

            if (m_dataManager.GetDelete().Delete<CCTVStatus>(status, null, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("CCTVStatus Delete Error : " + strErrorMessage);
                return false;
            }

            return true;
        }

        public CCTVStatus ReadStatus(string guid)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", CCTVStatus.Fields.Guid, guid);
            return m_dataManager.GetSelect().SelectFirst<CCTVStatus>(strCondition, out strErrorMessage);
        }

        public Dictionary<int, CCTVData> ReadCCTVs(List<int> cctvIDs)
        {
            if (cctvIDs.Count == 0)
                return new Dictionary<int, CCTVData>();

            string strErrorMessage;
            string strConditions = string.Format("{0} in ({1})", CCTV.Fields.ID, string.Join(',', cctvIDs.ToArray()));
            IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(strConditions, out strErrorMessage);

            if (cctvs == null)
            {
                System.Diagnostics.Trace.WriteLine("Read CCTV Error : " + strErrorMessage);
                return new Dictionary<int, CCTVData>();
            }

            Dictionary<int, CCTVData> dicCCTVDatas = new Dictionary<int, CCTVData>();

            foreach (CCTV cctv in cctvs)
            {
                dicCCTVDatas[cctv.ID] = ToCCTVData(cctv);
            }

            return dicCCTVDatas;
        }*/
    }
}
