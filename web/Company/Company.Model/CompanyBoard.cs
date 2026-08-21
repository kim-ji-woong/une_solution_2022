using System;

namespace Company.Model
{
    public class CompanyBoard
    {
        public enum Fields { boardNum, boardTitle, boardContent, boardDate, boardPeople };

        public int boardNum { get; set; }

        public string boardTitle { get; set; }

        public string boardContent { get; set; }

        public string boardDate { get; set; }

        public string boardPeople { get; set; }

        public static string TableName
        {
            get { return "companyNews"; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;

            return field.ToString();
        }
    }
}
