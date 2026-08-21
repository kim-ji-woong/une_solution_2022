using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace UneToBAMServer.Process
{
    public class BAMDataManager
    {
        public static List<BAM_Data> CheckTimeSeriesData(List<BAM_Data> datas, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                if (datas == null)
                {
                    datas = new List<BAM_Data>();
                }

                // 시계열 필수 데이터 체크
                // REST API 응답 데이터에서 확인되지 않는다면 NULL 값이라도 넣는다.

                // 필수 데이터 리스트 만들기
                // .TODO: 필수 데이터 리스트 작성 필요
                List<string> checkMeasureIDs = new List<string>();
                checkMeasureIDs.Add("PressInSensorChillerHrs01_02_status");
                checkMeasureIDs.Add("PressInSensorChillerHrs01_01_value");

                checkMeasureIDs.Add("PressInSensorCompressorHrs01_02_status");
                checkMeasureIDs.Add("PressInSensorCompressorHrs01_01_value");
                
                checkMeasureIDs.Add("PressOutSensorCompressorHrs01_02_status");
                checkMeasureIDs.Add("PressOutSensorCompressorHrs01_01_value");
                
                checkMeasureIDs.Add("PressSensor80Hrs01_02_status");
                checkMeasureIDs.Add("PressSensor80Hrs01_01_value");

                checkMeasureIDs.Add("PressSensorRefuellingHrs01_02_status");
                checkMeasureIDs.Add("PressSensorRefuellingHrs01_01_value");

                checkMeasureIDs.Add("PressSensorRefuellingHrs02_02_status");
                checkMeasureIDs.Add("PressSensorRefuellingHrs02_01_value");
                
                checkMeasureIDs.Add("PressSensorStorageHighHrs01_02_status");
                checkMeasureIDs.Add("PressSensorStorageHighHrs01_01_value");
                
                checkMeasureIDs.Add("PressSensorStorageHighHrs02_02_status");
                checkMeasureIDs.Add("PressSensorStorageHighHrs02_01_value");
                
                checkMeasureIDs.Add("PressSensorStorageHighHrs03_02_status");
                checkMeasureIDs.Add("PressSensorStorageHighHrs03_01_value");
                
                checkMeasureIDs.Add("PressSensorStorageHighHrs04_02_status");
                checkMeasureIDs.Add("PressSensorStorageHighHrs04_01_value");
                
                checkMeasureIDs.Add("PressSensorStorageLowHrs01_02_status");
                checkMeasureIDs.Add("PressSensorStorageLowHrs01_01_value");
                
                checkMeasureIDs.Add("PressSensorStorageLowHrs02_02_status");
                checkMeasureIDs.Add("PressSensorStorageLowHrs02_01_value");
                
                checkMeasureIDs.Add("PressSensorStorageLowHrs03_02_status");
                checkMeasureIDs.Add("PressSensorStorageLowHrs03_01_value");
                
                checkMeasureIDs.Add("PressSensorSupplyHrs02_02_status");
                checkMeasureIDs.Add("PressSensorSupplyHrs02_01_value");
                
                checkMeasureIDs.Add("TempOutSensorCompressorHrs01_02_status");
                checkMeasureIDs.Add("TempOutSensorCompressorHrs01_01_value");
                
                checkMeasureIDs.Add("TempSensorStorageHighHrs01_02_status");
                checkMeasureIDs.Add("TempSensorStorageHighHrs01_01_value");
                
                checkMeasureIDs.Add("TempSensorStorageHighHrs02_02_status");
                checkMeasureIDs.Add("TempSensorStorageHighHrs02_01_value");
                
                checkMeasureIDs.Add("TempSensorStorageHighHrs03_02_status");
                checkMeasureIDs.Add("TempSensorStorageHighHrs03_01_value");
                
                checkMeasureIDs.Add("TempSensorStorageHighHrs04_02_status");
                checkMeasureIDs.Add("TempSensorStorageHighHrs04_01_value");
                
                checkMeasureIDs.Add("TempSensorStorageLowHrs01_02_status");
                checkMeasureIDs.Add("TempSensorStorageLowHrs01_01_value");
                
                checkMeasureIDs.Add("TempSensorStorageLowHrs02_02_status");
                checkMeasureIDs.Add("TempSensorStorageLowHrs02_01_value");
                
                checkMeasureIDs.Add("TempSensorStorageLowHrs03_02_status");
                checkMeasureIDs.Add("TempSensorStorageLowHrs03_01_value");
                
                checkMeasureIDs.Add("TempSensorSupplyHrs02_02_status");
                checkMeasureIDs.Add("TempSensorSupplyHrs02_01_value");


                // .TODO: 빠진 센서 내용
                // TT10260, TT10314 
                // JIG 산소, 수소 센서 그리고 센코 센서 수소 값이 없음


                foreach (string measure_id in checkMeasureIDs)
                {
                    BAM_Data temp = datas.Find(x => x.measure_id == measure_id);
                    if (temp == null)
                    {
                        temp = new BAM_Data();
                        temp.measure_id = measure_id;

                        datas.Add(temp);
                    }
                }
            }
            catch (Exception e)
            {
                datas = null;
                strErrorMessage = e.Message;
            }

            return datas;
        }

        public static bool SaveBAMData(DataManager dataManager, List<BAM_Data> datas, DateTime dtDay, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (datas == null)
            {
                strErrorMessage = "BAM_Data 값이 NULL 입니다.";
                //return false;

                datas = new List<BAM_Data>();
            }

            // 독일 시간대 가져오기
            TimeZoneInfo germanyTimeZone = TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time");

            // 현재 독일 시간
            //DateTime dateTime = DateTime.Now;
            DateTime dateTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, germanyTimeZone);

            IDataManager _dataManager = dataManager.Clone();

            try
            {
                if (!_dataManager.BeginBatch(out strErrorMessage))
                    throw new ApplicationException(strErrorMessage);

                foreach (BAM_Data data in datas)
                {
                    string strSQL = $@"
                        insert into datalist_{dtDay.ToString("yyyyMMdd")} (read_data_time, live_process_index, measure_id, component_id, id_ext, 
                        sensor_type, asset_type, com_node, location_type, eclass_path, 
                        aas_path, parameter, unit_type, max, min, 
                        calibration_path, backup_path, timestamp, value)
                        values ('{dateTime.ToString("yyyy-MM-dd HH:mm:ss")}', {(data.live_process_index != null ? "'" + data.live_process_index + "'" : "NULL")}, {(data.measure_id != null ? "'" + data.measure_id + "'" : "NULL")}, {(data.component_id != null ? "'" + data.component_id + "'" : "NULL")}, {(data.id_ext != null ? "'" + data.id_ext + "'" : "NULL")}, 
                        {(data.sensor_type != null ? "'" + data.sensor_type + "'" : "NULL")}, {(data.asset_type != null ? "'" + data.asset_type + "'" : "NULL")}, {(data.com_node != null ? "'" + data.com_node + "'" : "NULL")}, {(data.location_type != null ? "'" + data.location_type + "'" : "NULL")}, {(data.eclass_path != null ? "'" + data.eclass_path + "'" : "NULL")},
                        {(data.aas_path != null ? "'" + data.aas_path + "'" : "NULL")}, {(data.parameter != null ? "'" + data.parameter + "'" : "NULL")}, {(data.unit_type != null ? "'" + data.unit_type + "'" : "NULL")}, {(data.max != null ? "'" + data.max + "'" : "NULL")}, {(data.min != null ? "'" + data.min + "'" : "NULL")},
                        {(data.calibration_path != null ? "'" + data.calibration_path + "'" : "NULL")}, {(data.backup_path != null ? "'" + data.backup_path + "'" : "NULL")}, {(data.timestamp != null ? "'" + data.timestamp + "'" : "NULL")}, {(data.value != null ? "'" + data.value + "'" : "NULL")})";

                    if (!_dataManager.GetCreate().Insert(strSQL, out strErrorMessage))
                        throw new ApplicationException(strErrorMessage);

                    //if (dicBamDatas.ContainsKey(data.measure_id))
                    //    dicBamDatas[data.measure_id] = data;
                }

                // 데이터가 제대로 들어왔는지 확인 후, 안 들어온 데이터가 존재한다면 NULL 저장
                //foreach (KeyValuePair<string, BAM_Data> pair in dicBamDatas)
                //{
                //    string strID = pair.Key;
                //    BAM_Data data = pair.Value;

                //    if (data == null)
                //    {
                //        data = new BAM_Data();
                //        data.measure_id = strID;

                //        string strSQL = $@"
                //            insert into datalist_{dtDay.ToString("yyyyMMdd")} (read_data_time, live_process_index, measure_id, component_id, id_ext, 
                //            sensor_type, asset_type, com_node, location_type, eclass_path, 
                //            aas_path, parameter, unit_type, max, min, 
                //            calibration_path, backup_path, timestamp, value)
                //            values ('{dateTime.ToString("yyyy-MM-dd HH:mm:ss")}', {(data.live_process_index != null ? "'" + data.live_process_index + "'" : "NULL")}, {(data.measure_id != null ? "'" + data.measure_id + "'" : "NULL")}, {(data.component_id != null ? "'" + data.component_id + "'" : "NULL")}, {(data.id_ext != null ? "'" + data.id_ext + "'" : "NULL")}, 
                //            {(data.sensor_type != null ? "'" + data.sensor_type + "'" : "NULL")}, {(data.asset_type != null ? "'" + data.asset_type + "'" : "NULL")}, {(data.com_node != null ? "'" + data.com_node + "'" : "NULL")}, {(data.location_type != null ? "'" + data.location_type + "'" : "NULL")}, {(data.eclass_path != null ? "'" + data.eclass_path + "'" : "NULL")},
                //            {(data.aas_path != null ? "'" + data.aas_path + "'" : "NULL")}, {(data.parameter != null ? "'" + data.parameter + "'" : "NULL")}, {(data.unit_type != null ? "'" + data.unit_type + "'" : "NULL")}, {(data.max != null ? "'" + data.max + "'" : "NULL")}, {(data.min != null ? "'" + data.min + "'" : "NULL")},
                //            {(data.calibration_path != null ? "'" + data.calibration_path + "'" : "NULL")}, {(data.backup_path != null ? "'" + data.backup_path + "'" : "NULL")}, {(data.timestamp != null ? "'" + data.timestamp + "'" : "NULL")}, {(data.value != null ? "'" + data.value + "'" : "NULL")})";

                //        if (!_dataManager.GetCreate().Insert(strSQL, out strErrorMessage))
                //            throw new ApplicationException(strErrorMessage);
                //    }
                //}

                if (!_dataManager.BatchCommit(out strErrorMessage))
                    throw new ApplicationException(strErrorMessage);
            }
            catch (Exception ex)
            {
                _dataManager.BatchRollback(out strErrorMessage);
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        public static bool DeleteBAMData(DataManager dataManager, int nDataSaveTime, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                DateTime dtNow = DateTime.Now;
                DateTime date = dtNow.AddDays(-nDataSaveTime);

                string strSQL = $@"
                    delete from datalist where read_data_time < '{date.ToString("yyyy-MM-dd")} 00:00:00'";

                if (!dataManager.GetDBManager().Excute(strSQL, out strErrorMessage))
                    throw new ApplicationException(strErrorMessage);
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        // 날짜별 데이터 테이블의 컬럼 목록 (read_data_time 제외 18개, BAM_Data 프로퍼티와 1:1 대응)
        // CreateDataTable과 BackupDataTable(INSERT 생성) 양쪽에서 재사용하여 스키마 드리프트를 방지한다.
        private static readonly string[] s_dataColumns = new string[]
        {
            "live_process_index", "measure_id", "component_id", "id_ext",
            "sensor_type", "asset_type", "com_node", "location_type", "eclass_path",
            "aas_path", "parameter", "unit_type", "max", "min",
            "calibration_path", "backup_path", "timestamp", "value"
        };

        /// <summary>
        /// 날짜별 데이터 테이블(datalist_yyyyMMdd)의 CREATE TABLE 문을 생성한다.
        /// CreateDataTable과 BackupDataTable에서 공통으로 사용하여 스키마가 항상 일치하도록 한다.
        /// </summary>
        private static string BuildCreateTableSql(string strTableName)
        {
            return $@"
                create table {strTableName} (
                    read_data_time TIMESTAMP NOT NULL,
                    live_process_index VARCHAR(512),
                    measure_id VARCHAR(512),
                    component_id VARCHAR(512),
                    id_ext VARCHAR(512),
                    sensor_type VARCHAR(512),
                    asset_type VARCHAR(512),
                    com_node VARCHAR(512),
                    location_type VARCHAR(512),
                    eclass_path VARCHAR(512),
                    aas_path VARCHAR(512),
                    parameter VARCHAR(512),
                    unit_type VARCHAR(512),
                    max VARCHAR(512),
                    min VARCHAR(512),
                    calibration_path VARCHAR(512),
                    backup_path VARCHAR(512),
                    timestamp VARCHAR(512),
                    value VARCHAR(512)
                )";
        }

        public static bool CreateDataTable(DataManager dataManager, DateTime dtDay, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                string strSQL = BuildCreateTableSql($"datalist_{dtDay.ToString("yyyyMMdd")}");

                if (!dataManager.GetDBManager().Excute(strSQL, out strErrorMessage))
                    throw new ApplicationException(strErrorMessage);

            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        /// <summary>
        /// 삭제 대상(dtDay - nDataSaveTime일) 테이블을 DROP TABLE IF EXISTS + CREATE TABLE + INSERT
        /// 스크립트(.sql)로 백업한다. 이 파일 하나만 실행하면 테이블이 그대로 복원된다.
        /// 대상 테이블이 없거나 조회/파일쓰기 중 오류가 발생하면 false를 반환하며,
        /// 호출부는 이 경우 DropDataTable을 호출하지 않아야 한다(데이터 유실 방지).
        /// </summary>
        /// <returns>백업 성공 시 true / 실패(테이블 없음 포함) 시 false, 사유는 strErrorMessage에 설정</returns>
        public static bool BackupDataTable(DataManager dataManager, DateTime dtDay, int nDataSaveTime, string strBackupFolder, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                // 1. DropDataTable과 동일한 방식으로 삭제 대상 날짜 계산
                DateTime dtDropDay = dtDay.AddDays(nDataSaveTime * -1);
                string strTableName = $"datalist_{dtDropDay.ToString("yyyyMMdd")}";

                // 2. 대상 테이블 존재 여부 확인 (정확 일치 - SHOW TABLES LIKE는 '_'가 와일드카드라 사용하지 않음)
                string strCheckSQL = $@"
                    select count(*) as cnt from information_schema.tables
                    where table_schema = database() and table_name = '{strTableName}'";

                IEnumerable<dynamic> checkResult = dataManager.GetDBManager().Query(strCheckSQL, out strErrorMessage);
                if (checkResult == null)
                    throw new ApplicationException(strErrorMessage);

                IDictionary<string, object> checkRow = (IDictionary<string, object>)System.Linq.Enumerable.First(checkResult);
                long nCount = Convert.ToInt64(checkRow["cnt"]);
                if (nCount == 0)
                {
                    strErrorMessage = $"백업 대상 테이블 없음: {strTableName}";
                    return false;
                }

                // 3. 데이터 전체 조회
                IEnumerable<dynamic> rows = dataManager.GetDBManager().Query($"select * from {strTableName}", out strErrorMessage);
                if (rows == null)
                    throw new ApplicationException(strErrorMessage);

                // 4. DROP + CREATE + INSERT 스크립트 생성
                StringBuilder sb = new StringBuilder();
                sb.AppendLine($"drop table if exists {strTableName};");
                sb.AppendLine(BuildCreateTableSql(strTableName) + ";");

                foreach (dynamic row in rows)
                {
                    IDictionary<string, object> dataRow = (IDictionary<string, object>)row;

                    // read_data_time: MySQL TIMESTAMP → DateTime, culture 비의존 포맷으로 직접 변환
                    object readDataTime = dataRow.ContainsKey("read_data_time") ? dataRow["read_data_time"] : null;
                    string strReadDataTime = readDataTime is DateTime dt
                        ? "'" + dt.ToString("yyyy-MM-dd HH:mm:ss") + "'"
                        : "NULL";

                    List<string> values = new List<string> { strReadDataTime };
                    foreach (string strColumn in s_dataColumns)
                    {
                        object value = dataRow.ContainsKey(strColumn) ? dataRow[strColumn] : null;
                        values.Add(ToSqlLiteral(value));
                    }

                    sb.AppendLine($"insert into {strTableName} (read_data_time, {string.Join(", ", s_dataColumns)}) values ({string.Join(", ", values)});");
                }

                // 5. 백업 폴더 생성 및 파일 쓰기
                Directory.CreateDirectory(strBackupFolder);
                string strFilePath = Path.Combine(strBackupFolder, strTableName + ".sql");
                File.WriteAllText(strFilePath, sb.ToString(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        /// <summary>
        /// 값을 MySQL INSERT 문에 안전하게 삽입할 수 있는 리터럴 문자열로 변환한다.
        /// null은 SQL NULL로, 문자열은 백슬래시/작은따옴표를 이스케이프하여 반환한다.
        /// </summary>
        private static string ToSqlLiteral(object value)
        {
            if (value == null || value is DBNull)
                return "NULL";

            // 백슬래시를 먼저 이스케이프한 뒤 작은따옴표를 이스케이프해야 순서가 꼬이지 않는다.
            string strValue = value.ToString().Replace("\\", "\\\\").Replace("'", "''");
            return "'" + strValue + "'";
        }

        public static bool DropDataTable(DataManager dataManager, DateTime dtDay, int nDataSaveTime, out string strErrorMessage)
        {
            strErrorMessage = null;

            nDataSaveTime = nDataSaveTime * -1;

            DateTime dtDropDay = dtDay.AddDays(nDataSaveTime);

            try
            {
                string strSQL = $@"
                drop table datalist_{dtDropDay.ToString("yyyyMMdd")}";

                if (!dataManager.GetDBManager().Excute(strSQL, out strErrorMessage))
                    throw new ApplicationException(strErrorMessage);

            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }
    }
}
