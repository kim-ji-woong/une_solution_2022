import ProjectResource from "../../Root/resource/id";

export default class SopSimulatorResource {
    static get ID() {
        return SopSimulatorResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            projectName: "SOP",

            menu:
            {
                fasterSOP: "SOP 빠른실행",
                callSOP: "SOP 불러오기",
                execSOP: "SOP 실행",
                setSOP: "SOP 설정",

                summarySOP: "SOP 요약",
                beginSOPOption: "SOP 시작 옵션",
            },
            actionStep:
            {
                _1st: "관심",
                _2nd: "주의",
                _3rd: "경계",
                _4th: "심각",
            }
        }
    }
    
    static SensorType = {
        entire: 0, // Option 이용시 전체 선택 Value
        atmosphere: 1, // 센코 KWeather 대기센서 - 대기오염 재난유형 사용
        emission_reduction: 2, // 배출 저감 설비 - 저감/배출 재난유형 사용
        electricity: 3,
    }
}