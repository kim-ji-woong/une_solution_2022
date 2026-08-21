using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SenkoPSMServer.ViewModels
{
    public class SensorPSM : Table
    {
        public enum Fields { ID, Name, PositionName, X, Y, Z, CurrentData, EquipZoneID, Department, DepartmentPhoneNumber, Enabled, Status, UniqueKey, ZoneID, MaterialType, LimitBase, LimitType, LimitValue };

        public int ID { get; set; }
        private string m_strName = "";
        public string Name 
        { 
            get { return m_strName; }
            set
            {
                if (value == null)
                    m_strName = "";
                else
                    m_strName = value;
            }
        }
        public string PositionName { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Z { get; set; }
        public float? CurrentData { get; set; }
        public int EquipZoneID { get; set; }
        public string Department { get; set; }
        public string DepartmentPhoneNumber { get; set; }
        public bool? Enabled { get; set; }
        public bool? Status { get; set; }
        private string m_strUniqueKey = "";
        public string UniqueKey 
        { 
            get { return m_strUniqueKey; }
            set 
            {
                if (value == null)
                    m_strUniqueKey = "";
                else
                    m_strUniqueKey = value;
            }

        }
        public int ZoneID { get; set; }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }

        public static string TableName = "SdmsSensorPSM";
        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("ID = {0}", ID);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(Fields);
        }

    }
}
