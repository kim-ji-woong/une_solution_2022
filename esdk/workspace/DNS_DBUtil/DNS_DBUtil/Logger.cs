using System;
using System.Configuration;
using System.IO;
using System.Text;

namespace dnsDBUtil
{
    public class Logger
    {
        private static Logger m_instance = null;

        private string m_strLogFolder = "";
        private double m_dLogLifeDays = 30;
        private string m_strLogTag = "";

        private int m_nPrevYear = 0, m_nPrevMonth = 0, m_nPrevDay = 0;

        private StreamWriter m_writer = null;

        public static Logger Instance
        {
            get
            {
                if (m_instance == null)
                    m_instance = new Logger();

                return m_instance;
            }
        }
        public string LogFolder
        {
            get { return m_strLogFolder; }
            set { m_strLogFolder = value; }
        }

        public double LogLifeDays
        {
            get { return m_dLogLifeDays; }
            set { m_dLogLifeDays = value; }
        }

        public string LogTag
        {
            get { return m_strLogTag; }
            set { m_strLogTag = value; }
        }

        private Logger()
        {
        }

        public void Write(string strLog)
        {
            if (m_strLogFolder == null || m_strLogFolder == null || m_writer == null)
                return;

            if (!Directory.Exists(m_strLogFolder))
                Directory.CreateDirectory(m_strLogFolder);

            DateTime dtNow = DateTime.Now;

            string strFilePath = m_strLogFolder + string.Format("\\{3}_{0}{1:00}{2:00}.log", dtNow.Year, dtNow.Month, dtNow.Day, m_strLogTag);

            try
            {
                if (!File.Exists(strFilePath))
                {
                    if (m_writer != null)
                        m_writer.Close();

                    m_writer = new StreamWriter(strFilePath, false, Encoding.UTF8);
                }
                else if (m_writer == null)
                {
                    m_writer = new StreamWriter(strFilePath, true, Encoding.UTF8);
                }

                string strTime = string.Format("{0:00}:{1:00}:{2:00}", dtNow.Hour, dtNow.Minute, dtNow.Second);
                m_writer.WriteLine(strTime + " : " + strLog);
                m_writer.Flush();
            }
            catch (Exception)
            {
                return;
            }

            if (m_nPrevYear != dtNow.Year || m_nPrevMonth != dtNow.Month || m_nPrevDay != dtNow.Day)
            {
                m_nPrevYear = dtNow.Year;
                m_nPrevMonth = dtNow.Month;
                m_nPrevDay = dtNow.Day;

                RemoveOldLogs();
            }
        }

        public void RemoveOldLogs()
        {
            if (m_strLogFolder == null)
                return;

            if (!Directory.Exists(m_strLogFolder))
                return;

            DateTime dtNow = DateTime.Now;

            if (dtNow.Year != m_nPrevYear && dtNow.Month != m_nPrevMonth && dtNow.Day != m_nPrevDay)
            {
                m_nPrevYear = dtNow.Year;
                m_nPrevMonth = dtNow.Month;
                m_nPrevDay = dtNow.Day;
            }
            else
                return;

            DateTime dtLimit = dtNow.AddDays(-m_dLogLifeDays);
            string strDate = string.Format("{0}{1:00}{2:00}", dtLimit.Year, dtLimit.Month, dtLimit.Day);

            foreach (string strFile in Directory.GetFiles(m_strLogFolder, "*.log"))
            {
                int nIndex = strFile.LastIndexOf('\\');

                if (nIndex < 0)
                    continue;

                string strFileDate = strFile.Substring(nIndex + 1, 8);

                if (strFileDate.CompareTo(strDate) < 0)
                    File.Delete(strFile);
            }
        }
    }
}
