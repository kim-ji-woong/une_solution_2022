using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseExternalMaterials : MessageResult
    {
        private List<BusanTP.Model.Material> m_materials = new List<BusanTP.Model.Material>();
        
        private List<ExternalMaterialJoinSensorMaterialName> m_externalMaterialJoinSensorMaterialName = new List<ExternalMaterialJoinSensorMaterialName>();
        
        public List<BusanTP.Model.Material> Materials
        {
            get { return m_materials; }
            set { m_materials = value; }
        }
        
        public List<ExternalMaterialJoinSensorMaterialName> ExternalMaterialJoinSensorMaterialName
        {
            get { return m_externalMaterialJoinSensorMaterialName; }
            set { m_externalMaterialJoinSensorMaterialName = value; }
        }
        
        public ResponseExternalMaterials() : base()
        {
        }
        
        public ResponseExternalMaterials(bool success, string message) : base(success, message)
        {
        }
    }

    public class ExternalMaterialJoinSensorMaterialName
    {
        // private int m_nMaterialID = 0;
        // private int m_nUniqueID = 0;
        // private double? m_dMin1 = null;
        // private double? m_dMax1 = null;
        // private double? m_dMin2 = null;
        // private double? m_dMax2 = null;
        // private int? m_nDirection = null;
        // private string m_strInfo = null;
        // private string M_strMaterialName = null;

        public int MaterialID { get; set; }
        public int UniqueID { get; set; }
        public double? Min1 { get; set; }
        public double? Max1 { get; set; }
        public double? Min2 { get; set; }
        public double? Max2 { get; set; }
        public int? Direction { get; set; }
        public string Info { get; set; }
        public string MaterialName { get; set; }
        
    }
}