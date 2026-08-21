using System.Collections.Generic;
using GGH.Model;

namespace GGH.BLL.Models.Response
{
    public class ResponseParkingGateList : MessageResult
    {
        private List<ParkingGate> m_gateList = new List<ParkingGate>();

        public List<ParkingGate> GateList
        {
            get { return m_gateList; }
            set { m_gateList = value; }
        }

        public ResponseParkingGateList()
            : base()
        {
        }

        public ResponseParkingGateList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
