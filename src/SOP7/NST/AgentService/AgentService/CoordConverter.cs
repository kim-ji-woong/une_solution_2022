using System.Collections.Generic;
using SDMS.Model.Spatial;

namespace AgentService
{
    public class CoordConverter
    {
        // Key : ZoneID
        private Dictionary<int, ZoneImageCoord> m_dicZoneImageCoords = new Dictionary<int, ZoneImageCoord>();
        // Key : FloorIndex(1은 1층, 2는 2층)
        // Value : ZoneID
        private Dictionary<int, int> m_dicZoneFloorIndex = new Dictionary<int, int>();

        public bool ReadZoneImageCoord(Common.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager, out string strErrorMessage)
        {
            if (ReadZoneFloorIndex(sdmsDataManager, out strErrorMessage) == false)
                return false;

            string strTarget = "ZoneImageCoord";
            bool isNullable;
            string strCondition = string.Format("{0} like '{1}%'", Common.Model.Option.Options.GetFieldName(Common.Model.Option.Options.Fields.PropertyName, out isNullable), strTarget);

            List<Common.Model.Option.Options> options = dataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return false;

            foreach (var option in options)
            {
                string strZoneID = option.PropertyName.Substring(strTarget.Length + 1);
                strZoneID = strZoneID.Substring(0, strZoneID.Length - 1).Trim();

                int nZoneID;

                if (int.TryParse(strZoneID, out nZoneID))
                {
                    double x13d, y13d, x23d, y23d;
                    int x1Image, y1Image, x2Image, y2Image;

                    if (GetZoneImageCoord(option.PropertyValue, out x13d, out y13d, out x1Image, out y1Image, out x23d, out y23d, out x2Image, out y2Image))
                    {
                        ZoneImageCoord zoneImageCoord = new ZoneImageCoord(nZoneID, x13d, y13d, x1Image, y1Image, x23d, y23d, x2Image, y2Image);
                        m_dicZoneImageCoords[nZoneID] = zoneImageCoord;
                    }
                    else
                    {
                        strErrorMessage = "잘못된 데이터가 존재합니다. ZoneID : " + nZoneID.ToString() + ", " + option.PropertyValue;
                        return false;
                    }
                }
            }

            return true;
        }
  
        public bool ConvertCoord(int nLevelID, int x, int y, out double _x, out double _y, out int nZoneID)
        {
            _x = _y = 0;
            nZoneID = 0;

            if (m_dicZoneFloorIndex.TryGetValue(nLevelID - 1, out nZoneID) == false)
                return false;

            ZoneImageCoord zoneImageCoord;

            if (m_dicZoneImageCoords.TryGetValue(nZoneID, out zoneImageCoord) == false)
                return false;

            double dWidth = zoneImageCoord.X23D - zoneImageCoord.X13D;
            double dHeight = zoneImageCoord.Y23D - zoneImageCoord.Y13D;
            int nWidth = zoneImageCoord.X2Image - zoneImageCoord.X1Image;
            int nHeight = zoneImageCoord.Y2Image - zoneImageCoord.Y1Image;

            int w = x - zoneImageCoord.X1Image;
            int h = y - zoneImageCoord.Y1Image;

            double _3dWidth = dWidth * w / nWidth;
            double _3dHeight = dHeight * h / nHeight;

            _x = zoneImageCoord.X13D + _3dWidth;
            _y = zoneImageCoord.Y13D + _3dHeight;
            return true;
        }

        private bool ReadZoneFloorIndex(SDMS.IDAL.IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} is not NULL and {1} is NULL", Zone.GetFieldName(Zone.Fields.FloorIndex, out isNullable), Zone.GetFieldName(Zone.Fields.AddFloor, out isNullable));
            List<Zone> zones = dataManager.GetSelectManager().SelectZones(null, strCondition, out strErrorMessage);

            if (zones == null)
                return false;

            foreach (Zone zone in zones)
            {
                m_dicZoneFloorIndex[(int)zone.FloorIndex] = zone.ID;
            }

            return true;
        }

        private bool GetZoneImageCoord(string strValue, out double x13d, out double y13d, out int x1Image, out int y1Image, out double x23d, out double y23d, out int x2Image, out int y2Image)
        {
            x13d = y13d = x23d = y23d = 0;
            x1Image = y1Image = x2Image = y2Image = 0;

            if (strValue == null)
                return false;

            string[] tokens = strValue.Split(',');

            if (tokens.Length != 8)
                return false;

            if (double.TryParse(tokens[0].Trim(), out x13d) == false || double.TryParse(tokens[1].Trim(), out y13d) == false)
                return false;

            if (int.TryParse(tokens[2].Trim(), out x1Image) == false || int.TryParse(tokens[3].Trim(), out y1Image) == false)
                return false;

            if (double.TryParse(tokens[4].Trim(), out x23d) == false || double.TryParse(tokens[5].Trim(), out y23d) == false)
                return false;

            if (int.TryParse(tokens[6].Trim(), out x2Image) == false || int.TryParse(tokens[7].Trim(), out y2Image) == false)
                return false;

            return true;
        }
    }

    internal class ZoneImageCoord
    {
        private int m_nZoneID = -1;
        private double m_3dX1 = 0;
        private double m_3dY1 = 0;
        private double m_3dX2 = 0;
        private double m_3dY2 = 0;
        private int m_imageX1 = 0;
        private int m_imageY1 = 0;
        private int m_imageX2 = 0;
        private int m_imageY2 = 0;

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public double X13D
        {
            get { return m_3dX1; }
            set { m_3dX1 = value; }
        }

        public double Y13D
        {
            get { return m_3dY1; }
            set { m_3dY1 = value; }
        }

        public double X23D
        {
            get { return m_3dX2; }
            set { m_3dX2 = value; }
        }

        public double Y23D
        {
            get { return m_3dY2; }
            set { m_3dY2 = value; }
        }

        public int X1Image
        {
            get { return m_imageX1; }
            set { m_imageX1 = value; }
        }

        public int Y1Image
        {
            get { return m_imageY1; }
            set { m_imageY1 = value; }
        }

        public int X2Image
        {
            get { return m_imageX2; }
            set { m_imageX2 = value; }
        }

        public int Y2Image
        {
            get { return m_imageY2; }
            set { m_imageY2 = value; }
        }

        public ZoneImageCoord()
        {
        }

        public ZoneImageCoord(int nZoneID, double x13d, double y13d, int x1Image, int y1Image, double x23d, double y23d, int x2Image, int y2Image)
        {
            m_nZoneID = nZoneID;

            m_3dX1 = x13d;
            m_3dY1 = y13d;
            m_imageX1 = x1Image;
            m_imageY1 = y1Image;
            m_3dX2 = x23d;
            m_3dY2 = y23d;
            m_imageX2 = x2Image;
            m_imageY2 = y2Image;
        }
    }
}
