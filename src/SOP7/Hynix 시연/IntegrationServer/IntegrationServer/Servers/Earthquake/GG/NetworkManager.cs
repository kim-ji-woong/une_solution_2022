using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.Servers.Earthquake.GG
{
    using ViewModels.Earthquake;
    using Datas;

    class NetworkManager
    {
        private EarthquakeManager m_owner = null;
        private IDataManager m_dataManager = null;
        private int m_nSiteID = -1;
        private IController m_controller = null;

        public NetworkManager(EarthquakeManager owner, IDataManager dataManager, int nSiteID)
        {
            m_owner = owner;
            m_dataManager = dataManager;
            m_nSiteID = nSiteID;
        }

        public void Start(string strServerIP, int nPort)
        {
            m_controller = new UdpController(this);
            m_controller.Start(strServerIP, nPort);
        }

        public void Stop()
        {
            m_controller.Stop();
        }

        public void ProcessMessage(byte[] bytes, int len)
        {
            WriteBinaryLog(bytes, 0, len, "[Receive]");

            if (len >= 120)
            {
                DateTime timeStamp = EpochToDateTime(GetBytes(bytes, 12, 4)).ToLocalTime();

                byte[] bytesHpga = GetBytes(bytes, 76, 4);
                byte[] bytesTpga = GetBytes(bytes, 80, 4);

                byte[] inverseBytesHpga = Inverse(bytesHpga);
                byte[] inverseBytesTpga = Inverse(bytesTpga);

                float fHpga = BitConverter.ToSingle(inverseBytesHpga, 0);
                float fTpga = BitConverter.ToSingle(inverseBytesTpga, 0);
                double gal = fHpga > fTpga ? fHpga : fTpga;

                int intensity = IntensityManager.GetIntensity(gal);

                string strLog = string.Format("Time : {0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}, hpga : {6}, tpga : {7}, intensity : {8}",
                    timeStamp.Year, timeStamp.Month, timeStamp.Day, timeStamp.Hour, timeStamp.Minute, timeStamp.Second,
                    fHpga, fTpga, intensity);
                //m_owner.WriteLog(strLog);

                UpdateDB(timeStamp, fHpga, fTpga, gal, intensity);

                int alarmLevel = IntensityManager.GetAlarmLevel(gal, out intensity);
                m_owner.SendSensorData(alarmLevel > 0, alarmLevel * 10000 + intensity);
            }
        }

        // 1분에 한번씩 가장 큰 값을 기록한다.
        private void UpdateDB(DateTime timeStamp, float fHpga, float fTpga, double gal, int intensity)
        {
            string strCondition = string.Format("{0} = '{1}-{2:00}-{3:00} {4:00}:{5:00}:00'",
                EarthquakeHistory.Fields.TimeStamp,
                timeStamp.Year, timeStamp.Month, timeStamp.Day, timeStamp.Hour, timeStamp.Minute);

            string strErrorMessage;

            EarthquakeHistory history = m_dataManager.GetSelect().SelectFirst<EarthquakeHistory>(strCondition, out strErrorMessage);

            if (history == null)
            {
                history = new EarthquakeHistory();
                history.TimeStamp = new DateTime(timeStamp.Year, timeStamp.Month, timeStamp.Day, timeStamp.Hour, timeStamp.Minute, 0);
                history.Hpga = fHpga;
                history.Tpga = fTpga;
                history.Gal = gal;
                history.Intensity = intensity;

                if (m_dataManager.GetCreate().Insert<EarthquakeHistory>(history, out strErrorMessage) == false)
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                DeleteOldDB(history.TimeStamp);
            }
            else
            {
                if (history.Gal < gal)
                {
                    // 같은 분 내에서 가장 큰 gal 값을 저장한다.
                    history.Hpga = fHpga;
                    history.Tpga = fTpga;
                    history.Gal = gal;
                    history.Intensity = intensity;

                    m_dataManager.GetUpdate().Update<EarthquakeHistory>(history, null, out strErrorMessage);
                }
            }
        }

        // timeStamp보다 한달 이전의 데이터는 모두 삭제한다.
        private void DeleteOldDB(DateTime timeStamp)
        {
            DateTime time = timeStamp.AddMonths(-1);
            string strCondition = string.Format("{0} < '{1}-{2:00}-{3:00} 00:00:00'", EarthquakeHistory.Fields.TimeStamp, time.Year, time.Month, time.Day);

            string strErrorMessage;
            m_dataManager.GetDelete().Delete<EarthquakeHistory>(strCondition, out strErrorMessage);
        }

        private byte[] Inverse(byte[] bytes)
        {
            int len = bytes.Length;
            byte[] inverse = new byte[len];

            int index = 0;

            for (int i = len - 1; i >= 0; i--)
            {
                inverse[index++] = bytes[i];
            }

            return inverse;
        }

        private byte[] GetBytes(byte[] bytes, int beginIndex, int len)
        {
            byte[] _bytes = new byte[len];

            for (int i = 0; i < len; i++)
            {
                _bytes[i] = bytes[beginIndex + i];
            }

            return _bytes;
        }

        private DateTime EpochToDateTime(byte[] bytes)
        {
            long seconds = 256 * 256 * 256 * (long)bytes[0];
            seconds += 256 * 256 * (long)bytes[1];
            seconds += 256 * (long)bytes[2];
            seconds += (long)bytes[3];

            DateTime dtOrigin = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            DateTime dtResult = dtOrigin.AddSeconds((double)seconds);

            DateTimeOffset dtOffset = DateTimeOffset.FromUnixTimeSeconds(seconds);
            return dtOffset.DateTime;
        }

        private string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = GetByteString(bytes, nIndex, len);
            //m_owner.WriteLog(strTag + " : " + strBytesLog);
            return strTag + " : " + strBytesLog;
        }

        private string GetByteString(byte[] bytes, int nIndex, int len)
        {
            string strBytes = "";

            for (int i = nIndex; i < nIndex + len; i++)
            {
                byte b = bytes[i];

                if (strBytes.Length == 0)
                    strBytes = string.Format("\t\t{0:X2}", (int)b);
                else
                    strBytes += string.Format(" {0:X2}", (int)b);
            }

            return strBytes;
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            m_owner.WriteLog(strLog, type);
        }
    }

    interface IController
    {
        void Start(string strServerIP, int nPortNo);
        void Stop();
    }
}
