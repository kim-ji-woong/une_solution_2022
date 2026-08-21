using System;
using System.IO;
using System.Diagnostics;
using System.Configuration;

namespace CCTVManager
{
    class Executer
    {
        public static void Run(string strUrl, string strTitle, int x, int y, int id)
        {
            string strUserID = "1";
            string strMarkNo = "null";
            string strSensorZoneHistoryID = "null";

            ProcessStartInfo info = new ProcessStartInfo();
            info.ArgumentList.Add(strUrl);
            string strParam = "une.popup.cctv://" + Guid.NewGuid().ToString() + "/" + strUserID + "/" + strMarkNo + "/" + strTitle + "/" + strSensorZoneHistoryID + "/" + x.ToString() + "," + y.ToString() + "/" + id.ToString();

            info.ArgumentList.Add(strParam);
            Trace.WriteLine("Open New Popup : " + strParam);

            string strPath;
            string strFolder, strExe;

            if (ParsePath(out strPath, out strFolder, out strExe))
            {
                info.WorkingDirectory = strFolder;
                info.FileName = strPath;

                Process.Start(info);
            }
        }

        private static bool ParsePath(out string strPath, out string strFolder, out string strExe)
        {
            strFolder = strExe = null;
            strPath = ConfigurationManager.AppSettings.Get("Exe");

            if (strPath == null || strPath.Length == 0)
                return false;

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
    }
}
