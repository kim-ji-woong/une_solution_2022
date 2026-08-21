using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IntegrationServer.Datas;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsTcpLib2;
using System.Windows.Forms;
using static dnsData.Sensor.Facility;
using static dnsSopID.ID;
using dnsData.Sensor;
using dnsCommunicateSopServer;
using IntegrationServer.Managers;

namespace IntegrationServer.Servers.AirPollution.Senko
{
    public partial class AirPollutionManager : IServer
    {
        #region IServer 
        private int m_nServerSeqNo = -1;
        public bool IsConnected { get; }
        public int ServerSeqNo { get { return m_nServerSeqNo; } }
        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager() { return m_serverManager; }

        public ServerTypes ServerType { get { return ServerTypes.PSM_Senko; } }

        public void Start()
        {
            if (m_serverMode == ServerModes.Server)
                RunSenkoClient();
        }

        public void Stop()
        {
            Logger.Write(LogTypes.Info, ServerType, ServerSeqNo, "Stop");
        }

        

        #endregion

        private string m_strServerIP = "";
        private int m_nPort = -1;
        private ServerModes m_serverMode = ServerModes.Server;
        private AirPollutionProvider m_clientProvider = null;
        private AirPollutionSensorManager m_sensorManager = null;

        private SopQueryManager m_sopQueryManager = null;



        private static AirPollutionManager m_instance = null;
        public static AirPollutionManager Instance
        {
            get { return m_instance; }
        }

        private TcpServer Server;

        public TcpServer m_Server
        {
            get { return m_Server; }
        }

        private List<dnsTcpLib2.ConnectionState> m_states = new List<dnsTcpLib2.ConnectionState>();

        public List<dnsTcpLib2.ConnectionState> ConnectionStates
        {
            get { return m_states; }
            set { m_states = value; }
        }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public AirPollutionManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, string strIP, int nPort, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerIP = strIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;

            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_instance = this;

            m_sensorManager = new AirPollutionSensorManager((DataManager)dataManager.Clone(), this);
        }

        private void RunSenkoClient()
        {
            m_clientProvider = new AirPollutionProvider(this);

            Server = new TcpServer(m_clientProvider, m_nPort);
            Server.Start();
        }

        public void OnReceive(dnsTcpLib2.ConnectionState state, byte[] receivedData)
        {
            if (receivedData == null)
                return;

            byte[] data = receivedData;

            string strData = BitConverter.ToString(data);

            if (data == null || data.Length == 0)
            {
                Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, "[ERROR] : receiveData is Null");

                return;
            }

            if (m_sensorManager.WriteSensorDatas(data, strData, state))
            {
                Logger.Write(LogTypes.Info, ServerType, ServerSeqNo, $"[INFO] : IP: {state.IPAddress.ToString()} - WriteSensorDatas() Success");
            } else
            {
                Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, $"[Error] : WriteSensorDatas Fail At AirPollutionManager.cs(Line : 113) , Info : {state.IPAddress.ToString()}");
            }

            Logger.Write(LogTypes.Info, ServerType, ServerSeqNo, $"[INFO]: IPAdd: {state.IPAddress.ToString()} Send() Before");
            Send(state);

        }

        public void WriteLog(string strLog, LogTypes logType)
        {
            Logger.Write(logType, ServerType, ServerSeqNo, strLog);
        }

        public void Send(dnsTcpLib2.ConnectionState state)
        {
            try
            {
                byte[] response = new byte[8];
                response[0] = 0x02;
                response[1] = 0x00;
                response[2] = 0x00;
                response[3] = 0x00;
                response[4] = 0x00;
                response[5] = 0x00;
                response[6] = 0x00;
                response[7] = 0x03;

                if (state != null)
                {
                    state.LengthAdd = false;
                    if (!state.Write(response, 0, response.Length))
                    {
                        Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, $"[Error] Response Send Fail : {state.IPAddress.ToString()}");
                    }
                    else
                    {
                        Logger.Write(LogTypes.Info, ServerType, ServerSeqNo, $"[Info] Response Send Success : {state.IPAddress.ToString()}");
                    }
                }

            }
            catch (Exception e)
            {
                Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, $"[ERROR] - [Send() Failed] State IPAdd: {state.IPAddress.ToString()} " + e.Message.ToString());
            }
        }

        public void OnAccept(dnsTcpLib2.ConnectionState state)
        {
            Logger.Write(Datas.LogTypes.Info, dnsSopID.ID.ServerTypes.PSM_Senko, ServerSeqNo, "[INFO] : State Connection " + state.IPAddress + " " + state.PortNo.ToString());
        }

        public void OnDropConnection(dnsTcpLib2.ConnectionState state)
        {
            Logger.Write(Datas.LogTypes.Info, dnsSopID.ID.ServerTypes.PSM_Senko, ServerSeqNo, "[INFO] : State Drop Connection " + state.IPAddress + " " + state.PortNo.ToString());
        }

        public bool SendSensorData(SensorTag sensorTag, FacilityType facilityType, bool ProcessFire, int nAlarmLevel)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, (int)facilityType, sensorTag.ID, sensorTag.SensorZoneID, ProcessFire, nAlarmLevel);
        }
    }

    public class Temp
    {
        private int m_nAlarmDepth = 0;
        private bool m_bIsAlarm = false;

        public int ID { get; set; }
        public string UniqueKey { get; set; }
        public int AlarmDepth 
        {
            get { return m_nAlarmDepth; } 
            set { m_nAlarmDepth = value; } 
        }
        public bool IsAlarm
        {
            get { return m_bIsAlarm; }
            set { m_bIsAlarm = value; }
        }
    }
}
