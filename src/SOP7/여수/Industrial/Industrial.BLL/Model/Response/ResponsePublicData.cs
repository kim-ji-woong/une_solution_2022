using SensorServer.Model.Yeosu.Public;
using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Response
{
    public class ResponsePublicData : MessageResult
    {
        // Kma_Asos (기상청)
        private List<KmaAsos> m_kmaAsos = new List<KmaAsos>();

        // AirKorea (대기)
        private List<AirDataHistory> m_airDataHistory = new List<AirDataHistory>();

        // CleanSYS (굴뚝)
        private List<CleanSYS> m_cleanSYS = new List<CleanSYS>();
        private List<Dictionary<string, List<CleanSYS>>> m_sortedCleanSYSs = new List<Dictionary<string, List<CleanSYS>>>();

        // AirKorea 측정소 정보
        private List<AirNode> m_airNode = new List<AirNode>();

        public List<KmaAsos> KmaAsos
        {
            get { return m_kmaAsos; }
            set { m_kmaAsos = value;}
        }

        public List<AirDataHistory> AirDataHistories
        {
            get { return m_airDataHistory; }
            set { m_airDataHistory = value; }
        }

        public List<CleanSYS> CleanSYSs
        {
            get { return m_cleanSYS; }
            set { m_cleanSYS = value; }
        }

        public List<Dictionary<string, List<CleanSYS>>> SortedCleanSYSs
        {
            get { return m_sortedCleanSYSs; }
            set { m_sortedCleanSYSs = value; }
        }

        public List<AirNode> AirNodes
        {
            get { return m_airNode; }
            set { m_airNode = value; }
        }

        public ResponsePublicData() : base() { }

        public ResponsePublicData(bool success, string message) : base(success, message) { }
    }
}
