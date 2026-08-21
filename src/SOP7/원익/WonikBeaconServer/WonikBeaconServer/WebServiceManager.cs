using dnsData.Sensor;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace WonikBeaconServer
{
    public class WebServiceManager
    {
        private string Token = "";
        private string UUID = "";
        private string BaseAddress = "";

        ProcessManager m_processManager = null;

        private Dictionary<string, int> m_dicCampusIDs = new Dictionary<string, int>();
        private Dictionary<string, int> m_dicBuildingIDs = new Dictionary<string, int>();
        private Dictionary<string, int> m_dicFloorIDs = new Dictionary<string, int>();
        private Dictionary<string, GeofenceData> m_dicGeofenceIDs = new Dictionary<string, GeofenceData>();

        public WebServiceManager(ProcessManager processManager)
        {
            m_processManager = processManager;

            Init();
        }

        private void Init()
        {
            this.Token = Startup.ConfigManager.Beacon.Token;
            this.UUID = Startup.ConfigManager.Beacon.UUID;
            this.BaseAddress = Startup.ConfigManager.Beacon.Address;

            // 캠퍼스 ID 초기화            
            m_dicCampusIDs["acam"] = 1;
            m_dicCampusIDs["ccam"] = 2;
            m_dicCampusIDs["hcam"] = 3;
            m_dicCampusIDs["scam"] = 4;
            m_dicCampusIDs["vcam"] = 5;
            






            // 동 ID 초기화
            m_dicBuildingIDs["h-1"] = 1;
            m_dicBuildingIDs["h-2"] = 2;
            m_dicBuildingIDs["h-3"] = 3;
            m_dicBuildingIDs["h-4"] = 4;
            m_dicBuildingIDs["h-5"] = 5;
            m_dicBuildingIDs["h-wtp"] = 6;


            m_dicBuildingIDs["a-1"] = 7;
            m_dicBuildingIDs["a-2"] = 8;
            m_dicBuildingIDs["a-3"] = 9;
            m_dicBuildingIDs["a-4"] = 10;


            m_dicBuildingIDs["c-1"] = 11;
            m_dicBuildingIDs["c-2"] = 12;
            m_dicBuildingIDs["c-3"] = 13;
            m_dicBuildingIDs["c-4"] = 14;


            m_dicBuildingIDs["v-bon"] = 28;
            m_dicBuildingIDs["v-1"] = 15;
            m_dicBuildingIDs["v-2"] = 16;

            //m_dicBuildingIDs["v-3"] = 17;
            //m_dicBuildingIDs["v-4"] = 18;
            m_dicBuildingIDs["v-3_4"] = 17;

            m_dicBuildingIDs["v-5"] = 19;
            m_dicBuildingIDs["v-6"] = 20;
            m_dicBuildingIDs["v-7"] = 21;


            m_dicBuildingIDs["s-1"] = 29;
            m_dicBuildingIDs["s-2"] = 30;
            m_dicBuildingIDs["s-sc"] = 31;
            m_dicBuildingIDs["s-ob"] = 32;





            // 층 ID 초기화
            m_dicFloorIDs["h-1-b1f"] = 1;
            m_dicFloorIDs["h-1-1f"] = 2;
            m_dicFloorIDs["h-1-2f"] = 3;
            m_dicFloorIDs["h-1-2_5f"] = 4;
            m_dicFloorIDs["h-1-3f"] = 5;
            m_dicFloorIDs["h-2-1f"] = 6;
            m_dicFloorIDs["h-2-2f"] = 7;
            m_dicFloorIDs["h-3-1f"] = 8;
            m_dicFloorIDs["h-4-1f"] = 10;
            m_dicFloorIDs["h-4-2f"] = 11;
            m_dicFloorIDs["h-4-rf"] = 16;
            m_dicFloorIDs["h-ts"] = 12;
            m_dicFloorIDs["h-wtp-1f"] = 14;
            m_dicFloorIDs["h-wtp-2f"] = 14;


            m_dicFloorIDs["a-1-1f"] = 17;
            m_dicFloorIDs["a-1-2f"] = 18;
            m_dicFloorIDs["a-1-3f"] = 19;
            m_dicFloorIDs["a-2-b1f"] = 20;
            m_dicFloorIDs["a-2-1f"] = 21;
            m_dicFloorIDs["a-2-2f"] = 22;
            m_dicFloorIDs["a-2-3f"] = 23;
            m_dicFloorIDs["a-3-b1f"] = 26;
            m_dicFloorIDs["a-3-1f"] = 27;
            m_dicFloorIDs["a-3-2f"] = 28;
            //m_dicFloorIDs["a-3-2_5fr"] = 28;
            m_dicFloorIDs["a-3-3f"] = 29;
            m_dicFloorIDs["a-3-4f"] = 30;
            m_dicFloorIDs["a-4-wc"] = 32;


            m_dicFloorIDs["c-1-1f"] = 33;
            m_dicFloorIDs["c-2-1f"] = 34;
            m_dicFloorIDs["c-3-1f"] = 35;
            m_dicFloorIDs["c-3-2f"] = 36;
            m_dicFloorIDs["c-3-3f"] = 37;
            m_dicFloorIDs["c-4-1f"] = 39;
            m_dicFloorIDs["c-4-2f"] = 40;
            m_dicFloorIDs["c-4-3f"] = 41;


            m_dicFloorIDs["v-b-1f"] = 67;
            m_dicFloorIDs["v-b-2f"] = 68;
            m_dicFloorIDs["v-b-3f"] = 69;
            m_dicFloorIDs["v-1-1f"] = 45;
            m_dicFloorIDs["v-1-2f"] = 46;
            m_dicFloorIDs["v-1-3f"] = 47;
            m_dicFloorIDs["v-2-1f"] = 48;
            m_dicFloorIDs["v-2-2f"] = 49;

            //m_dicFloorIDs["v-3-1f"] = 50;
            m_dicFloorIDs["v-4-1f"] = 51;            
            m_dicFloorIDs["v-4-2f"] = 52;
            m_dicFloorIDs["v-3-4-1f"] = 50;

            m_dicFloorIDs["v-5-1f"] = 53;
            m_dicFloorIDs["v-5-2f"] = 54;
            m_dicFloorIDs["v-5-3f"] = 55;
            m_dicFloorIDs["v-6-1f"] = 57;
            m_dicFloorIDs["v-7-1f"] = 58;


            m_dicFloorIDs["s-1-1f"] = 71;
            m_dicFloorIDs["s-1-2f"] = 72;
            m_dicFloorIDs["s-1-3f"] = 73;
            m_dicFloorIDs["s-1-3_5f"] = 74;
            m_dicFloorIDs["s-1-roof"] = 75;
            m_dicFloorIDs["s-2-1f"] = 76;
            m_dicFloorIDs["s-2-2f"] = 77;
            m_dicFloorIDs["s-2-3f"] = 78;
            m_dicFloorIDs["s-2-roof"] = 79;
            m_dicFloorIDs["s-sc-1f"] = 80;
            m_dicFloorIDs["s-sc-2f"] = 81;
            m_dicFloorIDs["s-ob-b1f"] = 82;
            m_dicFloorIDs["s-ob-1f"] = 83;
            m_dicFloorIDs["s-ob-2f"] = 84;
            m_dicFloorIDs["s-ob-3f"] = 85;
            m_dicFloorIDs["s-ob-4f"] = 86;
            m_dicFloorIDs["s-ob-roof"] = 87;



            // 집결지
            m_dicFloorIDs[CommonString.ASSEM_FLOOR_H] = ID.Assembly_H;         
            m_dicFloorIDs[CommonString.ASSEM_FLOOR_C] = ID.Assembly_C;         

            m_dicFloorIDs[CommonString.ASSEM_FLOOR_A] = ID.Assembly_A;
            m_dicFloorIDs[CommonString.ASSEM_FLOOR_V] = ID.Assembly_V;
            m_dicFloorIDs[CommonString.ASSEM_FLOOR_S] = ID.Assembly_S;







            // 구역 ID 초기화
            m_dicGeofenceIDs["H1-B1F-소방펌프실"] = new GeofenceData("H1-B1F-소방펌프실", 1);
            m_dicGeofenceIDs["H1-B1F-LCSS실"] = new GeofenceData("H1-B1F-LCSS실", 2);
            m_dicGeofenceIDs["H1-B1F-클린룸"] = new GeofenceData("H1-B1F-클린룸", 11);
            m_dicGeofenceIDs["H1-2F-클린룸"] = new GeofenceData("H1-2F-클린룸", 1460);
            m_dicGeofenceIDs["H-집결지"] = new GeofenceData("H-집결지", ID.Assembly_H);

            m_dicGeofenceIDs["C3-1F-1차 세척실"] = new GeofenceData("C3-1F-1차 세척실", 506);
            m_dicGeofenceIDs["C4-2F-공정 세척실"] = new GeofenceData("C4-2F-공정 세척실", 634);
            m_dicGeofenceIDs["C4-2F-최종 검사실"] = new GeofenceData("C4-2F-최종 검사실", 1496);
            m_dicGeofenceIDs["C4-2F-세정실"] = new GeofenceData("C4-2F-세정실", 1558);    
            m_dicGeofenceIDs["C-집결지"] = new GeofenceData("C-집결지", ID.Assembly_C);

            m_dicGeofenceIDs["A1-1F-폐산탱크실"] = new GeofenceData("A1-1F-폐산탱크실", 210);
            m_dicGeofenceIDs["A1-1F-포장재창고"] = new GeofenceData("A1-1F-포장재창고", 211);
            m_dicGeofenceIDs["A1-1F-유해화학물질보관창고"] = new GeofenceData("A1-1F-유해화학물질보관창고", 212);
            m_dicGeofenceIDs["A1-2F-DIW실"] = new GeofenceData("A1-2F-DIW실", 232);


            m_dicGeofenceIDs["A2-B1F-야외"] = new GeofenceData("A2-B1F-야외", 296); 
            m_dicGeofenceIDs["A2-1F-불작업장"] = new GeofenceData("A2-1F-불작업장", 300);  // 대형 선반 
            m_dicGeofenceIDs["A2-3F-불작업장"] = new GeofenceData("A2-3F-불작업장", 1559);  
            m_dicGeofenceIDs["A3-B1F-소방펌프실"] = new GeofenceData("A3-B1F-소방펌프실", 335); // 구 펌프실
            m_dicGeofenceIDs["A3-2F-불작업장"] = new GeofenceData("A3-2F-불작업장", 1560);  
            m_dicGeofenceIDs["A3-3F-불작업장"] = new GeofenceData("A3-3F-불작업장", 1561);  


            m_dicGeofenceIDs["A-집결지"] = new GeofenceData("A-집결지", ID.Assembly_A);         // 집결지 포인트

            m_dicGeofenceIDs["V-집결지"] = new GeofenceData("V-집결지", ID.Assembly_V);         // 집결지 포인트

            m_dicGeofenceIDs["S2-2F-불작업장"] = new GeofenceData("S2-2F-불작업장", 1562);  
            m_dicGeofenceIDs["S2-2F-클린룸"] = new GeofenceData("S2-2F-클린룸", 1563);    
            m_dicGeofenceIDs["S2-3F-불작업장"] = new GeofenceData("S2-3F-불작업장", 1564);

            m_dicGeofenceIDs["S-집결지"] = new GeofenceData("S-집결지", ID.Assembly_S);

            m_dicGeofenceIDs["A1-2F-불작업장"] = new GeofenceData("S-집결지", 239);
        }

        public Dictionary<int, BeaconCount> RequestCampusCount(out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<int, BeaconCount> dicCampusIDs = null;

            try { 
                string strURL = "/v5/api/app/dashboard/headcountByCampus";

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {                    
                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jCampus = (JObject)jResult[i];

                        string strCampusID = jCampus["campusId"]?.ToString().Trim();
                        string strEmployeeInCount = jCampus["employeeInCount"]?.ToString().Trim();
                        string strVisitInCount = jCampus["visitInCount"]?.ToString().Trim();

                        int? nEmployeeInCount = null, nVisitInCount = null;
                        int nTemp;

                        if (int.TryParse(strEmployeeInCount, out nTemp))
                            nEmployeeInCount = nTemp;
                        if (int.TryParse(strVisitInCount, out nTemp))
                            nVisitInCount = nTemp;

                        if (m_dicCampusIDs.ContainsKey(strCampusID))
                        {
                            int nCampusID = m_dicCampusIDs[strCampusID];

                            if (dicCampusIDs == null)
                                dicCampusIDs = new Dictionary<int, BeaconCount>();

                            dicCampusIDs[nCampusID] = new BeaconCount(strCampusID, nEmployeeInCount, nVisitInCount);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestBuildingCount Error: " + e.Message);
            }

            return dicCampusIDs;
        }


        public Dictionary<int, BeaconCount> RequestBuildingCount(string strCampusID, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<int, BeaconCount> dicBuildingIDs = null;

            try
            {
                string strURL = "/v5/api/app/dashboard/headcountByBuilding?campusId=" + strCampusID;

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    dicBuildingIDs = new Dictionary<int, BeaconCount>();

                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jCampus = (JObject)jResult[i];

                        string strBuildingID = jCampus["buildingId"]?.ToString().Trim();
                        string strEmployeeInCount = jCampus["employeeInCount"]?.ToString().Trim();
                        string strVisitInCount = jCampus["visitInCount"]?.ToString().Trim();

                        int? nEmployeeInCount = null, nVisitInCount = null;
                        int nTemp;

                        if (int.TryParse(strEmployeeInCount, out nTemp))
                            nEmployeeInCount = nTemp;
                        if (int.TryParse(strVisitInCount, out nTemp))
                            nVisitInCount = nTemp;

                        if (m_dicBuildingIDs.ContainsKey(strBuildingID))
                        {
                            int nBuildingID = m_dicBuildingIDs[strBuildingID];

                            dicBuildingIDs[nBuildingID] = new BeaconCount(strBuildingID, nEmployeeInCount, nVisitInCount);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestBuildingCount Error: " + e.Message);
            }

            return dicBuildingIDs;
        }

        public Dictionary<int, BeaconCount> RequestFloorCount(string strBuildingID, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<int, BeaconCount> dicFloorIDs = null;

            try
            {
                string strURL = "/v5/api/app/dashboard/headcountByFloor?buildingId=" + strBuildingID;

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    dicFloorIDs = new Dictionary<int, BeaconCount>();

                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jCampus = (JObject)jResult[i];

                        string strFloorID = jCampus["floorId"]?.ToString().Trim();
                        string strEmployeeInCount = jCampus["employeeInCount"]?.ToString().Trim();
                        string strVisitInCount = jCampus["visitInCount"]?.ToString().Trim();

                        int? nEmployeeInCount = null, nVisitInCount = null;
                        int nTemp;

                        if (int.TryParse(strEmployeeInCount, out nTemp))
                            nEmployeeInCount = nTemp;
                        if (int.TryParse(strVisitInCount, out nTemp))
                            nVisitInCount = nTemp;

                        if (m_dicFloorIDs.ContainsKey(strFloorID))
                        {
                            int nZoneID = m_dicFloorIDs[strFloorID];

                            dicFloorIDs[nZoneID] = new BeaconCount(strFloorID, nEmployeeInCount, nVisitInCount);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestFloorCount Error: " + e.Message);
            }

            return dicFloorIDs;
        }


        public Dictionary<int, BeaconCount> RequestGeofenceCount(string strFloorID, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<int, BeaconCount> dicGeofenceIDs = null;

            try
            {
                string strURL = "/v5/api/app/dashboard/headcountByGeofence?floorId=" + strFloorID;

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                // 부하 딜레이
                System.Threading.Thread.Sleep(200);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    dicGeofenceIDs = new Dictionary<int, BeaconCount>();

                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jCampus = (JObject)jResult[i];

                        string strFcName = jCampus["fcName"]?.ToString().Trim();
                        string strEmployeeInCount = jCampus["employeeInCount"]?.ToString().Trim();
                        string strVisitInCount = jCampus["visitInCount"]?.ToString().Trim();
                        string strFcNum = jCampus["fcNum"]?.ToString().Trim();

                        int? nEmployeeInCount = null, nVisitInCount = null, nFcNum = null;
                        int nTemp;

                        if (int.TryParse(strEmployeeInCount, out nTemp))
                            nEmployeeInCount = nTemp;
                        if (int.TryParse(strVisitInCount, out nTemp))
                            nVisitInCount = nTemp;
                        if (int.TryParse(strFcNum, out nTemp))
                            nFcNum = nTemp;

                        if (m_dicGeofenceIDs.ContainsKey(strFcName))
                        {
                            GeofenceData geofenceData = m_dicGeofenceIDs[strFcName];

                            geofenceData.FcNum = nFcNum;

                            int nEquipmentZoneID = geofenceData.EquipZoneID;

                            // 집결지 예외처리
                            if (nEquipmentZoneID == ID.Assembly_H || nEquipmentZoneID == ID.Assembly_C || nEquipmentZoneID == ID.Assembly_A || nEquipmentZoneID == ID.Assembly_V || nEquipmentZoneID == ID.Assembly_S)
                            {
                                if (dicGeofenceIDs.ContainsKey(nEquipmentZoneID))
                                {
                                    BeaconCount data = dicGeofenceIDs[nEquipmentZoneID];
                                    data.EmployeeInCount += nEmployeeInCount;
                                    data.VisitInCount += nVisitInCount;

                                    continue;
                                }
                            }

                            dicGeofenceIDs[nEquipmentZoneID] = new BeaconCount(strFcName, nEmployeeInCount, nVisitInCount);
                        }
                    }
                }

            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestGeofenceCount Error: " + e.Message);
            }

            return dicGeofenceIDs;
        }

        public Dictionary<int, BeaconCount> RequestGeofenceCount(out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<int, BeaconCount> dicGeofenceIDs = null;

            try
            {
                string strURL = "/v5/api/app/dashboard/headcountByGeofence";

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    dicGeofenceIDs = new Dictionary<int, BeaconCount>();

                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jCampus = (JObject)jResult[i];

                        string strFcName = jCampus["fcName"]?.ToString().Trim();
                        string strEmployeeInCount = jCampus["employeeInCount"]?.ToString().Trim();
                        string strVisitInCount = jCampus["visitInCount"]?.ToString().Trim();
                        string strFcNum = jCampus["fcNum"]?.ToString().Trim();

                        int? nEmployeeInCount = null, nVisitInCount = null, nFcNum = null;
                        int nTemp;

                        if (int.TryParse(strEmployeeInCount, out nTemp))
                            nEmployeeInCount = nTemp;
                        if (int.TryParse(strVisitInCount, out nTemp))
                            nVisitInCount = nTemp;
                        if (int.TryParse(strFcNum, out nTemp))
                            nFcNum = nTemp;

                        if (m_dicGeofenceIDs.ContainsKey(strFcName))
                        {
                            GeofenceData geofenceData = m_dicGeofenceIDs[strFcName];

                            geofenceData.FcNum = nFcNum;

                            int nEquipmentZoneID = geofenceData.EquipZoneID;

                            // 집결지 예외처리
                            //if (nEquipmentZoneID == ID.Assembly_H || nEquipmentZoneID == ID.Assembly_C || nEquipmentZoneID == ID.Assembly_A || nEquipmentZoneID == ID.Assembly_V || nEquipmentZoneID == ID.Assembly_S)
                            //{
                            //    if (dicGeofenceIDs.ContainsKey(nEquipmentZoneID))
                            //    {
                            //        BeaconCount data = dicGeofenceIDs[nEquipmentZoneID];
                            //        data.EmployeeInCount += nEmployeeInCount;
                            //        data.VisitInCount += nVisitInCount;

                            //        continue;
                            //    }
                            //}

                            dicGeofenceIDs[nEquipmentZoneID] = new BeaconCount(strFcName, nEmployeeInCount, nVisitInCount);
                        }
                    }
                }

            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestGeofenceCount Error: " + e.Message);
            }

            return dicGeofenceIDs;
        }



        // 구역 명단 받아오기
        public List<PersonData> RequestEntranceGeofenceCount(int nFcNum, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<PersonData> personDatas = new List<PersonData>();

            string strURL = "/v5/api/app/dashboard/entranceHeadsGeofence?fcNum=" + nFcNum.ToString();

            try
            {
                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jCampus = (JObject)jResult[i];

                        string strComNum = jCampus["comNum"]?.ToString().Trim();
                        string strFloor = jCampus["floor"]?.ToString().Trim();
                        string strTargetId = jCampus["targetId"]?.ToString().Trim();
                        string strName = jCampus["name"]?.ToString().Trim();
                        string strBelong = jCampus["belong"]?.ToString().Trim();
                        string strPhoneNumber = jCampus["phoneNumber"]?.ToString().Trim();
                        string strStayTime = jCampus["stayTime"]?.ToString().Trim();

                        string strFcNum = jCampus["fcNum"]?.ToString().Trim();
                        string strTargetNum = jCampus["targetNum"]?.ToString().Trim();


                        int? _nFcNum = null;
                        int? nComNum = null, nTargetNum = null;

                        //long lTemp;
                        int nTemp;

                        if (int.TryParse(strFcNum, out nTemp))
                            _nFcNum = nTemp;
                        if (int.TryParse(strComNum, out nTemp))
                            nComNum = nTemp;
                        if (int.TryParse(strTargetNum, out nTemp))
                            nTargetNum = nTemp;



                        // 명단 만들기
                        if (_nFcNum.HasValue)
                        {
                            // 해당 구역 찾기
                            int? nEquipZoneID = FindEquipZoneID(_nFcNum.Value);
                            if (nEquipZoneID.HasValue)
                            {
                                PersonData personData = new PersonData();
                                personData.EquipZoneID = nEquipZoneID.Value;
                                personData.ComNum = nComNum;
                                personData.Name = strName;
                                personData.TargetId = strTargetId;
                                personData.Belong = strBelong;
                                personData.PhoneNumber = strPhoneNumber;
                                personData.StayTime = strStayTime;
                                personData.Floor = strFloor;

                                personDatas.Add(personData);
                            }
                        }
                    }
                }

            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestEntranceGeofenceCount Error: " + e.Message);
            }

            return personDatas;
        }

        /// <summary>
        /// 캠퍼스 잔류자 리스트 구하기
        /// </summary>
        /// <param name="strCampusID"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        public List<PersonData> RequestRemnant(string strCampusID, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<PersonData> personDatas = new List<PersonData>();

            string strURL = "/v5/api/app/remnant/" + strCampusID;

            try
            {
                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jRemnant = (JObject)jResult[i];

                        string strTargetName = jRemnant["targetName"]?.ToString().Trim();
                        string strPhoneNumber = jRemnant["phoneNumber"]?.ToString().Trim();
                        string strCategoryName = jRemnant["categoryName"]?.ToString().Trim();
                        string strFloor = jRemnant["floor"]?.ToString().Trim();                       

                        // 명단 만들기
                        if (strTargetName?.Length > 0 &&
                            strPhoneNumber?.Length > 0 &&
                            strCategoryName?.Length > 0 &&
                            strFloor?.Length > 0)
                        {
                            PersonData personData = new PersonData();
                            personData.Name = strTargetName;
                            personData.PhoneNumber = strPhoneNumber;
                            personData.Floor = strFloor;

                            // 업체 구분
                            personData.ComNum = 1;                            
                            if (strCategoryName == "visit")
                                personData.ComNum = 0;

                            personDatas.Add(personData);
                        }
                    }
                }

            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestRemnant Error: " + e.Message);
            }

            return personDatas;
        }


        // 알람 리스트 받아오기
        public List<AlarmData> RequestAlertHeads(out string strErrorMessage)
        {
            strErrorMessage = null;
            List<AlarmData> alarms = new List<AlarmData>();

            string strURL = "/v5/api/app/dashboard/alertHeads";

            try
            {
                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["token"] = Token;
                dicHeaders["UUID"] = UUID;

                string strJson = null;

                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    JArray jResult = JArray.Parse(strResult);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jCampus = (JObject)jResult[i];

                        string strComNum = jCampus["comNum"]?.ToString().Trim();
                        string strFloor = jCampus["floor"]?.ToString().Trim();
                        string strTargetId = jCampus["targetId"]?.ToString().Trim();
                        string strName = jCampus["name"]?.ToString().Trim();
                        string strBelong = jCampus["belong"]?.ToString().Trim();
                        string strPhoneNumber = jCampus["phoneNumber"]?.ToString().Trim();
                        string strSosOn = jCampus["sosOn"]?.ToString().Trim();
                        string strLongStayZoneOn = jCampus["longStayZoneOn"]?.ToString().Trim();
                        string strStayTime = jCampus["stayTime"]?.ToString().Trim();

                        string strFcNum = jCampus["fcNum"]?.ToString().Trim();
                        string strTargetNum = jCampus["targetNum"]?.ToString().Trim();


                        int? nFcNum = null;
                        int? nComNum = null, nTargetNum = null;

                        //long lTemp;
                        int nTemp;

                        if (int.TryParse(strFcNum, out nTemp))
                            nFcNum = nTemp;
                        if (int.TryParse(strComNum, out nTemp))
                            nComNum = nTemp;
                        if (int.TryParse(strTargetNum, out nTemp))
                            nTargetNum = nTemp;



                        // 알람 데이터 만들기
                        if (nFcNum.HasValue && nComNum.HasValue && (strSosOn == CommonString.YES || strLongStayZoneOn == CommonString.YES))
                        {
                            // 해당 구역 찾기
                            int? nEquipZoneID = FindEquipZoneID(nFcNum.Value);
                            if (nEquipZoneID.HasValue)
                            {
                                AlarmData alarmData = new AlarmData();
                                alarmData.EquipZoneID = nEquipZoneID.Value;
                                alarmData.ComNum = nComNum;
                                alarmData.Name = strName;
                                alarmData.TargetId = strTargetId;
                                alarmData.Belong = strBelong;
                                alarmData.PhoneNumber = strPhoneNumber;
                                alarmData.SosOn = strSosOn;
                                alarmData.LongStayZoneOn = strLongStayZoneOn;
                                alarmData.StayTime = strStayTime;
                                alarmData.Floor = strFloor;

                                if (strSosOn == CommonString.YES)
                                    alarmData.SensorType = (int)Facility.FacilityType.Becon_SOS;
                                else
                                    alarmData.SensorType = (int)Facility.FacilityType.Becon_Stay;

                                alarms.Add(alarmData);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestAlertHeads Error: " + e.Message);
                alarms = null;
            }

            // .TODO: 알람 테스트
            //if (alarms.Count == 0)
            //{
            //    AlarmData alarmData = new AlarmData();
            //    alarmData.EquipZoneID = 1564;
            //    alarmData.ComNum = 1;
            //    alarmData.Name = "박근원";
            //    alarmData.TargetId = "00544";
            //    alarmData.Belong = "원익큐엔씨";
            //    alarmData.PhoneNumber = "02-2226-2265";
            //    alarmData.SosOn = CommonString.YES;
            //    alarmData.LongStayZoneOn = CommonString.NO;
            //    alarmData.StayTime = "00:05:30";
            //    alarmData.Floor = "s-2-3f";
            //    alarmData.SensorType = (int)Facility.FacilityType.Becon_SOS;

            //    alarms.Add(alarmData);

            //    alarmData = new AlarmData();
            //    alarmData.EquipZoneID = 1564;
            //    alarmData.ComNum = 0;
            //    alarmData.Name = "방문자1";
            //    alarmData.TargetId = "Guest1";
            //    alarmData.Belong = "원익큐엔씨";
            //    alarmData.PhoneNumber = "010-123-1234";
            //    alarmData.SosOn = CommonString.YES;
            //    alarmData.LongStayZoneOn = CommonString.NO;
            //    alarmData.StayTime = "00:05:30";
            //    alarmData.Floor = "s-2-3f";
            //    alarmData.SensorType = (int)Facility.FacilityType.Becon_SOS;

            //    alarms.Add(alarmData);
            //}

            return alarms;
        }


        private int? FindEquipZoneID(int nFcNum)
        {
            int? ndEquipZoneID = null;

            foreach (KeyValuePair<string, GeofenceData> pair in m_dicGeofenceIDs)
            {
                GeofenceData data = pair.Value;

                if (data.FcNum == nFcNum)
                {
                    ndEquipZoneID = data.EquipZoneID;
                    break;
                }
            }

            return ndEquipZoneID;
        }

        public int? FindGeofenceFcNum(int? nEquipZoneID)
        {
            int? nGeofenceFcNum = null;

            if (nEquipZoneID.HasValue)
            {
                foreach (KeyValuePair<string, GeofenceData> pair in m_dicGeofenceIDs)
                {
                    GeofenceData data = pair.Value;

                    if (data.EquipZoneID == nEquipZoneID)
                    {
                        nGeofenceFcNum = data.FcNum;
                        break;
                    }
                }
            }

            return nGeofenceFcNum;
        }

        public string FindCampusID(int? nEquipZoneID)
        {
            string strCampusID = null;

            if (nEquipZoneID.HasValue)
            {
                if (nEquipZoneID == ID.Assembly_H)
                    strCampusID = "hcam";
                else if (nEquipZoneID == ID.Assembly_A)
                    strCampusID = "acam";
                else if (nEquipZoneID == ID.Assembly_C)
                    strCampusID = "ccam";
                else if (nEquipZoneID == ID.Assembly_V)
                    strCampusID = "vcam";
                else if (nEquipZoneID == ID.Assembly_S)
                    strCampusID = "scam";
            }

            return strCampusID;
        }

        private string SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";

            string strResponse = null;

            try
            {
                string url = BaseAddress;

                if (strURL.StartsWith("/"))
                    url += strURL;
                else
                    url += "/" + strURL;

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));
                request.Method = strMethodType;

                if (dicHeaders != null)
                {
                    request.ContentType = "application/json; charset=utf-8";

                    // 요청 헤더 추가
                    foreach (KeyValuePair<string, string> pair in dicHeaders)
                    {
                        string key = pair.Key;
                        string value = pair.Value;
                        request.Headers.Add(key, value);
                    }
                }

                if (strBodyJson != null && strBodyJson != "")
                {
                    StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBodyJson);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
                return null;
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return null;
            }

            strErrorMessage = CommonString.SUCESS;
            return strResponse;
        }


        public int? FindZoneID(string strFloorID)
        {
            int? nZoneID = null;

            if (m_dicFloorIDs.ContainsKey(strFloorID))
            {
                nZoneID = m_dicFloorIDs[strFloorID];
            }

            return nZoneID;
        }
    }
}
