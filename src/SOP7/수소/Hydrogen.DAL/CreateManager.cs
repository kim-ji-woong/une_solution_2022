using dnsDBUtil;
using Hydrogen.IDAL;
using Hydrogen.Model.Anomaly;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.DAL
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

        private string GetInsertErrorMessage(string tableName)
        {
            return string.Format("{0} 테이블의 데이터 삽입에 실패하였습니다.", tableName);
        }

        public AnomalyDetection CreateAnomalyDetection(AnomalyDetection obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<AnomalyDetection.Fields, object> dicFieldDatas = new Dictionary<AnomalyDetection.Fields, object>();
            dicFieldDatas[AnomalyDetection.Fields.SensorID] = obj.SensorID;
            dicFieldDatas[AnomalyDetection.Fields.component_id] = obj.component_id;
            dicFieldDatas[AnomalyDetection.Fields.asset_type] = obj.asset_type;
            dicFieldDatas[AnomalyDetection.Fields.location_type] = obj.location_type;
            dicFieldDatas[AnomalyDetection.Fields.sensor_type] = obj.sensor_type;
            dicFieldDatas[AnomalyDetection.Fields.unit_type] = obj.unit_type;
            dicFieldDatas[AnomalyDetection.Fields.id_ext] = obj.id_ext;
            dicFieldDatas[AnomalyDetection.Fields.measure_id] = obj.measure_id;
            dicFieldDatas[AnomalyDetection.Fields.status] = obj.status;
            dicFieldDatas[AnomalyDetection.Fields.base_read_data_time] = obj.base_read_data_time;
            dicFieldDatas[AnomalyDetection.Fields.reconstruction_error_threshold] = obj.reconstruction_error_threshold;
            dicFieldDatas[AnomalyDetection.Fields.diagnosis_status] = obj.diagnosis_status;
            dicFieldDatas[AnomalyDetection.Fields.pattern_type] = obj.pattern_type;
            dicFieldDatas[AnomalyDetection.Fields.is_anomaly] = obj.is_anomaly;            


            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
                AnomalyDetection.TableName,
                GetFieldNames<AnomalyDetection.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc", AnomalyDetection.GetFieldName(AnomalyDetection.Fields.ID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<AnomalyDetection> datas = m_dataManager.GetSelectManager().SelectAnomalyDetections(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameAnomalyDetection(obj, datas[0]))
                    return datas[0];

                return GetAnomalyDetection(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameAnomalyDetection(AnomalyDetection oldObject, AnomalyDetection newObject)
        {
            if (EqualsValue(oldObject.SensorID, newObject.SensorID) &&
                EqualsValue(oldObject.component_id, newObject.component_id) &&
                EqualsValue(oldObject.asset_type, newObject.asset_type) &&
                EqualsValue(oldObject.location_type, newObject.location_type) &&
                EqualsValue(oldObject.sensor_type, newObject.sensor_type) &&
                EqualsValue(oldObject.unit_type, newObject.unit_type) &&
                EqualsValue(oldObject.id_ext, newObject.id_ext) &&
                EqualsValue(oldObject.measure_id, newObject.measure_id) &&
                EqualsValue(oldObject.status, newObject.status) &&
                EqualsValue(oldObject.base_read_data_time, newObject.base_read_data_time) &&
                EqualsValue(oldObject.reconstruction_error_threshold, newObject.reconstruction_error_threshold) &&
                EqualsValue(oldObject.diagnosis_status, newObject.diagnosis_status) &&
                EqualsValue(oldObject.pattern_type, newObject.pattern_type) &&
                EqualsValue(oldObject.is_anomaly, newObject.is_anomaly))
                return true;

            return false;
        }

        private AnomalyDetection GetAnomalyDetection(AnomalyDetection obj, int id, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} < {1} order by {0} desc", AnomalyDetection.GetFieldName(AnomalyDetection.Fields.ID, out isNullable), id);

            List<AnomalyDetection> datas = m_dataManager.GetSelectManager().SelectAnomalyDetections(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (AnomalyDetection data in datas)
            {
                if (IsSameAnomalyDetection(data, obj))
                    return data;

                if (data.ID < id)
                    id = data.ID;
            }

            if (nCount < nLimit)
                return GetAnomalyDetection(obj, id, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(AnomalyDetection.TableName);
            return null;
        }



        public AnomalyDetectionDetail CreateAnomalyDetectionDetail(AnomalyDetectionDetail obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<AnomalyDetectionDetail.Fields, object> dicFieldDatas = new Dictionary<AnomalyDetectionDetail.Fields, object>();
            dicFieldDatas[AnomalyDetectionDetail.Fields.AnomalyDetectionID] = obj.AnomalyDetectionID;
            dicFieldDatas[AnomalyDetectionDetail.Fields.read_data_time] = obj.read_data_time;
            dicFieldDatas[AnomalyDetectionDetail.Fields.timestamp] = obj.timestamp;
            dicFieldDatas[AnomalyDetectionDetail.Fields.point_value_original] = obj.point_value_original;
            dicFieldDatas[AnomalyDetectionDetail.Fields.point_value_reconstruct] = obj.point_value_reconstruct;
            dicFieldDatas[AnomalyDetectionDetail.Fields.error_abs_value] = obj.error_abs_value;
            dicFieldDatas[AnomalyDetectionDetail.Fields.is_anomaly] = obj.is_anomaly;

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
                AnomalyDetectionDetail.TableName,
                GetFieldNames<AnomalyDetectionDetail.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc", AnomalyDetectionDetail.GetFieldName(AnomalyDetectionDetail.Fields.ID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<AnomalyDetectionDetail> datas = m_dataManager.GetSelectManager().SelectAnomalyDetectionDetails(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameAnomalyDetectionDetail(obj, datas[0]))
                    return datas[0];

                return GetAnomalyDetectionDetail(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameAnomalyDetectionDetail(AnomalyDetectionDetail oldObject, AnomalyDetectionDetail newObject)
        {
            if (EqualsValue(oldObject.AnomalyDetectionID, newObject.AnomalyDetectionID) &&
                EqualsValue(oldObject.read_data_time, newObject.read_data_time) &&
                EqualsValue(oldObject.timestamp, newObject.timestamp) &&
                EqualsValue(oldObject.point_value_original, newObject.point_value_original) &&
                EqualsValue(oldObject.point_value_reconstruct, newObject.point_value_reconstruct) &&
                EqualsValue(oldObject.error_abs_value, newObject.error_abs_value) &&
                EqualsValue(oldObject.is_anomaly, newObject.is_anomaly))
                return true;

            return false;
        }

        private AnomalyDetectionDetail GetAnomalyDetectionDetail(AnomalyDetectionDetail obj, int id, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} < {1} order by {0} desc", AnomalyDetectionDetail.GetFieldName(AnomalyDetectionDetail.Fields.ID, out isNullable), id);

            List<AnomalyDetectionDetail> datas = m_dataManager.GetSelectManager().SelectAnomalyDetectionDetails(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (AnomalyDetectionDetail data in datas)
            {
                if (IsSameAnomalyDetectionDetail(data, obj))
                    return data;

                if (data.ID < id)
                    id = data.ID;
            }

            if (nCount < nLimit)
                return GetAnomalyDetectionDetail(obj, id, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(AnomalyDetectionDetail.TableName);
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
    }
}
