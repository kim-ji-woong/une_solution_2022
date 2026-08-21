using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnEcctv
{
    class CommandManager
    {
        public static bool CloseAll(string strCommand, string strUrl)
        {
            int index = strCommand.IndexOf('/');

            if (index > 0)
            {
                string strUserID = strCommand.Substring(0, index).Trim();
                int userID;

                if (int.TryParse(strUserID, out userID))
                {
                    WebServiceManager webServiceManager = new WebServiceManager(strUrl);

                    // DB에서 먼저 데이터들을 삭제한 이후에 Process를 종료시킨다.
                    if (webServiceManager.CloseCCTVPopups(userID))
                    {
                        System.Diagnostics.Process[] processes = System.Diagnostics.Process.GetProcessesByName(System.Diagnostics.Process.GetCurrentProcess().ProcessName);

                        if (processes != null)
                        {
                            foreach (var process in processes)
                            {
                                process.Kill();
                            }
                        }
                    }
                }
            }

            return false;
        }

        public static bool ShowAll(string strCommand, bool visible, string strUrl)
        {
            int index = strCommand.IndexOf('/');

            if (index > 0)
            {
                string strUserID = strCommand.Substring(0, index).Trim();
                int userID;

                if (int.TryParse(strUserID, out userID))
                {
                    WebServiceManager webServiceManager = new WebServiceManager(strUrl);

                    // DB에서 먼저 데이터들을 업데이트한 이후에 Process를 종료시킨다.
                    if (webServiceManager.ShowCCTVPopups(userID, visible))
                    {
                        System.Diagnostics.Process[] processes = System.Diagnostics.Process.GetProcessesByName(System.Diagnostics.Process.GetCurrentProcess().ProcessName);

                        if (processes != null)
                        {
                            foreach (var process in processes)
                            {
                                process.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Normal;
                            }
                        }
                    }
                }
            }

            return false;
        }
    }
}
