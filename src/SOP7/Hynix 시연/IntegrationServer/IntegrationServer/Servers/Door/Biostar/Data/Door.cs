namespace IntegrationServer.Servers.Door.Biostar.Data
{
    class Door
    {
        // 보통(해제), 스케줄잠금, 스케줄개방, 수동잠금, 수동개방
        public enum DoorStatus { Normal = 0, ScheduleClose = 64, ScheduleOpen = 128, ManualClose = 1024, ManualOpen = 2048 }

        private int m_nID = -1;
        private string m_strName = "";
        private int m_nStatus = 0;
        private bool m_isOpened = false;

        public bool IsOpen
        {
            get { return m_isOpened; }
            set { m_isOpened = value; }
        }

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public int Status
        {
            get { return m_nStatus; }
            set { m_nStatus = value; }
        }

        public string GetStatusString()
        {
            if (IsOpen)
                return "열림(" + m_nStatus + ")";

            return "닫힘(" + m_nStatus + ")";
        }
    }
}
