using System;

namespace Dashboard.DAL
{
    using Dashboard.Model;
    using dnsDBUtil;
    using IDAL;
    using System.Collections;
    using System.Collections.Generic;

    public class SelectManager : QueryManager, ISelect
    {
        private DataManager m_dataManager = null;

        public SelectManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
            //m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
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

        public CurrentWorkPermit SelectCurrentWorkPermit(string strPlantPrcsID, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;
            bool isNullable;

            string strSQL = string.Format("select {0} from {1} where {2} = {3}", GetFieldNames<CurrentWorkPermit.Fields>(out nFieldCount), CurrentWorkPermit.TableName, CurrentWorkPermit.GetFieldName(CurrentWorkPermit.Fields.PLANT_PRCS_ID, out isNullable), strPlantPrcsID);
            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                CurrentWorkPermit model = ReadCurrentWorkPermit(arrResult, 0, out strErrorMessage);

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

        public List<CurrentWorkPermit> SelectCurrentWorkPermits(Dictionary<CurrentWorkPermit.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectCurrentWorkPermits(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<CurrentWorkPermit> SelectCurrentWorkPermits(Dictionary<CurrentWorkPermit.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<CurrentWorkPermit.Fields>(out nFieldCount), CurrentWorkPermit.TableName);

            string strCondition = "";

            if (SetCondition<CurrentWorkPermit.Fields>(ref strCondition, dicConditions, CurrentWorkPermit.GetFieldName, CurrentWorkPermit.TableName, ref strErrorMessage) == false)
                return null;

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
                    strCondition = strAdditionalConditions;
            }

            if (strCondition.Length > 0)
            {
                if (strCondition.Trim().ToLower().StartsWith("order by"))
                    strSQL += " " + strCondition;
                else
                    strSQL += " where " + strCondition;
            }

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<CurrentWorkPermit> currentWorkPermits = new List<CurrentWorkPermit>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                CurrentWorkPermit model = ReadCurrentWorkPermit(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    currentWorkPermits.Add(model);
            }

            return currentWorkPermits;
        }


        private CurrentWorkPermit ReadCurrentWorkPermit(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            CurrentWorkPermit model = new CurrentWorkPermit();
            bool isNullable;

            foreach (CurrentWorkPermit.Fields field in CurrentWorkPermit.Fields.GetValues(typeof(CurrentWorkPermit.Fields)))
            {
                string strFieldName = CurrentWorkPermit.GetFieldName(field, out isNullable);

                if (field == CurrentWorkPermit.Fields.GENERAL_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.GENERAL_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.FIRE_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.FIRE_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.HIGH_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.HIGH_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.ELEC_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ELEC_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.CLOSENESS_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.CLOSENESS_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.CRANE_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.CRANE_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.DIGG_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.DIGG_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.RADI_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.RADI_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.TOTAL_CNT)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.TOTAL_CNT = data.Data;
                    }
                }
                else if (field == CurrentWorkPermit.Fields.PLANT_PRCS_ID)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.PLANT_PRCS_ID = str;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.PLANT_PRCS_ID = str;
                }
                else if (field == CurrentWorkPermit.Fields.UpdateTime)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                        model.UpdateTime = data.Data;
                }

                index++;
            }

            return model;
        }

        public WorkPermit SelectWorkPermit(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<WorkPermit.Fields>(out nFieldCount), WorkPermit.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                WorkPermit model = ReadWorkPermit(arrResult, 0, out strErrorMessage);

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

        public List<WorkPermit> SelectWorkPermits(Dictionary<WorkPermit.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectWorkPermits(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<WorkPermit> SelectWorkPermits(Dictionary<WorkPermit.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<WorkPermit.Fields>(out nFieldCount), WorkPermit.TableName);

            string strCondition = "";

            if (SetCondition<WorkPermit.Fields>(ref strCondition, dicConditions, WorkPermit.GetFieldName, WorkPermit.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<WorkPermit> datas = new List<WorkPermit>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                WorkPermit model = ReadWorkPermit(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private WorkPermit ReadWorkPermit(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            WorkPermit model = new WorkPermit();
            bool isNullable;

            foreach (WorkPermit.Fields field in WorkPermit.Fields.GetValues(typeof(WorkPermit.Fields)))
            {
                string strFieldName = WorkPermit.GetFieldName(field, out isNullable);

                if (field == WorkPermit.Fields.ID)
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
                else if (field == WorkPermit.Fields.SpatialType)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SpatialType = data.Data;
                    }
                }
                else if (field == WorkPermit.Fields.SpatialID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SpatialID = data.Data;
                    }
                }
                else if (field == WorkPermit.Fields.WorkerType)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.WorkerType = null;
                    else
                    {
                        model.WorkerType = data.Data;
                    }
                }
                else if (field == WorkPermit.Fields.WorkerCount)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.WorkerCount = data.Data;
                    }
                }
                else if (field == WorkPermit.Fields.Comment)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.Comment = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.Comment = data;
                    }
                }

                index++;
            }

            return model;
        }
    }

}
