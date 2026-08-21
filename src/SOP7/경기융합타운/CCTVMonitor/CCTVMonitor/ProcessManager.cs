using System;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Collections.Generic;
using System.Collections.Concurrent;

namespace CCTVMonitor
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

        public enum ProcessMessage
        {
            OpenCCTV = 1
        }

        private bool m_processing = false;
        private NetworkManager m_netMgr = null;

        private ConcurrentDictionary<string, Process> m_cctvProcessList = new ConcurrentDictionary<string, Process>();

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
            IntPtr result = SendMessage(process.MainWindowHandle, WM_COPYDATA, 0, ref data);
        }

        private void OpenCCTV(Process process, int? cctv1, int? cctv2, int? cctv3, int? cctv4)
        {
            SendMessageToProcess(process, (int)ProcessMessage.OpenCCTV, cctv1, cctv2, cctv3, cctv4);
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

        public void OpenCCTV(string[] tokens)
        {
            int len = tokens.Length;

            if (len >= 11)
            {
                string strGuid = tokens[1].Trim();
                int? userID = GetInt(tokens[2].Trim());
                string strTitle = tokens[3].Trim();
                int? sensorZoneHistoryID = GetInt(tokens[4].Trim());
                int? x = GetInt(tokens[5].Trim());
                int? y = GetInt(tokens[6].Trim());
                int? cctv1 = GetInt(tokens[7].Trim());
                int? cctv2 = GetInt(tokens[8].Trim());
                int? cctv3 = GetInt(tokens[9].Trim());
                int? cctv4 = GetInt(tokens[10].Trim());

                Process _process;

                if (m_cctvProcessList.TryGetValue(strGuid, out _process))
                {
                    OpenCCTV(_process, cctv1, cctv2, cctv3, cctv4);
                }
                else
                {
                    if (userID != null && x != null && y != null && cctv1 != null && strGuid != null && strGuid.Length > 0)
                    {
                        ProcessStartInfo info = new ProcessStartInfo();
                        info.Arguments = "une.popup.cctv://" + strGuid + "/" + GetString(userID) + "/" + strTitle + "/" + GetString(sensorZoneHistoryID) + "/" + GetString(x) + "," + GetString(y) + "/" + GetString(cctv1);

                        if (cctv2 != null)
                            info.Arguments += "/" + GetString(cctv2);
                        if (cctv3 != null)
                            info.Arguments += "/" + GetString(cctv3);
                        if (cctv4 != null)
                            info.Arguments += "/" + GetString(cctv4);

                        string strFolder, strExe;

                        if (ParsePath(Path, out strFolder, out strExe))
                        {
                            info.WorkingDirectory = strFolder;
                            info.FileName = Path;

                            Process process = Process.Start(info);

                            if (process != null)
                            {
                                m_cctvProcessList[strGuid] = process;
                            }
                        }
                    }
                }
            }
        }

        private bool ParsePath(string strPath, out string strFolder, out string strExe)
        {
            int index = strPath.LastIndexOf('\\');

            if (index > 0)
            {
                strFolder = strPath.Substring(0, index);
                strExe = strPath.Substring(index + 1);
                return true;
            }

            strFolder = strExe = null;
            return false;
        }

        private string GetString(int? data)
        {
            if (data == null)
                return "null";

            return data.ToString();
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

            List<string> guidList = new List<string>();
            guidList.AddRange(m_cctvProcessList.Keys);

            foreach (string guid in guidList)
            {
                Process process;

                if (m_cctvProcessList.TryGetValue(guid, out process))
                {
                    if (process.HasExited)
                    {
                        if (m_cctvProcessList.TryRemove(guid, out process))
                        {
                            m_netMgr.SendData((int)NetworkManager.AppToWeb.CloseCCTV, guid);
                        }
                    }
                }
            }

            m_processing = false;
        }
    }
}
