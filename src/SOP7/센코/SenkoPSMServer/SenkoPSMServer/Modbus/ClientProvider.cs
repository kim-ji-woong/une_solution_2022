using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using SenkoPSMServer.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TcpLib2;

namespace SenkoPSMServer.Modbus
{
    public class ClientProvider : ClientServiceProvider
    {
        private SenkoSensorData m_senkoSensor = null;
        private ModbusManager m_parent = null;

        private bool m_runThread = false;

        Thread m_ConnectionThread = null;
        Thread m_RequestThread = null;

        CRC CRC = new CRC();
        private SopQueryManager m_sopQueryMgr = new SopQueryManager();

        public ClientProvider(ModbusManager parent, SenkoSensorData senkoSensor)
        {
            m_parent = parent;
            m_senkoSensor = senkoSensor;            
        }

        public void Start()
        {
            m_runThread = true;

            m_ConnectionThread = new Thread(new ThreadStart(ConnectionThread));
            m_ConnectionThread.Start();

            m_RequestThread = new Thread(new ThreadStart(RequestThread));
            m_RequestThread.Start();
        }

        public void Stop()
        {
            m_runThread = false;

            if (m_ConnectionThread != null && m_ConnectionThread.ThreadState != ThreadState.Stopped)
                m_ConnectionThread.Abort();

            if (m_RequestThread != null && m_RequestThread.ThreadState != ThreadState.Stopped)
                m_RequestThread.Abort();

            this.Close();
        }

        private void ConnectionThread()
        {
            while (m_runThread)
            {
                try
                {
                    if (!this.IsConnected)
                    {
                        lock (this)
                        {
                            if (m_senkoSensor.IP != null && m_senkoSensor.Port > 0)
                            {
                                this.Connect(m_senkoSensor.IP, m_senkoSensor.Port);
                                Logger.Instance.Write("[INFO] ConnectionThread() : " + m_senkoSensor.IP + ":" + m_senkoSensor.Port + " / " + this.IsConnected);
                            }
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("[ERROR] ConnectionThread() : " + e.Message);
                }
            }
        }
        
        private void RequestThread()
        {
            while (m_runThread)
            {
                try
                {
                    if (this.IsConnected)
                    {
                        byte FC_ReadInputRegister = 0x04;
                        UInt16 nStartAddr = 40001;
                        UInt16 nRequestLength = 3;
                        int nSlaveID = 1;

                        byte[] arrData = MakeRTUMsg(FC_ReadInputRegister, nSlaveID, nStartAddr, nRequestLength);
                        SendBytes(arrData);
                    }

                    Thread.Sleep(2000);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("[ERROR] RequestThread() : " + e.Message);
                }
            }
        }        

        public override void OnDropConnection()
        {
            //throw new NotImplementedException();
        }

        public override void OnReceiveData()
        {
            // RTU 방식
            string strErrorMessage = "";
            int nRegisterLeng = 2;
            int nRequestLength = 3;

            try
            {                
                byte[] data = this.ReceivedData;

                if (data == null || data.Length < 4)
                    return;

                byte FC = data[1];
 
                byte[] arrTemp = new byte[nRegisterLeng];

                Array.Copy(data, 2, arrTemp, 0, nRegisterLeng); 
                short nDataLeng = BitConverter.ToInt16(arrTemp, 0);

                if (nDataLeng != nRequestLength * nRegisterLeng)
                    return;

                byte[] arrData = new byte[nDataLeng];
                Array.Copy(data, 9, arrData, 0, nDataLeng);

                byte[] arrRegister40001 = new byte[nRegisterLeng];
                byte[] arrRegister40003 = new byte[nRegisterLeng];

                Array.Copy(arrData, 0, arrRegister40001, 0, nRegisterLeng);
                Array.Copy(arrData, 2, arrRegister40003, 0, nRegisterLeng);


                // 상태값
                BitArray bitArray = new BitArray(arrRegister40001);

                // 모드 상태값
                bool bState1 = bitArray[0];
                bool bState2 = bitArray[1];
                bool bState3 = bitArray[2];
                bool bState4 = bitArray[3];

                bool bIsMeasure = (bState1 == true && bState2 == false && bState3 == false && bState4 == false) ? true : false;

                // 알람 관련 상태값
                bool bIsAlarm1 = bitArray[6];
                bool bIsAlarm2 = bitArray[7];
               
                int nAlarmDepth = 0;

                if (bIsMeasure)
                { // 측정모드 경우만

                    // 알람단계
                    if (bIsAlarm2 == true)
                        nAlarmDepth = 4;
                    else if (bIsAlarm1 == true)
                        nAlarmDepth = 3;

                    // 가스농도
                    double dValue = Math.Round(BitConverter.ToSingle(arrRegister40003, 0), 2);

                    if (m_senkoSensor.SensorID.HasValue)
                    {   // 가스 농도값 업데이트
                        Dictionary<SensorPSM.Fields, object> dicSets = new Dictionary<SensorPSM.Fields, object>();
                        dicSets[SensorPSM.Fields.CurrentData] = dValue;

                        string strCondition = string.Format("{0} = {1}", SensorPSM.Fields.ID, m_senkoSensor.SensorID.Value);

                        if (m_parent.DataManager.GetUpdate().Update<SensorPSM, SensorPSM.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write("[ERROR] Update fail : " + strErrorMessage);
                            return;
                        }
                    }
                    else
                    {
                        Logger.Instance.Write("[ERROR] OnReceiveData() : senkoSensor ID 값이 없습니다.");
                        return;
                    }                   
                }

                // 알람 발생 및 해제 신호
                if (m_senkoSensor != null)
                {
                    if (m_senkoSensor.AlarmDepth != nAlarmDepth)
                    {
                        bool bIsAlarm = true;

                        ArrayList arrAlarmData = new ArrayList();
                        arrAlarmData.Add((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR);
                        arrAlarmData.Add(m_senkoSensor.TagInfoID);
                        arrAlarmData.Add(m_senkoSensor.SensorZoneID);

                        if (nAlarmDepth == 0)
                        {   // 알람 해제
                            bIsAlarm = false;
                        }

                        if (m_sopQueryMgr.SendAlarmQuery(arrAlarmData, "POST", m_parent.AlarmURL) == false)
                        {
                            Logger.Instance.Write("[ERROR] SendAlarmQuery fail : " + strErrorMessage);
                            return;
                        }

                        m_senkoSensor.AlarmDepth = nAlarmDepth;
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("[ERROR] OnReceiveData() : " + e.Message);
            }
        }

        public void SendBytes(byte[] CmdBuff)
        {
            SendLog(CmdBuff, CmdBuff.Length);
            try
            {
                if (!this.IsClientDisposed && this.IsConnected)
                {
                    this.LengthAdd = false;
                    //this.Send(CmdBuff, 0, CmdBuff.Length);
                    int nResult = this.Send(CmdBuff, 0, CmdBuff.Length);

                    if (nResult < 0)
                    {
                        lock (this)
                        {
                            this.Close();

                            if (this.Client.Client != null)
                            {
                                if (this.Client.Connected)
                                    this.Client.Close();
                            }
                        }
                    }

                    Thread.Sleep(50);
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("[ERROR] SendBytes() : " + e.Message);
            }
        }

        private void SendLog(Byte[] bufRecive, int ret)
        {
            string tmp = GetTEXT(bufRecive, ret);
            Logger.Instance.Write("[SEND TXT] : " + tmp);
        }

        private string GetTEXT(Byte[] bufRecive, int ret)
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

            return tmp;
        }

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

        public static byte[] MakeRTUMsg(byte code, int nSlaveID, UInt16 nStartAddr, UInt16 nLength)
        {
            byte[] arrSlaveID = BitConverter.GetBytes(nSlaveID);
            byte slaveID = arrSlaveID[0];

            byte[] arrStartAddr = BitConverter.GetBytes(nStartAddr);
            byte[] arrLength = BitConverter.GetBytes(nLength);

            byte[] data = new byte[6];

            data[0] = slaveID;      // Slave ID
            data[1] = code;         // Function code

            // 읽어올 주소
            Array.Copy(arrStartAddr, 0, data, 2, arrStartAddr.Length);

            // 읽어올 갯수
            Array.Copy(arrLength, 0, data, 4, arrLength.Length);

            // CRC 구하기
            UInt16 nCRC = CRC.MakeCRC(data);
            byte[] arrCRC = BitConverter.GetBytes(nCRC);



            // 데이터 총정리    
            byte[] resultData = new byte[8];
            Array.Copy(data, 0, resultData, 0, data.Length);
            Array.Copy(arrCRC, 0, resultData, 6, data.Length);

            return resultData;
        }
    }


    public class CRC
    {
        private static ushort[] CrcTable = {
            0X0000, 0XC0C1, 0XC181, 0X0140, 0XC301, 0X03C0, 0X0280, 0XC241,
            0XC601, 0X06C0, 0X0780, 0XC741, 0X0500, 0XC5C1, 0XC481, 0X0440,
            0XCC01, 0X0CC0, 0X0D80, 0XCD41, 0X0F00, 0XCFC1, 0XCE81, 0X0E40,
            0X0A00, 0XCAC1, 0XCB81, 0X0B40, 0XC901, 0X09C0, 0X0880, 0XC841,
            0XD801, 0X18C0, 0X1980, 0XD941, 0X1B00, 0XDBC1, 0XDA81, 0X1A40,
            0X1E00, 0XDEC1, 0XDF81, 0X1F40, 0XDD01, 0X1DC0, 0X1C80, 0XDC41,
            0X1400, 0XD4C1, 0XD581, 0X1540, 0XD701, 0X17C0, 0X1680, 0XD641,
            0XD201, 0X12C0, 0X1380, 0XD341, 0X1100, 0XD1C1, 0XD081, 0X1040,
            0XF001, 0X30C0, 0X3180, 0XF141, 0X3300, 0XF3C1, 0XF281, 0X3240,
            0X3600, 0XF6C1, 0XF781, 0X3740, 0XF501, 0X35C0, 0X3480, 0XF441,
            0X3C00, 0XFCC1, 0XFD81, 0X3D40, 0XFF01, 0X3FC0, 0X3E80, 0XFE41,
            0XFA01, 0X3AC0, 0X3B80, 0XFB41, 0X3900, 0XF9C1, 0XF881, 0X3840,
            0X2800, 0XE8C1, 0XE981, 0X2940, 0XEB01, 0X2BC0, 0X2A80, 0XEA41,
            0XEE01, 0X2EC0, 0X2F80, 0XEF41, 0X2D00, 0XEDC1, 0XEC81, 0X2C40,
            0XE401, 0X24C0, 0X2580, 0XE541, 0X2700, 0XE7C1, 0XE681, 0X2640,
            0X2200, 0XE2C1, 0XE381, 0X2340, 0XE101, 0X21C0, 0X2080, 0XE041,
            0XA001, 0X60C0, 0X6180, 0XA141, 0X6300, 0XA3C1, 0XA281, 0X6240,
            0X6600, 0XA6C1, 0XA781, 0X6740, 0XA501, 0X65C0, 0X6480, 0XA441,
            0X6C00, 0XACC1, 0XAD81, 0X6D40, 0XAF01, 0X6FC0, 0X6E80, 0XAE41,
            0XAA01, 0X6AC0, 0X6B80, 0XAB41, 0X6900, 0XA9C1, 0XA881, 0X6840,
            0X7800, 0XB8C1, 0XB981, 0X7940, 0XBB01, 0X7BC0, 0X7A80, 0XBA41,
            0XBE01, 0X7EC0, 0X7F80, 0XBF41, 0X7D00, 0XBDC1, 0XBC81, 0X7C40,
            0XB401, 0X74C0, 0X7580, 0XB541, 0X7700, 0XB7C1, 0XB681, 0X7640,
            0X7200, 0XB2C1, 0XB381, 0X7340, 0XB101, 0X71C0, 0X7080, 0XB041,
            0X5000, 0X90C1, 0X9181, 0X5140, 0X9301, 0X53C0, 0X5280, 0X9241,
            0X9601, 0X56C0, 0X5780, 0X9741, 0X5500, 0X95C1, 0X9481, 0X5440,
            0X9C01, 0X5CC0, 0X5D80, 0X9D41, 0X5F00, 0X9FC1, 0X9E81, 0X5E40,
            0X5A00, 0X9AC1, 0X9B81, 0X5B40, 0X9901, 0X59C0, 0X5880, 0X9841,
            0X8801, 0X48C0, 0X4980, 0X8941, 0X4B00, 0X8BC1, 0X8A81, 0X4A40,
            0X4E00, 0X8EC1, 0X8F81, 0X4F40, 0X8D01, 0X4DC0, 0X4C80, 0X8C41,
            0X4400, 0X84C1, 0X8581, 0X4540, 0X8701, 0X47C0, 0X4680, 0X8641,
            0X8201, 0X42C0, 0X4380, 0X8341, 0X4100, 0X81C1, 0X8081, 0X4040 };

        public static UInt16 MakeCRC(byte[] data)
        {
            ushort crc = 0xFFFF;

            foreach (byte datum in data)
            {
                crc = (ushort)((crc >> 8) ^ CrcTable[(crc ^ datum) & 0xFF]);
            }

            return crc;
        }
    }
}

