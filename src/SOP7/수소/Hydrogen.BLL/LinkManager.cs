using Hydrogen.BLL.Models;
using Hydrogen.BLL.Models.Data;
using Hydrogen.Model.Anomaly;
using SDMS.IDAL;
using SDMS.Model.Sensor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Hydrogen.BLL
{
    public class LinkManager
    {
        private IDataManager m_dataManager = null;
        private Hydrogen.IDAL.IDataManager m_hyDataManager = null;

        public LinkManager(IDataManager dataManager, Hydrogen.IDAL.IDataManager hyDataManager)
        {
            m_dataManager = dataManager;
            m_hyDataManager = hyDataManager;
        }

        public ResponseAnomalyDetections GetTodaySensorAnomalyDetections(int nSensorID)
        {
            ResponseAnomalyDetections response = new ResponseAnomalyDetections();

            string strErrorMessage = null;
            DateTime dtToday = DateTime.Today;

            // .TODO: 테스트를 위한 날짜 변경
            //dtToday = new DateTime(2022, 08, 21);


            // 해당 센서 조회
            ETC sensor = m_dataManager.GetSelectManager().SelectETCSensor(nSensorID, out strErrorMessage);
            if (sensor == null)
            {
                response.Message = strErrorMessage;
                response.Success = false;
                return response;
            }

            List<Models.Data.AnomalyDetectionData> detectionDatas = new List<Models.Data.AnomalyDetectionData>();

            Dictionary<AnomalyDetection.Fields, object> dicConditions = new Dictionary<AnomalyDetection.Fields, object>();
            dicConditions[AnomalyDetection.Fields.SensorID] = nSensorID;

            string strAdditionalConditions = $"{AnomalyDetection.Fields.base_read_data_time} >= '{dtToday.ToString("yyyy-MM-dd") + " 00:00:00"}' AND {AnomalyDetection.Fields.base_read_data_time} <= '{dtToday.ToString("yyyy-MM-dd") + " 23:59:59"}'";

            List<AnomalyDetection> anomalyDetections = m_hyDataManager.GetSelectManager().SelectAnomalyDetections(dicConditions, strAdditionalConditions, out strErrorMessage);
            if (anomalyDetections == null)
            {
                response.Message = strErrorMessage;
                response.Success = false;
                return response;
            }
            else if (anomalyDetections.Count == 0)
            {
                response.Sensor = sensor;
                response.AnomalyDetections = detectionDatas;
                response.Success = true;
                return response;
            }

            // 들어온 시간으로 정렬 
            anomalyDetections = anomalyDetections.OrderBy(x => x.base_read_data_time).ToList();

            List<int> nIDs = new List<int>();
            foreach (AnomalyDetection detection in anomalyDetections)
            {
                nIDs.Add(detection.ID);
            }

            strAdditionalConditions = $"{AnomalyDetectionDetail.Fields.AnomalyDetectionID} in ({string.Join(",", nIDs)})";

            List<AnomalyDetectionDetail> details = m_hyDataManager.GetSelectManager().SelectAnomalyDetectionDetails(null, strAdditionalConditions, out strErrorMessage);
            if (details == null)
            {
                response.Message = strErrorMessage;
                response.Success = false;
                return response;
            }
            else if (details.Count == 0)
            {
                response.Message = "해당 AnomalyDetectionDetail 정보가 존재하지 않습니다.";
                response.Success = false;
                return response;
            }

            // 구간 데이터
            //Dictionary<DateTime, AnomalyDetectionDetail> dicDetails = new Dictionary<DateTime, AnomalyDetectionDetail>();

            foreach (AnomalyDetection anomalyDetection in anomalyDetections)
            {
                // 해당 구간 데이터 조회
                List<AnomalyDetectionDetail> datas = details.FindAll(x => x.AnomalyDetectionID == anomalyDetection.ID);
                // 제대로 된 데이터가 아니면 제외
                if (datas == null || datas.Count == 0)
                    continue;

                // 들어온 시간으로 정렬 
                datas = datas.OrderBy(x => x.read_data_time).ToList();

                //// 구간 데이터 만들기
                //foreach (AnomalyDetectionDetail detail in datas)
                //{
                //    dicDetails[detail.read_data_time] = detail;
                //}
                
                //if (dicDetails.Count > 10)
                //{   // 구간 데이터가 10개 초과할 경우
                //    // 초과한 수 만큼 제거
                //    int nCnt = dicDetails.Count - 10;
                //    List<DateTime> removeKeys = new List<DateTime>();
                //    List<DateTime> keys = dicDetails.Keys.ToList();

                //    // 제거할 키 값 저장 >> 가장 먼저 들어온 순으로 제거
                //    for (int i = 0; i < nCnt; i++)
                //    {
                //        removeKeys.Add(keys[i]);
                //    }

                //    // 제거
                //    foreach(DateTime key in removeKeys)
                //    {
                //        dicDetails.Remove(key);
                //    }
                //}
               
                // 구간 데이터가 10개 존재할 경우
                if (datas.Count == 10)
                {
                    //List<AnomalyDetectionDetail> detectionDetails = datas;

                    AnomalyDetectionData detectionData = new AnomalyDetectionData(anomalyDetection);
                    detectionData.details = datas;

                    if (response.AnomalyDetections == null)
                        response.AnomalyDetections = new List<AnomalyDetectionData>();

                    response.AnomalyDetections.Add(detectionData);
                }
            }

            response.Success = true;
            response.Sensor = sensor;
            return response;
        }

        public MessageResult ReceiveAnomalyDetection(ReqAnomalyDetection req)
        {
            MessageResult response = new MessageResult();

            string strErrorMessage = null;

            try
            {
                Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
                dicConditions[ETC.Fields.Name] = req.id_ext;

                // 테스트 주석
                //List<ETC> sensors = m_dataManager.GetSelectManager().SelectETCSensors(dicConditions, null, out strErrorMessage);
                //if (sensors == null)
                //{
                //    throw new ApplicationException(strErrorMessage);
                //}
                //else if (sensors.Count == 0)
                //{
                //    throw new ApplicationException("id_ext 해당 센서가 존재하지 않습니다.");
                //}

                //ETC sensor = sensors[0];

                AnomalyDetection detection = new AnomalyDetection();
                // 테스트 주석
                //detection.SensorID = sensor.ID;
                detection.SensorID = 1;
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

                AnomalyDetection data = m_hyDataManager.GetCreateManager().CreateAnomalyDetection(detection, out strErrorMessage);
                if (data == null)
                {
                    throw new ApplicationException($"CreateAnomalyDetection Error : {strErrorMessage}");
                }

                foreach (AnomalyDetectionDetail detectionDetail in details)
                {
                    detectionDetail.AnomalyDetectionID = data.ID;

                    AnomalyDetectionDetail detailData = m_hyDataManager.GetCreateManager().CreateAnomalyDetectionDetail(detectionDetail, out strErrorMessage);
                    if (detailData == null)
                    {
                        throw new ApplicationException($"CreateAnomalyDetectionDetail Error : {strErrorMessage}");
                    }
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
                response.Success = false;
            }
            
            return response;
        }
    }    
}
