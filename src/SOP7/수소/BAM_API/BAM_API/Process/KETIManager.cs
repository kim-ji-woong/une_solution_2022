using BAM_API.Data;
using BAM_API.ViewModels;
using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsData.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.Process
{
    public class KETIManager
    {
        private dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager m_dataManager = null;

        private SopQueryManager m_sopQueryManager = null;

        public KETIManager(dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager dataManager)
        {
            m_dataManager = dataManager;

            m_sopQueryManager = new SopQueryManager(Startup.ConfigManager.Site.SOPWebServerURL + ID.URL_Anomaly);
        }

        public MessageResult ReceiveAnomalyDetection(ReqAnomalyDetection req)
        {
            MessageResult response = new MessageResult();

            string strErrorMessage = null;

            try
            {
                Logger.Instance.Write("ReceiveAnomalyDetection 수신");

                Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
                dicConditions[ETC.Fields.Name] = req.id_ext;

                string strConditions = $"{ETC.Fields.Name} = '{req.id_ext}'";

                ETC sensor = m_dataManager.GetSelect().SelectFirst<ETC>(strConditions, out strErrorMessage);
                if (sensor == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                
                AnomalyDetection detection = new AnomalyDetection();                
                detection.SensorID = sensor.ID;
                detection.component_id = req.component_id;

                detection.asset_type = req.asset_type;
                detection.location_type = req.location_type;
                detection.sensor_type = req.sensor_type;
                detection.unit_type = req.unit_type;
                detection.id_ext = req.id_ext;
                detection.measure_id = req.measure_id;
                detection.status = req.data_anomalies.status;

                if (DateTime.TryParse(req.data_anomalies.base_read_data_time, out DateTime dateTime) == false)
                    throw new ApplicationException($"data_anomalies.base_read_data_time 데이터가 올바르지 않습니다. (data_anomalies.base_read_data_time: {req.data_anomalies.base_read_data_time})");
                else
                    detection.base_read_data_time = dateTime;

                detection.reconstruction_error_threshold = req.data_anomalies.reconstruction_error_threshold;

                detection.diagnosis_status = req.data_diagnosis.status;
                detection.pattern_type = req.data_diagnosis.pattern_type;


                if (req.data_anomalies?.data_list?.Count != 10)
                {
                    throw new ApplicationException("data_anomalies data_list 데이터가 올바르지 않습니다.");
                }

                bool is_anomaly = false;

                List<AnomalyDetectionDetail> details = new List<AnomalyDetectionDetail>();

                foreach (anomaly anomaly in req.data_anomalies.data_list)
                {
                    AnomalyDetectionDetail detail = new AnomalyDetectionDetail();

                    if (DateTime.TryParse(anomaly.read_data_time, out DateTime temp) == false)
                        throw new ApplicationException($"anomaly.read_data_time 데이터가 올바르지 않습니다. (anomaly.read_data_time: {anomaly.read_data_time})");
                    else
                        detail.read_data_time = temp;

                    if (DateTime.TryParse(anomaly.timestamp, out DateTime temp2) == false)
                        throw new ApplicationException($"anomaly.read_data_time 데이터가 올바르지 않습니다. (anomaly.timestamp: {anomaly.timestamp})");
                    else
                        detail.timestamp = temp2;

                    detail.point_value_original = anomaly.point_value_original;
                    detail.point_value_reconstruct = anomaly.point_value_reconstruct;
                    detail.error_abs_value = anomaly.error_abs_value;
                    detail.is_anomaly = anomaly.is_anomaly;

                    if (anomaly.is_anomaly == true)
                        is_anomaly = true;

                    details.Add(detail);
                }

                detection.is_anomaly = is_anomaly;


                string strQuery = $@"Insert into {AnomalyDetection.TableName} ({AnomalyDetection.Fields.SensorID}, {AnomalyDetection.Fields.component_id}, {AnomalyDetection.Fields.asset_type}, 
                        {AnomalyDetection.Fields.location_type}, {AnomalyDetection.Fields.sensor_type}, {AnomalyDetection.Fields.unit_type}, {AnomalyDetection.Fields.id_ext}, {AnomalyDetection.Fields.measure_id}, 
                        {AnomalyDetection.Fields.status}, {AnomalyDetection.Fields.base_read_data_time}, {AnomalyDetection.Fields.reconstruction_error_threshold}, {AnomalyDetection.Fields.diagnosis_status}, 
                        {AnomalyDetection.Fields.pattern_type}, {AnomalyDetection.Fields.is_anomaly})
                        Values ({detection.SensorID}, '{detection.component_id}', '{detection.asset_type}', '{detection.location_type}', '{detection.sensor_type}', '{detection.unit_type}', '{detection.id_ext}', '{detection.measure_id}',
                        '{detection.status}', '{detection.base_read_data_time.ToString("yyyy-MM-dd HH:mm:ss")}', {detection.reconstruction_error_threshold.ToString(CultureInfo.InvariantCulture)}, '{detection.diagnosis_status}', '{detection.pattern_type}', {detection.is_anomaly})";

                if (m_dataManager.GetCreate().Insert(strQuery, out strErrorMessage) == false)
                {
                    throw new ApplicationException($"Insert AnomalyDetection Error : {strErrorMessage}, SQL: {strQuery}");
                }

                strQuery = $@"Select IFNULL(MAX({AnomalyDetection.Fields.ID}), 0) as max from {AnomalyDetection.TableName} where {AnomalyDetection.Fields.measure_id} = '{detection.measure_id}'";
                dynamic maxResult = m_dataManager.GetSelect().SelectFirst(strQuery, out strErrorMessage);
                if (maxResult == null)
                {
                    throw new ApplicationException("MAX AnomalyDetection ID Error  : " + strErrorMessage);
                }

                int nMaxID = maxResult.max;


                foreach (AnomalyDetectionDetail detectionDetail in details)
                {
                    detectionDetail.AnomalyDetectionID = nMaxID;

                    strQuery = $@"Insert into {AnomalyDetectionDetail.TableName} ({AnomalyDetectionDetail.Fields.AnomalyDetectionID}, {AnomalyDetectionDetail.Fields.read_data_time}, {AnomalyDetectionDetail.Fields.timestamp}, 
                        {AnomalyDetectionDetail.Fields.point_value_original}, {AnomalyDetectionDetail.Fields.point_value_reconstruct}, {AnomalyDetectionDetail.Fields.error_abs_value}, {AnomalyDetectionDetail.Fields.is_anomaly})
                        Values ({detectionDetail.AnomalyDetectionID}, '{detectionDetail.read_data_time.ToString("yyyy-MM-dd HH:mm:ss")}', '{detectionDetail.timestamp.ToString("yyyy-MM-dd HH:mm:ss")}', {detectionDetail.point_value_original.ToString(CultureInfo.InvariantCulture)}, {detectionDetail.point_value_reconstruct.ToString(CultureInfo.InvariantCulture)}, 
                        {detectionDetail.error_abs_value.ToString(CultureInfo.InvariantCulture)}, {detectionDetail.is_anomaly})";

                    if (m_dataManager.GetCreate().Insert(strQuery, out strErrorMessage) == false)
                    {
                        throw new ApplicationException($"Insert AnomalyDetectionDetail Error : {strErrorMessage}, SQL: {strQuery}");
                    }
                }

                if (detection.is_anomaly == true)
                {
                    string strSQL = @$"SELECT sdmssensorzone.ID AS SensorZoneID,  sdmssensortaginfo.ID as TagID
                                                        FROM sdmssensoretc, sdmssensorzone, sdmssensortaginfo 
                                                        WHERE sdmssensoretc.ID = sdmssensorzone.OrgSensorID 
                                                        AND sdmssensorzone.ID = sdmssensortaginfo.SensorZoneID 
                                                        AND sdmssensoretc.ID = {sensor.ID}
                                                        AND sdmssensorzone.SensorType = {(int)Facility.FacilityType.Anomaly}";

                    dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                    if (result == null)
                    {
                        throw new ApplicationException($"SZ, Tag Join Error (ID: {sensor.ID}, SensorType: {(int)Facility.FacilityType.Anomaly}, Message: {strErrorMessage})");
                    }

                    int nSensorZoneID = result.SensorZoneID;
                    int nTagID = result.TagID;
                    int nLevel = ID.ALARM_LEVEL1;
                    bool bIsAlarm = true;

                    ArrayList arrDatas = new ArrayList();
                    arrDatas.Add((int)Facility.FacilityType.Anomaly);
                    arrDatas.Add(nTagID);
                    arrDatas.Add(nSensorZoneID);
                    arrDatas.Add(bIsAlarm);
                    arrDatas.Add(nLevel);

                    if (m_sopQueryManager.SendAlarmQuery(arrDatas, "POST") == false)
                    {
                        Logger.Instance.Write($"SendAlarmQuery Error (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, Level: {nLevel}, SensorType: {(int)Facility.FacilityType.Anomaly})");
                    }
                    else
                    {
                        Logger.Instance.Write($"SendAlarmQuery Success (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, Level: {nLevel}, SensorType: {(int)Facility.FacilityType.Anomaly})");
                    }
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                Logger.Instance.Write($"ReceiveAnomalyDetection Exception ({e.Message})");
                response.Message = e.Message;
                response.Success = false;
            }

            return response;
        }


    }
}
