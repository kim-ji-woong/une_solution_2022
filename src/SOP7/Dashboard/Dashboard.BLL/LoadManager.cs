using Dashboard.BLL.Models.Response;
using Dashboard.IDAL;
using Dashboard.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Timers;

namespace Dashboard.BLL
{
    public class LoadManager
    {
        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        private static bool m_bIsReading = false;        // 조회중인가 ?
        private static Timer m_timerReadings = null;        // 값 불러오기 타이머

        // 건물그룹 작업자 인원 정보 
        private static List<WorkPermit> m_buildingGroupWorkPermits = new List<WorkPermit>();
        // 건물 작업자 인원 정보
        private static List<WorkPermit> m_buildingWorkPermits = new List<WorkPermit>();
        // 층별 작업자 인원 정보
        private static List<WorkPermit> m_zoneWorkPermits = new List<WorkPermit>();

        public LoadManager(IDataManager dataManager, ProcessManager processManager)
        {
            this.m_dataManager = dataManager;
            this.m_processManager = processManager;

            InitTimer();
        }

        private void InitTimer()
        {
            if (m_timerReadings == null)
            {
                m_timerReadings = new Timer();
                m_timerReadings.Interval = 1000 * 1.5;
                m_timerReadings.Elapsed += new ElapsedEventHandler(timerReadSettings_Elapsed);

                m_timerReadings.Start();
            }
        }

        /// <summary>
        /// 값 불러오기
        /// </summary>
        private void timerReadSettings_Elapsed(object sender, ElapsedEventArgs e)
        {
            LoadWorkPermit();
        }

        public void LoadWorkPermit()
        {
            string strErrorMessage = null;

            if (m_bIsReading == true)
                return;

            m_bIsReading = true;


            // BuildingGroup 인원 현황 불러오기
            Dictionary<WorkPermit.Fields, object> dicConditions = new Dictionary<WorkPermit.Fields, object>();
            dicConditions[WorkPermit.Fields.SpatialType] = (int)WorkPermit.Spatial_Type.BuildingGroup;

            List<WorkPermit> workPermits = m_dataManager.GetSelectManager().SelectWorkPermits(dicConditions, "", out strErrorMessage);

            if (workPermits == null)
            {
                System.Diagnostics.Trace.WriteLine("1. LoadWorkPermit Error : " + strErrorMessage);
                m_bIsReading = false;
                return;
            }

            // 제외 목록
            List<WorkPermit> removes = new List<WorkPermit>();

            // 현재 정보 업데이트
            foreach (WorkPermit workPermit in workPermits)
            {
                WorkPermit _workPermit = m_buildingGroupWorkPermits.Find(x => x.SpatialType == workPermit.SpatialType && x.SpatialID == workPermit.SpatialID && x.WorkerType == workPermit.WorkerType);
                if (_workPermit != null)
                    _workPermit.WorkerCount = workPermit.WorkerCount;
                else
                    m_buildingGroupWorkPermits.Add(workPermit);
            }

            // 현재 정보에 없는 것들은 추출
            foreach (WorkPermit workPermit in m_buildingGroupWorkPermits)
            {
                WorkPermit _workPermit = workPermits.Find(x => x.SpatialType == workPermit.SpatialType && x.SpatialID == workPermit.SpatialID && x.WorkerType == workPermit.WorkerType);
                if (_workPermit == null)
                    removes.Add(workPermit);
            }
            // 제외처리
            foreach (WorkPermit workPermit in removes)
            {
                m_buildingGroupWorkPermits.Remove(workPermit);
            }


            // Building 인원 현황 불러오기
            dicConditions = new Dictionary<WorkPermit.Fields, object>();
            dicConditions[WorkPermit.Fields.SpatialType] = (int)WorkPermit.Spatial_Type.Building;

            workPermits = m_dataManager.GetSelectManager().SelectWorkPermits(dicConditions, "", out strErrorMessage);

            if (workPermits == null)
            {
                System.Diagnostics.Trace.WriteLine("2. LoadWorkPermit Error : " + strErrorMessage);
                m_bIsReading = false;
                return;
            }

            // 제외 목록
            removes = new List<WorkPermit>();

            // 현재 정보 업데이트
            foreach (WorkPermit workPermit in workPermits)
            {
                WorkPermit _workPermit = m_buildingWorkPermits.Find(x => x.SpatialType == workPermit.SpatialType && x.SpatialID == workPermit.SpatialID && x.WorkerType == workPermit.WorkerType);
                if (_workPermit != null)
                    _workPermit.WorkerCount = workPermit.WorkerCount;
                else
                    m_buildingWorkPermits.Add(workPermit);
            }

            // 현재 정보에 없는 것들은 추출
            foreach (WorkPermit workPermit in m_buildingWorkPermits)
            {
                WorkPermit _workPermit = workPermits.Find(x => x.SpatialType == workPermit.SpatialType && x.SpatialID == workPermit.SpatialID && x.WorkerType == workPermit.WorkerType);
                if (_workPermit == null)
                    removes.Add(workPermit);
            }
            // 제외처리
            foreach (WorkPermit workPermit in removes)
            {
                m_buildingWorkPermits.Remove(workPermit);
            }



            // Zone 인원 현황 불러오기
            dicConditions = new Dictionary<WorkPermit.Fields, object>();
            dicConditions[WorkPermit.Fields.SpatialType] = (int)WorkPermit.Spatial_Type.Zone;

            workPermits = m_dataManager.GetSelectManager().SelectWorkPermits(dicConditions, "", out strErrorMessage);

            if (workPermits == null)
            {
                System.Diagnostics.Trace.WriteLine("3. LoadWorkPermit Error : " + strErrorMessage);
                m_bIsReading = false;
                return;
            }

            // 제외 목록
            removes = new List<WorkPermit>();

            // 현재 정보 업데이트
            foreach (WorkPermit workPermit in workPermits)
            {
                WorkPermit _workPermit = m_zoneWorkPermits.Find(x => x.SpatialType == workPermit.SpatialType && x.SpatialID == workPermit.SpatialID && x.WorkerType == workPermit.WorkerType);
                if (_workPermit != null)
                    _workPermit.WorkerCount = workPermit.WorkerCount;
                else
                    m_zoneWorkPermits.Add(workPermit);
            }

            // 현재 정보에 없는 것들은 추출
            foreach (WorkPermit workPermit in m_zoneWorkPermits)
            {
                WorkPermit _workPermit = workPermits.Find(x => x.SpatialType == workPermit.SpatialType && x.SpatialID == workPermit.SpatialID && x.WorkerType == workPermit.WorkerType);
                if (_workPermit == null)
                    removes.Add(workPermit);
            }
            // 제외처리
            foreach (WorkPermit workPermit in removes)
            {
                m_zoneWorkPermits.Remove(workPermit);
            }



            // 대기시간
            System.Threading.Thread.Sleep(3000);

            m_bIsReading = false;
        }

        public ResponseCurrentWorkPermit GetCurrentWorkPermits()
        {
            ResponseCurrentWorkPermit result = new ResponseCurrentWorkPermit();

            Dictionary<CurrentWorkPermit.Fields, object> dicConditions = new Dictionary<CurrentWorkPermit.Fields, object>();
            string strAdditionalConditions = null;
            string strErrorMessage = null;

            List<CurrentWorkPermit> currentWorkPermits = m_dataManager.GetSelectManager().SelectCurrentWorkPermits(dicConditions, strAdditionalConditions, out strErrorMessage);
            
            if (currentWorkPermits == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            result.Success = true;
            result.CurrentWorkPermits = currentWorkPermits;
            return result;
        }


        public ResponseWorkPermit GetWorkPermits()
        {
            ResponseWorkPermit result = new ResponseWorkPermit();

            //Dictionary<WorkPermit.Fields, object> dicConditions = new Dictionary<WorkPermit.Fields, object>();
            //string strAdditionalConditions = null;
            //string strErrorMessage = null;

            //List<WorkPermit> workPermits = m_dataManager.GetSelectManager().SelectWorkPermits(dicConditions, strAdditionalConditions, out strErrorMessage);

            //if (workPermits == null)
            //{
            //    result.Success = false;
            //    result.Message = strErrorMessage;
            //    return result;
            //}

            //result.Success = true;
            //result.WorkPermits = workPermits;

            result.Success = true;
            result.BuildingGroupWorkPermits = m_buildingGroupWorkPermits;
            result.BuildingWorkPermits = m_buildingWorkPermits;
            result.ZoneWorkPermits = m_zoneWorkPermits;
            return result;
        }


        /// <summary>
        /// 사이트별 안전평가 평균점수
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResLoadSiteScores LoadSiteScores()
        {
            ResLoadSiteScores res = new ResLoadSiteScores();

            try
            {
                string strErrorMessage;
                string strSQL = $@"
                SELECT EqZone.SiteID, SUM(A.Score) AS TotalScore, COUNT(B.EquipmentZoneID) AS EqCount, (SUM(A.Score) / COUNT(B.EquipmentZoneID)) AS Avg
                FROM SdmsAssessment A
                INNER JOIN (SELECT EquipmentZoneID, SdmsAssessment.Type, MAX(SendDate) as SD
	                        FROM SdmsAssessment
	                        WHERE Score IS NOT NULL AND SdmsAssessment.Type IS NOT NULL
	                        GROUP BY EquipmentZoneID, SdmsAssessment.Type) B
                    ON A.EquipmentZoneID = B.EquipmentZoneID AND A.Type = B.Type AND A.SendDate = B.SD
                INNER JOIN SdmsSpatialEquipmentZone EqZone ON A.EquipmentZoneID = EqZone.ID
                GROUP BY EqZone.SiteID";

                ArrayList arrResult = m_dataManager.GetSelectManager().GetResultData(strSQL, out strErrorMessage);
                if (arrResult == null)
                    throw new ApplicationException(strErrorMessage);

                res.SiteScores = new List<SiteScoreData>();

                int resultCount = arrResult.Count;
                for (int i = 0; i < resultCount - 3; i += 4)
                {
                    dnsDBUtil.VariousData<int> nSiteID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString());
                    dnsDBUtil.VariousData<float> nTotalScore = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 1].ToString());
                    dnsDBUtil.VariousData<int> nEqCount = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 2].ToString());
                    dnsDBUtil.VariousData<float> nAvg = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 3].ToString());

                    SiteScoreData data = new SiteScoreData();
                    data.SiteID = nSiteID.Data;
                    data.TotalScore = nTotalScore.Data;
                    data.EqCount = nEqCount.Data;
                    data.Avg = nAvg.Data;

                    res.SiteScores.Add(data);
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = e.Message;
            }

            return res;
        }
    }
}
