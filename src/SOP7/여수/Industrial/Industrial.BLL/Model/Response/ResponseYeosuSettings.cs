using SensorServer.Model.Yeosu.Option;
using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Response
{
    public class ResponseYeosuSettings : MessageResult
    {
        private List<OptionSDMS> m_responseYeosuSettings = new List<OptionSDMS>();

        public List<OptionSDMS> YeosuSettings
        {
            get { return m_responseYeosuSettings; }
        }

        private string m_strUseReceiveAtmosphere = null;
        private string m_strUseReceiveWater = null;
        private string m_strUseReceiveVOC = null;
        private string m_strUseReceiveOU = null;

        public string UseReceiveAtmosphere
        {
            get { return m_strUseReceiveAtmosphere; }
            set { m_strUseReceiveAtmosphere = value; }
        }

        public string UseReceiveWater
        {
            get { return m_strUseReceiveWater; }
            set { m_strUseReceiveWater = value; }
        }

        public string UseReceiveVOC
        {
            get { return m_strUseReceiveVOC; }
            set { m_strUseReceiveVOC = value; }
        }

        public string UseReceiveOU
        {
            get { return m_strUseReceiveOU; }
            set { m_strUseReceiveOU = value; }
        }

    }

    public class ResponseExcelInfo : MessageResult
    {
        private byte[] m_bytes = null;

        public byte[] Bytes
        {
            get { return m_bytes; }
            set { m_bytes = value; }
        }
    }
}
