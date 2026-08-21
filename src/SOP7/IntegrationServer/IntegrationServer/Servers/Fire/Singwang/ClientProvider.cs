using System.Collections.Generic;
using System.Threading;

namespace IntegrationServer.Servers.Fire.Singwang
{
    using Datas.Modbus;
    using Managers;

    class ClientProvider : ReadInputRegisterProvider
    {
        private Dictionary<string, SensorTagGroup> m_sensorTagGroups = null;
        private int m_nSlaveID = -1;

        public ClientProvider(SingwangManager mgr, string strServerIP, Dictionary<string, SensorTagGroup> sensorTagGroups, int slaveID)
            : base(mgr, strServerIP)
        {
            m_sensorTagGroups = sensorTagGroups;
            m_nSlaveID = slaveID;
            //m_onlyEventLog = false;
        }

        protected override void ProcessData(List<short> received, short startAddr, byte[] bytes)
        {
            SingwangManager mgr = (SingwangManager)m_parentManager;

            int len = received.Count;

            for (int i=0;i<len;i++)
            {
                mgr.CheckAlarm(received[i], startAddr + i);
            }
        }

        protected override void SendRequest()
        {
            if (this.IsConnected == false)
                return;

            foreach (KeyValuePair<string, SensorTagGroup> pair in m_sensorTagGroups)
            {
                if (!m_runThread)
                    return;

                SensorTagGroup sensorTagGroup = pair.Value;

                ushort startAddr = (ushort)sensorTagGroup.MinTagNo;
                // 데이터 읽을 갯수
                ushort length = (ushort)(sensorTagGroup.MaxTagNo - sensorTagGroup.MinTagNo + 1);

                byte[] arrData = MakeRequestMsg(m_functionCode, m_nSlaveID, m_transID++, startAddr, length);
                SendBytes(arrData);

                Thread.Sleep(100);
            }
        }
    }
}
