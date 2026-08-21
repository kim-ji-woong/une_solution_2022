using Airbase20.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace powerDataServer
{
    public class ID
    {
        public static byte FC_ReadCoils = 0x01;
        public static byte FC_ReadDiscrete = 0x02;
        public static byte FC_ReadHolding = 0x03;
        public static byte FC_ReadInputRegister = 0x04;

        public static int AutoPAD_Discrete_Length = 72;
        public static int AutoPAD_Register_Length = 102;

        public static int Multi_Discrete_Length1 = 96;
        public static int Multi_Discrete_Length2 = 54;

        public static int Multi_Register_Length1 = 120;
        public static int Multi_Register_Length2 = 106;


        public static int XGIPAMF_Length = 42;
        public static int GIMACIIPLUS_Length = 40;
        public static int GIMACDC_Length = 12;
        public static int GIMACI_Length = 28;

        public static int PECK_Length = 13;
    }

    public class MsgHelper
    {
        public static byte[] MakeRequestMsg(byte code, int nSlaveID, UInt16 nTransID, UInt16 nStartAddr, UInt16 nLength)
        {
            byte[] arrSlaveID = BitConverter.GetBytes(nSlaveID);
            byte slaveID = arrSlaveID[0];

            byte[] arrTransID = BitConverter.GetBytes(nTransID);
            byte[] arrStartAddr = BitConverter.GetBytes(nStartAddr);
            byte[] arrLength = BitConverter.GetBytes(nLength);

            Array.Reverse(arrTransID);
            Array.Reverse(arrStartAddr);
            Array.Reverse(arrLength);


            byte[] data = new byte[12];

            //data[0] = 0x00;       // Transaction ID
            //data[1] = 0x00;       // Transaction ID
            Array.Copy(arrTransID, 0, data, 0, arrTransID.Length);

            data[2] = 0x00;         // TCP/IP 고정
            data[3] = 0x00;         // TCP/IP 고정

            data[4] = 0x00;         // 길이
            data[5] = 0x06;         // 길이

            data[6] = slaveID;      // Server ID

            data[7] = code;         // Function code

            //data[8] = 0x00;         // 읽어올 주소
            //data[9] = 0x00;         // 읽어올 주소 
            Array.Copy(arrStartAddr, 0, data, 8, arrStartAddr.Length);

            //data[10] = 0x00;      // 읽어올 갯수
            //data[11] = 0x06;      // 읽어올 갯수
            Array.Copy(arrLength, 0, data, 10, arrLength.Length);

            return data;
        }
    }


    public class SwitchData : Switch
    {
        public SwitchData()
        {

        }

        public SwitchData(Switch switchData)
        {
            this.ID = switchData.ID;
            this.Name = switchData.Name;
            this.Type = switchData.Type;
            this.IP = switchData.IP;
            this.SubIP = switchData.SubIP;
            this.Port = switchData.Port;
            this.Memo = switchData.Memo;
            this.SlaveID = switchData.SlaveID;
        }

        private Dictionary<int, SwitchDetail> m_dicSwitchDetails = null;
        public Dictionary<int, SwitchDetail> SwitchDetails
        {
            get { return m_dicSwitchDetails; }
            set { m_dicSwitchDetails = value; }
        }

    }

    
}
