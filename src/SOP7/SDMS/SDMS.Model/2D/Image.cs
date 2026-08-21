using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model._2D
{
    public class Sdms2DImage : IIDObject
    {
        public enum Fields { ID, ZoneID, FilePath, SiteID };

        public int ID { get; set; }
        public int ZoneID { get; set; }
        public string FilePath { get; set; }
        public int SiteID { get; set; }

        public static string TableName { get { return "Sdms2DImage"; } }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.FilePath)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
    }
}
