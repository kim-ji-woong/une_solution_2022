using System;
using System.Net.Sockets;
using System.Net;
using System.Windows.Forms;

namespace ServerSample
{
    public partial class FormMain : Form
    {
        private ClientController m_client = null;
        private static FormMain m_instance = null;
        private TcpListener m_server = null;
        private bool m_isServerRunning = false;

        public static FormMain Instance
        {
            get { return m_instance; }
        }

        public FormMain()
        {
            m_instance = this;
            InitializeComponent();
        }

        private void btnStartServer_Click(object sender, EventArgs e)
        {
            btnStartServer.Enabled = false;
            textBoxPort.Enabled = false;

            string strPort = textBoxPort.Text.Trim();

            if (strPort.Length == 0)
            {
                textBoxPort.Focus();
                MessageBox.Show("Port를 입력하세요.");
                return;
            }

            int nPort;

            if (int.TryParse(strPort, out nPort) == false || nPort <= 0)
            {
                textBoxPort.Focus();
                MessageBox.Show("Port는 0보다 큰 정수이어야 합니다.");
                return;
            }

            BeginServer(nPort);
        }

        private void BeginServer(object param)
        {
            int nPort = (int)param;

            m_server = new TcpListener(IPAddress.Parse("127.0.0.1"), nPort);
            m_server.Start();
            m_isServerRunning = true;
            
            // 비동기 Listening
            m_server.BeginAcceptTcpClient(new AsyncCallback(OnAcceptClient), m_server);
        }

        private void OnAcceptClient(IAsyncResult result)
        {
            if (m_client != null)
            {
                m_client.ConnectionClosed -= OnClientDisconnected;
                m_client.Close();
            }

            // 서버 리스너 가져오기
            TcpListener listener = (TcpListener)result.AsyncState;
        
            try
            {
                // 클라이언트 연결 수락
                TcpClient client = listener.EndAcceptTcpClient(result);
            
                // 새 클라이언트 컨트롤러 생성 및 이벤트 등록
                m_client = new ClientController(client);
                m_client.ConnectionClosed += OnClientDisconnected;
            
                this.Invoke((MethodInvoker)delegate
                {
                    string message = "[시스템] 클라이언트가 연결되었습니다.";
                    AppendMessage(message);
                });
            
                // 다음 클라이언트를 기다림
                if (m_isServerRunning)
                {
                    listener.BeginAcceptTcpClient(new AsyncCallback(OnAcceptClient), listener);
                }
            }
            catch (Exception ex)
            {
                this.Invoke((MethodInvoker)delegate
                {
                    string message = $"[오류] 클라이언트 연결 처리 중 오류: {ex.Message}";
                    AppendMessage(message);
                });
            
                // 오류 발생 시에도 다음 연결 대기
                if (m_isServerRunning)
                {
                    listener.BeginAcceptTcpClient(new AsyncCallback(OnAcceptClient), listener);
                }
            }
        }
        
        
        // 연결 종료 이벤트 처리기
        private void OnClientDisconnected(string reason)
        {
            this.Invoke((MethodInvoker)delegate
            {
                string message = $"[시스템] {reason}";
                AppendMessage(message);
            
                // 클라이언트 객체 정리
                m_client.ConnectionClosed -= OnClientDisconnected;
                m_client = null;
            });
        }
    
        // 메시지 출력을 위한 헬퍼 메서드
        private void AppendMessage(string message)
        {
            string strText = textBoxMessage.Text.Trim();
        
            if (strText.Length == 0)
                strText = message;
            else
                strText += "\r\n" + message;
            
            textBoxMessage.Text = strText;
        }
        
        // 폼 종료시 리소스 정리
        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            m_isServerRunning = false;
        
            if (m_client != null)
            {
                m_client.ConnectionClosed -= OnClientDisconnected;
                m_client.Close();
            }
        
            if (m_server != null)
            {
                m_server.Stop();
            }
        
            base.OnFormClosing(e);
        }

        public void OnReceive(string strMessage)
        {
            this.Invoke((MethodInvoker)delegate
            {
                string strText = textBoxMessage.Text.Trim();

                if (strText.Length == 0)
                    strText = strMessage;
                else
                    strText += "\r\n" + strMessage;

                textBoxMessage.Text = strText;
            });
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            string strText = textBoxSend.Text.Trim();

            if (m_client != null && strText.Length > 0)
                m_client.SendData(strText, ClientController.PayloadDataType.Text);

            textBoxSend.Text = "";
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            textBoxMessage.Text = "";
        }

        private void textBoxPort_TextChanged(object sender, EventArgs e)
        {
            throw new System.NotImplementedException();
        }
    }
}
