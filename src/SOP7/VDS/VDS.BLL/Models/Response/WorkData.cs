using System.Collections.Generic;
using VDS.Model.Work;
using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseWorkData : MessageResult
    {
        private List<ChangeData> m_changeDatas = new List<ChangeData>();
        private List<FaultData> m_faultDatas = new List<FaultData>();

        public List<ChangeData> ChangeDatas
        {
            get { return m_changeDatas; }
            set { m_changeDatas = value; }
        }

        public List<FaultData> FaultDatas
        {
            get { return m_faultDatas; }
            set { m_faultDatas = value; }
        }

        public ResponseWorkData()
            : base()
        {
        }

        public ResponseWorkData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ChangeData
    {
        private ChangeBasic m_basicData = null;
        private List<ChangeTargetEx> m_targetDatas = new List<ChangeTargetEx>();
        
        public ChangeBasic BasicData
        {
            get { return m_basicData; }
            set { m_basicData = value; }
        }

        public List<ChangeTargetEx> TargetDatas
        {
            get { return m_targetDatas; }
            set { m_targetDatas = value; }
        }
    }

    public class ChangeTargetEx : ChangeTarget
    {
        private Item m_item = null;
        private EquipmentType m_equipmentType = null;

        public Item Item
        {
            get { return m_item; }
            set { m_item = value; }
        }

        public EquipmentType EquipmentType
        {
            get { return m_equipmentType; }
            set { m_equipmentType = value; }
        }

        public ChangeTargetEx()
        {
        }

        public ChangeTargetEx(ChangeTarget target)
        {
            this.ID = target.ID;
            this.Change = target.Change;
            this.ChangeData = target.ChangeData;
            this.ChangeDetail = target.ChangeDetail;
            this.ChangeResult = target.ChangeResult;
            this.DataCenterID = target.DataCenterID;
            this.EquipmentTypeID = target.EquipmentTypeID;
            this.PropertyName = target.PropertyName;
            this.ReviewDate = target.ReviewDate;
            this.Reviewer = target.Reviewer;
            this.ReviewResult = target.ReviewResult;
            this.ServicePause = target.ServicePause;
            this.ServicePausePlanHour = target.ServicePausePlanHour;
            this.WorkID = target.WorkID;
        }
    }

    public class FaultData
    {
        private FaultBasic m_basicData = null;
        private List<FaultTargetEx> m_targetDatas = new List<FaultTargetEx>();
        
        public FaultBasic BasicData
        {
            get { return m_basicData; }
            set { m_basicData = value; }
        }

        public List<FaultTargetEx> TargetDatas
        {
            get { return m_targetDatas; }
            set { m_targetDatas = value; }
        }
    }

    public class FaultTargetEx : FaultTarget
    {
        private EquipmentType m_equipmentType = null;

        public EquipmentType EquipmentType
        {
            get { return m_equipmentType; }
            set { m_equipmentType = value; }
        }

        public FaultTargetEx()
        {
        }

        public FaultTargetEx(FaultTarget target)
        {
            this.ID = target.ID;
            this.DataCenterID = target.DataCenterID;
            this.Department = target.Department;
            this.FaultID = target.FaultID;
            this.SystemName = target.SystemName;
            this.EquipmentTypeID = target.EquipmentTypeID;
        }
    }

    public class ResponseSiteWorkData : MessageResult
    {
        private List<SiteChangeData> m_changeDatas = new List<SiteChangeData>();
        private List<SiteFaultData> m_faultDatas = new List<SiteFaultData>();

        public List<SiteChangeData> ChangeDatas
        {
            get { return m_changeDatas; }
            set { m_changeDatas = value; }
        }

        public List<SiteFaultData> FaultDatas
        {
            get { return m_faultDatas; }
            set { m_faultDatas = value; }
        }

        public ResponseSiteWorkData()
            : base()
        {
        }

        public ResponseSiteWorkData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class SiteChangeData
    {
        private ChangeBasic m_basicData = null;
        private List<ChangeTarget> m_targetDatas = new List<ChangeTarget>();

        public ChangeBasic BasicData
        {
            get { return m_basicData; }
            set { m_basicData = value; }
        }

        public List<ChangeTarget> TargetDatas
        {
            get { return m_targetDatas; }
            set { m_targetDatas = value; }
        }
    }

    public class SiteFaultData
    {
        private FaultBasic m_basicData = null;
        private List<FaultTarget> m_targetDatas = new List<FaultTarget>();

        public FaultBasic BasicData
        {
            get { return m_basicData; }
            set { m_basicData = value; }
        }

        public List<FaultTarget> TargetDatas
        {
            get { return m_targetDatas; }
            set { m_targetDatas = value; }
        }
    }
}
