using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;

namespace SDMS.DAL
{
    public class JoinManager : SelectManager
    {
        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public IEnumerable<Fire> GetFireSensors(int? rowCount, out string strErrorMessage)
        {
            if (rowCount == null)
            {
                IEnumerable<Fire> sensors = Select<Fire>(null, out strErrorMessage);

                if (sensors == null)
                    return sensors;
            }

            Fire fire = new Fire();

            string strSQL = string.Format("* from {0}", fire.GetTableName());
            strSQL = "Select " + GetTopCount(rowCount, strSQL);

            List<Fire> fireSensors = new List<Fire>();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                fire = new Fire();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    ReadFire(pair.Key, pair.Value, fire);
                }

                fireSensors.Add(fire);
            }

            return fireSensors;
        }

        public ArrayList JoinZoneFireSensors(int? rowCount, out string strErrorMessage)
        {
            Zone zone = new Zone();
            Fire fire = new Fire();

            string strSQL = string.Format("a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                zone.GetTableName(), fire.GetTableName(),
                Zone.Fields.ID, Fire.Fields.ZoneID);

            strSQL = "Select " + GetTopCount(rowCount, strSQL);

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nZoneFieldCount = zone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                zone = new Zone();
                fire = new Fire();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nZoneFieldCount)
                    {
                        ReadZone(pair.Key, pair.Value, zone);
                    }
                    else
                    {
                        ReadFire(pair.Key, pair.Value, fire);
                    }

                    nIndex++;
                }

                arrDatas.Add(zone);
                arrDatas.Add(fire);
            }

            return arrDatas;
        }

        // DBMS 전용쿼리는 모든 DBMS 타입별로 각자 처리
        protected string GetTopCount(int? rowCount, string strQueryBody)
        {
            if (rowCount == null)
                return strQueryBody;

            if (m_dbManager.DatabaseType == dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver)
                return string.Format("Top ({0}) {1}", (int)rowCount, strQueryBody);
            else if (m_dbManager.DatabaseType == dnsDapperDBUtil.Manager.WebDBManager.DBType.mysql ||
                m_dbManager.DatabaseType == dnsDapperDBUtil.Manager.WebDBManager.DBType.oracle)
                return string.Format("{1} Limit {0} ", (int)rowCount, strQueryBody);

            return strQueryBody;
        }

        protected void ReadZone(string strFieldName, object value, Zone zone)
        {
            if (strFieldName == Zone.Fields.ID.ToString())
                zone.ID = (int)value;
            else if (strFieldName == Zone.Fields.ZoneName.ToString())
                zone.ZoneName = (string)value;
            else if (strFieldName == Zone.Fields.BuildingID.ToString())
            {
                if (value == null)
                    zone.BuildingID = null;
                else
                    zone.BuildingID = (int)value;
            }
            else if (strFieldName == Zone.Fields.FloorIndex.ToString())
            {
                if (value == null)
                    zone.FloorIndex = null;
                else
                    zone.FloorIndex = (int)value;
            }
            else if (strFieldName == Zone.Fields.AddFloor.ToString())
            {
                if (value == null)
                    zone.AddFloor = null;
                else
                    zone.AddFloor = (double)value;
            }
            else if (strFieldName == Zone.Fields.Boundary.ToString())
                zone.Boundary = (string)value;
            else if (strFieldName == Zone.Fields.TextCenter.ToString())
                zone.TextCenter = (string)value;
            else if (strFieldName == Zone.Fields.BroadcastText.ToString())
                zone.BroadcastText = (string)value;
            else if (strFieldName == Zone.Fields.DisplayText.ToString())
                zone.DisplayText = (string)value;
            else if (strFieldName == Zone.Fields.SiteID.ToString())
                zone.SiteID = (int)value;
        }

        protected void ReadFire(string strFieldName, object value, Fire fire)
        {
            if (strFieldName == Fire.Fields.ID.ToString())
                fire.ID = (int)value;
            else if (strFieldName == Fire.Fields.Name.ToString())
                fire.Name = (string)value;
            else if (strFieldName == Fire.Fields.PositionName.ToString())
                fire.PositionName = (string)value;
            else if (strFieldName == Fire.Fields.X.ToString())
            {
                if (value == null)
                    fire.X = null;
                else
                    fire.X = (double)value;
            }
            else if (strFieldName == Fire.Fields.Y.ToString())
            {
                if (value == null)
                    fire.Y = null;
                else
                    fire.Y = (double)value;
            }
            else if (strFieldName == Fire.Fields.Z.ToString())
            {
                if (value == null)
                    fire.Z = null;
                else
                    fire.Z = (double)value;
            }
            else if (strFieldName == Fire.Fields.ZoneID.ToString())
                fire.ZoneID = (int)value;
            else if (strFieldName == Fire.Fields.Department.ToString())
                fire.Department = (string)value;
            else if (strFieldName == Fire.Fields.DepartmentPhoneNumber.ToString())
                fire.DepartmentPhoneNumber = (string)value;
            else if (strFieldName == Fire.Fields.Enabled.ToString())
            {
                if (value == null)
                    fire.Enabled = null;
                else
                {
                    string strValue = value.ToString().ToLower().Trim();
                    fire.Enabled = strValue == "0" || strValue == "false" ? false : true;
                }
            }
            else if (strFieldName == Fire.Fields.SensorSubType.ToString())
            {
                if (value == null)
                    fire.SensorSubType = null;
                else
                    fire.SensorSubType = (int)value;
            }
            else if (strFieldName == Fire.Fields.SiteID.ToString())
            {
                if (value == null)
                    fire.SiteID = null;
                else
                    fire.SiteID = (int)value;
            }
        }
    }
}
