using System;
using System.Collections.Generic;
using Nipa.Model.Sop.Category;

namespace Nipa.BLL.Models.Response.SOP
{
    public class ResponseSopDisasterCategoryList : MessageResult
    {
        private List<DisasterCategory> m_disasterCategories = new List<DisasterCategory>();

        public List<DisasterCategory> DisasterCategories
        {
            get { return m_disasterCategories; }
            set { m_disasterCategories = value; }
        }

        public ResponseSopDisasterCategoryList()
            : base()
        {
        }

        public ResponseSopDisasterCategoryList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSopSubDisasterCategoryList : MessageResult
    {
        private List<SubDisasterCategory> m_subDisasterCategories = new List<SubDisasterCategory>();

        public List<SubDisasterCategory> SubDisasterCategories
        {
            get { return m_subDisasterCategories; }
            set { m_subDisasterCategories = value; }
        }

        public ResponseSopSubDisasterCategoryList()
            : base()
        {
        }

        public ResponseSopSubDisasterCategoryList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSopStandardActionStepNameList : MessageResult
    {
        private List<string> m_actionStepNames = new List<string>();

        public List<string> ActionStepNames
        {
            get { return m_actionStepNames; }
            set { m_actionStepNames = value; }
        }

        public ResponseSopStandardActionStepNameList()
            : base()
        {
        }

        public ResponseSopStandardActionStepNameList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSOPHistories : MessageResult
    {
        private List<SOPHistoryData> m_sopHistoryDatas = new List<SOPHistoryData>();
        public List<SOPHistoryData> SopHistoryDatas
        {
            get { return m_sopHistoryDatas; }
            set { m_sopHistoryDatas = value; }
        }

        public ResponseSOPHistories()
            : base()
        {
        }

        public ResponseSOPHistories(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSOPComponentHistories : MessageResult
    {
        private List<SopHistoryComponentData> m_sopComponentHistoryDatas = new List<SopHistoryComponentData>();
        public List<SopHistoryComponentData> SOPComponentHistoryDatas
        {
            get { return m_sopComponentHistoryDatas; }
            set { m_sopComponentHistoryDatas = value; }
        }

        public ResponseSOPComponentHistories()
            : base()
        {
        }

        public ResponseSOPComponentHistories(bool success, string message)
            : base(success, message)
        {
        }
    }
}
