using System.Collections.Generic;
using System.Linq;

namespace HynixAlarmSimulator.Data
{
    public class Const
    {
        public enum Categories { ForcedOpen = 1, Stranger, Detour, AddHistory, AddSmartTagHistory, PSM }
        
        public static readonly Dictionary<int, string> DicCategories = new Dictionary<int, string>()
        {
            {1, "출입거부 강제 문열림"},
            {2, "이상행위자 동선 추적"},
            {3, "무인 보안검색 우회"},
            {4, "출입이력 추가"},
            {5, "스마트 태그이력 추가"},
            {6, "PSM"},
        };
        
        public static List<Model.Category> ListCategories = DicCategories.Select(x => new Model.Category { ID = x.Key, Name = x.Value }).ToList();
        
    }

    public class Model
    {
        public class Category
        {
            private int id;
            private string name;

            public int ID
            {
                get { return id; }
                set { id = value; }
            }
            
            public string Name
            {
                get { return name; }
                set { name = value; }
            }
            
        }
    }
}