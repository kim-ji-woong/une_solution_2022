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
    public class GasAProvider : ClientServiceProvider
    {
        public enum Types { Device1 = 0, Device2 }

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

        public GasAProvider(GasManager parentManager, Types type, string strIP, int nPort, DBDataManager dbDataManager, SopQueryManager sopQueryMgr, Dictionary<string, GasSensorData> dicGasSensors, string strSOPWebServerURL)
        {
            m_parentManager = parentManager;
            m_dbDataManager = dbDataManager;
            m_sopQueryMgr = sopQueryMgr;
            m_dicGasSensors = dicGasSensors;
            m_strSOPWebServerURL = strSOPWebServerURL;

            this.Type = type;
            this.IP = strIP;
            this.Port = nPort;

            this.DeviceName = "A_" + type;
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
                            nStartAddr = 0;
                            nLength = (UInt16)ID.A_Dev1_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.A_Dev1_Register_Length1;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 100;
                            nLength = (UInt16)ID.A_Dev1_Register_Length2;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device2)
                        {
                            nSlaveID = 2;

                            nStartAddr = 0; 
                            nLength = (UInt16)ID.A_Dev2_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            //nLength = (UInt16)ID.A_Dev2_Discrete_Length;
                            nLength = (UInt16)ID.A_Dev2_Register_Length;

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
                    if (FC == ID.FC_ReadInputRegister)
                    {
                        if (arrData.Length == ID.A_Dev1_Register_Length1 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_A_B01] = new GasData(ID.GD_A_B01, ID.H2);
                            dicGasDatas[ID.GD_A_B02] = new GasData(ID.GD_A_B02, ID.H2);
                            dicGasDatas[ID.GD_A_B03] = new GasData(ID.GD_A_B03, ID.H2);
                            dicGasDatas[ID.GD_A_B04] = new GasData(ID.GD_A_B04, ID.H2);
                            dicGasDatas[ID.GD_A_A01] = new GasData(ID.GD_A_A01, ID.H2);
                            dicGasDatas[ID.GD_A_A02] = new GasData(ID.GD_A_A02, ID.H2);
                            dicGasDatas[ID.GD_A_A03] = new GasData(ID.GD_A_A03, ID.H2);
                            dicGasDatas[ID.GD_A_A04] = new GasData(ID.GD_A_A04, ID.H2);
                            dicGasDatas[ID.GD_A_C01] = new GasData(ID.GD_A_C01, ID.O2);
                            dicGasDatas[ID.GD_A_C02] = new GasData(ID.GD_A_C02, ID.O2);
                            dicGasDatas[ID.GD_A_C03] = new GasData(ID.GD_A_C03, ID.O2);
                            dicGasDatas[ID.GD_A_C04] = new GasData(ID.GD_A_C04, ID.O2);
                            dicGasDatas[ID.GD_A_C05] = new GasData(ID.GD_A_C05, ID.O2);
                            dicGasDatas[ID.GD_A_C06] = new GasData(ID.GD_A_C06, ID.O2);
                            dicGasDatas[ID.GD_A_C07] = new GasData(ID.GD_A_C07, ID.O2);
                            dicGasDatas[ID.GD_A_E01] = new GasData(ID.GD_A_E01, ID.H2);
                            dicGasDatas[ID.GD_A_E02] = new GasData(ID.GD_A_E02, ID.H2);
                            dicGasDatas[ID.GD_A_E03] = new GasData(ID.GD_A_E03, ID.H2);
                            dicGasDatas[ID.GD_A_E04] = new GasData(ID.GD_A_E04, ID.H2);
                            dicGasDatas[ID.GD_A_E05] = new GasData(ID.GD_A_E05, ID.H2);
                            dicGasDatas[ID.GD_A_E06] = new GasData(ID.GD_A_E06, ID.H2);
                            dicGasDatas[ID.GD_A_E07] = new GasData(ID.GD_A_E07, ID.H2);
                            dicGasDatas[ID.GD_A_E08] = new GasData(ID.GD_A_E08, ID.H2);
                            dicGasDatas[ID.GD_A_E09] = new GasData(ID.GD_A_E09, ID.H2);
                            dicGasDatas[ID.GD_A_E10] = new GasData(ID.GD_A_E10, ID.H2);
                            dicGasDatas[ID.GD_A_F01] = new GasData(ID.GD_A_F01, ID.O2);
                            dicGasDatas[ID.GD_A_F02] = new GasData(ID.GD_A_F02, ID.O2);
                            dicGasDatas[ID.GD_A_F03] = new GasData(ID.GD_A_F03, ID.O2);
                            dicGasDatas[ID.GD_A_F04] = new GasData(ID.GD_A_F04, ID.O2);
                            dicGasDatas[ID.GD_A_H01] = new GasData(ID.GD_A_H01, ID.H2);
                            dicGasDatas[ID.GD_A_H02] = new GasData(ID.GD_A_H02, ID.H2);
                            dicGasDatas[ID.GD_A_H03] = new GasData(ID.GD_A_H03, ID.H2);
                            dicGasDatas[ID.GD_A_H04] = new GasData(ID.GD_A_H04, ID.H2);
                            dicGasDatas[ID.GD_A_H05] = new GasData(ID.GD_A_H05, ID.H2);
                            dicGasDatas[ID.GD_A_H06] = new GasData(ID.GD_A_H06, ID.H2);
                            dicGasDatas[ID.GD_A_H07] = new GasData(ID.GD_A_H07, ID.H2);
                            dicGasDatas[ID.GD_A_H08] = new GasData(ID.GD_A_H08, ID.H2);
                            dicGasDatas[ID.GD_A_I01] = new GasData(ID.GD_A_I01, ID.LNG);
                            dicGasDatas[ID.GD_A_I02] = new GasData(ID.GD_A_I02, ID.O2);
                            dicGasDatas[ID.GD_A_J01] = new GasData(ID.GD_A_J01, ID.LNG);
                        }
                        else if (arrData.Length == ID.A_Dev1_Register_Length2 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_A_K01] = new GasData(ID.GD_A_K01, ID.H2);
                            dicGasDatas[ID.GD_A_K02] = new GasData(ID.GD_A_K02, ID.H2);
                            dicGasDatas[ID.GD_A_K03] = new GasData(ID.GD_A_K03, ID.Press);
                            dicGasDatas[ID.GD_A_L01] = new GasData(ID.GD_A_L01, ID.H2);
                            dicGasDatas[ID.GD_A_L02] = new GasData(ID.GD_A_L02, ID.H2);
                            dicGasDatas[ID.GD_A_L03] = new GasData(ID.GD_A_L03, ID.H2);
                            dicGasDatas[ID.GD_A_L04] = new GasData(ID.GD_A_L04, ID.H2);
                            dicGasDatas[ID.GD_A_L05] = new GasData(ID.GD_A_L05, ID.H2);
                            dicGasDatas[ID.GD_A_L06] = new GasData(ID.GD_A_L06, ID.H2);
                            dicGasDatas[ID.GD_A_L07] = new GasData(ID.GD_A_L07, ID.H2);
                            dicGasDatas[ID.GD_A_L08] = new GasData(ID.GD_A_L08, ID.H2);
                            dicGasDatas[ID.GD_A_L09] = new GasData(ID.GD_A_L09, ID.H2);
                            dicGasDatas[ID.GD_A_L10] = new GasData(ID.GD_A_L10, ID.H2);
                            dicGasDatas[ID.GD_A_L11] = new GasData(ID.GD_A_L11, ID.H2);
                            dicGasDatas[ID.GD_A_L12] = new GasData(ID.GD_A_L12, ID.H2);
                            dicGasDatas[ID.GD_A_L13] = new GasData(ID.GD_A_L13, ID.H2);
                            dicGasDatas[ID.GD_A_L14] = new GasData(ID.GD_A_L14, ID.H2);
                            dicGasDatas[ID.GD_A_L15] = new GasData(ID.GD_A_L15, ID.H2);
                            dicGasDatas[ID.GD_A_L16] = new GasData(ID.GD_A_L16, ID.H2);
                            dicGasDatas[ID.GD_A_L17] = new GasData(ID.GD_A_L17, ID.H2);
                            dicGasDatas[ID.GD_A_L20] = new GasData(ID.GD_A_L20, ID.H2);         // 신규 센서 - 20251106
                            dicGasDatas[ID.GD_A_E11] = new GasData(ID.GD_A_E11, ID.H2);
                            dicGasDatas[ID.GD_A_G01] = new GasData(ID.GD_A_G01, ID.H2);
                            dicGasDatas[ID.GD_A_G02] = new GasData(ID.GD_A_G02, ID.H2);
                            dicGasDatas[ID.GD_A_G03] = new GasData(ID.GD_A_G03, ID.H2);
                            dicGasDatas[ID.GD_A_G04] = new GasData(ID.GD_A_G04, ID.H2);
                            dicGasDatas[ID.GD_A_G05] = new GasData(ID.GD_A_G05, ID.H2);
                            dicGasDatas[ID.GD_A_G06] = new GasData(ID.GD_A_G06, ID.H2);
                            dicGasDatas[ID.GD_A_G07] = new GasData(ID.GD_A_G07, ID.H2);
                            dicGasDatas[ID.GD_A_G08] = new GasData(ID.GD_A_G08, ID.H2);
                            dicGasDatas[ID.GD_A_G09] = new GasData(ID.GD_A_G09, ID.H2);
                            dicGasDatas[ID.GD_A_G10] = new GasData(ID.GD_A_G10, ID.H2);
                            dicGasDatas[ID.GD_A_G11] = new GasData(ID.GD_A_G11, ID.H2);
                            dicGasDatas[ID.GD_A_G12] = new GasData(ID.GD_A_G12, ID.H2);
                            dicGasDatas[ID.GD_A_G13] = new GasData(ID.GD_A_G13, ID.H2);
                            dicGasDatas[ID.GD_A_G14] = new GasData(ID.GD_A_G14, ID.H2);
                            dicGasDatas[ID.GD_A_N01] = new GasData(ID.GD_A_N01, ID.H2);
                            dicGasDatas[ID.GD_A_N02] = new GasData(ID.GD_A_N02, ID.H2);
                            dicGasDatas[ID.GD_A_N03] = new GasData(ID.GD_A_N03, ID.H2);
                            dicGasDatas[ID.GD_A_N04] = new GasData(ID.GD_A_N04, ID.H2);
                            dicGasDatas[ID.GD_A_N05] = new GasData(ID.GD_A_N05, ID.H2);
                            dicGasDatas[ID.GD_A_N06] = new GasData(ID.GD_A_N06, ID.H2);
                            dicGasDatas[ID.GD_A_O01] = new GasData(ID.GD_A_O01, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_A_O02] = new GasData(ID.GD_A_O02, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_A_O03] = new GasData(ID.GD_A_O03, ID.O2, GasData.VauleTypes.Divide10);
                            dicGasDatas[ID.GD_A_O04] = new GasData(ID.GD_A_O04, ID.O2, GasData.VauleTypes.Divide10);
                            //dicGasDatas[ID.GD_A_D01] = new GasData(ID.GD_A_D01, ID.CL2, GasData.VauleTypes.Divide100);    // 센서명 중복으로 인한 주석처리 - 20260203
                            dicGasDatas[ID.GD_A_D01] = new GasData(ID.GD_A_D01, ID.O2, GasData.VauleTypes.Divide10);        // 신규 센서 - 20251106
                            dicGasDatas[ID.GD_A_D02] = new GasData(ID.GD_A_D02, ID.CL2, GasData.VauleTypes.Divide100);
                            dicGasDatas[ID.GD_A_H09] = new GasData(ID.GD_A_H09, ID.H2);
                            dicGasDatas[ID.GD_A_H10] = new GasData(ID.GD_A_H10, ID.H2);
                            dicGasDatas[ID.GD_A_H11] = new GasData(ID.GD_A_H11, ID.H2);
                            dicGasDatas[ID.GD_A_H12] = new GasData(ID.GD_A_H12, ID.H2);
                            dicGasDatas[ID.GD_A_H13] = new GasData(ID.GD_A_H13, ID.H2);

                            dicGasDatas[ID.GD_A_L18] = new GasData(ID.GD_A_L18, ID.HF, GasData.VauleTypes.Divide10);        // 신규 센서 - 20260304
                            dicGasDatas[ID.GD_A_L21] = new GasData(ID.GD_A_L21, ID.HNO3, GasData.VauleTypes.Divide10);      // 신규 센서 - 20260304
                            dicGasDatas[ID.GD_A_L22] = new GasData(ID.GD_A_L22, ID.O2, GasData.VauleTypes.Divide10);        // 신규 센서 - 20260304
                        }
                    }
                    else
                    {
                        dicGasDatas[ID.GD_A_B01] = new GasData(ID.GD_A_B01, ID.H2);
                        dicGasDatas[ID.GD_A_B02] = new GasData(ID.GD_A_B02, ID.H2);
                        dicGasDatas[ID.GD_A_B03] = new GasData(ID.GD_A_B03, ID.H2);
                        dicGasDatas[ID.GD_A_B04] = new GasData(ID.GD_A_B04, ID.H2);
                        dicGasDatas[ID.GD_A_A01] = new GasData(ID.GD_A_A01, ID.H2);
                        dicGasDatas[ID.GD_A_A02] = new GasData(ID.GD_A_A02, ID.H2);
                        dicGasDatas[ID.GD_A_A03] = new GasData(ID.GD_A_A03, ID.H2);
                        dicGasDatas[ID.GD_A_A04] = new GasData(ID.GD_A_A04, ID.H2);
                        dicGasDatas[ID.GD_A_C01] = new GasData(ID.GD_A_C01, ID.O2);
                        dicGasDatas[ID.GD_A_C02] = new GasData(ID.GD_A_C02, ID.O2);
                        dicGasDatas[ID.GD_A_C03] = new GasData(ID.GD_A_C03, ID.O2);
                        dicGasDatas[ID.GD_A_C04] = new GasData(ID.GD_A_C04, ID.O2);
                        dicGasDatas[ID.GD_A_C05] = new GasData(ID.GD_A_C05, ID.O2);
                        dicGasDatas[ID.GD_A_C06] = new GasData(ID.GD_A_C06, ID.O2);
                        dicGasDatas[ID.GD_A_C07] = new GasData(ID.GD_A_C07, ID.O2);
                        dicGasDatas[ID.GD_A_E01] = new GasData(ID.GD_A_E01, ID.H2);
                        dicGasDatas[ID.GD_A_E02] = new GasData(ID.GD_A_E02, ID.H2);
                        dicGasDatas[ID.GD_A_E03] = new GasData(ID.GD_A_E03, ID.H2);
                        dicGasDatas[ID.GD_A_E04] = new GasData(ID.GD_A_E04, ID.H2);
                        dicGasDatas[ID.GD_A_E05] = new GasData(ID.GD_A_E05, ID.H2);
                        dicGasDatas[ID.GD_A_E06] = new GasData(ID.GD_A_E06, ID.H2);
                        dicGasDatas[ID.GD_A_E07] = new GasData(ID.GD_A_E07, ID.H2);
                        dicGasDatas[ID.GD_A_E08] = new GasData(ID.GD_A_E08, ID.H2);
                        dicGasDatas[ID.GD_A_E09] = new GasData(ID.GD_A_E09, ID.H2);
                        dicGasDatas[ID.GD_A_E10] = new GasData(ID.GD_A_E10, ID.H2);
                        dicGasDatas[ID.GD_A_F01] = new GasData(ID.GD_A_F01, ID.O2);
                        dicGasDatas[ID.GD_A_F02] = new GasData(ID.GD_A_F02, ID.O2);
                        dicGasDatas[ID.GD_A_F03] = new GasData(ID.GD_A_F03, ID.O2);
                        dicGasDatas[ID.GD_A_F04] = new GasData(ID.GD_A_F04, ID.O2);
                        dicGasDatas[ID.GD_A_H01] = new GasData(ID.GD_A_H01, ID.H2);
                        dicGasDatas[ID.GD_A_H02] = new GasData(ID.GD_A_H02, ID.H2);
                        dicGasDatas[ID.GD_A_H03] = new GasData(ID.GD_A_H03, ID.H2);
                        dicGasDatas[ID.GD_A_H04] = new GasData(ID.GD_A_H04, ID.H2);
                        dicGasDatas[ID.GD_A_H05] = new GasData(ID.GD_A_H05, ID.H2);
                        dicGasDatas[ID.GD_A_H06] = new GasData(ID.GD_A_H06, ID.H2);
                        dicGasDatas[ID.GD_A_H07] = new GasData(ID.GD_A_H07, ID.H2);
                        dicGasDatas[ID.GD_A_H08] = new GasData(ID.GD_A_H08, ID.H2);
                        dicGasDatas[ID.GD_A_I01] = new GasData(ID.GD_A_I01, ID.LNG);
                        dicGasDatas[ID.GD_A_I02] = new GasData(ID.GD_A_I02, ID.O2);
                        dicGasDatas[ID.GD_A_J01] = new GasData(ID.GD_A_J01, ID.LNG);

                        dicGasDatas[ID.GD_A_K01] = new GasData(ID.GD_A_K01, ID.H2);
                        dicGasDatas[ID.GD_A_K02] = new GasData(ID.GD_A_K02, ID.H2);
                        dicGasDatas[ID.GD_A_K03] = new GasData(ID.GD_A_K03, ID.Press);
                        dicGasDatas[ID.GD_A_L01] = new GasData(ID.GD_A_L01, ID.H2);
                        dicGasDatas[ID.GD_A_L02] = new GasData(ID.GD_A_L02, ID.H2);
                        dicGasDatas[ID.GD_A_L03] = new GasData(ID.GD_A_L03, ID.H2);
                        dicGasDatas[ID.GD_A_L04] = new GasData(ID.GD_A_L04, ID.H2);
                        dicGasDatas[ID.GD_A_L05] = new GasData(ID.GD_A_L05, ID.H2);
                        dicGasDatas[ID.GD_A_L06] = new GasData(ID.GD_A_L06, ID.H2);
                        dicGasDatas[ID.GD_A_L07] = new GasData(ID.GD_A_L07, ID.H2);
                        dicGasDatas[ID.GD_A_L08] = new GasData(ID.GD_A_L08, ID.H2);
                        dicGasDatas[ID.GD_A_L09] = new GasData(ID.GD_A_L09, ID.H2);
                        dicGasDatas[ID.GD_A_L10] = new GasData(ID.GD_A_L10, ID.H2);
                        dicGasDatas[ID.GD_A_L11] = new GasData(ID.GD_A_L11, ID.H2);
                        dicGasDatas[ID.GD_A_L12] = new GasData(ID.GD_A_L12, ID.H2);
                        dicGasDatas[ID.GD_A_L13] = new GasData(ID.GD_A_L13, ID.H2);
                        dicGasDatas[ID.GD_A_L14] = new GasData(ID.GD_A_L14, ID.H2);
                        dicGasDatas[ID.GD_A_L15] = new GasData(ID.GD_A_L15, ID.H2);
                        dicGasDatas[ID.GD_A_L16] = new GasData(ID.GD_A_L16, ID.H2);
                        dicGasDatas[ID.GD_A_L17] = new GasData(ID.GD_A_L17, ID.H2);
                        dicGasDatas[ID.GD_A_L20] = new GasData(ID.GD_A_L20, ID.H2);         // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_A_E11] = new GasData(ID.GD_A_E11, ID.H2);
                        dicGasDatas[ID.GD_A_G01] = new GasData(ID.GD_A_G01, ID.H2);
                        dicGasDatas[ID.GD_A_G02] = new GasData(ID.GD_A_G02, ID.H2);
                        dicGasDatas[ID.GD_A_G03] = new GasData(ID.GD_A_G03, ID.H2);
                        dicGasDatas[ID.GD_A_G04] = new GasData(ID.GD_A_G04, ID.H2);
                        dicGasDatas[ID.GD_A_G05] = new GasData(ID.GD_A_G05, ID.H2);
                        dicGasDatas[ID.GD_A_G06] = new GasData(ID.GD_A_G06, ID.H2);
                        dicGasDatas[ID.GD_A_G07] = new GasData(ID.GD_A_G07, ID.H2);
                        dicGasDatas[ID.GD_A_G08] = new GasData(ID.GD_A_G08, ID.H2);
                        dicGasDatas[ID.GD_A_G09] = new GasData(ID.GD_A_G09, ID.H2);
                        dicGasDatas[ID.GD_A_G10] = new GasData(ID.GD_A_G10, ID.H2);
                        dicGasDatas[ID.GD_A_G11] = new GasData(ID.GD_A_G11, ID.H2);
                        dicGasDatas[ID.GD_A_G12] = new GasData(ID.GD_A_G12, ID.H2);
                        dicGasDatas[ID.GD_A_G13] = new GasData(ID.GD_A_G13, ID.H2);
                        dicGasDatas[ID.GD_A_G14] = new GasData(ID.GD_A_G14, ID.H2);
                        dicGasDatas[ID.GD_A_N01] = new GasData(ID.GD_A_N01, ID.H2);
                        dicGasDatas[ID.GD_A_N02] = new GasData(ID.GD_A_N02, ID.H2);
                        dicGasDatas[ID.GD_A_N03] = new GasData(ID.GD_A_N03, ID.H2);
                        dicGasDatas[ID.GD_A_N04] = new GasData(ID.GD_A_N04, ID.H2);
                        dicGasDatas[ID.GD_A_N05] = new GasData(ID.GD_A_N05, ID.H2);
                        dicGasDatas[ID.GD_A_N06] = new GasData(ID.GD_A_N06, ID.H2);
                        dicGasDatas[ID.GD_A_O01] = new GasData(ID.GD_A_O01, ID.O2, GasData.VauleTypes.Divide10);
                        dicGasDatas[ID.GD_A_O02] = new GasData(ID.GD_A_O02, ID.O2, GasData.VauleTypes.Divide10);
                        dicGasDatas[ID.GD_A_O03] = new GasData(ID.GD_A_O03, ID.O2, GasData.VauleTypes.Divide10);
                        dicGasDatas[ID.GD_A_O04] = new GasData(ID.GD_A_O04, ID.O2, GasData.VauleTypes.Divide10);
                        //dicGasDatas[ID.GD_A_D01] = new GasData(ID.GD_A_D01, ID.CL2, GasData.VauleTypes.Divide100);    // 센서명 중복으로 인한 주석처리 - 20260203
                        dicGasDatas[ID.GD_A_D01] = new GasData(ID.GD_A_D01, ID.O2, GasData.VauleTypes.Divide10);        // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_A_D02] = new GasData(ID.GD_A_D02, ID.CL2, GasData.VauleTypes.Divide100);
                        dicGasDatas[ID.GD_A_H09] = new GasData(ID.GD_A_H09, ID.H2);
                        dicGasDatas[ID.GD_A_H10] = new GasData(ID.GD_A_H10, ID.H2);
                        dicGasDatas[ID.GD_A_H11] = new GasData(ID.GD_A_H11, ID.H2);
                        dicGasDatas[ID.GD_A_H12] = new GasData(ID.GD_A_H12, ID.H2);
                        dicGasDatas[ID.GD_A_H13] = new GasData(ID.GD_A_H13, ID.H2);

                        dicGasDatas[ID.GD_A_L18] = new GasData(ID.GD_A_L18, ID.HF, GasData.VauleTypes.Divide10);        // 신규 센서 - 20260304
                        dicGasDatas[ID.GD_A_L21] = new GasData(ID.GD_A_L21, ID.HNO3, GasData.VauleTypes.Divide10);      // 신규 센서 - 20260304
                        dicGasDatas[ID.GD_A_L22] = new GasData(ID.GD_A_L22, ID.O2, GasData.VauleTypes.Divide10);        // 신규 센서 - 20260304
                    }


                }
                else if (this.Type == Types.Device2)
                {
                    dicGasDatas[ID.GD_A_M01] = new GasData(ID.GD_A_M01, ID.LPG);
                    dicGasDatas[ID.GD_A_M02] = new GasData(ID.GD_A_M02, ID.LPG);
                    dicGasDatas[ID.GD_A_M03] = new GasData(ID.GD_A_M03, ID.CO);
                }
                else
                    return;

                if (FC == ID.FC_ReadInputRegister)
                {
                    if (this.Type == Types.Device1)
                    {
                        if (arrData.Length != ID.A_Dev1_Register_Length1 * nRegisterLeng &&
                            arrData.Length != ID.A_Dev1_Register_Length2 * nRegisterLeng)
                            return;

                        if (arrData.Length == ID.A_Dev1_Register_Length1 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_A_B01].SetVale(arrData, 0);
                            dicGasDatas[ID.GD_A_B02].SetVale(arrData, 1);
                            dicGasDatas[ID.GD_A_B03].SetVale(arrData, 2);
                            dicGasDatas[ID.GD_A_B04].SetVale(arrData, 3);

                            dicGasDatas[ID.GD_A_A01].SetVale(arrData, 11);
                            dicGasDatas[ID.GD_A_A02].SetVale(arrData, 12);
                            dicGasDatas[ID.GD_A_A03].SetVale(arrData, 13);
                            dicGasDatas[ID.GD_A_A04].SetVale(arrData, 14);

                            dicGasDatas[ID.GD_A_C01].SetVale(arrData, 24);
                            dicGasDatas[ID.GD_A_C02].SetVale(arrData, 25);
                            dicGasDatas[ID.GD_A_C03].SetVale(arrData, 26);
                            dicGasDatas[ID.GD_A_C04].SetVale(arrData, 27);
                            dicGasDatas[ID.GD_A_C05].SetVale(arrData, 28);
                            dicGasDatas[ID.GD_A_C06].SetVale(arrData, 29);
                            dicGasDatas[ID.GD_A_C07].SetVale(arrData, 30);

                            dicGasDatas[ID.GD_A_E01].SetVale(arrData, 46);
                            dicGasDatas[ID.GD_A_E02].SetVale(arrData, 47);
                            dicGasDatas[ID.GD_A_E03].SetVale(arrData, 48);
                            dicGasDatas[ID.GD_A_E04].SetVale(arrData, 49);
                            dicGasDatas[ID.GD_A_E05].SetVale(arrData, 50);
                            dicGasDatas[ID.GD_A_E06].SetVale(arrData, 51);
                            dicGasDatas[ID.GD_A_E07].SetVale(arrData, 52);
                            dicGasDatas[ID.GD_A_E08].SetVale(arrData, 53);
                            dicGasDatas[ID.GD_A_E09].SetVale(arrData, 54);
                            dicGasDatas[ID.GD_A_E10].SetVale(arrData, 55);

                            dicGasDatas[ID.GD_A_F01].SetVale(arrData, 64);
                            dicGasDatas[ID.GD_A_F02].SetVale(arrData, 65);
                            dicGasDatas[ID.GD_A_F03].SetVale(arrData, 66);
                            dicGasDatas[ID.GD_A_F04].SetVale(arrData, 67);

                            dicGasDatas[ID.GD_A_H01].SetVale(arrData, 73);
                            dicGasDatas[ID.GD_A_H02].SetVale(arrData, 74);
                            dicGasDatas[ID.GD_A_H03].SetVale(arrData, 75);
                            dicGasDatas[ID.GD_A_H04].SetVale(arrData, 76);
                            dicGasDatas[ID.GD_A_H05].SetVale(arrData, 77);
                            dicGasDatas[ID.GD_A_H06].SetVale(arrData, 78);
                            dicGasDatas[ID.GD_A_H07].SetVale(arrData, 79);
                            dicGasDatas[ID.GD_A_H08].SetVale(arrData, 80);

                            dicGasDatas[ID.GD_A_I01].SetVale(arrData, 88);
                            dicGasDatas[ID.GD_A_I02].SetVale(arrData, 89);

                            dicGasDatas[ID.GD_A_J01].SetVale(arrData, 97);
                        }
                        else if (arrData.Length == ID.A_Dev1_Register_Length2 * nRegisterLeng)
                        {
                            dicGasDatas[ID.GD_A_K01].SetVale(arrData, 6);
                            dicGasDatas[ID.GD_A_K01].SetVale(arrData, 7);
                            dicGasDatas[ID.GD_A_K01].SetVale(arrData, 9);

                            dicGasDatas[ID.GD_A_L01].SetVale(arrData, 16);
                            dicGasDatas[ID.GD_A_L02].SetVale(arrData, 17);
                            dicGasDatas[ID.GD_A_L03].SetVale(arrData, 18);
                            dicGasDatas[ID.GD_A_L04].SetVale(arrData, 19);
                            dicGasDatas[ID.GD_A_L05].SetVale(arrData, 20);
                            dicGasDatas[ID.GD_A_L06].SetVale(arrData, 21);
                            dicGasDatas[ID.GD_A_L07].SetVale(arrData, 22);
                            dicGasDatas[ID.GD_A_L08].SetVale(arrData, 23);
                            dicGasDatas[ID.GD_A_L09].SetVale(arrData, 24);
                            dicGasDatas[ID.GD_A_L10].SetVale(arrData, 25);
                            dicGasDatas[ID.GD_A_L11].SetVale(arrData, 26);
                            dicGasDatas[ID.GD_A_L12].SetVale(arrData, 27);
                            dicGasDatas[ID.GD_A_L13].SetVale(arrData, 28);
                            dicGasDatas[ID.GD_A_L14].SetVale(arrData, 29);
                            dicGasDatas[ID.GD_A_L15].SetVale(arrData, 30);
                            dicGasDatas[ID.GD_A_L16].SetVale(arrData, 31);
                            dicGasDatas[ID.GD_A_L17].SetVale(arrData, 32);
                            dicGasDatas[ID.GD_A_L20].SetVale(arrData, 33);      // 신규 센서 - 20251106

                            dicGasDatas[ID.GD_A_E11].SetVale(arrData, 35);

                            dicGasDatas[ID.GD_A_G01].SetVale(arrData, 36);
                            dicGasDatas[ID.GD_A_G02].SetVale(arrData, 37);
                            dicGasDatas[ID.GD_A_G03].SetVale(arrData, 38);
                            dicGasDatas[ID.GD_A_G04].SetVale(arrData, 39);
                            dicGasDatas[ID.GD_A_G05].SetVale(arrData, 40);
                            dicGasDatas[ID.GD_A_G06].SetVale(arrData, 41);
                            dicGasDatas[ID.GD_A_G07].SetVale(arrData, 42);
                            dicGasDatas[ID.GD_A_G08].SetVale(arrData, 43);
                            dicGasDatas[ID.GD_A_G09].SetVale(arrData, 44);
                            dicGasDatas[ID.GD_A_G10].SetVale(arrData, 45);
                            dicGasDatas[ID.GD_A_G11].SetVale(arrData, 46);
                            dicGasDatas[ID.GD_A_G12].SetVale(arrData, 47);
                            dicGasDatas[ID.GD_A_G13].SetVale(arrData, 48);
                            dicGasDatas[ID.GD_A_G14].SetVale(arrData, 49);

                            dicGasDatas[ID.GD_A_N01].SetVale(arrData, 52);
                            dicGasDatas[ID.GD_A_N02].SetVale(arrData, 53);
                            dicGasDatas[ID.GD_A_N03].SetVale(arrData, 54);
                            dicGasDatas[ID.GD_A_N04].SetVale(arrData, 55);
                            dicGasDatas[ID.GD_A_N05].SetVale(arrData, 56);
                            dicGasDatas[ID.GD_A_N06].SetVale(arrData, 57);

                            dicGasDatas[ID.GD_A_O01].SetVale(arrData, 63);
                            dicGasDatas[ID.GD_A_O02].SetVale(arrData, 64);
                            dicGasDatas[ID.GD_A_O03].SetVale(arrData, 65);
                            dicGasDatas[ID.GD_A_O04].SetVale(arrData, 66);

                            dicGasDatas[ID.GD_A_D01].SetVale(arrData, 72);    // 신규 센서 - 20251106
                            dicGasDatas[ID.GD_A_D02].SetVale(arrData, 73);

                            dicGasDatas[ID.GD_A_H09].SetVale(arrData, 77);
                            dicGasDatas[ID.GD_A_H10].SetVale(arrData, 78);
                            dicGasDatas[ID.GD_A_H11].SetVale(arrData, 79);
                            dicGasDatas[ID.GD_A_H12].SetVale(arrData, 80);
                            dicGasDatas[ID.GD_A_H13].SetVale(arrData, 81);

                            dicGasDatas[ID.GD_A_L18].SetVale(arrData, 85);
                            dicGasDatas[ID.GD_A_L21].SetVale(arrData, 86);
                            dicGasDatas[ID.GD_A_L22].SetVale(arrData, 87);
                        }
                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (arrData.Length != ID.A_Dev2_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_A_M01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_A_M02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_A_M03].SetVale(arrData, 2);
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
                        if (bitArray.Length < ID.A_Dev1_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_A_B01].HiAlarm = bitArray[0];
                        dicGasDatas[ID.GD_A_B01].HiHighAlarm = bitArray[1];
                        //dicGasDatas[ID.GD_A_B01].FaultAlarm = bitArray[3];

                        dicGasDatas[ID.GD_A_B02].HiAlarm = bitArray[8];
                        dicGasDatas[ID.GD_A_B02].HiHighAlarm = bitArray[9];
                        //dicGasDatas[ID.GD_A_B02].FaultAlarm = bitArray[11];

                        dicGasDatas[ID.GD_A_B03].HiAlarm = bitArray[16];
                        dicGasDatas[ID.GD_A_B03].HiHighAlarm = bitArray[17];
                        //dicGasDatas[ID.GD_A_B03].FaultAlarm = bitArray[19];

                        dicGasDatas[ID.GD_A_B04].HiAlarm = bitArray[24];
                        dicGasDatas[ID.GD_A_B04].HiHighAlarm = bitArray[25];
                        //dicGasDatas[ID.GD_A_B04].FaultAlarm = bitArray[27];



                        dicGasDatas[ID.GD_A_A01].HiAlarm = bitArray[88];
                        dicGasDatas[ID.GD_A_A01].HiHighAlarm = bitArray[89];
                        //dicGasDatas[ID.GD_A_A01].FaultAlarm = bitArray[91];

                        dicGasDatas[ID.GD_A_A02].HiAlarm = bitArray[96];
                        dicGasDatas[ID.GD_A_A02].HiHighAlarm = bitArray[97];
                        //dicGasDatas[ID.GD_A_A02].FaultAlarm = bitArray[99];

                        dicGasDatas[ID.GD_A_A03].HiAlarm = bitArray[104];
                        dicGasDatas[ID.GD_A_A03].HiHighAlarm = bitArray[105];
                        //dicGasDatas[ID.GD_A_A03].FaultAlarm = bitArray[107];

                        dicGasDatas[ID.GD_A_A04].HiAlarm = bitArray[112];
                        dicGasDatas[ID.GD_A_A04].HiHighAlarm = bitArray[113];
                        //dicGasDatas[ID.GD_A_A04].FaultAlarm = bitArray[115];


                        dicGasDatas[ID.GD_A_C01].LoAlarm = bitArray[192];
                        dicGasDatas[ID.GD_A_C01].LoLowAlarm = bitArray[193];
                        dicGasDatas[ID.GD_A_C01].HiAlarm = bitArray[194];
                        //dicGasDatas[ID.GD_A_C01].FaultAlarm = bitArray[195];

                        dicGasDatas[ID.GD_A_C02].LoAlarm = bitArray[200];
                        dicGasDatas[ID.GD_A_C02].LoLowAlarm = bitArray[201];
                        dicGasDatas[ID.GD_A_C02].HiAlarm = bitArray[202];
                        //dicGasDatas[ID.GD_A_C02].FaultAlarm = bitArray[203];

                        dicGasDatas[ID.GD_A_C03].LoAlarm = bitArray[208];
                        dicGasDatas[ID.GD_A_C03].LoLowAlarm = bitArray[209];
                        dicGasDatas[ID.GD_A_C03].HiAlarm = bitArray[210];
                        //dicGasDatas[ID.GD_A_C03].FaultAlarm = bitArray[211];

                        dicGasDatas[ID.GD_A_C04].LoAlarm = bitArray[216];
                        dicGasDatas[ID.GD_A_C04].LoLowAlarm = bitArray[217];
                        dicGasDatas[ID.GD_A_C04].HiAlarm = bitArray[218];
                        //dicGasDatas[ID.GD_A_C04].FaultAlarm = bitArray[219];

                        dicGasDatas[ID.GD_A_C05].LoAlarm = bitArray[224];
                        dicGasDatas[ID.GD_A_C05].LoLowAlarm = bitArray[225];
                        dicGasDatas[ID.GD_A_C05].HiAlarm = bitArray[226];
                        //dicGasDatas[ID.GD_A_C05].FaultAlarm = bitArray[227];

                        dicGasDatas[ID.GD_A_C06].LoAlarm = bitArray[232];
                        dicGasDatas[ID.GD_A_C06].LoLowAlarm = bitArray[233];
                        dicGasDatas[ID.GD_A_C06].HiAlarm = bitArray[234];
                        //dicGasDatas[ID.GD_A_C06].FaultAlarm = bitArray[235];

                        dicGasDatas[ID.GD_A_C07].LoAlarm = bitArray[240];
                        dicGasDatas[ID.GD_A_C07].LoLowAlarm = bitArray[241];
                        dicGasDatas[ID.GD_A_C07].HiAlarm = bitArray[242];
                        //dicGasDatas[ID.GD_A_C07].FaultAlarm = bitArray[243];




                        dicGasDatas[ID.GD_A_E01].HiAlarm = bitArray[368];
                        dicGasDatas[ID.GD_A_E01].HiHighAlarm = bitArray[369];
                        //dicGasDatas[ID.GD_A_E01].FaultAlarm = bitArray[371];

                        dicGasDatas[ID.GD_A_E02].HiAlarm = bitArray[376];
                        dicGasDatas[ID.GD_A_E02].HiHighAlarm = bitArray[377];
                        //dicGasDatas[ID.GD_A_E02].FaultAlarm = bitArray[379];

                        dicGasDatas[ID.GD_A_E03].HiAlarm = bitArray[384];
                        dicGasDatas[ID.GD_A_E03].HiHighAlarm = bitArray[385];
                        //dicGasDatas[ID.GD_A_E03].FaultAlarm = bitArray[387];

                        dicGasDatas[ID.GD_A_E04].HiAlarm = bitArray[392];
                        dicGasDatas[ID.GD_A_E04].HiHighAlarm = bitArray[393];
                        //dicGasDatas[ID.GD_A_E04].FaultAlarm = bitArray[395];

                        dicGasDatas[ID.GD_A_E05].HiAlarm = bitArray[400];
                        dicGasDatas[ID.GD_A_E05].HiHighAlarm = bitArray[401];
                        //dicGasDatas[ID.GD_A_E05].FaultAlarm = bitArray[403];

                        dicGasDatas[ID.GD_A_E06].HiAlarm = bitArray[408];
                        dicGasDatas[ID.GD_A_E06].HiHighAlarm = bitArray[409];
                        //dicGasDatas[ID.GD_A_E06].FaultAlarm = bitArray[411];

                        dicGasDatas[ID.GD_A_E07].HiAlarm = bitArray[416];
                        dicGasDatas[ID.GD_A_E07].HiHighAlarm = bitArray[417];
                        //dicGasDatas[ID.GD_A_E07].FaultAlarm = bitArray[419];

                        dicGasDatas[ID.GD_A_E08].HiAlarm = bitArray[424];
                        dicGasDatas[ID.GD_A_E08].HiHighAlarm = bitArray[425];
                        //dicGasDatas[ID.GD_A_E08].FaultAlarm = bitArray[427];

                        dicGasDatas[ID.GD_A_E09].HiAlarm = bitArray[432];
                        dicGasDatas[ID.GD_A_E09].HiHighAlarm = bitArray[433];
                        //dicGasDatas[ID.GD_A_E09].FaultAlarm = bitArray[435];

                        dicGasDatas[ID.GD_A_E10].HiAlarm = bitArray[440];
                        dicGasDatas[ID.GD_A_E10].HiHighAlarm = bitArray[441];
                        //dicGasDatas[ID.GD_A_E10].FaultAlarm = bitArray[443];



                        dicGasDatas[ID.GD_A_F01].LoAlarm = bitArray[512];
                        dicGasDatas[ID.GD_A_F01].LoLowAlarm = bitArray[513];
                        dicGasDatas[ID.GD_A_F01].HiAlarm = bitArray[514];
                        //dicGasDatas[ID.GD_A_F01].FaultAlarm = bitArray[515];

                        dicGasDatas[ID.GD_A_F02].LoAlarm = bitArray[520];
                        dicGasDatas[ID.GD_A_F02].LoLowAlarm = bitArray[521];
                        dicGasDatas[ID.GD_A_F02].HiAlarm = bitArray[522];
                        //dicGasDatas[ID.GD_A_F02].FaultAlarm = bitArray[523];

                        dicGasDatas[ID.GD_A_F03].LoAlarm = bitArray[528];
                        dicGasDatas[ID.GD_A_F03].LoLowAlarm = bitArray[529];
                        dicGasDatas[ID.GD_A_F03].HiAlarm = bitArray[530];
                        //dicGasDatas[ID.GD_A_F03].FaultAlarm = bitArray[531];

                        dicGasDatas[ID.GD_A_F04].LoAlarm = bitArray[536];
                        dicGasDatas[ID.GD_A_F04].LoLowAlarm = bitArray[537];
                        dicGasDatas[ID.GD_A_F04].HiAlarm = bitArray[538];
                        //dicGasDatas[ID.GD_A_F04].FaultAlarm = bitArray[539];




                        dicGasDatas[ID.GD_A_H01].HiAlarm = bitArray[584];
                        dicGasDatas[ID.GD_A_H01].HiHighAlarm = bitArray[585];
                        //dicGasDatas[ID.GD_A_H01].FaultAlarm = bitArray[587];

                        dicGasDatas[ID.GD_A_H02].HiAlarm = bitArray[592];
                        dicGasDatas[ID.GD_A_H02].HiHighAlarm = bitArray[593];
                        //dicGasDatas[ID.GD_A_H02].FaultAlarm = bitArray[595];

                        dicGasDatas[ID.GD_A_H03].HiAlarm = bitArray[600];
                        dicGasDatas[ID.GD_A_H03].HiHighAlarm = bitArray[601];
                        //dicGasDatas[ID.GD_A_H03].FaultAlarm = bitArray[603];

                        dicGasDatas[ID.GD_A_H04].HiAlarm = bitArray[608];
                        dicGasDatas[ID.GD_A_H04].HiHighAlarm = bitArray[609];
                        //dicGasDatas[ID.GD_A_H04].FaultAlarm = bitArray[611];

                        dicGasDatas[ID.GD_A_H05].HiAlarm = bitArray[616];
                        dicGasDatas[ID.GD_A_H05].HiHighAlarm = bitArray[617];
                        //dicGasDatas[ID.GD_A_H05].FaultAlarm = bitArray[619];

                        dicGasDatas[ID.GD_A_H06].HiAlarm = bitArray[624];
                        dicGasDatas[ID.GD_A_H06].HiHighAlarm = bitArray[625];
                        //dicGasDatas[ID.GD_A_H06].FaultAlarm = bitArray[627];

                        dicGasDatas[ID.GD_A_H07].HiAlarm = bitArray[632];
                        dicGasDatas[ID.GD_A_H07].HiHighAlarm = bitArray[633];
                        //dicGasDatas[ID.GD_A_H07].FaultAlarm = bitArray[635];

                        dicGasDatas[ID.GD_A_H08].HiAlarm = bitArray[640];
                        dicGasDatas[ID.GD_A_H08].HiHighAlarm = bitArray[641];
                        //dicGasDatas[ID.GD_A_H08].FaultAlarm = bitArray[643];



                        dicGasDatas[ID.GD_A_I01].HiAlarm = bitArray[704];
                        dicGasDatas[ID.GD_A_I01].HiHighAlarm = bitArray[705];
                        //dicGasDatas[ID.GD_A_I01].FaultAlarm = bitArray[707];

                        dicGasDatas[ID.GD_A_I02].LoAlarm = bitArray[712];
                        dicGasDatas[ID.GD_A_I02].LoLowAlarm = bitArray[713];
                        dicGasDatas[ID.GD_A_I02].HiAlarm = bitArray[714];
                        //dicGasDatas[ID.GD_A_I02].FaultAlarm = bitArray[715];




                        dicGasDatas[ID.GD_A_J01].HiAlarm = bitArray[776];
                        dicGasDatas[ID.GD_A_J01].HiHighAlarm = bitArray[777];
                        //dicGasDatas[ID.GD_A_J01].FaultAlarm = bitArray[779];
                        dicGasDatas[ID.GD_A_J01].PressHiAlarm = bitArray[841];
                        dicGasDatas[ID.GD_A_J01].PressLoAlarm = bitArray[842];





                        dicGasDatas[ID.GD_A_K01].HiAlarm = bitArray[848];
                        dicGasDatas[ID.GD_A_K01].HiHighAlarm = bitArray[849];
                        //dicGasDatas[ID.GD_A_K01].FaultAlarm = bitArray[851];

                        dicGasDatas[ID.GD_A_K02].HiAlarm = bitArray[856];
                        dicGasDatas[ID.GD_A_K02].HiHighAlarm = bitArray[857];
                        //dicGasDatas[ID.GD_A_K02].FaultAlarm = bitArray[859];

                        dicGasDatas[ID.GD_A_K03].PressHiAlarm = bitArray[864];





                        dicGasDatas[ID.GD_A_L01].HiAlarm = bitArray[928];
                        dicGasDatas[ID.GD_A_L01].HiHighAlarm = bitArray[929];
                        //dicGasDatas[ID.GD_A_L01].FaultAlarm = bitArray[931];

                        dicGasDatas[ID.GD_A_L02].HiAlarm = bitArray[936];
                        dicGasDatas[ID.GD_A_L02].HiHighAlarm = bitArray[937];
                        //dicGasDatas[ID.GD_A_L02].FaultAlarm = bitArray[939];

                        dicGasDatas[ID.GD_A_L03].HiAlarm = bitArray[944];
                        dicGasDatas[ID.GD_A_L03].HiHighAlarm = bitArray[945];
                        //dicGasDatas[ID.GD_A_L03].FaultAlarm = bitArray[947];

                        dicGasDatas[ID.GD_A_L04].HiAlarm = bitArray[952];
                        dicGasDatas[ID.GD_A_L04].HiHighAlarm = bitArray[953];
                        //dicGasDatas[ID.GD_A_L04].FaultAlarm = bitArray[955];

                        dicGasDatas[ID.GD_A_L05].HiAlarm = bitArray[960];
                        dicGasDatas[ID.GD_A_L05].HiHighAlarm = bitArray[961];
                        //dicGasDatas[ID.GD_A_L05].FaultAlarm = bitArray[963];

                        dicGasDatas[ID.GD_A_L06].HiAlarm = bitArray[968];
                        dicGasDatas[ID.GD_A_L06].HiHighAlarm = bitArray[969];
                        //dicGasDatas[ID.GD_A_L06].FaultAlarm = bitArray[971];

                        dicGasDatas[ID.GD_A_L07].HiAlarm = bitArray[976];
                        dicGasDatas[ID.GD_A_L07].HiHighAlarm = bitArray[977];
                        //dicGasDatas[ID.GD_A_L07].FaultAlarm = bitArray[979];

                        dicGasDatas[ID.GD_A_L08].HiAlarm = bitArray[984];
                        dicGasDatas[ID.GD_A_L08].HiHighAlarm = bitArray[985];
                        //dicGasDatas[ID.GD_A_L08].FaultAlarm = bitArray[987];

                        dicGasDatas[ID.GD_A_L09].HiAlarm = bitArray[992];
                        dicGasDatas[ID.GD_A_L09].HiHighAlarm = bitArray[993];
                        //dicGasDatas[ID.GD_A_L09].FaultAlarm = bitArray[995];

                        dicGasDatas[ID.GD_A_L10].HiAlarm = bitArray[1000];
                        dicGasDatas[ID.GD_A_L10].HiHighAlarm = bitArray[1001];
                        //dicGasDatas[ID.GD_A_L10].FaultAlarm = bitArray[1003];

                        dicGasDatas[ID.GD_A_L11].HiAlarm = bitArray[1008];
                        dicGasDatas[ID.GD_A_L11].HiHighAlarm = bitArray[1009];
                        //dicGasDatas[ID.GD_A_L11].FaultAlarm = bitArray[1011];

                        dicGasDatas[ID.GD_A_L12].HiAlarm = bitArray[1016];
                        dicGasDatas[ID.GD_A_L12].HiHighAlarm = bitArray[1017];
                        //dicGasDatas[ID.GD_A_L12].FaultAlarm = bitArray[1019];

                        dicGasDatas[ID.GD_A_L13].HiAlarm = bitArray[1024];
                        //dicGasDatas[ID.GD_A_L13].HiHighAlarm = bitArray[1025];
                        dicGasDatas[ID.GD_A_L13].FaultAlarm = bitArray[1027];

                        dicGasDatas[ID.GD_A_L14].HiAlarm = bitArray[1032];
                        dicGasDatas[ID.GD_A_L14].HiHighAlarm = bitArray[1033];
                        //dicGasDatas[ID.GD_A_L14].FaultAlarm = bitArray[1035];

                        dicGasDatas[ID.GD_A_L15].HiAlarm = bitArray[1040];
                        dicGasDatas[ID.GD_A_L15].HiHighAlarm = bitArray[1041];
                        //dicGasDatas[ID.GD_A_L15].FaultAlarm = bitArray[1043];

                        dicGasDatas[ID.GD_A_L16].HiAlarm = bitArray[1048];
                        dicGasDatas[ID.GD_A_L16].HiHighAlarm = bitArray[1049];
                        //dicGasDatas[ID.GD_A_L16].FaultAlarm = bitArray[1051];

                        dicGasDatas[ID.GD_A_L17].HiAlarm = bitArray[1056];
                        dicGasDatas[ID.GD_A_L17].HiHighAlarm = bitArray[1057];
                        //dicGasDatas[ID.GD_A_L17].FaultAlarm = bitArray[1059];


                        dicGasDatas[ID.GD_A_L20].HiAlarm = bitArray[1064];              // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_A_L20].HiHighAlarm = bitArray[1065];          // 신규 센서 - 20251106


                        dicGasDatas[ID.GD_A_E11].HiAlarm = bitArray[1080];
                        dicGasDatas[ID.GD_A_E11].HiHighAlarm = bitArray[1081];
                        //dicGasDatas[ID.GD_A_E11].FaultAlarm = bitArray[1083];




                        dicGasDatas[ID.GD_A_G01].HiAlarm = bitArray[1088];
                        dicGasDatas[ID.GD_A_G01].HiHighAlarm = bitArray[1089];
                        //dicGasDatas[ID.GD_A_G01].FaultAlarm = bitArray[1091];

                        dicGasDatas[ID.GD_A_G02].HiAlarm = bitArray[1096];
                        dicGasDatas[ID.GD_A_G02].HiHighAlarm = bitArray[1097];
                        //dicGasDatas[ID.GD_A_G02].FaultAlarm = bitArray[1099];

                        dicGasDatas[ID.GD_A_G03].HiAlarm = bitArray[1104];
                        dicGasDatas[ID.GD_A_G03].HiHighAlarm = bitArray[1105];
                        //dicGasDatas[ID.GD_A_G03].FaultAlarm = bitArray[1107];

                        dicGasDatas[ID.GD_A_G04].HiAlarm = bitArray[1112];
                        dicGasDatas[ID.GD_A_G04].HiHighAlarm = bitArray[1113];
                        //dicGasDatas[ID.GD_A_G04].FaultAlarm = bitArray[1115];

                        dicGasDatas[ID.GD_A_G05].HiAlarm = bitArray[1120];
                        dicGasDatas[ID.GD_A_G05].HiHighAlarm = bitArray[1121];
                        //dicGasDatas[ID.GD_A_G05].FaultAlarm = bitArray[1123];

                        dicGasDatas[ID.GD_A_G06].HiAlarm = bitArray[1128];
                        dicGasDatas[ID.GD_A_G06].HiHighAlarm = bitArray[1129];
                        //dicGasDatas[ID.GD_A_G06].FaultAlarm = bitArray[1131];

                        dicGasDatas[ID.GD_A_G07].HiAlarm = bitArray[1136];
                        dicGasDatas[ID.GD_A_G07].HiHighAlarm = bitArray[1137];
                        //dicGasDatas[ID.GD_A_G07].FaultAlarm = bitArray[1139];

                        dicGasDatas[ID.GD_A_G08].HiAlarm = bitArray[1144];
                        dicGasDatas[ID.GD_A_G08].HiHighAlarm = bitArray[1145];
                        //dicGasDatas[ID.GD_A_G08].FaultAlarm = bitArray[1147];

                        dicGasDatas[ID.GD_A_G09].HiAlarm = bitArray[1152];
                        dicGasDatas[ID.GD_A_G09].HiHighAlarm = bitArray[1153];
                        //dicGasDatas[ID.GD_A_G09].FaultAlarm = bitArray[1155];

                        dicGasDatas[ID.GD_A_G10].HiAlarm = bitArray[1160];
                        dicGasDatas[ID.GD_A_G10].HiHighAlarm = bitArray[1161];
                        //dicGasDatas[ID.GD_A_G10].FaultAlarm = bitArray[1163];

                        dicGasDatas[ID.GD_A_G11].HiAlarm = bitArray[1168];
                        dicGasDatas[ID.GD_A_G11].HiHighAlarm = bitArray[1169];
                        //dicGasDatas[ID.GD_A_G11].FaultAlarm = bitArray[1171];

                        dicGasDatas[ID.GD_A_G12].HiAlarm = bitArray[1176];
                        dicGasDatas[ID.GD_A_G12].HiHighAlarm = bitArray[1177];
                        //dicGasDatas[ID.GD_A_G12].FaultAlarm = bitArray[1179];

                        dicGasDatas[ID.GD_A_G13].HiAlarm = bitArray[1184];
                        dicGasDatas[ID.GD_A_G13].HiHighAlarm = bitArray[1185];
                        //dicGasDatas[ID.GD_A_G13].FaultAlarm = bitArray[1187];

                        dicGasDatas[ID.GD_A_G14].HiAlarm = bitArray[1192];
                        dicGasDatas[ID.GD_A_G14].HiHighAlarm = bitArray[1193];
                        //dicGasDatas[ID.GD_A_G14].FaultAlarm = bitArray[1195];





                        dicGasDatas[ID.GD_A_N01].HiAlarm = bitArray[1216];
                        dicGasDatas[ID.GD_A_N01].HiHighAlarm = bitArray[1217];
                        //dicGasDatas[ID.GD_A_N01].FaultAlarm = bitArray[1219];

                        dicGasDatas[ID.GD_A_N02].HiAlarm = bitArray[1224];
                        dicGasDatas[ID.GD_A_N02].HiHighAlarm = bitArray[1225];
                        //dicGasDatas[ID.GD_A_N02].FaultAlarm = bitArray[1227];

                        dicGasDatas[ID.GD_A_N03].HiAlarm = bitArray[1232];
                        dicGasDatas[ID.GD_A_N03].HiHighAlarm = bitArray[1233];
                        //dicGasDatas[ID.GD_A_N03].FaultAlarm = bitArray[1235];

                        dicGasDatas[ID.GD_A_N04].HiAlarm = bitArray[1240];
                        dicGasDatas[ID.GD_A_N04].HiHighAlarm = bitArray[1241];
                        //dicGasDatas[ID.GD_A_N04].FaultAlarm = bitArray[1243];

                        dicGasDatas[ID.GD_A_N05].HiAlarm = bitArray[1248];
                        dicGasDatas[ID.GD_A_N05].HiHighAlarm = bitArray[1249];
                        //dicGasDatas[ID.GD_A_N05].FaultAlarm = bitArray[1251];

                        dicGasDatas[ID.GD_A_N06].HiAlarm = bitArray[1256];
                        dicGasDatas[ID.GD_A_N06].HiHighAlarm = bitArray[1257];
                        //dicGasDatas[ID.GD_A_N06].FaultAlarm = bitArray[1259];





                        dicGasDatas[ID.GD_A_O01].LoAlarm = bitArray[1304];
                        dicGasDatas[ID.GD_A_O01].LoLowAlarm = bitArray[1305];
                        dicGasDatas[ID.GD_A_O01].HiAlarm = bitArray[1306];
                        //dicGasDatas[ID.GD_A_O01].FaultAlarm = bitArray[1307];

                        dicGasDatas[ID.GD_A_O02].LoAlarm = bitArray[1312];
                        dicGasDatas[ID.GD_A_O02].LoLowAlarm = bitArray[1313];
                        dicGasDatas[ID.GD_A_O02].HiAlarm = bitArray[1314];
                        //dicGasDatas[ID.GD_A_O02].FaultAlarm = bitArray[1315];

                        dicGasDatas[ID.GD_A_O03].LoAlarm = bitArray[1320];
                        dicGasDatas[ID.GD_A_O03].LoLowAlarm = bitArray[1321];
                        dicGasDatas[ID.GD_A_O03].HiAlarm = bitArray[1322];
                        //dicGasDatas[ID.GD_A_O03].FaultAlarm = bitArray[1323];

                        dicGasDatas[ID.GD_A_O04].LoAlarm = bitArray[1328];
                        dicGasDatas[ID.GD_A_O04].LoLowAlarm = bitArray[1329];
                        dicGasDatas[ID.GD_A_O04].HiAlarm = bitArray[1330];
                        //dicGasDatas[ID.GD_A_O04].FaultAlarm = bitArray[1331];




                        dicGasDatas[ID.GD_A_D01].LoAlarm = bitArray[1376];          // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_A_D01].LoLowAlarm = bitArray[1377];       // 신규 센서 - 20251106


                        dicGasDatas[ID.GD_A_D02].HiAlarm = bitArray[1384];
                        dicGasDatas[ID.GD_A_D02].HiHighAlarm = bitArray[1385];
                        //dicGasDatas[ID.GD_A_D02].FaultAlarm = bitArray[1387];



                        dicGasDatas[ID.GD_A_H09].HiAlarm = bitArray[1416];
                        dicGasDatas[ID.GD_A_H09].HiHighAlarm = bitArray[1417];
                        //dicGasDatas[ID.GD_A_H09].FaultAlarm = bitArray[1419];

                        dicGasDatas[ID.GD_A_H10].HiAlarm = bitArray[1424];
                        dicGasDatas[ID.GD_A_H10].HiHighAlarm = bitArray[1425];
                        //dicGasDatas[ID.GD_A_H10].FaultAlarm = bitArray[1427];

                        dicGasDatas[ID.GD_A_H11].HiAlarm = bitArray[1432];
                        dicGasDatas[ID.GD_A_H11].HiHighAlarm = bitArray[1433];
                        //dicGasDatas[ID.GD_A_H11].FaultAlarm = bitArray[1435];

                        dicGasDatas[ID.GD_A_H12].HiAlarm = bitArray[1440];
                        dicGasDatas[ID.GD_A_H12].HiHighAlarm = bitArray[1441];
                        //dicGasDatas[ID.GD_A_H12].FaultAlarm = bitArray[1443];

                        dicGasDatas[ID.GD_A_H13].HiAlarm = bitArray[1448];
                        dicGasDatas[ID.GD_A_H13].HiHighAlarm = bitArray[1449];
                        //dicGasDatas[ID.GD_A_H13].FaultAlarm = bitArray[1451];

                        dicGasDatas[ID.GD_A_L18].HiAlarm = bitArray[1480];              // 신규 센서 - 20260304
                        dicGasDatas[ID.GD_A_L18].HiHighAlarm = bitArray[1481];          // 신규 센서 - 20260304

                        dicGasDatas[ID.GD_A_L21].HiAlarm = bitArray[1488];              // 신규 센서 - 20260304
                        dicGasDatas[ID.GD_A_L21].HiHighAlarm = bitArray[1489];          // 신규 센서 - 20260304

                        dicGasDatas[ID.GD_A_L22].HiAlarm = bitArray[1496];              // 신규 센서 - 20260304
                        dicGasDatas[ID.GD_A_L22].HiHighAlarm = bitArray[1497];          // 신규 센서 - 20260304
                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (bitArray.Length < ID.A_Dev2_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_A_M01].HiAlarm = bitArray[0];
                        dicGasDatas[ID.GD_A_M01].HiHighAlarm = bitArray[1];
                        //dicGasDatas[ID.GD_A_M01].FaultAlarm = bitArray[3];

                        dicGasDatas[ID.GD_A_M02].HiAlarm = bitArray[8];
                        dicGasDatas[ID.GD_A_M02].HiHighAlarm = bitArray[9];
                        //dicGasDatas[ID.GD_A_M02].FaultAlarm = bitArray[11];

                        dicGasDatas[ID.GD_A_M03].HiAlarm = bitArray[72];
                        dicGasDatas[ID.GD_A_M03].HiHighAlarm = bitArray[73];
                        //dicGasDatas[ID.GD_A_M03].FaultAlarm = bitArray[75];                        
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
                    /*
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
                    */





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


                    /*
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
                    */

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
