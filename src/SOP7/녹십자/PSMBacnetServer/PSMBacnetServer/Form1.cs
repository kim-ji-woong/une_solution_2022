using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using System.Windows.Forms;

namespace PSMBacnetServer
{
    public partial class Form1 : Form
    {
        DataMgr m_dataMgr = null;
        BacnetMgr m_bacnetMgr = null;

        Dictionary<string, List<string>> m_dicSensorGroup = null;
        List<string> m_listAlarmKeys = null;

        private int m_nThreadReloadSleep = 1000 * 3;                // 쓰레드 다시 불러올 때 슬립타임
        private int m_nThreadSleep = 100 * 3;                       // 쓰레드 슬립타임
        private int m_nThreadGroupNum = 6;                          // 쓰레드 당 감시할 디바이스 갯수

        private bool m_shutdownThread = false;
        private int m_nShutdownThread = 0;                          // 쓰레드 실행 유무 판단 변수

        private System.Timers.Timer m_timerReload = null;
        private bool m_bTimerChk = false;                           // 이미 타이머 실행 유무 체크

        private DateTime m_dtLast = new DateTime();                 // 로그 관련

        public Form1()
        {
            InitializeComponent();

            string strErrorMessage = null;

            m_dataMgr = new DataMgr(out strErrorMessage);
            if (strErrorMessage != null && strErrorMessage.Length > 0)
            {
                //MessageBox.Show(strErrorMessage);
                Logger.Instance.Write("DataMgr 생성 실패: " + strErrorMessage);
                return;
            }

            m_bacnetMgr = new BacnetMgr(m_dataMgr, out strErrorMessage);
            if (strErrorMessage != null && strErrorMessage.Length > 0)
            {
                //MessageBox.Show(strErrorMessage);
                Logger.Instance.Write("BacnetMgr 생성 실패: " + strErrorMessage);
                return;
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            m_timerReload = new System.Timers.Timer();
            m_timerReload.Interval = 1000 * 60 * 60;       // 1분(1초 * 60) * 60 = 60분
            m_timerReload.Elapsed += new ElapsedEventHandler(timerReload_Elapsed);

            m_timerReload.Start();
            timerReload_Elapsed(null, null);
        }

        private void timerReload_Elapsed(object sender, ElapsedEventArgs e)
        {
            // 타이머 실행 유무 체크
            if (m_bTimerChk == true)
                return;

            m_bTimerChk = true;                 // 타이머 실행 중 체크

            // 지난 로그 삭제
            DateTime dtNow = DateTime.Now;
            if ((dtNow - m_dtLast).TotalDays >= 1)
            {
                Logger.Instance.RemoveOldLogs();
                m_dtLast = DateTime.Now;
            }

            bool bChk = false;
            string strErrorMessage = null;

            while (!bChk)
            {
                m_nShutdownThread++;                // 실행 중인 쓰레드 중지
                if (m_nShutdownThread > 100)
                    m_nShutdownThread = 1;

                Thread.Sleep(m_nThreadReloadSleep);       // 실행 중인 쓰레드 종료 시간

                // 센서 조회
                bChk = m_dataMgr.LoadSensorList(out strErrorMessage);
                if (bChk == false)
                {
                    //m_logMgr.Log_Info("Device List 조회 Rest API 실패. 네트워크 확인바람.");
                    Logger.Instance.Write("LoadSensorList 실패: " + strErrorMessage);
                    // 1분 후 재실행
                    Thread.Sleep(1000 * 60);
                    continue;
                }

                // 디바이스 센서 데이터 조회 쓰레드 생성
                bChk = ReloadBacnetThread(out strErrorMessage);
                if (bChk == false)
                {
                    //m_logMgr.Log_Info("조회된 Device가 없어 실패.");
                    Logger.Instance.Write("ReloadBacnetThread 실패: " + strErrorMessage);
                    // 1분 후 재실행
                    Thread.Sleep(1000 * 60);
                    continue;
                }
            }
        }

        private bool ReloadBacnetThread(out string strErrorMessage)
        {
            strErrorMessage = null;
            int nShutdownThread = -1;

            Dictionary<string, List<string>> dicSensorGroup = m_dataMgr.DicSensorGroup;
            if (dicSensorGroup == null || dicSensorGroup.Count == 0)
            {
                strErrorMessage = "DicSensorGroup 데이터가 없습니다.";
                return false;
            }

            m_dicSensorGroup = dicSensorGroup;
            m_listAlarmKeys = new List<string>(m_dicSensorGroup.Keys);

            // 쓰레드 실행
            nShutdownThread = m_nShutdownThread;

            for (int i = 0; i < m_dicSensorGroup.Count; i += m_nThreadGroupNum)
            {
                int nIdx = i;

                Thread WatchDevice = new Thread(() => WatchBacnetThread(nIdx, nShutdownThread));
                WatchDevice.Start();
            }

            return true;
        }

        private void WatchBacnetThread(int nNum, int nShutdownThread)
        {
            Console.WriteLine("create Thread: " + nNum.ToString());
            string strErrorMessage = null;

            while (m_nShutdownThread == nShutdownThread)
            {
                for (int i = nNum; i < nNum + m_nThreadGroupNum; i++)
                {
                    if (i > m_dicSensorGroup.Count - 1)
                        break;

                    string strAlarmKey = m_listAlarmKeys[i];
                    List<string> listSensorKeys = m_dicSensorGroup[strAlarmKey];

                    // bacnet으로 센서 및 알람을 읽어와 센서 리스트에 입력
                    if (m_bacnetMgr.RequestSensorData(strAlarmKey, listSensorKeys, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("RequestSensorData 실패: " + strErrorMessage);
                        continue;
                    }

                    // 센서 리스트에 알람 데이터를 확인하여 알람 발생 및 해제 
                    if (m_dataMgr.CheckAlarmSensor(listSensorKeys, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("UpdateSensorData 실패: " + strErrorMessage);
                        continue;
                    }

                    // DB에 저장
                    if (m_dataMgr.UpdateSensorData(listSensorKeys, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("UpdateSensorData 실패: " + strErrorMessage);
                        continue;
                    }
                }

                Thread.Sleep(m_nThreadSleep);
            }

            Console.WriteLine("shutdownThread: " + nNum.ToString());
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            m_nShutdownThread = -1;
        }
    }
}
