import ProjectResource from "../../Root/resource/id";

export default class AccountResource {
    static popupMode = {
        사용자_권한_관리: "사용자 권한 관리",
        사용자_권한_등록: "사용자 권한 등록",
        삭제_이력: "삭제 이력",
        마이_페이지: "마이 페이지"
    }

    static accountLevelID = {
        master: 0,
        admin: 1,
        user: 2,


        wonikSafeAdmin: 7,  // 원익 안전관리자
        wonikSafety: 8,     // 원익 안전담당자
        wonikSecurity: 9,   // 원익 경비실 - 대시보드만 사용 가능
        wonikCEO: 10        // 원익 대표 - 3D, 대시보드만 사용 가능, SDMS 알람 표시X
    }

    // login : 로그인 
    // logout : 로그아웃
    // false: 세션 조회 실패
    // disconnected : 네트워크 연결 끊김
    static loginState = {
        login: 0,
        logout: 1,
        false: 2,
        disconnected: 3,
    }

    static findMode = {
        email: 0,
        sms: 1,
    }

    static menu = {
        accountList: "목록",
        accountAddUser: "신규등록"
    }
}