using System;
using System.Threading.Tasks;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Extensions.ManagedClient;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using Newtonsoft.Json.Linq;

namespace IntegrationServer.Servers.MQTT.Corners
{
    using Datas;
    using ViewModels.MQTT.Corners;
    using static AgentFactory.BLL.ServerType;

    class MqttManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;

        private IDataManager m_dataManager = null;

        // DB용 Site ID
        private int m_nSiteID = -1;
        // MQTT 전달을 위한 SiteID
        private int m_nCornersSiteID = -1;
        private int m_nMpcID = -1;
        private IManagedMqttClient m_client = null;

        private string m_strServerIP = "";
        private int m_nPort = 0;
        private bool m_isConnected = false;
        private bool m_tryConnecting = false;

        public Logger Logger { get; set; }

        public int ServerSeqNo
        {
            get
            {
                return m_nServerSeqNo;
            }
        }

        public ServerTypes ServerType
        {
            get
            {
                return ServerTypes.Mqtt_Corners;
            }
        }

        public bool IsConnected
        {
            get
            {
                return m_isConnected;
            }
        }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        // Site별 Instance 관리
        // Key : Site ID
        private static Dictionary<int, MqttManager> m_dicSiteInstances = new Dictionary<int, MqttManager>();

        /*public static MqttManager m_instance = null;

        public static MqttManager Instance
        {
            get { return m_instance; }
        }*/

        public MqttManager(ServerManager serverManager, DataManager dataManager, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, Dictionary<ServerProperty, object> serverProperties)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_nSiteID = nSiteID;

            m_strServerIP = strServerIP;
            m_nPort = nPort;

            SetSiteID(serverProperties);

            m_dataManager = (DataManager)dataManager.Clone();

            SetSiteInstance();
            //m_instance = this;
        }

        private void SetSiteInstance()
        {
            m_dicSiteInstances[m_nSiteID] = this;
        }

        public static MqttManager GetInstance(int siteID)
        {
            MqttManager mgr;

            if (m_dicSiteInstances.TryGetValue(siteID, out mgr))
                return mgr;

            return null;
        }

        private void SetSiteID(Dictionary<ServerProperty, object> serverProperties)
        {
            if (serverProperties == null)
                return;

            foreach (KeyValuePair<ServerProperty, object> pair in serverProperties)
            {
                if (pair.Key == ServerProperty.SiteID)
                {
                    if (pair.Value != null)
                    {
                        m_nCornersSiteID = (int)(long)pair.Value;
                    }
                }
                else if (pair.Key == ServerProperty.MpcID)
                {
                    if (pair.Value != null)
                        m_nMpcID = (int)(long)pair.Value;
                }
            }
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            if (m_client == null && m_tryConnecting == false)
            {
                m_tryConnecting = true;
                IPAddress addr = null;

                if (IPAddress.TryParse(m_strServerIP, out addr) == false)
                    return;

                string strClientID = "sidp/cli/tester/" + Guid.NewGuid().ToString("D");

                try
                {
                    var mqttFactory = new MqttFactory();
                    string strFolder = GetCurrentFolder();

                    List<X509Certificate> certificates = new List<X509Certificate>();
                    certificates.Add(new X509Certificate(strFolder + "\\cacert.crt"));
                    certificates.Add(new X509Certificate(strFolder + "\\client.crt"));

                    m_client = mqttFactory.CreateManagedMqttClient();

                    var builder = new MqttClientOptionsBuilder()
                        .WithClientId(strClientID)
                        .WithTls(p =>
                        {
                            p.Certificates = certificates;
                            p.CertificateValidationHandler = e => { return true; };
                        })
                        .WithTcpServer(addr.ToString(), m_nPort);

                    var option = new ManagedMqttClientOptionsBuilder().WithAutoReconnectDelay(TimeSpan.FromSeconds(50)).WithClientOptions(builder.Build()).Build();

                    m_client.ConnectedAsync += Client_ConnectedAsync;
                    m_client.ConnectingFailedAsync += Client_ConnectingFailedAsync;
                    m_client.DisconnectedAsync += Client_DisconnectedAsync;
                    m_client.ApplicationMessageReceivedAsync += Client_ApplicationMessageReceivedAsync;

                    m_client.StartAsync(option).GetAwaiter().GetResult();

                    List<MQTTnet.Packets.MqttTopicFilter> filters = new List<MQTTnet.Packets.MqttTopicFilter>();
                    MQTTnet.Packets.MqttTopicFilter filter = new MQTTnet.Packets.MqttTopicFilter();
                    filter.Topic = "sidp/svc/mon/aes";
                    filters.Add(filter);

                    m_client.SubscribeAsync(filters);
                    WriteLog("Try Connecting : " + m_strServerIP + ":" + m_nPort);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Trace.Write("Error : " + ex.Message);
                    WriteLog("Error : " + ex.Message);
                }
            }
        }

        private string GetCurrentFolder()
        {
            string strLocation = System.Reflection.Assembly.GetEntryAssembly().Location;
            int index = strLocation.LastIndexOf('\\');

            return strLocation.Substring(0, index);
        }

        public void Stop()
        {
            if (m_isConnected)
            {
                m_client.StopAsync();
            }

            m_client = null;
            m_isConnected = false;
            m_tryConnecting = false;
        }

        public void Publish(string strSensorInfo, bool isAlarm)
        {
            IManagedMqttClient client = m_client;

            if (client == null)
                return;

            // 화재신호 또는 화재복구 신호를 보낸다.
            // strSensorInfo는 SensorTagInfo Table의 Description을 사용한다.(<>으로 둘러쌓인 부분을 제외하고 사용해야 한다.)
            // 즉, 센서별로 다른 신호를 보내야 한다.
            JObject json = new JObject();

            json.Add("site_id", m_nCornersSiteID);
            json.Add("mpc_id", m_nMpcID);

            JObject evt = new JObject();

            evt.Add("rcv_pt", strSensorInfo);
            evt.Add("stat", 0);
            evt.Add("val", isAlarm ? 1 : 0);

            JArray arrEvt = new JArray();
            arrEvt.Add(evt);

            json.Add("evt", arrEvt);

            string strTopic = "ssw/st/1/frcv/evt";

            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(strTopic)
                .WithPayload(json.ToString())
                .Build();

            client.EnqueueAsync(applicationMessage);
            WriteLog("[Send] : " + json.ToString());
        }

        private async Task Client_ApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs arg)
        {
            if (!m_isConnected)
                return;

            string payload = arg.ApplicationMessage?.Payload == null ? null : System.Text.Encoding.UTF8.GetString(arg.ApplicationMessage.Payload);
            // arg.ApplicationMessage.Topic

            string strLog = string.Format(" TimeStamp: {0} -- Message: ClientId = {1}, Topic = {2}, Payload = {3}, QoS = {4}, Retain-Flag = {5}",
                DateTime.Now,
                arg.ClientId,
                arg.ApplicationMessage?.Topic,
                payload,
                arg.ApplicationMessage?.QualityOfServiceLevel,
                arg.ApplicationMessage?.Retain);

            System.Diagnostics.Trace.WriteLine(strLog);
            WriteLog("[Receive] : " + strLog);

            string strSiteID = GetValue(payload, "site_id");
            string strStatus = GetValue(payload, "status");

            SetEvacuation(strSiteID, strStatus);
            await Task.Delay(1);
        }

        private void SetEvacuation(string strSiteID, string strStatus)
        {
            bool isEvac = false;

            if (strStatus == "3")
            {
                // 대피개시
                isEvac = true;
            }
            else if (strStatus == "4")
            {
                // 대피종료
                isEvac = false;
            }
            else
                return;

            Dictionary<Evacuation.Fields, object> dicSets = new Dictionary<Evacuation.Fields, object>();
            dicSets[Evacuation.Fields.IsEvac] = isEvac;

            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", Evacuation.Fields.UniqueKey, strSiteID);

            if (m_dataManager.GetUpdate().Update<Evacuation, Evacuation.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("Update Evacuation Error : " + strErrorMessage);
                WriteLog("[Update Evacuation Error] : " + strErrorMessage, LogTypes.Error);
            }
        }

        private string GetValue(string strJson, string strPropertyName)
        {
            if (strJson == null || strJson.Length == 0)
                return null;

            if (strJson.StartsWith('{'))
                strJson = strJson.Substring(1).Trim();

            if (strJson.EndsWith('}'))
                strJson = strJson.Substring(0, strJson.Length - 1);

            strPropertyName = strPropertyName.ToLower();
            string[] tokens = strJson.Split(',');

            foreach (string strToken in tokens)
            {
                int index = strToken.IndexOf(':');

                if (index < 0)
                    continue;

                if (strToken.Substring(0, index).Trim().ToLower() == strPropertyName)
                {
                    string strValue = strToken.Substring(index + 1).Trim();

                    if (strValue.StartsWith('"'))
                        strValue = strValue.Substring(1);

                    if (strValue.EndsWith('"'))
                        strValue = strValue.Substring(0, strValue.Length - 1);

                    return strValue;
                }
            }

            return null;
        }

        private async Task Client_DisconnectedAsync(MqttClientDisconnectedEventArgs arg)
        {
            System.Diagnostics.Trace.WriteLine("disconnected");

            m_isConnected = false;
            m_client = null;
            m_tryConnecting = false;
            await Task.Delay(1);

            WriteLog("disconnected");
        }

        private async Task Client_ConnectingFailedAsync(ConnectingFailedEventArgs arg)
        {
            System.Diagnostics.Trace.WriteLine("Fail connected");
            m_isConnected = false;
            m_client = null;
            m_tryConnecting = false;
            await Task.Delay(1);

            WriteLog("Fail connected", LogTypes.Error);
        }

        private async Task Client_ConnectedAsync(MqttClientConnectedEventArgs arg)
        {
            System.Diagnostics.Trace.WriteLine("Successfully connected");

            m_isConnected = true;
            m_tryConnecting = false;
            await Task.Delay(1);

            WriteLog("Successfully connected");
        }

        private void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }
}
