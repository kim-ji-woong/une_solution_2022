namespace ParkingDoorMonitor.Models
{
    class DoorData
    {
        private string m_strMachineCode = "";
        private string m_strGateStatus = "";

        public string MachineCode
        {
            get { return m_strMachineCode; }
            set { m_strMachineCode = value; }
        }

        public string GateStatus
        {
            get { return m_strGateStatus; }
            set { m_strGateStatus = value; }
        }
    }
}
