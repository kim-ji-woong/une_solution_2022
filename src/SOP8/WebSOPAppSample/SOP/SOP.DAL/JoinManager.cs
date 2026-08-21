using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOP.Model.Category;
using SOP.Model.Config;

namespace SOP.DAL
{
    public class JoinManager : SelectManager
    {
        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public ArrayList JoinDisasterCategorySubDisasterCategoryDisaster(int facilityType, out string strErrorMessage)
        {
            DisasterCategory dc = new DisasterCategory();
            SubDisasterCategory sdc = new SubDisasterCategory();
            Disaster disaster = new Disaster();
            LinkedSop ls = new LinkedSop();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c, {3} d where a.{4} = b.{5} and b.{6} = c.{7} and a.{4} = d.{8} and b.{6} = d.{9} and d.{10} = c.{11} and d.{12} = {13}",
                dc.GetTableName(), sdc.GetTableName(), disaster.GetTableName(), ls.GetTableName(),
                DisasterCategory.Fields.ID,
                SubDisasterCategory.Fields.DisasterCategoryID,
                SubDisasterCategory.Fields.ID,
                Disaster.Fields.SubDisasterCategoryID,
                LinkedSop.Fields.DisasterCategoryID,
                LinkedSop.Fields.SubDisasterCategoryID,
                LinkedSop.Fields.DisasterName,
                Disaster.Fields.DisasterName,
                LinkedSop.Fields.FacilityTypeID,
                facilityType);

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nDisasterCategoryFieldCount = dc.GetFieldCount();
            int nSubDisasterCategoryFieldCount = sdc.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                dc = new DisasterCategory();
                sdc = new SubDisasterCategory();
                disaster = new Disaster();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nDisasterCategoryFieldCount)
                    {
                        ReadDisasterCategory(pair.Key, pair.Value, dc);
                    }
                    else if (nIndex < nDisasterCategoryFieldCount + nSubDisasterCategoryFieldCount)
                    {
                        ReadSubDisasterCategory(pair.Key, pair.Value, sdc);
                    }
                    else
                    {
                        ReadDisaster(pair.Key, pair.Value, disaster);
                    }

                    nIndex++;
                }

                arrDatas.Add(dc);
                arrDatas.Add(sdc);
                arrDatas.Add(disaster);
            }

            return arrDatas;
        }

        private void ReadDisasterCategory(string strFieldName, object value, DisasterCategory dc)
        {
            if (strFieldName == DisasterCategory.Fields.ID.ToString())
                dc.ID = (int)value;
            else if (strFieldName == DisasterCategory.Fields.CategoryName.ToString())
                dc.CategoryName = (string)value;
            else if (strFieldName == DisasterCategory.Fields.SiteID.ToString())
                dc.SiteID = (int)value;
        }

        private void ReadSubDisasterCategory(string strFieldName, object value, SubDisasterCategory sdc)
        {
            if (strFieldName == SubDisasterCategory.Fields.ID.ToString())
                sdc.ID = (int)value;
            else if (strFieldName == SubDisasterCategory.Fields.DisasterCategoryID.ToString())
                sdc.DisasterCategoryID = (int)value;
            else if (strFieldName == SubDisasterCategory.Fields.SubCategoryName.ToString())
                sdc.SubCategoryName = (string)value;
        }

        private void ReadDisaster(string strFieldName, object value, Disaster disaster)
        {
            if (strFieldName == Disaster.Fields.ID.ToString())
                disaster.ID = (int)value;
            else if (strFieldName == Disaster.Fields.DisasterName.ToString())
                disaster.DisasterName = (string)value;
            else if (strFieldName == Disaster.Fields.SubDisasterCategoryID.ToString())
                disaster.SubDisasterCategoryID = (int)value;
            else if (strFieldName == Disaster.Fields.VersionID.ToString())
                disaster.VersionID = (int)value;
            else if (strFieldName == Disaster.Fields.UserLevelIDs.ToString())
                disaster.UserLevelIDs = (string)value;
            else if (strFieldName == Disaster.Fields.Description.ToString())
                disaster.Description = (string)value;
        }

        private void ReadLinkedSop(string strFieldName, object value, LinkedSop ls)
        {
            if (strFieldName == LinkedSop.Fields.ID.ToString())
                ls.ID = (int)value;
            else if (strFieldName == LinkedSop.Fields.FacilityTypeID.ToString())
                ls.FacilityTypeID = (int)value;
            else if (strFieldName == LinkedSop.Fields.DisasterCategoryID.ToString())
                ls.DisasterCategoryID = (int)value;
            else if (strFieldName == LinkedSop.Fields.SubDisasterCategoryID.ToString())
                ls.SubDisasterCategoryID = (int)value;
            else if (strFieldName == LinkedSop.Fields.DisasterName.ToString())
                ls.DisasterName = (string)value;
            else if (strFieldName == LinkedSop.Fields.LinkedBuildingID.ToString())
            {
                if (value == null)
                    ls.LinkedBuildingID = null;
                else
                    ls.LinkedBuildingID = (int)value;
            }
            else if (strFieldName == LinkedSop.Fields.LinkedZoneID.ToString())
            {
                if (value == null)
                    ls.LinkedZoneID = null;
                else
                    ls.LinkedZoneID = (int)value;
            }
            else if (strFieldName == LinkedSop.Fields.Description.ToString())
                ls.Description = (string)value;
            else if (strFieldName == LinkedSop.Fields.LinkedBuildingGroupID.ToString())
            {
                if (value == null)
                    ls.LinkedBuildingGroupID = null;
                else
                    ls.LinkedBuildingGroupID = (int)value;
            }
            else if (strFieldName == LinkedSop.Fields.SiteID.ToString())
                ls.SiteID = (int)value;
        }
    }
}
