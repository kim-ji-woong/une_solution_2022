using System;
using System.Collections.Generic;
using System.Text;

namespace SensorServer.Model.Yeosu.Public
{
    public class AirNode
    {
        public enum Fields { ID, SiteNm, Addr, Year, MangName, Item, X, Y }

        public int ID { get; set; }

        public string SiteNm { get; set; }

        public string Addr { get; set; }

        public int? Year { get; set; }

        public string MangName { get; set; }

        public string Item { get; set; }

        public float? X { get; set; }

        public float? Y { get; set; }

        public static string TableName { get { return "YeosuPublicAirNode"; } }


        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.SiteNm ||
                field == Fields.Addr ||
                field == Fields.Year ||
                field == Fields.MangName ||
                field == Fields.Item ||
                field == Fields.X ||
                field == Fields.Y)
                isNullable = true;
            else
                isNullable = false;
            return field.ToString();
        }
    }
}
