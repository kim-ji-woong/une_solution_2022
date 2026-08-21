import StringUtil from "../../Common/util/StringUtil";
import ProjectResource from "../../Root/resource/id";

export default class HistoryResource {

    static get ID() {
        return HistoryResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            projectName: "이력",

            menu:
                {
                    userHistory: "데이터 수정 이력",
                    sensorDetectHistory: "센서 감지 이력",
                    sensorDetectAnalysis: "센서 감지 분석",
                    sopHistory: "SOP 이력",
                    spreadHistory: "상황전파 이력",
                    detailHistory: "상세보기"
                }
        }
    }
    
    static menu = {
        데이터_수정_이력: "데이터 수정 이력",
        센서_탐지_이력: "센서 탐지 이력",
        센서_탐지_분석: "센서 탐지 분석",
        SOP_이력: "SOP 이력",
        상황전파_이력: "상황전파 이력",
        상세보기: "상세보기",
        안전구역_평가_이력: "안전구역 평가 이력",
        이벤트_이력: "이벤트 이력",
        고장_이력: "고장 이력",
        점검_이력: "점검 이력",
        센서_탐지_통계표: "센서 탐지 통계표",
        센서_탐지_차트: "센서 탐지 차트",
    }

    static AssessmentClass = {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E"
    }
    
    static ExternalSensorTypes = {
        Entire: -1,
        Atmosphere: 1,
        Weather: 2,
        Electricity: 3,
        KWeather: 4,
    }

    static getDate(date) {
        const dt = date;

        let mm = dt.getMonth() + 1;
        let dd = dt.getDate();
        const ymd = StringUtil.getDoubleString(mm) + '월' + StringUtil.getDoubleString(dd) + '일';
        const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes());

        return ymd + ' ' + hms;
    }
    
    static MeasureMentTypes = {
        Temperature: 1,
        Humidity: 2,
        CO2: 3,
        NH3: 4,
        H2S: 5,
        VOC: 6,
        PM10: 7,
        PM25: 8,
        CO: 23,
        NO2: 27,
        SO2: 28,
        UV: 29,
        O3: 30,
        WindDirection: 13,
        WindSpeed: 14,
    }
}