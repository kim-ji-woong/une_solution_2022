using System;
using System.Collections.Generic;
using GGH.Model;
using SDMS.Model.CCTV;
using GGH.Model.CCTV;
using GGH.Model.Equipment;

namespace GGH.BLL
{
    using IDAL;
    using Models.Response;

    public class UpdateDataManager
    {
        public static bool MakeUpdateData(ResponseCCTVList.CCTVData cctvData, DateTime timestamp, IDataManager dataManager, out string strErrorMessage)
        {
            UpdateData updateData = new UpdateData();

            updateData.Timestamp = timestamp;
            updateData.NameOfTable = CCTV.TableName;
            updateData.FieldList = CCTV.Fields.CameraIP.ToString() + "," + CCTV.Fields.CameraCompanyName.ToString() + "," + CCTV.Fields.Description.ToString();
            updateData.ValueList = string.Format("{0},{1},{2}", GetStringData(cctvData.IP), GetStringData(cctvData.DeviceID), GetStringData(cctvData.Description));
            updateData.PrimaryCondition = string.Format("{0} = {1}", CCTV.Fields.ID, cctvData.ID);

            if (dataManager.GetCreateManager().CreateUpdateData(updateData, out strErrorMessage) == null)
                return false;

            return true;
        }

        public static bool MakeUpdateData(Nvr nvr, DateTime timestamp, IDataManager dataManager, out string strErrorMessage)
        {
            UpdateData updateData = new UpdateData();

            updateData.Timestamp = timestamp;
            updateData.NameOfTable = Nvr.TableName;
            updateData.FieldList = Nvr.Fields.Url.ToString();
            updateData.ValueList = string.Format("{0}", GetStringData(nvr.Url));
            updateData.PrimaryCondition = string.Format("{0} = {1}", Nvr.Fields.ID, nvr.ID);

            if (dataManager.GetCreateManager().CreateUpdateData(updateData, out strErrorMessage) == null)
                return false;

            return true;
        }

        public static bool MakeUpdateData(CCTV cctv, DateTime timestamp, IDataManager dataManager, out string strErrorMessage)
        {
            UpdateData updateData = new UpdateData();

            updateData.Timestamp = timestamp;
            updateData.NameOfTable = CCTV.TableName;
            updateData.FieldList = CCTV.Fields.URL.ToString() + "," + CCTV.Fields.BigURL.ToString() + "," + CCTV.Fields.SmallURL.ToString();
            updateData.ValueList = string.Format("{0},{1},{2}", GetStringData(cctv.URL), GetStringData(cctv.BigURL), GetStringData(cctv.SmallURL));
            updateData.PrimaryCondition = string.Format("{0} = {1}", CCTV.Fields.ID, cctv.ID);

            if (dataManager.GetCreateManager().CreateUpdateData(updateData, out strErrorMessage) == null)
                return false;

            return true;
        }

        public static bool MakeUpdateData(FirstAidEquipment equipment, DateTime timestamp, IDataManager dataManager, out string strErrorMessage)
        {
            UpdateData updateData = new UpdateData();

            updateData.Timestamp = timestamp;
            updateData.NameOfTable = FirstAidEquipment.TableName;
            updateData.FieldList = FirstAidEquipment.Fields.X.ToString() + "," + FirstAidEquipment.Fields.Y.ToString() + "," + FirstAidEquipment.Fields.Z.ToString();
            updateData.ValueList = string.Format("{0},{1},{2}", GetDoubleData(equipment.X), GetDoubleData(equipment.Y), GetDoubleData(equipment.Z));
            updateData.PrimaryCondition = string.Format("{0} = {1}", FirstAidEquipment.Fields.ID, equipment.ID);

            if (dataManager.GetCreateManager().CreateUpdateData(updateData, out strErrorMessage) == null)
                return false;

            return true;
        }

        public static bool MakeUpdateData(IDataManager dataManager, string strTableName, string strFields, string strValues, string strCondition, out string strErrorMessage)
        {
            UpdateData updateData = new UpdateData();

            updateData.Timestamp = DateTime.Now;
            updateData.NameOfTable = strTableName;
            updateData.FieldList = strFields;
            updateData.ValueList = strValues;
            updateData.PrimaryCondition = strCondition;

            return dataManager.GetCreateManager().CreateUpdateData(updateData, out strErrorMessage) == null ? false : true;
        }

        public static bool MakeInsertData(FirstAidEquipment equipment, DateTime timestamp, IDataManager dataManager, out string strErrorMessage)
        {
            Dictionary<FirstAidEquipment.Fields, object> dicFieldDatas = new Dictionary<FirstAidEquipment.Fields, object>();

            dicFieldDatas[FirstAidEquipment.Fields.EquipmentName] = equipment.EquipmentName;
            dicFieldDatas[FirstAidEquipment.Fields.EquipmentType] = equipment.EquipmentType;
            dicFieldDatas[FirstAidEquipment.Fields.ID] = equipment.ID;
            dicFieldDatas[FirstAidEquipment.Fields.SiteID] = equipment.SiteID;
            dicFieldDatas[FirstAidEquipment.Fields.X] = equipment.X;
            dicFieldDatas[FirstAidEquipment.Fields.Y] = equipment.Y;
            dicFieldDatas[FirstAidEquipment.Fields.Z] = equipment.Z;
            dicFieldDatas[FirstAidEquipment.Fields.ZoneID] = equipment.ZoneID;

            UpdateData updateData = new UpdateData();

            updateData.Timestamp = timestamp;
            updateData.NameOfTable = FirstAidEquipment.TableName;
            updateData.FieldList = GetFieldNames<FirstAidEquipment.Fields>();
            updateData.ValueList = GetFieldValues<FirstAidEquipment.Fields>(dicFieldDatas);
            updateData.PrimaryCondition = "Insert";

            return dataManager.GetCreateManager().CreateUpdateData(updateData, out strErrorMessage) == null ? false : true;
        }

        public static bool MakeDeleteData(IDataManager dataManager, string strTableName, string strCondition, out string strErrorMessage)
        {
            UpdateData updateData = new UpdateData();

            updateData.Timestamp = DateTime.Now;
            updateData.NameOfTable = strTableName;
            updateData.FieldList = null;
            updateData.ValueList = "";

            if (strCondition == null)
                updateData.PrimaryCondition = "Delete";
            else if (strCondition.Trim().Length > 0)
                updateData.PrimaryCondition = "Delete " + strCondition;

            return dataManager.GetCreateManager().CreateUpdateData(updateData, out strErrorMessage) == null ? false : true;
        }

        private static string GetStringData(string str)
        {
            if (str == null)
                return "null";

            return "'" + str + "'";
        }

        private static string GetDoubleData(double? data)
        {
            if (data == null)
                return "null";

            return data.ToString();
        }

        private static string GetFieldNames<EnumType>(out int nFieldCount)
        {
            nFieldCount = 0;
            string strFields = "";

            foreach (EnumType type in Enum.GetValues(typeof(EnumType)))
            {
                if (strFields.Length == 0)
                    strFields = type.ToString();
                else
                    strFields += ", " + type.ToString();

                nFieldCount++;
            }

            return strFields;
        }

        private static string GetFieldNames<EnumType>(string strTag, out int nFieldCount)
        {
            nFieldCount = 0;
            string strFields = "";

            foreach (EnumType type in Enum.GetValues(typeof(EnumType)))
            {
                if (strFields.Length == 0)
                    strFields = strTag + "." + type.ToString();
                else
                    strFields += ", " + strTag + "." + type.ToString();

                nFieldCount++;
            }

            return strFields;
        }

        private static string GetFieldNames<EnumType>()
        {
            int nFieldCount;
            return GetFieldNames<EnumType>(out nFieldCount);
        }

        private static string GetFieldValues<EnumType>(Dictionary<EnumType, object> dicFieldDatas)
        {
            string strValues = "";
            object data;

            foreach (EnumType type in Enum.GetValues(typeof(EnumType)))
            {
                if (dicFieldDatas.TryGetValue(type, out data) == false)
                    continue;

                string strValue = GetValueString(data);

                if (strValues.Length == 0)
                    strValues = strValue;
                else
                    strValues += ", " + strValue;
            }

            return strValues;
        }

        private static string GetValueString(object data)
        {
            if (data != null)
            {
                if ((data is int) || (data is long) || (data is float) || (data is double))
                {
                    return data.ToString();
                }
                else if (data is bool)
                {
                    bool bData = (bool)data;
                    return bData ? "1" : "0";
                }
                else if (data is DateTime)
                {
                    string strData = "'" + TimeString((DateTime)data) + "'";
                    return strData;
                }
                else if (data is string)
                {
                    string strData = "'" + ((string)data).Replace("'", "''") + "'";
                    return strData;
                }
            }

            return "NULL";
        }

        private static string TimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}",
                time.Year, time.Month, time.Day,
                time.Hour, time.Minute, time.Second);
        }
    }
}
