using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace IntegrationServer.Servers.EmergencyBell.GGEdu
{
    using ViewModels.Option;

    class DBManager
    {
        private string m_strFilePath = @"NewEm485 SYSTEM\EmCall485.accdb";
        private const string m_strPassword = "SK_3398!";

        private string m_strConnection = null;
        private bool m_runThread = false;
        private string m_strLastDate = null;
        private string m_strLastTime = null;
        private EduManager m_mgr = null;
        private DataManager m_ownDBDataManager = null;

        public bool IsConnected
        {
            get { return m_runThread; }
        }

        public DBManager(string strServerIP, EduManager mgr, DataManager dataManager)
        {
            m_ownDBDataManager = dataManager;
            m_mgr = mgr;
            ReadFilePath(strServerIP, mgr.SiteID);

            m_strConnection = string.Format(@"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\{0}\{1};Jet OLEDB:Database Password={2}", strServerIP, m_strFilePath, m_strPassword);
        }

        public void Start()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void ReadFilePath(string strServerIP, int siteID)
        {
            string strCondition = string.Format("{0} = '{1}' and {2} = {3}",
                OptionSDMS.Fields.PropertyName, strServerIP,
                OptionSDMS.Fields.SiteID, siteID);

            string strErrorMessage;
            OptionSDMS option = m_ownDBDataManager.GetSelect().SelectFirst<OptionSDMS>(strCondition, out strErrorMessage);

            if (option != null && option.PropertyValue != null)
            {
                m_strFilePath = option.PropertyValue.Trim();
                m_mgr.WriteLog(strServerIP + "\\" + m_strFilePath);
            }
        }

        private void MonitoringThread()
        {
            if (m_runThread)
                return;

            m_runThread = true;
            SetCurrentTimeString();

            while (m_runThread)
            {
                ReadData();
                Thread.Sleep(1000);
            }
        }

        private void SetCurrentTimeString()
        {
            DateTime dtNow = DateTime.Now;
            m_strLastDate = string.Format("{0}-{1:00}-{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);
            m_strLastTime = string.Format("{0:00}:{1:00}:{2:00}", dtNow.Hour, dtNow.Minute, dtNow.Second);
        }

        private void ReadData()
        {
            using (OleDbConnection connection = new OleDbConnection(m_strConnection))
            {
                try
                {
                    connection.Open();

                    string strSQL = "Select IDX, Notics, DateIn, TimeIn from TB_Log";

                    if (m_strLastDate != null)
                        strSQL += string.Format(" where (DateIn = #{0} 00:00:00# and TimeIn > '{1}') or DateIn > #{0} 00:00:00#", m_strLastDate, m_strLastTime);

                    OleDbCommand cmd = new OleDbCommand(strSQL, connection);
                    OleDbDataReader reader = cmd.ExecuteReader();

                    Dictionary<int, bool> dicEmergencyBellNos = new Dictionary<int, bool>();

                    while (reader.Read())
                    {
                        int idx = reader.GetInt32(0);
                        string notics = reader.GetString(1);
                        DateTime dateIn = reader.GetDateTime(2);
                        string timeIn = reader.GetString(3);

                        if (notics == null)
                            continue;

                        if (notics.Contains("비상호출상황") || notics.Contains("비상호출 상황"))
                        {
                            int? emergencyBellNo = null;
                            bool isAlarm = true;

                            if (notics.Contains("발생"))
                            {
                                emergencyBellNo = GetEmergencyBellNo(notics);
                            }
                            else if (notics.Contains("해제"))
                            {
                                emergencyBellNo = GetEmergencyBellNo(notics);
                                isAlarm = false;
                            }

                            if (emergencyBellNo != null)
                            {
                                dicEmergencyBellNos[(int)emergencyBellNo] = isAlarm;
                            }
                        }

                        string strLastTime = m_strLastDate + " " + m_strLastTime;
                        string strDateIn = string.Format("{0}-{1:00}-{2:00} {3}", dateIn.Year, dateIn.Month, dateIn.Day, timeIn);

                        if (strLastTime.CompareTo(strDateIn) < 0)
                        {
                            m_strLastDate = string.Format("{0}-{1:00}-{2:00}", dateIn.Year, dateIn.Month, dateIn.Day);
                            m_strLastTime = timeIn;
                        }
                    }

                    reader.Close();

                    Dictionary<EmergencyBell, bool> dicEmergencyBellAlarms = GetEmergencyBellInfo(connection, dicEmergencyBellNos);

                    if (dicEmergencyBellAlarms != null)
                    {
                        foreach (KeyValuePair<EmergencyBell, bool> pair in dicEmergencyBellAlarms)
                        {
                            m_mgr.ProcessData(pair.Key.Name, pair.Key.FloorIndex, pair.Value);
                            m_mgr.WriteLog("EmergencyBell Alarm : " + pair.Key.Name + ", " + pair.Key.FloorIndex + ", " + pair.Value);
                        }
                    }
                }
                catch (Exception e)
                {
                    m_mgr.WriteLog("OleDbConnection Error : " + e.Message);
                    System.Diagnostics.Trace.WriteLine(e.Message);
                }
            }
        }

        private Dictionary<EmergencyBell, bool> GetEmergencyBellInfo(OleDbConnection connection, Dictionary<int, bool> dicEmergencyBellNos)
        {
            //floorIndex = 0;
            string strCondition = null;

            foreach (KeyValuePair<int, bool> pair in dicEmergencyBellNos)
            {
                if (strCondition == null)
                    strCondition = "'" + pair.Key.ToString() + "'";
                else
                    strCondition += ",'" + pair.Key.ToString() + "'";
            }

            if (strCondition == null)
                return null;

            // Value : IsAlarm
            Dictionary<EmergencyBell, bool> dicEmergencyBellAlarms = new Dictionary<EmergencyBell, bool>();
            // Key : EmergencyBell.idx
            Dictionary<int, EmergencyBell> dicEmergencyBells = new Dictionary<int, EmergencyBell>();

            string strSQL = "Select IDX, Alias, SCUNo, TerminalNo from TB_ImageLocation where TerminalNo in (" + strCondition + ")";

            OleDbCommand cmd = new OleDbCommand(strSQL, connection);
            OleDbDataReader reader = cmd.ExecuteReader();

            // Key : 비상벨 이름
            // Value : Scu No
            Dictionary<string, string> dicEmergencyInfos = new Dictionary<string, string>();
            Dictionary<int, string> dicScuNos = new Dictionary<int, string>();

            while (reader.Read())
            {
                int idx = reader.GetInt32(0);
                string strAlias = reader.GetString(1);
                string strScuNo = reader.GetString(2);
                string strTerminalNo = reader.GetString(3);

                if (strAlias == null || strScuNo == null || strTerminalNo == null)
                    continue;

                strScuNo = strScuNo.Trim();
                dicEmergencyInfos[strAlias] = strScuNo;

                int scuNo, terminalNo;
                bool isAlarm;

                if (int.TryParse(strTerminalNo, out terminalNo))
                {
                    EmergencyBell emergencyBell = null;

                    if (dicEmergencyBells.TryGetValue(terminalNo, out emergencyBell) == false)
                    {
                        if (dicEmergencyBellNos.TryGetValue(terminalNo, out isAlarm))
                        {
                            emergencyBell = new EmergencyBell();
                            emergencyBell.ID = terminalNo;
                            emergencyBell.Name = strAlias;
                            emergencyBell.ScuNo = strScuNo;

                            dicEmergencyBells[terminalNo] = emergencyBell;
                            dicEmergencyBellAlarms[emergencyBell] = isAlarm;
                        }
                    }
                }

                if (int.TryParse(strScuNo, out scuNo))
                    dicScuNos[scuNo] = strScuNo;
            }

            reader.Close();

            // Key : ScuNo
            Dictionary<string, int> dicScuFloorIndex = GetFloorIndex(connection, dicScuNos);

            foreach (KeyValuePair<EmergencyBell, bool> pair in dicEmergencyBellAlarms)
            {
                int floorIndex;

                if (dicScuFloorIndex.TryGetValue(pair.Key.ScuNo, out floorIndex))
                {
                    pair.Key.FloorIndex = floorIndex;
                }
            }

            return dicEmergencyBellAlarms;
        }

        private Dictionary<string, int> GetFloorIndex(OleDbConnection connection, Dictionary<int, string> dicScuNos)
        {
            Dictionary<string, int> dicScuFloorIndex = new Dictionary<string, int>();

            string strSQL = "Select IDX, Char_1 from TB_ImageInfo";

            OleDbCommand cmd = new OleDbCommand(strSQL, connection);
            OleDbDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                int idx = reader.GetInt32(0);
                string strFloorName = reader.GetString(1);

                if (strFloorName == null || strFloorName.Length == 0)
                    continue;

                string strScuNo;

                if (dicScuNos.TryGetValue(idx, out strScuNo) == false)
                    continue;

                int floorIndex = 0;

                if (strFloorName.StartsWith("지상"))
                    floorIndex = GetFloorIndex(strFloorName.Substring(2), true);
                else if (strFloorName.StartsWith("지하"))
                    floorIndex = GetFloorIndex(strFloorName.Substring(2), false);
                else
                    continue;

                dicScuFloorIndex[strScuNo] = floorIndex;
            }

            reader.Close();
            return dicScuFloorIndex;
        }

        private int GetFloorIndex(string strFloor, bool overGround)
        {
            int index = strFloor.IndexOf("층");

            if (index > 0)
                strFloor = strFloor.Substring(0, index).Trim();

            int floorIndex;

            if (int.TryParse(strFloor, out floorIndex))
            {
                if (overGround)
                    return floorIndex - 1;
                else
                    return floorIndex * (-1);
            }

            return 0;
        }

        private int? GetEmergencyBellNo(string strData)
        {
            string strNo = "";

            for (int i = strData.Length - 1; i >= 0; i--)
            {
                char ch = strData[i];

                if (ch < '0' || ch > '9')
                    break;
                else
                    strNo = ch + strNo;
            }

            int no;

            if (int.TryParse(strNo, out no) == false)
                return null;

            return no;
        }

        private class EmergencyBell
        {
            private int m_nID = -1;
            private string m_strName = null;
            private int m_nFloorIndex = 0;
            private string m_strScuNo = null;

            public int ID
            {
                get { return m_nID; }
                set { m_nID = value; }
            }

            public string Name
            {
                get { return m_strName; }
                set { m_strName = value; }
            }

            public int FloorIndex
            {
                get { return m_nFloorIndex; }
                set { m_nFloorIndex = value; }
            }

            public string ScuNo
            {
                get { return m_strScuNo; }
                set { m_strScuNo = value; }
            }
        }
    }
}
