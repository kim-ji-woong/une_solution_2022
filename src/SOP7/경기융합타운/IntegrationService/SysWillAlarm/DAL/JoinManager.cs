using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace SysWillAlarm.DAL
{
    using Models.Sdms.Alarm;
    using Models.Sdms.Sensor;

    class JoinManager: SelectManager
    {
        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public ArrayList JoinCurrentAlarmSensorZoneHistorySensorZoneTagInfo(string strAdditionalConditions, out string strErrorMessage)
        {
            Current currentAlarm = new Current();
            Models.Sdms.History.SensorZone sensorZoneHistory = new Models.Sdms.History.SensorZone();
            SensorZone sensorZone = new SensorZone();
            TagInfo tagInfo = new TagInfo();


            string strSQL = string.Format("Select a.*, b.*, c.*, d.* from {0} a inner join {1} b on a.{4} = b.{5} inner join {2} c on b.{6} = c.{7} inner join {3} d on c.{8} = d.{9}",
                currentAlarm.GetTableName(), sensorZoneHistory.GetTableName(), sensorZone.GetTableName(), tagInfo.GetTableName(),
                Current.Fields.SensorZoneHistoryID, Models.Sdms.History.SensorZone.Fields.ID,
                Models.Sdms.History.SensorZone.Fields.SensorZoneID, SensorZone.Fields.ID,
                SensorZone.Fields.ID, TagInfo.Fields.SensorZoneID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nCurrentAlarmFieldCount = currentAlarm.GetFieldCount();
            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();
            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                currentAlarm = new Current();
                sensorZoneHistory = new Models.Sdms.History.SensorZone();
                sensorZone = new SensorZone();
                tagInfo = new TagInfo();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nCurrentAlarmFieldCount)
                    {
                        ReadAlarm(pair.Key, pair.Value, currentAlarm);
                    }
                    else if (nIndex < nCurrentAlarmFieldCount + nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else if (nIndex < nCurrentAlarmFieldCount + nSensorZoneHistoryFieldCount + nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else
                        ReadTagInfo(pair.Key, pair.Value, tagInfo);

                    nIndex++;
                }

                arrDatas.Add(currentAlarm);
                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorZone);
                arrDatas.Add(tagInfo);
            }

            return arrDatas;
        }

        public void ReadAlarm(string strFieldName, object value, Current alarm)
        {
            if (strFieldName == Current.Fields.SensorZoneHistoryID.ToString())
                alarm.SensorZoneHistoryID = (int)value;
            else if (strFieldName == Current.Fields.SensorType.ToString())
                alarm.SensorType = (int)value;
            else if (strFieldName == Current.Fields.AlarmType.ToString())
                alarm.AlarmType = (int)value;
            else if (strFieldName == Current.Fields.TimeStamp.ToString())
                alarm.TimeStamp = (DateTime)value;
            else if (strFieldName == Current.Fields.SopStatus.ToString())
                alarm.SopStatus = (int)value;
            else if (strFieldName == Current.Fields.AlarmDepth.ToString())
                alarm.AlarmDepth = (int)value;
            else if (strFieldName == Current.Fields.AlarmSensorZoneIDs.ToString())
                alarm.AlarmSensorZoneIDs = (string)value;
        }

        public void ReadSensorZoneHistory(string strFieldName, object value, Models.Sdms.History.SensorZone sensorZone)
        {
            if (sensorZone == null)
                return;

            if (strFieldName == Models.Sdms.History.SensorZone.Fields.ID.ToString())
                sensorZone.ID = (int)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.SensorZoneID.ToString())
                sensorZone.SensorZoneID = (int)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.Data.ToString())
                sensorZone.Data = (string)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.Time.ToString())
                sensorZone.Time = (DateTime)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.ZoneID.ToString())
                sensorZone.ZoneID = (int)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.SensorType.ToString())
                sensorZone.SensorType = (int)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.DetectionStatus.ToString())
            {
                if (value == null)
                    sensorZone.DetectionStatus = null;
                else
                    sensorZone.DetectionStatus = (int)value;
            }
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.SiteID.ToString())
                sensorZone.SiteID = (int)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.AllSensorZoneIDs.ToString())
                sensorZone.AllSensorZoneIDs = (string)value;
            else if (strFieldName == Models.Sdms.History.SensorZone.Fields.Memo.ToString())
                sensorZone.Memo = (string)value;
        }

        public void ReadSensorZone(string strFieldName, object value, SensorZone sensorZone)
        {
            if (strFieldName == SensorZone.Fields.ID.ToString())
                sensorZone.ID = (int)value;
            else if (strFieldName == SensorZone.Fields.SensorType.ToString())
                sensorZone.SensorType = (int)value;
            else if (strFieldName == SensorZone.Fields.OrgSensorID.ToString())
            {
                if (value == null)
                    sensorZone.OrgSensorID = null;
                else
                    sensorZone.OrgSensorID = (int)value;
            }
            else if (strFieldName == SensorZone.Fields.EquipZoneID.ToString())
                sensorZone.EquipZoneID = (int)value;
            else if (strFieldName == SensorZone.Fields.IsAlarmStatus.ToString())
                sensorZone.IsAlarmStatus = (bool)value;
            else if (strFieldName == SensorZone.Fields.Data.ToString())
            {
                if (value == null)
                    sensorZone.Data = null;
                else
                    sensorZone.Data = (int)value;
            }
        }

        public void ReadTagInfo(string strFieldName, object value, TagInfo tagInfo)
        {
            if (strFieldName == TagInfo.Fields.ID.ToString())
                tagInfo.ID = (int)value;
            else if (strFieldName == TagInfo.Fields.SensorServerID.ToString())
                tagInfo.SensorServerID = (int)value;
            else if (strFieldName == TagInfo.Fields.TagNo.ToString())
                tagInfo.TagNo = (int)value;
            else if (strFieldName == TagInfo.Fields.SensorZoneID.ToString())
            {
                if (value == null)
                    tagInfo.SensorZoneID = null;
                else
                    tagInfo.SensorZoneID = (int)value;
            }
            else if (strFieldName == TagInfo.Fields.Activate.ToString())
                tagInfo.Activate = (int)value;
            else if (strFieldName == TagInfo.Fields.Description.ToString())
                tagInfo.Description = (string)value;
        }
    }
}
