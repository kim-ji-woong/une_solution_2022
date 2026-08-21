import ProjectResource from "../../Root/resource/id";

export default class SettingsResource {
    static shortcutKey = {
        _3D_관제시스템: "3D 관제시스템",
        이력: "이력",
        SOP_실행: "SOP 실행",
        SOP_편집: "SOP편집",
        조직관리: "조직관리",
        대시보드: "대시보드",
        설정: "설정",
        홈버튼: "홈버튼",
        즉시회전: "즉시회전"
    }

    static excelMode = {
        건물정보_업데이트: "건물정보 업데이트",
        건물그룹정보_업데이트: "건물그룹정보 업데이트",
        설비정보_업데이트: "설비정보 업데이트",
        조직정보_업데이트: "조직정보 업데이트"
    }

    static userOptionMode = {
        일반: "일반",
        시스템_정보: "시스템 정보",
    }

    static sopSetMode = {
        일반: "일반",
        고급: "고급"
    }

    static setMenu = {
        _3D_관제시스템: "3D 관제 시스템",
        대시보드: "대시보드",
        SOP_환경: "SOP 환경",
        SOP_연결: "SOP 연결",
        조직관리: "조직관리",
        시스템_정보: "시스템 정보",
        사용자_옵션: "사용자 옵션",
        CCTV_설정: "CCTV 설정",
        연동_서비스_설정: "연동 서비스 설정"
    }

    static setInterWorking = {
        센서_설정: "센서 설정",
        CCTV_설정: "CCTV 설정",
    }    

    static reAlarm = {
        ReAlarm: "0",
        NoAlarmTerm: "1",
        NoAlarm: "2",
    }

    static timeUnit = {
        second: "0",
        minute: "1",
        hour: "2",
    }

    static eventInfoDisplayTerm = {
        day: "0",
        week: "1",
        month: "2",
    }

    static ExeSOPMode = {
        false: "0",
        exe: "1",
    }

    static sopEndMode = {
        end: 0,         // 자동종료
        confirm: 1,     // 확인 후 종료
        notEnd: 2,      // 종료안함
    }

    static messageType = {
        sms: 0,         // 문자
        email: 1,       // 이메일
    }

    static closeMode = {
        cancle: 0,         // 취소 및 닫기
        confirm: 1,        // 저장 및 확인
        afterReload: 2,    // 창이 닫힌 후 셋팅값 저장 
    }

    static moveDisplayAlarm = {
        currentDisplay: "0",    // 현재 화면 유지
        moveAlarm: "1",
        firstAlarm: "2",        // 첫번째 알람 화면으로 이동
        lastAlarm: "3",         // 마지막 알람 화면으로 이동
    }

    static usePoiFocus = {
        off: "false",
        on: "true",
    }

    static usePoiHighlight = {
        off: "false",
        on: "true",
    }

    static turnStart = {
        LastView: "1",
        StandardView: "2",
    }

    static useAlarmTurn = {
        off: "false",
        on: "true",
    }

    static useAlarmArea = {
        off: "false",
        on: "true",
    }
}