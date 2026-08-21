using System.Collections.Generic;

namespace Nipa.BLL.Models.Response
{
    public class ResponseOptions : MessageResult
    {
        private Option3DNormal m_option3DNormal = new Option3DNormal();
        private Option3DSensor m_option3DSensor = new Option3DSensor();
        private OptionSopNormal m_optionSopNormal = new OptionSopNormal();

        // 3D 관제 시스템 / 일반
        public Option3DNormal Option3DNormal
        {
            get { return m_option3DNormal; }
            set { m_option3DNormal = value; }
        }

        // 3D 관제 시스템 / 센서감지관리
        public Option3DSensor Option3DSensor
        {
            get { return m_option3DSensor; }
            set { m_option3DSensor = value; }
        }

        public OptionSopNormal OptionSopNormal
        {
            get { return m_optionSopNormal; }
            set { m_optionSopNormal = value; }
        }

        public ResponseOptions()
            : base()
        {
        }

        public ResponseOptions(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseLinkedSOPList : MessageResult
    {
        private List<LinkedSOPData> m_linkedSOPs = new List<LinkedSOPData>();

        public List<LinkedSOPData> SopList
        {
            get { return m_linkedSOPs; }
            set { m_linkedSOPs = value; }
        }

        public ResponseLinkedSOPList()
            : base()
        {
        }

        public ResponseLinkedSOPList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSOPList : MessageResult
    {
        private List<DisasterCategoryData> m_disasterCategories = new List<DisasterCategoryData>();

        public List<DisasterCategoryData> DisasterCategories
        {
            get { return m_disasterCategories; }
            set { m_disasterCategories = value; }
        }

        public ResponseSOPList()
            : base()
        {
        }

        public ResponseSOPList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseAlarmOptions : MessageResult
    {
        private Option3DSensor m_option3DSensor = new Option3DSensor();
        
        // 3D 관제 시스템 / 센서감지관리
        public Option3DSensor Option3DSensor
        {
            get { return m_option3DSensor; }
            set { m_option3DSensor = value; }
        }

        public ResponseAlarmOptions()
            : base()
        {
        }

        public ResponseAlarmOptions(bool success, string message)
            : base(success, message)
        {
        }
    }
}
