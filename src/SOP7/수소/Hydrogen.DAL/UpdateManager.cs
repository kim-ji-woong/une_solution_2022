using dnsDBUtil;
using Hydrogen.IDAL;
using Hydrogen.Model.Anomaly;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.DAL
{
    public class UpdateManager : QueryManager, IUpdate
    {
        private DataManager m_dataManager = null;

        public UpdateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }

        public bool UpdateAnomalyDetection(AnomalyDetection obj, out string strErrorMessage)
        {
            Dictionary<AnomalyDetection.Fields, object> dicSets = new Dictionary<AnomalyDetection.Fields, object>();
            dicSets[AnomalyDetection.Fields.SensorID] = obj.SensorID;
            dicSets[AnomalyDetection.Fields.component_id] = obj.component_id;
            dicSets[AnomalyDetection.Fields.asset_type] = obj.asset_type;
            dicSets[AnomalyDetection.Fields.location_type] = obj.location_type;
            dicSets[AnomalyDetection.Fields.sensor_type] = obj.sensor_type;
            dicSets[AnomalyDetection.Fields.unit_type] = obj.unit_type;
            dicSets[AnomalyDetection.Fields.id_ext] = obj.id_ext;
            dicSets[AnomalyDetection.Fields.measure_id] = obj.measure_id;
            dicSets[AnomalyDetection.Fields.status] = obj.status;
            dicSets[AnomalyDetection.Fields.base_read_data_time] = obj.base_read_data_time;
            dicSets[AnomalyDetection.Fields.reconstruction_error_threshold] = obj.reconstruction_error_threshold;
            dicSets[AnomalyDetection.Fields.diagnosis_status] = obj.diagnosis_status;
            dicSets[AnomalyDetection.Fields.pattern_type] = obj.pattern_type;
            dicSets[AnomalyDetection.Fields.is_anomaly] = obj.is_anomaly;

            Dictionary<AnomalyDetection.Fields, object> dicConditions = new Dictionary<AnomalyDetection.Fields, object>();
            dicConditions[AnomalyDetection.Fields.ID] = obj.ID;

            return UpdateAnomalyDetection(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateAnomalyDetection(Dictionary<AnomalyDetection.Fields, object> dicSets, Dictionary<AnomalyDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<AnomalyDetection.Fields>(ref strSets, dicSets, AnomalyDetection.GetFieldName, AnomalyDetection.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<AnomalyDetection.Fields>(ref strCondition, dicConditions, AnomalyDetection.GetFieldName, AnomalyDetection.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(AnomalyDetection.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }


        public bool UpdateAnomalyDetectionDetail(AnomalyDetectionDetail obj, out string strErrorMessage)
        {
            Dictionary<AnomalyDetectionDetail.Fields, object> dicSets = new Dictionary<AnomalyDetectionDetail.Fields, object>();
            dicSets[AnomalyDetectionDetail.Fields.AnomalyDetectionID] = obj.AnomalyDetectionID;
            dicSets[AnomalyDetectionDetail.Fields.read_data_time] = obj.read_data_time;
            dicSets[AnomalyDetectionDetail.Fields.timestamp] = obj.timestamp;
            dicSets[AnomalyDetectionDetail.Fields.point_value_original] = obj.point_value_original;
            dicSets[AnomalyDetectionDetail.Fields.point_value_reconstruct] = obj.point_value_reconstruct;
            dicSets[AnomalyDetectionDetail.Fields.error_abs_value] = obj.error_abs_value;
            dicSets[AnomalyDetectionDetail.Fields.is_anomaly] = obj.is_anomaly;


            Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions = new Dictionary<AnomalyDetectionDetail.Fields, object>();
            dicConditions[AnomalyDetectionDetail.Fields.ID] = obj.ID;

            return UpdateAnomalyDetectionDetail(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateAnomalyDetectionDetail(Dictionary<AnomalyDetectionDetail.Fields, object> dicSets, Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<AnomalyDetectionDetail.Fields>(ref strSets, dicSets, AnomalyDetectionDetail.GetFieldName, AnomalyDetectionDetail.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<AnomalyDetectionDetail.Fields>(ref strCondition, dicConditions, AnomalyDetectionDetail.GetFieldName, AnomalyDetectionDetail.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(AnomalyDetection.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }



        public bool UpdateFromCondition(string strTableName, string strSets, string strCondition, string strAdditionalConditions, out string strErrorMessage)
        {
            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
                    strCondition = strAdditionalConditions;
            }

            string strSQL = string.Format("Update {0} set {1} where {2}", strTableName, strSets, strCondition);

            if (m_dbManager.GetResultData(strSQL) == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return false;
            }

            strErrorMessage = null;
            return true;
        }
    }
}
