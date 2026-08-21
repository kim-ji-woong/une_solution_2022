using System.Collections.Generic;

namespace IntegrationServer.Datas.Modbus
{
    using Servers;

    class ReadCoilProvider : ClientProvider
    {
        public ReadCoilProvider(IServer mgr, string strServerIP, int port = 502)
            : base(mgr, strServerIP, port)
        {
            m_functionCode = 0x01;
        }

        protected virtual void ProcessData(List<bool> received, short startAddr, byte[] bytes)
        {
        }

        protected override bool OnReceive(byte[] bytes, byte fc, int dataLength)
        {
            if (fc == m_functionCode && dataLength + 9 == bytes.Length)
            {
                ushort requestLength;
                short startAddr = GetStartAddress(bytes, out requestLength);

                List<bool> results = ParseData(bytes, 9, 9 + dataLength - 1, requestLength);

                if (m_onlyEventLog == false)
                    WriteLog(LogTypes.Info, MakeLog(results, startAddr));

                ProcessData(results, startAddr, bytes);
                return results != null;
            }

            return false;
        }

        private string MakeLog(List<bool> results, short startAddr)
        {
            if (results == null)
                return "잘못 수신된 데이터";

            string strLog = "데이터 개수 : " + results.Count;
            strLog += ", 시작 주소 : " + startAddr;
            strLog += ", 데이터 : ";

            bool isFirst = true;

            foreach (bool flag in results)
            {
                if (isFirst)
                {
                    if (flag)
                        strLog += "1";
                    else
                        strLog += "0";

                    isFirst = false;
                }
                else
                {
                    if (flag)
                        strLog += ", 1";
                    else
                        strLog += ", 0";
                }
            }

            return strLog;
        }

        // 1. 수신한 데이터(byte)를 역순으로 읽는다.
        // 2. 각 데이터(byte)를 8개의 bit로 펼쳐놓은 다음 끝에서부터 역순으로 requestLength 만큼만 읽는다.
        private List<bool> ParseData(byte[] bytes, int beginIndex, int endIndex, int requestLength)
        {
            List<bool> results = new List<bool>();

            for (int i = endIndex; i >= beginIndex; i--)
            {
                byte data = bytes[i];

                for (int j = 8; j > 0; j--)
                {
                    results.Add(GetBitFlag(data, j));
                }
            }

            results.Reverse();

            // 필요한 데이터가 모자란다.
            if (results.Count < requestLength)
                return null;

            // 필요한 데이터 개수만큼을 제외하고 모두 버린다.
            for (int i = results.Count; i > requestLength; i--)
            {
                results.RemoveAt(requestLength);
            }

            return results;
        }

        private bool GetBitFlag(byte data, int bitOrder)
        {
            byte no = GetBitNo(bitOrder);

            if ((data & no) == no)
                return true;

            return false;
        }

        private byte GetBitNo(int bitOrder)
        {
            if (bitOrder == 1)
                return 1;
            else if (bitOrder == 2)
                return 2;
            else if (bitOrder == 3)
                return 4;
            else if (bitOrder == 4)
                return 8;
            else if (bitOrder == 5)
                return 16;
            else if (bitOrder == 6)
                return 32;
            else if (bitOrder == 7)
                return 64;
            else if (bitOrder == 8)
                return 128;

            return 0;
        }

        protected override void SendRequest()
        {
            /*if (this.IsConnected == false)
                return;

            short startAddr = (short)m_parentManager.StartAddress;
            ushort length = m_parentManager.RequestLength;         // 데이터 읽을 갯수

            byte[] arrData = MakeRequestMsg(m_functionCode, m_parentManager.SlaveID, m_transID++, (ushort)startAddr, length);
            SendBytes(arrData);*/
        }
    }
}
