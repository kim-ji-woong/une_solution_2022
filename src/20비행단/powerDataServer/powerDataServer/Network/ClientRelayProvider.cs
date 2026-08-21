using Airbase20.DAL;
using Airbase20.Model;
using powerDataServer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TcpLib2;

namespace powerDataServer.Network
{
    public class ClientRelayProvider : ClientServiceProvider
    {
        private enum RelayType { XGIPAMF = 0, GIMACIIPLUS, GIMACDC, GIMACI }

        private PowerDataManager m_powerDataManager = null;
        //private DataManager m_dataManager = null;
        private Relay m_relay = null;

        private bool m_runThread = false;

        Thread m_ConnectionThread = null;
        Thread m_RequestThread = null;

        private int m_nPingCount = 0;

        private UInt16 m_nTransID = 0;

        public ClientRelayProvider(PowerDataManager powerDataManager, Relay relay)
        {
            m_powerDataManager = powerDataManager;
            m_relay = relay;

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
                        if (m_relay.Type == (int)RelayType.XGIPAMF)
                        {
                            nStartAddr = 120;
                            nLength = (UInt16)ID.XGIPAMF_Length;

                            byte[] arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_relay.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (m_relay.Type == (int)RelayType.GIMACIIPLUS)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.GIMACIIPLUS_Length;

                            byte[] arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_relay.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (m_relay.Type == (int)RelayType.GIMACDC)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.GIMACDC_Length;

                            byte[] arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_relay.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }
                        else if (m_relay.Type == (int)RelayType.GIMACI)
                        {
                            nStartAddr = 0;
                            nLength = (UInt16)ID.GIMACI_Length;

                            byte[] arrData = MsgHelper.MakeRequestMsg(ID.FC_ReadInputRegister, m_relay.SlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_nTransID++;
                        }

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
                            if (m_relay != null && m_relay.Port > 0
                                && m_relay.IP != null && m_relay.IP != "")
                            {
                                this.Connect(m_relay.IP, m_relay.Port);
                                Logger.Instance.Write("[INFO] ConnectionThread() : " + m_relay.IP + ":" + m_relay.Port.ToString() + " / " + this.IsConnected);
                            }
                        }
                    }

                    Thread.Sleep(1000);
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

            try
            {
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
                    int nFloatLeng = 4;
                    byte[] arrTemp = new byte[nFloatLeng];

                    // nDataLeng 에 따라 분류
                    if (arrData.Length == ID.XGIPAMF_Length * nRegisterLeng)
                    {
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (0 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_A = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (2 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_B = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (4 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_C = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (6 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_A = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (8 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_B = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (10 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_C = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (20 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Factor = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (22 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ActivePower = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (24 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ReactivePower = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (26 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ActivePowerTotal = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (28 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ReactivePowerTotal = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        if (m_powerDataManager.UpdateRelay(m_relay, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write(strErrorMessage);
                        }
                    }
                    else if (arrData.Length == ID.GIMACIIPLUS_Length * nRegisterLeng)
                    {
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (4 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_A = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (6 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_B = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (8 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_C = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (10 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_A = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (12 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_B = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (14 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_C = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);


                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (22 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Factor = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (24 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ActivePower = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (26 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ReactivePower = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (30 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Frequency = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (32 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ActivePowerTotal = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (34 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ReactivePowerTotal = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        if (m_powerDataManager.UpdateRelay(m_relay, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write(strErrorMessage);
                        }
                    }
                    else if (arrData.Length == ID.GIMACDC_Length * nRegisterLeng)
                    {
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (8 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Frequency = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        if (m_powerDataManager.UpdateRelay(m_relay, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write(strErrorMessage);
                        }
                    }
                    else if (arrData.Length == ID.GIMACI_Length * nRegisterLeng)
                    {
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (4 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_A = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (6 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_B = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (8 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ElectCurrent_C = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (10 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_A = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (12 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_B = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (14 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Volt_C = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        Array.Copy(arrData, (16 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Factor = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (18 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ActivePower = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (20 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ReactivePower = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);

                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (22 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.Frequency = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (24 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ActivePowerTotal = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);
                        arrTemp = new byte[nFloatLeng];
                        Array.Copy(arrData, (26 * nRegisterLeng), arrTemp, 0, nFloatLeng); Array.Reverse(arrTemp);
                        m_relay.ReactivePowerTotal = Math.Round(BitConverter.ToSingle(arrTemp, 0), 2);


                        if (m_powerDataManager.UpdateRelay(m_relay, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write(strErrorMessage);
                        }
                    }
                }

            }
            catch (Exception e)
            {
                Logger.Instance.Write("[ERROR] Relay OnReceiveData() : " + e.Message);
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
                Logger.Instance.Write("[ERROR] Relay SendBytes() : " + e.Message);
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
