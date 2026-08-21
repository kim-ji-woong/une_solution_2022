using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace BAMServer
{
    public class BAMDataManager
    {
        public static bool SaveBAMData(DataManager dataManager, List<BAM_Data> datas, DateTime dtDay, out string strErrorMessage)
        {
            strErrorMessage = null;
                    
            if (datas == null)
            {
                strErrorMessage = "BAM_Data 값이 NULL 입니다.";
                //return false;

                datas = new List<BAM_Data>();
            }

            DateTime dateTime = DateTime.Now;
            
            // 데이터 항목
            Dictionary<string, BAM_Data> dicBamDatas = new Dictionary<string, BAM_Data>();
            dicBamDatas["CppSimulationPltzTest01_01_temperature"] = null;
            dicBamDatas["CppSimulationPltzTest01_02_temperature"] = null;
            dicBamDatas["CppSimulationPltzTest01_03_temperature"] = null;
            dicBamDatas["CppSimulationPltzTest01_04_temperature"] = null;
            dicBamDatas["CppSimulationPltzTest01_05_temperature"] = null;

            dicBamDatas["H2SensorUneTest01_01_value"] = null;
            dicBamDatas["H2SensorUneTest01_02_value"] = null;
            dicBamDatas["H2SensorUneTest01_03_value"] = null;
            dicBamDatas["H2SensorUneTest02_01_value"] = null;
            dicBamDatas["H2SensorUneTest02_02_value"] = null;
            dicBamDatas["H2SensorUneTest02_03_value"] = null;
            dicBamDatas["H2SensorUneTest03_01_value"] = null;
            dicBamDatas["H2SensorUneTest03_02_value"] = null;
            dicBamDatas["H2SensorUneTest03_03_value"] = null;

            dicBamDatas["MultiPlcPltzTest01_01_temperature"] = null;
            dicBamDatas["MultiPlcPltzTest01_02_temperature"] = null;
            dicBamDatas["MultiPlcPltzTest01_03_timestamp"] = null;

            dicBamDatas["TempSensorQistTest01_01_average"] = null;
            dicBamDatas["TempSensorQistTest01_02_corrected"] = null;
            dicBamDatas["TempSensorQistTest01_02_value"] = null;
            dicBamDatas["TempSensorQistTest01_03_uncertainty"] = null;

            dicBamDatas["TempSensorQistTest02_01_average"] = null;
            dicBamDatas["TempSensorQistTest02_02_corrected"] = null;
            dicBamDatas["TempSensorQistTest02_03_uncertainty"] = null;

            dicBamDatas["WeatherLoggerQistProductive01_01_battery"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_02_battery"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_03_temperature"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_04_temp_max"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_05_temp_min"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_06_temp_deviation"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_07_humidity"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_08_humidity_deviation"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_09_wind_velo"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_10_wind_velo"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_11_wind_direc"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_12_wind_direc_deviation"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_13_wind_velo_deviation"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_14_wind_velo_max"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_15_precipitation"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_16_rain_status"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_17_pressure"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_18_solar_radiation"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_19_solar_radiation_deviation"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_20_sunshine_duration"] = null;
            dicBamDatas["WeatherLoggerQistProductive01_21_time_elapsed"] = null;

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

                    if (dicBamDatas.ContainsKey(data.measure_id))
                        dicBamDatas[data.measure_id] = data;
                }

                // 데이터가 제대로 들어왔는지 확인 후, 안 들어온 데이터가 존재한다면 NULL 저장
                foreach (KeyValuePair<string, BAM_Data> pair in dicBamDatas)
                {
                    string strID = pair.Key;
                    BAM_Data data = pair.Value;

                    if (data == null)
                    {
                        data = new BAM_Data();
                        data.measure_id = strID;

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
                    }
                }

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

        public static bool CreateDataTable(DataManager dataManager, DateTime dtDay, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                string strSQL = $@"
                create table datalist_{dtDay.ToString("yyyyMMdd")} (
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
