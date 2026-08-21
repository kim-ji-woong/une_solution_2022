using System;
using System.Collections.Generic;

namespace ClientTest
{
    class ReadInputRegisterProvider : ClientProvider
    {
        public const int RegisterLength = 2;

        public ReadInputRegisterProvider(ModbusManager mgr)
            : base(mgr)
        {
            m_functionCode = 0x04;
        }

        protected override bool OnReceive(byte[] bytes, byte fc, int dataLength)
        {
            if (fc == m_functionCode && dataLength + 9 == bytes.Length)
            {
                ushort requestLength;
                short startAddr = GetStartAddress(bytes, out requestLength);

                if (dataLength == requestLength * RegisterLength && startAddr >= 0)
                {
                    List<short> results = ParseData(bytes, 9, 9 + dataLength);
                    m_parentManager.WriteLog(MakeLog(results, startAddr));
                    return results != null;
                }
                else
                {
                    m_parentManager.WriteLog(MakeLog(null, startAddr));
                    return false;
                }
            }

            return false;
        }

        private string MakeLog(List<short> results, short startAddr)
        {
            if (results == null)
                return "잘못 수신된 데이터";

            string strLog = "데이터 개수 : " + results.Count;
            strLog += ", 시작 주소 : " + startAddr;
            strLog += ", 데이터 : ";

            bool isFirst = true;

            foreach (short data in results)
            {
                if (isFirst)
                {
                    strLog += data;
                    isFirst = false;
                }
                else
                    strLog += ", " + data;
            }

            return strLog;
        }

        // 1. 수신한 데이터를 2Byte씩 읽는다.
        // 2. Big Endian이 적용된 데이터이기 때문에 Little Endian으로 변환하여 읽는다.
        private List<short> ParseData(byte[] bytes, int beginIndex, int endIndex)
        {
            byte[] temp = new byte[2];
            List<short> results = new List<short>();

            for (int i = beginIndex; i < endIndex; i += 2)
            {
                temp[0] = bytes[i + 1];
                temp[1] = bytes[i];
                results.Add(BitConverter.ToInt16(temp));
            }

            return results;
        }

        protected override void SendRequest()
        {
            if (this.IsConnected == false)
                return;

            short startAddr = (short)m_parentManager.StartAddress;
            ushort length = m_parentManager.RequestLength;         // 데이터 읽을 갯수

            byte[] arrData = MakeRequestMsg(m_functionCode, m_parentManager.SlaveID, m_transID++, (ushort)startAddr, length);
            SendBytes(arrData);
        }
    }
}
