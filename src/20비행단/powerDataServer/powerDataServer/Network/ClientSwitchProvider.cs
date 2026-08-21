using Airbase20.DAL;
using Airbase20.Model;
using powerDataServer.Data;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TcpLib2;

namespace powerDataServer.Network
{
    public class ClientSwitchProvider : ClientServiceProvider
    {
        private enum SwitchType { AutoPAD = 0, Multi }

        //private DataManager m_dataManager = null;
        private PowerDataManager m_powerDataManager = null;
        private SwitchData m_switchData = null;

        private bool m_runThread = false;

        Thread m_ConnectionThread = null;
        Thread m_RequestThread = null;

        private int m_nPingCount = 0;

        private UInt16 m_nTransID = 0;

        public ClientSwitchProvider(PowerDataManager powerDataManager, SwitchData switchData)
        {
            m_powerDataManager = powerDataManager;
            m_switchData = switchData;

            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
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

        private void RequestThread()
        {
            while (m_runThread)
            {
                try
                {
                    if (this.IsConnected)
                    {
                        UInt16 nStartAddr, nLength;

                        // 타입에 따라 요청
                        if (m_switchData.Type == (int)SwitchType.AutoPAD)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.AutoPAD_Discrete_Length;

                            byte[] arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadDiscrete, m_switchData.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(300);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.AutoPAD_Register_Length;

                            arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_switchData.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;

                        }   
                        else if (m_switchData.Type == (int)SwitchType.Multi)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.Multi_Discrete_Length1;

                            byte[] arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadDiscrete, m_switchData.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(300);

                            nStartAddr = nLength;
                            nLength = (UInt16)ID.Multi_Discrete_Length2;

                            arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadDiscrete, m_switchData.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(300);

                            nStartAddr = 0;
                            nLength = (UInt16)ID.Multi_Register_Length1;

                            arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_switchData.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                            Thread.Sleep(300);

                            nStartAddr = nLength;
                            nLength = (UInt16)ID.Multi_Register_Length2;

                            arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_switchData.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("[ERROR] RequestThread() : " + e.Message);
                }
            }
        }

        private void ConnectionThread()
        {
            byte[] pingBytes = new byte[] { 0x00 };

            while (m_runThread)
            {
                try
                {
                    if (!this.IsConnected)
                    {
                        lock (this)
                        {
                            if (m_switchData != null && m_switchData.Port > 0
                                && m_switchData.IP != null && m_switchData.IP != "")
                            {
                                this.Connect(m_switchData.IP, m_switchData.Port);
                                Logger.Instance.Write("[INFO] ConnectionThread() : " + m_switchData.IP + ":" + m_switchData.Port.ToString() + " / " + this.IsConnected);
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

        public override void OnDropConnection()
        {

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



                // 타입에 따라
                if (m_switchData.Type == (int)SwitchType.AutoPAD)
                {
                    if (FC == ID.FC_ReadDiscrete)
                    {
                        BitArray bitArray = new BitArray(arrData);

                        if (bitArray.Length != ID.AutoPAD_Discrete_Length)
                            return;

                        m_switchData.SwitchDetails[1].OpenClose = bitArray[4];

                        m_switchData.SwitchDetails[1].FI_Auto_A = bitArray[8];
                        m_switchData.SwitchDetails[1].FI_Auto_B = bitArray[9];
                        m_switchData.SwitchDetails[1].FI_Auto_C = bitArray[10];
                        m_switchData.SwitchDetails[1].FI_Auto_N = bitArray[11];

                        m_switchData.SwitchDetails[1].FI_Manual_A = bitArray[12];
                        m_switchData.SwitchDetails[1].FI_Manual_B = bitArray[13];
                        m_switchData.SwitchDetails[1].FI_Manual_C = bitArray[14];
                        m_switchData.SwitchDetails[1].FI_Manual_N = bitArray[15];

                        m_switchData.SwitchDetails[1].Break_A = bitArray[16];
                        m_switchData.SwitchDetails[1].Break_B = bitArray[17];
                        m_switchData.SwitchDetails[1].Break_C = bitArray[18];



                        m_switchData.SwitchDetails[2].OpenClose = bitArray[20];

                        m_switchData.SwitchDetails[2].FI_Auto_A = bitArray[24];
                        m_switchData.SwitchDetails[2].FI_Auto_B = bitArray[25];
                        m_switchData.SwitchDetails[2].FI_Auto_C = bitArray[26];
                        m_switchData.SwitchDetails[2].FI_Auto_N = bitArray[27];

                        m_switchData.SwitchDetails[2].FI_Manual_A = bitArray[28];
                        m_switchData.SwitchDetails[2].FI_Manual_B = bitArray[29];
                        m_switchData.SwitchDetails[2].FI_Manual_C = bitArray[30];
                        m_switchData.SwitchDetails[2].FI_Manual_N = bitArray[31];

                        m_switchData.SwitchDetails[2].Break_A = bitArray[32];
                        m_switchData.SwitchDetails[2].Break_B = bitArray[33];
                        m_switchData.SwitchDetails[2].Break_C = bitArray[34];



                        m_switchData.SwitchDetails[3].OpenClose = bitArray[36];

                        m_switchData.SwitchDetails[3].FI_Auto_A = bitArray[40];
                        m_switchData.SwitchDetails[3].FI_Auto_B = bitArray[41];
                        m_switchData.SwitchDetails[3].FI_Auto_C = bitArray[42];
                        m_switchData.SwitchDetails[3].FI_Auto_N = bitArray[43];

                        m_switchData.SwitchDetails[3].FI_Manual_A = bitArray[44];
                        m_switchData.SwitchDetails[3].FI_Manual_B = bitArray[45];
                        m_switchData.SwitchDetails[3].FI_Manual_C = bitArray[46];
                        m_switchData.SwitchDetails[3].FI_Manual_N = bitArray[47];

                        m_switchData.SwitchDetails[3].Break_A = bitArray[48];
                        m_switchData.SwitchDetails[3].Break_B = bitArray[49];
                        m_switchData.SwitchDetails[3].Break_C = bitArray[50];




                        m_switchData.SwitchDetails[4].OpenClose = bitArray[52];

                        m_switchData.SwitchDetails[4].FI_Auto_A = bitArray[56];
                        m_switchData.SwitchDetails[4].FI_Auto_B = bitArray[57];
                        m_switchData.SwitchDetails[4].FI_Auto_C = bitArray[58];
                        m_switchData.SwitchDetails[4].FI_Auto_N = bitArray[59];

                        m_switchData.SwitchDetails[4].FI_Manual_A = bitArray[60];
                        m_switchData.SwitchDetails[4].FI_Manual_B = bitArray[61];
                        m_switchData.SwitchDetails[4].FI_Manual_C = bitArray[62];
                        m_switchData.SwitchDetails[4].FI_Manual_N = bitArray[63];

                        m_switchData.SwitchDetails[4].Break_A = bitArray[64];
                        m_switchData.SwitchDetails[4].Break_B = bitArray[65];
                        m_switchData.SwitchDetails[4].Break_C = bitArray[66];

                        if (m_powerDataManager.UpdateSwitchDetails(m_switchData.SwitchDetails, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write(strErrorMessage);
                        }
                    }
                    else if (FC == ID.FC_ReadInputRegister)
                    {
                        if (arrData.Length != ID.AutoPAD_Register_Length * nRegisterLeng)
                            return;

                        byte[] arrTemp = new byte[nRegisterLeng];

                        Array.Copy(arrData, 0, arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].Phase_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (1 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].Phase_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (2 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].Phase_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (3 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].Phase_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (4 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].MaxLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (5 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].MaxLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (6 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].MaxLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (7 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (8 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (9 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (10 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].Volt_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (11 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].Volt_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (12 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].Volt_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (13 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (14 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (15 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (16 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (20 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].AppartPower_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (21 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].AppartPower_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (22 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].AppartPower_C = BitConverter.ToInt16(arrTemp, 0);







                        Array.Copy(arrData, (23 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].Phase_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (24 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].Phase_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (25 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].Phase_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (26 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].Phase_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (27 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].MaxLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (28 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].MaxLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (29 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].MaxLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (30 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (31 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (32 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (33 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].Volt_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (34 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].Volt_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (35 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].Volt_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (36 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (37 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (38 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (39 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (43 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].AppartPower_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (44 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].AppartPower_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (45 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].AppartPower_C = BitConverter.ToInt16(arrTemp, 0);










                        Array.Copy(arrData, (46 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].Phase_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (47 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].Phase_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (48 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].Phase_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (49 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].Phase_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (50 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].MaxLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (51 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].MaxLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (52 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].MaxLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (53 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (54 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (55 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (56 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].Volt_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (57 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].Volt_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (58 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].Volt_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (59 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (60 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (61 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (62 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (66 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].AppartPower_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (67 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].AppartPower_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (68 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].AppartPower_C = BitConverter.ToInt16(arrTemp, 0);









                        Array.Copy(arrData, (69 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].Phase_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (70 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].Phase_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (71 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].Phase_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (72 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].Phase_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (73 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].MaxLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (74 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].MaxLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (75 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].MaxLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (76 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (77 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (78 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (79 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].Volt_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (80 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].Volt_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (81 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].Volt_C = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (82 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (83 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (84 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (85 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (89 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].AppartPower_A = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (90 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].AppartPower_B = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (91 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].AppartPower_C = BitConverter.ToInt16(arrTemp, 0);




                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (92 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].MaxLoad_N = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (93 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].MaxLoad_N = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (94 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].MaxLoad_N = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (95 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].MaxLoad_N = BitConverter.ToInt16(arrTemp, 0);

                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (96 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[1].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (97 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[2].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (98 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[3].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);
                        arrTemp = new byte[nRegisterLeng];
                        Array.Copy(arrData, (99 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                        m_switchData.SwitchDetails[4].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);

                        if (m_powerDataManager.UpdateSwitchDetails(m_switchData.SwitchDetails, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write(strErrorMessage);
                        }
                    }
                }
                else if (m_switchData.Type == (int)SwitchType.Multi)
                {
                    if (FC == ID.FC_ReadDiscrete)
                    {
                        BitArray bitArray = new BitArray(arrData);

                        // nDataLeng 에 따라 분류
                        if (bitArray.Length == ID.Multi_Discrete_Length1)
                        {
                            m_switchData.SwitchDetails[1].OpenClose = bitArray[30];

                            m_switchData.SwitchDetails[1].TideFlow_Fwd = bitArray[43];
                            m_switchData.SwitchDetails[1].TideFlow_Rev = bitArray[44];

                            m_switchData.SwitchDetails[1].FailFlow_Fwd = bitArray[55];
                            m_switchData.SwitchDetails[1].FailFlow_Rev = bitArray[56];



                            m_switchData.SwitchDetails[2].OpenClose = bitArray[60];

                            m_switchData.SwitchDetails[2].TideFlow_Fwd = bitArray[73];
                            m_switchData.SwitchDetails[2].TideFlow_Rev = bitArray[74];

                            m_switchData.SwitchDetails[2].FailFlow_Fwd = bitArray[85];
                            m_switchData.SwitchDetails[2].FailFlow_Rev = bitArray[86];



                            m_switchData.SwitchDetails[3].OpenClose = bitArray[90];


                            if (m_powerDataManager.UpdateSwitchDetails(m_switchData.SwitchDetails, out strErrorMessage) == false)
                            {
                                Logger.Instance.Write(strErrorMessage);
                            }
                        }
                        else if (bitArray.Length == ID.Multi_Discrete_Length2 + 2)
                        {
                            m_switchData.SwitchDetails[3].TideFlow_Fwd = bitArray[7];
                            m_switchData.SwitchDetails[3].TideFlow_Rev = bitArray[8];

                            m_switchData.SwitchDetails[3].FailFlow_Fwd = bitArray[19];
                            m_switchData.SwitchDetails[3].FailFlow_Rev = bitArray[20];




                            m_switchData.SwitchDetails[4].OpenClose = bitArray[24];

                            m_switchData.SwitchDetails[4].TideFlow_Fwd = bitArray[37];
                            m_switchData.SwitchDetails[4].TideFlow_Rev = bitArray[38];

                            m_switchData.SwitchDetails[4].FailFlow_Fwd = bitArray[49];
                            m_switchData.SwitchDetails[4].FailFlow_Rev = bitArray[50];

                            if (m_powerDataManager.UpdateSwitchDetails(m_switchData.SwitchDetails, out strErrorMessage) == false)
                            {
                                Logger.Instance.Write(strErrorMessage);
                            }
                        }

                    }
                    else if (FC == ID.FC_ReadInputRegister)
                    {
                    
                        byte[] arrTemp = new byte[nRegisterLeng];

                        // nDataLeng 에 따라 분류
                        if (arrData.Length == ID.Multi_Register_Length1 * nRegisterLeng)
                        {
                            Array.Copy(arrData, (25 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            short nElectCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (26 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            short nElectCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (27 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            short nElectCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (28 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            short nElectCurrent_N = BitConverter.ToInt16(arrTemp, 0);

                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (29 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            short nVolt_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (30 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            short nVolt_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (31 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            short nVolt_C = BitConverter.ToInt16(arrTemp, 0);


                            m_switchData.SwitchDetails[1].ElectCurrent_A = nElectCurrent_A;
                            m_switchData.SwitchDetails[1].ElectCurrent_B = nElectCurrent_B;
                            m_switchData.SwitchDetails[1].ElectCurrent_C = nElectCurrent_C;
                            m_switchData.SwitchDetails[1].ElectCurrent_N = nElectCurrent_N;
                            m_switchData.SwitchDetails[1].Volt_A = nVolt_A;
                            m_switchData.SwitchDetails[1].Volt_B = nVolt_B;
                            m_switchData.SwitchDetails[1].Volt_C = nVolt_C;

                            m_switchData.SwitchDetails[2].ElectCurrent_A = nElectCurrent_A;
                            m_switchData.SwitchDetails[2].ElectCurrent_B = nElectCurrent_B;
                            m_switchData.SwitchDetails[2].ElectCurrent_C = nElectCurrent_C;
                            m_switchData.SwitchDetails[2].ElectCurrent_N = nElectCurrent_N;
                            m_switchData.SwitchDetails[2].Volt_A = nVolt_A;
                            m_switchData.SwitchDetails[2].Volt_B = nVolt_B;
                            m_switchData.SwitchDetails[2].Volt_C = nVolt_C;

                            m_switchData.SwitchDetails[3].ElectCurrent_A = nElectCurrent_A;
                            m_switchData.SwitchDetails[3].ElectCurrent_B = nElectCurrent_B;
                            m_switchData.SwitchDetails[3].ElectCurrent_C = nElectCurrent_C;
                            m_switchData.SwitchDetails[3].ElectCurrent_N = nElectCurrent_N;
                            m_switchData.SwitchDetails[3].Volt_A = nVolt_A;
                            m_switchData.SwitchDetails[3].Volt_B = nVolt_B;
                            m_switchData.SwitchDetails[3].Volt_C = nVolt_C;

                            m_switchData.SwitchDetails[4].ElectCurrent_A = nElectCurrent_A;
                            m_switchData.SwitchDetails[4].ElectCurrent_B = nElectCurrent_B;
                            m_switchData.SwitchDetails[4].ElectCurrent_C = nElectCurrent_C;
                            m_switchData.SwitchDetails[4].ElectCurrent_N = nElectCurrent_N;
                            m_switchData.SwitchDetails[4].Volt_A = nVolt_A;
                            m_switchData.SwitchDetails[4].Volt_B = nVolt_B;
                            m_switchData.SwitchDetails[4].Volt_C = nVolt_C;



                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (66 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (67 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (68 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (69 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);

                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (81 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (82 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (83 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (84 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[1].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);



                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (112 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (113 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (114 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (115 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);

                            if (m_powerDataManager.UpdateSwitchDetails(m_switchData.SwitchDetails, out strErrorMessage) == false)
                            {
                                Logger.Instance.Write(strErrorMessage);
                            }

                        }
                        else if (arrData.Length == ID.Multi_Register_Length2 * nRegisterLeng)
                        {
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (7 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (8 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (9 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (10 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[2].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);



                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (38 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (39 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (40 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (41 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);

                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (53 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (54 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (55 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (56 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[3].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);




                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (84 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].AverageLoad_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (85 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].AverageLoad_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (86 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].AverageLoad_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (87 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].AverageLoad_N = BitConverter.ToInt16(arrTemp, 0);

                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (99 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].FailCurrent_A = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (100 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].FailCurrent_B = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (101 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].FailCurrent_C = BitConverter.ToInt16(arrTemp, 0);
                            arrTemp = new byte[nRegisterLeng];
                            Array.Copy(arrData, (102 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                            m_switchData.SwitchDetails[4].FailCurrent_N = BitConverter.ToInt16(arrTemp, 0);

                            if (m_powerDataManager.UpdateSwitchDetails(m_switchData.SwitchDetails, out strErrorMessage) == false)
                            {
                                Logger.Instance.Write(strErrorMessage);
                            }
                        }
                    }
                }



            }
            catch (Exception e)
            {
                Logger.Instance.Write("[ERROR] Switch OnReceiveData() : " + e.Message);
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
                Logger.Instance.Write("[ERROR] Switch SendBytes() : " + e.Message);
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
    }
}
