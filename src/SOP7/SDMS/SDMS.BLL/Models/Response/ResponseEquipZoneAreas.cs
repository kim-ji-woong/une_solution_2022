using System.Collections.Generic;

namespace SDMS.BLL.Models.Response
{
    using Model.Spatial;

    public class ResponseEquipZoneAreas : MessageResult
    {
        private int m_nZoneID = -1;
        private List<EquipZoneArea> m_areas = new List<EquipZoneArea>();

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public List<EquipZoneArea> Areas
        {
            get { return m_areas; }
            set { m_areas = value; }
        }

        public ResponseEquipZoneAreas()
        {
        }

        public ResponseEquipZoneAreas(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class EquipZoneArea
    {
        public int EquipZoneID { get; set; }
        public string EquipZoneName { get; set; }
        public int ZoneID { get; set; }
        public List<AreaLine> Lines { get; set; }
    }

    public class AreaLine
    {
        public double X { get; set; }
        public double Z { get; set; }
    }

}
