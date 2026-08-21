using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.IO;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Windows.Forms;

namespace EarthquakeReader
{
    using Data;

    public partial class FormMain : Form
    {
        private DataManager m_dataManager = null;
        private StreamWriter m_writer = new StreamWriter(".\\Earth.log", false, Encoding.UTF8);

        private const string FileName = ".\\Earth.dat";

        public FormMain()
        {
            InitializeComponent();
            ReadText();
            labelLog.Text = "";
        }

        private void btnRead_Click(object sender, EventArgs e)
        {
            labelLog.Text = "";

            string strID = textBoxID.Text.Trim();
            string strPW = textBoxPW.Text.Trim();
            string strIP = textBoxIP.Text.Trim();
            string strDBName = textBoxDBName.Text.Trim();
            WriteText();

            m_dataManager = new DataManager(1, strIP, strDBName, strID, strPW);

            DateTime dtKLast;

            if (GetLastID(out dtKLast) == false)
            {
                WriteLog("GetLastID Fail");
                return;
            }

            try
            {
                ReadEvent(ref dtKLast);
            }
            catch (Exception ex)
            {
                WriteLog("[ERROR] MonitoringThread() : " + ex.Message);
                System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + ex.Message);
            }
        }

        private bool GetLastID(out DateTime dtKLast)
        {
            dtKLast = DateTime.Now;

            string strErrorMessage;
            string strCondition = string.Format("{0} = (select max({0}) from {1})", KEvtInfo.Fields.REGDATE, KEvtInfo.TableName);

            // 행정안전부 센서
            KEvtInfo kEvtInfo = m_dataManager.GetSelect().SelectFirst<KEvtInfo>(strCondition, out strErrorMessage);

            if (kEvtInfo == null)
            {
                if (strErrorMessage != null)
                {
                    WriteLog("KEvtInfo ReadFirst Fail : " + strErrorMessage);
                    return false;
                }
            }
            else if (kEvtInfo.REGDATE != null)
                dtKLast = (DateTime)kEvtInfo.REGDATE;

            return true;
        }

        private bool ReadEvent(ref DateTime dtKLast)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} > '{1}' order by {0} desc", KEvtInfo.Fields.REGDATE, GetTimeString(dtKLast));

            // 행정안전부 센서
            KEvtInfo kEvtInfo = m_dataManager.GetSelect().SelectFirst<KEvtInfo>(strCondition, out strErrorMessage);

            if (kEvtInfo == null)
            {
                if (strErrorMessage != null)
                {
                    WriteLog("KEvtInfo ReadLast Fail : " + strErrorMessage);
                    return false;
                }
            }
            else if (kEvtInfo.REGDATE != null)
            {
                // 읽은 시간에 초 미만의 milliseconds가 있을수 있기 때문에 깔끔하게 1초를 더한다.
                dtKLast = ((DateTime)kEvtInfo.REGDATE).AddSeconds(1);
            }

            // UDP 통신으로 대체한다.
            /*// 자체 센서 측정값을 우선적으로 처리한다.
            if (hEvtInfo != null)
            {
                int intensity;
                int alarmLevel = IntensityManager.GetAlarmLevel(hEvtInfo, out intensity);
                return SendSensorData(alarmLevel > 0, alarmLevel * 10000 + intensity);
            }
            else*/
            if (kEvtInfo != null)
            {
                // nMagnitude는 실제 규모값에 100을 곱한값이다.
                int nMagnitude;
                int alarmLevel = MagnitudeManager.GetAlarmLevel(kEvtInfo, out nMagnitude);
                WriteLog("AlarmLevel : " + alarmLevel + ", 규모 : " + nMagnitude);
            }

            return true;
        }

        public void WriteLog(string strLog)
        {
            DateTime dtNow = DateTime.Now;

            m_writer.WriteLine(string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00} : {6}",
                dtNow.Year, dtNow.Month, dtNow.Day,
                dtNow.Hour, dtNow.Minute, dtNow.Second,
                strLog));

            m_writer.Flush();

            labelLog.Text = strLog;
        }

        private string GetTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private void ReadText()
        {
            if (File.Exists(FileName) == false)
                return;

            StreamReader reader = new StreamReader(FileName, Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                int index = strLine.IndexOf(':');

                if (index < 0)
                    continue;

                string strPropertyName = strLine.Substring(0, index).Trim();
                string strPropertyValue = strLine.Substring(index + 1).Trim();

                if (strPropertyName == "ID")
                    textBoxID.Text = strPropertyValue;
                else if (strPropertyName == "PW")
                    textBoxPW.Text = strPropertyValue;
                else if (strPropertyName == "IP")
                    textBoxIP.Text = strPropertyValue;
                else if (strPropertyName == "DB")
                    textBoxDBName.Text = strPropertyValue;
            }

            reader.Close();
        }

        private void WriteText()
        {
            StreamWriter writer = new StreamWriter(FileName, false, Encoding.UTF8);

            writer.WriteLine("ID : " + textBoxID.Text.Trim());
            writer.WriteLine("PW : " + textBoxPW.Text.Trim());
            writer.WriteLine("IP : " + textBoxIP.Text.Trim());
            writer.WriteLine("DB : " + textBoxDBName.Text.Trim());

            writer.Close();
        }
    }
}
