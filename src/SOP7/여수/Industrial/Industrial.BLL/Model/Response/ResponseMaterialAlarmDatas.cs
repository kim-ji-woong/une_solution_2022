using System.Collections.Generic;
using SensorServer.Model.Yeosu.External;

namespace Industrial.BLL.Model.Response
{
    public class ResponseMaterialAlarmDatas : MessageResult
    {
        private List<MaterialLink> m_materialLinks = new List<MaterialLink>();

        public List<MaterialLink> MaterialLinks
        {
            get { return m_materialLinks; }
            set { m_materialLinks = value; }
        }

        public ResponseMaterialAlarmDatas()
            : base()
        {
        }

        public ResponseMaterialAlarmDatas(bool success, string message)
            : base(success, message)
        {
        }
    }
}
