using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows.Forms;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Extensions.ManagedClient;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MQTTSample
{
    public partial class FormMain : Form
    {
        private IManagedMqttClient m_client = null;
        private bool m_isConnected = false;
        private int m_nSiteID = -1;

        public FormMain()
        {
            InitializeComponent();
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            if (m_client == null)
            {
                IPAddress addr = null;

                if (IPAddress.TryParse(textBoxBrokerIP.Text.Trim(), out addr) == false)
                {
                    MessageBox.Show("MQTT 브로커 IP를 입력하세요.");
                    textBoxBrokerIP.Focus();
                    return;
                }

                ushort port;

                if (ushort.TryParse(textBoxBrokerPort.Text.Trim(), out port) == false)
                {
                    MessageBox.Show("MQTT 브로커 Port를 입력하세요.");
                    textBoxBrokerPort.Focus();
                    return;
                }

                int nSiteID;
                string strSiteID = textBoxTargetSiteID.Text.Trim();

                if (strSiteID.Length == 0)
                {
                    MessageBox.Show("Site ID를 입력하세요.");
                    textBoxTargetSiteID.Focus();
                    return;
                }
                else if (int.TryParse(strSiteID, out nSiteID) == false)
                {
                    MessageBox.Show("Site ID는 정수값만 가능합니다.");
                    textBoxTargetSiteID.Focus();
                    return;
                }

                m_nSiteID = nSiteID;

                btnConnect.Enabled = false;
                string strClientID = "sidp/cli/tester/" + Guid.NewGuid().ToString("D");

                try
                {
                    var mqttFactory = new MqttFactory();

                    List<X509Certificate> certificates = new List<X509Certificate>();
                    certificates.Add(new X509Certificate("cacert.crt"));
                    certificates.Add(new X509Certificate("client.crt"));

                    m_client = mqttFactory.CreateManagedMqttClient();

                    var builder = new MqttClientOptionsBuilder()
                        .WithClientId(strClientID)
                        .WithTls(p =>
                        {
                            p.Certificates = certificates;
                            p.CertificateValidationHandler = e => { return true; };
                        })
                        .WithTcpServer(addr.ToString(), port);

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

                    /*filter = new MQTTnet.Packets.MqttTopicFilter();
                    filter.Topic = "sidp/svc/mon/aes";
                    filters.Add(filter);*/

                    m_client.SubscribeAsync(filters);

                    /*while (m_client != null)
                    {
                        if (m_isConnected)
                        {
                            string json = JsonSerializer.Serialize(new { id = Guid.NewGuid(), message = "Heyo :)", sent = DateTimeOffset.UtcNow });
                            await client.PublishAsync(_topic, json);
                            WriteLine("Send Data");
                        }

                        await Task.Delay(1000);
                        IManagedMqttClient m_client = m_client;

                    }*/
                        
                    /*X509Certificate caCert = new X509Certificate("cacert.crt");
                    X509Certificate clientCert = new X509Certificate("client.crt");
                    mqttClient = new MqttClient(addr.ToString(), port, secure: true, caCert, clientCert, MqttSslProtocols.TLSv1_2, (object s, X509Certificate cert, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true);
                    mqttClient.MqttMsgPublishReceived += OnMessagePublishReceived;
                    mqttClient.ConnectionClosed += OnConnectionClosed;
                    isWorking = true;
                    mqttClient.Connect(ClientID, ClientID, null, cleanSession: true, 60);
                    mqttConnectButton.Text = "끊기";
                    Text = $"{titleText} - 연결됨[{address.ToString()}]";
                    string[] topics = new string[3]
                    {
                    "sidp/svc/mon/status",
                    "sidp/svc/mon",
                    ClientID
                    };
                    byte[] qosLevels = new byte[3]
                    {
                    1,
                    1,
                    1
                    };
                    mqttClient.Subscribe(topics, qosLevels);*/
                }
                catch (Exception ex)
                {
                    btnConnect.Enabled = true;
                    System.Diagnostics.Trace.Write("Error : " + ex.Message);
                    Logger.Instance.Write("Error : " + ex.Message);
                    /*isWorking = false;
                    mqttClient = null;
                    MessageBox.Show("연결 오류 : " + ex.Message);*/
                }
            }
            else if (m_isConnected)
            {
                m_client.StopAsync();
                btnConnect.Enabled = false;
            }
        }

        private async Task Client_ApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs arg)
        {
            if (!m_isConnected)
                return;

            var payload = arg.ApplicationMessage?.Payload == null ? null : System.Text.Encoding.UTF8.GetString(arg.ApplicationMessage.Payload);
            // arg.ApplicationMessage.Topic

            string strLog = string.Format(" TimeStamp: {0} -- Message: ClientId = {1}, Topic = {2}, Payload = {3}, QoS = {4}, Retain-Flag = {5}",
                DateTime.Now,
                arg.ClientId,
                arg.ApplicationMessage?.Topic,
                payload,
                arg.ApplicationMessage?.QualityOfServiceLevel,
                arg.ApplicationMessage?.Retain);

            System.Diagnostics.Trace.WriteLine(strLog);
            Logger.Instance.Write("[Receive] : " + strLog);

            await Task.Delay(1);
        }

        private async Task Client_DisconnectedAsync(MqttClientDisconnectedEventArgs arg)
        {
            System.Diagnostics.Trace.WriteLine("disconnected");
            ChangeButtonText("연결");
            m_isConnected = false;
            m_client = null;
            await Task.Delay(1);

            Logger.Instance.Write("disconnected");
        }

        private async Task Client_ConnectingFailedAsync(ConnectingFailedEventArgs arg)
        {
            System.Diagnostics.Trace.WriteLine("Fail connected");
            await Task.Delay(1);

            Logger.Instance.Write("Fail connected");
        }

        private async Task Client_ConnectedAsync(MqttClientConnectedEventArgs arg)
        {
            System.Diagnostics.Trace.WriteLine("Successfully connected");
            ChangeButtonText("끊기");
            m_isConnected = true;
            await Task.Delay(1);

            Logger.Instance.Write("Successfully connected");
        }

        private void ChangeButtonText(string strText)
        {
            this.Invoke((MethodInvoker)delegate
                {
                    btnConnect.Text = strText;
                    btnConnect.Enabled = true;
                });
        }

        private void btnEvacNow_Click(object sender, EventArgs e)
        {
            IManagedMqttClient client = m_client;

            if (m_isConnected == false)
                return;

            Publish(client, "02-m1c8e00", true);
            /*JObject json = new JObject();

            json.Add("site_id", 230803);
            json.Add("status", 3);
            json.Add("val", -1);

            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic("sidp/svc/mon/aes")
                .WithPayload(json.ToString())
                .Build();

            client.EnqueueAsync(applicationMessage);*/
        }

        private void btnEndEvac_Click(object sender, EventArgs e)
        {
            IManagedMqttClient client = m_client;

            if (m_isConnected == false)
                return;

            Publish(client, "02-m1c8e00", false);
            /*JObject json = new JObject();

            json.Add("site_id", 230803);
            json.Add("status", 4);
            json.Add("val", -1);

            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic("sidp/svc/mon/aes")
                .WithPayload(json.ToString())
                .Build();

            client.EnqueueAsync(applicationMessage);*/
        }

        private void btnCancelEvac_Click(object sender, EventArgs e)
        {

        }

        private void Publish(IManagedMqttClient client, string strSensorInfo, bool isAlarm)
        {
            // 화재신호 또는 화재복구 신호를 보낸다.
            // strSensorInfo는 SensorTagInfo Table의 Description을 사용한다.(<>으로 둘러쌓인 부분을 제외하고 사용해야 한다.)
            // 즉, 센서별로 다른 신호를 보내야 한다.
            JObject json = new JObject();

            json.Add("site_id", m_nSiteID);
            json.Add("mpc_id", 1);

            JObject evt = new JObject();

            evt.Add("rcv_pt", strSensorInfo);
            evt.Add("stat", 0);
            evt.Add("val", isAlarm ? 1 : 0);

            json.Add("evt", evt);

            string strTopic = "ssw/st/1/frcv/evt";

            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(strTopic)
                .WithPayload(json.ToString())
                .Build();

            client.EnqueueAsync(applicationMessage);

            Logger.Instance.Write("[Send] : " + json.ToString());
        }
    }
}
