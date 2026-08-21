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
    public class GasCProvider : ClientServiceProvider
    {
        public enum Types { Device1 = 0, Device2, Device3 }

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

        public Logger Logger { get; set; }

        public GasCProvider(GasManager parentManager, Types type, string strIP, int nPort, DBDataManager dbDataManager, SopQueryManager sopQueryMgr, Dictionary<string, GasSensorData> dicGasSensors, string strSOPWebServerURL)
        {
            m_parentManager = parentManager;
            m_dbDataManager = dbDataManager;
            m_sopQueryMgr = sopQueryMgr;
            m_dicGasSensors = dicGasSensors;
            m_strSOPWebServerURL = strSOPWebServerURL;

            this.Type = type;
            this.IP = strIP;
            this.Port = nPort;

            this.DeviceName = "C_" + type;
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
                            nLength = (UInt16)ID.C_Dev1_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0; 
                            nLength = (UInt16)ID.C_Dev1_Register_Length;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device2)
                        {
                            nSlaveID = 2;

                            nStartAddr = 0;
                            nLength = (UInt16)ID.C_Dev2_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0; 
                            nLength = (UInt16)ID.C_Dev2_Register_Length;

                            arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (this.Type == Types.Device3)
                        {
                            nSlaveID = 3;

                            nStartAddr = 0; 
                            nLength = (UInt16)ID.C_Dev3_Discrete_Length;

                            byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(800);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.C_Dev3_Register_Length;

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
                    dicGasDatas[ID.GD_C4_01] = new GasData(ID.GD_C4_01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_C4_02] = new GasData(ID.GD_C4_02, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_C4_03] = new GasData(ID.GD_C4_03, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_C4_04] = new GasData(ID.GD_C4_04, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_C4L_01] = new GasData(ID.GD_C4L_01, ID.CO);
                    dicGasDatas[ID.GD_C4L_02] = new GasData(ID.GD_C4L_02, ID.CO);
                    dicGasDatas[ID.GD_C4L_03] = new GasData(ID.GD_C4L_03, ID.CO);
                    dicGasDatas[ID.GD_C4L_04] = new GasData(ID.GD_C4L_04, ID.CO);
                    dicGasDatas[ID.GD_C4L_05] = new GasData(ID.GD_C4L_05, ID.CO);
                    dicGasDatas[ID.GD_C4L_06] = new GasData(ID.GD_C4L_06, ID.O2, GasData.VauleTypes.Divide10);
                }
                else if (this.Type == Types.Device2)
                {
                    dicGasDatas[ID.GD_C1_01] = new GasData(ID.GD_C1_01, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_C1E_01] = new GasData(ID.GD_C1E_01, ID.IPA);
                    dicGasDatas[ID.GD_C1E_02] = new GasData(ID.GD_C1E_02, ID.O2, GasData.VauleTypes.Divide10);
                }
                else if (this.Type == Types.Device3)
                {
                    dicGasDatas[ID.GD_C_01] = new GasData(ID.GD_C_01, ID.LPG);
                    dicGasDatas[ID.GD_C_02] = new GasData(ID.GD_C_02, ID.LPG);
                    dicGasDatas[ID.GD_C_03] = new GasData(ID.GD_C_03, ID.LPG);

                    dicGasDatas[ID.GD_C3_01] = new GasData(ID.GD_C3_01, ID.O2, GasData.VauleTypes.Divide10);
                    dicGasDatas[ID.GD_C3_02] = new GasData(ID.GD_C3_02, ID.O2, GasData.VauleTypes.Divide10);

                    dicGasDatas[ID.GD_C3_03] = new GasData(ID.GD_C3_03, ID.O2, GasData.VauleTypes.Divide10);        // 센서 추가 - 20251106

                    dicGasDatas[ID.GD_C_04] = new GasData(ID.GD_C_04, ID.CO);
                }
                else
                    return;

                if (FC == ID.FC_ReadInputRegister)
                {
                    if (this.Type == Types.Device1)
                    {
                        if (arrData.Length != ID.C_Dev1_Register_Length * nRegisterLeng)
                            return;


                        dicGasDatas[ID.GD_C4_01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_C4_02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_C4_03].SetVale(arrData, 2);
                        dicGasDatas[ID.GD_C4_04].SetVale(arrData, 3);

                        dicGasDatas[ID.GD_C4L_01].SetVale(arrData, 12);
                        dicGasDatas[ID.GD_C4L_02].SetVale(arrData, 13);
                        dicGasDatas[ID.GD_C4L_03].SetVale(arrData, 14);
                        dicGasDatas[ID.GD_C4L_04].SetVale(arrData, 15);
                        dicGasDatas[ID.GD_C4L_05].SetVale(arrData, 16);
                        dicGasDatas[ID.GD_C4L_06].SetVale(arrData, 17);

                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (arrData.Length != ID.C_Dev2_Register_Length * nRegisterLeng)
                            return;


                        dicGasDatas[ID.GD_C1_01].SetVale(arrData, 0);

                        dicGasDatas[ID.GD_C1E_01].SetVale(arrData, 12);
                        dicGasDatas[ID.GD_C1E_02].SetVale(arrData, 13);

                    }
                    else if (this.Type == Types.Device3)
                    {
                        if (arrData.Length != ID.C_Dev3_Register_Length * nRegisterLeng)
                            return;


                        dicGasDatas[ID.GD_C_01].SetVale(arrData, 0);
                        dicGasDatas[ID.GD_C_02].SetVale(arrData, 1);
                        dicGasDatas[ID.GD_C_03].SetVale(arrData, 2);

                        dicGasDatas[ID.GD_C3_01].SetVale(arrData, 16);
                        dicGasDatas[ID.GD_C3_02].SetVale(arrData, 17);

                        dicGasDatas[ID.GD_C3_03].SetVale(arrData, 33);      // 신규 센서 - 20251106

                        dicGasDatas[ID.GD_C_04].SetVale(arrData, 32);

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
                        if (bitArray.Length < ID.C_Dev1_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_C4_01].LoAlarm = bitArray[0];
                        dicGasDatas[ID.GD_C4_01].LoLowAlarm = bitArray[1];
                        dicGasDatas[ID.GD_C4_01].HiAlarm = bitArray[2];
                        //dicGasDatas[ID.GD_C4_01].FaultAlarm = bitArray[3];

                        dicGasDatas[ID.GD_C4_02].LoAlarm = bitArray[8];
                        dicGasDatas[ID.GD_C4_02].LoLowAlarm = bitArray[9];
                        dicGasDatas[ID.GD_C4_02].HiAlarm = bitArray[10];
                        //dicGasDatas[ID.GD_C4_02].FaultAlarm = bitArray[11];

                        dicGasDatas[ID.GD_C4_03].LoAlarm = bitArray[16];
                        dicGasDatas[ID.GD_C4_03].LoLowAlarm = bitArray[17];
                        dicGasDatas[ID.GD_C4_03].HiAlarm = bitArray[18];
                        //dicGasDatas[ID.GD_C4_03].FaultAlarm = bitArray[19];

                        dicGasDatas[ID.GD_C4_04].LoAlarm = bitArray[24];
                        dicGasDatas[ID.GD_C4_04].LoLowAlarm = bitArray[25];
                        dicGasDatas[ID.GD_C4_04].HiAlarm = bitArray[26];
                        //dicGasDatas[ID.GD_C4_04].FaultAlarm = bitArray[27];




                        dicGasDatas[ID.GD_C4L_01].HiAlarm = bitArray[96];
                        dicGasDatas[ID.GD_C4L_01].HiHighAlarm = bitArray[97];
                        //dicGasDatas[ID.GD_C4L_01].FaultAlarm = bitArray[99];

                        dicGasDatas[ID.GD_C4L_02].HiAlarm = bitArray[104];
                        dicGasDatas[ID.GD_C4L_02].HiHighAlarm = bitArray[105];
                        //dicGasDatas[ID.GD_C4L_02].FaultAlarm = bitArray[107];

                        dicGasDatas[ID.GD_C4L_03].HiAlarm = bitArray[112];
                        dicGasDatas[ID.GD_C4L_03].HiHighAlarm = bitArray[113];
                        //dicGasDatas[ID.GD_C4L_03].FaultAlarm = bitArray[115];

                        dicGasDatas[ID.GD_C4L_04].HiAlarm = bitArray[120];
                        dicGasDatas[ID.GD_C4L_04].HiHighAlarm = bitArray[121];
                        //dicGasDatas[ID.GD_C4L_04].FaultAlarm = bitArray[123];

                        dicGasDatas[ID.GD_C4L_05].HiAlarm = bitArray[128];
                        dicGasDatas[ID.GD_C4L_05].HiHighAlarm = bitArray[129];
                        //dicGasDatas[ID.GD_C4L_05].FaultAlarm = bitArray[131];



                        dicGasDatas[ID.GD_C4L_06].LoAlarm = bitArray[136];
                        dicGasDatas[ID.GD_C4L_06].LoLowAlarm = bitArray[137];
                        dicGasDatas[ID.GD_C4L_06].HiAlarm = bitArray[139];
                        //dicGasDatas[ID.GD_C4L_06].FaultAlarm = bitArray[144];



                    }
                    else if (this.Type == Types.Device2)
                    {
                        if (bitArray.Length < ID.C_Dev2_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_C1_01].LoAlarm = bitArray[0];
                        dicGasDatas[ID.GD_C1_01].LoLowAlarm = bitArray[1];
                        dicGasDatas[ID.GD_C1_01].HiAlarm = bitArray[2];
                        //dicGasDatas[ID.GD_C1_01].FaultAlarm = bitArray[3];

                        dicGasDatas[ID.GD_C1E_01].HiAlarm = bitArray[96];
                        dicGasDatas[ID.GD_C1E_01].HiHighAlarm = bitArray[97];
                        //dicGasDatas[ID.GD_C1E_01].FaultAlarm = bitArray[99];

                        dicGasDatas[ID.GD_C1E_02].LoAlarm = bitArray[104];
                        dicGasDatas[ID.GD_C1E_02].LoLowAlarm = bitArray[105];
                        dicGasDatas[ID.GD_C1E_02].HiAlarm = bitArray[106];
                        //dicGasDatas[ID.GD_C1E_02].FaultAlarm = bitArray[107];

                    }
                    else if (this.Type == Types.Device3)
                    {
                        if (bitArray.Length < ID.C_Dev3_Discrete_Length)
                            return;

                        dicGasDatas[ID.GD_C_01].HiAlarm = bitArray[0];
                        dicGasDatas[ID.GD_C_01].HiHighAlarm = bitArray[1];
                        //dicGasDatas[ID.GD_C_01].FaultAlarm = bitArray[3];

                        dicGasDatas[ID.GD_C_02].HiAlarm = bitArray[8];
                        dicGasDatas[ID.GD_C_02].HiHighAlarm = bitArray[9];
                        //dicGasDatas[ID.GD_C_02].FaultAlarm = bitArray[11];

                        dicGasDatas[ID.GD_C_03].HiAlarm = bitArray[16];
                        dicGasDatas[ID.GD_C_03].HiHighAlarm = bitArray[17];
                        //dicGasDatas[ID.GD_C_03].FaultAlarm = bitArray[19];



                        dicGasDatas[ID.GD_C3_01].LoAlarm = bitArray[128];
                        dicGasDatas[ID.GD_C3_01].LoLowAlarm = bitArray[129];
                        dicGasDatas[ID.GD_C3_01].HiAlarm = bitArray[130];
                        //dicGasDatas[ID.GD_C3_01].FaultAlarm = bitArray[131];

                        dicGasDatas[ID.GD_C3_02].LoAlarm = bitArray[136];
                        dicGasDatas[ID.GD_C3_02].LoLowAlarm = bitArray[137];
                        dicGasDatas[ID.GD_C3_02].HiAlarm = bitArray[138];
                        //dicGasDatas[ID.GD_C3_02].FaultAlarm = bitArray[139];

                        dicGasDatas[ID.GD_C3_03].LoAlarm = bitArray[264];               // 신규 센서 - 20251106
                        dicGasDatas[ID.GD_C3_03].LoLowAlarm = bitArray[265];            // 신규 센서 - 20251106

                        dicGasDatas[ID.GD_C_04].HiAlarm = bitArray[256];
                        dicGasDatas[ID.GD_C_04].HiHighAlarm = bitArray[257];
                        //dicGasDatas[ID.GD_C_04].FaultAlarm = bitArray[258];                        
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
