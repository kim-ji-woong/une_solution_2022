using Airbase20.DAL;
using Airbase20.Model;
using powerDataServer.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TcpLib2;

namespace powerDataServer.Network
{
    public class ClientPeckProvider : ClientServiceProvider
    {
        private DataManager m_dataManager = null;
        private PowerDataManager m_powerDataManager = null;

        private bool m_runThread = false;

        Thread m_ConnectionThread = null;
        Thread m_RequestThread = null;

        private int m_nPingCount = 0;
        private UInt16 m_nTransID = 0;

        private string m_strIP = "192.168.0.11";
        private int m_nPort = 60068;
        private int m_nSlaveID = 1;

        private Dictionary<int, PeckPower> m_dicPeckPowers = null;



        public ClientPeckProvider(PowerDataManager powerDataManager)
        {
            m_powerDataManager = powerDataManager;
            m_dicPeckPowers = powerDataManager.PeckPowers;

            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);

            Init();
        }

        private void Init()
        {
            string strPeckIP = ConfigurationManager.AppSettings.Get("PECK_IP");
            if (strPeckIP == null || strPeckIP.Length == 0)
                strPeckIP = "192.168.0.11";

            string strPeckPort = ConfigurationManager.AppSettings.Get("PECK_Port");
            if (strPeckPort == null || strPeckPort.Length == 0)
                strPeckPort = "60068";

            string strPeckSlaveID = ConfigurationManager.AppSettings.Get("PECK_SlaveID");
            if (strPeckSlaveID == null || strPeckSlaveID.Length == 0)
                strPeckSlaveID = "1";

            int nPeckPort, nPeckSlaveID;
            int.TryParse(strPeckPort.Trim(), out nPeckPort);
            int.TryParse(strPeckSlaveID.Trim(), out nPeckSlaveID);

            m_strIP = strPeckIP;
            m_nPort = nPeckPort;
            m_nSlaveID = nPeckSlaveID;
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

                        nStartAddr = 0;
                        nLength = (UInt16)ID.PECK_Length;

                        byte[] arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_nSlaveID, m_nTransID, nStartAddr, nLength);
                        SendBytes(arrData);

                        m_nTransID++;


                    }

                    Thread.Sleep(1000);
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
                            this.Connect(m_strIP, m_nPort);
                            Logger.Instance.Write("[INFO] ConnectionThread() : " + m_strIP + ":" + m_nPort.ToString() + " / " + this.IsConnected);
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

            byte[] data = this.ReceivedData;

            if (data == null || data.Length < 10)
                return;

            byte FC = data[7];
            int nDataLeng = data[8];

            byte[] arrData = new byte[nDataLeng];

            Array.Copy(data, 9, arrData, 0, nDataLeng);

            if (FC == ID.FC_ReadInputRegister)
            {
                int nRegisterLeng = 2;
                byte[] arrTemp = new byte[nRegisterLeng];

                if (arrData.Length == ID.PECK_Length * nRegisterLeng)
                {
                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (0 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(1))
                        m_dicPeckPowers[1].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (1 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(2))
                        m_dicPeckPowers[2].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (2 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(3))
                        m_dicPeckPowers[3].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (3 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(4))
                        m_dicPeckPowers[4].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (4 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(5))
                        m_dicPeckPowers[5].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (5 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(6))
                        m_dicPeckPowers[6].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (6 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(7))
                        m_dicPeckPowers[7].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (7 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(8))
                        m_dicPeckPowers[8].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (8 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(9))
                        m_dicPeckPowers[9].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (9 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(10))
                        m_dicPeckPowers[10].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (10 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(11))
                        m_dicPeckPowers[11].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (11 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(12))
                        m_dicPeckPowers[12].PeckValue = BitConverter.ToInt16(arrTemp, 0);

                    arrTemp = new byte[nRegisterLeng];
                    Array.Copy(arrData, (12 * nRegisterLeng), arrTemp, 0, nRegisterLeng); Array.Reverse(arrTemp);
                    if (m_dicPeckPowers.ContainsKey(13))
                        m_dicPeckPowers[13].PeckValue = BitConverter.ToInt16(arrTemp, 0);


                    if (m_powerDataManager.UpdatePeckPowers(m_dicPeckPowers, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write(strErrorMessage);
                    }
                }
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
