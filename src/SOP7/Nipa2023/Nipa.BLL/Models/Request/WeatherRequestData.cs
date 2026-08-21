using System.Collections.Generic;

namespace Nipa.BLL.Models.Request
{
    public class RequestCurrentWeatherDatas
    {
        private List<int> m_siteIDs = new List<int>();

        public List<int> SiteIDs
        {
            get { return m_siteIDs; }
            set { m_siteIDs = value; }
        }
    }
}
