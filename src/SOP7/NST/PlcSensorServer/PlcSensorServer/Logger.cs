using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace PlcSensorServer
{
    public class Logger
    {
        private static Logger m_instance = new Logger();

        private string m_strLogFolder = "";
        private double m_dLogLifeDays = 30;
        private string m_strLogTag = "";

        private static int m_nPrevYear = 0, m_nPrevMonth = 0, m_nPrevDay = 0;

        private StreamWriter m_writer = null;
        private ConcurrentQueue<KeyValuePair<string, DateTime>> m_queueLogs = new ConcurrentQueue<KeyValuePair<string, DateTime>>();
        private bool m_runWriteLog = false;

        public static Logger Instance
        {
            get
            {
                /*if (m_instance == null)
                    m_instance = new Logger();*/

                return m_instance;
            }
        }

        private Logger()
        {
            m_strLogFolder = System.Configuration.ConfigurationManager.AppSettings["logFolder"].ToString();
            m_strLogTag = System.Configuration.ConfigurationManager.AppSettings["logFileTag"].ToString();

            string strLifeTime = System.Configuration.ConfigurationManager.AppSettings["logLifeTime"].ToString();
            double.TryParse(strLifeTime, out m_dLogLifeDays);

            RunWriteLog();
        }

        public void Write(string strLog)
        {
            AddLog(strLog);
            /*if (m_strLogFolder.Length == 0)
                return;

            if (!Directory.Exists(m_strLogFolder))
                Directory.CreateDirectory(m_strLogFolder);

            DateTime dtNow = DateTime.Now;

            string strFilePath = m_strLogFolder + string.Format("\\{3}_{0}{1:00}{2:00}.log", dtNow.Year, dtNow.Month, dtNow.Day, m_strLogTag);
            StreamWriter writer = m_writer;

            try
            {
                if (!File.Exists(strFilePath))
                {
                    if (writer != null)
                        writer.Close();

                    writer = new StreamWriter(strFilePath, false, Encoding.UTF8);
                }
                else if (writer == null)
                {
                    writer = new StreamWriter(strFilePath, true, Encoding.UTF8);
                }

                string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
                writer.WriteLine("[" + strTime + "] " + strLog);
                writer.Flush();
            }
            catch (Exception ex)
            {
                if (writer != null)
                {
                    writer.Close();
                }

                System.Diagnostics.Trace.WriteLine("Logger.Write Error : " + ex.Message);
                m_writer = null;
                return;
            }

            m_writer = writer;*/
        }

        private void AddLog(string strLog)
        {
            m_queueLogs.Enqueue(new KeyValuePair<string, DateTime>(strLog, DateTime.Now));
        }

        private void RunWriteLog()
        {
            if (m_strLogFolder.Length == 0)
                return;

            if (!Directory.Exists(m_strLogFolder))
                Directory.CreateDirectory(m_strLogFolder);

            m_runWriteLog = true;
            Task task = WriteLog_Async();
        }

        private async Task WriteLog_Async()
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            KeyValuePair<string, DateTime> pair;

            while (m_runWriteLog)
            {
                while (m_queueLogs.TryDequeue(out pair))
                {
                    string strLog = pair.Key;
                    DateTime dtLog = pair.Value;

                    string strFilePath = m_strLogFolder + string.Format("\\{3}_{0}{1:00}{2:00}.log", dtLog.Year, dtLog.Month, dtLog.Day, m_strLogTag);
                    StreamWriter writer = m_writer;

                    try
                    {
                        if (!File.Exists(strFilePath))
                        {
                            if (writer != null)
                                writer.Close();

                            writer = new StreamWriter(strFilePath, false, Encoding.UTF8);
                        }
                        else if (writer == null)
                        {
                            writer = new StreamWriter(strFilePath, true, Encoding.UTF8);
                        }

                        string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", dtLog.Year, dtLog.Month, dtLog.Day, dtLog.Hour, dtLog.Minute, dtLog.Second);
                        writer.WriteLine("[" + strTime + "] " + strLog);
                        writer.Flush();
                    }
                    catch (Exception ex)
                    {
                        if (writer != null)
                        {
                            writer.Close();
                        }

                        System.Diagnostics.Trace.WriteLine("Logger.Write Error : " + ex.Message);
                        m_writer = null;
                        return;
                    }

                    m_writer = writer;
                }

                await Task.Delay(1000);
            }
        }

        public Logger Clone(string strTag)
        {
            Logger logger = new Logger();
            logger.m_strLogTag = strTag;
            return logger;
        }

        public void Close()
        {
            StreamWriter writer = m_writer;

            try
            {
                if (writer != null)
                {
                    writer.Close();
                }
            }
            catch (Exception)
            {
            }

            m_writer = null;
            m_runWriteLog = false;
        }

        public void RemoveOldLogs()
        {
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
                int nIndex = strFile.LastIndexOf('_');

                if (nIndex < 0)
                    continue;

                string strFileDate = strFile.Substring(nIndex + 1, 8);

                if (strFileDate.CompareTo(strDate) < 0)
                    File.Delete(strFile);
            }
        }

        public static string GetByteString(byte[] bytes)
        {
            string strBytes = "";

            foreach (byte b in bytes)
            {
                if (strBytes.Length == 0)
                    strBytes = string.Format("\t\t{0:X2}", (int)b);
                else
                    strBytes += string.Format(" {0:X2}", (int)b);
            }

            return strBytes;
        }
    }
}
