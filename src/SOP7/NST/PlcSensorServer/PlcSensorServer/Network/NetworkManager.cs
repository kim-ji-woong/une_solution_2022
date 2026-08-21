using System;
using System.Threading;
using dnsTcpLib2;
using System.Collections.Generic;
using System.Windows.Forms;

namespace PlcSensorServer.Network
{
    public class NetworkManager
    {
        private string m_strServerIP = "127.0.0.1";
        private int m_nPort = 4378;
        private int m_nAlarmPort = 4379;
        private bool m_runThread = false;

        // 통신 오류가 나더라도 신호를 정상적으로 받도록 하기 위하여 두개의 Client를 사용한다.
        private ServerServiceProvider m_provider = null;
        private ServerServiceProvider m_providerAlarm = null;
        private bool m_closeServer = false;
        private bool m_isOpened1 = false, m_isOpened2 = false;

        private IMainWindow m_mainWindow = null;
        private ISensorOwner m_sensorOwner = null;

        public bool ClosingServer
        {
            get { return m_closeServer; }
        }

        private TcpServer m_server = null;
        private TcpServer m_alarmServer = null;

        private static NetworkManager m_instance = null;

        public static NetworkManager Instance
        {
            get { return m_instance; }
        }

        public ServerServiceProvider ServiceProvider
        {
            get { return m_provider; }
        }

        // DataGrid에 Client Type을 갱신하기 위한 변수
        // 동기화 문제를 피하기 위하여 Dictionary 사용
        private Dictionary<ConnectionState, DataGridViewTextBoxCell> m_dicClientType = new Dictionary<ConnectionState, DataGridViewTextBoxCell>();

        public NetworkManager(int nPort, int nAlarmPort, IMainWindow mainWindow, ISensorOwner sensorOwner)
        {
            m_instance = this;

            m_mainWindow = mainWindow;
            m_sensorOwner = sensorOwner;

            m_provider = new ServerServiceProvider(this, sensorOwner);
            m_providerAlarm = new ServerServiceProvider(this, sensorOwner);
            m_nPort = nPort;
            m_nAlarmPort = nAlarmPort;
        }

        public void Start()
        {
            if (m_nPort > 0 && m_nAlarmPort > 0)
            {
                m_server = new TcpServer(m_provider, m_nPort);
                m_server.ConnectionLog = ConnectionLogClient.Instance;
                m_isOpened1 = m_server.Start();

                m_alarmServer = new TcpServer(m_providerAlarm, m_nAlarmPort);
                m_alarmServer.ConnectionLog = ConnectionLogClient.Instance;
                m_isOpened2 = m_alarmServer.Start();
            }
        }

        public void Stop()
        {
            m_closeServer = true;

            m_provider.ReleaseThread();
            m_providerAlarm.ReleaseThread();

            if (m_server != null && m_isOpened1)
            {
                m_isOpened1 = false;
                m_server.Stop();
            }

            if (m_alarmServer != null && m_isOpened2)
            {
                m_isOpened2 = false;
                m_alarmServer.Stop();
            }
        }

        public void AddClient(ConnectionState state)
        {
            m_mainWindow.AddClient(0, 0, state.IPAddress, state.PortNo);
        }

        public void RemoveClient(ConnectionState state)
        {
            m_mainWindow.RemoveClient(state.IPAddress, state.PortNo);
        }
    }

    public class ConnectionLogClient : ConnectionLog
    {
        private static ConnectionLogClient m_instance2 = new ConnectionLogClient();

        public static ConnectionLogClient Instance
        {
            get
            {
                return m_instance2;
            }
        }

        public override bool Write(object str, bool writeTime = true)
        {
            Logger.Instance.Write(str.ToString());
            return true;
        }

        public override bool WriteLine(object str, Exception e)
        {
            Logger.Instance.Write(str.ToString());
            return true;
        }

        public override bool WriteLine(object str, bool writeTime = true)
        {
            Logger.Instance.Write(str.ToString());
            return true;
        }
    }
}
