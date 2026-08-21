using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json.Linq;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.Servers.ParkingGate.RS
{
    using ViewModels.ParkingGate.RS;

    class WebServiceManager
    {
        private string m_strUrl = "";
        private Dictionary<string, ParkingGate> m_dicParkingGates = null;
        private Dictionary<int, ParkingGate> m_dicParkingGates2 = null;
        private int m_nSiteID = -1;

        public WebServiceManager(string baseUrl, IDataManager dataManager, int siteID)
        {
            m_strUrl = baseUrl + "/api/v2/machines/gate/all";
            m_nSiteID = siteID;
            m_dicParkingGates = ReadDB(dataManager);
            SetParkingGates(m_dicParkingGates);
        }

        private void SetParkingGates(Dictionary<string, ParkingGate> dicParkingGates)
        {
            m_dicParkingGates2 = new Dictionary<int, ParkingGate>();

            foreach (KeyValuePair<string, ParkingGate> pair in dicParkingGates)
            {
                m_dicParkingGates2[pair.Value.ID] = pair.Value;
            }
        }

        private Dictionary<string, ParkingGate> ReadDB(IDataManager dataManager)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", ParkingGate.Fields.SiteID, m_nSiteID);
            IEnumerable<ParkingGate> parkingGates = dataManager.GetSelect().Select<ParkingGate>(strCondition, out strErrorMessage);

            if (parkingGates == null)
            {
                System.Diagnostics.Trace.WriteLine("Read ParkingGate Error : " + strErrorMessage);
                return null;
            }

            Dictionary<string, ParkingGate> dicParkingGates = new Dictionary<string, ParkingGate>();

            foreach (ParkingGate gate in parkingGates)
            {
                dicParkingGates[gate.Name] = gate;
            }

            return dicParkingGates;
        }

        public void UpdateParkingGateStatus(int id, int status)
        {
            ParkingGate gate;

            if (m_dicParkingGates2.TryGetValue(id, out gate))
                gate.Status = status;
        }

        // Return 값 :
        //             Key : ParkingGate ID
        //             Value : Status
        public Dictionary<int, int> ReadParkingGates()
        {
            if (m_dicParkingGates == null)
                return null;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(m_strUrl));
            request.Method = "GET";

            string strResult = "";

            try
            {
                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                if (strResult == null)
                    return null;

                JObject jsonResult = JObject.Parse(strResult);

                if (jsonResult == null)
                    return null;

                JToken tokenResult = jsonResult["result"];

                int? code = (int?)tokenResult["code"];
                string message = (string)tokenResult["message"];

                if (code == null)
                    return null;

                if (((int)code).ToString().StartsWith("200") == false)
                {
                    if (message != null)
                        System.Diagnostics.Trace.WriteLine("Read " + m_strUrl + " Error : " + message);

                    return null;
                }

                JToken tokenData = jsonResult["data"];

                if (tokenData != null)
                {
                    // Key : ParkingGate ID
                    // Value : status
                    Dictionary<int, int> dicGateStatus = new Dictionary<int, int>();
                    //List<ParkingGate> parkingGates = new List<ParkingGate>();
                    JArray gates = (JArray)tokenData["gates"];

                    if (gates != null)
                    {
                        foreach (var gate in gates)
                        {
                            string strMachineCode = (string)gate["machineCode"];
                            string strStatus = (string)gate["gateStatus"];

                            if (strMachineCode == null || strStatus == null)
                                continue;

                            ParkingGate parkingGate;

                            if (m_dicParkingGates.TryGetValue(strMachineCode.Trim(), out parkingGate))
                            {
                                int status = ToStatus(strStatus.Trim().ToLower());

                                if (parkingGate.Status != status)
                                {
                                    // 바뀐것만 DB에 업데이트 한다.
                                    dicGateStatus[parkingGate.ID] = status;
                                }

                                /*parkingGate.Status = ToStatus(strStatus.Trim().ToLower());
                                parkingGates.Add(parkingGate);*/
                            }
                        }
                    }

                    return dicGateStatus;
                    //return parkingGates;
                }
            }
            catch (System.Net.WebException ex)
            {
                System.Diagnostics.Trace.WriteLine("ReadParkingGates Error : " + ex.Message);
            }

            return null;
        }

        private static int ToStatus(string strStatus)
        {
            if (strStatus == "uplock")
                return (int)ParkingGate.GateStatus.Opened;
            else if (strStatus == "up")
                return (int)ParkingGate.GateStatus.Opened;
            else if (strStatus == "down")
                return (int)ParkingGate.GateStatus.Closed;

            return (int)ParkingGate.GateStatus.NetworkError;
        }
    }
}
