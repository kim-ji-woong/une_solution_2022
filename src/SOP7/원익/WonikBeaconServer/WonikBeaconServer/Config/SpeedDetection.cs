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

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "SpeedDetection:DFS1_IP", ref m_strDFS1_IP);
            ReadInt(config, "SpeedDetection:DFS1_Port", ref m_nDFS1_Port);
            ReadString(config, "SpeedDetection:DFS2_IP", ref m_strDFS2_IP);
            ReadInt(config, "SpeedDetection:DFS2_Port", ref m_nDFS2_Port);
        }
    }
}
