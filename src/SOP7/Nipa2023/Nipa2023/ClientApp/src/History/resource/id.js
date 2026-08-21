import ProjectResource from "../../Root/resource/id";

export default class HistoryResource {
    static get ID() {
        return HistoryResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            projectName: "이력관리",

            menu:
            {
                sensorDetectHistory: "센서 탐지 이력",
                sensorDetectAnalysis: "센서 탐지 분석",
                sopHistory: "SOP 이력",
                detailHistory: "상세보기",
            }
        },
        "en": {
        }
    }
}