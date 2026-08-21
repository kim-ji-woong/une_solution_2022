using dnsDBUtil;
using dnsSMS;
using SDMS.DAL;
using SDMS.Model.Spatial;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using TeamEditor.Model.Sop.Team;

namespace SujainEmergencySend
{
    public class TrayManager
    {
        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        private DataManager m_dataManager = null;
        private TeamEditor.DAL.DataManager m_teamDataManager = null;

        private Dictionary<int, Dictionary<int, Zone>> m_dicBuildingZones = new Dictionary<int, Dictionary<int, Zone>>();
        private Dictionary<int, Zone> m_dicZones = new Dictionary<int, Zone>();

        private Dictionary<string, List<RegularMember>> m_dicEmergencyTeams = new Dictionary<string, List<RegularMember>>();

        [StructLayout(LayoutKind.Sequential)]
        public struct PointInter
        {
            public int X;
            public int Y;
            public static explicit operator Point(PointInter point)
            {
                return new Point(point.X, point.Y);
            }
        }

        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out PointInter lpPoint);

        private NotifyIcon m_icon = null;
        private ContextMenuStrip m_contextMenu = null;
        private System.ComponentModel.IContainer components;

        private ToolStripMenuItem tsMenuClose;

        public TrayManager(string[] args)
        {
            CreateNotifyicon();

            if (Init() == false)
                return;

            int? nZoneID = null;

            if (args?.Length > 0 && int.TryParse(args[0], out int nTemp))
                nZoneID = nTemp;

            SendEmergencyMessage(nZoneID);
        }

        private void CreateNotifyicon()
        {
            this.components = new System.ComponentModel.Container();
            this.m_contextMenu = new ContextMenuStrip();

            this.m_contextMenu = new ContextMenuStrip(this.components);
            this.tsMenuClose = new ToolStripMenuItem();

            // Initialize contextMenu1
            this.m_contextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsMenuClose});
            this.m_contextMenu.Size = new System.Drawing.Size(181, 70);

            // Create the NotifyIcon.
            this.m_icon = new System.Windows.Forms.NotifyIcon(this.components);

            // The Icon property sets the icon that will appear
            // in the systray for this application.
            m_icon.Icon = global::SujainEmergencySend.Properties.Resources.Message;

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            m_icon.ContextMenuStrip = this.m_contextMenu;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            m_icon.Text = "SujainEmergencySend";
            m_icon.Visible = true;

            // Handle the DoubleClick event to activate the form.
            m_icon.MouseClick += new System.Windows.Forms.MouseEventHandler(this.trayIcon_MouseClick);

            // 
            // tsMenuClose
            // 
            this.tsMenuClose.Name = "tsMenuClose";
            this.tsMenuClose.Size = new System.Drawing.Size(180, 22);
            this.tsMenuClose.Text = "종료";
            this.tsMenuClose.Click += new System.EventHandler(this.tsMenuClose_Click);
        }

        private void tsMenuClose_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void trayIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                m_contextMenu.Show();
        }

        private bool Init()
        {
            // DB 정보 불러오기
            string strSiteID = ConfigurationManager.AppSettings.Get("SITE_ID");
            if (strSiteID == null || strSiteID.Length == 0)
                strSiteID = "16";

            string strDBName = ConfigurationManager.AppSettings.Get("DB_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "WSOP_16";

            string strDBType = ConfigurationManager.AppSettings.Get("DB_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "0";

            string strDBHost = ConfigurationManager.AppSettings.Get("DB_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "AwVB0IrUXAghp5PlaWuqWg==";

            string strDBId = ConfigurationManager.AppSettings.Get("DB_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "GUk6cJACqVBoIFh7ny7mqQ==";

            string strDBPw = ConfigurationManager.AppSettings.Get("DB_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "SezOwMM9A2mIbUk5DCW/eQ==";


            

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim(), key);
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim(), key);
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim(), key);

            int nSiteID, nDBType;
            int.TryParse(strSiteID.Trim(), out nSiteID);
            int.TryParse(strDBType.Trim(), out nDBType);

            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_teamDataManager = new TeamEditor.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);





            // Zone 불러오기
            List<Zone> zones = m_dataManager.GetSelectManager().SelectZones(null, null, out string strErrorMessage);
            if (zones == null)
            {
                strErrorMessage = string.Format("1. Init 실패 (SelectZones null: {0})", strErrorMessage);
                Logger.Instance.Write(strErrorMessage);
                return false;
            }

            foreach (Zone zone in zones)
            {
                m_dicZones[zone.ID] = zone;

                if (zone.BuildingID.HasValue && zone.FloorIndex.HasValue)
                {
                    if (m_dicBuildingZones.ContainsKey(zone.BuildingID.Value))
                    {
                        Dictionary<int, Zone> dicZones = m_dicBuildingZones[zone.BuildingID.Value];
                        dicZones[zone.FloorIndex.Value] = zone;
                    }
                    else
                    {
                        m_dicBuildingZones[zone.BuildingID.Value] = new Dictionary<int, Zone>();

                        Dictionary<int, Zone> dicZones = m_dicBuildingZones[zone.BuildingID.Value];
                        dicZones[zone.FloorIndex.Value] = zone;
                    }
                }
            }










            // 비상조직 정보 불러오기
            Dictionary<Temporary.Fields, object> dicConditions = new Dictionary<Temporary.Fields, object>();
            dicConditions[Temporary.Fields.IsNormal] = true;

            List<Temporary> temporaries = m_teamDataManager.GetSelectManager().SelectTemporaries(dicConditions, out strErrorMessage);
            if (temporaries == null)
            {
                strErrorMessage = string.Format("2. Init 실패(SelectTemporaries null: {0})", strErrorMessage);
                Logger.Instance.Write(strErrorMessage);
                return false;
            }

            // 피난유도팀 정보만 추출
            TemporaryTreeData temporaryTreeData = GetEmergencyTreeData(temporaries);
            if (temporaryTreeData == null || temporaryTreeData.Childs == null)
            {
                strErrorMessage = string.Format("3. Init 실패(조직 정보가 잘못되었습니다.)");
                Logger.Instance.Write(strErrorMessage);
                return false;
            }

            // 피난유도팀 해당 멤버 추출
            List<TemporaryTreeData> emergency = temporaryTreeData.Childs;

            foreach(TemporaryTreeData treeData in emergency)
            {
                if (treeData.TeamName == Data.EmergencyTeam1 ||
                    treeData.TeamName == Data.EmergencyTeam2 ||
                    treeData.TeamName == Data.EmergencyTeam3 ||
                    treeData.TeamName == Data.EmergencyTeam4 ||
                    treeData.TeamName == Data.EmergencyTeam5 ||
                    treeData.TeamName == Data.EmergencyTeam6 ||
                    treeData.TeamName == Data.EmergencyTeam7 ||
                    treeData.TeamName == Data.EmergencyTeam8)
                {
                    List<RegularMember> regularMembers = GetRegularMembers(treeData, out strErrorMessage);
                    if (regularMembers == null)
                    {
                        strErrorMessage = string.Format("4. Init 실패(GetRegularMembers null: {0})", strErrorMessage);
                        Logger.Instance.Write(strErrorMessage);
                        return false;
                    }

                    m_dicEmergencyTeams[treeData.TeamName] = regularMembers;
                }
                
            }




            return true;
        }

        private List<RegularMember> GetRegularMembers(TemporaryTreeData temporaryTreeData, out string strErrorMessage)
        {
            strErrorMessage = "";
            List<RegularMember> members = new List<RegularMember>();


            // 비상조직 멤버 정보 불러오기
            Dictionary<TemporaryMember.Fields, object> dicConditions = new Dictionary<TemporaryMember.Fields, object>();
            dicConditions[TemporaryMember.Fields.TeamID] = temporaryTreeData.ID;

            List<TemporaryMember> temporaryMembers = m_teamDataManager.GetSelectManager().SelectTemporaryMembers(dicConditions, null, out strErrorMessage);
            if (temporaryMembers == null)
            {
                strErrorMessage = string.Format("SelectTemporaryMembers error: " + strErrorMessage);
                return null;
            }








            // 비상조직 멤버에 해당하는 조직 멤버 불러오기(팀 또는 멤버)
            Dictionary<int, int> dicMemberIDs = new Dictionary<int, int>();
            Dictionary<int, int> dicTeamIDs = new Dictionary<int, int>();

            foreach (TemporaryMember temporaryMember in temporaryMembers)
            {
                if (temporaryMember.RegularMemberID.HasValue)
                    dicMemberIDs[temporaryMember.RegularMemberID.Value] = temporaryMember.RegularMemberID.Value;
                else if (temporaryMember.RegularID.HasValue)
                    dicTeamIDs[temporaryMember.RegularID.Value] = temporaryMember.RegularID.Value;
            }

            string strAdditionalConditions = null;

            if (dicTeamIDs.Count > 0)
            {
                List<int> teamIDs = new List<int>(dicTeamIDs.Values);
                strAdditionalConditions = string.Format("{0} in ({1})", RegularMember.Fields.RegularID, string.Join(",", teamIDs));
            }
            if (dicMemberIDs.Count > 0)
            {
                List<int> memberIDs = new List<int>(dicMemberIDs.Values);

                if (strAdditionalConditions == null)
                    strAdditionalConditions = string.Format("{0} in ({1})", RegularMember.Fields.ID, string.Join(",", memberIDs));
                else
                    strAdditionalConditions = string.Format(" and {0} in ({1})", RegularMember.Fields.ID, string.Join(",", memberIDs));
            }

            if (strAdditionalConditions != null)
                members = m_teamDataManager.GetSelectManager().SelectRegularMembers(null, strAdditionalConditions, out strErrorMessage);

            if (members == null)
            {
                strErrorMessage = string.Format("SelectRegularMembers error: " + strErrorMessage);
                return null;
            }

            return members;
        }

        private TemporaryTreeData GetEmergencyTreeData(List<Temporary> temporaries)
        {
            TemporaryTreeData rootData = null;

            if (temporaries?.Count > 0)
            {
                foreach (Temporary temporary in temporaries)
                {
                    if (temporary.ParentTeamID == null && temporary.TeamName == Data.EmergencyRootTeam)
                    {
                        rootData = new TemporaryTreeData(temporary);
                        rootData.Childs = GetChildData(rootData.ID, temporaries);
                    }
                }
            }

            return rootData;
        }

        private List<TemporaryTreeData> GetChildData(int nParentTeamID, List<Temporary> temporaries)
        {
            List<TemporaryTreeData> treeDatas = null;

            if (temporaries?.Count > 0)
            {
                foreach (Temporary temporary in temporaries)
                {
                    if (temporary.ParentTeamID == nParentTeamID)
                    {
                        if (treeDatas == null)
                            treeDatas = new List<TemporaryTreeData>();

                        TemporaryTreeData treeData = new TemporaryTreeData(temporary);
                        treeData.Childs = GetChildData(treeData.ID, temporaries);

                        treeDatas.Add(treeData);
                    }
                }
            }

            return treeDatas;
        }

        private void SendEmergencyMessage(int? nZoneID)
        {
            string strErrorMessage = "";

            bool bChkTop = false;       // 재난 발생한 동 최고층 확인 여부
            bool bChkBuilding = false;

            Dictionary<int, Zone> dicZonesTotal = m_dicBuildingZones[Data.BuildingTotal];
            Dictionary<int, Zone> dicZones = null;
 
            int nFloorIndex = Data.FloorIndex_Total_Low;            // 상황 층 Index
            int nFloorIndexTop = Data.FloorIndex_Unknown_Top;       // 최고층 정보

            Zone zone = null;                                       // 상황 발생 층 정보
            if (nZoneID.HasValue)
                zone = m_dicZones[nZoneID.Value];

            if (zone != null)
            {   // 공간정보가 있는 경우

                if (zone.FloorIndex.HasValue)
                    nFloorIndex = zone.FloorIndex.Value;

                if (zone.BuildingID == Data.BuildingTotal)
                {   // 주상복합인 경우
                    dicZones = m_dicBuildingZones[Data.Building103];
                }
                else
                {   // 주거층 경우
                    dicZones = m_dicBuildingZones[zone.BuildingID.Value];
                    bChkTop = true;

                    // 최고층 정보 가져오기
                    foreach (KeyValuePair<int, Zone> pair in dicZones)
                    {
                        int nIdx = pair.Key;

                        if (nFloorIndexTop < nIdx)
                            nFloorIndexTop = nIdx;
                    }
                }
            }
            else
            {   // 공간정보가 없는 경우
                dicZones = m_dicBuildingZones[Data.Building103];
            }

            if (dicZones == null)
                return;









            int j = 1;

            bool bIsLeft = true;

            for (int i = nFloorIndex + 2; i < nFloorIndexTop; i += 10)
            {
                int nMax = i + 9;
                bool bChkRoof = false;

                if (nFloorIndexTop < nMax)
                {
                    nMax = nFloorIndexTop;
                    bChkRoof = true;
                }
                
                string strMessage = null;
                string strStairs = "좌측";

                if (bIsLeft == false)
                    strStairs = "우측";

                bIsLeft = !bIsLeft;

                Zone minZone = null;
                Zone maxZone = null;

                if (i <= Data.FloorIndex_Total_Top)
                    minZone = dicZonesTotal[i];
                else
                    minZone = dicZones[i];

                if (nMax <= Data.FloorIndex_Total_Top)
                    maxZone = dicZonesTotal[nMax];
                else
                    maxZone = dicZones[nMax];

                if (bChkTop)
                {
                    strMessage = string.Format("{0}부터 {1}까지 {2} 계단으로 순차적 대피 실시 (엘리베이터 사용 금지 및 피난계단으로 유도)", minZone.DisplayText, maxZone.DisplayText, strStairs);
                }
                else
                {
                    int nIdx1 = i + 1;
                    int nIdx2 = nMax + 1;

                    string strMin = "재난 인근 동 " + nIdx1.ToString() + "층";
                    string strMax = "재난 인근 동 " + nIdx2.ToString() + "층";

                    if (i <= Data.FloorIndex_Total_Top)
                        strMin = minZone.DisplayText;
                    if (nMax <= Data.FloorIndex_Total_Top)
                        strMax = maxZone.DisplayText;
                     
                    if (bChkRoof)
                        strMax = "재난 인근 동 옥상층";

                    strMessage = string.Format("{0}부터 {1}까지 {2} 계단으로 순차적 대피 실시 (엘리베이터 사용 금지 및 피난계단으로 유도)", strMin, strMax, strStairs);
                }

                string strEmergencyTeam = "피난 " + j.ToString() + "팀";
                List<RegularMember> members = m_dicEmergencyTeams[strEmergencyTeam];
                Dictionary<string, string> dicPhoneNumbers = new Dictionary<string, string>();

                foreach (RegularMember member in members)
                {
                    if (member.PhoneNumber?.Length > 0)
                    {
                        string strPhoneNumber = DecryptString(member.PhoneNumber);
                        dicPhoneNumbers[strPhoneNumber] = strPhoneNumber;
                    }
                }

                List<string> phoneNumbers = new List<string>(dicPhoneNumbers.Values);
                if (SendEmergencySMS(strMessage, phoneNumbers, out strErrorMessage) == false)
                    Logger.Instance.Write(strErrorMessage);

                Console.WriteLine(strMessage);
                j++;
            }


            bIsLeft = false;

            for (int i = nFloorIndex - 2; i > Data.FloorIndex_Total_Low; i -= 10)
            {
                int nMin = i - 9;

                if (Data.FloorIndex_Total_Low > nMin)
                    nMin = Data.FloorIndex_Total_Low;

                string strMessage = null;
                string strStairs = "좌측";

                if (bIsLeft == false)
                    strStairs = "우측";

                bIsLeft = !bIsLeft;

                Zone minZone = null;
                Zone maxZone = null;

                if (i <= Data.FloorIndex_Total_Top)
                    maxZone = dicZonesTotal[i];
                else
                    maxZone = dicZones[i];

                if (nMin <= Data.FloorIndex_Total_Top)
                    minZone = dicZonesTotal[nMin];
                else
                    minZone = dicZones[nMin];

                if (bChkTop)
                {
                    strMessage = string.Format("{0}부터 {1}까지 {2} 계단으로 순차적 대피 실시 (엘리베이터 사용 금지 및 피난계단으로 유도)", maxZone.DisplayText, minZone.DisplayText, strStairs);
                }
                else
                {
                    int nIdx1 = i + 1;
                    int nIdx2 = nMin + 1;

                    string strMin = "재난 인근 동 " + nIdx1.ToString() + "층";
                    string strMax = "재난 인근 동 " + nIdx2.ToString() + "층";

                    if (i <= Data.FloorIndex_Total_Top)
                        strMin = minZone.DisplayText;
                    if (nMin <= Data.FloorIndex_Total_Top)
                        strMax = maxZone.DisplayText;

                    strMessage = string.Format("{0}부터 {1}까지 {2} 계단으로 순차적 대피 실시 (엘리베이터 사용 금지 및 피난계단으로 유도)", strMax, strMin, strStairs);
                }

                string strEmergencyTeam = "피난 " + j.ToString() + "팀";
                List<RegularMember> members = m_dicEmergencyTeams[strEmergencyTeam];
                Dictionary<string, string> dicPhoneNumbers = new Dictionary<string, string>();

                foreach (RegularMember member in members)
                {
                    if (member.PhoneNumber?.Length > 0)
                    {
                        string strPhoneNumber = DecryptString(member.PhoneNumber);
                        dicPhoneNumbers[strPhoneNumber] = strPhoneNumber;
                    }
                }
                
                List<string> phoneNumbers = new List<string>(dicPhoneNumbers.Values);
                if (SendEmergencySMS(strMessage, phoneNumbers, out strErrorMessage) == false)
                    Logger.Instance.Write(strErrorMessage);

                Console.WriteLine(strMessage);
                j++;
            }

        }

        private bool SendEmergencySMS(string strMessage, List<string> phoneNumbers, out string strErrorMessage)
        {
            strErrorMessage = "";

            MessageContent content = new MessageContent();
            content.Caller = "";
            content.PhoneNumbers.AddRange(phoneNumbers);
            content.Message = strMessage;

            IMessageClient client = MessageClientFactory.CreateMessageClient();

            if (client == null)
            {
                strErrorMessage = "1. SendEmergencySMS Error: CreateMessageClient 실패";
                return false;
            }

            if (client.SendSMS(content) == false)
            {
                strErrorMessage = "2. SendEmergencySMS Error: SendSMS 실패";
                return false;
            }

            return true;
        }

        public static string DecryptString(string str)
        {
            if (str == null)
                return null;

            return AES256Cipher.AES_decrypt(str, key);
        }
    }
}
