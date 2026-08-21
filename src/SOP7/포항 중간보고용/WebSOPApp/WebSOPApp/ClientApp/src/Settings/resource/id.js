import ProjectResource from "../../Root/resource/id";

export default class SettingsResource {
    static get ID() {
        return SettingsResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            menu: {
                monitoring3D: "3D 관제",
                sopSet: "SOP",
                etc: "기타"
            }
        }
    }

    static menu = {
        monitoring3D: 0,
        sopSet: 1,
        etc: 2
    }

    static moveDisplayAlarm = {
        currentDisplay: "0",    // 현재 화면 유지
        moveAlarm: "1",
        firstAlarm: "2",        // 첫번째 알람 화면으로 이동
        lastAlarm: "3",         // 마지막 알람 화면으로 이동
    }

    static autoRotation = {
        none: 0,
        m15: 1,
        m30: 2,
        m60: 3
    }
    
    static eventCategory = {
        Num: {
            Atmosphere: 1,
            KWeather: 4,
            Reduction: 5,
            Emission: 6,
        },
        String: {
            Atmosphere: "Atmosphere",
            KWeather: "KWeather",
            Reduction: "Reduction",
            Emission: "Emission",
        }
    }
    
    static messageType = {
        sms: 0,
        email: 1
    }
}