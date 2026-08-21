using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Extensions.ManagedClient;
using MQTTnet.Extensions.WebSocket4Net;
using MQTTnet.Formatter;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

namespace MQTTSample
{
    public partial class FormMain : Form
    {
        private string m_strTitle = "";
        private IManagedMqttClient mqttClient = null;
        private bool m_isConnected = false;

        public FormMain()
        {
            InitializeComponent();

            m_strTitle = this.Text;
        }

        private async void btnConnect_Click(object sender, EventArgs e)
        {
            if (mqttClient == null)
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

                btnConnect.Enabled = false;

                try
                {
                    var mqttFactory = new MqttFactory();

                    List<X509Certificate> certificates = new List<X509Certificate>();
                    certificates.Add(new X509Certificate("cacert.crt"));
                    certificates.Add(new X509Certificate("client.crt"));

                    mqttClient = mqttFactory.CreateManagedMqttClient();
                    var builder = new MqttClientOptionsBuilder()
                        .WithClientId(Guid.NewGuid().ToString())
                        .WithTls(p =>
                        {
                            p.Certificates = certificates;
                            p.CertificateValidationHandler = e => { return true; };
                        })
                        .WithTcpServer(addr.ToString(), port);

                    var option = new ManagedMqttClientOptionsBuilder().WithAutoReconnectDelay(TimeSpan.FromSeconds(50)).WithClientOptions(builder.Build()).Build();

                    mqttClient.ConnectedAsync += Client_ConnectedAsync;
                    mqttClient.ConnectingFailedAsync += Client_ConnectingFailedAsync;
                    mqttClient.DisconnectedAsync += Client_DisconnectedAsync;

                    mqttClient.StartAsync(option).GetAwaiter().GetResult();

                        
                        
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
                    /*isWorking = false;
                    mqttClient = null;
                    MessageBox.Show("연결 오류 : " + ex.Message);*/
                }
            }
            else if (m_isConnected)
            {
                btnConnect.Enabled = false;
                mqttClient.StopAsync();
                mqttClient = null;
            }
        }

        private async Task Client_DisconnectedAsync(MqttClientDisconnectedEventArgs arg)
        {
            btnConnect.Text = "연결";
            m_isConnected = false;
            btnConnect.Enabled = true;
            System.Diagnostics.Trace.WriteLine("disconnected");
            await Task.Delay(1);
        }

        private async Task Client_ConnectingFailedAsync(ConnectingFailedEventArgs arg)
        {
            System.Diagnostics.Trace.WriteLine("Fail connected");
            btnConnect.Enabled = true;
            await Task.Delay(1);
        }

        private async Task Client_ConnectedAsync(MqttClientConnectedEventArgs arg)
        {
            btnConnect.Text = "끊기";
            m_isConnected = true;
            btnConnect.Enabled = true;
            System.Diagnostics.Trace.WriteLine("Successfully connected");
            await Task.Delay(1);
        }
    }
}
