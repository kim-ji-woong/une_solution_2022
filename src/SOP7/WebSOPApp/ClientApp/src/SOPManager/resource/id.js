import { i18n } from "../../language/i18n";
import ProjectResource from "../../Root/resource/id";

export default class SopManagerResource {
    static menu = {
        SOP_편집: "SOP 편집",
        홈: "홈",
        새_SOP: "새 SOP",
        열기: "열기",
        저장: "저장",
        다른_이름_저장: "다른 이름저장",
        삭제: "삭제",
        파일_열기: "파일 열기",
        파일_저장: "파일 저장",
    }

    static cascadingMenu = {
        SOP_단계: "SOP 단계",
        컴포넌트_추가: "컴포넌트 추가",
        특수문자_입력_형식: "특수문자 입력 형식",
        사용자_정의_인자: "사용자 정의 인자"
    }

    static component = {
        없음: "없음",
        삭제: "삭제",
        프로세스: "프로세스",
        시작_끝: "시작/끝",
        판단: "판단",
        설명: "설명",
        상황전파: "상황전파"
    }

    static editMenu = {
        뒤로가기: "뒤로가기",
        되돌리기: "되돌리기",
        복사: "복사",
        잘라내기: "잘라내기",
        붙여넣기: "붙여넣기",
        삭제: "삭제"
    }

    static actionStep = {
        _0st: "Normal",
        _1st: "Level 1",
        _2nd: "Level 2",
        _3rd: "Level 3",
        _4th: "Level 4",
    }

    static contextMenu = {
        왼쪽_열_추가: "왼쪽 열추가",
        오른쪽_열_추가: "오른쪽 열추가",
        열_삭제: "열삭제",
        위쪽_행_추가: "위쪽 행추가",
        아래쪽_행_추가: "아래쪽 행추가",
        행_삭제: "행삭제"
    }

    static format(strFormat, arg1 = null, arg2 = null, arg3 = null, arg4 = null, arg5 = null, arg6 = null, arg7 = null, arg8 = null, arg9 = null, arg10 = null) {
        let value = strFormat;

        if (arg1 !== null) {
            value = value.replace("{0}", arg1.toString());
        }

        if (arg2 !== null) {
            value = value.replace("{1}", arg2.toString());
        }

        if (arg3 !== null) {
            value = value.replace("{2}", arg3.toString());
        }

        if (arg4 !== null) {
            value = value.replace("{3}", arg4.toString());
        }

        if (arg5 !== null) {
            value = value.replace("{4}", arg5.toString());
        }

        if (arg6 !== null) {
            value = value.replace("{5}", arg6.toString());
        }

        if (arg7 !== null) {
            value = value.replace("{6}", arg7.toString());
        }

        if (arg8 !== null) {
            value = value.replace("{7}", arg8.toString());
        }

        if (arg9 !== null) {
            value = value.replace("{8}", arg9.toString());
        }

        if (arg10 !== null) {
            value = value.replace("{9}", arg10.toString());
        }

        return value;
    }

    static disasterCategoryType = {
        fire: 0,                // 화재
        natureDisaster: 1,      // 자연재해
        explosion: 2,           // 폭발
        pollution: 3,           // 누출
        security: 4,            // 보안
        terror: 5,              // 테러
        etc: 6,                 // 기타
        lifesaving: 7,          // 인명구조
        earthquake: 8,          // 지진
        strongwind: 9,          // 강풍
        blackout: 10,           // 정전
        becon: 11,              // 비콘
        environment: 12,        // 환경설비
        manufacture: 13,        // 제조설비
        highTemp: 14,           // 고온감지 덕트
        tank: 15,               // 유해물질 탱크 사고
    }

    static getDisasterCategoryType(disasterCategoryName) {
        if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.자연재해')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.침수'))) {
            return SopManagerResource.disasterCategoryType.natureDisaster;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.화재'))) {
            return SopManagerResource.disasterCategoryType.fire;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.폭발'))) {
            return SopManagerResource.disasterCategoryType.explosion;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.누출')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.누출 사고')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.유출')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.오염')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.유해물질'))) {
            return SopManagerResource.disasterCategoryType.pollution;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.방범')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.보안'))) {
            return SopManagerResource.disasterCategoryType.security;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.테러'))) {
            return SopManagerResource.disasterCategoryType.terror;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.인명구조')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.의료지원'))) {
            return SopManagerResource.disasterCategoryType.lifesaving;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.지진'))) {
            return SopManagerResource.disasterCategoryType.earthquake;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.강풍')) ||
            disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.태풍'))) {
            return SopManagerResource.disasterCategoryType.strongwind;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.정전'))) {
            return SopManagerResource.disasterCategoryType.blackout;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.비콘'))) {
            return SopManagerResource.disasterCategoryType.becon;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.환경설비'))) {
            return SopManagerResource.disasterCategoryType.environment;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.제조설비'))) {
            return SopManagerResource.disasterCategoryType.manufacture;
        }        
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.덕트 고온감지'))) {
            return SopManagerResource.disasterCategoryType.highTemp;
        }
        else if (disasterCategoryName.startsWith(i18n.t('sopManager.disasterCategory.화학물질탱크 사고'))) {
            return SopManagerResource.disasterCategoryType.tank;
        }

        return SopManagerResource.disasterCategoryType.etc;
    }
}