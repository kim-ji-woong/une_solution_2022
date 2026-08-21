import ProjectResource from "../../Root/resource/id";

export default class AccountResource {
    static get ID() {
        return AccountResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            "textTitleID": "ID",
            "textIDInput": "아이디를 입력하세요.",
            "textTitlePwd": "Password",
            "textPwdInput": "비밀번호를 입력하세요.",
            "textPwdFind": "비밀번호를 잊으셨나요?",
            "textLoginIDError": "아이디를 입력하세요.",
            "textLoginPwdError": "비밀번호를 입력하세요.",
            "textLoginError": "ID 또는 Password가 일치하지 않습니다.",
            "textIDsave": "ID 저장",
            "textTitleName": "Name",
            "textPlaceName": "이름을 입력하세요.",
            "textTitlePhone": "Phone number",
            "textPlacePhone": "휴대전화번호를 입력하세요.",
            "textGoLoginPage": "로그인페이지로 돌아가기",

            menu: {
                accountList: "목록",
                accountAddUser: "신규등록"
            },

            popupMode:
                {
                    manager: "사용자 권한 관리",
                    register: "사용자 권한 등록",
                    report: "삭제이력",
                },

            setPwdMode:
                {
                    userInfo: "사용자 정보",
                    setPwd: "비밀번호 변경",
                    message: "메시지",
                },

            accountLevel: {
                admin: "총괄관리자",
                user: "사용자",
            },

            arrDayStr: ['일', '월', '화', '수', '목', '금', '토'],
        }
    }
    
    static menu = {
        accountList: 0,
        accountAddUser: 1
    }

    static accountLevelID = {
        master: 0,
        admin: 1,
        user: 2,
    }
}