using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;

namespace SujainEmergencySend
{
    public class Data 
    {
        public static string EmergencyRootTeam = "피난유도팀(변경금지)";
        public static string EmergencyTeam1 = "피난 1팀";
        public static string EmergencyTeam2 = "피난 2팀";
        public static string EmergencyTeam3 = "피난 3팀";
        public static string EmergencyTeam4 = "피난 4팀";
        public static string EmergencyTeam5 = "피난 5팀";
        public static string EmergencyTeam6 = "피난 6팀";
        public static string EmergencyTeam7 = "피난 7팀";
        public static string EmergencyTeam8 = "피난 8팀";


        public static int Building101 = 1;
        public static int Building102 = 2;
        public static int Building103 = 3;
        public static int Building104 = 4;
        public static int BuildingTotal = 5;


        public static int FloorIndex_Total_Top = 2;
        public static int FloorIndex_Total_Low = -8;
        public static int FloorIndex_Unknown_Top = 49;
    }


    public class TemporaryTreeData : Temporary
    {
        public TemporaryTreeData()
        {

        }

        public TemporaryTreeData(Temporary temporary)
        {
            this.ID = temporary.ID;
            this.ParentTeamID = temporary.ParentTeamID;
            this.TeamName = temporary.TeamName;
            this.IsNormal = temporary.IsNormal;
            this.SiteID = temporary.SiteID;

            this.Childs = null;
        }

        public List<TemporaryTreeData> Childs { get; set; }
    }
}
