using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace GGH.BLL.Models.Response
{
    public class ResponseAllDoors : MessageResult
    {
        private Dictionary<int, FloorDoors2> m_dicFloorInfos = new Dictionary<int, FloorDoors2>();

        public Dictionary<int, FloorDoors2> FloorInfos
        {
            get { return m_dicFloorInfos; }
            set { m_dicFloorInfos = value; }
        }

        public ResponseAllDoors()
            : base()
        {
        }

        public ResponseAllDoors(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class FloorDoors2
    {
        private int m_nZoneID = -1;
        private List<ETC> m_doors = new List<ETC>();

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public List<ETC> Doors
        {
            get { return m_doors; }
            set { m_doors = value; }
        }
    }
}
