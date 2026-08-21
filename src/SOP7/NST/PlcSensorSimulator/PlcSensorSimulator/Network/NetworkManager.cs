using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Text;

namespace PlcSensorSimulator.Network
{
    public class NetworkManager
    {
        private bool m_runThread = false;

        private ClientProvider m_provider = null;
        private ClientProvider m_providerAlarm = null;
        private bool shutdownThread = false;
        private IMessageOwner m_messageOwner = null;

        private static NetworkManager m_instance = null;

        public ClientProvider ClientProvider
        {
            get { return m_provider; }
        }

        public NetworkManager(string strIP, int nPort1, int nPort2, IMessageOwner owner)
        {
            m_instance = this;
            m_messageOwner = owner;

            m_provider = new ClientProvider(this);
            m_providerAlarm = new ClientProvider(this);
            RunConnectionThread(strIP, nPort1, nPort2);
        }

        public void RunConnectionThread(string strServerAddr, int nPort1, int nPort2)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(strServerAddr);
            arrDatas.Add(nPort1);
            arrDatas.Add(nPort2);

            Thread t = new Thread(new ParameterizedThreadStart(ConnectionThread));
            t.Start(arrDatas);
        }

        private void ConnectionThread(object arg)
        {
            ArrayList arrDatas = (ArrayList)arg;

            string strServerAddr = (string)arrDatas[0];
            int nPort1 = (int)arrDatas[1];
            int nPort2 = (int)arrDatas[2];

            while (!shutdownThread)
            {
                if (!m_provider.IsConnected)
                {
                    if (nPort1 > 0)
                    {
                        if (m_provider.Connect(strServerAddr, nPort1))
                            System.Diagnostics.Trace.WriteLine("Normal Provider Connection Success");
                    }
                }

                if (!m_providerAlarm.IsConnected)
                {
                    if (nPort2 > 0)
                    {
                        if (m_providerAlarm.Connect(strServerAddr, nPort2))
                            System.Diagnostics.Trace.WriteLine("Alarm Provider Connection Success");
                    }
                }

                Thread.Sleep(1000);
            }
        }

        public void ReleaseThread()
        {
            shutdownThread = true;
        }

        public string Send(ArrayList arrDatas, bool isAlarm)
        {
            ClientProvider provider = isAlarm ? m_providerAlarm : m_provider;

            if (provider.IsConnected == false)
                return null;

            string str = isAlarm ? "#@E,PLC01" : "#@D,PLC01";
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount;i+=2)
            {
                string strSensorCode = (string)arrDatas[i];
                double sensorValue = (double)arrDatas[i + 1];

                str += string.Format(",{0}&{1:F2}", strSensorCode, sensorValue);
            }

            byte[] bytes = Encoding.UTF8.GetBytes(str);

            if (provider.Send(bytes, 0, bytes.Length) > 0)
                return str;

            return "서버에 전송할 수 없습니다.";
        }

        public void OnReceive(string str)
        {
            m_messageOwner.OnReceive(str);
        }
    }
}
