using dnsDBUtil;
using SDMS.Model.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace SensorServer.BLL
{
    using Model.Yeosu;
    using Model.Yeosu.External;
    using Newtonsoft.Json.Serialization;
    using Oracle.ManagedDataAccess.Types;
    using SensorServer.Model.Yeosu.Option;
    using SensorServer.Model.Yeosu.Public;
    using System.Collections.Specialized;
    using System.Text;

    public class SensorManager
    {
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private SensorServer.IDAL.IDataManager m_dataManager = null;
        private DirectDBManager m_dbMgr = null;
        // 센서의 직전 알람상태
        // Key : Sensor ID
        // Value : Alarm Level
        private Dictionary<int, int> m_dicPrevSensorAlarmLevels = new Dictionary<int, int>();
        private string m_strLastReadTime = "";

        public SensorManager(SDMS.IDAL.IDataManager sdmsDataManager, SensorServer.IDAL.IDataManager dataManager, string strExternalDbHost, string strExternalDbName, string strExternalDbId, string strExternalDbPw)
        {
            m_sdmsDataManager = sdmsDataManager;
            m_dataManager = dataManager;

            m_dbMgr = new DirectDBManager((int)WebDBManager.DBType.postgre, strExternalDbHost, strExternalDbName, strExternalDbId, strExternalDbPw);
        }

        public List<AirDataHistory> ReadPublicAirData(out string strErrorMessage)
        {
            // 필요 X
            List<AirNode> airNodes = m_dataManager.GetSelectManager().SelectAirNodes(null, null, out strErrorMessage);

            if (airNodes == null)
            {
                //Logger.Instance.Write("ReadPublicAirData return null");
                return null;
            }

            DateTime dtNow = DateTime.Now;

            if (dtNow.Hour == 0)
                dtNow = dtNow.AddDays(-1);

            dtNow = dtNow.AddHours(-3);

            string dt = string.Format("{0}{1:00}{2:00}{3:00}00", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour);

            bool isNullable;

            List<AirDataHistory> airDataHistories = new List<AirDataHistory>();
            
            string strSQL = "SELECT ad.sitecd, ad.logdate, ad.so2, ad.no2, ad.o3, ad.co, ad.pm10, ad.pm25, ad.pm10daily, ad.pm25daily, ad.khai, ad.so2grade, ";
            strSQL += "ad.no2grade, ad.o3grade, ad.cograde, ad.pm10grade, ad.pm25grade, ad.pm10grade1h, ad.pm25grade1h, ad.khaigrade, ad.so2flag, ad.no2flag, ad.o3flag, ad.coflag, ad.pm10flag, ad.pm25flag ";
            strSQL += "FROM airkorea_data as ad ";
            strSQL += "JOIN (SELECT sitecd, Max(logdate) as max_logdate FROM airkorea_data GROUP BY sitecd) as ad2 ";
            strSQL += "ON ad.sitecd = ad2.sitecd AND ad.logdate = ad2.max_logdate ORDER BY sitecd";
            
            ArrayList arrayResult = m_dbMgr.GetResultData(strSQL);
            if (arrayResult == null)
            {
                strErrorMessage = "Select airDataHistires ArrayResult is null";
                return null;
            }
            
            int nArrayCount = arrayResult.Count;

            if (nArrayCount == 0)
            {
                strErrorMessage = "Select airDataHistires ArrayResult Count is 0";
                return airDataHistories;
            }

            for(int i = 0; i < nArrayCount - 25; i += 26)
            {
                AirDataHistory airDataHistory = new AirDataHistory();

                VariousData<int> nSiteID = WebDBManager.GetIntField(arrayResult[i].ToString());
                string strLogDate = WebDBManager.GetStringField(arrayResult[i+1].ToString());
                VariousData<float> fSO2 = WebDBManager.GetFloatField(arrayResult[i+2].ToString());
                VariousData<float> fNO2 = WebDBManager.GetFloatField(arrayResult[i+3].ToString());
                VariousData<float> fO3 = WebDBManager.GetFloatField(arrayResult[i+4].ToString());
                VariousData<float> fCO = WebDBManager.GetFloatField(arrayResult[i+5].ToString());
                VariousData<float> fPM10 = WebDBManager.GetFloatField(arrayResult[i+6].ToString());
                VariousData<float> fPM25 = WebDBManager.GetFloatField(arrayResult[i+7].ToString());
                VariousData<float> fPM10Daily = WebDBManager.GetFloatField(arrayResult[i + 8].ToString());
                VariousData<float> fPM25Daily = WebDBManager.GetFloatField(arrayResult[i + 9].ToString());
                VariousData<float> fKhai = WebDBManager.GetFloatField(arrayResult[i + 10].ToString());
                VariousData<int> nSO2Grade = WebDBManager.GetIntField(arrayResult[i + 11].ToString());
                VariousData<int> nNO2Grade = WebDBManager.GetIntField(arrayResult[i + 12].ToString());
                VariousData<int> nO3Grade = WebDBManager.GetIntField(arrayResult[i + 13].ToString());
                VariousData<int> nCOGrade = WebDBManager.GetIntField(arrayResult[i + 14].ToString());
                VariousData<int> nPM10Grade = WebDBManager.GetIntField(arrayResult[i + 15].ToString());
                VariousData<int> nPM25Grade = WebDBManager.GetIntField(arrayResult[i + 16].ToString());
                VariousData<int> nPM10Grade1h = WebDBManager.GetIntField(arrayResult[i + 17].ToString());
                VariousData<int> nPM25Grade1h = WebDBManager.GetIntField(arrayResult[i + 18].ToString());
                VariousData<int> nKhaiGrade = WebDBManager.GetIntField(arrayResult[i + 19].ToString());
                VariousData<float> fSO2Flag = WebDBManager.GetFloatField(arrayResult[i + 20].ToString());
                VariousData<float> fNO2Flag = WebDBManager.GetFloatField(arrayResult[i + 21].ToString());
                VariousData<float> fO3Flag = WebDBManager.GetFloatField(arrayResult[i + 22].ToString());
                VariousData<float> fCOFlag = WebDBManager.GetFloatField(arrayResult[i + 23].ToString());
                VariousData<float> fPM10Flag = WebDBManager.GetFloatField(arrayResult[i + 24].ToString());
                VariousData<float> fPM25Flag = WebDBManager.GetFloatField(arrayResult[i + 25].ToString());



                airDataHistory.SiteID = nSiteID.Data;
                airDataHistory.LogDate = strLogDate;
                airDataHistory.SO2 = fSO2?.Data;
                airDataHistory.NO2 = fNO2?.Data;
                airDataHistory.O3 = fO3?.Data;
                airDataHistory.CO = fCO?.Data;
                airDataHistory.PM10 = fPM10?.Data;
                airDataHistory.PM25 = fPM25?.Data;
                airDataHistory.PM10Daily = fPM10Daily?.Data;
                airDataHistory.PM25Daily = fPM25Daily?.Data;
                airDataHistory.Khai = fKhai?.Data;
                airDataHistory.SO2Grade = nSO2Grade?.Data;
                airDataHistory.NO2Grade = nNO2Grade?.Data;
                airDataHistory.O3Grade = nO3Grade?.Data;
                airDataHistory.COGrade = nCOGrade?.Data;
                airDataHistory.PM10Grade = nPM10Grade?.Data;
                airDataHistory.PM25Grade = nPM25Grade?.Data;
                airDataHistory.PM10Grade1h = nPM10Grade1h?.Data;
                airDataHistory.PM25Grade1h = nPM25Grade1h?.Data;
                airDataHistory.KhaiGrade = nKhaiGrade?.Data;
                airDataHistory.SO2Flag = fSO2Flag?.Data;
                airDataHistory.NO2Flag = fNO2Flag?.Data;
                airDataHistory.O3Flag = fO3Flag?.Data;
                airDataHistory.COFlag = fCOFlag?.Data;
                airDataHistory.PM10Flag = fPM10Flag?.Data;
                airDataHistory.PM25Flag = fPM25Flag?.Data;


                airDataHistories.Add(airDataHistory);
            }
            if (airDataHistories == null || airDataHistories.Count == 0)
                return null;

            return airDataHistories;
        }

        public KmaAsos ReadPublicKmaData(out string strErrorMessage)
        {
            KmaAsos kma = new KmaAsos();

            bool isNullable;

            string strSQL = "Select logdate, wd, ws, pressure, sealevelPressure, temperature, dewpointtemp, humidity, evaporation, rainfall, snowfall3hr, snowfallday, snowfallcover, ";
            strSQL += "currentweather, cloudamount, cloudamountmid, cloudheightmin, visibility, hoursunshine, hoursolarradiation, grounstatuscode, grounttemp, temperature005m, temperature01m, ";
            strSQL += "temperature02m, temperature03m, rainfallday, stnld ";
            strSQL += "from kma_asos order by logdate desc limit 1";

            ArrayList arrayResult = m_dbMgr.GetResultData(strSQL);
            int nArrayCount = arrayResult.Count;

            if (arrayResult.Count != 28)
            {
                strErrorMessage = "Array Count Error _ ArrayCount: " + arrayResult.Count;
                return null;
            }
            strErrorMessage = string.Empty;

            string strLogDate = WebDBManager.GetStringField(arrayResult[0].ToString());
            VariousData<int> nWD = WebDBManager.GetIntField(arrayResult[1].ToString());
            VariousData<float> fWS = WebDBManager.GetFloatField(arrayResult[2].ToString());
            VariousData<float> fPressure = WebDBManager.GetFloatField(arrayResult[3].ToString());
            VariousData<float> fSeaLevelPressure = WebDBManager.GetFloatField(arrayResult[4].ToString());
            VariousData<float> fTemperature = WebDBManager.GetFloatField(arrayResult[5].ToString());
            VariousData<float> fDewPointTemp = WebDBManager.GetFloatField(arrayResult[6].ToString());
            VariousData<int> nHumidity = WebDBManager.GetIntField(arrayResult[7].ToString());
            VariousData<float> fEvaporation = WebDBManager.GetFloatField(arrayResult[8].ToString());
            VariousData<float> fRainfall = WebDBManager.GetFloatField(arrayResult[9].ToString());
            VariousData<float> fSnowfall3hr = WebDBManager.GetFloatField(arrayResult[10].ToString());
            VariousData<float> fSnowfallDay = WebDBManager.GetFloatField(arrayResult[11].ToString());
            VariousData<float> fSnowfallCover = WebDBManager.GetFloatField(arrayResult[12].ToString());
            VariousData<int> nCurrentWeather = WebDBManager.GetIntField(arrayResult[13].ToString());
            string strCloudAmount = WebDBManager.GetStringField(arrayResult[14]);
            string strCloudAmountMid = WebDBManager.GetStringField(arrayResult[15]);
            string strCloudHeightMin = WebDBManager.GetStringField(arrayResult[16]);
            VariousData<int> nVisibility = WebDBManager.GetIntField(arrayResult[17].ToString());
            VariousData<float> fHourSunshine = WebDBManager.GetFloatField(arrayResult[18].ToString());
            VariousData<float> fHourSolarRadiation = WebDBManager.GetFloatField(arrayResult[19].ToString());
            VariousData<int> nGrounStatusCode = WebDBManager.GetIntField(arrayResult[20].ToString());
            VariousData<float> fGrounttemp = WebDBManager.GetFloatField(arrayResult[21].ToString());
            VariousData<float> fTemperature005m = WebDBManager.GetFloatField(arrayResult[22].ToString());
            VariousData<float> fTemperature01m = WebDBManager.GetFloatField(arrayResult[23].ToString());
            VariousData<float> fTemperature02m = WebDBManager.GetFloatField(arrayResult[24].ToString());
            VariousData<float> fTemperature03m = WebDBManager.GetFloatField(arrayResult[25].ToString());
            VariousData<float> fRainfallDay = WebDBManager.GetFloatField(arrayResult[26].ToString());
            VariousData<int> nStnID = WebDBManager.GetIntField(arrayResult[27].ToString());

            kma.LogDate = strLogDate;
            kma.WD = nWD?.Data;
            kma.WS = fWS?.Data;
            kma.Pressure = fPressure?.Data;
            kma.Temperature = fTemperature?.Data;
            kma.SeaLevelPressure = fSeaLevelPressure?.Data;
            kma.DewPointTemp = fDewPointTemp?.Data;
            kma.Humidity = nHumidity?.Data;
            kma.Evaporation = fEvaporation?.Data;
            kma.Rainfall = fRainfall?.Data;
            kma.Snowfall3hr = fSnowfall3hr?.Data;
            kma.SnowfallDay = fSnowfallDay?.Data;
            kma.SnowfallCover = fSnowfallCover?.Data;
            kma.CurrentWeather = nCurrentWeather?.Data;
            kma.CloudAmount = strCloudAmount;
            kma.CloudAmountMid = strCloudAmountMid;
            kma.CloudHeightMin = strCloudHeightMin;
            kma.Visibility = nVisibility?.Data;
            kma.HourSunshine = fHourSunshine?.Data;
            kma.HoursolarRadiation = fHourSolarRadiation?.Data;
            kma.GrounStatusCode = nGrounStatusCode?.Data;
            kma.Grounttemp = fGrounttemp?.Data;
            kma.Temperature005m = fTemperature005m?.Data;
            kma.Temperature01m = fTemperature01m?.Data;
            kma.Temperature02m = fTemperature02m?.Data;
            kma.Temperature03m = fTemperature03m?.Data;
            kma.RainfallDay = fRainfallDay?.Data;
            kma.StnID = nStnID?.Data;

            return kma;
        }

        public List<CleanSYS> ReadCleanSYSs(out string strErrorMessage)
        {

            List<CleanSYS> cleanSYSs = new List<CleanSYS>();

            bool isNullable;

            //string strSQL = "SELECT cs.areanm , cs.factmanagenm, cs.stackcode, cs.measuredt, cs.tspexhstpermstdrvalue, cs.tspmeasurevalue, cs.soxexhstpermstdrvalue, cs.soxmeasurevalue, cs.noxexhstpermstdrvalue,";
            //strSQL += " cs.noxmeasurevalue, cs.hclexhstpermstdrvalue, cs.hclmeasurevalue, cs.hfexhstpermstdrvalue, cs.hfmeasurevalue, cs.nh3exhstpermstdrvalue, cs.nh3measurevalue, cs.coexhstpermstdrvalue, cs.comeasurevalue";
            //strSQL += " FROM cleansys cs";

            DateTime today = DateTime.Now;
            string strToday = today.ToString("yyyy-MM-dd");

            string strSQL = "SELECT csl.* FROM cleansys csl ";
            strSQL += "JOIN (SELECT factmanagenm, Max(measuredt) as max_measuredt FROM cleansys group by factmanagenm) ";
            strSQL += "as cs2 ON csl.factmanagenm = cs2.factmanagenm AND csl.measuredt = cs2.max_measuredt ";
            strSQL += $"where csl.measuredt > '{strToday}' "; // 오늘 들어온 데이터만 표출
            strSQL += "ORDER BY factmanagenm, stackcode";
            
            ArrayList arrayResult = m_dbMgr.GetResultData(strSQL);
            

            DateTime dt = DateTime.Now;
            string strDt = null;

            // null check
            if (arrayResult == null)
            {
                strErrorMessage = "Select CleanSYS ArrayResult is null";
                return null;
            }
            
            int nArrayCount = arrayResult.Count;
            
            if (nArrayCount % 18 != 0 || nArrayCount < 18)
            {
                strErrorMessage = "Select CleanSYS ArrayResult Count Error";
                return null;
            }
            
            for (int i = 0; i < nArrayCount - 17; i += 18)
            {
                CleanSYS cleanSYS = new CleanSYS();

                string areaNm = WebDBManager.GetStringField(arrayResult[i].ToString());
                string factManageNm = WebDBManager.GetStringField(arrayResult[i + 1].ToString());
                string stackCode = WebDBManager.GetStringField(arrayResult[i + 2].ToString());
                string measureDt = WebDBManager.GetStringField(arrayResult[i + 3].ToString());
                string tspExhstpermstdValue = WebDBManager.GetStringField(arrayResult[i + 4].ToString());
                string tspMeasureValue = WebDBManager.GetStringField(arrayResult[i + 5].ToString());
                string soxExhstpermstdValue = WebDBManager.GetStringField(arrayResult[i + 6].ToString());
                string soxMeasureValue = WebDBManager.GetStringField(arrayResult[i + 7].ToString());
                string noxExhstpermstdrValue = WebDBManager.GetStringField(arrayResult[i + 8].ToString());
                string noxMeasureValue = WebDBManager.GetStringField(arrayResult[i + 9].ToString());
                string hclExhstpermstdrValue = WebDBManager.GetStringField(arrayResult[i + 10].ToString());
                string hclMeasureValue = WebDBManager.GetStringField(arrayResult[i + 11].ToString());
                string hfExhstpermstdrValue = WebDBManager.GetStringField(arrayResult[i + 12].ToString());
                string hfMeasureValue = WebDBManager.GetStringField(arrayResult[i + 13].ToString());
                string nh3ExhstpermstdrValue = WebDBManager.GetStringField(arrayResult[i + 14].ToString());
                string nh3MeasureValue = WebDBManager.GetStringField(arrayResult[i + 15].ToString());
                string coExhstpermstdrValue = WebDBManager.GetStringField(arrayResult[i + 16].ToString());
                string coMeasureValue = WebDBManager.GetStringField(arrayResult[i + 17].ToString());

                cleanSYS.AreaNM = areaNm;
                cleanSYS.FactManageNM = factManageNm;
                cleanSYS.StackCode = stackCode;
                cleanSYS.MeasureDT = measureDt;
                cleanSYS.TspExhstpermstdValue = tspExhstpermstdValue;
                cleanSYS.TspMeasureValue = tspMeasureValue;
                cleanSYS.SoxExhstpermstdValue = soxExhstpermstdValue;
                cleanSYS.SoxMeasureValue = soxMeasureValue;
                cleanSYS.NoxExhstpermstdValue = noxExhstpermstdrValue;
                cleanSYS.NoxMeasureValue = noxMeasureValue;
                cleanSYS.HclExhstpermstdValue = hclExhstpermstdrValue;
                cleanSYS.HclMeasureValue = hclMeasureValue;
                cleanSYS.HfExhstpermstdValue = hfExhstpermstdrValue;
                cleanSYS.HfMeasureValue = hfMeasureValue;
                cleanSYS.Nh3ExhstpermstdValue = nh3ExhstpermstdrValue;
                cleanSYS.Nh3MeasureValue = nh3MeasureValue;
                cleanSYS.CoExhstpermstdValue = coExhstpermstdrValue;
                cleanSYS.CoMeasureValue = coMeasureValue;

                strDt = measureDt;
                DateTime dateTime = DateTime.Parse(strDt);

                Console.WriteLine(dateTime.ToString());

                cleanSYSs.Add(cleanSYS);
            }

            strErrorMessage = string.Empty;
            return cleanSYSs;
        }

        public bool UpdatePublicSensorData(out string strErrorMessage, Logger logger)
        {
            // ClaenSYS
            List<CleanSYS> cleansDatas = ReadCleanSYSs(out strErrorMessage);

            if (cleansDatas == null)
            {
                logger.Write("cleanSYSDatas is null : " + strErrorMessage);
                
            } else if (cleansDatas.Count == 0)
            {
                logger.Write("cleanSYSDatas Count is 0 : " + strErrorMessage);
            }
            
            if (cleansDatas == null || cleansDatas.Count == 0)
            {
                strErrorMessage = "cleansDatas Count is 0";
                logger.Write("cleansDatas Count is 0");
                return false;
            }

            List<CleanSYS> curCleanSYS = m_dataManager.GetSelectManager().SelectCleanSYSs(null, null, out strErrorMessage);

            if (curCleanSYS != null && curCleanSYS.Count != 0) 
            {
                if ((m_dataManager.GetDeleteManager().DeleteCleanSYSs(null, null, out strErrorMessage)) == false)
                {
                    if (strErrorMessage != null)
                    {
                        logger.Write("Delete CleanSYS is failed : " + strErrorMessage);
                    }
                }
            }

            foreach (CleanSYS cleanData in cleansDatas)
            {
                if (m_dataManager.GetCreateManager().CreateCleanSYS(cleanData, out strErrorMessage) == null)
                {
                    logger.Write("CreateCleanSYS is failed : " + strErrorMessage);
                }
            }

            // AirDataHistory
            List<AirDataHistory> airDataHistories = ReadPublicAirData(out strErrorMessage);

            List<AirNode> airNodes = m_dataManager.GetSelectManager().SelectAirNodes(null, null, out strErrorMessage);

            if (airDataHistories == null || airDataHistories.Count == 0)
            {
                logger.Write("Read AirDataHistory is Null or Count is 0 : " + strErrorMessage); 
            }
            else
            {
                foreach(AirNode airNode in airNodes)
                {
                    AirDataHistory airData = m_dataManager.GetSelectManager().SelectAirDataHistory(airNode.ID, out strErrorMessage);

                    if (airData != null)
                    {
                        foreach(AirDataHistory airDataHistory in airDataHistories)
                        {
                            if (airNode.ID == airDataHistory.SiteID)
                            {
                                m_dataManager.GetUpdateManager().UpdateAirDataHistory(airDataHistory, out strErrorMessage); 
                                break;
                            }
                        }
                    } 
                    else
                    {
                        foreach(AirDataHistory airDataHistory in airDataHistories)
                        {
                            if (airNode.ID == airDataHistory.SiteID)
                            {
                                m_dataManager.GetCreateManager().CreateAirDataHistory(airDataHistory, out strErrorMessage);
                                break;
                            }
                        }
                    }
                }                
            }
            
            // Kma_Asos
            KmaAsos kmaAsos = null;

            int kmaID = 1;

            kmaAsos = ReadPublicKmaData(out strErrorMessage); // PostgreSQL 데이터
            if (kmaAsos != null)
            {
                kmaAsos.ID = kmaID;

                KmaAsos originKmaAsos = m_dataManager.GetSelectManager().SelectKmaAsos(kmaID, out strErrorMessage);

                if(originKmaAsos == null)
                {
                    // insert
                    if (m_dataManager.GetCreateManager().CreateKmaAsos(kmaAsos, out strErrorMessage) == null)
                    {
                        logger.Write("Insert KmaAsos is failed : " + strErrorMessage);
                    }
                } 
                else
                {
                    // update
                    if (!m_dataManager.GetUpdateManager().UpdateKmaAsos(kmaAsos, out strErrorMessage))
                    {
                        logger.Write("Update KmaAsos is failed : " + strErrorMessage);
                    }
                }
            }
            else
            {
                //kmaAsos == null 일때
                logger.Write("Read KmaAsos is failed / kmaAsos == null : " + strErrorMessage);
            }
            
            return true;

        }

        public bool UpdateSensorData(List<AlarmSensor> alarmSensors, out string strErrorMessage)
        {
            alarmSensors.Clear();

            List<SensorLink> sensorLinks = m_dataManager.GetSelectManager().SelectSensorLinks(null, null, out strErrorMessage);

            if (sensorLinks == null)
            {
                return false;
            }

            List<MaterialLink> materialLinks = m_dataManager.GetSelectManager().SelectMaterialLinks(null, null, out strErrorMessage);

            if (materialLinks == null)
            {
                return false;
            }

            Dictionary<string, SensorLink> dicSensorLinks = new Dictionary<string, SensorLink>();

            foreach (SensorLink link in sensorLinks)
            {
                dicSensorLinks[link.SensorName] = link;
            }

            Dictionary<int, MaterialLink> dicMaterialLinks = new Dictionary<int, MaterialLink>();
            Dictionary<int, int> dicMaterialLinkIDs = new Dictionary<int, int>();

            foreach (MaterialLink link in materialLinks)
            {
                dicMaterialLinks[link.MaterialID] = link;
                dicMaterialLinkIDs[link.MaterialID] = link.UniqueID;
            }

            List<ETC> sensors = m_sdmsDataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            if (sensors == null)
            {
                return false;
            }

            Dictionary<string, float?> dicSensorDatas = ReadSensorDatas(out strErrorMessage);

            if (dicSensorDatas == null)
            {
                return false;
            }

            SensorLink sensorLink;
            int nSensorTypeID;
            DateTime dtNow = DateTime.Now;

            //string dt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            //dtNow = DateTime.ParseExact(dt, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            // 센서 사용X SdmsSensorETC 업데이트
            StringBuilder strBuilder = new StringBuilder();
            string ids = "";

            List<OptionSDMS> optionSDMS = m_dataManager.GetSelectManager().SelectAllYeosuOptionSDMS(null, null, out strErrorMessage);

            Dictionary<string, bool> isAvailableSensor = new Dictionary<string, bool>();

            bool isAvailable;

            foreach (OptionSDMS option in optionSDMS)
            {
                string strUseReceive = "UseReceive";

                string sensorCategory = option.PropertyName.Replace(strUseReceive, "");

                if (bool.TryParse(option.PropertyValue, out isAvailable))
                {
                    isAvailableSensor[sensorCategory] = isAvailable;
                }
            }

            foreach (ETC sensor in sensors)
            {

                string categoryFromUniqueKey = sensor.UniqueKey.Split('_')[0];

                if (sensor.MaterialType != null && dicSensorLinks.TryGetValue(sensor.Name, out sensorLink) && dicMaterialLinkIDs.TryGetValue((int)sensor.MaterialType, out nSensorTypeID))
                {
                    string strSensorKey = MakeSensorKey(sensorLink.ServiceID, sensorLink.RegionID, sensorLink.GroupID, sensorLink.NodeID, nSensorTypeID);

                    float? sensorValue;

                    if (dicSensorDatas.TryGetValue(strSensorKey, out sensorValue))
                    {
                        sensor.CurrentData = sensorValue == null ? null : string.Format("{0:F2}", (float)sensorValue);
                        sensor.Enabled = sensorValue == null ? false : true;

                        if (m_sdmsDataManager.GetUpdateManager().UpdateETCSensor(sensor, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write("[ERROR] UpdateETCSensor is failed : " + strErrorMessage);
                            return false;
                        }
                        else
                        {
                            EtcSensorDataHistory sensorDataHistory = new EtcSensorDataHistory();
                            sensorDataHistory.SensorID = sensor.ID;
                            sensorDataHistory.SensorValue = sensor.CurrentData;
                            sensorDataHistory.TimeStamp = dtNow;


                            if (m_dataManager.GetCreateManager().CreateEtcSensorDataHistory(sensorDataHistory, out strErrorMessage) == null)
                            {
                                Logger.Instance.Write("[ERROR] CreateEtcSensorDataHistory is failed : " + strErrorMessage);

                                continue;
                            }
                            
                            #region 4단계만 알람
                            int nPrevAlarmLevel;
                            int nAlarmLevel = GetAlarmLevel(dicMaterialLinks, sensor);

                            if (m_dicPrevSensorAlarmLevels.TryGetValue(sensor.ID, out nPrevAlarmLevel) == false && nAlarmLevel == 4)
                            {
                                m_dicPrevSensorAlarmLevels[sensor.ID] = nAlarmLevel;

                                AlarmSensor alarmSensor = new AlarmSensor();
                                alarmSensor.Sensor = sensor;
                                alarmSensor.AlarmLevel = nAlarmLevel;

                                if (alarmSensor.AlarmLevel > 3)
                                {
                                    // 2024-06-26 , 미세먼지 , 초미세먼지 알람 발생안함 (여수측 요청사항)
                                    // pm10 = 206, pm25 = 205
                                    if (sensor.MaterialType == 206 || sensor.MaterialType == 205)
                                    {
                                        continue;
                                    }
                                    
                                    if (categoryFromUniqueKey != "Weather" && isAvailableSensor[categoryFromUniqueKey] == true)
                                    {
                                        alarmSensors.Add(alarmSensor);
                                        Logger.Instance.Write("SensorName : " + sensor.Name + "에서 알람발생 , AlarmLevel : " + nAlarmLevel.ToString());
                                    }
                                }
                            } else if (m_dicPrevSensorAlarmLevels.TryGetValue(sensor.ID, out nPrevAlarmLevel) == true)
                            {
                                nPrevAlarmLevel = m_dicPrevSensorAlarmLevels[sensor.ID];

                                if (nPrevAlarmLevel != nAlarmLevel)
                                {
                                    m_dicPrevSensorAlarmLevels[sensor.ID] = nAlarmLevel;

                                    AlarmSensor alarmSensor = new AlarmSensor();
                                    alarmSensor.Sensor = sensor;
                                    alarmSensor.AlarmLevel = nAlarmLevel;

                                    // if (alarmSensor.AlarmLevel > 0 && alarmSensor.AlarmLevel < 4)
                                    // {
                                    //     if (categoryFromUniqueKey != "Weather" && isAvailableSensor[categoryFromUniqueKey] == true)
                                    //     {
                                    //         alarmSensors.Add(alarmSensor);
                                    //     }
                                    // }    
                                    
                                    if (categoryFromUniqueKey != "Weather" && isAvailableSensor[categoryFromUniqueKey])
                                    {
                                        alarmSensors.Add(alarmSensor);
                                    }
                                }
                            }
                            #endregion
                        }
                    } 
                    else
                    {
                        // sys_net_node table use 컬럼 0이면 ETC테이블의 Enabled 변경 0 : 꺼짐 , 1 : 켜짐
                        strBuilder.Append(sensor.ID.ToString());
                        strBuilder.Append(", ");
                    }
                }
            }

            if (sensors.Count > 0)
            {
                strBuilder.Remove(strBuilder.Length - 2, 2);
            }

            Dictionary<ETC.Fields, object> dicSets2 = new Dictionary<ETC.Fields, object>();
            dicSets2.Add(ETC.Fields.Enabled, true);

            string strCondition2 = string.Format("Enabled = 0");

            m_sdmsDataManager.GetUpdateManager().UpdateETCSensor(dicSets2, null, strCondition2, out strErrorMessage);

            ids = strBuilder.ToString();

            Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
            dicSets.Add(ETC.Fields.Enabled, false);

            string strCondition = string.Format("ID in ({0})", ids);

            if(m_sdmsDataManager.GetUpdateManager().UpdateETCSensor(dicSets, null, strCondition, out strErrorMessage) == false)
            {
                Logger.Instance.Write("[ERROR] UpdateEtcSensors_Enabled_false : " + strErrorMessage);
                return false;
            }

            return true;
        }

        /// <summary>
        ///
        /// Insert YeosuEtcSensorDataHistory from dt_op_report
        ///
        /// </summary>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        public bool InsertSensorData(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            
            List<SensorLink> sensorLinks = m_dataManager.GetSelectManager().SelectSensorLinks(null, null, out strErrorMessage);
            
            if (sensorLinks == null)
            {
                return false;
            }

            List<MaterialLink> materialLinks = m_dataManager.GetSelectManager().SelectMaterialLinks(null, null, out strErrorMessage);

            if (materialLinks == null)
            {
                return false;
            }

            Dictionary<string, SensorLink> dicSensorLinks = new Dictionary<string, SensorLink>();

            foreach (SensorLink link in sensorLinks)
            {
                dicSensorLinks[link.SensorName] = link;
            }
            
            Dictionary<int, MaterialLink> dicMaterialLinks = new Dictionary<int, MaterialLink>();
            Dictionary<int, int> dicMaterialLinkIDs = new Dictionary<int, int>();
            
            foreach (MaterialLink link in materialLinks)
            {
                dicMaterialLinks[link.MaterialID] = link;
                dicMaterialLinkIDs[link.MaterialID] = link.UniqueID;
            }
            
            // 1달 지난 데이터 폐기
            DateTime dtNow = DateTime.Now;
            DateTime dtLimit = dtNow.AddMonths(-1);
            Dictionary<EtcSensorDataHistory.Fields, object> dicConditions = new Dictionary<EtcSensorDataHistory.Fields, object>();

            bool isNullable;
            string strAdditionalCondition = string.Format("{0} < '{1:00}-{2:00}-{3:00} {4:00}:{5:00}:{6:00}'",
                EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out isNullable),
                dtLimit.Year, dtLimit.Month, dtLimit.Day,
                dtLimit.Hour, dtLimit.Minute, dtLimit.Second);

            if (m_dataManager.GetDeleteManager().DeleteEtcSensorDataHistory(dicConditions, strAdditionalCondition, out strErrorMessage) == false)
            {
                Logger.Instance.Write("[ERROR] DeleteEtcSensorDataHistory is failed : " + strErrorMessage);
                return false;
            }
            List<ETC> sensors = m_sdmsDataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            if (sensors == null)
            {
                return false;
            }

            Dictionary<string, float?> dicSensorDatas = ReadSensorDatas(out strErrorMessage);

            if (dicSensorDatas == null)
            {
                return false;
            }
            
            List<string> arrInserts = new List<string>();

            foreach (ETC sensor in sensors)
            {
                if (sensor.MaterialType != null && dicSensorLinks.TryGetValue(sensor.Name, out SensorLink sensorLink) && dicMaterialLinkIDs.TryGetValue((int)sensor.MaterialType, out int nSensorTypeID))
                {
                    string strSensorKey = MakeSensorKey(sensorLink.ServiceID, sensorLink.RegionID, sensorLink.GroupID, sensorLink.NodeID, nSensorTypeID);

                    float? sensorValue;

                    if (dicSensorDatas.TryGetValue(strSensorKey, out sensorValue))
                    {
                        sensor.CurrentData = sensorValue == null ? null : string.Format("{0:F2}", (float)sensorValue);
                        sensor.Enabled = sensorValue == null ? false : true;
        
                        string strInsertString = $@"{sensor.ID.ToString()}, '{sensor.CurrentData}', '{dtNow.ToString("yyyy-MM-dd HH:mm:ss")}'";
                        
                        arrInserts.Add(strInsertString);

                    }
                }
            }

            string strInsertQuery = $@"Insert Into {EtcSensorDataHistory.TableName}
                                        (
                                        {EtcSensorDataHistory.Fields.SensorID.ToString()},
                                        {EtcSensorDataHistory.Fields.SensorValue.ToString()},
                                        {EtcSensorDataHistory.Fields.TimeStamp.ToString()}
                                        )
                                        Values ({string.Join("), (", arrInserts)})
                                    ";

            try
            {
                if (!m_sdmsDataManager.GetCreateManager().RunQuery(strInsertQuery))
                {
                    Logger.Instance.Write("[ERROR] InsertYeosuEtcSensorData is failed : " + strErrorMessage);
                    return false;
                }                
            } catch (Exception ex)
            {
                Logger.Instance.Write("[ERROR] InsertYeosuEtcSensorData is failed : " + ex.Message);
                return false;
            }
            
            return true;
        }

        private int GetAlarmLevel(Dictionary<int, MaterialLink> dicMaterialLinks, ETC sensor)
        {
            if (sensor.MaterialType == null || sensor.CurrentData == null)
            {
                Logger.Instance.Write("[error] sensor.MaterialType is Null or sensor.CurrentData is Null , SensorID : " + sensor.ID.ToString() + " SensorName : " + sensor.Name);
                return 1;
            }
            
            double sensorData;

            int alarmLevel = 1;

            if (double.TryParse(sensor.CurrentData, out sensorData) == false)
            {
                Logger.Instance.Write("[Error] double.TryParse(sensor.CurrentData, out sensorData) is false");
                return 1;
            }

            MaterialLink link;

            if (dicMaterialLinks.TryGetValue((int)sensor.MaterialType, out link))
            {
                if (link.Min1 == null && link.Max1 == null && link.Min2 == null && link.Max2 == null)
                {
                    // Min1, Max1, Min2, Max2가 모두 null이면 알람 발생하지 않음 - 임계치 없음
                    return 1;
                }

                if (link.Direction == 0) // 임계치 역순 
                {
                    if (sensorData < link.Min2)
                    {
                        alarmLevel = 2;
                    }

                    if (sensorData < link.Max1)
                    {
                        alarmLevel = 3;
                    }

                    if (sensorData < link.Min1)
                    {
                        alarmLevel = 4;
                    }

                    return alarmLevel;
                } else if (link.Direction == 1) // 임계치 정순
                {
                    if (sensorData > link.Min1)
                    {
                        alarmLevel = 2;
                    }

                    if (sensorData > link.Max1)
                    {
                        alarmLevel = 3;
                    }

                    if (sensorData > link.Max2)
                    {
                        alarmLevel = 4;
                    }

                    return alarmLevel;
                }
            }
            else
            {
                Logger.Instance.Write("dicMaterialLinks.TryGetValue((int)sensor.MaterialType, out link) is not valid");
            }

            return 0;
        }
        
        private Dictionary<string, float?> ReadSensorDatas(out string strErrorMessage)
        {
            //ReadNetNodes(); 

            Dictionary<string, string> dicSerivceNodes = GetValidServiceNode(out strErrorMessage);

            if (dicSerivceNodes == null)
            {
                strErrorMessage = "Service Nodes is Null. Error Message : " + strErrorMessage;
                return null;   
            }

            string nodeIDs = "";
            
            foreach (string strNode in dicSerivceNodes.Values)
            {
                nodeIDs += strNode;
                nodeIDs += " ";
            }

            DateTime dtNow = DateTime.Now;

            // 새벽 1시전에는 전날 데이터도 유효하게 취급한다..
            if (dtNow.Hour == 0)
                dtNow = dtNow.AddDays(-1);

            string strDate = string.Format("{0}-{1:00}-{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);

            string strSql = $@"Select 
                                sys_net_service_id, 
                                sys_net_region_id, 
                                sys_net_group_id, 
                                sys_net_node_id, 
                                report_mem_addr, 
                                report_mem_value, 
                                report_mem_extra, 
                                report_valid_cnt, 
                                report_timestamp
                                    from dt_op_report
                                        where dt_op_report_id in (
                                            Select max(dt_op_report_id) from dt_op_report
                                                where report_timestamp >= '{strDate}'
                                                group by sys_net_service_id, sys_net_region_id, sys_net_group_id, sys_net_node_id, report_mem_addr
                                        ) 
                                        and report_timestamp >= '{strDate}'
                                        order by sys_net_service_id, report_mem_addr";

            ArrayList arrResult = m_dbMgr.GetResultData(strSql);

            if (arrResult == null)
            {
                strErrorMessage = m_dbMgr.LastErrorMessage;

                return null;
            }

            // Key : serviceID + regionID + groupID + nodeID + sensorTypeID
            Dictionary<string, float?> dicSensorDatas = new Dictionary<string, float?>();
            int nResultCount = arrResult.Count;

            string strLastTime = "";

            for (int i = 0; i < nResultCount - 8; i += 9)
            {
                VariousData<int> serviceID = WebDBManager.GetIntField(arrResult[i].ToString());
                VariousData<int> regionID = WebDBManager.GetIntField(arrResult[i + 1].ToString());
                VariousData<int> groupID = WebDBManager.GetIntField(arrResult[i + 2].ToString());
                VariousData<int> nodeID = WebDBManager.GetIntField(arrResult[i + 3].ToString());
                VariousData<int> sensorTypeID = WebDBManager.GetIntField(arrResult[i + 4].ToString());
                VariousData<float> sensorValue = WebDBManager.GetFloatField(arrResult[i + 5].ToString());
                VariousData<float> sensorExtraValue = WebDBManager.GetFloatField(arrResult[i + 6].ToString());
                VariousData<int> validCount = WebDBManager.GetIntField(arrResult[i + 7].ToString());
                string timeStamp = WebDBManager.GetStringField(arrResult[i + 8]);

                if (serviceID == null || regionID == null || groupID == null || nodeID == null || sensorTypeID == null || validCount == null || timeStamp == null)
                    continue;

                string strServiceNode = MakeServideNode(serviceID.Data, regionID.Data, groupID.Data, nodeID.Data);

                if (dicSerivceNodes.ContainsKey(strServiceNode) == false)
                    continue;

                string strKey = MakeSensorKey(serviceID.Data, regionID.Data, groupID.Data, nodeID.Data, sensorTypeID.Data);

                if (sensorValue == null)
                    dicSensorDatas[strKey] = null;
                else
                {
                    if (sensorExtraValue != null && sensorExtraValue.Data != 0)
                        dicSensorDatas[strKey] = GetWindDirection(sensorValue.Data, sensorExtraValue.Data, validCount.Data);
                    else
                        dicSensorDatas[strKey] = sensorValue.Data / validCount.Data;
                }

                /*string strValue = sensorValue == null ? "NULL" : string.Format("{0:F2}", sensorValue.Data);
                string strExtraValue = sensorExtraValue == null ? "NULL" : string.Format("{0:F2}", sensorExtraValue.Data);
                string strLog = string.Format("{0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}",
                    serviceID.Data, regionID.Data, groupID.Data, nodeID.Data,
                    sensorTypeID.Data, strValue, strExtraValue, validCount.Data, timeStamp);
                WriteLog(strLog);*/
            }

            //if (ReadNetRaw(dicSensorDatas, dicSerivceNodes, ref strLastTime, out strErrorMessage) == false)
            //    return null;

            m_strLastReadTime = strLastTime;

            return dicSensorDatas;
        }

        private float GetWindDirection(float value, float extra, int count)
        {
            double radian = System.Math.Atan2(value / count, value / extra);
            double degree = radian * 180 / System.Math.PI;
            
            while (degree < 0)
            {
                degree += 360;
            }

            while (degree >= 360)
            {
                degree -= 360;
            }

            return (float)degree;
        }

        private Dictionary<string, string> GetValidServiceNode(out string strErrorMessage)
        {
            strErrorMessage = null;
            string strSQL = "Select sys_net_service_id, sys_net_region_id, sys_net_group_id, sys_net_node_id from sys_net_node where sys_net_node_use = 1";
            ArrayList arrResult = m_dbMgr.GetResultData(strSQL);

            if (arrResult == null)
            {
                strErrorMessage = m_dbMgr.LastErrorMessage;

                return null;
            }

            int nResultCount = arrResult.Count;
            Dictionary<string, string> dicSerivceNodes = new Dictionary<string, string>();

            for (int i=0;i<nResultCount-3;i+=4)
            {
                VariousData<int> serviceID = WebDBManager.GetIntField(arrResult[i].ToString());
                VariousData<int> regionID = WebDBManager.GetIntField(arrResult[i + 1].ToString());
                VariousData<int> groupID = WebDBManager.GetIntField(arrResult[i + 2].ToString());
                VariousData<int> nodeID = WebDBManager.GetIntField(arrResult[i + 3].ToString());

                if (serviceID == null || regionID == null || groupID == null || nodeID == null)
                    continue;

                string strServiceNode = MakeServideNode(serviceID.Data, regionID.Data, groupID.Data, nodeID.Data);
                dicSerivceNodes[strServiceNode] = strServiceNode;
            }

            return dicSerivceNodes;
        }

        private string MakeSensorKey(int nServiceID, int nRegionID, int nGroupID, int nNodeID, int nSensorTypeID)
        {
            return string.Format("{0}_{1}_{2}_{3}_{4}", nServiceID, nRegionID, nGroupID, nNodeID, nSensorTypeID);
        }

        private string MakeServideNode(int nServiceID, int nRegionID, int nGroupID, int nNodeID)
        {
            return string.Format("{0}_{1}_{2}_{3}", nServiceID, nRegionID, nGroupID, nNodeID);
        }

    }

    public class AlarmSensor
    {
        private ETC m_sensor = null;
        private int m_nAlarmLevel = 0;

        public ETC Sensor
        {
            get { return m_sensor; }
            set { m_sensor = value; }
        }

        public int AlarmLevel
        {
            get { return m_nAlarmLevel; }
            set { m_nAlarmLevel = value; }
        }
    }
}
