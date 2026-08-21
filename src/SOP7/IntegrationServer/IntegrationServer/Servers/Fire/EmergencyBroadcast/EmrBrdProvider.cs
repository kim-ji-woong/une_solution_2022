using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Sockets;
using dnsTcpLib2;
using IntegrationServer.Datas;
using static dnsSopID.ID;
using System.Collections;
using System.Threading;
using IntegrationServer.Managers;

namespace IntegrationServer.Servers.Fire.EmergencyBroadcast
{
    public class EmrBrdProvider : ClientServiceProvider
    {
        private int m_nServerSeqNo = -1;
        private EmrBrdManager m_parentManager = null;

        private int m_nPingCount = 0;

        // 지난번에 받은 패킷이 완전하지 않을 경우 지난 패킷을 보관했다가 나머지 패킷을 수신하면 합친다.
        private byte[] m_arrTempReceived = null;

        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;

        private bool m_bReciveFirstPoll = false;

        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public EmrBrdProvider(EmrBrdManager parentManager, int nServerSeqNo)
        {
            m_parentManager = parentManager;
            m_nServerSeqNo = nServerSeqNo;

			this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public void Disconnect()
        {
            if (IsConnected == true)
            {
                try
                {
                    m_bReciveFirstPoll = false;

                    //m_parentManager.IsConnected = false;
                    m_parentManager.RecivedPoll = false;

                    ClearBuffer();

                    Close();
                }
                catch (System.Exception)
                {
                }
            }
        }

        public override void OnReceiveData()
        {
            if (ReceivedData == null)
                return;

            int ret = ReceivedData.Length;
            if (ret > 0)
            {
                m_isReadingProcess = true;

                byte[] data = new byte[ret];
                int startIndex = 0;
                if (startIndex >= 0)
                {

                    //AddLog(ReceivedData, ret);

                    //02 30 30 2D 30 30 2D 30 30 65 34 03
                    Array.Copy(ReceivedData, startIndex, data, 0, ret);
                    ProcessRecivedData(data);
                    m_nPingCount = 0;

                    // ACK를 보낸다.
                    //SendACK();
                }
                else
                {
                    // POL인경우 ACK를 보낸다.
                    //SendACK();
                }

                m_isReadingProcess = false;

                m_nPingCount = 0;
            }
            else if (ret < 0)
            {
                return;
            }

            return;
        }

        private void ProcessRecivedData(byte[] data)
        {
            if (m_arrTempReceived != null && m_arrTempReceived.Length > 0)
            {
                byte[] nTotalData = new byte[m_arrTempReceived.Length + data.Length];
                Array.Copy(m_arrTempReceived, 0, nTotalData, 0, m_arrTempReceived.Length);
                Array.Copy(data, 0, nTotalData, m_arrTempReceived.Length, data.Length);

                data = nTotalData;
            }

            ArrayList arDatas = new ArrayList();
            int nBeginIdx = -1;
            int nEndIdx = -1;
            int nLastIdx = -1;
            // 회로번호를 가져온다.
            for (int i = 0; i < data.Length; i++)
            {
                if (data[i] == 0x02)
                {
                    nBeginIdx = i;
                    nLastIdx = i;
                }
                if (data[i] == 0x03)
                {
                    nEndIdx = i;
                    nLastIdx = i;
                    if (nBeginIdx != -1)
                    {
                        int nLenght = nEndIdx - nBeginIdx + 1;
                        byte[] cmd = new byte[nLenght];
                        Array.Copy(data, nBeginIdx, cmd, 0, nLenght);
                        arDatas.Add(cmd);

                        nEndIdx = -1;
                        nBeginIdx = -1;
                    }
                    nEndIdx = -1;
                    nBeginIdx = -1;
                }
            }

            // nLastIdx가 data범위 안에 있는경우
            if (nLastIdx < data.Length && nLastIdx >= 0)
            {
                if (nLastIdx > 0)
                {
                    m_arrTempReceived = new byte[data.Length - nLastIdx - 1];
                    Array.Copy(data, nLastIdx - 1, m_arrTempReceived, 0, m_arrTempReceived.Length);
                }
                else if (nLastIdx == 0)
                {
                    m_arrTempReceived = new byte[data.Length - nLastIdx];
                    Array.Copy(data, nLastIdx, m_arrTempReceived, 0, m_arrTempReceived.Length);
                }
            }
            else
            {
                m_arrTempReceived = null;
            }

            if (IsZero(m_arrTempReceived))
                m_arrTempReceived = null;

            foreach (byte[] cmd in arDatas)
            {
                if (!IsPoll(cmd))
                {
                    AddLog(cmd, cmd.Length);
                    int nCurcuit = GetCurcuit(cmd);
                    // 해당 데이터를 처리한다.
                    ProcessSensorData(cmd, nCurcuit);
                    SendACK();
                }
                else
                {
                    if (m_bReciveFirstPoll == false)
                    {
                        m_bReciveFirstPoll = true;
                        m_parentManager.RecivedPoll = true;

                        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_EmergencyBroadcast, m_nServerSeqNo, "Recived Poll");
                    }

                    // ACK를 보낸다.
                    SendACK();

                    //SendPoll();
                }
            }
        }

        private int GetCurcuit(byte[] data)
        {
            //02 30 30 2D 30 30 2D 30 30 65 34 03
            if (data.Length < 9)
                return -1;
            char b2 = (char)data[5];
            char c1 = (char)data[7];
            char c2 = (char)data[8];

            StringBuilder sb2 = new StringBuilder();
            sb2.Append(b2);
            sb2.Append(c1);
            sb2.Append(c2);
            string szTag = sb2.ToString();
            System.Diagnostics.Trace.WriteLine("회로번호 : " + szTag);
            int nCurcuitID = -1;
            if (int.TryParse(szTag, out nCurcuitID))
            {
                return nCurcuitID;
            }
            return -1;
        }

        private void ProcessSensorData(byte[] bytes, int nTagNo)
        {

            bool bIsAlarm = false;
            if (bytes[9] == 'E' || bytes[9] == 'e')
                return;

            if (bytes[9] == 'R')
            {
                SendReset();
                return;
            }

            if (nTagNo < 0)
                return;

            SensorTag sensorTag = SensorManager.Instance.FindSensor(m_nServerSeqNo, nTagNo);

            // 회로번호가 없는 경우
            if (sensorTag == null)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_EmergencyBroadcast, m_nServerSeqNo, "없는 회로 번호 : " + nTagNo);
                return;
            }

            int isFire = bytes[4] - '0';

            if (bytes[9] == 'N' && isFire == 1)
            {
                bIsAlarm = true;
            }
            else if (bytes[9] == 'N' && isFire == 2)
            {
                if (sensorTag.SensorType == 3)
                {
                    bIsAlarm = true;
                }
            }
            else if (bytes[9] == 'F' && isFire == 2)
            {
                if (sensorTag.SensorType == 3)
                {
                    bIsAlarm = false;
                }
            }
            else if (bytes[9] == 'F' && isFire == 1)
            {
                bIsAlarm = false;
            }
            else if (bytes[9] == 'R')
            {
                SendReset();
                return;
            }
            else
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_EmergencyBroadcast, m_nServerSeqNo, "처리할 수없는 데이터 유형 : " + nTagNo);
                return;
            }

            SendSensorData(sensorTag, bIsAlarm);
        }

        private bool IsPoll(byte[] data)
        {

            int nSTX = FindSTX(data);
            int nETX = FindETX(data);

            if (nSTX == -1 || nETX == -1)
                return false;


            if (data.Length <= nSTX + 3)
                return false;

            char b2 = (char)data[nSTX + 1];
            char c1 = (char)data[nSTX + 2];
            char c2 = (char)data[nSTX + 3];

            StringBuilder sb2 = new StringBuilder();
            sb2.Append(b2);
            sb2.Append(c1);
            sb2.Append(c2);
            string szTag = sb2.ToString();
            if (szTag == "POL")
                return true;

            return false;
        }

        private int FindETX(byte[] bytes)
        {
            for (int i = 0; i < bytes.Length; i++)
            {
                if (bytes[i] == 0x03)
                {
                    return i;
                }
            }
            return -1;
        }

        private int FindSTX(byte[] bytes)
        {
            for (int i = 0; i < bytes.Length; i++)
            {
                if (bytes[i] == 0x02)
                {
                    return i;
                }
            }
            return -1;
        }

        private bool IsZero(byte[] buffer)
        {
            if (buffer == null)
                return true;

            for (int i = 0; i < buffer.Length; i++)
            {
                if (buffer[i] != 0x00)
                {
                    return false;
                }
            }
            return true;
        }

        private void ClearBuffer()
        {
            m_arrTempReceived = null;
        }

        public void SendReset()
        {
            Dictionary<int, SensorTag> sensorTags = SensorManager.Instance.FindSensors(m_nServerSeqNo);

            foreach (KeyValuePair<int, SensorTag> pair in sensorTags)
            {
                SensorTag sensorTag = pair.Value;
                SendSensorData(sensorTag, false);
                Thread.Sleep(50);
            }

            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_EmergencyBroadcast, m_nServerSeqNo, "[SOP서버로 수신반 리셋]");
        }

        private void SendSensorData(SensorTag sensorTag, bool bIsAlarm)
        {
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_EmergencyBroadcast, m_nServerSeqNo, "[SOP서버로 회로 TagID " + sensorTag.ID + " 에 대해 " + bIsAlarm.ToString() + " 값 전송]");
            m_parentManager.SendSensorData(sensorTag, bIsAlarm);
        }

        public void SendACK()
        {
            SendData(SERIAL_ID.ACK);
        }

        // header 1 Byte로만 이루어진 데이터
        private void SendData(byte header)
        {
            byte[] send = new byte[1];
            send[0] = header;
            base.Send(send, 0, 1);

        }
        private void AddLog(Byte[] bufRecive, int ret)
        {
            string tmp = "";
            for (int j = 0; j < ret; j++)
            {
                byte b = bufRecive[j];
                if (tmp.Length == 0)
                    tmp = string.Format("{0:X2}", (int)b);
                else
                    tmp += string.Format(" {0:X2}", (int)b);
            }
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_EmergencyBroadcast, m_nServerSeqNo, "[RECIVED TXT] : " + tmp);
        }

        public override void OnDropConnection()
        {
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_EmergencyBroadcast, m_nServerSeqNo, "close Connection");
        }
    }
}
