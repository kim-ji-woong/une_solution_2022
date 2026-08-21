using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace YH_SensorServer_Framework.Process
{
    using Models;

    public static class ProcessManager
    {
        public static MessageResult SetSensorValue(DBConfig config, SensorValue data)
        {
            string strSQL = string.Format("Insert into SensorValue (SensorID, TimeStamp, SensorValue) values ({0}, '{1}', {2:F2})", data.SensorID, GetTime(DateTime.Now), data.Value);
            string[] results = RunQuery(config, strSQL);

            if (results != null && results.Length >= 2)
            {
                if (results[0] == "1")
                    return new MessageResult(true, "");
                else
                    return new MessageResult(false, results[1]);
            }

            return new MessageResult(false, "DB에 센서값을 삽입하는데 실패하였습니다.");
        }

        public static MessageResult SetSensorConfig(DBConfig config, SensorConfig data)
        {
            string strSQL = string.Format("Update Sensor set AlarmLimit1 = {0}, AlarmLimit2 = {1}, AlarmLimit3 = {2} where ID = {3}", GetFloatValue(data.AlarmLimit1), GetFloatValue(data.AlarmLimit2), GetFloatValue(data.AlarmLimit3), data.SensorID);
            string[] results = RunQuery(config, strSQL);

            if (results != null && results.Length >= 2)
            {
                if (results[0] == "1")
                    return new MessageResult(true, "");
                else
                    return new MessageResult(false, results[1]);
            }

            return new MessageResult(false, "DB에 센서설정을 변경하는데 실패하였습니다.");
        }

        public static ResponseSensor RequestSensorValues(DBConfig config, RequestSensor data)
        {
            string strSQL = "";

            if (data.SensorID != null)
                strSQL = string.Format("Select SensorID, TimeStamp, SensorValue, AlarmLimit1, AlarmLimit2, AlarmLimit3 from SensorValue, Sensor where SensorID = {0} and TimeStamp = (select max(TimeStamp) from SensorValue where SensorID = {0} and SensorID = ID)", data.SensorID);
            else
                strSQL = "Select SensorID, TimeStamp, SensorValue, AlarmLimit1, AlarmLimit2, AlarmLimit3 from SensorValue, Sensor where SensorID = ID and concat(sensorid,'/',TimeStamp) in (select concat(sensorid,'/', max(timestamp)) from SensorValue group by SensorID)";

            string[] results = RunQuery(config, strSQL);

            if (results != null && results.Length >= 2)
            {
                if (results[0] == "1")
                {
                    int nFieldCount;

                    if (int.TryParse(results[1].Trim(), out nFieldCount))
                    {
                        ResponseSensor response = new ResponseSensor(true, "");

                        for (int i = 0; i < nFieldCount; i += 6)
                        {
                            int? sensorID = GetIntField(results[i + 2].ToString());
                            string strTimeStamp = GetStringField(results[i + 3]);
                            float? value = GetFloatField(results[i + 4].ToString());
                            float? alarmLimit1 = GetFloatField(results[i + 5].ToString());
                            float? alarmLimit2 = GetFloatField(results[i + 6].ToString());
                            float? alarmLimit3 = GetFloatField(results[i + 7].ToString());

                            if (sensorID == null || strTimeStamp == null || value == null)
                                continue;

                            SensorValueEx sensorValue = new SensorValueEx();
                            sensorValue.SensorID = (int)sensorID;
                            sensorValue.Value = (float)value;
                            sensorValue.TimeStamp = strTimeStamp;
                            sensorValue.AlarmLimit1 = alarmLimit1;
                            sensorValue.AlarmLimit2 = alarmLimit2;
                            sensorValue.AlarmLimit3 = alarmLimit3;

                            response.Sensors.Add(sensorValue);
                        }

                        return response;
                    }
                }
                else
                    return new ResponseSensor(false, results[1]);
            }

            return new ResponseSensor(true, "DB로부터 센서정보를 조회할 수 없습니다.");
        }

        private static int? GetIntField(string dataSrc)
        {
            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return null;

            int num;

            if (int.TryParse(dataSrc.Substring(1), out num))
                return num;

            return null;
        }

        private static float? GetFloatField(string dataSrc)
        {
            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return null;

            float num;

            if (float.TryParse(dataSrc.Substring(1), out num))
                return num;

            return null;
        }

        // 문자열 앞뒤의 빈문자들을 제거한다.
        static public string GetStringField(object dataSrc)
        {
            if (dataSrc == null)
                return null;

            string strValue = dataSrc.ToString();

            if (strValue.StartsWith("!") == false)
                return null;

            return dataSrc.ToString().Trim().Substring(1).Trim();
        }

        private static string GetFloatValue(float? data)
        {
            if (data == null)
                return "NULL";

            return string.Format("{0:F2}", (float)data);
        }

        private static string GetTime(DateTime time)
        {
            return string.Format("{0}{1:00}{2:00}{3:00}{4:00}{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private static string[] RunQuery(DBConfig config, string query)
        {
            string[] results = null;

            try
            {
                string strConnection = GetConnectionString(config);

                using (SqlConnection connection = new SqlConnection(strConnection))
                {
                    connection.Open();

                    SqlCommand cmd = new SqlCommand(query, connection);

                    if (IsSelectQuery(query))
                        results = SelectQuery(cmd);
                    else
                        results = ExecuteQuery(cmd);
                }
            }
            catch (Exception e)
            {
                //Logger.Instance.Write("RunQuery : " + query);
                string[] result = new string[2];
                result[0] = "0";
                result[1] = e.Message;
                return result;
            }

            return results;
        }

        private static string[] ExecuteQuery(SqlCommand cmd)
        {
            cmd.ExecuteNonQuery();
            return MakeSuccess(null);
        }

        private static string[] SelectQuery(SqlCommand cmd)
        {
            SqlDataReader reader = cmd.ExecuteReader();
            List<string> datas = new List<string>();

            int nColumnCount = reader.FieldCount;

            while (reader.Read())
            {
                for (int i = 0; i < nColumnCount; i++)
                {
                    if (reader.IsDBNull(i))
                        AddNullData(datas);
                    else
                    {
                        AddData(datas, reader.GetValue(i));
                    }
                }
            }

            reader.Close();
            return MakeSuccess(datas);
        }

        private static string[] MakeSuccess(List<string> datas)
        {
            string[] results = null;

            if (datas == null)
            {
                results = new string[2];

                results[0] = "1";
                results[1] = "0";
            }
            else
            {
                int nDataCount = datas.Count + 2;
                results = new string[nDataCount];

                results[0] = "1";
                results[1] = datas.Count.ToString();

                for (int i = 2; i < nDataCount; i++)
                {
                    results[i] = datas[i - 2];
                }
            }

            return results;
        }

        private static void AddData(List<string> datas, object data)
        {
            // 데이터 로드 시 배열일 경우 처리
            // 바로 ToString을 하여 데이터 추가 시 예를 들어 System.Byte[] 식으로 추가가 되기 때문에 따로 처리
            if (data.GetType().IsArray)
            {
                Type dataType = data.GetType();
                data = Convert.ChangeType(data, dataType);
                int length = ((Array)data).Length;
                string tempStr = "";

                if (length > 0)
                {
                    object[] dataTemp = new object[length];
                    Array.Copy((Array)data, dataTemp, length);
                    tempStr = string.Join(",", dataTemp);
                }

                datas.Add("!" + tempStr);
            }
            else
            {
                datas.Add("!" + data.ToString());
            }
        }

        private static void AddNullData(List<string> datas)
        {
            datas.Add("~");
        }

        private static bool IsSelectQuery(string strSQL)
        {
            strSQL = strSQL.Trim().ToLower();
            return strSQL.StartsWith("select") || strSQL.StartsWith("with");
        }

        private static SqlConnection GetConnection(DBConfig config)
        {
            string strConnection = GetConnectionString(config);
            SqlConnection connection = new SqlConnection(strConnection);
            connection.Open();

            if (connection.State == ConnectionState.Open)
            {
                return connection;
            }

            return null;
        }

        private static string GetConnectionString(DBConfig config)
        {
            return string.Format("Data Source={0};Initial Catalog={1};User ID={2};Password={3};", config.Host, config.DBName, config.ID, config.PW);
        }
    }
}