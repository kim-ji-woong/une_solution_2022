using System;
using System.Collections.Generic;

namespace Nipa.BLL.Models
{
    public class DisasterCategoryData
    {
        private string m_strCategoryName = "";
        private int m_nID = -1;
        private List<SubDisasterCategoryData> m_subDisasterCategories = new List<SubDisasterCategoryData>();

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string CategoryName
        {
            get { return m_strCategoryName; }
            set { m_strCategoryName = value; }
        }

        public List<SubDisasterCategoryData> SubDisasterCategories
        {
            get { return m_subDisasterCategories; }
            set { m_subDisasterCategories = value; }
        }
    }

    public class SubDisasterCategoryData
    {
        private int m_nID = -1;
        private int m_nDisasterCategoryID = -1;
        private string m_strSubCategoryName = "";
        private List<DisasterData> m_disasters = new List<DisasterData>();

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int DisasterCategoryID
        {
            get { return m_nDisasterCategoryID; }
            set { m_nDisasterCategoryID = value; }
        }

        public string SubCategoryName
        {
            get { return m_strSubCategoryName; }
            set { m_strSubCategoryName = value; }
        }

        public List<DisasterData> Disasters
        {
            get { return m_disasters; }
            set { m_disasters = value; }
        }
    }

    public class DisasterData
    {
        private int m_nID = -1;
        private int m_nSubDisasterCategoryID = -1;
        private string m_strDisasterName = "";

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int SubDisasterCategoryID
        {
            get { return m_nSubDisasterCategoryID; }
            set { m_nSubDisasterCategoryID = value; }
        }

        public string DisasterName
        {
            get { return m_strDisasterName; }
            set { m_strDisasterName = value; }
        }
    }
}
