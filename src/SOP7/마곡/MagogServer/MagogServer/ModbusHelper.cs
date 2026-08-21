using System;
using System.Collections.Generic;
using System.Text;

namespace MagogServer
{
    public class ModbusHelper
    {
        public static byte FC_ReadDiscrete = 0x02;


        public static byte[] MakeRequestMsg(byte code, int nSlaveID, UInt16 nTransID, UInt16 nStartAddr, UInt16 nAddrLength)
        {
            byte[] arrSlaveID = BitConverter.GetBytes(nSlaveID);
            byte slaveID = arrSlaveID[0];

            UInt16 nLength = 6;

            byte[] arrTransID = BitConverter.GetBytes(nTransID);
            byte[] arrStartAddr = BitConverter.GetBytes(nStartAddr);
            byte[] arrAddrLength = BitConverter.GetBytes(nAddrLength);

            byte[] arrLength = BitConverter.GetBytes(nLength);




            // .TODO: 리틀엔디안 빅엔디안 체크 필요
            Array.Reverse(arrTransID);
            Array.Reverse(arrStartAddr);
            Array.Reverse(arrAddrLength);

            Array.Reverse(arrLength);




            byte[] data = new byte[12];

            //data[0] = 0x00;       // Transaction ID
            //data[1] = 0x00;       // Transaction ID
            Array.Copy(arrTransID, 0, data, 0, arrTransID.Length);

            data[2] = 0x00;         // TCP/IP 고정
            data[3] = 0x00;         // TCP/IP 고정

            //data[4] = 0x00;         // 길이
            //data[5] = 0x06;         // 길이
            Array.Copy(arrLength, 0, data, 4, arrLength.Length);

            data[6] = slaveID;      // Server ID

            data[7] = code;         // Function code

            //data[8] = 0x00;         // 읽어올 주소
            //data[9] = 0x00;         // 읽어올 주소 
            Array.Copy(arrStartAddr, 0, data, 8, arrStartAddr.Length);

            //data[10] = 0x00;      // 읽어올 갯수
            //data[11] = 0x06;      // 읽어올 갯수
            Array.Copy(arrAddrLength, 0, data, 10, arrAddrLength.Length);

            return data;
        }
    }
}
