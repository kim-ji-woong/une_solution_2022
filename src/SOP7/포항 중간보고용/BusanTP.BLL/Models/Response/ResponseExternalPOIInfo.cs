using System.Collections.Generic;
using BusanTP.Model;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseExternalPOIInfo : MessageResult
    {
        List<POIInfo> m_poiInfos = new List<POIInfo>();
        
        public List<POIInfo> POIInfos
        {
            get { return m_poiInfos; }
            set { m_poiInfos = value; }
        }
        
        public ResponseExternalPOIInfo() : base()
        {
        }
        
        public ResponseExternalPOIInfo(bool success, string message) : base(success, message)
        {
        }
    }
}