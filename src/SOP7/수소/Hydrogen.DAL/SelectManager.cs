using dnsDBUtil;
using Hydrogen.IDAL;
using Hydrogen.Model.Anomaly;
using Hydrogen.Model.RiskAssess;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.DAL
{
    public class SelectManager : QueryManager, ISelect
    {
        private DataManager m_dataManager = null;        

        public SelectManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }

        public ArrayList GetResultData(string strSQL, out string strErrorMessage)
        {
            strErrorMessage = null;

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            return arrResult;
        }

        public AnomalyDetection SelectAnomalyDetection(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<AnomalyDetection.Fields>(out nFieldCount), AnomalyDetection.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                AnomalyDetection model = ReadAnomalyDetection(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<AnomalyDetection> SelectAnomalyDetections(Dictionary<AnomalyDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectAnomalyDetections(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<AnomalyDetection> SelectAnomalyDetections(Dictionary<AnomalyDetection.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<AnomalyDetection.Fields>(out nFieldCount), AnomalyDetection.TableName);

            string strCondition = "";

            if (SetCondition<AnomalyDetection.Fields>(ref strCondition, dicConditions, AnomalyDetection.GetFieldName, AnomalyDetection.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<AnomalyDetection> datas = new List<AnomalyDetection>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                AnomalyDetection model = ReadAnomalyDetection(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private AnomalyDetection ReadAnomalyDetection(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            AnomalyDetection model = new AnomalyDetection();
            bool isNullable;

            foreach (AnomalyDetection.Fields field in AnomalyDetection.Fields.GetValues(typeof(AnomalyDetection.Fields)))
            {
                string strFieldName = AnomalyDetection.GetFieldName(field, out isNullable);

                if (field == AnomalyDetection.Fields.ID)
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
                else if (field == AnomalyDetection.Fields.SensorID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SensorID = data.Data;
                    }
                }
                else if (field == AnomalyDetection.Fields.component_id)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.component_id = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.asset_type)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.asset_type = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.location_type)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.location_type = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.sensor_type)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.sensor_type = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.unit_type)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.unit_type = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.id_ext)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.id_ext = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.measure_id)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.measure_id = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.status)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.status = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.base_read_data_time)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.base_read_data_time = data.Data;
                    }
                }
                else if (field == AnomalyDetection.Fields.reconstruction_error_threshold)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.reconstruction_error_threshold = data.Data;
                    }
                }
                else if (field == AnomalyDetection.Fields.diagnosis_status)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.diagnosis_status = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.pattern_type)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.pattern_type = data;
                    }
                }
                else if (field == AnomalyDetection.Fields.is_anomaly)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.is_anomaly = data.Data == 1 ? true : false;
                    }

                }

                index++;
            }

            return model;
        }





        public AnomalyDetectionDetail SelectAnomalyDetectionDetail(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<AnomalyDetectionDetail.Fields>(out nFieldCount), AnomalyDetectionDetail.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                AnomalyDetectionDetail model = ReadAnomalyDetectionDetail(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<AnomalyDetectionDetail> SelectAnomalyDetectionDetails(Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectAnomalyDetectionDetails(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<AnomalyDetectionDetail> SelectAnomalyDetectionDetails(Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<AnomalyDetectionDetail.Fields>(out nFieldCount), AnomalyDetectionDetail.TableName);

            string strCondition = "";

            if (SetCondition<AnomalyDetectionDetail.Fields>(ref strCondition, dicConditions, AnomalyDetectionDetail.GetFieldName, AnomalyDetectionDetail.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<AnomalyDetectionDetail> datas = new List<AnomalyDetectionDetail>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                AnomalyDetectionDetail model = ReadAnomalyDetectionDetail(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private AnomalyDetectionDetail ReadAnomalyDetectionDetail(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            AnomalyDetectionDetail model = new AnomalyDetectionDetail();
            bool isNullable;

            foreach (AnomalyDetectionDetail.Fields field in AnomalyDetectionDetail.Fields.GetValues(typeof(AnomalyDetectionDetail.Fields)))
            {
                string strFieldName = AnomalyDetectionDetail.GetFieldName(field, out isNullable);

                if (field == AnomalyDetectionDetail.Fields.ID)
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
                else if (field == AnomalyDetectionDetail.Fields.AnomalyDetectionID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.AnomalyDetectionID = data.Data;
                    }
                }
                else if (field == AnomalyDetectionDetail.Fields.read_data_time)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.read_data_time = data.Data;
                    }
                }
                else if (field == AnomalyDetectionDetail.Fields.timestamp)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.timestamp = data.Data;
                    }
                }
                else if (field == AnomalyDetectionDetail.Fields.point_value_original)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.point_value_original = data.Data;
                    }
                }
                else if (field == AnomalyDetectionDetail.Fields.point_value_reconstruct)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.point_value_reconstruct = data.Data;
                    }
                }
                else if (field == AnomalyDetectionDetail.Fields.error_abs_value)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.error_abs_value = data.Data;
                    }
                }
                else if (field == AnomalyDetectionDetail.Fields.is_anomaly)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.is_anomaly = data.Data == 1 ? true : false;
                    }

                }

                index++;
            }

            return model;
        }



        public HistoryRiskAssess SelectHistoryRiskAssess(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<HistoryRiskAssess.Fields>(out nFieldCount), HistoryRiskAssess.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                HistoryRiskAssess model = ReadHistoryRiskAssess(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<HistoryRiskAssess> SelectHistoryRiskAssess(Dictionary<HistoryRiskAssess.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectHistoryRiskAssess(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<HistoryRiskAssess> SelectHistoryRiskAssess(Dictionary<HistoryRiskAssess.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<HistoryRiskAssess.Fields>(out nFieldCount), HistoryRiskAssess.TableName);

            string strCondition = "";

            if (SetCondition<HistoryRiskAssess.Fields>(ref strCondition, dicConditions, HistoryRiskAssess.GetFieldName, HistoryRiskAssess.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<HistoryRiskAssess> datas = new List<HistoryRiskAssess>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                HistoryRiskAssess model = ReadHistoryRiskAssess(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private HistoryRiskAssess ReadHistoryRiskAssess(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            HistoryRiskAssess model = new HistoryRiskAssess();
            bool isNullable;

            foreach (HistoryRiskAssess.Fields field in HistoryRiskAssess.Fields.GetValues(typeof(HistoryRiskAssess.Fields)))
            {
                string strFieldName = HistoryRiskAssess.GetFieldName(field, out isNullable);

                if (field == HistoryRiskAssess.Fields.ID)
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
                else if (field == HistoryRiskAssess.Fields.SensorID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SensorID = data.Data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.Parameter)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Parameter = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.Deviation)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Deviation = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.Cause)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Cause = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.event_scenario)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.event_scenario = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.hazard_scenario)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.hazard_scenario = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.action)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.action = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.reference)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.reference = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.status)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.status = data;
                    }
                }
                else if (field == HistoryRiskAssess.Fields.read_data_time)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.read_data_time = data.Data;
                    }
                }                

                index++;
            }

            return model;
        }
    }
}
