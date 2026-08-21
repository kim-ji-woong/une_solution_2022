using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;

namespace AlarmLinker
{
    using Models;

    class UpdateManager
    {
        private IDataManager m_ownDBManager = null;
        private List<IDataManager> m_externalDBManagers = null;

        public UpdateManager(IDataManager ownDBManager, List<IDataManager> externalDBManagers)
        {
            m_ownDBManager = ownDBManager;
            m_externalDBManagers = externalDBManagers;
        }

        public bool Process()
        {
            List<UpdateDataEx> updateDatas = ReadUpdateDatas();

            if (updateDatas == null)
                return false;

            return ProcessData(updateDatas);
        }

        private bool ProcessData(List<UpdateDataEx> updateDatas)
        {
            foreach (UpdateDataEx updateData in updateDatas)
            {
                if (updateData.IsOwn)
                {
                    if (UpdateExternal(updateData))
                        RemoveOwn(updateData);
                }
                else
                {
                    if (UpdateOwn(updateData))
                        RemoveExternal(updateData);
                }
            }

            return true;
        }

        private bool RemoveOwn(UpdateDataEx updateData)
        {
            string strErrorMessage;
            bool success = m_ownDBManager.GetDelete().Delete<UpdateData>(updateData, null, out strErrorMessage);

            if (success == false)
                System.Diagnostics.Trace.WriteLine("DeleteOwn Fail : " + strErrorMessage);

            return success;
        }

        private bool RemoveExternal(UpdateDataEx updateData)
        {
            string strErrorMessage;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                bool success = dataManager.GetDelete().Delete<UpdateData>(updateData, null, out strErrorMessage);

                if (success == false)
                    System.Diagnostics.Trace.WriteLine("DeleteExternal Fail : " + strErrorMessage);
            }

            return true;
        }

        private bool UpdateOwn(UpdateDataEx updateData)
        {
            updateData.Parse();

            if (updateData.PrimaryCondition != null)
            {
                string command = updateData.PrimaryCondition.ToLower().Trim();

                if (command.StartsWith("insert"))
                    return CreateOwn(updateData);
                else if (command.StartsWith("delete"))
                    return DeleteOwn(updateData, updateData.PrimaryCondition.Substring("delete".Length).Trim());
            }

            int valueCount = updateData.Values.Count;

            if (valueCount != updateData.Fields.Count)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("UpdateData({0}) ID({1}) FieldList와 ValueList의 개수가 다릅니다.", updateData.IsOwn, updateData.ID));
            }

            string strErrorMessage;
            string strSQL = string.Format("Update {0} set ", updateData.NameOfTable);

            for (int i = 0; i < valueCount; i++)
            {
                if (i == 0)
                    strSQL += string.Format("{0} = {1}", updateData.Fields[i], updateData.Values[i]);
                else
                    strSQL += string.Format(", {0} = {1}", updateData.Fields[i], updateData.Values[i]);
            }

            if (updateData.PrimaryCondition != null && updateData.PrimaryCondition.Trim().Length > 0)
                strSQL += " where " + updateData.PrimaryCondition;

            if (m_ownDBManager.GetUpdate().Update(strSQL, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool UpdateExternal(UpdateDataEx updateData)
        {
            updateData.Parse();

            if (updateData.PrimaryCondition != null)
            {
                string command = updateData.PrimaryCondition.ToLower().Trim();

                if (command.StartsWith("insert"))
                    return CreateExternal(updateData);
                else if (command.StartsWith("delete"))
                    return DeleteExternal(updateData, updateData.PrimaryCondition.Substring("delete".Length).Trim());
            }

            int valueCount = updateData.Values.Count;

            if (valueCount != updateData.Fields.Count)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("UpdateData({0}) ID({1}) FieldList와 ValueList의 개수가 다릅니다.", updateData.IsOwn, updateData.ID));
            }

            string strErrorMessage;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                string strSQL = string.Format("Update {0} set ", updateData.NameOfTable);

                for (int i=0;i<valueCount;i++)
                {
                    if (i == 0)
                        strSQL += string.Format("{0} = {1}", updateData.Fields[i], updateData.Values[i]);
                    else
                        strSQL += string.Format(", {0} = {1}", updateData.Fields[i], updateData.Values[i]);
                }

                if (updateData.PrimaryCondition != null && updateData.PrimaryCondition.Trim().Length > 0)
                    strSQL += " where " + updateData.PrimaryCondition;

                if (dataManager.GetUpdate().Update(strSQL, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool DeleteOwn(UpdateDataEx updateData, string strCondition)
        {
            string strErrorMessage;
            string strSQL = string.Format("Delete from {0}", updateData.NameOfTable);

            if (strCondition.Length > 0)
                strSQL += " where " + strCondition;

            // GetDelete()에서 SQL만을 사용하는 Delete를 지원하지 않기 때문에 Update를 사용한다.
            if (m_ownDBManager.GetUpdate().Update(strSQL, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool DeleteExternal(UpdateDataEx updateData, string strCondition)
        {
            string strErrorMessage;
            string strSQL = string.Format("Delete from {0}", updateData.NameOfTable);

            if (strCondition.Length > 0)
                strSQL += " where " + strCondition;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                // GetDelete()에서 SQL만을 사용하는 Delete를 지원하지 않기 때문에 Update를 사용한다.
                if (dataManager.GetUpdate().Update(strSQL, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateOwn(UpdateDataEx updateData)
        {
            int valueCount = updateData.Values.Count;

            if (valueCount != updateData.Fields.Count)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("UpdateData({0}) ID({1}) FieldList와 ValueList의 개수가 다릅니다.", updateData.IsOwn, updateData.ID));
            }

            string strErrorMessage;
            string strSQL = string.Format("Insert into {0} (", updateData.NameOfTable);

            for (int i = 0; i < valueCount; i++)
            {
                if (i == 0)
                    strSQL += string.Format("{0}", updateData.Fields[i]);
                else
                    strSQL += string.Format(", {0}", updateData.Fields[i]);
            }

            strSQL += ") values (";

            for (int i = 0; i < valueCount; i++)
            {
                if (i == 0)
                    strSQL += string.Format("{0}", updateData.Values[i]);
                else
                    strSQL += string.Format(", {0}", updateData.Values[i]);
            }

            strSQL += ")";

            if (m_ownDBManager.GetCreate().Insert(strSQL, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateExternal(UpdateDataEx updateData)
        {
            int valueCount = updateData.Values.Count;

            if (valueCount != updateData.Fields.Count)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("UpdateData({0}) ID({1}) FieldList와 ValueList의 개수가 다릅니다.", updateData.IsOwn, updateData.ID));
            }

            string strErrorMessage;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                string strSQL = string.Format("Insert into {0} (", updateData.NameOfTable);

                for (int i = 0; i < valueCount; i++)
                {
                    if (i == 0)
                        strSQL += string.Format("{0}", updateData.Fields[i]);
                    else
                        strSQL += string.Format(", {0}", updateData.Fields[i]);
                }

                strSQL += ") values (";

                for (int i = 0; i < valueCount; i++)
                {
                    if (i == 0)
                        strSQL += string.Format("{0}", updateData.Values[i]);
                    else
                        strSQL += string.Format(", {0}", updateData.Values[i]);
                }

                strSQL += ")";

                if (dataManager.GetCreate().Insert(strSQL, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private List<UpdateDataEx> ReadUpdateDatas()
        {
            List<UpdateDataEx> updateDatas = new List<UpdateDataEx>();

            string strErrorMessage;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                IEnumerable<UpdateData> externalDatas = dataManager.GetSelect().Select<UpdateData>(null, out strErrorMessage);

                if (externalDatas == null)
                {
                    System.Diagnostics.Trace.WriteLine("Read External UdpateData Error : " + strErrorMessage);
                    return null;
                }

                AddUpdateDatas(updateDatas, externalDatas, false);
            }

            IEnumerable<UpdateData> ownDatas = m_ownDBManager.GetSelect().Select<UpdateData>(null, out strErrorMessage);

            if (ownDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("Read Own UdpateData Error : " + strErrorMessage);
                return null;
            }

            AddUpdateDatas(updateDatas, ownDatas, true);

            updateDatas.Sort();
            return updateDatas;
        }

        private void AddUpdateDatas(List<UpdateDataEx> updateDatas, IEnumerable<UpdateData> datas, bool isOwn)
        {
            foreach (UpdateData data in datas)
            {
                UpdateDataEx updateData = new UpdateDataEx();

                updateData.FieldList = data.FieldList;
                updateData.ID = data.ID;
                updateData.PrimaryCondition = data.PrimaryCondition;
                updateData.IsOwn = isOwn;
                updateData.NameOfTable = data.NameOfTable;
                updateData.Timestamp = data.Timestamp;
                updateData.ValueList = data.ValueList;

                updateDatas.Add(updateData);
            }
        }
    }

    class UpdateDataEx : UpdateData, IComparable
    {
        private bool m_isOwn = true;
        private List<string> m_fields = new List<string>();
        private List<string> m_values = new List<string>();

        public bool IsOwn
        {
            get { return m_isOwn; }
            set { m_isOwn = value; }
        }

        public List<string> Fields
        {
            get { return m_fields; }
        }

        public List<string> Values
        {
            get { return m_values; }
        }

        public int CompareTo(object obj)
        {
            UpdateDataEx data = (UpdateDataEx)obj;
            return this.Timestamp.CompareTo(data.Timestamp);
        }

        public void Parse()
        {
            m_fields.Clear();
            string[] tokens = this.FieldList.Split(',');

            foreach (string strToken in tokens)
            {
                m_fields.Add(strToken.Trim());
            }

            m_values.Clear();

            string strValues = this.ValueList.Trim();
            int len = strValues.Length;

            int beginIndex = -1;
            bool quotation = false;

            for (int i=0;i<len;i++)
            {
                char ch = strValues[i];

                if (beginIndex < 0)
                {
                    if (ch == '\'')
                        quotation = true;
                    else if (ch == ',' || ch == ' ' || ch == '\t')
                        continue;
                    else
                        quotation = false;

                    beginIndex = i;
                }
                else
                {
                    if (quotation)
                    {
                        if (ch == '\'')
                            AddValue(strValues, ref beginIndex, i + 1);
                    }
                    else
                    {
                        if (ch == ',')
                            AddValue(strValues, ref beginIndex, i);
                    }
                }
            }

            if (beginIndex >= 0)
                AddValue(strValues, ref beginIndex, len);
        }

        private void AddValue(string strValues, ref int beginIndex, int endIndex)
        {
            string strValue = strValues.Substring(beginIndex, endIndex - beginIndex);
            m_values.Add(strValue.Trim());

            beginIndex = -1;
        }
    }
}
