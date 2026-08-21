using System;
using System.Net.WebSockets;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections;

namespace ServerSampleJson
{
    class ClientController
    {
        public enum PayloadDataType
        {   //RFC 6455 기반
            Unknown = -1,
            Continuation = 0,
            Text = 1,
            Binary = 2,
            ConnectionClose = 8,
            Ping = 9,
            Pong = 10
        }

        private readonly TcpClient m_client = null;
        private byte[] m_prevBytes = null;

        public WebSocketState State
        {
            get;
            private set;
        }

        public ClientController(TcpClient client)
        {
            // 완전한 연결이 아닌 연결중...
            this.State = WebSocketState.Connecting;

            m_client = client;
            NetworkStream stream = m_client.GetStream();

            byte[] bytes = new byte[1024];
            stream.BeginRead(bytes, 0, bytes.Length, OnReceive, bytes);
        }

        private void OnReceive(IAsyncResult ar)
        {
            if (m_client.Connected == false)
                return;

            byte[] received = (byte[])ar.AsyncState;
            NetworkStream stream = m_client.GetStream();

            if (stream.CanRead == false)
            {
                Close();
                return;
            }

            int size = stream.EndRead(ar);

            byte[] httpRequestRaw = new byte[7];    //HTTP request method는 7자리를 넘지 않는다.
                                                    //GET만 확인하면 되므로 new byte[3]해도 상관없음
            Array.Copy(received, httpRequestRaw, httpRequestRaw.Length);
            string httpRequest = Encoding.UTF8.GetString(httpRequestRaw);

            //GET 요청인지 여부 확인
            if (Regex.IsMatch(httpRequest, "^GET", RegexOptions.IgnoreCase))
            {
                HandshakeToClient(size, received, stream);  // 연결 요청에 대한 응답
                State = WebSocketState.Open;                // 응답이 성공하여 연결 중으로 상태 전환
            }
            else
            {
                // 메시지 수신에 대한 처리, 반환 값은 연결 종료 여부
                if (size == received.Length && stream.DataAvailable)
                {
                    int len = m_prevBytes != null ? m_prevBytes.Length + size : size;
                    byte[] tempBytes = new byte[len];

                    if (m_prevBytes != null)
                    {
                        Buffer.BlockCopy(m_prevBytes, 0, tempBytes, 0, m_prevBytes.Length);
                        Buffer.BlockCopy(received, 0, tempBytes, m_prevBytes.Length, size);
                    }
                    else
                        Buffer.BlockCopy(received, 0, tempBytes, 0, size);

                    m_prevBytes = tempBytes;

                    byte[] _bytes = new byte[1024];
                    stream.BeginRead(_bytes, 0, _bytes.Length, OnReceive, _bytes);
                    return;
                }

                if (m_prevBytes != null)
                {
                    byte[] _bytes = new byte[m_prevBytes.Length + size];
                    Buffer.BlockCopy(m_prevBytes, 0, _bytes, 0, m_prevBytes.Length);
                    Buffer.BlockCopy(received, 0, _bytes, m_prevBytes.Length, size);

                    ProcessClientRequest(_bytes.Length, _bytes);
                }
                else
                {
                    if (ProcessClientRequest(size, received) == false)
                        return;
                }
            }

            try
            {
                if (stream.CanRead)
                {
                    byte[] bytes = new byte[1024];
                    stream.BeginRead(bytes, 0, bytes.Length, OnReceive, bytes);
                }
                else
                {
                    Close();
                }
            }
            catch (Exception e)
            {
                stream.Close();
                System.Diagnostics.Trace.WriteLine("OnReceiveError : " + e.Message);

                Close();
            }
        }

        private bool ProcessClientRequest(int dataSize, byte[] bytes)
        {
            bool fin = (bytes[0] & 0b10000000) != 0;   // 혹시 false일 경우 다음 데이터와 이어주는 처리를 해야 함
            bool mask = (bytes[1] & 0b10000000) != 0;  // 클라이언트에서 받는 경우 무조건 true
            PayloadDataType opcode = (PayloadDataType)(bytes[0] & 0b00001111); // enum으로 변환

            short msglen = (short)(bytes[1] - 128); // Mask bit가 무조건 1라는 가정하에 수행
            int offset = 2;     //데이터 시작점
            if (msglen == 126)  //길이 126 이상의 경우
            {
                msglen = BitConverter.ToInt16(new byte[] { bytes[3], bytes[2] }, 0);
                offset = 4;
            }
            else if (msglen == 127)
            {
                // 이 부분은 구현 안 함. 나중에 필요한 경우 구현
                System.Diagnostics.Trace.WriteLine("Error: over int16 size");
                return true;
            }

            if (mask)
            {
                byte[] decoded = new byte[msglen];
                //마스킹 키 획득
                byte[] masks = new byte[4] { bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3] };
                offset += 4;

                for (int i = 0; i < msglen; i++)    //마스크 제거
                {
                    if (offset + i < dataSize)
                    {
                        decoded[i] = (byte)(bytes[offset + i] ^ masks[i % 4]);
                    }
                }

                //System.Diagnostics.Trace.WriteLine(Encoding.UTF8.GetString(decoded));    //데이터 출력

                switch (opcode)
                {
                    case PayloadDataType.Text:
                        FormMain.Instance.OnReceive(Encoding.UTF8.GetString(decoded));
                        SendData("Success!", PayloadDataType.Text);
                        break;
                    case PayloadDataType.Binary:
                        //Binary는 아무 동작 없음
                        break;
                    default:
                        System.Diagnostics.Trace.WriteLine("Unknown Data Type");
                        break;
                }

                m_prevBytes = null;
            }
            else
            {
                // 마스킹 체크 실패
                System.Diagnostics.Trace.WriteLine("Error: Mask bit not valid");
            }

            return true;
        }

        public void SendData(string strData, PayloadDataType opcode)
        {
            byte[] data = Encoding.UTF8.GetBytes(strData);

            byte[] sendData;
            BitArray firstByte = new BitArray(new bool[] {
                    // opcode
                    opcode == PayloadDataType.Text || opcode == PayloadDataType.Ping,
                    opcode == PayloadDataType.Binary || opcode == PayloadDataType.Pong,
                    false,
                    opcode == PayloadDataType.ConnectionClose || opcode == PayloadDataType.Ping || opcode == PayloadDataType.Pong,
                    false,  //RSV3
                    false,  //RSV2
                    false,  //RSV1
                    true,   //Fin
                });

            if (data.Length < 126)
            {
                sendData = new byte[data.Length + 2];
                firstByte.CopyTo(sendData, 0);
                sendData[1] = (byte)data.Length;    //서버에서는 Mask 비트가 0이어야 함
                data.CopyTo(sendData, 2);
            }
            else
            {
                // 수신과 마찬가지로 32,767이상의 길이(int16 범위 이상)의 데이터에 대응하지 못함
                sendData = new byte[data.Length + 4];
                firstByte.CopyTo(sendData, 0);
                sendData[1] = 126;
                byte[] lengthData = BitConverter.GetBytes((ushort)data.Length);
                Array.Copy(lengthData, 0, sendData, 2, 2);
                data.CopyTo(sendData, 4);
            }

            NetworkStream stream = m_client.GetStream();
            stream.Write(sendData, 0, sendData.Length);  //클라이언트에 전송
        }

        private void HandshakeToClient(int dataSize, byte[] bytes, NetworkStream stream)
        {
            string raw = Encoding.UTF8.GetString(bytes);

            string swk = Regex.Match(raw, "Sec-WebSocket-Key: (.*)").Groups[1].Value.Trim();
            string swka = swk + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
            byte[] swkaSha1 = System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(swka));
            string swkaSha1Base64 = Convert.ToBase64String(swkaSha1);

            // HTTP/1.1은 연속된 CR, LF를 라인의 끝을 의미하는 마커로 정의
            byte[] response = Encoding.UTF8.GetBytes(
                "HTTP/1.1 101 Switching Protocols\r\n" +
                "Connection: Upgrade\r\n" +
                "Upgrade: websocket\r\n" +
                "Sec-WebSocket-Accept: " + swkaSha1Base64 + "\r\n\r\n");

            //요청 승인 응답 전송
            stream.Write(response, 0, response.Length);
        }

        public void Close()
        {
            if (m_client.Connected)
            {
                m_client.Close();
                this.State = WebSocketState.Closed;
            }
        }
    }
}
