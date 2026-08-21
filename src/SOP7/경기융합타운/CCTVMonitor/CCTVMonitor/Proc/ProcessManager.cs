using System;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Collections.Generic;
using System.Collections.Concurrent;

namespace CCTVMonitor.Proc
{
    using WebSocket;

    class ProcessManager
    {
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, uint wParam, ref COPYDATASTRUCT lParam);

        public struct COPYDATASTRUCT
        {
            public IntPtr dwData;
            public int cbData;
            [MarshalAs(UnmanagedType.LPStr)]
            public string lpData;
        }

        private const int WM_COPYDATA = 0x4a;

        public enum ProcessMessageType
        {
            OpenCCTV = 1,
            ShowCCTV
        }

        private bool m_processing = false;
        private NetworkManager m_netMgr = null;

        private ConcurrentDictionary<ProcessData, Process> m_cctvProcessList = new ConcurrentDictionary<ProcessData, Process>();

        public string Path
        {
            get; set;
        }

        public ProcessManager(NetworkManager netMgr)
        {
            m_netMgr = netMgr;
        }

        public void SendMessageToProcess(Process process, int header, object param1 = null, object param2 = null, object param3 = null, object param4 = null, object param5 = null)
        {
            string msg = GetMessage(header, param1, param2, param3, param4, param5);
            byte[] buff = System.Text.Encoding.Default.GetBytes(msg);

            COPYDATASTRUCT data = new COPYDATASTRUCT();
            data.dwData = IntPtr.Zero;
            data.cbData = buff.Length + 1;
            data.lpData = msg;
            SendMessage(process.MainWindowHandle, WM_COPYDATA, 0, ref data);

            System.Diagnostics.Trace.WriteLine("SendMessage : " + msg);
        }

        private void OpenCCTV(Process process, string strMarkNo, int? cctv1, int? cctv2, int? cctv3, int? cctv4)
        {
            SendMessageToProcess(process, (int)ProcessMessageType.OpenCCTV, strMarkNo, cctv1, cctv2, cctv3, cctv4);
        }

        private string GetMessage(int header, object param1, object param2, object param3, object param4, object param5)
        {
            string str = header.ToString();

            if (param1 != null)
            {
                str += "," + param1.ToString();

                if (param2 != null)
                {
                    str += "," + param2.ToString();

                    if (param3 != null)
                    {
                        str += "," + param3.ToString();

                        if (param4 != null)
                        {
                            str += "," + param4.ToString();

                            if (param5 != null)
                            {
                                str += "," + param5.ToString();
                            }
                        }
                    }
                }
            }

            return str;
        }

        public void SetUrl(string[] tokens, ClientController controller)
        {
            int len = tokens.Length;

            if (len >= 2)
            {
                string url = tokens[1].Trim();
                controller.Url = url;
            }
        }

        public void RequestCCTVList(string[] tokens)
        {
            int len = tokens.Length;

            if (len >= 2)
            {
                int? userID = GetInt(tokens[1].Trim());

                if (userID == null)
                    return;

                List<ProcessData> keys = new List<ProcessData>();
                keys.AddRange(m_cctvProcessList.Keys);

                string strParameter = "";

                foreach (var key in keys)
                {
                    if (key.UserID != (int)userID)
                        continue;

                    if (strParameter.Length == 0)
                        strParameter = key.Guid + "," + GetString(key.SensorZoneHistoryID);
                    else
                        strParameter += "," + key.Guid + "," + GetString(key.SensorZoneHistoryID);
                }

                if (strParameter.Length > 0)
                {
                    m_netMgr.SendData((int)NetworkManager.AppToWeb.CCTVList, strParameter);
                }
            }
        }

        public void CloseCCTV(string[] tokens)
        {
            int len = tokens.Length;

            if (len >= 3)
            {
                string strGuid = tokens[1].Trim();
                int? userID = GetInt(tokens[2].Trim());

                if (userID == null)
                    return;

                List<ProcessData> keys = new List<ProcessData>();
                keys.AddRange(m_cctvProcessList.Keys);

                foreach (var key in keys)
                {
                    if (key.UserID == (int)userID && key.Guid == strGuid)
                    {
                        Process process;

                        if (m_cctvProcessList.TryGetValue(key, out process))
                        {
                            process.Kill();
                            m_cctvProcessList.TryRemove(key, out process);
                        }
                    }
                }
            }
        }

        public void CloseAll(string[] tokens)
        {
            int len = tokens.Length;

            if (len >= 2)
            {
                int? userID = GetInt(tokens[1].Trim());
                
                if (userID == null)
                    return;

                List<ProcessData> keys = new List<ProcessData>();
                keys.AddRange(m_cctvProcessList.Keys);

                foreach (var key in keys)
                {
                    if (key.UserID != (int)userID)
                        continue;

                    Process process;

                    if (m_cctvProcessList.TryGetValue(key, out process))
                    {
                        process.Kill();
                        m_cctvProcessList.TryRemove(key, out process);
                    }
                }
            }
        }

        public void ShowCCTV(string[] tokens)
        {
            int len = tokens.Length;

            if (len >= 3)
            {
                int? userID = GetInt(tokens[1].Trim());
                bool? visible = GetBoolean(tokens[2].Trim());

                if (userID == null || visible == null)
                    return;

                List<ProcessData> keys = new List<ProcessData>();
                keys.AddRange(m_cctvProcessList.Keys);

                foreach (var key in keys)
                {
                    if (key.UserID != (int)userID)
                        continue;

                    Process process;

                    if (m_cctvProcessList.TryGetValue(key, out process))
                    {
                        if (process.HasExited == false)
                        {
                            SendMessageToProcess(process, (int)ProcessMessageType.ShowCCTV, (bool)visible);
                        }
                    }
                }
            }
        }

        public void OpenCCTV(string[] tokens, string strUrl)
        {
            int len = tokens.Length;

            if (len >= 12)
            {
                string strGuid = tokens[1].Trim();
                int? userID = GetInt(tokens[2].Trim());
                int? markNo = GetInt(tokens[3].Trim());
                string strTitle = tokens[4].Trim();
                int? sensorZoneHistoryID = GetInt(tokens[5].Trim());
                int? x = GetInt(tokens[6].Trim());
                int? y = GetInt(tokens[7].Trim());
                int? cctv1 = GetInt(tokens[8].Trim());
                int? cctv2 = GetInt(tokens[9].Trim());
                int? cctv3 = GetInt(tokens[10].Trim());
                int? cctv4 = GetInt(tokens[11].Trim());

                if (userID == null)
                    return;

                Process _process = GetProcess(strGuid, (int)userID);

                if (_process != null)
                {
                    // 기존 Process의 CCTV List를 바꾼다.
                    OpenCCTV(_process, GetString(markNo), cctv1, cctv2, cctv3, cctv4);
                }
                else
                {
                    // 새로운 Process를 실행시킨다.
                    if (userID != null && x != null && y != null && cctv1 != null && strGuid != null && strGuid.Length > 0)
                    {
                        ProcessStartInfo info = new ProcessStartInfo();
                        info.ArgumentList.Add(strUrl);
                        string strParam = "une.popup.cctv://" + strGuid + "/" + GetString(userID) + "/" + GetString(markNo) + "/" + strTitle + "/" + GetString(sensorZoneHistoryID) + "/" + GetString(x) + "," + GetString(y) + "/" + GetString(cctv1);

                        if (cctv2 != null)
                            strParam += "/" + GetString(cctv2);
                        if (cctv3 != null)
                            strParam += "/" + GetString(cctv3);
                        if (cctv4 != null)
                            strParam += "/" + GetString(cctv4);

                        info.ArgumentList.Add(strParam);
                        System.Diagnostics.Trace.WriteLine("Open New Popup : " + strParam);

                        string strFolder, strExe;

                        if (ParsePath(Path, out strFolder, out strExe))
                        {
                            info.WorkingDirectory = strFolder;
                            info.FileName = Path;

                            try
                            {
                                Process process = Process.Start(info);

                                if (process != null)
                                {
                                    ProcessData processData = new ProcessData(strGuid, (int)userID, sensorZoneHistoryID);
                                    m_cctvProcessList[processData] = process;
                                }
                            }
                            catch (Exception ex)
                            {
                                System.Diagnostics.Trace.WriteLine("Process.Start Error : " + ex.Message + " (Path=" + Path + ")");
                            }
                        }
                    }
                }
            }
        }

        private Process GetProcess(string strGuid, int userID)
        {
            List<ProcessData> keys = new List<ProcessData>();
            keys.AddRange(m_cctvProcessList.Keys);

            foreach (var key in keys)
            {
                if (key.Guid == strGuid && key.UserID == userID)
                {
                    Process process;

                    if (m_cctvProcessList.TryGetValue(key, out process))
                        return process;
                    else
                        return null;
                }
            }

            return null;
        }

        private bool ParsePath(string strPath, out string strFolder, out string strExe)
        {
            strFolder = strExe = null;

            if (string.IsNullOrEmpty(strPath))
                return false;

            int index = strPath.LastIndexOf('\\');

            if (index > 0)
            {
                strFolder = strPath.Substring(0, index);
                strExe = strPath.Substring(index + 1);
                return true;
            }

            return false;
        }

        private string GetString(int? data)
        {
            if (data == null)
                return "null";

            return data.ToString();
        }

        private bool? GetBoolean(string str)
        {
            if (str.Length == 0)
                return null;

            string strLower = str.ToLower();

            if (strLower == "1" || strLower == "true")
                return true;
            else if (strLower == "0" || strLower == "false")
                return false;

            return null;
        }

        private int? GetInt(string str)
        {
            if (str.Length == 0)
                return null;

            int data;

            if (int.TryParse(str, out data))
                return data;

            return null;
        }

        public void CheckProcess()
        {
            if (m_processing)
                return;

            m_processing = true;

            List<ProcessData> keys = new List<ProcessData>();
            keys.AddRange(m_cctvProcessList.Keys);

            foreach (var key in keys)
            {
                Process process;

                if (m_cctvProcessList.TryGetValue(key, out process))
                {
                    if (process.HasExited)
                    {
                        if (m_cctvProcessList.TryRemove(key, out process))
                        {
                            m_netMgr.SendData((int)NetworkManager.AppToWeb.CloseCCTV, key.Guid);
                        }
                    }
                }
            }

            m_processing = false;
        }
    }
}
