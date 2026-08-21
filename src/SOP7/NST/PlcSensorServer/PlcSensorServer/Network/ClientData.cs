using System;
using dnsTcpLib2;
using System.Collections.Generic;
using System.Text;

namespace PlcSensorServer.Network
{
    public class ClientData
    {
        public enum ClientType
        {
            PLC_Provider = 0,
            UNKNOWN
        };

        private const string BeginTag = "#@";

        private int m_nPingCount = 0;
        private ClientType m_type = ClientType.UNKNOWN;
        private byte[] m_arrReceived = null;
        // OnReceive()에서 전달받는 데이터(ReceivedData)가 아직 완결되지 않은 Packet일 경우 다음 OnReceive() 호출시 데이터를
        // 합치기 위한 임시 버퍼
        private byte[] m_arrTemp = null;
        protected ServerServiceProvider m_provider = null;
        protected ConnectionState m_state = null;
        private ISensorOwner m_sensorOwner = null;

        public byte[] ReceivedData
        {
            get { return m_arrReceived; }
            set { m_arrReceived = value; }
        }

        public byte[] TempData
        {
            get { return m_arrTemp; }
            set { m_arrTemp = value; }
        }

        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public ClientType Type
        {
            get { return m_type; }
            set { m_type = value; }
        }

        public ServerServiceProvider ServiceProvider
        {
            get { return m_provider; }
            set { m_provider = value; }
        }

        public ConnectionState ConnectionState
        {
            get { return m_state; }
            set { m_state = value; }
        }

        public ClientData(ISensorOwner sensorOwner, ConnectionState state)
        {
            m_sensorOwner = sensorOwner;
            m_state = state;
        }

        // OnAccept() 이후 WhoIAm을 받은 뒤 처리해야 할 로직
        protected virtual bool ProcessFirstConnection(ConnectionState state)
        {
            return true;
        }

        protected bool ProcessFirstConnection(ClientData data, ConnectionState state)
        {
            return data.ProcessFirstConnection(state);
        }

        public virtual void Close()
        {

        }

        // bytes는 length byte가 제거되었음
        public bool OnReceiveData(ConnectionState state, byte[] bytes, bool checkValidation = true)
        {
            WriteByteArray(bytes);
            string str = bytes == null ? "" : Encoding.Default.GetString(bytes);

            if (ProcessData(str))
                m_provider.SendOK(m_state);
            else
                m_provider.SendNOK(m_state, "");

            return true;
        }

        private bool ProcessData(string strData)
        {
            if (strData.Length == 0)
                return false;

            if (strData.StartsWith(BeginTag))
            {
                string[] arr = strData.Split(BeginTag);

                if (arr.Length > 0)
                {
                    strData = BeginTag + arr[arr.Length - 1];

                    string[] tokens = strData.Split(',');

                    if (tokens.Length >= 3)
                    {
                        string strHead = tokens[0].Trim().Substring(2);

                        if (strHead.StartsWith("D"))
                            return ProcessNormal(tokens);
                        else if (strHead.StartsWith("E"))
                            return ProcessAlarm(tokens);
                    }
                }
            }

            return false;
        }

        private bool ProcessNormal(string[] datas)
        {
            List<int> currentAlarmSensorIDs = GetAlarmSensorIDs();
            int nDataCount = datas.Length;

            for (int i=2;i<nDataCount;i++)
            {
                string strValue = datas[i].Trim();
                string[] tokens = strValue.Split('&');

                if (tokens.Length != 2)
                    continue;

                float fSensorValue;

                if (float.TryParse(tokens[1].Trim(), out fSensorValue))
                {
                    if (m_sensorOwner != null)
                        m_sensorOwner.UpdateSensorData(tokens[0].Trim(), fSensorValue, currentAlarmSensorIDs);
                }
            }

            return true;
        }

        private bool ProcessAlarm(string[] datas)
        {
            List<int> currentAlarmSensorIDs = GetAlarmSensorIDs();
            int nDataCount = datas.Length;

            for (int i = 2; i < nDataCount; i++)
            {
                string strValue = datas[i].Trim();
                string[] tokens = strValue.Split('&');

                if (tokens.Length != 2)
                    continue;

                float fSensorValue;

                if (float.TryParse(tokens[1].Trim(), out fSensorValue))
                {
                    if (m_sensorOwner != null)
                        m_sensorOwner.UpdateSensorData(tokens[0].Trim(), fSensorValue, currentAlarmSensorIDs);
                }
            }

            return true;
        }

        private void WriteByteArray(byte[] bytes)
        {
            if (bytes == null)
                return;

            string strLog = "{";
            for (int i = 0; i < bytes.Length; i++)
            {
                strLog += string.Format("{0:X}", bytes[i]);
                strLog += " ";
            }
            Logger.Instance.Write(strLog + "}");

            strLog = Encoding.Default.GetString(bytes);
            Logger.Instance.Write(strLog);
        }

        private List<int> GetAlarmSensorIDs()
        {
            return m_sensorOwner.GetAlarmSensorIDs();
        }
    }
}
