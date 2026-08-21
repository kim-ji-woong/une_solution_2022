using dnsDBUtil;
using SOPAlone.IDAL;
using SOPAlone.Model.Sop.Sensor;
using SOPAlone.Model.Sop.Spatial;
using System.Collections;
using System.Collections.Generic;

namespace SOPAlone.DAL
{
    public class SelectManager : QueryManager, ISelect
    {
        public SelectManager(DataManager dataManager)
        {
            m_dbManager = dataManager.GetDBManager() as DirectDBManager;
        }

        public ArrayList GetResultData(string strQuery, out string strError)
        {
            strError = null;
            ArrayList arrResult = m_dbManager.GetResultData(strQuery);
            if (arrResult == null)
                strError = m_dbManager.LastErrorMessage;

            return arrResult;
        }

        public bool RunQuery(string strQuery, out string strError)
        {
            strError = null;
            if (m_dbManager.GetResultData(strQuery) == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return false;
            }

            return true;
        }

        #region Spatial
        public BuildingGroup SelectBuildingGroup(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strTableName = BuildingGroup.TableName;
            string strFields = GetFieldNames<BuildingGroup.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {BuildingGroup.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery, 1);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            if (arrResult.Count != nFieldCount)
                return null;

            BuildingGroup bg = ReadBuildingGroup(arrResult, 0, out strError);
            return bg;
        }
        public List<BuildingGroup> SelectBuildingGroups(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strFields = GetFieldNames<BuildingGroup.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {BuildingGroup.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<BuildingGroup> bgs = new List<BuildingGroup>();
            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                BuildingGroup bg = ReadBuildingGroup(arrResult, i, out strError);
                if (bg == null)
                    return null;
                else
                    bgs.Add(bg);
            }

            return bgs;
        }
        private BuildingGroup ReadBuildingGroup(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            BuildingGroup model = new BuildingGroup();
            bool isNullable;

            foreach (BuildingGroup.Fields field in BuildingGroup.Fields.GetValues(typeof(BuildingGroup.Fields)))
            {
                string strFieldName = BuildingGroup.GetFieldName(field, out isNullable);

                if (field == BuildingGroup.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());
                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == BuildingGroup.Fields.GroupName)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.GroupName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.GroupName = str;
                }
                else if (field == BuildingGroup.Fields.DisplayText)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.DisplayText = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.DisplayText = str;
                }
                else if (field == BuildingGroup.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }

                index++;
            }

            return model;
        }
        public Building SelectBuilding(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strTableName = Building.TableName;
            string strFields = GetFieldNames<Building.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {Building.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery, 1);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            if (arrResult.Count != nFieldCount)
                return null;

            Building b = ReadBuilding(arrResult, 0, out strError);
            return b;
        }
        public List<Building> SelectBuildings(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strFields = GetFieldNames<Building.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {Building.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<Building> bs = new List<Building>();
            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                Building b = ReadBuilding(arrResult, i, out strError);
                if (b == null)
                    return null;
                else
                    bs.Add(b);
            }

            return bs;
        }
        private Building ReadBuilding(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            Building model = new Building();
            bool isNullable;

            foreach (Building.Fields field in Building.Fields.GetValues(typeof(Building.Fields)))
            {
                string strFieldName = Building.GetFieldName(field, out isNullable);

                if (field == Building.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());
                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == Building.Fields.BuildingGroupID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                        model.BuildingGroupID = data.Data;
                }
                else if (field == Building.Fields.BuildingName)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.BuildingName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.BuildingName = str;
                }
                else if (field == Building.Fields.DisplayText)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.DisplayText = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.DisplayText = str;
                }
                else if (field == Building.Fields.MaxFloor)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                        model.MaxFloor = data.Data;
                }
                else if (field == Building.Fields.MinFloor)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                        model.MinFloor = data.Data;
                }

                index++;
            }

            return model;
        }
        public Zone SelectZone(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strTableName = Zone.TableName;
            string strFields = GetFieldNames<Zone.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {Zone.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery, 1);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            if (arrResult.Count != nFieldCount)
                return null;

            Zone z = ReadZone(arrResult, 0, out strError);
            return z;
        }
        public List<Zone> SelectZones(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strFields = GetFieldNames<Zone.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {Zone.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<Zone> zs = new List<Zone>();
            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                Zone z = ReadZone(arrResult, i, out strError);
                if (z == null)
                    return null;
                else
                    zs.Add(z);
            }

            return zs;
        }
        private Zone ReadZone(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            Zone model = new Zone();
            bool isNullable;

            foreach (Zone.Fields field in Zone.Fields.GetValues(typeof(Zone.Fields)))
            {
                string strFieldName = Zone.GetFieldName(field, out isNullable);

                if (field == Zone.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());
                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == Zone.Fields.BuildingID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                        model.BuildingID = data.Data;
                }
                else if (field == Zone.Fields.ZoneName)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.ZoneName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.ZoneName = str;
                }
                else if (field == Zone.Fields.DisplayText)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.DisplayText = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.DisplayText = str;
                }
                else if (field == Zone.Fields.FloorIndex)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.FloorIndex = null;
                    }
                    else
                    {
                        model.FloorIndex = data.Data;
                    }
                }
                else if (field == Zone.Fields.AddFloor)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.AddFloor = null;
                    }
                    else
                    {
                        model.AddFloor = data.Data;
                    }
                }

                index++;
            }

            return model;
        }
        #endregion

        #region Sensor
        public FacilityType SelectFacilityType(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strTableName = FacilityType.TableName;
            string strFields = GetFieldNames<FacilityType.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {FacilityType.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery, 1);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            if (arrResult.Count != nFieldCount)
                return null;

            FacilityType bg = ReadFacilityType(arrResult, 0, out strError);
            return bg;
        }
        public List<FacilityType> SelectFacilityTypes(string strCondition, out string strError)
        {
            strError = null;
            int nFieldCount;
            string strFields = GetFieldNames<FacilityType.Fields>(out nFieldCount);

            string strQuery = $"select {strFields} from {FacilityType.TableName} ";
            if (strCondition?.Length > 0)
                strQuery += " where " + strCondition;

            ArrayList arrResult = m_dbManager.GetResultData(strQuery);
            if (arrResult == null)
            {
                strError = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<FacilityType> bgs = new List<FacilityType>();
            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                FacilityType bg = ReadFacilityType(arrResult, i, out strError);
                if (bg == null)
                    return null;
                else
                    bgs.Add(bg);
            }

            return bgs;
        }
        private FacilityType ReadFacilityType(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            FacilityType model = new FacilityType();
            bool isNullable;

            foreach (FacilityType.Fields field in FacilityType.Fields.GetValues(typeof(FacilityType.Fields)))
            {
                string strFieldName = FacilityType.GetFieldName(field, out isNullable);

                if (field == FacilityType.Fields.FacilityTypeID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());
                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.FacilityTypeID = data.Data;
                    }
                }
                else if (field == FacilityType.Fields.TypeName)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.TypeName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.TypeName = str;
                }
                else if (field == FacilityType.Fields.DisplayText)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.DisplayText = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.DisplayText = str;
                }
                else if (field == FacilityType.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }

                index++;
            }

            return model;
        }
        #endregion
    }
}
