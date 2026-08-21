using System;
using System.Net;
using System.Text;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using TeamEditor.Model.Sop.Team;

namespace AgentService
{
    public class LocationManager
    {
        private string m_strURL = "";
        private int m_nMemberCount = 0;
        private CoordConverter m_coordConverter = null;

        public LocationManager(string strURL, int nMemberCount, Common.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager)
        {
            m_strURL = strURL;
            m_nMemberCount = nMemberCount;
            SetCoordConverter(dataManager, sdmsDataManager);
        }

        public bool ReadData(TeamEditor.IDAL.IDataManager dataManager, out string strErrorMessage)
        {
            JObject json = new JObject();
            json.Add("sector_id", 3);
            json.Add("building_id", 2);
            json.Add("user_number", m_nMemberCount);

            string strJson = json.ToString();

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(m_strURL));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = strJson.Length + 3;

            strErrorMessage = null;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                JObject jsonResult = JObject.Parse(strResult);

                JToken tokenMessage = jsonResult["message"];
                string strMessage = tokenMessage.ToString();

                if (strMessage != "done")
                {
                    strErrorMessage = strMessage;
                    return false;
                }

                Logger.Instance.Write(jsonResult.ToString());

                JToken tokenLocations = jsonResult["userLocations"];

                foreach (JToken userLocation in tokenLocations)
                {
                    string strUserID = userLocation["user_id"].ToString().ToLower();
                    string strLevelID = userLocation["level_id"].ToString();
                    string strX = userLocation["x"].ToString();
                    string strY = userLocation["y"].ToString();

                    int nLevelID;

                    if (int.TryParse(strLevelID.Trim(), out nLevelID))
                    {
                        int x, y;

                        if (int.TryParse(strX.Trim(), out x) && int.TryParse(strY.Trim(), out y))
                        {
                            double _x, _y;
                            int nZoneID;

                            if (m_coordConverter.ConvertCoord(nLevelID, x, y, out _x, out _y, out nZoneID))
                            {
                                if (UpdateUserLocation(dataManager, strUserID, nZoneID, _x, _y, out strErrorMessage) == false)
                                    return false;
                            }
                        }
                    }
                }
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        private bool UpdateUserLocation(TeamEditor.IDAL.IDataManager dataManager, string strUserID, int nZoneID, double x, double y, out string strErrorMessage)
        {
            Dictionary<RegularMember.Fields, object> dicConditions = new Dictionary<RegularMember.Fields, object>();
            Dictionary<RegularMember.Fields, object> dicSets = new Dictionary<RegularMember.Fields, object>();

            dicConditions[RegularMember.Fields.MemberID] = strUserID;
            dicSets[RegularMember.Fields.Email] = string.Format("{0}, {1}, {2}", nZoneID, x, y);

            return dataManager.GetUpdateManager().UpdateRegularMember(dicSets, dicConditions, out strErrorMessage);
        }

        private void SetCoordConverter(Common.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager)
        {
            m_coordConverter = new CoordConverter();

            string strErrorMessage;
            
            if (m_coordConverter.ReadZoneImageCoord(dataManager, sdmsDataManager, out strErrorMessage) == false)
            {
                /*Logger.Instance.Write("SetCoordConverter Fail : " + strErrorMessage);
                System.Diagnostics.Trace.WriteLine("SetCoordConverter Fail : " + strErrorMessage);*/
                return;
            }
        }
    }
}
