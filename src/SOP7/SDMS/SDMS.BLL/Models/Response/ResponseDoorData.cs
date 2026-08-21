using SDMS.Model.Sensor;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Response
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

    // 화재시 열리지 않은 출입문 목록
    public class ResponseDoorStatus : MessageResult
    {
        private Dictionary<int, FloorDoors> m_dicFloorInfos = new Dictionary<int, FloorDoors>();

        public Dictionary<int, FloorDoors> FloorInfos
        {
            get { return m_dicFloorInfos; }
            set { m_dicFloorInfos = value; }
        }

        public ResponseDoorStatus()
            : base()
        {
        }

        public ResponseDoorStatus(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class FloorDoors
    {
        public enum DoorStatus { Opened = 0, Closed = 1 };

        private int m_nZoneID = -1;
        private string m_strFloorName = "";
        private int m_nTotalDoorCount = 0;
        private List<ETC> m_closedDoors = new List<ETC>();

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public string FloorName
        {
            get { return m_strFloorName; }
            set { m_strFloorName = value; }
        }

        public int TotalDoorCount
        {
            get { return m_nTotalDoorCount; }
            set { m_nTotalDoorCount = value; }
        }

        public List<ETC> ClosedDoors
        {
            get { return m_closedDoors; }
            set { m_closedDoors = value; }
        }
    }
}
