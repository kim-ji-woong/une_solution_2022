using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using System.Windows.Forms;
using System;

namespace AlarmLinker
{
    using Models;

    public class Service
    {
        private bool m_processing = false;
        private AlarmChecker m_alarmChecker = null;
        private UpdateManager m_updateManager = null;
        private uint m_nProcessCount = 0;

        private IDataManager m_ownDBManager = null;
        private List<IDataManager> m_externalDBManagers = null;

        public Service(IDataManager ownDBManager, List<IDataManager> externalDBManagers, Label labelErrorMessage = null)
        {
            if (externalDBManagers.Count > 0)
            {
                m_alarmChecker = new AlarmChecker(ownDBManager, externalDBManagers, labelErrorMessage);
                m_updateManager = new UpdateManager(ownDBManager, externalDBManagers);

                m_ownDBManager = ownDBManager;
                m_externalDBManagers = externalDBManagers;
            }
        }

        public static IDataManager GetDataManager(string strDBName, string strDBInfo)
        {
            string strDBHost, strID, strPW;

            if (GetDBInfo(strDBInfo, out strDBHost, out strID, out strPW))
            {
                DataManager dataManager = new DataManager(0, strDBHost, strDBName, strID, strPW);
                return dataManager;
            }

            return null;
        }

        private static bool GetDBInfo(string strSrc, out string strDBHost, out string strID, out string strPW)
        {
            string strOrigin = AES256Cipher.AES_decrypt(strSrc);
            string[] tokens = strOrigin.Split('-');

            int count = tokens.Length;

            if (count >= 3)
            {
                strDBHost = tokens[0].Trim();
                strID = tokens[1].Trim();
                strPW = tokens[2].Trim();

                return true;
            }

            strDBHost = null;
            strID = null;
            strPW = null;

            return false;
        }

        public void Run()
        {
            if (m_processing)
                return;

            m_processing = true;

            if (m_alarmChecker != null)
                m_alarmChecker.Process();

            if (m_nProcessCount++ % 3 == 0)
            {
                // UpdateData 처리는 가끔씩만 하도록 한다.
                m_updateManager.Process();
            }

            m_processing = false;
        }

        public void UpdateElevator()
        {
            string strErrorMessage;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                IEnumerable<Elevator> elevators = dataManager.GetSelect().Select<Elevator>(null, out strErrorMessage);

                if (elevators == null)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateElevator Error : " + strErrorMessage);
                    return;
                }

                List<Elevator> _elevators = new List<Elevator>();
                _elevators.AddRange(elevators);

                if (m_ownDBManager.GetUpdate().Update<Elevator>(_elevators, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateElevator Error2 : " + strErrorMessage);
                    return;
                }    

                break;
            }
        }

        public void UpdateEarthquakeHistory()
        {
            string strErrorMessage;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                IEnumerable<EarthquakeHistory> histories = dataManager.GetSelect().Select<EarthquakeHistory>(null, out strErrorMessage);

                if (histories == null)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateEarthquakeHistory Error : " + strErrorMessage);
                    return;
                }

                IEnumerable<EarthquakeHistory> ownHistories = m_ownDBManager.GetSelect().Select<EarthquakeHistory>(null, out strErrorMessage);

                if (histories == null)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateEarthquakeHistory Error2 : " + strErrorMessage);
                    return;
                }

                Dictionary<DateTime, EarthquakeHistory> dicHistories = new Dictionary<DateTime, EarthquakeHistory>();

                foreach (var ownHistory in ownHistories)
                {
                    dicHistories[ownHistory.TimeStamp] = ownHistory;
                }

                List<EarthquakeHistory> updateHistories = new List<EarthquakeHistory>();
                List<EarthquakeHistory> insertHistories = new List<EarthquakeHistory>();

                foreach (var history in histories)
                {
                    if (dicHistories.ContainsKey(history.TimeStamp))
                    {
                        // update는 필요없음
                        //updateHistories.Add(history);
                    }
                    else
                        insertHistories.Add(history);
                }

                if (updateHistories.Count > 0)
                {
                    if (m_ownDBManager.GetUpdate().Update<EarthquakeHistory>(updateHistories, out strErrorMessage) == false)
                    {
                        System.Diagnostics.Trace.WriteLine("UpdateEarthquakeHistory Error3 : " + strErrorMessage);
                        return;
                    }
                }

                foreach (var history in insertHistories)
                {
                    if (m_ownDBManager.GetCreate().Insert<EarthquakeHistory>(history, out strErrorMessage) == false)
                    {
                        System.Diagnostics.Trace.WriteLine("UpdateEarthquakeHistory Error4 : " + strErrorMessage);
                        return;
                    }
                }

                DeleteOldDB(m_ownDBManager);
                break;
            }
        }

        private DateTime m_prevTime = new DateTime();

        // 한달 이상 지난 DB Log는 삭제한다.
        private void DeleteOldDB(IDataManager dataManager)
        {
            DateTime dtNow = DateTime.Now;

            if (dtNow.Year == m_prevTime.Year && dtNow.Month == m_prevTime.Month && dtNow.Day == m_prevTime.Day)
                return;

            // 하루에 한번씩 DB를 삭제한다.
            DateTime time = dtNow.AddMonths(-1);
            string strCondition = string.Format("{0} < '{1}-{2:00}-{3:00} 00:00:00'", EarthquakeHistory.Fields.TimeStamp, time.Year, time.Month, time.Day);

            string strErrorMessage;
            dataManager.GetDelete().Delete<EarthquakeHistory>(strCondition, out strErrorMessage);
        }
    }
}
