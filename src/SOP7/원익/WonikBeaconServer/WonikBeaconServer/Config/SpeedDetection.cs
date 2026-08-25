using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WonikBeaconServer.Config
{
    public class SpeedDetection : Config
    {
        private string m_strDFS1_IP = "10.6.12.190";
        private int? m_nDFS1_Port = 3100;
        private string m_strDFS2_IP = "10.6.21.190";
        private int? m_nDFS2_Port = 3100;

        // 과속 기준 속도(km/h). 이 값을 "초과"하는 차량만 기록한다. (25 이면 26km/h 부터)
        // WebSOPApp 도 /Detection/RequestSpeedLimit 으로 이 값을 받아 쓰므로,
        // 기준을 바꿀 때는 여기 한 곳만 고치면 된다.
        private int? m_nSpeedLimit = 25;

        public string DFS1_IP
        {
            get { return m_strDFS1_IP; }
            set { m_strDFS1_IP = value; }
        }
        public int? DFS1_Port
        {
            get { return m_nDFS1_Port; }
            set { m_nDFS1_Port = value; }
        }
        public string DFS2_IP
        {
            get { return m_strDFS2_IP; }
            set { m_strDFS2_IP = value; }
        }
        public int? DFS2_Port
        {
            get { return m_nDFS2_Port; }
            set { m_nDFS2_Port = value; }
        }

        /// <summary>과속 기준 속도(km/h). 기록/판정은 이 값 초과일 때만 이뤄진다.</summary>
        public int SpeedLimit
        {
            get { return m_nSpeedLimit ?? 25; }
            set { m_nSpeedLimit = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "SpeedDetection:DFS1_IP", ref m_strDFS1_IP);
            ReadInt(config, "SpeedDetection:DFS1_Port", ref m_nDFS1_Port);
            ReadString(config, "SpeedDetection:DFS2_IP", ref m_strDFS2_IP);
            ReadInt(config, "SpeedDetection:DFS2_Port", ref m_nDFS2_Port);
            ReadInt(config, "SpeedDetection:SpeedLimit", ref m_nSpeedLimit);
        }
    }
}
