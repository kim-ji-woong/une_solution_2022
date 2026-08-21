using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using AgentFactory.BLL;

namespace SOPWebServer.BLL.Language
{
    public class MultilingualManager
    {
        public enum Language { ko, en }
        public enum Sentence {
            detectLoc = 0,
            detect,
            detectRecoveryLoc,
            detectRecovery,
            detectMalfunctionLoc,
            detectMalfunction,
            reportLoc,
            report,
            reportOverLoc,
            reportOver,
            changeAlarmLevelLoc,
            changeAlarmLevel
        }
        
        /// <summary>
        /// ~에서 ~센서가 탐지되었습니다 등의 알람 문구를 다국어로 지원함
        /// </summary>
        /// <param name="strTag"></param>
        /// <param name="sentenc"></param>
        /// <param name="facilityType"></param>
        /// <param name="strLocation"></param>
        /// <returns></returns>
        public static string ConvertJson(string strTag, Sentence sentenc, Facility.FacilityType facilityType, string strLocation = "")
        {
            LanguagePack lang = null;

            try
            {
                string excutePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().CodeBase).Replace("file:\\", "");
                string filePath = excutePath + @"\Language\language.json";

                using (StreamReader r = new StreamReader(filePath))
                {
                    string json = r.ReadToEnd();
                    lang = JsonConvert.DeserializeObject<LanguagePack>(json);
                }
            }
            catch (Exception)
            {
                return DefaultString(strTag, sentenc, facilityType, strLocation);
            }

            if (lang == null || lang.ko == null || lang.en == null)
                return DefaultString(strTag, sentenc, facilityType, strLocation); 

            ReturnJson rj = new ReturnJson();

            Type type = lang.ko.GetType();
            IList<PropertyInfo> props = new List<PropertyInfo>(type.GetProperties());
            foreach (PropertyInfo prop in props)
            {
                if (prop.Name == sentenc.ToString())
                {
                    object value = prop.GetValue(lang.ko, null);
                    if (strLocation == null || strLocation.Length == 0)
                    {
                        rj.ko = strTag + string.Format(value.ToString(), Facility.GetFacilityTypeShortString(facilityType));
                    }
                    else
                    {
                        string inputLoc = strLocation;
                        try
                        {
                            ReturnJson rjLoc = JsonConvert.DeserializeObject<ReturnJson>(strLocation);
                            if (rjLoc != null)
                                inputLoc = rjLoc.ko;
                        }
                        catch (Exception)
                        {
                            // 위치값이 json 형식이 아닐 때 
                            return DefaultString(strTag, sentenc, facilityType, strLocation);
                        }

                        rj.ko = strTag + string.Format(value.ToString(), inputLoc, Facility.GetFacilityTypeShortString(facilityType));
                    }

                    break;
                }
            }

            string strTagEn = strTag;
            if (strTag == "[테스트]")
                strTagEn = "[TEST]";

            type = lang.en.GetType();
            props = new List<PropertyInfo>(type.GetProperties());
            foreach (PropertyInfo prop in props)
            {
                if (prop.Name == sentenc.ToString())
                {
                    object value = prop.GetValue(lang.en, null);
                    if (strLocation == null || strLocation.Length == 0)
                    {
                        rj.en = strTagEn + string.Format(value.ToString(), Facility.GetFacilityTypeShortEnString(facilityType));
                    }
                    else
                    {
                        string inputLoc = strLocation;
                        ReturnJson rjLoc = null;
                        try
                        {                            
                            rjLoc = JsonConvert.DeserializeObject<ReturnJson>(strLocation);
                            if (rjLoc != null)
                                inputLoc = rjLoc.ko;
                        }
                        catch (Exception)
                        {
                            // 위치값이 json 형식이 아닐 때 
                            return DefaultString(strTagEn, sentenc, facilityType, strLocation);
                        }
                        if (rjLoc != null)
                            inputLoc = rjLoc.en;

                        rj.en = strTagEn + string.Format(value.ToString(), inputLoc, Facility.GetFacilityTypeShortEnString(facilityType));
                    }

                    break;
                }
            }
            string ss = JsonConvert.SerializeObject(rj);
            return ss;
        }

        private static string DefaultString(string strTag, Sentence sentenc, Facility.FacilityType facilityType, string strLocation = "")
        {
            switch (sentenc)
            {
                case Sentence.detect: return strTag + $"{Facility.GetFacilityTypeShortString(facilityType)}가 탐지되었습니다.";
                case Sentence.detectLoc: return $"{strTag}[{strLocation}]에서 {Facility.GetFacilityTypeShortString(facilityType)}가 탐지되었습니다.";
                case Sentence.report: return $"{Facility.GetFacilityTypeShortString(facilityType)}가 신고되었습니다.";
                case Sentence.reportLoc: return $"[{strLocation}]에서 {Facility.GetFacilityTypeShortString(facilityType)}가 신고되었습니다.";
                case Sentence.reportOver: return $"신고된 {Facility.GetFacilityTypeShortString(facilityType)} 상황이 종료되었습니다.";
                case Sentence.reportOverLoc: return $"{strLocation}에서 신고된 {Facility.GetFacilityTypeShortString(facilityType)} 상황이 종료되었습니다.";
            }
            return "";
        }
    }

    public class ReturnJson
    {
        public string ko { get; set; }
        public string en { get; set; }
    }

    public class LanguagePack
    {
        public LanguagePack2 ko { get; set; }
        public LanguagePack2 en { get; set; }
    }

    public class LanguagePack2
    {
        public string detectLoc { get; set; }
        public string detect { get; set; }
        public string detectRecoveryLoc { get; set; }
        public string detectRecovery { get; set; }
        public string detectMalfunctionLoc { get; set; }
        public string detectMalfunction { get; set; }
        public string reportLoc { get; set; }
        public string report { get; set; }
        public string reportOverLoc { get; set; }
        public string reportOver { get; set; }
        public string changeAlarmLevelLoc { get; set; }
        public string changeAlarmLevel { get; set; }
    }
}
