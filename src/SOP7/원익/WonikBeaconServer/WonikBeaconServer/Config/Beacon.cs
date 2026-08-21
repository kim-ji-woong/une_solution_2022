using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WonikBeaconServer.Config
{
    public class Beacon : Config
    {
        private string m_strToken = "e2a9a43038d62eb7c98a392f0597da9";
        private string m_strUUID = "574F4E49-4320-514E-4357-4F4E49432051";
        private string m_strAddress = "http://110.165.19.222:8401";

        public string Token
        {
            get { return m_strToken; }
            set { m_strToken = value; }
        }
        public string UUID
        {
            get { return m_strUUID; }
            set { m_strUUID = value; }
        }
        public string Address
        {
            get { return m_strAddress; }
            set { m_strAddress = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Beacon:Token", ref m_strToken);
            ReadString(config, "Beacon:UUID", ref m_strUUID);
            ReadString(config, "Beacon:Address", ref m_strAddress);
        }
    }
}
