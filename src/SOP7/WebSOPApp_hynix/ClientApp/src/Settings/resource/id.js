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

    /* static get ID() {
        return SettingsResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            menu:
            {
                monitoring3D: "3D 관제 시스템",
                dashboardSet: "대시보드",
                sopSet: "SOP 환경",
                sopLinkSet: "SOP 연결",
                teamEditor: "조직관리",
                systemInfo: "시스템 정보",
                userOption: "사용자 옵션"
            },
            shortcutKey:
            {
                sdms: "3D 관제시스템",
                history: "이력",
                sop: "SOP 실행",
                sopMgr: "SOP편집",
                teamEdit: "조직관리",
                dashBoard: "대시보드",
                settings: "설정",
                home: "홈버튼",
                rotation: "즉시회전",
            },
            excelMode:
            {
                building: "건물정보 업데이트",
                group: "건물그룹 정보 업데이트",
                facility: "설비정보 업데이트",
                regularTeam: "조직정보 업데이트"
            },

            textDashboardSet: {
                normal: "일반",
                setDate: "표출 데이터 기간 설정",
                setDateMsg: "표출 데이터 기간을 설정 합니다.",
                setDefault: "기본값으로 변경",
                today: "오늘",
                week: "1주",
                month: "1개월"
            },
            textLayoutSetting: {
                loading: "설정을 불러오고 있는 중입니다...",
                bUploadFail: "건물 정보 업로드 실패 : ",
                bgUploadFail: "건물그룹 정보 업로드 실패 : ",
                bgUploadFail: "설비 정보 업로드 실패 : ",
                rUploadFail: "조직 정보 업로드 실패 : ",
                askChgInfoSave: "변경된 내용이 있습니다. 저장할까요?",
                chgSave: "변경된 내용 저장",
                chgNotSave: "변경된 내용 취소",
                envSet: "환경설정"
            },
            textMonitoring3D: {
                mode: {
                    normal: "일반",
                    spread: "초기상황전파관리",
                    detection: "센서감지관리",
                },                
                onlyExcel: "엑셀 파일(xls, xlsx)만 업로드 가능합니다.",
                fileSizeOver: "최대 10MB 엑셀 파일을 업로드 할 수 있습니다.",
                upload: "업로드",
                download: "다운로드",
                bUploadDesc: "건물 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)",
                bgUploadDesc: "건물그룹 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)",
                fUploadDesc: "설비 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)",
                poiHighlight: "POI 하이라이트",
                poiHighlightDesc: "POI 선택시 선택된 POI 및 같은 공간의 POI 확대 여부를 설정 합니다",
                use: "사용",
                notUse: "사용안함",                
                setSmsEmail: "문자/이메일발송설정",
                msgSetSmsEmail: "문자/이메일 발송 옵션을 설정 합니다.",
                all: "전체",
                setReceiver: "전파 대상자 지정",
                sms: "문자",
                email: "이메일",
                receiver: "수신자",
                specialCharDesc: "특수문자설명",
                disasterLoc: "재난발생위치",
                disasterDate: "재난발생시간",
                msgAllApply: "모든 재난유형 동일하게 적용되었습니다.",
                allApply: "모든 재난유형 동일하게 적용하기",
                apply: "적용",
                tempSave: "임시저장",
                receive: "수신",
                displayEvt: "이벤트 영역 표시",
                displayEvtDesc: "이벤트 관련 영역 표시 여부를 설정 합니다",
                setAlarmReceive: "유형별 알람 수신 설정",
                setAlarmReceiveDesc: "유형별 알람을 설정 합니다.",
                setAutoEvtScreen: "이벤트 자동 화면 전환",
                setAutoEvtScreenDesc: "이벤트시 자동 화면 전환 여부를 설정 합니다.",
                noChg: "현재화면 유지",
                moveFirst:"첫번째 알람 화면으로 이동",
                moveLast:"마지막 알람 화면으로 이동",
                alarmBroadcast: "알람 방송",
                alarmBroadcastDesc: "알람 발생시 자동으로 재난방송을 실시합니다.",
                evtFocusing: "이벤트 포커싱",
                evtFocusingDesc: "이벤트 포커싱",
            },
            textSelectReceiver: {
                all: "전체",
                editReceiver: "수신자편집",
                type: "유형",
                location: "위치",
                member: "팀원",
                name: "이름"
            },
            textSopLink: {
                apply: "적용",
                location: "위치",
                sensorType: "센서유형",
                sopList: "SOP목록 (재난분야/재난종류/SOP이름)",
                location2: "위치(공장/건물/층)",
                disasterCategory: "재난분야",
                disasterType: "재난종류",
                sopName: "SOP이름",
                delete: "삭제"
            },
            textSopSet: {
                normal: "일반",
                highRank: "고급",
                msgAutoMoveDesc: "컴포넌트 자동 화면 이동을 설정합니다.",
                msgAutoMove: "실행중인 컴포넌트로 자동 화면 이동",
                msgSpreadOptionDesc: "상황 전파 옵션을 설정합니다.",
                useBroadcast: "방송 전파 사용하기",
                useSms: "문자 전파 사용하기",
                useEmail: "이메일 전파 사용하기",
                useConfirm: "상황 전파시 확인단계 거치기",
                setTime: "시간 설정",
                msgSetTimeDesc: "시간 설정 옵션을 설정합니다.",
                weekdays: "평일 주간 시간대",                
                fromMin: "분 부터",
                toMin: "분 까지",
                closeWaitSOP: "대기상태 SOP 자동종료",
                closeWaitSOPDesc: "대기상태 SOP 자동종료를 설정합니다.",
                allApply: "모두 적용",
                sec: "초",
                min: "분",
                hour: "시",
                autoClose: "자동 종료",
                confirmAutoClose: "확인 후 자동 종료",
                notClose: "종료 안함",
                notEnteredDuring: "동안 미입력시",
                closeSignalRecovery: "센서신호 복구시 SOP 자동 종료",
                closeSignalRecoveryDesc: "센서신호 복구시 SOP 자동 종료를 설정합니다.",
                closeSignalRecoveryAter: "센서 신호 복구 후",
                after: "뒤",
                setResultSummary: "결과 요약창 설정",
                setResultSummaryDesc: "SOP 결과 요약창을 설정합니다.",
                resultSummary: "SOP 결과요약창"
            },
            textSystemInfo: {
                vInfo: "버전 정보",
                vInfoDesc: "현재 시스템 버전 정보", 
                cInfo: "제품 공급자 정보",
                cInfoDesc: "제품 공급 업체 정보",
                cAdr: "주식회사 유엔이(서울 용산구 청파로 345 주연빌딩 1층)",
                supportCenter: "고객지원센터",
                supportCenterDesc: "고객지원센터 전화번호",
                maintenance: "유지보수 정보",
                maintenanceDesc: "시스템 유지보수 정보",
                maintenanceContent: "무상 유지보수 기간 1년 (최초 설치일로부터)"
            },
            textTeamEditor: {
                onlyExcel: "엑셀 파일(xls, xlsx)만 업로드 가능합니다.",
                maxSize: "최대 10MB 엑셀 파일을 업로드 할 수 있습니다.",
                normal: "일반",
                updateTeam: "조직정보 업데이트",
                updateTeamDesc: "조직정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)",
                upload: "업로드",
                download: "다운로드"
            },
            textUserOption: {
                mode: {
                    normal: "일반",
                    systemInfo: "시스템 정보",
                },
                msgAlreadyUse: "현재 사용 중인 단축키 입니다.",
                askInitPopup: "팝업창 위치/사이즈 초기화를 하시겠습니까?",
                askISavePopup: "현재 팝업창 위치/사이즈를 저장하시겠습니까?",
                askInitUserPopup: "팝업창 위치/사이즈를 사용자 저장 값으로 초기화를 하시겠습니까?",
                failLoadTryAgain: "유저 정보를 불러오지 못했습니다. 다시 시도해주세요.",
                zeroNotAllow: "0 은 입력할 수 없습니다.",
                onlyExcel: "엑셀 파일(xls, xlsx)만 업로드 가능합니다.",
                maxSize: "최대 10MB 엑셀 파일을 업로드 할 수 있습니다.",
                bUpdate: "건물 정보 업데이트",
                bgUpdate: "건물 그룹 정보 업데이트",
                fUpdate: "설비 정보 업데이트",
                bUpdownload: "건물 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)",
                bgUpdownload: "건물그룹 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)",
                fUpdownload: "설비 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)",
                upload: "업로드",
                download: "다운로드",
                rotationWaitTime: "3D 회전 대기시간",
                rotationWaitTimeDesc: "3D 회전 대기시간을 설정 합니다.",
                min: "분",
                useAutoRotation: "자동회전 사용",
                alarmRotation: "알람시 회전기능",
                alarmRotationDesc: "알람 발생시 회전기능 사용여부",
                use: "사용",
                notUse: "사용안함",
                initPopup: "팝업창 위치/사이즈 초기화",
                initPopupDesc: "팝업창 위치 및 사이즈를 초기화 합니다.",
                systemDefault: "시스템 기본값",
                userSet: "사용자 설정",
                userDefault: "사용자 기본값",
                setShortcutKey: "단축키 설정",
                setShortcutKeyDesc: "단위 시스템 불러오기 단축키 기능을 설정 합니다."
            }

        },
        "en": {
            menu:
            {
                monitoring3D: "3D control system",
                dashboardSet: "Dashboard",
                sopSet: "SOP environment",
                sopLinkSet: "Connect SOP",
                teamEditor: "Organization management",
                systemInfo: "System information",
                userOption: "User option"
            },
            shortcutKey:
            {
                sdms: "3D control system",
                history: "History",
                sop: "Execute SOP",
                sopMgr: "Edit SOP",
                teamEdit: "Organization management",
                dashBoard: "Dashboard",
                settings: "Settings",
                home: "Home button",
                rotation: "Instant rotation",
            },
            excelMode:
            {
                building: "Building information update",
                group: "Building group information update",
                facility: "Facility information update",
                regularTeam: "Organization information update"
            },

            textDashboardSet: {
                normal: "General",
                setDate: "Set display data period",
                setDateMsg: "Setting the display data period",
                setDefault: "Change to default",
                today: "Today",
                week: "1 week",
                month: "1 month"
            },
            textLayoutSetting: {
                loading: "Loading settings",
                bUploadFail: "Building information upload failed : ",
                bgUploadFail: "Building group information upload failed : ",
                bgUploadFail: "Facility information upload failed : ",
                rUploadFail: "Organization information upload failed : ",
                askChgInfoSave: "Something has changed. Should I save it?",
                chgSave: "Saving the detail change",
                chgNotSave: "Cancel the changed detail",
                envSet: "Preferences"
            },
            textMonitoring3D: {
                normal: "General",
                spread: "Initial situation propagation management",
                detection: "Sensor detection management",
                onlyExcel: "Upload file in excel format (xls, xlsx) only.",
                fileSizeOver: "Maximum 10MB excel file can be uploaded",
                upload: "Upload",
                download: "Download",
                bUploadDesc: "Upload building information / download (max 10MB)",
                bgUploadDesc: "Upload building group information / download (max 10MB)",
                fUploadDesc: "Upload facility information / download (max 10MB)",
                poiHighlight: "POI Highlight",
                poiHighlightDesc: "When selecting a POI, set whether to enlarge the selected POI and POIs in the same place",
                use: "Use",
                notUse: "Do not use",
                setSmsEmail: "Send text / email settings",
                msgSetSmsEmail: "Set text/ email options",
                all: "Entire",
                setReceiver: "Designation of transmission target",
                sms: "Text message",
                email: "E-mail",
                receiver: "Recipient",
                specialCharDesc: "Description for special characters",
                disasterLoc: "Location of disaster",
                disasterDate: "Disaster occurrence time",
                msgAllApply: "Applied equally to all disaster types",
                allApply: "Apply equally to all disaster types",
                apply: "Apply",
                tempSave: "Save temporarily",
                receive: "Reception",
                displayEvt: "Show event area",
                displayEvtDesc: "To set display event-related area",
                setAlarmReceive: "Alarm recipient settings by type",
                setAlarmReceiveDesc: "Set notifications by type",
                setAutoEvtScreen: "Event automatic screen transition",
                setAutoEvtScreenDesc: "Set whether to automatically switch screens during events",
                noChg: "Maintain current screen",
                moveFirst: "Move to the first notification screen",
                moveLast: "Move to the last notification screen",
                alarmBroadcast: "Broadcast alarm",
                alarmBroadcastDesc: "Broadcast disaster automatically if the alarm occurs",
                evtFocusing: "Focusing event",
                evtFocusingDesc: "Focusing event",
            },
            textSelectReceiver: {
                all: "Entire",
                editReceiver: "Edit recipient",
                type: "Category",
                location: "Location",
                member: "Team member",
                name: "Name"
            },
            textSopLink: {
                apply: "Apply",
                location: "Location",
                sensorType: "Sensor type",
                sopList: "Lists of SOP (Disaster area / types of the disaster / name of the SOP)",
                location2: "Location (Factory/Building/Floor)",
                disasterCategory: "Disaster field",
                disasterType: "Type of disaster",
                sopName: "name of the SOP",
                delete: "Delete"
            },
            textSopSet: {
                normal: "General",
                highRank: "Advanced",
                msgAutoMoveDesc: "Set automatic screen movement of components",
                msgAutoMove: "Automatic screen movement to running component",
                msgSpreadOptionDesc: "Set context propagation options",
                useBroadcast: "Use broadcasting airwaves",
                useSms: "Use text message",
                useEmail: "Use email sedings",
                useConfirm: "Go through verification steps when propagating a situation",
                setTime: "Time settings",
                msgSetTimeDesc: "Set the time setting options",
                weekdays: "Weekday daytime hours",
                fromMin: "From 00 hour 00 minutes",
                toMin: "To 00 hour to 00 minutes",
                closeWaitSOP: "Automatic shut down of standby SOP",
                closeWaitSOPDesc: "Set automatic shut down of standby SOP",
                allApply: "Apply all",
                sec: "Sec",
                min: "Min",
                hour: "Hour",
                autoClose: "Automatic shut down",
                confirmAutoClose: "Automatically close after confirmation",
                notClose: "Do not close",
                notEnteredDuring: "If no input is entered for 00 minutes",
                closeSignalRecovery: "Automatically shut down when sensor signal is restored",
                closeSignalRecoveryDesc: "Setting the automatic shut down when sensor signal is restored",
                closeSignalRecoveryAter: "After restoring the sensor signal",
                after: "Back",
                setResultSummary: "Set result summary window",
                setResultSummaryDesc: "Setting the SOP result summary window",
                resultSummary: "SOP result summary window"
            },
            textSystemInfo: {
                vInfo: "Version Information",
                vInfoDesc: "Current system version information",
                cInfo: "Product supplier information",
                cInfoDesc: "Product supply company information",
                cAdr: "UNI Co., Ltd. (1st floor, Juyeon Building, 345 Cheongpa-ro, Yongsan-gu, Seoul)",
                supportCenter: "Customer Support Center",
                supportCenterDesc: "Customer Support Center phone number",
                maintenance: "Maintenance information",
                maintenanceDesc: "System maintenance information",
                maintenanceContent: "Free maintenance period for one year (from the initial installation date)"
            },
            textTeamEditor: {
                onlyExcel: "Upload file in excel format (xls, xlsx) only.",
                maxSize: "Maximum 10MB excel file can be uploaded",
                normal: "General",
                updateTeam: "Organization information update",
                updateTeamDesc: "Upload organization information / download (max 10MB)",
                upload: "Upload",
                download: "Download"
            },
            textUserOption: {
                mode: {
                    normal: "General",
                    systemInfo: "System information",
                },
                msgAlreadyUse: "This is the shortcut key currently in use",
                askInitPopup: "Would you like to reset the pop-up window positon / size?",
                askISavePopup: "Would you like to save the pop-up window position / size?",
                askInitUserPopup: "Do you want to reset the pop-up window position/size to the user's saved value?",
                failLoadTryAgain: "Failed to load user information. Please try again.",
                zeroNotAllow: "Can't insert 0",
                onlyExcel: "Upload file in excel format (xls, xlsx) only.",
                maxSize: "Maximum 10MB excel file can be uploaded",
                bUpdate: "Building information update",
                bgUpdate: "Building group information update",
                fUpdate: "Facility information update",
                bUpdownload: "Upload building information / download (max 10MB)",
                bgUpdownload: "Upload building group information / download (max 10MB)",
                fUpdownload: "Upload facility information / download (max 10MB)",
                upload: "Upload",
                download: "Download",
                rotationWaitTime: "3D rotation wait time",
                rotationWaitTimeDesc: "Set the 3D rotation wait time",
                min: "Min",
                useAutoRotation: "Use auto rotation",
                alarmRotation: "Rotation function upon alarm",
                alarmRotationDesc: "Whether to use the rotation function upon alarm",
                use: "Use",
                notUse: "Do not use",
                initPopup: "Pop-up location / size reset",
                initPopupDesc: "Reset the pop-up window position and size",
                systemDefault: "System default",
                userSet: "User Set",
                userDefault: "User Default",
                setShortcutKey: "Shortcut key settings",
                setShortcutKeyDesc: "Set the shortcut key feature for loading unit system"
            }
        }
    } */

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

    static deleteOption = {
        deleteAll: 0,           // 전체 삭제
        archiveDelete: 1        // 압축보관 후 삭제
    }
}