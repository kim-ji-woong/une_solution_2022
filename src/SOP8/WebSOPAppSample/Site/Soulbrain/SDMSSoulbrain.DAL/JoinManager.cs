using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SDMS.Model.Sensor;

namespace SDMSSoulbrain.DAL
{
    public class JoinManager : SDMS.DAL.JoinManager
    {
        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public IEnumerable<PSM> GetPsmSensors(int? rowCount, out string strErrorMessage)
        {
            if (rowCount == null)
            {
                IEnumerable<PSM> sensors = Select<PSM>(null, out strErrorMessage);

                if (sensors == null)
                    return sensors;
            }

            PSM psm = new PSM();

            string strSQL = string.Format("* from {0}", psm.GetTableName());
            strSQL = "Select " + GetTopCount(rowCount, strSQL);

            List<PSM> psmSensors = new List<PSM>();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                psm = new PSM();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    ReadPSM(pair.Key, pair.Value, psm);
                }

                psmSensors.Add(psm);
            }

            return psmSensors;
        }

        protected void ReadPSM(string strFieldName, object value, PSM psm)
        {
            if (strFieldName == PSM.Fields.ID.ToString())
                psm.ID = (int)value;
            else if (strFieldName == PSM.Fields.Name.ToString())
                psm.Name = (string)value;
            else if (strFieldName == Fire.Fields.PositionName.ToString())
                psm.PositionName = (string)value;
            else if (strFieldName == PSM.Fields.X.ToString())
            {
                if (value == null)
                    psm.X = null;
                else
                    psm.X = (double)value;
            }
            else if (strFieldName == PSM.Fields.Y.ToString())
            {
                if (value == null)
                    psm.Y = null;
                else
                    psm.Y = (double)value;
            }
            else if (strFieldName == PSM.Fields.Z.ToString())
            {
                if (value == null)
                    psm.Z = null;
                else
                    psm.Z = (double)value;
            }
            else if (strFieldName == PSM.Fields.CurrentData.ToString())
            {
                if (value == null)
                    psm.CurrentData = null;
                else
                    psm.CurrentData = (double)value;
            }
            else if (strFieldName == PSM.Fields.EquipZoneID.ToString())
                psm.EquipZoneID = (int)value;
            else if (strFieldName == PSM.Fields.ZoneID.ToString())
                psm.ZoneID = (int)value;
            else if (strFieldName == PSM.Fields.MaterialType.ToString())
            {
                if (value == null)
                    psm.MaterialType = null;
                else
                    psm.MaterialType = (int)value;
            }
            else if (strFieldName == PSM.Fields.LimitBase.ToString())
            {
                if (value == null)
                    psm.LimitBase = null;
                else
                    psm.LimitBase = (double)value;
            }
            else if (strFieldName == PSM.Fields.LimitType.ToString())
            {
                if (value == null)
                    psm.LimitType = null;
                else
                    psm.LimitType = (int)value;
            }
            else if (strFieldName == PSM.Fields.LimitValue.ToString())
                psm.LimitValue = (string)value;
            else if (strFieldName == PSM.Fields.UniqueKey.ToString())
                psm.UniqueKey = (string)value;
            else if (strFieldName == PSM.Fields.Department.ToString())
                psm.Department = (string)value;
            else if (strFieldName == PSM.Fields.DepartmentPhoneNumber.ToString())
                psm.DepartmentPhoneNumber = (string)value;
            else if (strFieldName == PSM.Fields.Enabled.ToString())
            {
                if (value == null)
                    psm.Enabled = null;
                else
                {
                    string strValue = value.ToString().ToLower().Trim();
                    psm.Enabled = strValue == "0" || strValue == "false" ? false : true;
                }
            }
            else if (strFieldName == PSM.Fields.Status.ToString())
            {
                if (value == null)
                    psm.Status = null;
                else
                    psm.Status = (int)value;
            }
            else if (strFieldName == PSM.Fields.SiteID.ToString())
            {
                if (value == null)
                    psm.SiteID = null;
                else
                    psm.SiteID = (int)value;
            }
        }
    }
}
