namespace BusanTP.Model
{
    public class UserMemo
    {
        public enum Fields { ID, UserID, Memo }
        
        public int ID { get; set; }
        
        public int UserID { get; set; }
        
        public string Memo { get; set; }
        
        public static string TableName { get { return "BusanUserMemo"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Memo)
                isNullable = true;
            else
                isNullable = false;
            return field.ToString();
        }
        
    }
}