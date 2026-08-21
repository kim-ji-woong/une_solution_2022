using dnsCommunicateSopServer;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TcpLib2;

namespace WonikErpNSheServer.Gas
{
    public class GasSProvider : ClientServiceProvider
    {
        public enum Types { Device1 = 0, Device2, Device3, Device4, Device5, Device6, Device7, Device8, Device9 }

        GasManager m_parentManager = null;
        Types Type = Types.Device1;

        public string DeviceName { get; set; }
        public string IP { get; set; }
        public int Port { get; set; }

        private bool m_runThread = false;
        private bool m_bIsConnect = false;

        Thread m_ConnectionThread = null;
        Thread m_RequestThread = null;

        private UInt16 m_nTransID = 0;

        DBDataManager m_dbDataManager = null;
        SopQueryManager m_sopQueryMgr = null;

        private Dictionary<string, GasSensorData> m_dicGasSensors = null;
        /// <summary>
        /// 현재 상태값 및 상태변화 체크용
        /// </summary>
        private Dictionary<string, GasData> m_dicGasDatas = new Dictionary<string, GasData>();

        private string m_strSOPWebServerURL = null;

        public GasSProvider(GasManager parentManager, Types type, string strIP, int nPort, DBDataManager dbDataManager, SopQueryManager sopQueryMgr, Dictionary<string, GasSensorData> dicGasSensors, string strSOPWebServerURL)
        {
            m_parentManager = parentManager;
            m_dbDataManager = dbDataManager;
            m_sopQueryMgr = sopQueryMgr;
            m_dicGasSensors = dicGasSensors;
            m_strSOPWebServerURL = strSOPWebServerURL;

            this.Type = type;
            this.IP = strIP;
            this.Port = nPort;

            this.DeviceName = "S_" + type;
        }

        public override void OnDropConnection()
        {
            //throw new NotImplementedException();
        }

        public void Start()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            //m_ConnectionThread = new Thread(new ThreadStart(ConnectionThread));
            //m_ConnectionThread.Start();

            m_RequestThread = new Thread(new ThreadStart(RequestThread));
            m_RequestThread.Start();
        }

        public void Stop()
        {
            if (!m_runThread)
                return;

            m_runThread = false;
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
                            if ( this.Port > 0 && this.IP != null && this.IP != "")
                            {
                                bool bResult = this.Connect(this.IP, this.Port);

                                if (m_bIsConnect == false && bResult == true)
                                {   // 연결 성공
                                    m_bIsConnect = true;
                                    m_parentManager.Logger.Write($"[" + this.DeviceName + "] ConnectionThread() : " + this.IP + ":" + this.Port.ToString() + " / " + this.IsConnected);
                                }
                                else if (m_bIsConnect == true && bResult == false)
                                {   // 연결 실패
                                    m_bIsConnect = false;
                                    m_parentManager.Logger.Write("[" + this.DeviceName + "] ConnectionThread() : " + this.IP + ":" + this.Port.ToString() + " / " + this.IsConnected);
                                }
                            }
                        }

                        Thread.Sleep(500);
                    }
                    else
                    {
                        Thread.Sleep(1000 * 5);
                    }
                    
                }
                catch (Exception e)
                {
                    m_parentManager.Logger.Write("[" + this.DeviceName + "] ConnectionThread() : " + e.Message);
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
                        UInt16 nStartAddr, nLength;         // 입력포트 시작주소, 갯수
                        int nSlaveID = 1;

                        if (this.Type == Types.Device1)
                        {
                            nStartAddr = 1000;
                            nLength = (UInt16)ID.S_Dev1_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 100;
                            nLength = (UInt16)ID.S_Dev1_Register_Length;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device2)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev2_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev2_Register_Length;

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;

                        }
                        else if (this.Type == Types.Device3)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev3_Discrete_Length1;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;

                            nStartAddr = 1000;
                            nLength = (UInt16)ID.S_Dev3_Discrete_Length2;

                            arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;


                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev3_Register_Length1;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;

                            nStartAddr = 100;
                            nLength = (UInt16)ID.S_Dev3_Register_Length2;


                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device4)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev4_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev4_Register_Length; 

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device5)
                        {
                            nStartAddr = 0; 
                            nLength = (UInt16)ID.S_Dev5_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev5_Register_Length; 

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device6)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev6_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0; 
                            nLength = (UInt16)ID.S_Dev6_Register_Length;

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device7)
                        {
                            nStartAddr = 0; 
                            nLength = (UInt16)ID.S_Dev7_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev7_Register_Length; 

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device8)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev8_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0; 
                            nLength = (UInt16)ID.S_Dev8_Register_Length; 

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device9)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev9_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.S_Dev9_Register_Length;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                    }
                    else
                    {
                        if (this.Port > 0 && this.IP != null && this.IP != "")
                        {
                            bool bResult = this.Connect(this.IP, this.Port);

                            if (m_bIsConnect == false && bResult == true)
                            {   // 연결 성공
                                m_bIsConnect = true;
                                m_parentManager.Logger.Write($"[" + this.DeviceName + "] ConnectionThread() : " + this.IP + ":" + this.Port.ToString() + " / " + this.IsConnected);
                            }
                            else if (m_bIsConnect == true && bResult == false)
                            {   // 연결 실패
                                m_bIsConnect = false;
                                m_parentManager.Logger.Write("[" + this.DeviceName + "] ConnectionThread() : " + this.IP + ":" + this.Port.ToString() + " / " + this.IsConnected);
                            }
                        }
                    }

                    Thread.Sleep(800);
                }
                catch (Exception e)
                {
                    m_parentManager.Logger.Write("[" + this.DeviceName + "] RequestThread() : " + e.Message);
                }
            }
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

        public void SendBytes(byte[] CmdBuff)
        {
            //SendLog(CmdBuff, CmdBuff.Length);
            try
            {
                if (!this.IsClientDisposed && this.IsConnected)
                {
                    this.LengthAdd = false;
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
                m_parentManager.Logger.Write("[" + this.DeviceName + "] SendBytes() : " + e.Message);
            }
        }

        private void SendLog(Byte[] bufRecive, int ret)
        {
            string tmp = GetTEXT(bufRecive, ret);
            m_parentManager.Logger.Write("[" + this.DeviceName + " SEND TXT] : " + tmp);
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

        public override void OnReceiveData()
        {
            string strErrorMessage = "";
            int nRegisterLeng = 2;

            try
            {
                byte[] data = this.ReceivedData;

                if (data == null || data.Length < 10)
                    return;

                byte FC = data[7];
                int nDataLeng = data[8];

                byte[] arrData = new byte[nDataLeng];

                Array.Copy(data, 9, arrData, 0, nDataLeng);

                Dictionary<string, GasData> dicGasDatas = new Dictionary<string, GasData>();

                if (this.Type == Types.Device1)
                {
                    dicGasDatas[ID.GD_S1_A23] = new GasData(ID.GD_S1_A23, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A24] = new GasData(ID.GD_S1_A24, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A25] = new GasData(ID.GD_S1_A25, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A29] = new GasData(ID.GD_S1_A29, ID.HF, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S1_A01] = new GasData(ID.GD_S1_A01, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A02] = new GasData(ID.GD_S1_A02, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A03] = new GasData(ID.GD_S1_A03, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A04] = new GasData(ID.GD_S1_A04, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A05] = new GasData(ID.GD_S1_A05, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A06] = new GasData(ID.GD_S1_A06, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A07] = new GasData(ID.GD_S1_A07, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A08] = new GasData(ID.GD_S1_A08, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A09] = new GasData(ID.GD_S1_A09, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A10] = new GasData(ID.GD_S1_A10, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A11] = new GasData(ID.GD_S1_A11, ID.HF, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S1_A16] = new GasData(ID.GD_S1_A16, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A17] = new GasData(ID.GD_S1_A17, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A18] = new GasData(ID.GD_S1_A18, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A19] = new GasData(ID.GD_S1_A19, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A20] = new GasData(ID.GD_S1_A20, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A21] = new GasData(ID.GD_S1_A21, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A22] = new GasData(ID.GD_S1_A22, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S1_A26] = new GasData(ID.GD_S1_A26, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S1_A12] = new GasData(ID.GD_S1_A12, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A13] = new GasData(ID.GD_S1_A13, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A14] = new GasData(ID.GD_S1_A14, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A15] = new GasData(ID.GD_S1_A15, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S1_A27] = new GasData(ID.GD_S1_A27, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S1_A28] = new GasData(ID.GD_S1_A28, ID.O2, GasData.VauleTypes.Divide10);
                }
                else if (this.Type == Types.Device2)
                {
                    dicGasDatas[ID.GD_S2_B01] = new GasData(ID.GD_S2_B01, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B02] = new GasData(ID.GD_S2_B02, ID.O2, GasData.VauleTypes.ConverS2);
                    dicGasDatas[ID.GD_S2_B03] = new GasData(ID.GD_S2_B03, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B04] = new GasData(ID.GD_S2_B04, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B05] = new GasData(ID.GD_S2_B05, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B06] = new GasData(ID.GD_S2_B06, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B07] = new GasData(ID.GD_S2_B07, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B08] = new GasData(ID.GD_S2_B08, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B09] = new GasData(ID.GD_S2_B09, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B10] = new GasData(ID.GD_S2_B10, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B11] = new GasData(ID.GD_S2_B11, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B12] = new GasData(ID.GD_S2_B12, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B13] = new GasData(ID.GD_S2_B13, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B14] = new GasData(ID.GD_S2_B14, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B15] = new GasData(ID.GD_S2_B15, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B16] = new GasData(ID.GD_S2_B16, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B17] = new GasData(ID.GD_S2_B17, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B18] = new GasData(ID.GD_S2_B18, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B19] = new GasData(ID.GD_S2_B19, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B20] = new GasData(ID.GD_S2_B20, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B21] = new GasData(ID.GD_S2_B21, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B22] = new GasData(ID.GD_S2_B22, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_B23] = new GasData(ID.GD_S2_B23, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_E01] = new GasData(ID.GD_S2_E01, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E02] = new GasData(ID.GD_S2_E02, ID.HNO3, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E03] = new GasData(ID.GD_S2_E03, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E04] = new GasData(ID.GD_S2_E04, ID.HNO3, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E05] = new GasData(ID.GD_S2_E05, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E06] = new GasData(ID.GD_S2_E06, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E07] = new GasData(ID.GD_S2_E07, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E08] = new GasData(ID.GD_S2_E08, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E09] = new GasData(ID.GD_S2_E09, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E10] = new GasData(ID.GD_S2_E10, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_E11] = new GasData(ID.GD_S2_E11, ID.O2, GasData.VauleTypes.Divide10);


                    dicGasDatas[ID.GAS_EF_2F_1] = new GasData(ID.GAS_EF_2F_1, ID.Fault);
                    dicGasDatas[ID.GAS_EF_2F_2] = new GasData(ID.GAS_EF_2F_2, ID.Fault);
                    dicGasDatas[ID.GAS_EF_2F_3] = new GasData(ID.GAS_EF_2F_3, ID.Fault);
                    dicGasDatas[ID.GAS_EF_2F_4] = new GasData(ID.GAS_EF_2F_4, ID.Fault);

                }
                else if (this.Type == Types.Device3)
                {
                    if (FC == ID.FC_ReadInputRegister)
                    {
                        if (arrData.Length == ID.S_Dev3_Register_Length1 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_S2_C02] = new GasData(ID.GD_S2_C02, ID.O2, GasData.VauleTypes.ConverS2);
                            dicGasDatas[ID.GD_S2_C08] = new GasData(ID.GD_S2_C08, ID.O2, GasData.VauleTypes.ConverS2);
                            dicGasDatas[ID.GD_S2_C09] = new GasData(ID.GD_S2_C09, ID.O2, GasData.VauleTypes.ConverS2);
                            dicGasDatas[ID.GD_S2_C10] = new GasData(ID.GD_S2_C10, ID.O2, GasData.VauleTypes.ConverS2);
                        }
                        else if (arrData.Length == ID.S_Dev3_Register_Length2 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_S2_D01] = new GasData(ID.GD_S2_D01, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D02] = new GasData(ID.GD_S2_D02, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D03] = new GasData(ID.GD_S2_D03, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D04] = new GasData(ID.GD_S2_D04, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D05] = new GasData(ID.GD_S2_D05, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D06] = new GasData(ID.GD_S2_D06, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D07] = new GasData(ID.GD_S2_D07, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D08] = new GasData(ID.GD_S2_D08, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D09] = new GasData(ID.GD_S2_D09, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D10] = new GasData(ID.GD_S2_D10, ID.O2, GasData.VauleTypes.Divide10);

                            dicGasDatas[ID.GD_S2_C01] = new GasData(ID.GD_S2_C01, ID.LNG);
                            dicGasDatas[ID.GD_S2_C03] = new GasData(ID.GD_S2_C03, ID.LNG);
                            dicGasDatas[ID.GD_S2_C04] = new GasData(ID.GD_S2_C04, ID.LNG);
                            dicGasDatas[ID.GD_S2_C05] = new GasData(ID.GD_S2_C05, ID.LNG);
                            dicGasDatas[ID.GD_S2_C06] = new GasData(ID.GD_S2_C06, ID.LNG);
                            dicGasDatas[ID.GD_S2_C07] = new GasData(ID.GD_S2_C07, ID.LNG);
                            dicGasDatas[ID.GD_S2_C11] = new GasData(ID.GD_S2_C11, ID.LNG);
                        }

                    }
                    else if (FC == ID.FC_ReadDiscrete)
                    {
                        BitArray bitArray = new BitArray(arrData);

                        if (bitArray.Length >= ID.S_Dev3_Discrete_Length1)
                        {
                            dicGasDatas[ID.GD_S2_C02] = new GasData(ID.GD_S2_C02, ID.O2, GasData.VauleTypes.ConverS2);
                            dicGasDatas[ID.GD_S2_C08] = new GasData(ID.GD_S2_C08, ID.O2, GasData.VauleTypes.ConverS2);
                            dicGasDatas[ID.GD_S2_C09] = new GasData(ID.GD_S2_C09, ID.O2, GasData.VauleTypes.ConverS2);
                            dicGasDatas[ID.GD_S2_C10] = new GasData(ID.GD_S2_C10, ID.O2, GasData.VauleTypes.ConverS2);
                        }
                        else if (bitArray.Length >= ID.S_Dev3_Discrete_Length2)
                        {
                            dicGasDatas[ID.GD_S2_D01] = new GasData(ID.GD_S2_D01, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D02] = new GasData(ID.GD_S2_D02, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D03] = new GasData(ID.GD_S2_D03, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D04] = new GasData(ID.GD_S2_D04, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D05] = new GasData(ID.GD_S2_D05, ID.HF, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D06] = new GasData(ID.GD_S2_D06, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D07] = new GasData(ID.GD_S2_D07, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D08] = new GasData(ID.GD_S2_D08, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D09] = new GasData(ID.GD_S2_D09, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_S2_D10] = new GasData(ID.GD_S2_D10, ID.O2, GasData.VauleTypes.Divide10);

                            dicGasDatas[ID.GD_S2_C01] = new GasData(ID.GD_S2_C01, ID.LNG);
                            dicGasDatas[ID.GD_S2_C03] = new GasData(ID.GD_S2_C03, ID.LNG);
                            dicGasDatas[ID.GD_S2_C04] = new GasData(ID.GD_S2_C04, ID.LNG);
                            dicGasDatas[ID.GD_S2_C05] = new GasData(ID.GD_S2_C05, ID.LNG);
                            dicGasDatas[ID.GD_S2_C06] = new GasData(ID.GD_S2_C06, ID.LNG);
                            dicGasDatas[ID.GD_S2_C07] = new GasData(ID.GD_S2_C07, ID.LNG);
                            dicGasDatas[ID.GD_S2_C11] = new GasData(ID.GD_S2_C11, ID.LNG);
                        }
                    }
                }
                else if (this.Type == Types.Device4)
                {
                    dicGasDatas[ID.GD_S2_F01] = new GasData(ID.GD_S2_F01, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F02] = new GasData(ID.GD_S2_F02, ID.O2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F03] = new GasData(ID.GD_S2_F03, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F04] = new GasData(ID.GD_S2_F04, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F05] = new GasData(ID.GD_S2_F05, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F06] = new GasData(ID.GD_S2_F06, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F07] = new GasData(ID.GD_S2_F07, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F08] = new GasData(ID.GD_S2_F08, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F09] = new GasData(ID.GD_S2_F09, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F10] = new GasData(ID.GD_S2_F10, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F11] = new GasData(ID.GD_S2_F11, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F12] = new GasData(ID.GD_S2_F12, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F13] = new GasData(ID.GD_S2_F13, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F14] = new GasData(ID.GD_S2_F14, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F15] = new GasData(ID.GD_S2_F15, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F16] = new GasData(ID.GD_S2_F16, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F17] = new GasData(ID.GD_S2_F17, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F18] = new GasData(ID.GD_S2_F18, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F19] = new GasData(ID.GD_S2_F19, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_F25] = new GasData(ID.GD_S2_F25, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F26] = new GasData(ID.GD_S2_F26, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F27] = new GasData(ID.GD_S2_F27, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_F33] = new GasData(ID.GD_S2_F33, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F48] = new GasData(ID.GD_S2_F48, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F49] = new GasData(ID.GD_S2_F49, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F50] = new GasData(ID.GD_S2_F50, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F51] = new GasData(ID.GD_S2_F51, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F53] = new GasData(ID.GD_S2_F53, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F54] = new GasData(ID.GD_S2_F54, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_I01] = new GasData(ID.GD_S2_I01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_I02] = new GasData(ID.GD_S2_I02, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S2_L01] = new GasData(ID.GD_S2_L01, ID.CO2, GasData.VauleTypes.Divide100_2);
                    dicGasDatas[ID.GD_S2_L02] = new GasData(ID.GD_S2_L02, ID.CO2, GasData.VauleTypes.Divide100_2);
                    dicGasDatas[ID.GD_S2_L03] = new GasData(ID.GD_S2_L03, ID.O2, GasData.VauleTypes.Divide10);


                    dicGasDatas[ID.GAS_EF_3F_1] = new GasData(ID.GAS_EF_3F_1, ID.Fault);
                    dicGasDatas[ID.GAS_EF_3F_2] = new GasData(ID.GAS_EF_3F_2, ID.Fault);
                    dicGasDatas[ID.GAS_EF_3F_3] = new GasData(ID.GAS_EF_3F_3, ID.Fault);
                    dicGasDatas[ID.GAS_EF_3F_4] = new GasData(ID.GAS_EF_3F_4, ID.Fault);
                }
                else if (this.Type == Types.Device5)
                {
                    dicGasDatas[ID.GD_S2_F20] = new GasData(ID.GD_S2_F20, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F21] = new GasData(ID.GD_S2_F21, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F22] = new GasData(ID.GD_S2_F22, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F23] = new GasData(ID.GD_S2_F23, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F24] = new GasData(ID.GD_S2_F24, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_F28] = new GasData(ID.GD_S2_F28, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F29] = new GasData(ID.GD_S2_F29, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F30] = new GasData(ID.GD_S2_F30, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_F31] = new GasData(ID.GD_S2_F31, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F32] = new GasData(ID.GD_S2_F32, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F34] = new GasData(ID.GD_S2_F34, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F35] = new GasData(ID.GD_S2_F35, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F36] = new GasData(ID.GD_S2_F36, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F37] = new GasData(ID.GD_S2_F37, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F38] = new GasData(ID.GD_S2_F38, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F39] = new GasData(ID.GD_S2_F39, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F40] = new GasData(ID.GD_S2_F40, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_F41] = new GasData(ID.GD_S2_F41, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F42] = new GasData(ID.GD_S2_F42, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F43] = new GasData(ID.GD_S2_F43, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F44] = new GasData(ID.GD_S2_F44, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F45] = new GasData(ID.GD_S2_F45, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F46] = new GasData(ID.GD_S2_F46, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F47] = new GasData(ID.GD_S2_F47, ID.H2, GasData.VauleTypes.ConverS1);
                    dicGasDatas[ID.GD_S2_F52] = new GasData(ID.GD_S2_F52, ID.H2, GasData.VauleTypes.ConverS1);

                    dicGasDatas[ID.GD_S2_G01] = new GasData(ID.GD_S2_G01, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G02] = new GasData(ID.GD_S2_G02, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G03] = new GasData(ID.GD_S2_G03, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G04] = new GasData(ID.GD_S2_G04, ID.HNO3, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G05] = new GasData(ID.GD_S2_G05, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G06] = new GasData(ID.GD_S2_G06, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G07] = new GasData(ID.GD_S2_G07, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G08] = new GasData(ID.GD_S2_G08, ID.HNO3, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G09] = new GasData(ID.GD_S2_G09, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G10] = new GasData(ID.GD_S2_G10, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G11] = new GasData(ID.GD_S2_G11, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G12] = new GasData(ID.GD_S2_G12, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G13] = new GasData(ID.GD_S2_G13, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G14] = new GasData(ID.GD_S2_G14, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G15] = new GasData(ID.GD_S2_G15, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_G16] = new GasData(ID.GD_S2_G16, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S2_H01] = new GasData(ID.GD_S2_H01, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_H02] = new GasData(ID.GD_S2_H02, ID.HF, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_H03] = new GasData(ID.GD_S2_H03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_S2_H04] = new GasData(ID.GD_S2_H04, ID.O2, GasData.VauleTypes.Divide10);


                }
                else if (this.Type == Types.Device6)
                {
                    dicGasDatas[ID.GD_S_A01] = new GasData(ID.GD_S_A01, ID.LNG);
                    dicGasDatas[ID.GD_S_A02] = new GasData(ID.GD_S_A02, ID.LNG);
                    dicGasDatas[ID.GD_S_A03] = new GasData(ID.GD_S_A03, ID.LNG);
                    dicGasDatas[ID.GD_S_A06] = new GasData(ID.GD_S_A06, ID.LNG);

                    dicGasDatas[ID.GD_S_K01] = new GasData(ID.GD_S_K01, ID.LNG);
                    dicGasDatas[ID.GD_S_K02] = new GasData(ID.GD_S_K02, ID.LNG);

                    dicGasDatas[ID.GD_S_A04] = new GasData(ID.GD_S_A04, ID.CO);
                    dicGasDatas[ID.GD_S_A05] = new GasData(ID.GD_S_A05, ID.CO);
                }
                else if (this.Type == Types.Device7)
                {
                    dicGasDatas[ID.GD_S_J01] = new GasData(ID.GD_S_J01, ID.LNG);
                    dicGasDatas[ID.GD_S_J02] = new GasData(ID.GD_S_J02, ID.LNG);
                    dicGasDatas[ID.GD_S_J03] = new GasData(ID.GD_S_J03, ID.LNG);
                    dicGasDatas[ID.GD_S_J04] = new GasData(ID.GD_S_J04, ID.LNG);

                    dicGasDatas[ID.GD_S_J05] = new GasData(ID.GD_S_J05, ID.Flame);
                    dicGasDatas[ID.GD_S_J06] = new GasData(ID.GD_S_J06, ID.Flame);
                    dicGasDatas[ID.GD_S_J07] = new GasData(ID.GD_S_J07, ID.Flame);
                    dicGasDatas[ID.GD_S_J08] = new GasData(ID.GD_S_J08, ID.Flame);

                    dicGasDatas[ID.FT_001] = new GasData(ID.FT_001, ID.Flow);
                    dicGasDatas[ID.PIA_001] = new GasData(ID.PIA_001, ID.Press);
                    dicGasDatas[ID.PIA_002] = new GasData(ID.PIA_002, ID.Press);
                    dicGasDatas[ID.PT_WIQ11] = new GasData(ID.PT_WIQ11, ID.Press);
                    dicGasDatas[ID.FT_WIQ11] = new GasData(ID.FT_WIQ11, ID.Flow);
                    dicGasDatas[ID.PT_WIQ01] = new GasData(ID.PT_WIQ01, ID.Press);
                    dicGasDatas[ID.FT_WIQ01] = new GasData(ID.FT_WIQ01, ID.Flow);
                }
                else if (this.Type == Types.Device8)
                {
                    dicGasDatas[ID.GD_S_M01] = new GasData(ID.GD_S_M01, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_S2_N01] = new GasData(ID.GD_S2_N01, ID.O2, GasData.VauleTypes.Divide10);          // 신규 센서 - 20251106
                }
                else if (this.Type == Types.Device9)
                {
                    dicGasDatas[ID.GD_S1_O01] = new GasData(ID.GD_S1_O01, ID.HF, GasData.VauleTypes.Divide10);          // 신규 센서 - 20251106
                }
                else
                    return;

                if (FC == ID.FC_ReadInputRegister)
                {
                    if (this.Type == Types.Device1)
                    {
                        if (arrData.Length != ID.S_Dev1_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S1_A23].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_S1_A24].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_S1_A25].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_S1_A29].SetVale(arrData, 3);

                        dicGasDatas[ID.GD_S1_A01].SetVale(arrData, 20);
                        dicGasDatas[ID.GD_S1_A02].SetVale(arrData, 21);
                        dicGasDatas[ID.GD_S1_A03].SetVale(arrData, 22);
                        dicGasDatas[ID.GD_S1_A04].SetVale(arrData, 23);
                        dicGasDatas[ID.GD_S1_A05].SetVale(arrData, 24);
                        dicGasDatas[ID.GD_S1_A06].SetVale(arrData, 25);
                        dicGasDatas[ID.GD_S1_A07].SetVale(arrData, 26);
                        dicGasDatas[ID.GD_S1_A08].SetVale(arrData, 27);
                        dicGasDatas[ID.GD_S1_A09].SetVale(arrData, 28);
                        dicGasDatas[ID.GD_S1_A10].SetVale(arrData, 29);
                        dicGasDatas[ID.GD_S1_A11].SetVale(arrData, 30);
                        dicGasDatas[ID.GD_S1_A16].SetVale(arrData, 31);
                        dicGasDatas[ID.GD_S1_A17].SetVale(arrData, 32);
                        dicGasDatas[ID.GD_S1_A18].SetVale(arrData, 33);
                        dicGasDatas[ID.GD_S1_A19].SetVale(arrData, 34);
                        dicGasDatas[ID.GD_S1_A20].SetVale(arrData, 35);
                        dicGasDatas[ID.GD_S1_A21].SetVale(arrData, 36);
                        dicGasDatas[ID.GD_S1_A22].SetVale(arrData, 37);
                        dicGasDatas[ID.GD_S1_A26].SetVale(arrData, 38);

                        dicGasDatas[ID.GD_S1_A12].SetVale(arrData, 40);
                        dicGasDatas[ID.GD_S1_A13].SetVale(arrData, 41);
                        dicGasDatas[ID.GD_S1_A14].SetVale(arrData, 42);
                        dicGasDatas[ID.GD_S1_A15].SetVale(arrData, 43);

                        dicGasDatas[ID.GD_S1_A27].SetVale(arrData, 44);
                        dicGasDatas[ID.GD_S1_A28].SetVale(arrData, 45);
                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (arrData.Length != ID.S_Dev2_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S2_B01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_S2_B02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_S2_B03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_S2_B04].SetVale(arrData, 3);
                        dicGasDatas[ID.GD_S2_B05].SetVale(arrData, 4);
                        dicGasDatas[ID.GD_S2_B06].SetVale(arrData, 5);
                        dicGasDatas[ID.GD_S2_B07].SetVale(arrData, 6);
                        dicGasDatas[ID.GD_S2_B08].SetVale(arrData, 7);
                        dicGasDatas[ID.GD_S2_B09].SetVale(arrData, 8);
                        dicGasDatas[ID.GD_S2_B10].SetVale(arrData, 9);
                        dicGasDatas[ID.GD_S2_B11].SetVale(arrData, 10);
                        dicGasDatas[ID.GD_S2_B12].SetVale(arrData, 11);
                        dicGasDatas[ID.GD_S2_B13].SetVale(arrData, 12);
                        dicGasDatas[ID.GD_S2_B14].SetVale(arrData, 13);
                        dicGasDatas[ID.GD_S2_B15].SetVale(arrData, 14);
                        dicGasDatas[ID.GD_S2_B16].SetVale(arrData, 15);
                        dicGasDatas[ID.GD_S2_B17].SetVale(arrData, 16);
                        dicGasDatas[ID.GD_S2_B18].SetVale(arrData, 17);
                        dicGasDatas[ID.GD_S2_B19].SetVale(arrData, 18);
                        dicGasDatas[ID.GD_S2_B20].SetVale(arrData, 19);
                        dicGasDatas[ID.GD_S2_B21].SetVale(arrData, 20);
                        dicGasDatas[ID.GD_S2_B22].SetVale(arrData, 21);
                        dicGasDatas[ID.GD_S2_B23].SetVale(arrData, 22);

                        dicGasDatas[ID.GD_S2_E01].SetVale(arrData, 100);
                        dicGasDatas[ID.GD_S2_E02].SetVale(arrData, 101);
                        dicGasDatas[ID.GD_S2_E03].SetVale(arrData, 102);
                        dicGasDatas[ID.GD_S2_E04].SetVale(arrData, 103);
                        dicGasDatas[ID.GD_S2_E05].SetVale(arrData, 104);
                        dicGasDatas[ID.GD_S2_E06].SetVale(arrData, 105);
                        dicGasDatas[ID.GD_S2_E07].SetVale(arrData, 106);
                        dicGasDatas[ID.GD_S2_E08].SetVale(arrData, 107);
                        dicGasDatas[ID.GD_S2_E09].SetVale(arrData, 108);
                        dicGasDatas[ID.GD_S2_E10].SetVale(arrData, 109);
                        dicGasDatas[ID.GD_S2_E11].SetVale(arrData, 110);

                    }
                    else if (this.Type == Types.Device3)
                    {
                        if (arrData.Length != ID.S_Dev3_Register_Length1 * nRegisterLeng &&
                            arrData.Length != ID.S_Dev3_Register_Length2 * nRegisterLeng)
                            return;

                        if (arrData.Length == ID.S_Dev3_Register_Length1 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_S2_C02].SetVale(arrData, 0);
                            dicGasDatas[ID.GD_S2_C08].SetVale(arrData, 1);
                            dicGasDatas[ID.GD_S2_C09].SetVale(arrData, 2);
                            dicGasDatas[ID.GD_S2_C10].SetVale(arrData, 3);
                        }
                        else if (arrData.Length == ID.S_Dev3_Register_Length2 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_S2_D01].SetVale(arrData, 0);
                            dicGasDatas[ID.GD_S2_D02].SetVale(arrData, 1);
                            dicGasDatas[ID.GD_S2_D03].SetVale(arrData, 2);
                            dicGasDatas[ID.GD_S2_D04].SetVale(arrData, 3);
                            dicGasDatas[ID.GD_S2_D05].SetVale(arrData, 4);
                            dicGasDatas[ID.GD_S2_D06].SetVale(arrData, 5);
                            dicGasDatas[ID.GD_S2_D07].SetVale(arrData, 6);
                            dicGasDatas[ID.GD_S2_D08].SetVale(arrData, 7);
                            dicGasDatas[ID.GD_S2_D09].SetVale(arrData, 8);
                            dicGasDatas[ID.GD_S2_D10].SetVale(arrData, 9);

                            dicGasDatas[ID.GD_S2_C01].SetVale(arrData, 80);
                            dicGasDatas[ID.GD_S2_C03].SetVale(arrData, 81);
                            dicGasDatas[ID.GD_S2_C04].SetVale(arrData, 82);
                            dicGasDatas[ID.GD_S2_C05].SetVale(arrData, 83);
                            dicGasDatas[ID.GD_S2_C06].SetVale(arrData, 84);
                            dicGasDatas[ID.GD_S2_C07].SetVale(arrData, 85);
                            dicGasDatas[ID.GD_S2_C11].SetVale(arrData, 86);
                        }

                    }
                    else if (this.Type == Types.Device4)
                    {
                        if (arrData.Length != ID.S_Dev4_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S2_F01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_S2_F02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_S2_F03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_S2_F04].SetVale(arrData, 3);
                        dicGasDatas[ID.GD_S2_F05].SetVale(arrData, 4);
                        dicGasDatas[ID.GD_S2_F06].SetVale(arrData, 5);
                        dicGasDatas[ID.GD_S2_F07].SetVale(arrData, 6);
                        dicGasDatas[ID.GD_S2_F08].SetVale(arrData, 7);
                        dicGasDatas[ID.GD_S2_F09].SetVale(arrData, 8);
                        dicGasDatas[ID.GD_S2_F10].SetVale(arrData, 9);
                        dicGasDatas[ID.GD_S2_F11].SetVale(arrData, 10);
                        dicGasDatas[ID.GD_S2_F12].SetVale(arrData, 11);
                        dicGasDatas[ID.GD_S2_F13].SetVale(arrData, 12);
                        dicGasDatas[ID.GD_S2_F14].SetVale(arrData, 13);
                        dicGasDatas[ID.GD_S2_F15].SetVale(arrData, 14);
                        dicGasDatas[ID.GD_S2_F16].SetVale(arrData, 15);
                        dicGasDatas[ID.GD_S2_F17].SetVale(arrData, 16);
                        dicGasDatas[ID.GD_S2_F18].SetVale(arrData, 17);
                        dicGasDatas[ID.GD_S2_F19].SetVale(arrData, 18);

                        dicGasDatas[ID.GD_S2_F25].SetVale(arrData, 19);
                        dicGasDatas[ID.GD_S2_F26].SetVale(arrData, 20);
                        dicGasDatas[ID.GD_S2_F27].SetVale(arrData, 21);

                        dicGasDatas[ID.GD_S2_F33].SetVale(arrData, 22);

                        dicGasDatas[ID.GD_S2_F48].SetVale(arrData, 23);
                        dicGasDatas[ID.GD_S2_F49].SetVale(arrData, 24);
                        dicGasDatas[ID.GD_S2_F50].SetVale(arrData, 25);
                        dicGasDatas[ID.GD_S2_F51].SetVale(arrData, 26);
                        dicGasDatas[ID.GD_S2_F53].SetVale(arrData, 27);
                        dicGasDatas[ID.GD_S2_F54].SetVale(arrData, 28);

                        dicGasDatas[ID.GD_S2_I01].SetVale(arrData, 100);
                        dicGasDatas[ID.GD_S2_I02].SetVale(arrData, 101);

                        dicGasDatas[ID.GD_S2_L01].SetVale(arrData, 102);
                        dicGasDatas[ID.GD_S2_L02].SetVale(arrData, 103);
                        dicGasDatas[ID.GD_S2_L03].SetVale(arrData, 104);
                    }
                    else if (this.Type == Types.Device5)
                    {
                        if (arrData.Length != ID.S_Dev5_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S2_F20].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_S2_F21].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_S2_F22].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_S2_F23].SetVale(arrData, 3);
                        dicGasDatas[ID.GD_S2_F24].SetVale(arrData, 4);

                        dicGasDatas[ID.GD_S2_F28].SetVale(arrData, 5);
                        dicGasDatas[ID.GD_S2_F29].SetVale(arrData, 6);
                        dicGasDatas[ID.GD_S2_F30].SetVale(arrData, 7);
                        dicGasDatas[ID.GD_S2_F31].SetVale(arrData, 8);
                        dicGasDatas[ID.GD_S2_F32].SetVale(arrData, 9);
                        dicGasDatas[ID.GD_S2_F34].SetVale(arrData, 10);
                        dicGasDatas[ID.GD_S2_F35].SetVale(arrData, 11);
                        dicGasDatas[ID.GD_S2_F36].SetVale(arrData, 12);
                        dicGasDatas[ID.GD_S2_F37].SetVale(arrData, 13);
                        dicGasDatas[ID.GD_S2_F38].SetVale(arrData, 14);
                        dicGasDatas[ID.GD_S2_F39].SetVale(arrData, 15);
                        dicGasDatas[ID.GD_S2_F40].SetVale(arrData, 16);
                        dicGasDatas[ID.GD_S2_F41].SetVale(arrData, 17);
                        dicGasDatas[ID.GD_S2_F42].SetVale(arrData, 18);
                        dicGasDatas[ID.GD_S2_F43].SetVale(arrData, 19);
                        dicGasDatas[ID.GD_S2_F44].SetVale(arrData, 20);
                        dicGasDatas[ID.GD_S2_F45].SetVale(arrData, 21);
                        dicGasDatas[ID.GD_S2_F46].SetVale(arrData, 22);
                        dicGasDatas[ID.GD_S2_F47].SetVale(arrData, 23);
                        dicGasDatas[ID.GD_S2_F52].SetVale(arrData, 24);

                        dicGasDatas[ID.GD_S2_G01].SetVale(arrData, 100);
                        dicGasDatas[ID.GD_S2_G02].SetVale(arrData, 101);
                        dicGasDatas[ID.GD_S2_G03].SetVale(arrData, 102);
                        dicGasDatas[ID.GD_S2_G04].SetVale(arrData, 103);
                        dicGasDatas[ID.GD_S2_G05].SetVale(arrData, 104);
                        dicGasDatas[ID.GD_S2_G06].SetVale(arrData, 105);
                        dicGasDatas[ID.GD_S2_G07].SetVale(arrData, 106);
                        dicGasDatas[ID.GD_S2_G08].SetVale(arrData, 107);
                        dicGasDatas[ID.GD_S2_G09].SetVale(arrData, 108);
                        dicGasDatas[ID.GD_S2_G10].SetVale(arrData, 109);
                        dicGasDatas[ID.GD_S2_G11].SetVale(arrData, 110);
                        dicGasDatas[ID.GD_S2_G12].SetVale(arrData, 111);
                        dicGasDatas[ID.GD_S2_G13].SetVale(arrData, 112);
                        dicGasDatas[ID.GD_S2_G14].SetVale(arrData, 113);
                        dicGasDatas[ID.GD_S2_G15].SetVale(arrData, 114);
                        dicGasDatas[ID.GD_S2_G16].SetVale(arrData, 115);

                        dicGasDatas[ID.GD_S2_H01].SetVale(arrData, 116);
                        dicGasDatas[ID.GD_S2_H02].SetVale(arrData, 117);
                        dicGasDatas[ID.GD_S2_H03].SetVale(arrData, 118);
                        dicGasDatas[ID.GD_S2_H04].SetVale(arrData, 119);
                    }
                    else if (this.Type == Types.Device6)
                    {
                        if (arrData.Length != ID.S_Dev6_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S_A01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_S_A02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_S_A03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_S_A06].SetVale(arrData, 3);

                        dicGasDatas[ID.GD_S_K01].SetVale(arrData, 4);
                        dicGasDatas[ID.GD_S_K02].SetVale(arrData, 5);

                        dicGasDatas[ID.GD_S_A04].SetVale(arrData, 11);
                        dicGasDatas[ID.GD_S_A05].SetVale(arrData, 12);
                    }
                    else if (this.Type == Types.Device7)
                    {
                        if (arrData.Length != ID.S_Dev7_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S_J01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_S_J02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_S_J03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_S_J04].SetVale(arrData, 3);

                        dicGasDatas[ID.FT_001].SetVale(arrData, 10);
                        dicGasDatas[ID.PIA_001].SetVale(arrData, 11);
                        dicGasDatas[ID.PIA_002].SetVale(arrData, 12);
                        dicGasDatas[ID.PT_WIQ11].SetVale(arrData, 13);
                        dicGasDatas[ID.FT_WIQ11].SetVale(arrData, 14);
                        dicGasDatas[ID.PT_WIQ01].SetVale(arrData, 15);
                        dicGasDatas[ID.FT_WIQ01].SetVale(arrData, 16);
                    }
                    else if (this.Type == Types.Device8)
                    {
                        if (arrData.Length != ID.S_Dev8_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S_M01].SetVale(arrData, 0);

                        dicGasDatas[ID.GD_S2_N01].SetVale(arrData, 3);          // 신규 센서 - 20251106
                    }
                    else if (this.Type == Types.Device9)
                    {
                        if (arrData.Length != ID.S_Dev8_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_S1_O01].SetVale(arrData, 0);          // 신규 센서 - 20251106
                    }

                    // DB 업데이트
                    if (UpdateSensorData2(dicGasDatas, out strErrorMessage) == false)
                    {
                        m_parentManager.Logger.Write("[" + this.DeviceName + "] OnReceiveData() : " + strErrorMessage);
                    }

                }
                else if (FC == ID.FC_ReadDiscrete)
                {
                    BitArray bitArray = new BitArray(arrData);

                    if (this.Type == Types.Device1)
                    {
                        if (bitArray.Length < ID.S_Dev1_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S1_A23].SetHiData_S(bitArray, 8);
                        dicGasDatas[ID.GD_S1_A24].SetHiData_S(bitArray, 16);
                        dicGasDatas[ID.GD_S1_A25].SetHiData_S(bitArray, 24);
                        dicGasDatas[ID.GD_S1_A29].SetHiData_S(bitArray, 32);

                        dicGasDatas[ID.GD_S1_A01].SetHiData_S(bitArray, 168);
                        dicGasDatas[ID.GD_S1_A02].SetHiData_S(bitArray, 176);
                        dicGasDatas[ID.GD_S1_A03].SetHiData_S(bitArray, 184);
                        dicGasDatas[ID.GD_S1_A04].SetHiData_S(bitArray, 192);
                        dicGasDatas[ID.GD_S1_A05].SetHiData_S(bitArray, 200);
                        dicGasDatas[ID.GD_S1_A06].SetHiData_S(bitArray, 208);
                        dicGasDatas[ID.GD_S1_A07].SetHiData_S(bitArray, 216);
                        dicGasDatas[ID.GD_S1_A08].SetHiData_S(bitArray, 224);
                        dicGasDatas[ID.GD_S1_A09].SetHiData_S(bitArray, 232);
                        dicGasDatas[ID.GD_S1_A10].SetHiData_S(bitArray, 240);

                        dicGasDatas[ID.GD_S1_A11].SetHiData_S(bitArray, 248);
                        dicGasDatas[ID.GD_S1_A16].SetHiData_S(bitArray, 256);
                        dicGasDatas[ID.GD_S1_A17].SetHiData_S(bitArray, 264);
                        dicGasDatas[ID.GD_S1_A18].SetHiData_S(bitArray, 272);
                        dicGasDatas[ID.GD_S1_A19].SetHiData_S(bitArray, 280);
                        dicGasDatas[ID.GD_S1_A20].SetHiData_S(bitArray, 288);

                        dicGasDatas[ID.GD_S1_A21].SetHiData_S(bitArray, 296);
                        dicGasDatas[ID.GD_S1_A22].SetHiData_S(bitArray, 304);
                        dicGasDatas[ID.GD_S1_A26].SetHiData_S(bitArray, 312);

                        dicGasDatas[ID.GD_S1_A12].SetHiData_S(bitArray, 328);
                        dicGasDatas[ID.GD_S1_A13].SetHiData_S(bitArray, 336);
                        dicGasDatas[ID.GD_S1_A14].SetHiData_S(bitArray, 344);
                        dicGasDatas[ID.GD_S1_A15].SetHiData_S(bitArray, 352);

                        dicGasDatas[ID.GD_S1_A27].SetHiData_S(bitArray, 360);
                        dicGasDatas[ID.GD_S1_A28].SetHiData_S(bitArray, 368);
                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (bitArray.Length < ID.S_Dev2_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S2_B01].HiAlarm = bitArray[0];
                        dicGasDatas[ID.GD_S2_B02].LoAlarm = bitArray[1];
                        dicGasDatas[ID.GD_S2_B03].HiAlarm = bitArray[2];
                        dicGasDatas[ID.GD_S2_B04].HiAlarm = bitArray[3];
                        dicGasDatas[ID.GD_S2_B05].HiAlarm = bitArray[4];
                        dicGasDatas[ID.GD_S2_B06].HiAlarm = bitArray[5];
                        dicGasDatas[ID.GD_S2_B07].HiAlarm = bitArray[6];
                        dicGasDatas[ID.GD_S2_B08].HiAlarm = bitArray[7];
                        dicGasDatas[ID.GD_S2_B09].HiAlarm = bitArray[8];
                        dicGasDatas[ID.GD_S2_B10].HiAlarm = bitArray[9];

                        dicGasDatas[ID.GD_S2_B11].HiAlarm = bitArray[10];
                        dicGasDatas[ID.GD_S2_B12].HiAlarm = bitArray[11];
                        dicGasDatas[ID.GD_S2_B13].HiAlarm = bitArray[12];
                        dicGasDatas[ID.GD_S2_B14].HiAlarm = bitArray[13];
                        dicGasDatas[ID.GD_S2_B15].HiAlarm = bitArray[14];
                        dicGasDatas[ID.GD_S2_B16].HiAlarm = bitArray[15];
                        dicGasDatas[ID.GD_S2_B17].HiAlarm = bitArray[16];
                        dicGasDatas[ID.GD_S2_B18].HiAlarm = bitArray[17];
                        dicGasDatas[ID.GD_S2_B19].HiAlarm = bitArray[18];
                        dicGasDatas[ID.GD_S2_B20].HiAlarm = bitArray[19];

                        dicGasDatas[ID.GD_S2_B21].HiAlarm = bitArray[20];
                        dicGasDatas[ID.GD_S2_B22].HiAlarm = bitArray[21];
                        dicGasDatas[ID.GD_S2_B23].HiAlarm = bitArray[22];

                        dicGasDatas[ID.GD_S2_B01].HiHighAlarm = bitArray[160];
                        dicGasDatas[ID.GD_S2_B02].LoLowAlarm = bitArray[161];
                        dicGasDatas[ID.GD_S2_B03].HiHighAlarm = bitArray[162];
                        dicGasDatas[ID.GD_S2_B04].HiHighAlarm = bitArray[163];
                        dicGasDatas[ID.GD_S2_B05].HiHighAlarm = bitArray[164];
                        dicGasDatas[ID.GD_S2_B06].HiHighAlarm = bitArray[165];
                        dicGasDatas[ID.GD_S2_B07].HiHighAlarm = bitArray[166];
                        dicGasDatas[ID.GD_S2_B08].HiHighAlarm = bitArray[167];
                        dicGasDatas[ID.GD_S2_B09].HiHighAlarm = bitArray[168];
                        dicGasDatas[ID.GD_S2_B10].HiHighAlarm = bitArray[169];

                        dicGasDatas[ID.GD_S2_B11].HiHighAlarm = bitArray[170];
                        dicGasDatas[ID.GD_S2_B12].HiHighAlarm = bitArray[171];
                        dicGasDatas[ID.GD_S2_B13].HiHighAlarm = bitArray[172];
                        dicGasDatas[ID.GD_S2_B14].HiHighAlarm = bitArray[173];
                        dicGasDatas[ID.GD_S2_B15].HiHighAlarm = bitArray[174];
                        dicGasDatas[ID.GD_S2_B16].HiHighAlarm = bitArray[175];
                        dicGasDatas[ID.GD_S2_B17].HiHighAlarm = bitArray[176];
                        dicGasDatas[ID.GD_S2_B18].HiHighAlarm = bitArray[177];
                        dicGasDatas[ID.GD_S2_B19].HiHighAlarm = bitArray[178];
                        dicGasDatas[ID.GD_S2_B20].HiHighAlarm = bitArray[179];

                        dicGasDatas[ID.GD_S2_B21].HiHighAlarm = bitArray[180];
                        dicGasDatas[ID.GD_S2_B22].HiHighAlarm = bitArray[181];
                        dicGasDatas[ID.GD_S2_B23].HiHighAlarm = bitArray[182];

                        dicGasDatas[ID.GD_S2_B02].HiAlarm = bitArray[321];
                        /*
                        dicGasDatas[ID.GD_S2_B01].FaultAlarm = bitArray[480];
                        dicGasDatas[ID.GD_S2_B02].FaultAlarm = bitArray[481];
                        dicGasDatas[ID.GD_S2_B03].FaultAlarm = bitArray[482];
                        dicGasDatas[ID.GD_S2_B04].FaultAlarm = bitArray[483];
                        dicGasDatas[ID.GD_S2_B05].FaultAlarm = bitArray[484];
                        dicGasDatas[ID.GD_S2_B06].FaultAlarm = bitArray[485];
                        dicGasDatas[ID.GD_S2_B07].FaultAlarm = bitArray[486];
                        dicGasDatas[ID.GD_S2_B08].FaultAlarm = bitArray[487];
                        dicGasDatas[ID.GD_S2_B09].FaultAlarm = bitArray[488];
                        dicGasDatas[ID.GD_S2_B10].FaultAlarm = bitArray[489];

                        dicGasDatas[ID.GD_S2_B11].FaultAlarm = bitArray[490];
                        dicGasDatas[ID.GD_S2_B12].FaultAlarm = bitArray[491];
                        dicGasDatas[ID.GD_S2_B13].FaultAlarm = bitArray[492];
                        dicGasDatas[ID.GD_S2_B14].FaultAlarm = bitArray[493];
                        dicGasDatas[ID.GD_S2_B15].FaultAlarm = bitArray[494];
                        dicGasDatas[ID.GD_S2_B16].FaultAlarm = bitArray[495];
                        dicGasDatas[ID.GD_S2_B17].FaultAlarm = bitArray[496];
                        dicGasDatas[ID.GD_S2_B18].FaultAlarm = bitArray[497];
                        dicGasDatas[ID.GD_S2_B19].FaultAlarm = bitArray[498];
                        dicGasDatas[ID.GD_S2_B20].FaultAlarm = bitArray[499];

                        dicGasDatas[ID.GD_S2_B21].FaultAlarm = bitArray[500];
                        dicGasDatas[ID.GD_S2_B22].FaultAlarm = bitArray[501];
                        dicGasDatas[ID.GD_S2_B23].FaultAlarm = bitArray[502];
                        */
                        dicGasDatas[ID.GAS_EF_2F_1].Status = bitArray[640];
                        dicGasDatas[ID.GAS_EF_2F_1].FaultAlarm = bitArray[641];
                        dicGasDatas[ID.GAS_EF_2F_2].Status = bitArray[642];
                        dicGasDatas[ID.GAS_EF_2F_2].FaultAlarm = bitArray[643];
                        dicGasDatas[ID.GAS_EF_2F_3].Status = bitArray[644];
                        dicGasDatas[ID.GAS_EF_2F_3].FaultAlarm = bitArray[645];
                        dicGasDatas[ID.GAS_EF_2F_4].Status = bitArray[646];
                        dicGasDatas[ID.GAS_EF_2F_4].FaultAlarm = bitArray[647];

                        dicGasDatas[ID.GD_S2_E01].SetHiData_S(bitArray, 1008);
                        dicGasDatas[ID.GD_S2_E02].SetHiData_S(bitArray, 1016);
                        dicGasDatas[ID.GD_S2_E03].SetHiData_S(bitArray, 1024);
                        dicGasDatas[ID.GD_S2_E04].SetHiData_S(bitArray, 1032);
                        dicGasDatas[ID.GD_S2_E05].SetHiData_S(bitArray, 1040);
                        dicGasDatas[ID.GD_S2_E06].SetHiData_S(bitArray, 1048);
                        dicGasDatas[ID.GD_S2_E07].SetHiData_S(bitArray, 1056);
                        dicGasDatas[ID.GD_S2_E08].SetHiData_S(bitArray, 1064);
                        dicGasDatas[ID.GD_S2_E09].SetHiData_S(bitArray, 1072);
                        dicGasDatas[ID.GD_S2_E10].SetHiData_S(bitArray, 1080);
                        dicGasDatas[ID.GD_S2_E11].SetHiData_S(bitArray, 1088);


                    }
                    else if (this.Type == Types.Device3)
                    {
                        if (bitArray.Length < ID.S_Dev3_Discrete_Length1 &&
                            bitArray.Length < ID.S_Dev3_Discrete_Length2)
                            return;

                        if (bitArray.Length >= ID.S_Dev3_Discrete_Length1)
                        {
                            dicGasDatas[ID.GD_S2_C02].LoAlarm = bitArray[0];
                            dicGasDatas[ID.GD_S2_C08].LoAlarm = bitArray[1];
                            dicGasDatas[ID.GD_S2_C09].LoAlarm = bitArray[2];
                            dicGasDatas[ID.GD_S2_C10].LoAlarm = bitArray[3];

                            dicGasDatas[ID.GD_S2_C02].LoLowAlarm = bitArray[160];
                            dicGasDatas[ID.GD_S2_C08].LoLowAlarm = bitArray[161];
                            dicGasDatas[ID.GD_S2_C09].LoLowAlarm = bitArray[162];
                            dicGasDatas[ID.GD_S2_C10].LoLowAlarm = bitArray[163];

                            dicGasDatas[ID.GD_S2_C02].HiAlarm = bitArray[320];
                            dicGasDatas[ID.GD_S2_C08].HiAlarm = bitArray[321];
                            dicGasDatas[ID.GD_S2_C09].HiAlarm = bitArray[322];
                            dicGasDatas[ID.GD_S2_C10].HiAlarm = bitArray[323];
                            /*
                            dicGasDatas[ID.GD_S2_C02].FaultAlarm = bitArray[480];
                            dicGasDatas[ID.GD_S2_C08].FaultAlarm = bitArray[481];
                            dicGasDatas[ID.GD_S2_C09].FaultAlarm = bitArray[482];
                            dicGasDatas[ID.GD_S2_C10].FaultAlarm = bitArray[483];
                            */
                        }
                        else if (bitArray.Length >= ID.S_Dev3_Discrete_Length2)
                        {
                            dicGasDatas[ID.GD_S2_D01].SetHiData_S(bitArray, 8);
                            dicGasDatas[ID.GD_S2_D02].SetHiData_S(bitArray, 16);
                            dicGasDatas[ID.GD_S2_D03].SetHiData_S(bitArray, 24);
                            dicGasDatas[ID.GD_S2_D04].SetHiData_S(bitArray, 32);
                            dicGasDatas[ID.GD_S2_D05].SetHiData_S(bitArray, 40);
                            dicGasDatas[ID.GD_S2_D06].SetHiData_S(bitArray, 48);
                            dicGasDatas[ID.GD_S2_D07].SetHiData_S(bitArray, 56);
                            dicGasDatas[ID.GD_S2_D08].SetHiData_S(bitArray, 64);
                            dicGasDatas[ID.GD_S2_D09].SetHiData_S(bitArray, 72);
                            dicGasDatas[ID.GD_S2_D10].SetHiData_S(bitArray, 80);

                            dicGasDatas[ID.GD_S2_C01].SetHiData(bitArray, 648);
                            dicGasDatas[ID.GD_S2_C03].SetHiData(bitArray, 656);
                            dicGasDatas[ID.GD_S2_C04].SetHiData(bitArray, 664);
                            dicGasDatas[ID.GD_S2_C05].SetHiData(bitArray, 672);
                            dicGasDatas[ID.GD_S2_C06].SetHiData(bitArray, 680);
                            dicGasDatas[ID.GD_S2_C07].SetHiData(bitArray, 688);
                            dicGasDatas[ID.GD_S2_C11].SetHiData(bitArray, 696);
                        }



                    }
                    else if (this.Type == Types.Device4)
                    {
                        if (bitArray.Length < ID.S_Dev4_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S2_F01].HiAlarm = bitArray[0];
                        dicGasDatas[ID.GD_S2_F02].LoAlarm = bitArray[1];
                        dicGasDatas[ID.GD_S2_F03].HiAlarm = bitArray[2];
                        dicGasDatas[ID.GD_S2_F04].HiAlarm = bitArray[3];
                        dicGasDatas[ID.GD_S2_F05].HiAlarm = bitArray[4];
                        dicGasDatas[ID.GD_S2_F06].HiAlarm = bitArray[5];
                        dicGasDatas[ID.GD_S2_F07].HiAlarm = bitArray[6];
                        dicGasDatas[ID.GD_S2_F08].HiAlarm = bitArray[7];
                        dicGasDatas[ID.GD_S2_F09].HiAlarm = bitArray[8];
                        dicGasDatas[ID.GD_S2_F10].HiAlarm = bitArray[9];

                        dicGasDatas[ID.GD_S2_F11].HiAlarm = bitArray[10];
                        dicGasDatas[ID.GD_S2_F12].HiAlarm = bitArray[11];
                        dicGasDatas[ID.GD_S2_F13].HiAlarm = bitArray[12];
                        dicGasDatas[ID.GD_S2_F14].HiAlarm = bitArray[13];
                        dicGasDatas[ID.GD_S2_F15].HiAlarm = bitArray[14];
                        dicGasDatas[ID.GD_S2_F16].HiAlarm = bitArray[15];
                        dicGasDatas[ID.GD_S2_F17].HiAlarm = bitArray[16];
                        dicGasDatas[ID.GD_S2_F18].HiAlarm = bitArray[17];
                        dicGasDatas[ID.GD_S2_F19].HiAlarm = bitArray[18];

                        dicGasDatas[ID.GD_S2_F25].HiAlarm = bitArray[19];
                        dicGasDatas[ID.GD_S2_F26].HiAlarm = bitArray[20];
                        dicGasDatas[ID.GD_S2_F27].HiAlarm = bitArray[21];
                        dicGasDatas[ID.GD_S2_F33].HiAlarm = bitArray[22];
                        dicGasDatas[ID.GD_S2_F48].HiAlarm = bitArray[23];
                        dicGasDatas[ID.GD_S2_F49].HiAlarm = bitArray[24];
                        dicGasDatas[ID.GD_S2_F50].HiAlarm = bitArray[25];
                        dicGasDatas[ID.GD_S2_F51].HiAlarm = bitArray[26];
                        dicGasDatas[ID.GD_S2_F53].HiAlarm = bitArray[27];
                        dicGasDatas[ID.GD_S2_F54].HiAlarm = bitArray[28];

                        dicGasDatas[ID.GD_S2_F01].HiHighAlarm = bitArray[160];
                        dicGasDatas[ID.GD_S2_F02].LoLowAlarm = bitArray[161];
                        dicGasDatas[ID.GD_S2_F03].HiHighAlarm = bitArray[162];
                        dicGasDatas[ID.GD_S2_F04].HiHighAlarm = bitArray[163];
                        dicGasDatas[ID.GD_S2_F05].HiHighAlarm = bitArray[164];
                        dicGasDatas[ID.GD_S2_F06].HiHighAlarm = bitArray[165];
                        dicGasDatas[ID.GD_S2_F07].HiHighAlarm = bitArray[166];
                        dicGasDatas[ID.GD_S2_F08].HiHighAlarm = bitArray[167];
                        dicGasDatas[ID.GD_S2_F09].HiHighAlarm = bitArray[168];
                        dicGasDatas[ID.GD_S2_F10].HiHighAlarm = bitArray[169];

                        dicGasDatas[ID.GD_S2_F11].HiHighAlarm = bitArray[170];
                        dicGasDatas[ID.GD_S2_F12].HiHighAlarm = bitArray[171];
                        dicGasDatas[ID.GD_S2_F13].HiHighAlarm = bitArray[172];
                        dicGasDatas[ID.GD_S2_F14].HiHighAlarm = bitArray[173];
                        dicGasDatas[ID.GD_S2_F15].HiHighAlarm = bitArray[174];
                        dicGasDatas[ID.GD_S2_F16].HiHighAlarm = bitArray[175];
                        dicGasDatas[ID.GD_S2_F17].HiHighAlarm = bitArray[176];
                        dicGasDatas[ID.GD_S2_F18].HiHighAlarm = bitArray[177];
                        dicGasDatas[ID.GD_S2_F19].HiHighAlarm = bitArray[178];

                        dicGasDatas[ID.GD_S2_F25].HiHighAlarm = bitArray[179];
                        dicGasDatas[ID.GD_S2_F26].HiHighAlarm = bitArray[180];
                        dicGasDatas[ID.GD_S2_F27].HiHighAlarm = bitArray[181];
                        dicGasDatas[ID.GD_S2_F33].HiHighAlarm = bitArray[182];
                        dicGasDatas[ID.GD_S2_F48].HiHighAlarm = bitArray[183];
                        dicGasDatas[ID.GD_S2_F49].HiHighAlarm = bitArray[184];
                        dicGasDatas[ID.GD_S2_F50].HiHighAlarm = bitArray[185];
                        dicGasDatas[ID.GD_S2_F51].HiHighAlarm = bitArray[186];
                        dicGasDatas[ID.GD_S2_F53].HiHighAlarm = bitArray[187];
                        dicGasDatas[ID.GD_S2_F54].HiHighAlarm = bitArray[188];

                        dicGasDatas[ID.GD_S2_F02].HiAlarm = bitArray[321];
                        /*
                        dicGasDatas[ID.GD_S2_F01].FaultAlarm = bitArray[480];
                        dicGasDatas[ID.GD_S2_F02].FaultAlarm = bitArray[481];
                        dicGasDatas[ID.GD_S2_F03].FaultAlarm = bitArray[482];
                        dicGasDatas[ID.GD_S2_F04].FaultAlarm = bitArray[483];
                        dicGasDatas[ID.GD_S2_F05].FaultAlarm = bitArray[484];
                        dicGasDatas[ID.GD_S2_F06].FaultAlarm = bitArray[485];
                        dicGasDatas[ID.GD_S2_F07].FaultAlarm = bitArray[486];
                        dicGasDatas[ID.GD_S2_F08].FaultAlarm = bitArray[487];
                        dicGasDatas[ID.GD_S2_F09].FaultAlarm = bitArray[488];
                        dicGasDatas[ID.GD_S2_F10].FaultAlarm = bitArray[489];

                        dicGasDatas[ID.GD_S2_F11].FaultAlarm = bitArray[490];
                        dicGasDatas[ID.GD_S2_F12].FaultAlarm = bitArray[491];
                        dicGasDatas[ID.GD_S2_F13].FaultAlarm = bitArray[492];
                        dicGasDatas[ID.GD_S2_F14].FaultAlarm = bitArray[493];
                        dicGasDatas[ID.GD_S2_F15].FaultAlarm = bitArray[494];
                        dicGasDatas[ID.GD_S2_F16].FaultAlarm = bitArray[495];
                        dicGasDatas[ID.GD_S2_F17].FaultAlarm = bitArray[496];
                        dicGasDatas[ID.GD_S2_F18].FaultAlarm = bitArray[497];
                        dicGasDatas[ID.GD_S2_F19].FaultAlarm = bitArray[498];

                        dicGasDatas[ID.GD_S2_F25].FaultAlarm = bitArray[499];
                        dicGasDatas[ID.GD_S2_F26].FaultAlarm = bitArray[500];
                        dicGasDatas[ID.GD_S2_F27].FaultAlarm = bitArray[501];
                        dicGasDatas[ID.GD_S2_F33].FaultAlarm = bitArray[502];
                        dicGasDatas[ID.GD_S2_F48].FaultAlarm = bitArray[503];
                        dicGasDatas[ID.GD_S2_F49].FaultAlarm = bitArray[504];
                        dicGasDatas[ID.GD_S2_F50].FaultAlarm = bitArray[505];
                        dicGasDatas[ID.GD_S2_F51].FaultAlarm = bitArray[506];
                        dicGasDatas[ID.GD_S2_F53].FaultAlarm = bitArray[507];
                        dicGasDatas[ID.GD_S2_F54].FaultAlarm = bitArray[508];
                        */
                        dicGasDatas[ID.GAS_EF_3F_1].Status = bitArray[640];
                        dicGasDatas[ID.GAS_EF_3F_1].FaultAlarm = bitArray[641];
                        dicGasDatas[ID.GAS_EF_3F_2].Status = bitArray[642];
                        dicGasDatas[ID.GAS_EF_3F_2].FaultAlarm = bitArray[643];
                        dicGasDatas[ID.GAS_EF_3F_3].Status = bitArray[644];
                        dicGasDatas[ID.GAS_EF_3F_3].FaultAlarm = bitArray[645];
                        dicGasDatas[ID.GAS_EF_3F_4].Status = bitArray[646];
                        dicGasDatas[ID.GAS_EF_3F_4].FaultAlarm = bitArray[647];

                        dicGasDatas[ID.GD_S2_I01].SetHiData_S(bitArray, 1008);
                        dicGasDatas[ID.GD_S2_I02].SetHiData_S(bitArray, 1016);

                        dicGasDatas[ID.GD_S2_L01].SetHiData_S(bitArray, 1024);
                        dicGasDatas[ID.GD_S2_L02].SetHiData_S(bitArray, 1032);
                        dicGasDatas[ID.GD_S2_L03].SetHiData_S(bitArray, 1040);
                    }
                    else if (this.Type == Types.Device5)
                    {
                        if (bitArray.Length < ID.S_Dev5_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S2_F20].HiAlarm = bitArray[0];
                        dicGasDatas[ID.GD_S2_F21].HiAlarm = bitArray[1];
                        dicGasDatas[ID.GD_S2_F22].HiAlarm = bitArray[2];
                        dicGasDatas[ID.GD_S2_F23].HiAlarm = bitArray[3];
                        dicGasDatas[ID.GD_S2_F24].HiAlarm = bitArray[4];
                        dicGasDatas[ID.GD_S2_F28].HiAlarm = bitArray[5];
                        dicGasDatas[ID.GD_S2_F29].HiAlarm = bitArray[6];
                        dicGasDatas[ID.GD_S2_F30].HiAlarm = bitArray[7];

                        dicGasDatas[ID.GD_S2_F31].HiAlarm = bitArray[8];
                        dicGasDatas[ID.GD_S2_F32].HiAlarm = bitArray[9];
                        dicGasDatas[ID.GD_S2_F34].HiAlarm = bitArray[10];
                        dicGasDatas[ID.GD_S2_F35].HiAlarm = bitArray[11];
                        dicGasDatas[ID.GD_S2_F36].HiAlarm = bitArray[12];
                        dicGasDatas[ID.GD_S2_F37].HiAlarm = bitArray[13];
                        dicGasDatas[ID.GD_S2_F38].HiAlarm = bitArray[14];
                        dicGasDatas[ID.GD_S2_F39].HiAlarm = bitArray[15];
                        dicGasDatas[ID.GD_S2_F40].HiAlarm = bitArray[16];

                        dicGasDatas[ID.GD_S2_F41].HiAlarm = bitArray[17];
                        dicGasDatas[ID.GD_S2_F42].HiAlarm = bitArray[18];
                        dicGasDatas[ID.GD_S2_F43].HiAlarm = bitArray[19];
                        dicGasDatas[ID.GD_S2_F44].HiAlarm = bitArray[20];
                        dicGasDatas[ID.GD_S2_F45].HiAlarm = bitArray[21];
                        dicGasDatas[ID.GD_S2_F46].HiAlarm = bitArray[22];
                        dicGasDatas[ID.GD_S2_F47].HiAlarm = bitArray[23];
                        dicGasDatas[ID.GD_S2_F52].HiAlarm = bitArray[24];




                        dicGasDatas[ID.GD_S2_F20].HiHighAlarm = bitArray[160];
                        dicGasDatas[ID.GD_S2_F21].HiHighAlarm = bitArray[161];
                        dicGasDatas[ID.GD_S2_F22].HiHighAlarm = bitArray[162];
                        dicGasDatas[ID.GD_S2_F23].HiHighAlarm = bitArray[163];
                        dicGasDatas[ID.GD_S2_F24].HiHighAlarm = bitArray[164];
                        dicGasDatas[ID.GD_S2_F28].HiHighAlarm = bitArray[165];
                        dicGasDatas[ID.GD_S2_F29].HiHighAlarm = bitArray[166];
                        dicGasDatas[ID.GD_S2_F30].HiHighAlarm = bitArray[167];

                        dicGasDatas[ID.GD_S2_F31].HiHighAlarm = bitArray[168];
                        dicGasDatas[ID.GD_S2_F32].HiHighAlarm = bitArray[169];
                        dicGasDatas[ID.GD_S2_F34].HiHighAlarm = bitArray[170];
                        dicGasDatas[ID.GD_S2_F35].HiHighAlarm = bitArray[171];
                        dicGasDatas[ID.GD_S2_F36].HiHighAlarm = bitArray[172];
                        dicGasDatas[ID.GD_S2_F37].HiHighAlarm = bitArray[173];
                        dicGasDatas[ID.GD_S2_F38].HiHighAlarm = bitArray[174];
                        dicGasDatas[ID.GD_S2_F39].HiHighAlarm = bitArray[175];
                        dicGasDatas[ID.GD_S2_F40].HiHighAlarm = bitArray[176];

                        dicGasDatas[ID.GD_S2_F41].HiHighAlarm = bitArray[177];
                        dicGasDatas[ID.GD_S2_F42].HiHighAlarm = bitArray[178];
                        dicGasDatas[ID.GD_S2_F43].HiHighAlarm = bitArray[179];
                        dicGasDatas[ID.GD_S2_F44].HiHighAlarm = bitArray[180];
                        dicGasDatas[ID.GD_S2_F45].HiHighAlarm = bitArray[181];
                        dicGasDatas[ID.GD_S2_F46].HiHighAlarm = bitArray[182];
                        dicGasDatas[ID.GD_S2_F47].HiHighAlarm = bitArray[183];
                        dicGasDatas[ID.GD_S2_F52].HiHighAlarm = bitArray[184];



                        /*
                        dicGasDatas[ID.GD_S2_F20].FaultAlarm = bitArray[480];
                        dicGasDatas[ID.GD_S2_F21].FaultAlarm = bitArray[481];
                        dicGasDatas[ID.GD_S2_F22].FaultAlarm = bitArray[482];
                        dicGasDatas[ID.GD_S2_F23].FaultAlarm = bitArray[483];
                        dicGasDatas[ID.GD_S2_F24].FaultAlarm = bitArray[484];
                        dicGasDatas[ID.GD_S2_F28].FaultAlarm = bitArray[485];
                        dicGasDatas[ID.GD_S2_F29].FaultAlarm = bitArray[486];
                        dicGasDatas[ID.GD_S2_F30].FaultAlarm = bitArray[487];

                        dicGasDatas[ID.GD_S2_F31].FaultAlarm = bitArray[488];
                        dicGasDatas[ID.GD_S2_F32].FaultAlarm = bitArray[489];
                        dicGasDatas[ID.GD_S2_F34].FaultAlarm = bitArray[490];
                        dicGasDatas[ID.GD_S2_F35].FaultAlarm = bitArray[491];
                        dicGasDatas[ID.GD_S2_F36].FaultAlarm = bitArray[492];
                        dicGasDatas[ID.GD_S2_F37].FaultAlarm = bitArray[493];
                        dicGasDatas[ID.GD_S2_F38].FaultAlarm = bitArray[494];
                        dicGasDatas[ID.GD_S2_F39].FaultAlarm = bitArray[495];
                        dicGasDatas[ID.GD_S2_F40].FaultAlarm = bitArray[496];

                        dicGasDatas[ID.GD_S2_F41].FaultAlarm = bitArray[497];
                        dicGasDatas[ID.GD_S2_F42].FaultAlarm = bitArray[498];
                        dicGasDatas[ID.GD_S2_F43].FaultAlarm = bitArray[499];
                        dicGasDatas[ID.GD_S2_F44].FaultAlarm = bitArray[490];
                        dicGasDatas[ID.GD_S2_F45].FaultAlarm = bitArray[501];
                        dicGasDatas[ID.GD_S2_F46].FaultAlarm = bitArray[502];
                        dicGasDatas[ID.GD_S2_F47].FaultAlarm = bitArray[503];
                        dicGasDatas[ID.GD_S2_F52].FaultAlarm = bitArray[504];
                        */



                        dicGasDatas[ID.GD_S2_G01].SetHiData_S(bitArray, 1008);
                        dicGasDatas[ID.GD_S2_G02].SetHiData_S(bitArray, 1016);
                        dicGasDatas[ID.GD_S2_G03].SetHiData_S(bitArray, 1024);
                        dicGasDatas[ID.GD_S2_G04].SetHiData_S(bitArray, 1032);
                        dicGasDatas[ID.GD_S2_G05].SetHiData_S(bitArray, 1040);
                        dicGasDatas[ID.GD_S2_G06].SetHiData_S(bitArray, 1048);
                        dicGasDatas[ID.GD_S2_G07].SetHiData_S(bitArray, 1056);
                        dicGasDatas[ID.GD_S2_G08].SetHiData_S(bitArray, 1064);
                        dicGasDatas[ID.GD_S2_G09].SetHiData_S(bitArray, 1072);
                        dicGasDatas[ID.GD_S2_G10].SetHiData_S(bitArray, 1080);
                        dicGasDatas[ID.GD_S2_G11].SetHiData_S(bitArray, 1088);
                        dicGasDatas[ID.GD_S2_G12].SetHiData_S(bitArray, 1096);
                        dicGasDatas[ID.GD_S2_G13].SetHiData_S(bitArray, 1104);
                        dicGasDatas[ID.GD_S2_G14].SetHiData_S(bitArray, 1112);
                        dicGasDatas[ID.GD_S2_G15].SetHiData_S(bitArray, 1120);
                        dicGasDatas[ID.GD_S2_G16].SetHiData_S(bitArray, 1128);


                        dicGasDatas[ID.GD_S2_H01].SetHiData_S(bitArray, 1136);
                        dicGasDatas[ID.GD_S2_H02].SetHiData_S(bitArray, 1144);
                        dicGasDatas[ID.GD_S2_H03].SetHiData_S(bitArray, 1152);
                        dicGasDatas[ID.GD_S2_H04].SetHiData_S(bitArray, 1160);
                    }
                    else if (this.Type == Types.Device6)
                    {
                        if (bitArray.Length < ID.S_Dev6_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S_A01].SetLowData(bitArray, 0);
                        dicGasDatas[ID.GD_S_A02].SetLowData(bitArray, 8);
                        dicGasDatas[ID.GD_S_A03].SetLowData(bitArray, 16);
                        dicGasDatas[ID.GD_S_A06].SetLowData(bitArray, 24);

                        dicGasDatas[ID.GD_S_K01].SetLowData(bitArray, 32);
                        dicGasDatas[ID.GD_S_K02].SetLowData(bitArray, 40);

                        dicGasDatas[ID.GD_S_A04].SetLowData(bitArray, 88);
                        dicGasDatas[ID.GD_S_A05].SetLowData(bitArray, 96);

                    }
                    else if (this.Type == Types.Device7)
                    {
                        if (bitArray.Length < ID.S_Dev7_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S_J01].SetLowData(bitArray, 0);
                        dicGasDatas[ID.GD_S_J02].SetLowData(bitArray, 8);
                        dicGasDatas[ID.GD_S_J03].SetLowData(bitArray, 16);
                        dicGasDatas[ID.GD_S_J04].SetLowData(bitArray, 24);

                        dicGasDatas[ID.GD_S_J05].FireAlarm = bitArray[32];
                        dicGasDatas[ID.GD_S_J06].FireAlarm = bitArray[40];
                        dicGasDatas[ID.GD_S_J07].FireAlarm = bitArray[48];
                        dicGasDatas[ID.GD_S_J08].FireAlarm = bitArray[56];


                        dicGasDatas[ID.PIA_001].LoAlarm = bitArray[88];
                        dicGasDatas[ID.PIA_001].LoLowAlarm = bitArray[89];
                        dicGasDatas[ID.PIA_001].HiAlarm = bitArray[90];

                        dicGasDatas[ID.PIA_002].LoAlarm = bitArray[96];
                        dicGasDatas[ID.PIA_002].HiAlarm = bitArray[97];

                        dicGasDatas[ID.PT_WIQ11].LoAlarm = bitArray[104];
                        dicGasDatas[ID.PT_WIQ11].HiAlarm = bitArray[105];

                        dicGasDatas[ID.PT_WIQ01].LoAlarm = bitArray[120];
                        dicGasDatas[ID.PT_WIQ01].HiAlarm = bitArray[121];
                    }
                    else if (this.Type == Types.Device8)
                    {
                        if (bitArray.Length < ID.S_Dev8_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S_M01].SetHiData(bitArray, 0);

                        dicGasDatas[ID.GD_S2_N01].SetHiData(bitArray, 24);       // 신규 센서 - 20251106

                    }
                    else if (this.Type == Types.Device9)
                    {
                        if (bitArray.Length < ID.S_Dev8_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_S1_O01].SetHiData(bitArray, 0);       // 신규 센서 - 20251106

                    }

                    // 기존 알람상태 비교 후 알람 발생 및 해제
                    if (CheckGasAlarm2(dicGasDatas, out strErrorMessage) == false)
                    {
                        m_parentManager.Logger.Write("[" + this.DeviceName + "] OnReceiveData() : " + strErrorMessage);
                    }
                }                
            }
            catch (Exception e)
            {
                m_parentManager.Logger.Write("[" + this.DeviceName + "] OnReceiveData() : " + e.Message);               
            }
        }

        public bool CheckGasAlarm2(Dictionary<string, GasData> dicGasDatas, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (dicGasDatas == null || dicGasDatas.Count == 0)
            {
                strErrorMessage = "체크할 데이터가 존재하지 않습니다.";
                return false;
            }

            GasData chkData = new GasData();    // 체크용

            foreach (KeyValuePair<string, GasData> pair in dicGasDatas)
            {
                string strSensorName = pair.Key;
                GasData currentData = pair.Value;    // 현재값

                GasSensorData gasSensor = null;
                if (m_dicGasSensors.ContainsKey(strSensorName + "_" + currentData.Type))
                    gasSensor = m_dicGasSensors[strSensorName + "_" + currentData.Type];

                GasSensorData faultSensor = null;
                if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Fault))
                    faultSensor = m_dicGasSensors[strSensorName + "_" + ID.Fault];

                GasSensorData pressSensor = null;
                if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Press))
                    pressSensor = m_dicGasSensors[strSensorName + "_" + ID.Press];

                GasSensorData flameSensor = null;
                if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Flame))
                    flameSensor = m_dicGasSensors[strSensorName + "_" + ID.Flame];

                GasSensorData statusSensor = null;
                if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Status))
                    statusSensor = m_dicGasSensors[strSensorName + "_" + ID.Status];



                bool bIsAlarm = true;
                int nAlarmLevel = 2;
                int nSensorType = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;

                ArrayList arrData = null;

                if (m_dicGasDatas.ContainsKey(strSensorName))
                {
                    GasData gasData = m_dicGasDatas[strSensorName];    // 기존값                    

                    // 물질 알람
                    if (gasSensor != null)
                    {
                        arrData = null;

                        if (gasData.LoLowAlarm == false && gasData.HiHighAlarm == false && (currentData.HiHighAlarm == true || currentData.LoLowAlarm == true))
                        {   // 2단계 발생 또는 격상

                            nAlarmLevel = 3;

                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(gasSensor.TagInfoID);
                            arrData.Add(gasSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }
                        else if ((gasData.LoLowAlarm == false && gasData.HiHighAlarm == false && gasData.LoAlarm == false && gasData.HiAlarm == false &&
                            (currentData.LoAlarm == true || currentData.HiAlarm == true))
                            ||
                            ((gasData.HiHighAlarm == true || gasData.LoLowAlarm == true) &&
                            (currentData.HiHighAlarm == false && currentData.LoLowAlarm == false && (currentData.LoAlarm == true || currentData.HiAlarm == true))))
                        {   // 1단계 발생
                            // 1단계로 하향
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(gasSensor.TagInfoID);
                            arrData.Add(gasSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);

                        }
                        else if ((gasData.LoLowAlarm == true || gasData.HiHighAlarm == true || gasData.LoAlarm == true || gasData.HiAlarm == true) &&
                            (currentData.LoLowAlarm == false && currentData.HiHighAlarm == false && currentData.LoAlarm == false && currentData.HiAlarm == false))
                        {   // 알람 해제
                            bIsAlarm = false;

                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(gasSensor.TagInfoID);
                            arrData.Add(gasSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {gasSensor.SensorName} {currentData.Type} (UniqueKey: {gasSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"1. SendAlarmQuery 실패 (Name: {gasSensor.SensorName}, Type: {currentData.Type}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {gasSensor.TagInfoID}, SensorZoneID: {gasSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }





                    // 고장 알람
                    if (faultSensor != null)
                    {
                        arrData = null;
                        bIsAlarm = true;
                        nAlarmLevel = 2;

                        if (gasData.FaultAlarm == false && currentData.FaultAlarm == true)
                        {   // 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(faultSensor.TagInfoID);
                            arrData.Add(faultSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }
                        else if (gasData.FaultAlarm == true && currentData.FaultAlarm == false)
                        {   // 해제
                            bIsAlarm = false;

                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(faultSensor.TagInfoID);
                            arrData.Add(faultSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {faultSensor.SensorName} (UniqueKey: {faultSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"2. SendAlarmQuery 실패 (Name: {faultSensor.SensorName}, Type: 고장, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {faultSensor.TagInfoID}, SensorZoneID: {faultSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }





                    // 압력 알람
                    if (pressSensor != null)
                    {
                        arrData = null;
                        bIsAlarm = true;
                        nAlarmLevel = 2;

                        if ((gasData.PressHiAlarm == false && gasData.PressLoAlarm == false) && (currentData.PressHiAlarm == true || currentData.PressLoAlarm == true))
                        {   // 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(pressSensor.TagInfoID);
                            arrData.Add(pressSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }
                        else if ((gasData.PressHiAlarm == true || gasData.PressLoAlarm == true) && (currentData.PressHiAlarm == false || currentData.PressLoAlarm == false))
                        {   // 해제
                            bIsAlarm = false;

                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(pressSensor.TagInfoID);
                            arrData.Add(pressSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {pressSensor.SensorName} (UniqueKey: {pressSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"3. SendAlarmQuery 실패 (Name: {pressSensor.SensorName}, Type: 압력, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {pressSensor.TagInfoID}, SensorZoneID: {pressSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }






                    // 불꽃 알람
                    if (flameSensor != null)
                    {
                        arrData = null;
                        bIsAlarm = true;
                        nAlarmLevel = 2;

                        if (gasData.FireAlarm == false && currentData.FireAlarm == true)
                        {   // 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(flameSensor.TagInfoID);
                            arrData.Add(flameSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }
                        else if (gasData.FireAlarm == true && currentData.FireAlarm == false)
                        {   // 해제
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(flameSensor.TagInfoID);
                            arrData.Add(flameSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {flameSensor.SensorName} (UniqueKey: {flameSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"4. SendAlarmQuery 실패 (Name: {flameSensor.SensorName}, Type: 불꽃, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {flameSensor.TagInfoID}, SensorZoneID: {flameSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }






                    // 가동중지 알람
                    if (statusSensor != null)
                    {
                        arrData = null;
                        bIsAlarm = true;
                        nAlarmLevel = 2;

                        if (gasData.Status == true && currentData.Status == false)
                        { // 알람 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(statusSensor.TagInfoID);
                            arrData.Add(statusSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }
                        else if (gasData.Status == false && currentData.Status == true)
                        { // 알람 해제
                            bIsAlarm = false;

                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(statusSensor.TagInfoID);
                            arrData.Add(statusSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {statusSensor.SensorName} (UniqueKey: {statusSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"5. SendAlarmQuery 실패 (Name: {statusSensor.SensorName}, Type: 동작중지, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {statusSensor.TagInfoID}, SensorZoneID: {statusSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }

                }
                else
                {
                    bIsAlarm = true;

                    if (gasSensor != null)
                    {   // 물질 알람
                        arrData = null;
                        nAlarmLevel = 2;

                        if (currentData.HiHighAlarm == true || currentData.LoLowAlarm == true)
                        {   // 2단계 발생
                            nAlarmLevel = 3;

                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(gasSensor.TagInfoID);
                            arrData.Add(gasSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);

                        }
                        else if (currentData.LoAlarm == true || currentData.HiAlarm == true)
                        {   // 1단계 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(gasSensor.TagInfoID);
                            arrData.Add(gasSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {gasSensor.SensorName} {currentData.Type} (UniqueKey: {gasSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"6. SendAlarmQuery 실패 (Name: {gasSensor.SensorName}, Type: {currentData.Type}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {gasSensor.TagInfoID}, SensorZoneID: {gasSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }



                    if (faultSensor != null)
                    { // 고장 알람
                        arrData = null;
                        nAlarmLevel = 2;

                        if (currentData.FaultAlarm == true)
                        {   // 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(faultSensor.TagInfoID);
                            arrData.Add(faultSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {faultSensor.SensorName} (UniqueKey: {faultSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"7. SendAlarmQuery 실패 (Name: {faultSensor.SensorName}, Type: 고장, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {faultSensor.TagInfoID}, SensorZoneID: {faultSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }


                    // 압력 알람
                    if (pressSensor != null)
                    {
                        arrData = null;
                        nAlarmLevel = 2;

                        if (currentData.PressHiAlarm == true || currentData.PressLoAlarm == true)
                        {   // 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(pressSensor.TagInfoID);
                            arrData.Add(pressSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {pressSensor.SensorName} (UniqueKey: {pressSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"8. SendAlarmQuery 실패 (Name: {pressSensor.SensorName}, Type: 압력, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {pressSensor.TagInfoID}, SensorZoneID: {pressSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }


                    // 불꽃 알람
                    if (flameSensor != null)
                    {
                        arrData = null;
                        nAlarmLevel = 2;

                        if (currentData.FireAlarm == true)
                        {   // 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(flameSensor.TagInfoID);
                            arrData.Add(flameSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {flameSensor.SensorName} (UniqueKey: {flameSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"9. SendAlarmQuery 실패 (Name: {flameSensor.SensorName}, Type: 불꽃, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {flameSensor.TagInfoID}, SensorZoneID: {flameSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }


                    // 가동중지 알람
                    if (statusSensor != null)
                    {
                        arrData = null;
                        nAlarmLevel = 2;

                        if (currentData.Status == false)
                        { // 알람 발생
                            arrData = new ArrayList();
                            arrData.Add(nSensorType);
                            arrData.Add(statusSensor.TagInfoID);
                            arrData.Add(statusSensor.SensorZoneID);
                            arrData.Add(bIsAlarm);
                            arrData.Add(nAlarmLevel);
                        }

                        if (arrData != null)
                        {   // 알람 발생 및 해제 신호
                            m_parentManager.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {statusSensor.SensorName} (UniqueKey: {statusSensor.UniqueKey})");

                            if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
                            {
                                strErrorMessage = $"10. SendAlarmQuery 실패 (Name: {statusSensor.SensorName}, Type: 동작중지, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {statusSensor.TagInfoID}, SensorZoneID: {statusSensor.SensorZoneID})";
                                return false;
                            }
                        }
                    }

                }

                m_dicGasDatas[strSensorName] = currentData;
            }

            return true;
        }

        public bool UpdateSensorData2(Dictionary<string, GasData> dicGasDatas, out string strErrorMessage)
        {
            if (m_dbDataManager == null)
            {
                strErrorMessage = "dbDataManager 값이 없습니다.";
                return false;
            }

            return m_dbDataManager.UpdateSensorData(dicGasDatas, out strErrorMessage);
        }
    }
}
