using SOPAlone.Model.Sop.Sensor;
using SOPAlone.Model.Sop.Spatial;
using System.Collections;
using System.Collections.Generic;

namespace SOPAlone.IDAL
{
    public interface ISelect
    {
        ArrayList GetResultData(string strQuery, out string strError);
        bool RunQuery(string strQuery, out string strError);

        #region 위치정보 Spatial
        BuildingGroup SelectBuildingGroup(string strCondition, out string strError);
        List<BuildingGroup> SelectBuildingGroups(string strCondition, out string strError);
        Building SelectBuilding(string strCondition, out string strError);
        List<Building> SelectBuildings(string strCondition, out string strError);
        Zone SelectZone(string strCondition, out string strError);
        List<Zone> SelectZones(string strCondition, out string strError);
        #endregion

        #region Sensor
        FacilityType SelectFacilityType(string strCondition, out string strError);
        List<FacilityType> SelectFacilityTypes(string strCondition, out string strError); 
        #endregion
    }
}
