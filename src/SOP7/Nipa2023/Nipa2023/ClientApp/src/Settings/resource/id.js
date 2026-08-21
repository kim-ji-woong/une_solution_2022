import ProjectResource from "../../Root/resource/id";

export default class SettingsResource {
    static get ID() {
        return SettingsResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
        }
    }

    static moveDisplayAlarm = {
        currentDisplay: 1,    // 현재 화면 유지
        firstAlarm: 2,        // 첫번째 알람 화면으로 이동
        lastAlarm: 3          // 마지막 알람 화면으로 이동
    }

    static timeUnit = {
        second: 0,
        minute: 1,
        hour: 2
    }

    static menu = {
        monitoring3D: 0,
        sopSet: 1
    }

    static sensor = {
        gas: 0,
        atmosphere: 1,
        emergencyBell: 2,
        thermalCamera: 3,
        worker: 4,
        fire: 5
    }
}