using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Wonik.IDAL;
using Wonik.Model;

namespace Wonik.DAL
{
    public class SelectManager : QueryManager, ISelect
    {
        private DataManager m_dataManager = null;
        //private WebDBManager m_dbManager = null;

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

        public VehicleSpeedDetection SelectVehicleSpeedDetection(int id, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<VehicleSpeedDetection.Fields>(out nFieldCount), VehicleSpeedDetection.TableName
                , id);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                VehicleSpeedDetection model = ReadVehicleSpeedDetection(arrResult, 0, out strErrorMessage);

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

        public List<VehicleSpeedDetection> SelectVehicleSpeedDetections(Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectVehicleSpeedDetections(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<VehicleSpeedDetection> SelectVehicleSpeedDetections(Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<VehicleSpeedDetection.Fields>(out nFieldCount), VehicleSpeedDetection.TableName);

            string strCondition = "";

            if (SetCondition<VehicleSpeedDetection.Fields>(ref strCondition, dicConditions, VehicleSpeedDetection.GetFieldName, VehicleSpeedDetection.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<VehicleSpeedDetection> datas = new List<VehicleSpeedDetection>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                VehicleSpeedDetection model = ReadVehicleSpeedDetection(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private VehicleSpeedDetection ReadVehicleSpeedDetection(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            VehicleSpeedDetection model = new VehicleSpeedDetection();
            bool isNullable;

            foreach (VehicleSpeedDetection.Fields field in VehicleSpeedDetection.Fields.GetValues(typeof(VehicleSpeedDetection.Fields)))
            {
                string strFieldName = VehicleSpeedDetection.GetFieldName(field, out isNullable);

                if (field == VehicleSpeedDetection.Fields.ID)
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
                else if (field == VehicleSpeedDetection.Fields.DetectionTime)
                {
                    VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.DetectionTime = data.Data;
                    }
                }
                else if (field == VehicleSpeedDetection.Fields.SensorID)
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
                else if (field == VehicleSpeedDetection.Fields.Speed)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Speed = data.Data;
                    }
                }
                else if (field == VehicleSpeedDetection.Fields.CarNo)
                {
                    // LPR 연동 전이면 null 이다. (isNullable = true)
                    model.CarNo = WebDBManager.GetStringField(arrResult[index]);
                }
                else if (field == VehicleSpeedDetection.Fields.DiffSeconds)
                {
                    // CarNo 와 함께 기록된다. 연동 전이면 null 이다.
                    VariousData<double> data = WebDBManager.GetDoubleField(arrResult[index].ToString());
                    model.DiffSeconds = data == null ? (double?)null : data.Data;
                }

                index++;
            }

            return model;
        }

        private SensorETC ReadSensorETC(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            SensorETC model = new SensorETC();
            bool isNullable;

            foreach (SensorETC.Fields field in SensorETC.Fields.GetValues(typeof(SensorETC.Fields)))
            {
                string strFieldName = SensorETC.GetFieldName(field, out isNullable);

                if (field == SensorETC.Fields.ID)
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
                else if (field == SensorETC.Fields.Department)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.Department = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.Department = str;
                }
                else if (field == SensorETC.Fields.DepartmentPhoneNumber)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.DepartmentPhoneNumber = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.DepartmentPhoneNumber = str;
                }
                else if (field == SensorETC.Fields.Name)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.Name = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.Name = str;
                }
                else if (field == SensorETC.Fields.PositionName)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.PositionName = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.PositionName = str;
                }
                else if (field == SensorETC.Fields.X)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.X = null;
                    }
                    else
                        model.X = data.Data;
                }
                else if (field == SensorETC.Fields.Y)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.Y = null;
                    }
                    else
                        model.Y = data.Data;
                }
                else if (field == SensorETC.Fields.Z)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.Z = null;
                    }
                    else
                        model.Z = data.Data;
                }
                else if (field == SensorETC.Fields.ZoneID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                        model.ZoneID = data.Data;
                }
                else if (field == SensorETC.Fields.CurrentData)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.CurrentData = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.CurrentData = str;
                }
                else if (field == SensorETC.Fields.Enabled)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        model.Enabled = null;
                    }
                    else
                    {
                        model.Enabled = data.Data == 1;
                    }
                }
                else if (field == SensorETC.Fields.Status)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        if (isNullable)
                            model.Status = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.Status = data.Data;
                }
                else if (field == SensorETC.Fields.UniqueKey)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        if (isNullable)
                            model.UniqueKey = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.UniqueKey = str;
                }
                else if (field == SensorETC.Fields.MaterialType)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        if (isNullable)
                            model.MaterialType = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.MaterialType = data.Data;
                    }
                }
                else if (field == SensorETC.Fields.LimitBase)
                {
                    string str = WebDBManager.GetStringField(arrResult[index].ToString());

                    if (str == null)
                    {
                        if (isNullable)
                            model.LimitBase = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.LimitBase = str;
                }
                else if (field == SensorETC.Fields.LimitType)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        if (isNullable)
                            model.LimitType = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.LimitType = data.Data;
                }
                else if (field == SensorETC.Fields.LimitValue)
                {
                    string str = WebDBManager.GetStringField(arrResult[index].ToString());

                    if (str == null)
                    {
                        if (isNullable)
                            model.LimitValue = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.LimitValue = str;
                }
                else if (field == SensorETC.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        if (isNullable)
                            model.SiteID = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                        model.SiteID = data.Data;
                }

                index++;
            }

            return model;
        }


        public ArrayList JoinVehicleSpeedDetectionSensorETC(string strAdditionalConditions, out string strErrorMessage)
        {
            return JoinVehicleSpeedDetectionSensorETC(strAdditionalConditions, null, out strErrorMessage);
        }

        public ArrayList JoinVehicleSpeedDetectionSensorETC(string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strVehicleSpeedDetectionTableName = VehicleSpeedDetection.TableName;
            string strSensorETCTableName = SensorETC.TableName;

            int nVehicleSpeedDetectionFieldCount, nSensorETCFieldCount;

            string strVehicleSpeedDetectionFields = GetFieldNames<VehicleSpeedDetection.Fields>(strVehicleSpeedDetectionTableName, out nVehicleSpeedDetectionFieldCount);
            string strSensorETCFields = GetFieldNames<SensorETC.Fields>(strSensorETCTableName, out nSensorETCFieldCount);

            int nFieldsCount = nVehicleSpeedDetectionFieldCount + nSensorETCFieldCount;

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("Select {0}, {1} ", strVehicleSpeedDetectionFields, strSensorETCFields);
            sb.AppendFormat("  From {0}, {1} ", strVehicleSpeedDetectionTableName, strSensorETCTableName);
            sb.AppendFormat(" Where {0}.{1} = {2}.{3} ", strVehicleSpeedDetectionTableName, VehicleSpeedDetection.Fields.SensorID, strSensorETCTableName, SensorETC.Fields.ID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                sb.AppendFormat(" And {0}", strAdditionalConditions);
            }

            sb.AppendFormat($" ORDER BY {VehicleSpeedDetection.TableName}.{VehicleSpeedDetection.Fields.ID}");

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(sb.ToString()) : m_dbManager.GetResultData(sb.ToString(), (int)topNCount);
            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            ArrayList arrDatas = new ArrayList();
            int nResultCount = arrResult.Count;

            for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
            {
                VehicleSpeedDetection qItem = ReadVehicleSpeedDetection(arrResult, i, out strErrorMessage);

                if (qItem == null)
                    return null;
                else
                    arrDatas.Add(qItem);

                SensorETC q = ReadSensorETC(arrResult, i + nVehicleSpeedDetectionFieldCount, out strErrorMessage);

                if (q == null)
                    return null;
                else
                    arrDatas.Add(q);
            }

            return arrDatas;
        }

    }
}
