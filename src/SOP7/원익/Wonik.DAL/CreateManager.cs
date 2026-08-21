using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Wonik.IDAL;
using Wonik.Model;

namespace Wonik.DAL
{
    public class CreateManager : QueryManager, ICreate
    {
        private string m_strErrorMessage = null;
        private DataManager m_dataManager = null;

        private const int FindCountLimit = 100;

        public CreateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }

        public VehicleSpeedDetection CreateVehicleSpeedDetection(VehicleSpeedDetection obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<VehicleSpeedDetection.Fields, object> dicFieldDatas = new Dictionary<VehicleSpeedDetection.Fields, object>();
            dicFieldDatas[VehicleSpeedDetection.Fields.DetectionTime] = obj.DetectionTime;
            dicFieldDatas[VehicleSpeedDetection.Fields.SensorID] = obj.SensorID;
            dicFieldDatas[VehicleSpeedDetection.Fields.Speed] = obj.Speed;

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
                VehicleSpeedDetection.TableName,
                GetFieldNames<VehicleSpeedDetection.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc", VehicleSpeedDetection.GetFieldName(VehicleSpeedDetection.Fields.ID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<VehicleSpeedDetection> datas = m_dataManager.GetSelectManager().SelectVehicleSpeedDetections(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameVehicleSpeedDetection(obj, datas[0]))
                    return datas[0];

                return GetVehicleSpeedDetection(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameVehicleSpeedDetection(VehicleSpeedDetection oldObject, VehicleSpeedDetection newObject)
        {
            if (EqualsValue(oldObject.DetectionTime, newObject.DetectionTime) &&
                EqualsValue(oldObject.SensorID, newObject.SensorID))
                return true;

            return false;
        }

        private VehicleSpeedDetection GetVehicleSpeedDetection(VehicleSpeedDetection obj, int id, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} < {1} order by {0} desc", VehicleSpeedDetection.GetFieldName(VehicleSpeedDetection.Fields.ID, out isNullable), id);

            List<VehicleSpeedDetection> datas = m_dataManager.GetSelectManager().SelectVehicleSpeedDetections(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (VehicleSpeedDetection data in datas)
            {
                if (IsSameVehicleSpeedDetection(data, obj))
                    return data;

                if (data.ID < id)
                    id = data.ID;
            }

            if (nCount < nLimit)
                return GetVehicleSpeedDetection(obj, id, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(VehicleSpeedDetection.TableName);
            return null;
        }

        private bool EqualsValue(object oldObj, object newObj)
        {
            if (oldObj == null && newObj == null)
                return true;

            if (oldObj is DateTime)
            {
                DateTime dt1, dt2;
                if (DateTime.TryParse(oldObj.ToString(), out dt1) && DateTime.TryParse(newObj.ToString(), out dt2))
                {
                    if (Convert.ToDateTime(oldObj).ToString("yyyyMMddHHmmss") == Convert.ToDateTime(newObj).ToString("yyyyMMddHHmmss"))
                        return true;
                }
            }
            else
            {
                if (oldObj?.ToString().Trim() == newObj?.ToString().Trim())
                    return true;
            }

            return false;
        }

        private string GetInsertErrorMessage(string tableName)
        {
            return string.Format("{0} 테이블의 데이터 삽입에 실패하였습니다.", tableName);
        }

        public string GetErrorMessage()
        {
            return m_strErrorMessage;
        }

        public bool RunQuery(string strSQL)
        {
            ArrayList arrResult = m_dbManager.GetResultData(strSQL);
            if (arrResult == null)
                return false;

            return true;
        }
    }
}
