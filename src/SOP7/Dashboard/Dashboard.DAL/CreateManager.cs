using System;

namespace Dashboard.DAL
{
    using Dashboard.Model;
    using dnsDBUtil;
    using IDAL;
    using System.Collections;
    using System.Collections.Generic;

    public class CreateManager : QueryManager, ICreate
    {
        private string m_strErrorMessage = null;
        private DataManager m_dataManager = null;

        private const int FindCountLimit = 100;

        public CreateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
            //m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
        }

        public string GetErrorMessage()
        {
            return m_strErrorMessage;
        }

        public CurrentWorkPermit CreateCurrentWorkPermit(int nGeneralCnt, int nFireCnt, int nHighCnt, int nElecCnt, int nClosenessCnt, int nCraneCnt, int nDiggCnt, int nRadiCnt, int nTotalCnt, string strPlantPrcsID, DateTime dtUpdate)
        {
            Dictionary<CurrentWorkPermit.Fields, object> dicFieldDatas = new Dictionary<CurrentWorkPermit.Fields, object>();
            dicFieldDatas[CurrentWorkPermit.Fields.GENERAL_CNT] = nGeneralCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.FIRE_CNT] = nFireCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.HIGH_CNT] = nHighCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.ELEC_CNT] = nElecCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.CLOSENESS_CNT] = nClosenessCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.CRANE_CNT] = nCraneCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.DIGG_CNT] = nDiggCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.RADI_CNT] = nRadiCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.TOTAL_CNT] = nTotalCnt;
            dicFieldDatas[CurrentWorkPermit.Fields.PLANT_PRCS_ID] = strPlantPrcsID;
            dicFieldDatas[CurrentWorkPermit.Fields.UpdateTime] = dtUpdate;

            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                CurrentWorkPermit.TableName,
                GetFieldNames<CurrentWorkPermit.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                CurrentWorkPermit data = new CurrentWorkPermit();
                data.GENERAL_CNT = nGeneralCnt;
                data.FIRE_CNT = nFireCnt;
                data.HIGH_CNT = nHighCnt;
                data.ELEC_CNT = nElecCnt;
                data.CLOSENESS_CNT = nClosenessCnt;
                data.CRANE_CNT = nCraneCnt;
                data.DIGG_CNT = nDiggCnt;
                data.RADI_CNT = nRadiCnt;
                data.TOTAL_CNT = nTotalCnt;
                data.PLANT_PRCS_ID = strPlantPrcsID;
                data.UpdateTime = dtUpdate;

                return data;
                /*string strErrorMessage;
                List<CurrentWorkPermit> currents = m_dataManager.GetSelectManager().SelectCurrentWorkPermits(dicFieldDatas, null, out strErrorMessage);

                if (currents == null || currents.Count == 0)
                {
                    m_strErrorMessage = strErrorMessage;
                    return null;
                }

                return currents[0];*/
            }
            else
            {
                m_strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public WorkPermit CreateWorkPermit(WorkPermit obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<WorkPermit.Fields, object> dicFieldDatas = new Dictionary<WorkPermit.Fields, object>();
            dicFieldDatas[WorkPermit.Fields.SpatialType] = obj.SpatialType;
            dicFieldDatas[WorkPermit.Fields.SpatialID] = obj.SpatialID;
            dicFieldDatas[WorkPermit.Fields.WorkerType] = obj.WorkerType;
            dicFieldDatas[WorkPermit.Fields.WorkerCount] = obj.WorkerCount;
            dicFieldDatas[WorkPermit.Fields.Comment] = obj.Comment;

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
                WorkPermit.TableName,
                GetFieldNames<WorkPermit.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc", WorkPermit.GetFieldName(WorkPermit.Fields.ID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<WorkPermit> datas = m_dataManager.GetSelectManager().SelectWorkPermits(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameWorkPermit(obj, datas[0]))
                    return datas[0];

                return GetWorkPermit(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameWorkPermit(WorkPermit oldObject, WorkPermit newObject)
        {
            if (oldObject.SpatialType == newObject.SpatialType &&
                oldObject.SpatialID == newObject.SpatialID &&
                oldObject.WorkerType == newObject.WorkerType &&
                oldObject.WorkerCount == newObject.WorkerCount &&
                oldObject.Comment == newObject.Comment)
                return true;

            return false;
        }

        private WorkPermit GetWorkPermit(WorkPermit obj, int id, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} < {1} order by {0} desc", WorkPermit.GetFieldName(WorkPermit.Fields.ID, out isNullable), id);

            List<WorkPermit> datas = m_dataManager.GetSelectManager().SelectWorkPermits(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (WorkPermit data in datas)
            {
                if (IsSameWorkPermit(data, obj))
                    return data;

                if (data.ID < id)
                    id = data.ID;
            }

            if (nCount < nLimit)
                return GetWorkPermit(obj, id, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(WorkPermit.TableName);
            return null;
        }

        private bool IsSameTime(DateTime? time1, DateTime? time2)
        {
            if (time1 == null && time2 == null)
                return true;
            else if (time1 == null || time2 == null)
                return false;

            return IsSameTime2((DateTime)time1, (DateTime)time2);
        }

        private bool IsSameTime2(DateTime time1, DateTime time2)
        {
            if (time1.Year == time2.Year &&
                time1.Month == time2.Month &&
                time1.Day == time2.Day &&
                time1.Hour == time2.Hour &&
                time1.Minute == time2.Minute &&
                time1.Second == time2.Second)
                return true;

            return false;
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
                else
                {
                    if (oldObj.ToString().Trim() == newObj.ToString().Trim())
                        return true;
                }
            }

            return false;
        }

        private string GetInsertErrorMessage(string tableName)
        {
            return string.Format("{0} 테이블의 데이터 삽입에 실패하였습니다.", tableName);
        }
    }
}
