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
    public class GasVProvider : ClientServiceProvider
    {
        public enum Types { Device1 = 0, Device2, Device3, Device4, Device5 }

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

        public GasVProvider(GasManager parentManager, Types type, string strIP, int nPort, DBDataManager dbDataManager, SopQueryManager sopQueryMgr, Dictionary<string, GasSensorData> dicGasSensors, string strSOPWebServerURL)
        {
            m_parentManager = parentManager;
            m_dbDataManager = dbDataManager;
            m_sopQueryMgr = sopQueryMgr;
            m_dicGasSensors = dicGasSensors;
            m_strSOPWebServerURL = strSOPWebServerURL;

            this.Type = type;
            this.IP = strIP;
            this.Port = nPort;

            this.DeviceName = "V_" + type;
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
                            nLength = (UInt16)ID.V_Dev1_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev1_Register_Length;

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device2)
                        {
                            nSlaveID = 0;

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev2_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev2_Register_Length;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device3)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev3_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev3_Register_Length;

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device4)
                        {
                            nSlaveID = 0;

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev4_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev4_Register_Length;

                             arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device5)
                        {
                            nSlaveID = 0;

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev5_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.V_Dev5_Register_Length;

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
                    dicGasDatas[ID.GD_V_A01] = new GasData(ID.GD_V_A01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_A02] = new GasData(ID.GD_V_A02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_A03] = new GasData(ID.GD_V_A03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_A04] = new GasData(ID.GD_V_A04, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_B01] = new GasData(ID.GD_V_B01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_B02] = new GasData(ID.GD_V_B02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_B03] = new GasData(ID.GD_V_B03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_B04] = new GasData(ID.GD_V_B04, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_B05] = new GasData(ID.GD_V_B05, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_B06] = new GasData(ID.GD_V_B06, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_C01] = new GasData(ID.GD_V_C01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_C02] = new GasData(ID.GD_V_C02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_C03] = new GasData(ID.GD_V_C03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_C04] = new GasData(ID.GD_V_C04, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_D01] = new GasData(ID.GD_V_D01, ID.CO2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_D02] = new GasData(ID.GD_V_D02, ID.CO2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_D03] = new GasData(ID.GD_V_D03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_D04] = new GasData(ID.GD_V_D04, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_F01] = new GasData(ID.GD_V_F01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F02] = new GasData(ID.GD_V_F02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F03] = new GasData(ID.GD_V_F03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F04] = new GasData(ID.GD_V_F04, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F05] = new GasData(ID.GD_V_F05, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F06] = new GasData(ID.GD_V_F06, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F07] = new GasData(ID.GD_V_F07, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F08] = new GasData(ID.GD_V_F08, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F09] = new GasData(ID.GD_V_F09, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F10] = new GasData(ID.GD_V_F10, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_F11] = new GasData(ID.GD_V_F11, ID.O2, GasData.VauleTypes.Divide10);
                }
                else if (this.Type == Types.Device2)
                {
                    dicGasDatas[ID.GD_V_G01] = new GasData(ID.GD_V_G01, ID.LNG);
                    dicGasDatas[ID.GD_V_G02] = new GasData(ID.GD_V_G02, ID.LNG);
                    dicGasDatas[ID.GD_V_G03] = new GasData(ID.GD_V_G03, ID.LNG);
                    dicGasDatas[ID.GD_V_G04] = new GasData(ID.GD_V_G04, ID.LNG);
                }
                else if (this.Type == Types.Device3)
                {
                    dicGasDatas[ID.GD_V_H01] = new GasData(ID.GD_V_H01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_H02] = new GasData(ID.GD_V_H02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_H03] = new GasData(ID.GD_V_H03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_H04] = new GasData(ID.GD_V_H04, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_H05] = new GasData(ID.GD_V_H05, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_H06] = new GasData(ID.GD_V_H06, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_H07] = new GasData(ID.GD_V_H07, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_H08] = new GasData(ID.GD_V_H08, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_I01] = new GasData(ID.GD_V_I01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_I02] = new GasData(ID.GD_V_I02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_I03] = new GasData(ID.GD_V_I03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_I04] = new GasData(ID.GD_V_I04, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_I05] = new GasData(ID.GD_V_I05, ID.O2, GasData.VauleTypes.Divide10);        // 신규 센서 - 20251106

                    dicGasDatas[ID.GD_V_J01] = new GasData(ID.GD_V_J01, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_K01] = new GasData(ID.GD_V_K01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_K02] = new GasData(ID.GD_V_K02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_K03] = new GasData(ID.GD_V_K03, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_L01] = new GasData(ID.GD_V_L01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_L02] = new GasData(ID.GD_V_L02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_L03] = new GasData(ID.GD_V_L03, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_M01] = new GasData(ID.GD_V_M01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_M02] = new GasData(ID.GD_V_M02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_M03] = new GasData(ID.GD_V_M03, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_U01] = new GasData(ID.GD_V_U01, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_N01] = new GasData(ID.GD_V_N01, ID.H2);
                    dicGasDatas[ID.GD_V_N02] = new GasData(ID.GD_V_N02, ID.H2);
                    dicGasDatas[ID.GD_V_N03] = new GasData(ID.GD_V_N03, ID.H2);
                    dicGasDatas[ID.GD_V_N04] = new GasData(ID.GD_V_N04, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_N05] = new GasData(ID.GD_V_N05, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_V01] = new GasData(ID.GD_V_V01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_V02] = new GasData(ID.GD_V_V02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_V03] = new GasData(ID.GD_V_V03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_V04] = new GasData(ID.GD_V_V04, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_V05] = new GasData(ID.GD_V_V05, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_V06] = new GasData(ID.GD_V_V06, ID.O2, GasData.VauleTypes.Divide10);
                }
                else if (this.Type == Types.Device4)
                {
                    dicGasDatas[ID.GD_V_O01] = new GasData(ID.GD_V_O01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_O02] = new GasData(ID.GD_V_O02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_O03] = new GasData(ID.GD_V_O03, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_P01] = new GasData(ID.GD_V_P01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_P02] = new GasData(ID.GD_V_P02, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_Q01] = new GasData(ID.GD_V_Q01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_Q02] = new GasData(ID.GD_V_Q02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_Q03] = new GasData(ID.GD_V_Q03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_Q04] = new GasData(ID.GD_V_Q04, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_R01] = new GasData(ID.GD_V_R01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_R02] = new GasData(ID.GD_V_R02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_R03] = new GasData(ID.GD_V_R03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_R04] = new GasData(ID.GD_V_R04, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_R05] = new GasData(ID.GD_V_R05, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_S01] = new GasData(ID.GD_V_S01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_S02] = new GasData(ID.GD_V_S02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_S03] = new GasData(ID.GD_V_S03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_S04] = new GasData(ID.GD_V_S04, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_T01] = new GasData(ID.GD_V_T01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_T02] = new GasData(ID.GD_V_T02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_V_T03] = new GasData(ID.GD_V_T03, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_V_O11] = new GasData(ID.GD_V_O11, ID.O2, GasData.VauleTypes.Divide10);
                }
                else if (this.Type == Types.Device5)
                {
                    dicGasDatas[ID.GD_V_X01] = new GasData(ID.GD_V_X01, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_V_X02] = new GasData(ID.GD_V_X02, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_V_X03] = new GasData(ID.GD_V_X03, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106

                    dicGasDatas[ID.GD_V_W01] = new GasData(ID.GD_V_W01, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_V_W02] = new GasData(ID.GD_V_W02, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_V_W03] = new GasData(ID.GD_V_W03, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106

                    dicGasDatas[ID.GD_V_Y01] = new GasData(ID.GD_V_Y01, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_V_Y02] = new GasData(ID.GD_V_Y02, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_V_Y03] = new GasData(ID.GD_V_Y02, ID.O2, GasData.VauleTypes.Divide10);    // 신규 센서 - 20251106

                }
                else
                    return;

                if (FC == ID.FC_ReadInputRegister)
                {
                    if (this.Type == Types.Device1)
                    {
                        if (arrData.Length != ID.V_Dev1_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_V_A01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_V_A02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_V_A03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_V_A04].SetVale(arrData, 3);


                        dicGasDatas[ID.GD_V_B01].SetVale(arrData, 9);
                        dicGasDatas[ID.GD_V_B02].SetVale(arrData, 10);
                        dicGasDatas[ID.GD_V_B03].SetVale(arrData, 11);
                        dicGasDatas[ID.GD_V_B04].SetVale(arrData, 12);
                        dicGasDatas[ID.GD_V_B05].SetVale(arrData, 13);
                        dicGasDatas[ID.GD_V_B06].SetVale(arrData, 14);

                        dicGasDatas[ID.GD_V_C01].SetVale(arrData, 18);
                        dicGasDatas[ID.GD_V_C02].SetVale(arrData, 19);
                        dicGasDatas[ID.GD_V_C03].SetVale(arrData, 20);
                        dicGasDatas[ID.GD_V_C04].SetVale(arrData, 21);

                        dicGasDatas[ID.GD_V_D01].SetVale(arrData, 27);
                        dicGasDatas[ID.GD_V_D02].SetVale(arrData, 28);
                        dicGasDatas[ID.GD_V_D03].SetVale(arrData, 29);
                        dicGasDatas[ID.GD_V_D04].SetVale(arrData, 30);

                        dicGasDatas[ID.GD_V_F01].SetVale(arrData, 45);
                        dicGasDatas[ID.GD_V_F02].SetVale(arrData, 46);
                        dicGasDatas[ID.GD_V_F03].SetVale(arrData, 47);
                        dicGasDatas[ID.GD_V_F04].SetVale(arrData, 48);
                        dicGasDatas[ID.GD_V_F05].SetVale(arrData, 49);
                        dicGasDatas[ID.GD_V_F06].SetVale(arrData, 54);
                        dicGasDatas[ID.GD_V_F07].SetVale(arrData, 55);
                        dicGasDatas[ID.GD_V_F08].SetVale(arrData, 56);
                        dicGasDatas[ID.GD_V_F09].SetVale(arrData, 57);
                        dicGasDatas[ID.GD_V_F10].SetVale(arrData, 58);
                        dicGasDatas[ID.GD_V_F11].SetVale(arrData, 59);

                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (arrData.Length != ID.V_Dev2_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_V_G01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_V_G02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_V_G03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_V_G04].SetVale(arrData, 3);

                    }
                    else if (this.Type == Types.Device3)
                    {
                        if (arrData.Length != ID.V_Dev3_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_V_H01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_V_H02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_V_H03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_V_H04].SetVale(arrData, 3);
                        dicGasDatas[ID.GD_V_H05].SetVale(arrData, 4);
                        dicGasDatas[ID.GD_V_H06].SetVale(arrData, 9);
                        dicGasDatas[ID.GD_V_H07].SetVale(arrData, 10);
                        dicGasDatas[ID.GD_V_H08].SetVale(arrData, 11);

                        dicGasDatas[ID.GD_V_I01].SetVale(arrData, 18);
                        dicGasDatas[ID.GD_V_I02].SetVale(arrData, 19);
                        dicGasDatas[ID.GD_V_I03].SetVale(arrData, 20);
                        dicGasDatas[ID.GD_V_I04].SetVale(arrData, 21);

                        dicGasDatas[ID.GD_V_I05].SetVale(arrData, 22);      // 신규 센서 20251106

                        dicGasDatas[ID.GD_V_J01].SetVale(arrData, 27);

                        dicGasDatas[ID.GD_V_K01].SetVale(arrData, 28);
                        dicGasDatas[ID.GD_V_K02].SetVale(arrData, 29);
                        dicGasDatas[ID.GD_V_K03].SetVale(arrData, 30);

                        dicGasDatas[ID.GD_V_L01].SetVale(arrData, 37);
                        dicGasDatas[ID.GD_V_L02].SetVale(arrData, 38);
                        dicGasDatas[ID.GD_V_L03].SetVale(arrData, 39);

                        dicGasDatas[ID.GD_V_M01].SetVale(arrData, 46);
                        dicGasDatas[ID.GD_V_M02].SetVale(arrData, 47);
                        dicGasDatas[ID.GD_V_M03].SetVale(arrData, 48);

                        dicGasDatas[ID.GD_V_U01].SetVale(arrData, 54);

                        dicGasDatas[ID.GD_V_N01].SetVale(arrData, 55);
                        dicGasDatas[ID.GD_V_N02].SetVale(arrData, 56);
                        dicGasDatas[ID.GD_V_N03].SetVale(arrData, 57);
                        dicGasDatas[ID.GD_V_N04].SetVale(arrData, 58);
                        dicGasDatas[ID.GD_V_N05].SetVale(arrData, 59);

                        dicGasDatas[ID.GD_V_V01].SetVale(arrData, 65);
                        dicGasDatas[ID.GD_V_V02].SetVale(arrData, 66);
                        dicGasDatas[ID.GD_V_V03].SetVale(arrData, 67);
                        dicGasDatas[ID.GD_V_V04].SetVale(arrData, 68);
                        dicGasDatas[ID.GD_V_V05].SetVale(arrData, 69);
                        dicGasDatas[ID.GD_V_V06].SetVale(arrData, 70);


                    }
                    else if (this.Type == Types.Device4)
                    {
                        if (arrData.Length != ID.V_Dev4_Register_Length * nRegisterLeng)
                            return;


                        dicGasDatas[ID.GD_V_O01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_V_O02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_V_O03].SetVale(arrData, 2);

                        dicGasDatas[ID.GD_V_P01].SetVale(arrData, 9);
                        dicGasDatas[ID.GD_V_P02].SetVale(arrData, 10);

                        dicGasDatas[ID.GD_V_Q01].SetVale(arrData, 18);
                        dicGasDatas[ID.GD_V_Q02].SetVale(arrData, 19);
                        dicGasDatas[ID.GD_V_Q03].SetVale(arrData, 20);
                        dicGasDatas[ID.GD_V_Q04].SetVale(arrData, 21);

                        dicGasDatas[ID.GD_V_R01].SetVale(arrData, 27);
                        dicGasDatas[ID.GD_V_R02].SetVale(arrData, 28);
                        dicGasDatas[ID.GD_V_R03].SetVale(arrData, 29);
                        dicGasDatas[ID.GD_V_R04].SetVale(arrData, 30);
                        dicGasDatas[ID.GD_V_R05].SetVale(arrData, 31);

                        dicGasDatas[ID.GD_V_S01].SetVale(arrData, 36);
                        dicGasDatas[ID.GD_V_S02].SetVale(arrData, 37);
                        dicGasDatas[ID.GD_V_S03].SetVale(arrData, 38);
                        dicGasDatas[ID.GD_V_S04].SetVale(arrData, 39);

                        dicGasDatas[ID.GD_V_T01].SetVale(arrData, 46);
                        dicGasDatas[ID.GD_V_T01].SetVale(arrData, 47);
                        dicGasDatas[ID.GD_V_T01].SetVale(arrData, 48);

                        dicGasDatas[ID.GD_V_O11].SetVale(arrData, 54);


                    }
                    else if (this.Type == Types.Device5)
                    {
                        if (arrData.Length != ID.V_Dev5_Register_Length * nRegisterLeng)
                            return;

                        dicGasDatas[ID.GD_V_W01].SetVale(arrData, 0);           // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_W02].SetVale(arrData, 1);           // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_W03].SetVale(arrData, 2);           // 신규 센서 - 20251106

                        dicGasDatas[ID.GD_V_X01].SetVale(arrData, 7);           // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_X02].SetVale(arrData, 8);           // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_X03].SetVale(arrData, 9);           // 신규 센서 - 20251106

                        dicGasDatas[ID.GD_V_Y01].SetVale(arrData, 14);          // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_Y02].SetVale(arrData, 15);          // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_Y03].SetVale(arrData, 16);          // 신규 센서 - 20251106
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
                        if (bitArray.Length < ID.V_Dev1_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_V_A01].LoAlarm = bitArray[0];
                        dicGasDatas[ID.GD_V_A01].LoLowAlarm = bitArray[1];
                        dicGasDatas[ID.GD_V_A01].HiAlarm = bitArray[2];
                        //dicGasDatas[ID.GD_V_A01].FaultAlarm = bitArray[3];

                        dicGasDatas[ID.GD_V_A02].LoAlarm = bitArray[8];
                        dicGasDatas[ID.GD_V_A02].LoLowAlarm = bitArray[9];
                        dicGasDatas[ID.GD_V_A02].HiAlarm = bitArray[10];
                        //dicGasDatas[ID.GD_V_A02].FaultAlarm = bitArray[11];

                        dicGasDatas[ID.GD_V_A03].LoAlarm = bitArray[16];
                        dicGasDatas[ID.GD_V_A03].LoLowAlarm = bitArray[17];
                        dicGasDatas[ID.GD_V_A03].HiAlarm = bitArray[18];
                        //dicGasDatas[ID.GD_V_A03].FaultAlarm = bitArray[19];

                        dicGasDatas[ID.GD_V_A04].LoAlarm = bitArray[24];
                        dicGasDatas[ID.GD_V_A04].LoLowAlarm = bitArray[25];
                        dicGasDatas[ID.GD_V_A04].HiAlarm = bitArray[26];
                        //dicGasDatas[ID.GD_V_A04].FaultAlarm = bitArray[27];




                        dicGasDatas[ID.GD_V_B01].LoAlarm = bitArray[72];
                        dicGasDatas[ID.GD_V_B01].LoLowAlarm = bitArray[73];
                        dicGasDatas[ID.GD_V_B01].HiAlarm = bitArray[74];
                        //dicGasDatas[ID.GD_V_B01].FaultAlarm = bitArray[75];

                        dicGasDatas[ID.GD_V_B02].LoAlarm = bitArray[80];
                        dicGasDatas[ID.GD_V_B02].LoLowAlarm = bitArray[81];
                        dicGasDatas[ID.GD_V_B02].HiAlarm = bitArray[82];
                        //dicGasDatas[ID.GD_V_B02].FaultAlarm = bitArray[83];

                        dicGasDatas[ID.GD_V_B03].LoAlarm = bitArray[88];
                        dicGasDatas[ID.GD_V_B03].LoLowAlarm = bitArray[89];
                        dicGasDatas[ID.GD_V_B03].HiAlarm = bitArray[90];
                        //dicGasDatas[ID.GD_V_B03].FaultAlarm = bitArray[91];

                        dicGasDatas[ID.GD_V_B04].LoAlarm = bitArray[96];
                        dicGasDatas[ID.GD_V_B04].LoLowAlarm = bitArray[97];
                        dicGasDatas[ID.GD_V_B04].HiAlarm = bitArray[98];
                        //dicGasDatas[ID.GD_V_B04].FaultAlarm = bitArray[99];

                        dicGasDatas[ID.GD_V_B05].LoAlarm = bitArray[104];
                        dicGasDatas[ID.GD_V_B05].LoLowAlarm = bitArray[105];
                        dicGasDatas[ID.GD_V_B05].HiAlarm = bitArray[106];
                        //dicGasDatas[ID.GD_V_B05].FaultAlarm = bitArray[107];

                        dicGasDatas[ID.GD_V_B06].LoAlarm = bitArray[112];
                        dicGasDatas[ID.GD_V_B06].LoLowAlarm = bitArray[113];
                        dicGasDatas[ID.GD_V_B06].HiAlarm = bitArray[114];
                        //dicGasDatas[ID.GD_V_B06].FaultAlarm = bitArray[115];




                        dicGasDatas[ID.GD_V_C01].LoAlarm = bitArray[144];
                        dicGasDatas[ID.GD_V_C01].LoLowAlarm = bitArray[145];
                        dicGasDatas[ID.GD_V_C01].HiAlarm = bitArray[146];
                        //dicGasDatas[ID.GD_V_C01].FaultAlarm = bitArray[147];

                        dicGasDatas[ID.GD_V_C02].LoAlarm = bitArray[152];
                        dicGasDatas[ID.GD_V_C02].LoLowAlarm = bitArray[153];
                        dicGasDatas[ID.GD_V_C02].HiAlarm = bitArray[154];
                        //dicGasDatas[ID.GD_V_C02].FaultAlarm = bitArray[155];

                        dicGasDatas[ID.GD_V_C03].LoAlarm = bitArray[160];
                        dicGasDatas[ID.GD_V_C03].LoLowAlarm = bitArray[161];
                        dicGasDatas[ID.GD_V_C03].HiAlarm = bitArray[162];
                        //dicGasDatas[ID.GD_V_C03].FaultAlarm = bitArray[163];

                        dicGasDatas[ID.GD_V_C04].LoAlarm = bitArray[168];
                        dicGasDatas[ID.GD_V_C04].LoLowAlarm = bitArray[169];
                        dicGasDatas[ID.GD_V_C04].HiAlarm = bitArray[170];
                        //dicGasDatas[ID.GD_V_C04].FaultAlarm = bitArray[171];



                        dicGasDatas[ID.GD_V_D01].HiAlarm = bitArray[216];
                        dicGasDatas[ID.GD_V_D01].HiHighAlarm = bitArray[217];
                        //dicGasDatas[ID.GD_V_D01].FaultAlarm = bitArray[219];

                        dicGasDatas[ID.GD_V_D02].HiAlarm = bitArray[224];
                        dicGasDatas[ID.GD_V_D02].HiHighAlarm = bitArray[225];
                        //dicGasDatas[ID.GD_V_D02].FaultAlarm = bitArray[227];

                        dicGasDatas[ID.GD_V_D03].LoAlarm = bitArray[232];
                        dicGasDatas[ID.GD_V_D03].LoLowAlarm = bitArray[233];
                        dicGasDatas[ID.GD_V_D03].HiAlarm = bitArray[234];
                        //dicGasDatas[ID.GD_V_D03].FaultAlarm = bitArray[235];

                        dicGasDatas[ID.GD_V_D04].LoAlarm = bitArray[240];
                        dicGasDatas[ID.GD_V_D04].LoLowAlarm = bitArray[241];
                        dicGasDatas[ID.GD_V_D04].HiAlarm = bitArray[242];
                        //dicGasDatas[ID.GD_V_D04].FaultAlarm = bitArray[243];



                        dicGasDatas[ID.GD_V_F01].LoAlarm = bitArray[360];
                        dicGasDatas[ID.GD_V_F01].LoLowAlarm = bitArray[361];
                        dicGasDatas[ID.GD_V_F01].HiAlarm = bitArray[362];
                        //dicGasDatas[ID.GD_V_F01].FaultAlarm = bitArray[363];

                        dicGasDatas[ID.GD_V_F02].LoAlarm = bitArray[368];
                        dicGasDatas[ID.GD_V_F02].LoLowAlarm = bitArray[369];
                        dicGasDatas[ID.GD_V_F02].HiAlarm = bitArray[370];
                        //dicGasDatas[ID.GD_V_F02].FaultAlarm = bitArray[371];

                        dicGasDatas[ID.GD_V_F03].LoAlarm = bitArray[376];
                        dicGasDatas[ID.GD_V_F03].LoLowAlarm = bitArray[377];
                        dicGasDatas[ID.GD_V_F03].HiAlarm = bitArray[378];
                        //dicGasDatas[ID.GD_V_F03].FaultAlarm = bitArray[379];

                        dicGasDatas[ID.GD_V_F04].LoAlarm = bitArray[384];
                        dicGasDatas[ID.GD_V_F04].LoLowAlarm = bitArray[385];
                        dicGasDatas[ID.GD_V_F04].HiAlarm = bitArray[386];
                        //dicGasDatas[ID.GD_V_F04].FaultAlarm = bitArray[387];

                        dicGasDatas[ID.GD_V_F05].LoAlarm = bitArray[392];
                        dicGasDatas[ID.GD_V_F05].LoLowAlarm = bitArray[393];
                        dicGasDatas[ID.GD_V_F05].HiAlarm = bitArray[394];
                        //dicGasDatas[ID.GD_V_F05].FaultAlarm = bitArray[395];


                        dicGasDatas[ID.GD_V_F06].SetLowData(bitArray, 432);
                        dicGasDatas[ID.GD_V_F07].SetLowData(bitArray, 440);
                        dicGasDatas[ID.GD_V_F08].SetLowData(bitArray, 448);
                        dicGasDatas[ID.GD_V_F09].SetLowData(bitArray, 456);
                        dicGasDatas[ID.GD_V_F10].SetLowData(bitArray, 464);
                        dicGasDatas[ID.GD_V_F11].SetLowData(bitArray, 472);
                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (bitArray.Length < ID.V_Dev2_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_V_G01].SetHiData(bitArray, 0);
                        dicGasDatas[ID.GD_V_G01].SetLowData(bitArray, 8);
                        dicGasDatas[ID.GD_V_G01].SetLowData(bitArray, 16);
                        dicGasDatas[ID.GD_V_G01].SetLowData(bitArray, 24);

                    }
                    else if (this.Type == Types.Device3)
                    {
                        if (bitArray.Length < ID.V_Dev3_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_V_H01].SetLowData(bitArray, 0);
                        dicGasDatas[ID.GD_V_H02].SetLowData(bitArray, 8);
                        dicGasDatas[ID.GD_V_H03].SetLowData(bitArray, 16);
                        dicGasDatas[ID.GD_V_H04].SetLowData(bitArray, 24);
                        dicGasDatas[ID.GD_V_H05].SetLowData(bitArray, 32);

                        dicGasDatas[ID.GD_V_H06].SetLowData(bitArray, 72);
                        dicGasDatas[ID.GD_V_H07].SetLowData(bitArray, 80);
                        dicGasDatas[ID.GD_V_H08].SetLowData(bitArray, 88);

                        dicGasDatas[ID.GD_V_I01].SetLowData(bitArray, 144);
                        dicGasDatas[ID.GD_V_I02].SetLowData(bitArray, 152);
                        dicGasDatas[ID.GD_V_I03].SetLowData(bitArray, 160);
                        dicGasDatas[ID.GD_V_I04].SetLowData(bitArray, 168);

                        dicGasDatas[ID.GD_V_I05].SetLowData(bitArray, 176);         // 신규 센서 - 20251106

                        dicGasDatas[ID.GD_V_J01].SetLowData(bitArray, 216);

                        dicGasDatas[ID.GD_V_K01].SetLowData(bitArray, 224);
                        dicGasDatas[ID.GD_V_K02].SetLowData(bitArray, 232);
                        dicGasDatas[ID.GD_V_K03].SetLowData(bitArray, 240);

                        dicGasDatas[ID.GD_V_L01].SetLowData(bitArray, 296);
                        dicGasDatas[ID.GD_V_L02].SetLowData(bitArray, 304);
                        dicGasDatas[ID.GD_V_L03].SetLowData(bitArray, 312);

                        dicGasDatas[ID.GD_V_M01].SetLowData(bitArray, 368);
                        dicGasDatas[ID.GD_V_M02].SetLowData(bitArray, 376);
                        dicGasDatas[ID.GD_V_M03].SetLowData(bitArray, 384);

                        dicGasDatas[ID.GD_V_U01].SetLowData(bitArray, 432);

                        dicGasDatas[ID.GD_V_N01].SetHiData(bitArray, 440);
                        dicGasDatas[ID.GD_V_N02].SetHiData(bitArray, 448);
                        dicGasDatas[ID.GD_V_N03].SetLowData(bitArray, 456);
                        dicGasDatas[ID.GD_V_N04].SetLowData(bitArray, 464);
                        dicGasDatas[ID.GD_V_N05].SetLowData(bitArray, 472);

                        dicGasDatas[ID.GD_V_V01].SetLowData(bitArray, 520);
                        dicGasDatas[ID.GD_V_V02].SetLowData(bitArray, 528);
                        dicGasDatas[ID.GD_V_V03].SetLowData(bitArray, 536);
                        dicGasDatas[ID.GD_V_V04].SetLowData(bitArray, 544);
                        dicGasDatas[ID.GD_V_V05].SetLowData(bitArray, 552);
                        dicGasDatas[ID.GD_V_V06].SetLowData(bitArray, 560);
                    }
                    else if (this.Type == Types.Device4)
                    {
                        if (bitArray.Length < ID.V_Dev4_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_V_O01].SetLowData(bitArray, 0);
                        dicGasDatas[ID.GD_V_O02].SetLowData(bitArray, 8);
                        dicGasDatas[ID.GD_V_O03].SetLowData(bitArray, 16);

                        dicGasDatas[ID.GD_V_P01].SetLowData(bitArray, 72);
                        dicGasDatas[ID.GD_V_P02].SetLowData(bitArray, 80);

                        dicGasDatas[ID.GD_V_Q01].SetLowData(bitArray, 144);
                        dicGasDatas[ID.GD_V_Q02].SetLowData(bitArray, 152);
                        dicGasDatas[ID.GD_V_Q03].SetLowData(bitArray, 160);
                        dicGasDatas[ID.GD_V_Q04].SetLowData(bitArray, 168);

                        dicGasDatas[ID.GD_V_R01].SetLowData(bitArray, 216);
                        dicGasDatas[ID.GD_V_R02].SetLowData(bitArray, 224);
                        dicGasDatas[ID.GD_V_R03].SetLowData(bitArray, 232);
                        dicGasDatas[ID.GD_V_R04].SetLowData(bitArray, 240);
                        dicGasDatas[ID.GD_V_R05].SetLowData(bitArray, 248);

                        dicGasDatas[ID.GD_V_S01].SetLowData(bitArray, 288);
                        dicGasDatas[ID.GD_V_S02].SetLowData(bitArray, 296);
                        dicGasDatas[ID.GD_V_S03].SetLowData(bitArray, 304);
                        dicGasDatas[ID.GD_V_S04].SetLowData(bitArray, 312);

                        dicGasDatas[ID.GD_V_T01].SetLowData(bitArray, 360);
                        dicGasDatas[ID.GD_V_T02].SetLowData(bitArray, 368);
                        dicGasDatas[ID.GD_V_T03].SetLowData(bitArray, 376);

                        dicGasDatas[ID.GD_V_O11].SetLowData(bitArray, 432);
                    }
                    else if (this.Type == Types.Device5)
                    {
                        if (bitArray.Length < ID.V_Dev5_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_V_W01].SetLowData(bitArray, 0);           // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_W02].SetLowData(bitArray, 8);           // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_W03].SetLowData(bitArray, 16);          // 신규 센서 - 20251106

                        dicGasDatas[ID.GD_V_X01].SetLowData(bitArray, 56);          // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_X02].SetLowData(bitArray, 64);          // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_X03].SetLowData(bitArray, 72);          // 신규 센서 - 20251106

                        dicGasDatas[ID.GD_V_Y01].SetLowData(bitArray, 112);         // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_Y02].SetLowData(bitArray, 120);         // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_V_Y03].SetLowData(bitArray, 128);         // 신규 센서 - 20251106
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
