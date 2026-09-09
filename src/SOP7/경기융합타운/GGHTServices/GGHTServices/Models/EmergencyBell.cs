using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;

namespace GGHTServices.Models
{
    public class EmergencyBell : Table
    {
        public enum Fields { index, uniqueid, type, status, uptime };
        public enum WriteFields { index, uniqueid, type, status, uptime };

        public int index { get; set; }
        public string uniqueid { get; set; }
        public string type { get; set; }
        public string status { get; set; }
        public DateTime uptime { get; set; }

        public static string TableName { get { return "tb_emergency_info"; } }

        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1}", Fields.index, index);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public void FromCopy(EmergencyBell obj)
        {
            this.index = obj.index;
            this.uniqueid = obj.uniqueid;
            this.type = obj.type;
            this.status = obj.status;
            this.uptime = obj.uptime;
        }
    }
}
