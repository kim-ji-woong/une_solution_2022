using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace GGH.BLL.Models.Response
{
    public class ResponseExitList : MessageResult
    {
        private Dictionary<int, FloorExit> m_dicFloorInfos = new Dictionary<int, FloorExit>();

        public Dictionary<int, FloorExit> FloorInfos
        {
            get { return m_dicFloorInfos; }
            set { m_dicFloorInfos = value; }
        }

        public ResponseExitList()
            : base()
        {
        }

        public ResponseExitList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class FloorExit
    {
        private int m_nZoneID = -1;
        private List<ETC> m_exitList = new List<ETC>();

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public List<ETC> ExitList
        {
            get { return m_exitList; }
            set { m_exitList = value; }
        }
    }
}
