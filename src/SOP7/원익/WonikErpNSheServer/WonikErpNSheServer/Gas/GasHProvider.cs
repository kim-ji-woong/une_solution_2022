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
    public class GasHProvider : ClientServiceProvider
    {
        GasManager m_parentManager = null;

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


        public GasHProvider(GasManager parentManager, string strIP, int nPort, DBDataManager dbDataManager, SopQueryManager sopQueryMgr, Dictionary<string, GasSensorData> dicGasSensors, string strSOPWebServerURL)
        {
            m_parentManager = parentManager;
            m_dbDataManager = dbDataManager;
            m_sopQueryMgr = sopQueryMgr;
            m_dicGasSensors = dicGasSensors;
            m_strSOPWebServerURL = strSOPWebServerURL;

            this.IP = strIP;
            this.Port = nPort;

            this.DeviceName = "H_Device";
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
                                    m_parentManager.Logger.Write("[" + this.DeviceName + "] ConnectionThread() : " + this.IP + ":" + this.Port.ToString() + " / " + this.IsConnected);
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
                        UInt16 nStartAddr = 0;                       
                        UInt16 nLength = (UInt16)ID.H_Discrete_Length;
                        int nSlaveID = 1;

                        byte[] arrData = MakeRequestMsg(ID.FC_ReadDiscrete, nSlaveID, m_nTransID, nStartAddr, nLength);
                        SendBytes(arrData);

                        m_nTransID++;
                        Thread.Sleep(500);

                        nStartAddr = 0;
                        nLength = (UInt16)ID.H_Register_Length;

                        arrData = MakeRequestMsg(ID.FC_ReadInputRegister, nSlaveID, m_nTransID, nStartAddr, nLength);
                        SendBytes(arrData);

                        m_nTransID++;        
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

                    Thread.Sleep(500);
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
                dicGasDatas[ID.GD_A01] = new GasData(ID.GD_A01, ID.LNG);
                dicGasDatas[ID.GD_A02] = new GasData(ID.GD_A02, ID.LNG);
                dicGasDatas[ID.GD_A03] = new GasData(ID.GD_A03, ID.LNG);
                dicGasDatas[ID.GD_A04] = new GasData(ID.GD_A04, ID.LNG);
                dicGasDatas[ID.GD_A05] = new GasData(ID.GD_A05, ID.LNG);
                dicGasDatas[ID.GD_A06] = new GasData(ID.GD_A06, ID.LNG);
                dicGasDatas[ID.GD_A07] = new GasData(ID.GD_A07, ID.LNG);

                dicGasDatas[ID.GD_B01] = new GasData(ID.GD_B01, ID.LNG);

                dicGasDatas[ID.GD_C01] = new GasData(ID.GD_C01, ID.LNG);
                dicGasDatas[ID.GD_C02] = new GasData(ID.GD_C02, ID.LNG);

                dicGasDatas[ID.GD_E01] = new GasData(ID.GD_E01, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_E02] = new GasData(ID.GD_E02, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_E03] = new GasData(ID.GD_E03, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_E04] = new GasData(ID.GD_E04, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_E05] = new GasData(ID.GD_E05, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_E06] = new GasData(ID.GD_E06, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_E07] = new GasData(ID.GD_E07, ID.O2, GasData.VauleTypes.Divide10);

                dicGasDatas[ID.GD_H_E08] = new GasData(ID.GD_H_E08, ID.O2, GasData.VauleTypes.Divide10);        // 신규 센서 - 20251106

                dicGasDatas[ID.GD_F01] = new GasData(ID.GD_F01, ID.LNG);
                dicGasDatas[ID.GD_F02] = new GasData(ID.GD_F02, ID.LNG);
                dicGasDatas[ID.GD_F03] = new GasData(ID.GD_F03, ID.CO);

                dicGasDatas[ID.GD_G01] = new GasData(ID.GD_G01, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_G02] = new GasData(ID.GD_G02, ID.O2, GasData.VauleTypes.Divide10);

                dicGasDatas[ID.GD_H01] = new GasData(ID.GD_H01, ID.O2, GasData.VauleTypes.Divide10);
                dicGasDatas[ID.GD_H02] = new GasData(ID.GD_H02, ID.O2, GasData.VauleTypes.Divide10);

                dicGasDatas[ID.GD_D01] = new GasData(ID.GD_D01, ID.H2);



                if (FC == ID.FC_ReadInputRegister)
                {
                    if (arrData.Length != ID.H_Register_Length * nRegisterLeng)
                        return;

                    dicGasDatas[ID.GD_A01].SetVale(arrData, 0);
                    dicGasDatas[ID.GD_A02].SetVale(arrData, 1);
                    dicGasDatas[ID.GD_A03].SetVale(arrData, 2);
                    dicGasDatas[ID.GD_A04].SetVale(arrData, 3);
                    dicGasDatas[ID.GD_A05].SetVale(arrData, 4);
                    dicGasDatas[ID.GD_A06].SetVale(arrData, 5);
                    dicGasDatas[ID.GD_A07].SetVale(arrData, 6);

                    dicGasDatas[ID.GD_B01].SetVale(arrData, 12);

                    dicGasDatas[ID.GD_C01].SetVale(arrData, 20);
                    dicGasDatas[ID.GD_C02].SetVale(arrData, 21);

                    dicGasDatas[ID.GD_D01].SetVale(arrData, 28);

                    dicGasDatas[ID.GD_E07].SetVale(arrData, 29);

                    dicGasDatas[ID.GD_H_E08].SetVale(arrData, 30);          // 신규 센서 - 20251106

                    dicGasDatas[ID.GD_E01].SetVale(arrData, 36);
                    dicGasDatas[ID.GD_E02].SetVale(arrData, 37);
                    dicGasDatas[ID.GD_E03].SetVale(arrData, 38);
                    dicGasDatas[ID.GD_E04].SetVale(arrData, 39);
                    dicGasDatas[ID.GD_E05].SetVale(arrData, 40);
                    dicGasDatas[ID.GD_E06].SetVale(arrData, 41);

                    dicGasDatas[ID.GD_F01].SetVale(arrData, 48);
                    dicGasDatas[ID.GD_F02].SetVale(arrData, 49);

                    dicGasDatas[ID.GD_G01].SetVale(arrData, 57);
                    dicGasDatas[ID.GD_G02].SetVale(arrData, 58);

                    dicGasDatas[ID.GD_H01].SetVale(arrData, 64);
                    dicGasDatas[ID.GD_H02].SetVale(arrData, 65);

                    dicGasDatas[ID.GD_F03].SetVale(arrData, 69);



                    // DB 업데이트
                    if (UpdateSensorData2(dicGasDatas, out strErrorMessage) == false)
                    {
                        m_parentManager.Logger.Write("[" + this.DeviceName + "] OnReceiveData() : " + strErrorMessage);
                    }

                }
                else if (FC == ID.FC_ReadDiscrete)
                {
                    BitArray bitArray = new BitArray(arrData);

                    if (bitArray.Length < ID.H_Discrete_Length)
                        return;

                    dicGasDatas[ID.GD_A01].HiAlarm = bitArray[0];
                    dicGasDatas[ID.GD_A01].HiHighAlarm = bitArray[1];
                    //dicGasDatas[ID.GD_A01].FaultAlarm = bitArray[3];

                    dicGasDatas[ID.GD_A02].HiAlarm = bitArray[8];
                    dicGasDatas[ID.GD_A02].HiHighAlarm = bitArray[9];
                    //dicGasDatas[ID.GD_A02].FaultAlarm = bitArray[11];

                    dicGasDatas[ID.GD_A03].HiAlarm = bitArray[16];
                    dicGasDatas[ID.GD_A03].HiHighAlarm = bitArray[17];
                    //dicGasDatas[ID.GD_A03].FaultAlarm = bitArray[19];

                    dicGasDatas[ID.GD_A04].HiAlarm = bitArray[24];
                    dicGasDatas[ID.GD_A04].HiHighAlarm = bitArray[25];
                    //dicGasDatas[ID.GD_A04].FaultAlarm = bitArray[27];

                    dicGasDatas[ID.GD_A05].HiAlarm = bitArray[32];
                    dicGasDatas[ID.GD_A05].HiHighAlarm = bitArray[33];
                    //dicGasDatas[ID.GD_A05].FaultAlarm = bitArray[35];

                    dicGasDatas[ID.GD_A06].HiAlarm = bitArray[40];
                    dicGasDatas[ID.GD_A06].HiHighAlarm = bitArray[41];
                    //dicGasDatas[ID.GD_A06].FaultAlarm = bitArray[43];

                    dicGasDatas[ID.GD_A07].HiAlarm = bitArray[48];
                    dicGasDatas[ID.GD_A07].HiHighAlarm = bitArray[49];
                    //dicGasDatas[ID.GD_A07].FaultAlarm = bitArray[51];

                    dicGasDatas[ID.GD_B01].HiAlarm = bitArray[96];
                    dicGasDatas[ID.GD_B01].HiHighAlarm = bitArray[97];
                    //dicGasDatas[ID.GD_B01].FaultAlarm = bitArray[99];

                    dicGasDatas[ID.GD_C01].HiAlarm = bitArray[160];
                    dicGasDatas[ID.GD_C01].HiHighAlarm = bitArray[161];
                    //dicGasDatas[ID.GD_C01].FaultAlarm = bitArray[163];

                    dicGasDatas[ID.GD_C02].HiAlarm = bitArray[168];
                    dicGasDatas[ID.GD_C02].HiHighAlarm = bitArray[169];
                    //dicGasDatas[ID.GD_C02].FaultAlarm = bitArray[171];

                    dicGasDatas[ID.GD_C01].PressHiAlarm = bitArray[217];
                    dicGasDatas[ID.GD_C01].PressLoAlarm = bitArray[218];

                    dicGasDatas[ID.GD_D01].HiAlarm = bitArray[224];
                    dicGasDatas[ID.GD_D01].HiHighAlarm = bitArray[225];
                    //dicGasDatas[ID.GD_D01].FaultAlarm = bitArray[227];

                    dicGasDatas[ID.GD_E07].LoAlarm = bitArray[232];
                    dicGasDatas[ID.GD_E07].LoLowAlarm = bitArray[233];
                    dicGasDatas[ID.GD_E07].HiAlarm = bitArray[234];
                    //dicGasDatas[ID.GD_E07].FaultAlarm = bitArray[235];

                    dicGasDatas[ID.GD_H_E08].LoAlarm = bitArray[240];               // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_H_E08].LoLowAlarm = bitArray[241];            // 신규 센서 - 20251106
                    dicGasDatas[ID.GD_H_E08].HiAlarm = bitArray[242];               // 신규 센서 - 20251106

                    dicGasDatas[ID.GD_E01].LoAlarm = bitArray[288];
                    dicGasDatas[ID.GD_E01].LoLowAlarm = bitArray[289];
                    dicGasDatas[ID.GD_E01].HiAlarm = bitArray[290];
                    //dicGasDatas[ID.GD_E01].FaultAlarm = bitArray[291];

                    dicGasDatas[ID.GD_E02].LoAlarm = bitArray[296];
                    dicGasDatas[ID.GD_E02].LoLowAlarm = bitArray[297];
                    dicGasDatas[ID.GD_E02].HiAlarm = bitArray[298];
                    //dicGasDatas[ID.GD_E02].FaultAlarm = bitArray[299];

                    dicGasDatas[ID.GD_E03].LoAlarm = bitArray[304];
                    dicGasDatas[ID.GD_E03].LoLowAlarm = bitArray[305];
                    dicGasDatas[ID.GD_E03].HiAlarm = bitArray[306];
                    //dicGasDatas[ID.GD_E03].FaultAlarm = bitArray[307];

                    dicGasDatas[ID.GD_E04].LoAlarm = bitArray[312];
                    dicGasDatas[ID.GD_E04].LoLowAlarm = bitArray[313];
                    dicGasDatas[ID.GD_E04].HiAlarm = bitArray[314];
                    //dicGasDatas[ID.GD_E04].FaultAlarm = bitArray[315];

                    dicGasDatas[ID.GD_E05].LoAlarm = bitArray[320];
                    dicGasDatas[ID.GD_E05].LoLowAlarm = bitArray[321];
                    dicGasDatas[ID.GD_E05].HiAlarm = bitArray[322];
                    //dicGasDatas[ID.GD_E05].FaultAlarm = bitArray[323];

                    dicGasDatas[ID.GD_E06].LoAlarm = bitArray[328];
                    dicGasDatas[ID.GD_E06].LoLowAlarm = bitArray[329];
                    dicGasDatas[ID.GD_E06].HiAlarm = bitArray[330];
                    //dicGasDatas[ID.GD_E06].FaultAlarm = bitArray[331];

                    dicGasDatas[ID.GD_F01].HiAlarm = bitArray[384];
                    dicGasDatas[ID.GD_F01].HiHighAlarm = bitArray[385];
                    //dicGasDatas[ID.GD_F01].FaultAlarm = bitArray[387];

                    dicGasDatas[ID.GD_F02].HiAlarm = bitArray[392];
                    dicGasDatas[ID.GD_F02].HiHighAlarm = bitArray[393];
                    //dicGasDatas[ID.GD_F02].FaultAlarm = bitArray[395];

                    dicGasDatas[ID.GD_G01].LoAlarm = bitArray[456];
                    dicGasDatas[ID.GD_G01].LoLowAlarm = bitArray[457];
                    dicGasDatas[ID.GD_G01].HiAlarm = bitArray[458];
                    //dicGasDatas[ID.GD_G01].FaultAlarm = bitArray[459];

                    dicGasDatas[ID.GD_G02].LoAlarm = bitArray[464];
                    dicGasDatas[ID.GD_G02].LoLowAlarm = bitArray[465];
                    dicGasDatas[ID.GD_G02].HiAlarm = bitArray[466];
                    //dicGasDatas[ID.GD_G02].FaultAlarm = bitArray[467];

                    dicGasDatas[ID.GD_H01].LoAlarm = bitArray[512];
                    dicGasDatas[ID.GD_H01].LoLowAlarm = bitArray[513];
                    dicGasDatas[ID.GD_H01].HiAlarm = bitArray[514];
                    //dicGasDatas[ID.GD_H01].FaultAlarm = bitArray[515];

                    dicGasDatas[ID.GD_H02].LoAlarm = bitArray[520];
                    dicGasDatas[ID.GD_H02].LoLowAlarm = bitArray[521];
                    dicGasDatas[ID.GD_H02].HiAlarm = bitArray[522];
                    //dicGasDatas[ID.GD_H02].FaultAlarm = bitArray[523];

                    dicGasDatas[ID.GD_F03].HiAlarm = bitArray[552];
                    dicGasDatas[ID.GD_F03].HiHighAlarm = bitArray[553];
                    //dicGasDatas[ID.GD_F03].FaultAlarm = bitArray[555];


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
