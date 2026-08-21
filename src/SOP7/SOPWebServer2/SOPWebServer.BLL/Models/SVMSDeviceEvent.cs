using System.Collections.Generic;
using SDMS.Model.Spatial;

namespace SOPWebServer.BLL.Models
{
    public class SVMSDeviceEvent
    {
        private static Dictionary<int, string> m_dicDeviceList = new Dictionary<int, string>();
        private static Dictionary<int, SVMSDeviceEventData> m_dicEvents = new Dictionary<int, SVMSDeviceEventData>();

        public static string GetDeviceName(int key)
        {
            if (m_dicDeviceList.Count == 0)
            {
                AddDeviceList();
            }

            string strDeviceName = null;

            if (m_dicDeviceList.TryGetValue(key, out strDeviceName))
                return strDeviceName;

            return null;
        }

        public static SVMSDeviceEventData GetEventData(int key)
        {
            if (m_dicEvents.Count == 0)
            {
                AddEventData();
            }

            SVMSDeviceEventData eventData = null;

            if (m_dicEvents.TryGetValue(key, out eventData))
                return eventData;

            return null;
        }

        public static string GetAlarmMessage(EquipmentZone equipZone, int alarmCode, int deviceCode, bool isReal)
        {
            SVMSDeviceEventData eventData = GetEventData(alarmCode);
            string strDeviceName = GetDeviceName(deviceCode);

            if (eventData == null || strDeviceName == null)
                return null;

            string strEquipZoneName = equipZone.DisplayText != null && equipZone.DisplayText.Trim().Length > 0 ? equipZone.DisplayText.Trim() : equipZone.ZoneName;

            string strTag = isReal ? "" : "[테스트]";
            return string.Format("{3}[{0}]에서 {1} {2} 이벤트가 발생하였습니다.", strEquipZoneName, strDeviceName, eventData.GroupName, strTag);
        }

        private static void AddEventData()
        {
            m_dicEvents[1] = new SVMSDeviceEventData(1, "지능형 알람", "카메라무력화");
            m_dicEvents[2] = new SVMSDeviceEventData(2, "지능형 알람", "침입");
            m_dicEvents[3] = new SVMSDeviceEventData(3, "지능형 알람", "배회");
            m_dicEvents[4] = new SVMSDeviceEventData(4, "지능형 알람", "쓰러짐");
            m_dicEvents[5] = new SVMSDeviceEventData(5, "지능형 알람", "역방향");
            m_dicEvents[6] = new SVMSDeviceEventData(6, "지능형 알람", "도난");
            m_dicEvents[7] = new SVMSDeviceEventData(7, "지능형 알람", "방치");
            m_dicEvents[8] = new SVMSDeviceEventData(8, "지능형 알람", "가상펜스");
            m_dicEvents[9] = new SVMSDeviceEventData(9, "지능형 알람", "비감시영역");
            m_dicEvents[10] = new SVMSDeviceEventData(10, "지능형 알람", "이동자계수");
            m_dicEvents[11] = new SVMSDeviceEventData(11, "지능형 알람", "PTZ");
            m_dicEvents[12] = new SVMSDeviceEventData(12, "지능형 알람", "프라이버시");
            m_dicEvents[13] = new SVMSDeviceEventData(13, "지능형 알람", "파노라마");
            m_dicEvents[14] = new SVMSDeviceEventData(14, "지능형 알람", "얼굴검출");
            m_dicEvents[15] = new SVMSDeviceEventData(15, "지능형 알람", "흔들림감지");
            m_dicEvents[16] = new SVMSDeviceEventData(16, "지능형 알람", "이상행동감지");
            m_dicEvents[17] = new SVMSDeviceEventData(17, "지능형 알람", "군중감시");
            m_dicEvents[18] = new SVMSDeviceEventData(18, "지능형 알람", "PTZ추적감시");
            m_dicEvents[19] = new SVMSDeviceEventData(19, "지능형 알람", "주정차 감시");
            m_dicEvents[20] = new SVMSDeviceEventData(20, "지능형 알람", "불법출입 감시");
            m_dicEvents[100] = new SVMSDeviceEventData(100, "지능형 알람", "화재감시");
            m_dicEvents[101] = new SVMSDeviceEventData(101, "지능형 알람", "번호판인식");
            m_dicEvents[200] = new SVMSDeviceEventData(200, "지능형 알람", "Alarm In 1");
            m_dicEvents[201] = new SVMSDeviceEventData(201, "지능형 알람", "Alarm In 2");
            m_dicEvents[202] = new SVMSDeviceEventData(202, "지능형 알람", "Alarm In 3");
            m_dicEvents[203] = new SVMSDeviceEventData(203, "지능형 알람", "Alarm In 4");
            m_dicEvents[204] = new SVMSDeviceEventData(204, "지능형 알람", "Alarm In 5");
            m_dicEvents[205] = new SVMSDeviceEventData(205, "지능형 알람", "Alarm In 6");
            m_dicEvents[206] = new SVMSDeviceEventData(206, "지능형 알람", "Alarm In 7");
            m_dicEvents[207] = new SVMSDeviceEventData(207, "지능형 알람", "Alarm In 8");
            m_dicEvents[300] = new SVMSDeviceEventData(300, "지능형 알람", "사이즈필터");
            m_dicEvents[301] = new SVMSDeviceEventData(301, "지능형 알람", "비감시영역");
            m_dicEvents[302] = new SVMSDeviceEventData(302, "지능형 알람", "안개제거");
            m_dicEvents[98] = new SVMSDeviceEventData(98, "지능형 알람", "비명감시");
            m_dicEvents[99] = new SVMSDeviceEventData(99, "지능형 알람", "움직임검출");
            m_dicEvents[21] = new SVMSDeviceEventData(21, "지능형 알람", "달리기");
            m_dicEvents[22] = new SVMSDeviceEventData(22, "지능형 알람", "이종복장");
            m_dicEvents[40] = new SVMSDeviceEventData(40, "지능형 알람", "FMCS_UT");
            m_dicEvents[41] = new SVMSDeviceEventData(41, "지능형 알람", "FMCS_GREEN");
            m_dicEvents[42] = new SVMSDeviceEventData(42, "지능형 알람", "FMCS_GCS");
            m_dicEvents[43] = new SVMSDeviceEventData(43, "지능형 알람", "카메라 정상");
            m_dicEvents[44] = new SVMSDeviceEventData(44, "지능형 알람", "카메라 조도이상");
            m_dicEvents[45] = new SVMSDeviceEventData(45, "지능형 알람", "카메라 포커스이상");
            m_dicEvents[51] = new SVMSDeviceEventData(51, "지능형 알람", "실내 보호구 벗기");
            m_dicEvents[52] = new SVMSDeviceEventData(52, "지능형 알람", "위험물 굴리기");
            m_dicEvents[53] = new SVMSDeviceEventData(53, "지능형 알람", "위험물 밀기");
            m_dicEvents[54] = new SVMSDeviceEventData(54, "지능형 알람", "실외 보호구 벗기");
            m_dicEvents[55] = new SVMSDeviceEventData(55, "지능형 알람", "안전모 미착용");
            m_dicEvents[58] = new SVMSDeviceEventData(58, "지능형 알람", "수감자 부재");
            m_dicEvents[63] = new SVMSDeviceEventData(63, "지능형 알람", "잔류자");
            m_dicEvents[64] = new SVMSDeviceEventData(64, "지능형 알람", "난동");
            m_dicEvents[65] = new SVMSDeviceEventData(65, "지능형 알람", "온도측정");
            m_dicEvents[66] = new SVMSDeviceEventData(66, "지능형 알람", "수화물이동감지");
            m_dicEvents[70] = new SVMSDeviceEventData(70, "지능형 알람", "군집");
            m_dicEvents[71] = new SVMSDeviceEventData(71, "지능형 알람", "SOS_도움요청");
            m_dicEvents[72] = new SVMSDeviceEventData(72, "지능형 알람", "SOS_비상상황");
            m_dicEvents[73] = new SVMSDeviceEventData(73, "지능형 알람", "SOS_비상용품");
            m_dicEvents[74] = new SVMSDeviceEventData(74, "지능형 알람", "SOS_비상완료");
            m_dicEvents[75] = new SVMSDeviceEventData(75, "지능형 알람", "SOS_작업중단");
            m_dicEvents[25] = new SVMSDeviceEventData(25, "지능형 알람", "정지차량감지");
            m_dicEvents[26] = new SVMSDeviceEventData(26, "지능형 알람", "낙하물감지");
            m_dicEvents[27] = new SVMSDeviceEventData(27, "지능형 알람", "역주행감지");
            m_dicEvents[28] = new SVMSDeviceEventData(28, "지능형 알람", "보행자감지");
            m_dicEvents[102] = new SVMSDeviceEventData(102, "지능형 알람", "연기감지");
            m_dicEvents[30] = new SVMSDeviceEventData(30, "지능형 알람", "블랙리스트");
            m_dicEvents[32] = new SVMSDeviceEventData(32, "지능형 알람", "군복미착용");
            m_dicEvents[60] = new SVMSDeviceEventData(60, "지능형 알람", "들어감");
            m_dicEvents[61] = new SVMSDeviceEventData(61, "지능형 알람", "나감");
            m_dicEvents[62] = new SVMSDeviceEventData(62, "지능형 알람", "나타남/사라짐");
            m_dicEvents[199] = new SVMSDeviceEventData(199, "지능형 알람", "오디오감지");
            m_dicEvents[900] = new SVMSDeviceEventData(900, "논리알람", "Attention알람");
            m_dicEvents[1000] = new SVMSDeviceEventData(1000, "시스템 장애", "시스템 통신 이상 복구");
            m_dicEvents[1001] = new SVMSDeviceEventData(1001, "시스템 장애", "시스템 통신 이상");
            m_dicEvents[1002] = new SVMSDeviceEventData(1002, "시스템 장애", "CPU 사용량 초과");
            m_dicEvents[1003] = new SVMSDeviceEventData(1003, "시스템 장애", "네트워크 사용량 초과");
            m_dicEvents[1004] = new SVMSDeviceEventData(1004, "시스템 장애", "메모리 사용량 초과");
            m_dicEvents[1005] = new SVMSDeviceEventData(1005, "시스템 장애", "디스크 사용량 초과");
            m_dicEvents[1006] = new SVMSDeviceEventData(1006, "시스템 장애", "디스크 읽기 오류");
            m_dicEvents[1007] = new SVMSDeviceEventData(1007, "시스템 장애", "디스크 쓰기 오류");
            m_dicEvents[1100] = new SVMSDeviceEventData(1100, "알람입출력", "DIO 알람");
            m_dicEvents[1101] = new SVMSDeviceEventData(1101, "알람입출력", "IR");
            m_dicEvents[1102] = new SVMSDeviceEventData(1102, "알람입출력", "Entrance");
            m_dicEvents[1103] = new SVMSDeviceEventData(1103, "알람입출력", "Tension");
            m_dicEvents[1104] = new SVMSDeviceEventData(1104, "알람입출력", "UWB");
            m_dicEvents[1105] = new SVMSDeviceEventData(1105, "알람입출력", "radio");
            m_dicEvents[1106] = new SVMSDeviceEventData(1106, "알람입출력", "radar");
            m_dicEvents[1300] = new SVMSDeviceEventData(1300, "S1 페이스체크", "FMS 얼굴인식");
            m_dicEvents[1301] = new SVMSDeviceEventData(1301, "S1 페이스체크", "FMS 얼굴인식[출입승인]");
            m_dicEvents[1302] = new SVMSDeviceEventData(1302, "S1 페이스체크", "FMS 얼굴인식[출입거부]");
            m_dicEvents[1400] = new SVMSDeviceEventData(1400, "이레시즈 비상벨", "비상벨 ON");
            m_dicEvents[1401] = new SVMSDeviceEventData(1401, "이레시즈 비상벨", "비상벨 OFF");
            m_dicEvents[1500] = new SVMSDeviceEventData(1500, "조계종 센서류", "불꽃 감지");
            m_dicEvents[1501] = new SVMSDeviceEventData(1501, "조계종 센서류", "온도 감지");
            m_dicEvents[1502] = new SVMSDeviceEventData(1502, "조계종 센서류", "연기 감지");
            m_dicEvents[1503] = new SVMSDeviceEventData(1503, "조계종 센서류", "온도 차동 감지");
            m_dicEvents[1504] = new SVMSDeviceEventData(1504, "조계종 센서류", "연기 차동 감지");
            m_dicEvents[1505] = new SVMSDeviceEventData(1505, "조계종 센서류", "방범 감지");
            m_dicEvents[1506] = new SVMSDeviceEventData(1506, "조계종 센서류", "비상 전원");
            m_dicEvents[1507] = new SVMSDeviceEventData(1507, "조계종 센서류", "습도");
            m_dicEvents[1508] = new SVMSDeviceEventData(1508, "조계종 센서류", "온도");
            m_dicEvents[1509] = new SVMSDeviceEventData(1509, "조계종 센서류", "가스");
            m_dicEvents[1510] = new SVMSDeviceEventData(1510, "조계종 센서류", "물체 이동");
            m_dicEvents[1520] = new SVMSDeviceEventData(1520, "조계종 센서류", "배전반 이상");
            m_dicEvents[1600] = new SVMSDeviceEventData(1600, "레이더", "레이더 감지");
            m_dicEvents[1700] = new SVMSDeviceEventData(1700, "광망", "광망펜스 감지");
            m_dicEvents[1701] = new SVMSDeviceEventData(1701, "광망", "광망입력 감지");
            m_dicEvents[1710] = new SVMSDeviceEventData(1710, "광망", "광망펜스 단선");
            m_dicEvents[1711] = new SVMSDeviceEventData(1711, "광망", "광망 케이스 열림");
            m_dicEvents[1800] = new SVMSDeviceEventData(1800, "시스템", "Failover 인계 시작");
            m_dicEvents[1801] = new SVMSDeviceEventData(1801, "시스템", "Failover 인계 종료");
            m_dicEvents[1802] = new SVMSDeviceEventData(1802, "시스템", "Failover 미디어 전송 시작");
            m_dicEvents[1803] = new SVMSDeviceEventData(1803, "시스템", "Failover 미디어 전송 완료");
            m_dicEvents[1804] = new SVMSDeviceEventData(1804, "시스템", "Failover 미디어 전송 중지");
            m_dicEvents[1805] = new SVMSDeviceEventData(1805, "시스템", "Failover 미디어 전송 진행중");
            m_dicEvents[1900] = new SVMSDeviceEventData(1900, "V2서버", "문 열림");
            m_dicEvents[1901] = new SVMSDeviceEventData(1901, "V2서버", "문 닫힘");
            m_dicEvents[1902] = new SVMSDeviceEventData(1902, "V2서버", "기기이상");
            m_dicEvents[1903] = new SVMSDeviceEventData(1903, "V2서버", "강제 문열림");
            m_dicEvents[1904] = new SVMSDeviceEventData(1904, "V2서버", "재실자 감지");
            m_dicEvents[1910] = new SVMSDeviceEventData(1910, "V2서버", "출입허가");
            m_dicEvents[1911] = new SVMSDeviceEventData(1911, "V2서버", "출입불가");
            m_dicEvents[1912] = new SVMSDeviceEventData(1912, "V2서버", "출입실패");
            m_dicEvents[1913] = new SVMSDeviceEventData(1913, "V2서버", "취식허가");
            m_dicEvents[1914] = new SVMSDeviceEventData(1914, "V2서버", "취식불가");
            m_dicEvents[1915] = new SVMSDeviceEventData(1915, "V2서버", "방범불가");
            m_dicEvents[1920] = new SVMSDeviceEventData(1920, "V2서버", "방범");
            m_dicEvents[1921] = new SVMSDeviceEventData(1921, "V2서버", "가스");
            m_dicEvents[1922] = new SVMSDeviceEventData(1922, "V2서버", "화재");
            m_dicEvents[1923] = new SVMSDeviceEventData(1923, "V2서버", "비상");
            m_dicEvents[1050] = new SVMSDeviceEventData(1050, "장력센서", "장력 케이스 열림");
            m_dicEvents[1051] = new SVMSDeviceEventData(1051, "장력센서", "장력 CH1 라인감지");
            m_dicEvents[1052] = new SVMSDeviceEventData(1052, "장력센서", "장력 CH1 펜스감지");
            m_dicEvents[1053] = new SVMSDeviceEventData(1053, "장력센서", "장력 CH2 라인감지");
            m_dicEvents[1054] = new SVMSDeviceEventData(1054, "장력센서", "장력 CH2 펜스감지");
            m_dicEvents[1055] = new SVMSDeviceEventData(1055, "장력센서", "장력 통신 이상");
            m_dicEvents[1056] = new SVMSDeviceEventData(1056, "장력센서", "장력 알람 발생");
            m_dicEvents[5100] = new SVMSDeviceEventData(5100, "엘리베이터", "엘리베이터 이상감지");
            m_dicEvents[5200] = new SVMSDeviceEventData(5200, "동방전자 화재수신반", "화재수신반 이상감지");
            m_dicEvents[5300] = new SVMSDeviceEventData(5300, "시스매니아 비상벨", "비상벨 이상감지");
            m_dicEvents[5400] = new SVMSDeviceEventData(5400, "아마노 주차관제 시스템", "주차관제 미등록차량감지");
            m_dicEvents[5401] = new SVMSDeviceEventData(5401, "아마노 주차관제 시스템", "주차관제 VIP차량입차");
            m_dicEvents[5402] = new SVMSDeviceEventData(5402, "아마노 주차관제 시스템", "주차관제 VIP차량출차");
            m_dicEvents[5403] = new SVMSDeviceEventData(5403, "아마노 주차관제 시스템", "주차관제 블랙리스트차량입차");
            m_dicEvents[5404] = new SVMSDeviceEventData(5404, "아마노 주차관제 시스템", "주차관제 블랙리스트차량출차");
            m_dicEvents[5500] = new SVMSDeviceEventData(5500, "이상음원", "차량사고");
            m_dicEvents[5501] = new SVMSDeviceEventData(5501, "이상음원", "차량경적");
            m_dicEvents[5502] = new SVMSDeviceEventData(5502, "이상음원", "폭발음");
            m_dicEvents[5503] = new SVMSDeviceEventData(5503, "이상음원", "유리창파손");
            m_dicEvents[5504] = new SVMSDeviceEventData(5504, "이상음원", "비명");
            m_dicEvents[5600] = new SVMSDeviceEventData(5600, "군후방용 레이더", "레이더존 감지");
            m_dicEvents[5601] = new SVMSDeviceEventData(5601, "군후방용 레이더", "레이더 템퍼 감지");
            m_dicEvents[5700] = new SVMSDeviceEventData(5700, "출입통제", "출입허가");
            m_dicEvents[5701] = new SVMSDeviceEventData(5701, "출입통제", "출입불가");
            m_dicEvents[5800] = new SVMSDeviceEventData(5800, "열화상시스템", "화재 알람");
            m_dicEvents[1010] = new SVMSDeviceEventData(1010, "시스템 장애", "시스템 장애");
            m_dicEvents[2000] = new SVMSDeviceEventData(2000, "시스템 장애", "서버 구동");
            m_dicEvents[2001] = new SVMSDeviceEventData(2001, "시스템 장애", "서버 정지");
            m_dicEvents[2002] = new SVMSDeviceEventData(2002, "시스템 장애", "장치 시작");
            m_dicEvents[2003] = new SVMSDeviceEventData(2003, "시스템 장애", "장치 중지");
            m_dicEvents[2004] = new SVMSDeviceEventData(2004, "시스템 장애", "CPU 권장 사용량(70%) 초과");
            m_dicEvents[2005] = new SVMSDeviceEventData(2005, "시스템 장애", "CPU 사용량 정상");
            m_dicEvents[2006] = new SVMSDeviceEventData(2006, "시스템 장애", "네트워크 권장 사용량(70%) 초과");
            m_dicEvents[2007] = new SVMSDeviceEventData(2007, "시스템 장애", "네트워크 사용량 정상");
            m_dicEvents[2008] = new SVMSDeviceEventData(2008, "시스템 장애", "메모리 권장 사용량(70%) 초과");
            m_dicEvents[2009] = new SVMSDeviceEventData(2009, "시스템 장애", "메모리 사용량 정상");
            m_dicEvents[2018] = new SVMSDeviceEventData(2018, "시스템 장애", "포트 접속 실패");
            m_dicEvents[2019] = new SVMSDeviceEventData(2019, "시스템 장애", "하드디스크 인식 불가");
            m_dicEvents[2020] = new SVMSDeviceEventData(2020, "시스템 장애", "영상저장 실패(하드디스크 저장공간 부족:10GB미만)");
            m_dicEvents[2021] = new SVMSDeviceEventData(2021, "시스템 장애", "영상저장 실패(하드디스크 저장공간 부족) 복구");
            m_dicEvents[2022] = new SVMSDeviceEventData(2022, "시스템 장애", "OS 사용자 권한 오류");
            m_dicEvents[2023] = new SVMSDeviceEventData(2023, "시스템 장애", "환경파일 쓰기 오류");
            m_dicEvents[2030] = new SVMSDeviceEventData(2030, "시스템 장애", "USB 동글 제거 오류");
            m_dicEvents[2040] = new SVMSDeviceEventData(2040, "시스템 장애", "일반 실패");
            m_dicEvents[2050] = new SVMSDeviceEventData(2050, "시스템 장애", "영상전송(RTSP) 포트 오픈 불가");
            m_dicEvents[2051] = new SVMSDeviceEventData(2051, "시스템 장애", "영상전송(RTSP) 포트 정상");
            m_dicEvents[2052] = new SVMSDeviceEventData(2052, "시스템 장애", "스냅샷 파일전송(FTP) 포트 오픈 불가");
            m_dicEvents[2053] = new SVMSDeviceEventData(2053, "시스템 장애", "스냅샷 파일전송(FTP) 포트 정상");
            m_dicEvents[2054] = new SVMSDeviceEventData(2054, "시스템 장애", "스냅샷 데이터 서버 포트 오픈 불가");
            m_dicEvents[2055] = new SVMSDeviceEventData(2055, "시스템 장애", "스냅샷 데이터서버 포트 정상");
            m_dicEvents[2056] = new SVMSDeviceEventData(2056, "시스템 장애", "페일오버(Failover) 포트 오픈 불가");
            m_dicEvents[2057] = new SVMSDeviceEventData(2057, "시스템 장애", "페일오버(Failover) 포트 정상");
            m_dicEvents[2058] = new SVMSDeviceEventData(2058, "시스템 장애", "영상 분석 오류");
            m_dicEvents[2059] = new SVMSDeviceEventData(2059, "시스템 장애", "영상 변환 오류");
            m_dicEvents[2060] = new SVMSDeviceEventData(2060, "시스템 장애", "서버 시간 동기화");
            m_dicEvents[2061] = new SVMSDeviceEventData(2061, "시스템 장애", "하드디스크 인식 불가 복구");
            m_dicEvents[2080] = new SVMSDeviceEventData(2080, "시스템 장애", "저장영상 삭제 실패");
            m_dicEvents[2081] = new SVMSDeviceEventData(2081, "시스템 장애", "저장 실패(하드디스크 저장공간 10GB미만) 지속발생");
            m_dicEvents[2082] = new SVMSDeviceEventData(2082, "시스템 장애", "영상저장 실패(OS미응답) 지속발생");
            m_dicEvents[2083] = new SVMSDeviceEventData(2083, "시스템 장애", "영상저장 실패(OS실패응답) 지속발생");
            m_dicEvents[2084] = new SVMSDeviceEventData(2084, "시스템 장애", "영상저장 실패(하드디스크 미인식)");
            m_dicEvents[2085] = new SVMSDeviceEventData(2085, "시스템 장애", "저장영상 삭제 실패 복구");
            m_dicEvents[2086] = new SVMSDeviceEventData(2086, "시스템 장애", "저장 실패(하드디스크 저장공간 부족) 지속발생 복구");
            m_dicEvents[2087] = new SVMSDeviceEventData(2087, "시스템 장애", "영상저장 실패(OS미응답) 지속발생 복구");
            m_dicEvents[2088] = new SVMSDeviceEventData(2088, "시스템 장애", "영상저장 실패(OS실패응답) 지속발생 복구");
            m_dicEvents[2089] = new SVMSDeviceEventData(2089, "시스템 장애", "영상저장 실패(하드디스크 미인식) 복구");
            m_dicEvents[2090] = new SVMSDeviceEventData(2090, "시스템 장애", "녹화 영상 로딩 시작");
            m_dicEvents[2091] = new SVMSDeviceEventData(2091, "시스템 장애", "녹화 영상 로딩 완료");
            m_dicEvents[2092] = new SVMSDeviceEventData(2092, "시스템 장애", "저장공간 부족(녹화 삭제)");
            m_dicEvents[2093] = new SVMSDeviceEventData(2093, "시스템 장애", "저장공간 확보(녹화 삭제 완료)");
            m_dicEvents[2094] = new SVMSDeviceEventData(2094, "시스템 장애", "녹화 상태 이상(미녹화)");
            m_dicEvents[3000] = new SVMSDeviceEventData(3000, "카메라 장애", "카메라 시작");
            m_dicEvents[3001] = new SVMSDeviceEventData(3001, "카메라 장애", "카메라 중지");
            m_dicEvents[3002] = new SVMSDeviceEventData(3002, "카메라 장애", "카메라 프로파일 시작");
            m_dicEvents[3003] = new SVMSDeviceEventData(3003, "카메라 장애", "카메라 프로파일 중지");
            m_dicEvents[3010] = new SVMSDeviceEventData(3010, "카메라 장애", "카메라 접속 실패");
            m_dicEvents[3011] = new SVMSDeviceEventData(3011, "카메라 장애", "카메라 포트 실패");
            m_dicEvents[3012] = new SVMSDeviceEventData(3012, "카메라 장애", "카메라 ID/PW 불일치");
            m_dicEvents[3013] = new SVMSDeviceEventData(3013, "카메라 장애", "카메라 사용자 접속 초과");
            m_dicEvents[3014] = new SVMSDeviceEventData(3014, "카메라 장애", "카메라 연결 해제 실패");
            m_dicEvents[3015] = new SVMSDeviceEventData(3015, "카메라 장애", "카메라 데이터 타임아웃 실패");
            m_dicEvents[3016] = new SVMSDeviceEventData(3016, "카메라 장애", "카메라 접속 경로(URL) 오류");
            m_dicEvents[3017] = new SVMSDeviceEventData(3017, "카메라 장애", "카메라 오디오 출력 미지원");
            m_dicEvents[3018] = new SVMSDeviceEventData(3018, "카메라 장애", "카메라 중복 서버 URL 실패");
            m_dicEvents[3019] = new SVMSDeviceEventData(3019, "카메라 장애", "카메라 제어 타임아웃 실패");
            m_dicEvents[3020] = new SVMSDeviceEventData(3020, "카메라 장애", "카메라 데이터 송신 오류");
            m_dicEvents[3021] = new SVMSDeviceEventData(3021, "카메라 장애", "카메라 오디오 미지원 오류");
            m_dicEvents[3022] = new SVMSDeviceEventData(3022, "카메라 장애", "카메라 움직임검출 미지원 오류");
            m_dicEvents[3023] = new SVMSDeviceEventData(3023, "카메라 장애", "카메라 DIO 미지원 오류");
            m_dicEvents[3024] = new SVMSDeviceEventData(3024, "카메라 장애", "카메라 영상저장 실패(OS미응답)");
            m_dicEvents[3025] = new SVMSDeviceEventData(3025, "카메라 장애", "카메라 영상저장 실패 복구");
            m_dicEvents[3030] = new SVMSDeviceEventData(3030, "카메라 장애", "카메라 미지원 미디어");
            m_dicEvents[3031] = new SVMSDeviceEventData(3031, "카메라 장애", "카메라 영상저장 실패(OS실패응답)");
            m_dicEvents[3032] = new SVMSDeviceEventData(3032, "카메라 장애", "카메라 파일 읽기 실패");
            m_dicEvents[3033] = new SVMSDeviceEventData(3033, "카메라 장애", "카메라 이벤트 녹화 오류");
            m_dicEvents[3034] = new SVMSDeviceEventData(3034, "카메라 장애", "카메라 RTSP 서버 Timeout 오류");
            m_dicEvents[3040] = new SVMSDeviceEventData(3040, "카메라 장애", "카메라 미지원 해상도 오류");
            m_dicEvents[3041] = new SVMSDeviceEventData(3041, "카메라 장애", "저장 에러");
            m_dicEvents[3042] = new SVMSDeviceEventData(3042, "카메라 장애", "카메라 FPS 이상");
            m_dicEvents[3043] = new SVMSDeviceEventData(3043, "카메라 장애", "카메라 FPS 이상 복구");
            m_dicEvents[3044] = new SVMSDeviceEventData(3044, "카메라 장애", "엣지스토리지 데이터 전송 시작");
            m_dicEvents[3045] = new SVMSDeviceEventData(3045, "카메라 장애", "엣지스토리지 데이터 전송 중지");
            m_dicEvents[3046] = new SVMSDeviceEventData(3046, "카메라 장애", "엣지스토리지 데이터 전송 종료");
            m_dicEvents[4001] = new SVMSDeviceEventData(4001, "기타 장애", "포트 접속");
            m_dicEvents[4002] = new SVMSDeviceEventData(4002, "기타 장애", "녹화 파일 위변조");
            m_dicEvents[5001] = new SVMSDeviceEventData(5001, "시스템 장애", "카메라 영상 끊김 오류");
            m_dicEvents[5010] = new SVMSDeviceEventData(5010, "시스템 장애", "서버 시간 동기화 실패");
            m_dicEvents[5011] = new SVMSDeviceEventData(5011, "시스템 장애", "최대 지원 카메라 초과");
            m_dicEvents[5012] = new SVMSDeviceEventData(5012, "시스템 장애", "카메라 녹화영상 일부 로딩실패");
            m_dicEvents[5021] = new SVMSDeviceEventData(5021, "카메라 장애", "엣지스토리지 미지원");
            m_dicEvents[5022] = new SVMSDeviceEventData(5022, "카메라 장애", "엣지 스토리지 데이터 없음");
            m_dicEvents[1750] = new SVMSDeviceEventData(1750, "센서웨이", "감지");
            m_dicEvents[1751] = new SVMSDeviceEventData(1751, "센서웨이", "통문");
            m_dicEvents[1070] = new SVMSDeviceEventData(1070, "이벤트이력", "IP 변경");
            m_dicEvents[1203] = new SVMSDeviceEventData(1203, "이벤트이력", "하드디스크 인식");
            m_dicEvents[1200] = new SVMSDeviceEventData(1200, "세콤듀얼", "출입자[승인]");
            m_dicEvents[1201] = new SVMSDeviceEventData(1201, "세콤듀얼", "출입자[거부]");
            m_dicEvents[1202] = new SVMSDeviceEventData(1202, "세콤듀얼", "문열림");
            m_dicEvents[1204] = new SVMSDeviceEventData(1204, "세콤듀얼", "장시간문열림(1분)");
            m_dicEvents[1220] = new SVMSDeviceEventData(1220, "세콤듀얼", "침입");
            m_dicEvents[1230] = new SVMSDeviceEventData(1230, "세콤듀얼", "비상");
            m_dicEvents[1231] = new SVMSDeviceEventData(1231, "세콤듀얼", "화재");
            m_dicEvents[1232] = new SVMSDeviceEventData(1232, "세콤듀얼", "설비이상");
            m_dicEvents[1205] = new SVMSDeviceEventData(1205, "세콤듀얼", "시정");
            m_dicEvents[1206] = new SVMSDeviceEventData(1206, "세콤듀얼", "해정");
            m_dicEvents[1207] = new SVMSDeviceEventData(1207, "세콤듀얼", "출입문 닫힘");
            m_dicEvents[1208] = new SVMSDeviceEventData(1208, "세콤듀얼", "출입문 열림");
            m_dicEvents[1209] = new SVMSDeviceEventData(1209, "세콤듀얼", "시정 닫힘");
            m_dicEvents[1210] = new SVMSDeviceEventData(1210, "세콤듀얼", "시정 열림");
            m_dicEvents[1211] = new SVMSDeviceEventData(1211, "세콤듀얼", "해정 닫힘");
            m_dicEvents[1212] = new SVMSDeviceEventData(1212, "세콤듀얼", "해정 열림");
            m_dicEvents[1213] = new SVMSDeviceEventData(1213, "세콤듀얼", "출입문 열림이상");
            m_dicEvents[1214] = new SVMSDeviceEventData(1214, "세콤듀얼", "장시간열림");
            m_dicEvents[1215] = new SVMSDeviceEventData(1215, "세콤듀얼", "강제개방");
            m_dicEvents[1216] = new SVMSDeviceEventData(1216, "세콤듀얼", "정상");
            m_dicEvents[1217] = new SVMSDeviceEventData(1217, "세콤듀얼", "일반침입1");
            m_dicEvents[1218] = new SVMSDeviceEventData(1218, "세콤듀얼", "일반침입2");
            m_dicEvents[1219] = new SVMSDeviceEventData(1219, "세콤듀얼", "내부침입");
            m_dicEvents[1222] = new SVMSDeviceEventData(1222, "세콤듀얼", "고객비상(C1)");
            m_dicEvents[1223] = new SVMSDeviceEventData(1223, "세콤듀얼", "고객비상(c1)");
            m_dicEvents[1224] = new SVMSDeviceEventData(1224, "세콤듀얼", "구급");
            m_dicEvents[1225] = new SVMSDeviceEventData(1225, "세콤듀얼", "가스");
            m_dicEvents[1226] = new SVMSDeviceEventData(1226, "세콤듀얼", "정전이상");
            m_dicEvents[1227] = new SVMSDeviceEventData(1227, "세콤듀얼", "누수이상");
            m_dicEvents[1228] = new SVMSDeviceEventData(1228, "세콤듀얼", "종합경보반이상");
            m_dicEvents[1229] = new SVMSDeviceEventData(1229, "세콤듀얼", "금고침입");
            m_dicEvents[1240] = new SVMSDeviceEventData(1240, "세콤듀얼", "기기뚜껑열림");
            m_dicEvents[1241] = new SVMSDeviceEventData(1241, "세콤듀얼", "BATT저전압");
            m_dicEvents[1242] = new SVMSDeviceEventData(1242, "세콤듀얼", "통신이상");
            m_dicEvents[1243] = new SVMSDeviceEventData(1243, "세콤듀얼", "프린터통신이상");
            m_dicEvents[1244] = new SVMSDeviceEventData(1244, "세콤듀얼", "정전");
            m_dicEvents[1245] = new SVMSDeviceEventData(1245, "세콤듀얼", "정전복구");
            m_dicEvents[1246] = new SVMSDeviceEventData(1246, "세콤듀얼", "BATT불량");
            m_dicEvents[1760] = new SVMSDeviceEventData(1760, "ELFAR 진동센서 이벤트", "알람");
            m_dicEvents[1761] = new SVMSDeviceEventData(1761, "ELFAR 진동센서 이벤트", "실패");
            m_dicEvents[1762] = new SVMSDeviceEventData(1762, "ELFAR 진동센서 이벤트", "정상");
            m_dicEvents[1763] = new SVMSDeviceEventData(1763, "ELFAR 진동센서 이벤트", "Technical 이벤트");
            m_dicEvents[1764] = new SVMSDeviceEventData(1764, "ELFAR 진동센서 이벤트", "System 이벤트");
            m_dicEvents[5900] = new SVMSDeviceEventData(5900, "NVR", "HDD 불량");
            m_dicEvents[5901] = new SVMSDeviceEventData(5901, "NVR", "팬 불량");
            m_dicEvents[5902] = new SVMSDeviceEventData(5902, "NVR", "온도 불량");
            m_dicEvents[5910] = new SVMSDeviceEventData(5910, "NVR 카메라", "모션 감지");
            m_dicEvents[5911] = new SVMSDeviceEventData(5911, "NVR 카메라", "DIO 입력");
            m_dicEvents[6000] = new SVMSDeviceEventData(6000, "아날로그 게이지", "게이지 이벤트");
            m_dicEvents[6001] = new SVMSDeviceEventData(6001, "아날로그 게이지", "배터리 오류");
            m_dicEvents[6002] = new SVMSDeviceEventData(6002, "아날로그 게이지", "게이지 복구");
            m_dicEvents[6010] = new SVMSDeviceEventData(6010, "비상벨", "비상벨 알람");
            m_dicEvents[1011] = new SVMSDeviceEventData(1011, "시스템 장애", "NMS 이벤트");
            m_dicEvents[2062] = new SVMSDeviceEventData(2062, "시스템 장애", "인터넷 연결 실패");
            m_dicEvents[2063] = new SVMSDeviceEventData(2063, "시스템 장애", "인터넷 연결 성공");
            m_dicEvents[6100] = new SVMSDeviceEventData(6100, "비상개폐장치", "비상버튼");
            m_dicEvents[6101] = new SVMSDeviceEventData(6101, "비상개폐장치", "비상신호");
            m_dicEvents[6102] = new SVMSDeviceEventData(6102, "비상개폐장치", "비상복구");
            m_dicEvents[6103] = new SVMSDeviceEventData(6103, "비상개폐장치", "문 열림");
            m_dicEvents[6104] = new SVMSDeviceEventData(6104, "비상개폐장치", "출입이상");
            m_dicEvents[76] = new SVMSDeviceEventData(76, "지능형 알람", "블랙리스트_차량");
            m_dicEvents[77] = new SVMSDeviceEventData(77, "지능형 알람", "미인가자");
            m_dicEvents[78] = new SVMSDeviceEventData(78, "지능형 알람", "미인가차량");
            m_dicEvents[303] = new SVMSDeviceEventData(303, "지능형 알람", "Defocus 감지");
            m_dicEvents[304] = new SVMSDeviceEventData(304, "지능형 알람", "안개감지");
            m_dicEvents[305] = new SVMSDeviceEventData(305, "지능형 알람", "이상음원감지");
            m_dicEvents[79] = new SVMSDeviceEventData(79, "지능형 알람", "VIP차량");
            m_dicEvents[80] = new SVMSDeviceEventData(80, "지능형 알람", "VIP얼굴");
            m_dicEvents[81] = new SVMSDeviceEventData(81, "지능형 알람", "인가차량");
            m_dicEvents[82] = new SVMSDeviceEventData(82, "지능형 알람", "인가자");
            m_dicEvents[3047] = new SVMSDeviceEventData(3047, "카메라 장애", "카메라 지능형검출 미지원 오류");
            m_dicEvents[6200] = new SVMSDeviceEventData(6200, "Dnet 근거리 레이더", "Dnet 레이더 감지");
            m_dicEvents[6300] = new SVMSDeviceEventData(6300, "ELTA 원거리 레이더", "ELTA 레이더 감지");
            m_dicEvents[6310] = new SVMSDeviceEventData(6310, "정맥인식", "출입승인(정맥인식)");
            m_dicEvents[6311] = new SVMSDeviceEventData(6311, "정맥인식", "출입거부(정맥인식)");
            m_dicEvents[6312] = new SVMSDeviceEventData(6312, "정맥인식", "강제문열림(정맥인식)");
            m_dicEvents[306] = new SVMSDeviceEventData(306, "지능형 알람", "화재감지기");
            m_dicEvents[307] = new SVMSDeviceEventData(307, "지능형 알람", "가스감지기");
            m_dicEvents[308] = new SVMSDeviceEventData(308, "지능형 알람", "누액감지기");
            m_dicEvents[309] = new SVMSDeviceEventData(309, "지능형 알람", "SDC_화재감시");
            m_dicEvents[310] = new SVMSDeviceEventData(310, "지능형 알람", "SDC_LEAK");
            m_dicEvents[6400] = new SVMSDeviceEventData(6400, "카카오 PBX 서버", "발신자ID");
            m_dicEvents[6500] = new SVMSDeviceEventData(6500, "카카오 주차단말기", "카카오 주차기기 이상");
            m_dicEvents[6600] = new SVMSDeviceEventData(6600, "관제중계서버", "침입");
            m_dicEvents[6601] = new SVMSDeviceEventData(6601, "관제중계서버", "화재");
            m_dicEvents[6602] = new SVMSDeviceEventData(6602, "관제중계서버", "비상");
            m_dicEvents[6603] = new SVMSDeviceEventData(6603, "관제중계서버", "가스");
            m_dicEvents[6604] = new SVMSDeviceEventData(6604, "관제중계서버", "설비");
            m_dicEvents[6605] = new SVMSDeviceEventData(6605, "관제중계서버", "회선단선");
            m_dicEvents[6606] = new SVMSDeviceEventData(6606, "관제중계서버", "기기(점검중)");
            m_dicEvents[6700] = new SVMSDeviceEventData(6700, "무인매장", "침입");
            m_dicEvents[6701] = new SVMSDeviceEventData(6701, "무인매장", "비상");
            m_dicEvents[6702] = new SVMSDeviceEventData(6702, "무인매장", "화재");
            m_dicEvents[6703] = new SVMSDeviceEventData(6703, "무인매장", "잔류자");
            m_dicEvents[6704] = new SVMSDeviceEventData(6704, "무인매장", "난동");
            m_dicEvents[6705] = new SVMSDeviceEventData(6705, "무인매장", "이상음원감지");
            m_dicEvents[6800] = new SVMSDeviceEventData(6800, "하이텍비상벨", "비상벨눌림");
            m_dicEvents[103] = new SVMSDeviceEventData(103, "지능형 알람", "PTZ 추적 시작");
            m_dicEvents[104] = new SVMSDeviceEventData(104, "지능형 알람", "PTZ 추적 중단");
            m_dicEvents[6900] = new SVMSDeviceEventData(6900, "스피드게이트", "기기이상");
            m_dicEvents[6901] = new SVMSDeviceEventData(6901, "스피드게이트", "부정출입");
            m_dicEvents[6902] = new SVMSDeviceEventData(6902, "스피드게이트", "강제개방");
            m_dicEvents[7000] = new SVMSDeviceEventData(7000, "휴엔홈넷", "비상발생");
            m_dicEvents[7001] = new SVMSDeviceEventData(7001, "휴엔홈넷", "비상해제");
            m_dicEvents[7002] = new SVMSDeviceEventData(7002, "휴엔홈넷", "방범발생");
            m_dicEvents[7003] = new SVMSDeviceEventData(7003, "휴엔홈넷", "방범해제");
            m_dicEvents[7004] = new SVMSDeviceEventData(7004, "휴엔홈넷", "화재발생");
            m_dicEvents[7005] = new SVMSDeviceEventData(7005, "휴엔홈넷", "화재해제");
            m_dicEvents[7006] = new SVMSDeviceEventData(7006, "휴엔홈넷", "가스발생");
            m_dicEvents[7007] = new SVMSDeviceEventData(7007, "휴엔홈넷", "가스해제");
            m_dicEvents[7008] = new SVMSDeviceEventData(7008, "휴엔홈넷", "외출");
            m_dicEvents[7009] = new SVMSDeviceEventData(7009, "휴엔홈넷", "재택");
            m_dicEvents[7010] = new SVMSDeviceEventData(7010, "휴엔홈넷", "재중");
            m_dicEvents[7011] = new SVMSDeviceEventData(7011, "휴엔홈넷", "미설정");
            m_dicEvents[7012] = new SVMSDeviceEventData(7012, "휴엔홈넷", "취침");
            m_dicEvents[7013] = new SVMSDeviceEventData(7013, "휴엔홈넷", "피난사다리");
            m_dicEvents[7014] = new SVMSDeviceEventData(7014, "휴엔홈넷", "구급");
            m_dicEvents[7015] = new SVMSDeviceEventData(7015, "휴엔홈넷", "금고");
            m_dicEvents[7100] = new SVMSDeviceEventData(7100, "제습기", "방폭센서온도이상");
            m_dicEvents[7101] = new SVMSDeviceEventData(7101, "제습기", "방폭센서습도이상");
            m_dicEvents[7102] = new SVMSDeviceEventData(7102, "제습기", "급기센서온도이상");
            m_dicEvents[7103] = new SVMSDeviceEventData(7103, "제습기", "급기센서습도이상");
            m_dicEvents[7104] = new SVMSDeviceEventData(7104, "제습기", "외기기센서온도이상");
            m_dicEvents[7105] = new SVMSDeviceEventData(7105, "제습기", "외기센서습도이상");
            m_dicEvents[7106] = new SVMSDeviceEventData(7106, "제습기", "재생센서온도이상");
            m_dicEvents[7107] = new SVMSDeviceEventData(7107, "제습기", "통합경보");
            m_dicEvents[7108] = new SVMSDeviceEventData(7108, "제습기", "외기센서");
            m_dicEvents[7109] = new SVMSDeviceEventData(7109, "제습기", "급기센서");
            m_dicEvents[7110] = new SVMSDeviceEventData(7110, "제습기", "방폭센서");
            m_dicEvents[7111] = new SVMSDeviceEventData(7111, "제습기", "비상정지");
            m_dicEvents[7112] = new SVMSDeviceEventData(7112, "제습기", "하론");
            m_dicEvents[7113] = new SVMSDeviceEventData(7113, "제습기", "에어 플로우");
            m_dicEvents[7114] = new SVMSDeviceEventData(7114, "제습기", "처리팬");
            m_dicEvents[7115] = new SVMSDeviceEventData(7115, "제습기", "재생히터");
            m_dicEvents[7116] = new SVMSDeviceEventData(7116, "제습기", "재생팬");
            m_dicEvents[7117] = new SVMSDeviceEventData(7117, "제습기", "메인팬");
            m_dicEvents[7118] = new SVMSDeviceEventData(7118, "제습기", "모터이상");
            m_dicEvents[7200] = new SVMSDeviceEventData(7200, "차량하부 검색기", "차량 입차(차량하부 검색기)");
            m_dicEvents[7201] = new SVMSDeviceEventData(7201, "차량하부 검색기", "이물질 검출(차량하부 검색기)");
            m_dicEvents[7320] = new SVMSDeviceEventData(7320, "S1 CLES", "방범");
            m_dicEvents[7321] = new SVMSDeviceEventData(7321, "S1 CLES", "가스");
            m_dicEvents[7322] = new SVMSDeviceEventData(7322, "S1 CLES", "화재");
            m_dicEvents[7323] = new SVMSDeviceEventData(7323, "S1 CLES", "비상");
            m_dicEvents[7324] = new SVMSDeviceEventData(7324, "S1 CLES", "신호 정상");
            m_dicEvents[7300] = new SVMSDeviceEventData(7300, "S1 CLES", "문 열림");
            m_dicEvents[7301] = new SVMSDeviceEventData(7301, "S1 CLES", "문 닫힘");
            m_dicEvents[7302] = new SVMSDeviceEventData(7302, "S1 CLES", "기기이상");
            m_dicEvents[7303] = new SVMSDeviceEventData(7303, "S1 CLES", "장시간 문 열림");
            m_dicEvents[7310] = new SVMSDeviceEventData(7310, "S1 CLES", "출입허가");
            m_dicEvents[7311] = new SVMSDeviceEventData(7311, "S1 CLES", "출입불가");
            m_dicEvents[7312] = new SVMSDeviceEventData(7312, "S1 CLES", "출입실패");
            m_dicEvents[7313] = new SVMSDeviceEventData(7313, "S1 CLES", "취식허가");
            m_dicEvents[7314] = new SVMSDeviceEventData(7314, "S1 CLES", "취식불가");
            m_dicEvents[7315] = new SVMSDeviceEventData(7315, "S1 CLES", "방범불가");
            m_dicEvents[7316] = new SVMSDeviceEventData(7316, "S1 CLES", "기기이상");
            m_dicEvents[7401] = new SVMSDeviceEventData(7401, "신영비상벨", "비상벨눌림");
            m_dicEvents[7800] = new SVMSDeviceEventData(7800, "이레씨즈 비상벨", "비상발생");
            m_dicEvents[7801] = new SVMSDeviceEventData(7801, "이레씨즈 비상벨", "비상해제");
            m_dicEvents[7802] = new SVMSDeviceEventData(7802, "이레씨즈 비상벨", "인터폰 ON");
            m_dicEvents[7803] = new SVMSDeviceEventData(7803, "이레씨즈 비상벨", "인터폰 OFF");
            m_dicEvents[7804] = new SVMSDeviceEventData(7804, "이레씨즈 비상벨", "센서 ON");
            m_dicEvents[7805] = new SVMSDeviceEventData(7805, "이레씨즈 비상벨", "센서 OFF");
            m_dicEvents[7806] = new SVMSDeviceEventData(7806, "이레씨즈 비상벨", "강제통화 ON");
            m_dicEvents[7807] = new SVMSDeviceEventData(7807, "이레씨즈 비상벨", "강제통화 OFF");
            m_dicEvents[7808] = new SVMSDeviceEventData(7808, "이레씨즈 비상벨", "팝업 ON");
            m_dicEvents[7809] = new SVMSDeviceEventData(7809, "이레씨즈 비상벨", "팝업 OFF");
            m_dicEvents[7500] = new SVMSDeviceEventData(7500, "S1 VideoWall", "모니터 출력이상 복구");
            m_dicEvents[7501] = new SVMSDeviceEventData(7501, "S1 VideoWall", "모니터 출력이상");
            m_dicEvents[7700] = new SVMSDeviceEventData(7700, "지멘스 화재시스템", "화재수신반 이상감지");
            m_dicEvents[7701] = new SVMSDeviceEventData(7701, "지멘스 화재시스템", "화재수신반 이상복구");
            m_dicEvents[7600] = new SVMSDeviceEventData(7600, "함체관리단말기", "강제개방");
            m_dicEvents[7900] = new SVMSDeviceEventData(7900, "V-Alert 진동센서", "밧데리 부족 경고");
            m_dicEvents[7901] = new SVMSDeviceEventData(7901, "V-Alert 진동센서", "밧데리 부족 정상");
            m_dicEvents[7902] = new SVMSDeviceEventData(7902, "V-Alert 진동센서", "통신 실패");
            m_dicEvents[7903] = new SVMSDeviceEventData(7903, "V-Alert 진동센서", "통신 정상");
            m_dicEvents[7904] = new SVMSDeviceEventData(7904, "V-Alert 진동센서", "통신 잘림");
            m_dicEvents[7905] = new SVMSDeviceEventData(7905, "V-Alert 진동센서", "접점입력 경보");
            m_dicEvents[7906] = new SVMSDeviceEventData(7906, "V-Alert 진동센서", "접점입력 정상");
            m_dicEvents[7907] = new SVMSDeviceEventData(7907, "V-Alert 진동센서", "함체 열림");
            m_dicEvents[7908] = new SVMSDeviceEventData(7908, "V-Alert 진동센서", "함체 닫힘");
            m_dicEvents[7909] = new SVMSDeviceEventData(7909, "V-Alert 진동센서", "프로세서 카드 접속 실패");
            m_dicEvents[7910] = new SVMSDeviceEventData(7910, "V-Alert 진동센서", "프로세서 카드 접속 정상");
            m_dicEvents[7911] = new SVMSDeviceEventData(7911, "V-Alert 진동센서", "침입경고");
            m_dicEvents[7912] = new SVMSDeviceEventData(7912, "V-Alert 진동센서", "케이블 잘림");
            m_dicEvents[8000] = new SVMSDeviceEventData(8000, "홈넷 게이트", "커터걸림");
            m_dicEvents[8001] = new SVMSDeviceEventData(8001, "홈넷 게이트", "덮개열림");
            m_dicEvents[8002] = new SVMSDeviceEventData(8002, "홈넷 게이트", "용지없음");
            m_dicEvents[8100] = new SVMSDeviceEventData(8100, "홈넷 APT App 서버", "APP 비상발생");
            m_dicEvents[8101] = new SVMSDeviceEventData(8101, "홈넷 APT App 서버", "APP 비상해제");
        }

        private static void AddDeviceList()
        {
            m_dicDeviceList[304] = "에스원 엑세스";
            m_dicDeviceList[305] = "DIO";
            m_dicDeviceList[306] = "세콤 듀얼";
            m_dicDeviceList[307] = "다중복합센서";
            m_dicDeviceList[308] = "BENIT";
            m_dicDeviceList[309] = "레이더";
            m_dicDeviceList[310] = "광망";
            m_dicDeviceList[311] = "V2 서버";
            m_dicDeviceList[312] = "장력";
            m_dicDeviceList[313] = "엘리베이터";
            m_dicDeviceList[314] = "화재 수신반";
            m_dicDeviceList[315] = "비상벨 시스템";
            m_dicDeviceList[316] = "주차관제 시스템";
            m_dicDeviceList[317] = "이상음원감지 장치";
            m_dicDeviceList[318] = "레이더 시스템";
            m_dicDeviceList[319] = "오디오 방송 장비";
            m_dicDeviceList[320] = "출입통제 시스템";
            m_dicDeviceList[321] = "오디오 방송 시스템";
            m_dicDeviceList[330] = "장력 센서";
            m_dicDeviceList[256] = "비상벨";
            m_dicDeviceList[402] = "에스원 엑세스 슬롯";
            m_dicDeviceList[403] = "DIO 슬롯";
            m_dicDeviceList[404] = "세콤 듀얼 슬롯";
            m_dicDeviceList[405] = "다중복합센서 슬롯";
            m_dicDeviceList[406] = "BENIT 슬롯";
            m_dicDeviceList[407] = "비상벨 슬롯";
            m_dicDeviceList[408] = "광통신 변환기";
            m_dicDeviceList[409] = "광망 컨트롤러";
            m_dicDeviceList[411] = "광망 구역";
            m_dicDeviceList[412] = "광망 입력";
            m_dicDeviceList[413] = "광망 출력";
            m_dicDeviceList[414] = "V2 장치";
            m_dicDeviceList[415] = "장력 센서";
            m_dicDeviceList[416] = "엘리베이터 슬롯";
            m_dicDeviceList[417] = "화재 수신반 슬롯";
            m_dicDeviceList[418] = "비상벨 시스템 슬롯";
            m_dicDeviceList[419] = "주차관제 슬롯";
            m_dicDeviceList[420] = "이상음원감지 장치 슬롯";
            m_dicDeviceList[421] = "레이더 센서";
            m_dicDeviceList[422] = "레이더 센서 구역";
            m_dicDeviceList[423] = "AMP";
            m_dicDeviceList[424] = "스피커";
            m_dicDeviceList[425] = "출입통제 리더기";
            m_dicDeviceList[426] = "장력 센서 구역";
            m_dicDeviceList[427] = "오디오 방송 장비";
            m_dicDeviceList[300000] = "Onvif 서버";
            m_dicDeviceList[305000] = "블루스토리 I/O";
            m_dicDeviceList[305001] = "블루스토리 I/O 입력 슬롯";
            m_dicDeviceList[305002] = "블루스토리 I/O 출력 슬롯";
            m_dicDeviceList[331000] = "AXIS I/O";
            m_dicDeviceList[331001] = "AXIS I/O 입력 슬롯";
            m_dicDeviceList[331002] = "AXIS I/O 출력 슬롯";
            m_dicDeviceList[332000] = "SOLLAE I/O";
            m_dicDeviceList[332001] = "SOLLAE I/O 입력 슬롯";
            m_dicDeviceList[332002] = "SOLLAE I/O 출력 슬롯";
            m_dicDeviceList[300] = "카메라";
            m_dicDeviceList[1] = "모자익뷰어";
            m_dicDeviceList[2] = "매니저클라이언트";
            m_dicDeviceList[4] = "스트리밍서버";
            m_dicDeviceList[8] = "트랜스코더서버";
            m_dicDeviceList[16] = "지능형서버";
            m_dicDeviceList[32] = "페이스체크";
            m_dicDeviceList[64] = "매니지먼트서버";
            m_dicDeviceList[128] = "디스플레이서버";
            m_dicDeviceList[4096] = "페일오버서버";
            m_dicDeviceList[8192] = "인텔리빅스서버";
            m_dicDeviceList[304000] = "에스원 엑세스";
            m_dicDeviceList[306000] = "세콤 듀얼";
            m_dicDeviceList[307000] = "다중복합센서";
            m_dicDeviceList[308000] = "BENIT";
            m_dicDeviceList[309000] = "레이더";
            m_dicDeviceList[310000] = "광망";
            m_dicDeviceList[311000] = "V2 서버";
            m_dicDeviceList[312000] = "장력";
            m_dicDeviceList[313000] = "엘리베이터";
            m_dicDeviceList[314000] = "화재 수신반";
            m_dicDeviceList[315000] = "비상벨 시스템";
            m_dicDeviceList[316000] = "주차관제 시스템";
            m_dicDeviceList[317000] = "이상음원감지 장치";
            m_dicDeviceList[318000] = "레이더 시스템";
            m_dicDeviceList[319000] = "오디오 방송 장비";
            m_dicDeviceList[320000] = "출입통제 시스템";
            m_dicDeviceList[321000] = "오디오 방송 시스템";
            m_dicDeviceList[330000] = "장력 센서";
            m_dicDeviceList[256000] = "비상벨";
            m_dicDeviceList[304001] = "에스원 엑세스 컨트롤러";
            m_dicDeviceList[304002] = "에스원 엑세스 출입문";
            m_dicDeviceList[304003] = "에스원 엑세스 리더";
            m_dicDeviceList[304004] = "에스원 엑세스 엘리베이터서버";
            m_dicDeviceList[304005] = "에스원 엑세스 방범";
            m_dicDeviceList[304006] = "에스원 엑세스 루프";
            m_dicDeviceList[304007] = "에스원 엑세스 엘리베이터";
            m_dicDeviceList[304008] = "에스원 엑세스 루프증설기";
            m_dicDeviceList[304009] = "에스원 엑세스 세콤마스터";
            m_dicDeviceList[306001] = "세콤 듀얼 슬롯";
            m_dicDeviceList[307001] = "다중복합센서 슬롯";
            m_dicDeviceList[308001] = "BENIT 슬롯";
            m_dicDeviceList[256001] = "비상벨 슬롯";
            m_dicDeviceList[310001] = "광통신 변환기";
            m_dicDeviceList[310002] = "광망 컨트롤러";
            m_dicDeviceList[310003] = "광망 구역";
            m_dicDeviceList[310004] = "광망 입력";
            m_dicDeviceList[310005] = "광망 출력";
            m_dicDeviceList[311001] = "V2 메인컨트롤러";
            m_dicDeviceList[311002] = "V2 로컬컨트롤러";
            m_dicDeviceList[311003] = "V2 도어";
            m_dicDeviceList[311004] = "V2 리더기";
            m_dicDeviceList[312001] = "장력 센서";
            m_dicDeviceList[313001] = "엘리베이터 슬롯";
            m_dicDeviceList[314001] = "화재 수신반 슬롯";
            m_dicDeviceList[315001] = "비상벨 시스템 슬롯";
            m_dicDeviceList[316001] = "주차관제 슬롯";
            m_dicDeviceList[317001] = "이상음원감지 장치 슬롯";
            m_dicDeviceList[318001] = "레이더 센서";
            m_dicDeviceList[318002] = "레이더 센서 구역";
            m_dicDeviceList[319001] = "AMP";
            m_dicDeviceList[319002] = "스피커";
            m_dicDeviceList[320001] = "출입통제 리더기";
            m_dicDeviceList[312002] = "장력 센서 구역";
            m_dicDeviceList[321001] = "오디오 방송 장비";
            m_dicDeviceList[333001] = "TRS Slot";
            m_dicDeviceList[334001] = "Port MIS Slot";
            m_dicDeviceList[333000] = "TRS";
            m_dicDeviceList[333001] = "TRS";
            m_dicDeviceList[334000] = "PORTMIS";
            m_dicDeviceList[334001] = "SHIP";
            m_dicDeviceList[335000] = "경광등";
            m_dicDeviceList[336000] = "센서웨이";
            m_dicDeviceList[336001] = "구역";
            m_dicDeviceList[336002] = "통문";
            m_dicDeviceList[337000] = "시설물관리";
            m_dicDeviceList[337001] = "시설물";
            m_dicDeviceList[339000] = "이상음원감지기";
            m_dicDeviceList[342000] = "세콤듀얼";
            m_dicDeviceList[342001] = "루프";
            m_dicDeviceList[342002] = "출입문";
            m_dicDeviceList[338000] = "ELFAR 진동 센서";
            m_dicDeviceList[338001] = "ELFAR 진동 센서 통제기";
            m_dicDeviceList[338002] = "ELFAR 진동 센서 Fence Line0";
            m_dicDeviceList[338003] = "ELFAR 진동 센서 Fence Line1";
            m_dicDeviceList[338004] = "ELFAR 진동 센서 Input";
            m_dicDeviceList[338005] = "ELFAR 진동 센서 Output";
            m_dicDeviceList[338006] = "ELFAR 진동 센서 Group";
            m_dicDeviceList[343000] = "장력감지시스템";
            m_dicDeviceList[343001] = "장력감지시스템 존";
            m_dicDeviceList[344000] = "FD322 장치";
            m_dicDeviceList[344001] = "FD322 구역";
            m_dicDeviceList[345000] = "열화상 센서 시스템";
            m_dicDeviceList[345001] = "열화상 센서";
            m_dicDeviceList[346000] = "ITX NVR";
            m_dicDeviceList[346001] = "ITX NVR 카메라";
            m_dicDeviceList[347000] = "Techwin NVR";
            m_dicDeviceList[347001] = "Techwin NVR 카메라";
            m_dicDeviceList[348000] = "IDIS NVR";
            m_dicDeviceList[348001] = "IDIS NVR 카메라";
            m_dicDeviceList[349000] = "아날로그 게이지 서버";
            m_dicDeviceList[349001] = "게이지 디바이스";
            m_dicDeviceList[350000] = "FD500 장치";
            m_dicDeviceList[350003] = "FD500 구역";
            m_dicDeviceList[351000] = "HTTP 장치";
            m_dicDeviceList[351001] = "HTTP 슬롯 장치";
            m_dicDeviceList[353000] = "트윈스컴 비상벨시스템";
            m_dicDeviceList[353001] = "트윈스컴 비상벨";
            m_dicDeviceList[352000] = "NMS";
            m_dicDeviceList[354000] = "INTELLIVIX";
            m_dicDeviceList[355000] = "IDIS VMS";
            m_dicDeviceList[355001] = "IDIS VMS 카메라";
            m_dicDeviceList[356000] = "비상개폐장치";
            m_dicDeviceList[357000] = "다람 비상벨시스템";
            m_dicDeviceList[357001] = "다람 비상벨";
            m_dicDeviceList[358000] = "Dnet 레이더시스템";
            m_dicDeviceList[359000] = "ELTA 레이더시스템";
            m_dicDeviceList[358001] = "Dnet 레이더";
            m_dicDeviceList[359001] = "HMI서버";
            m_dicDeviceList[359002] = "ELTA 레이더";
            m_dicDeviceList[359003] = "Target";
            m_dicDeviceList[363000] = "관제중계서버";
            m_dicDeviceList[363001] = "계약처";
            m_dicDeviceList[363002] = "메인 컨트롤러";
            m_dicDeviceList[363003] = "서브 컨트롤러";
            m_dicDeviceList[364000] = "AzureVMS";
            m_dicDeviceList[365000] = "하이텍비상벨";
            m_dicDeviceList[365001] = "하이텍비상벨슬롯";
            m_dicDeviceList[366000] = "근태리더기 DB";
            m_dicDeviceList[366001] = "지점";
            m_dicDeviceList[366002] = "근태리더기";
            m_dicDeviceList[367000] = "스피드게이트";
            m_dicDeviceList[368000] = "CLES";
            m_dicDeviceList[368001] = "메인 컨트롤러";
            m_dicDeviceList[368002] = "로컬 컨트롤러";
            m_dicDeviceList[368003] = "출입문";
            m_dicDeviceList[368004] = "리더기";
            m_dicDeviceList[368005] = "얼굴인식 리더기";
            m_dicDeviceList[368006] = "얼굴인식 PC";
            m_dicDeviceList[369000] = "세대관리";
            m_dicDeviceList[369001] = "동";
            m_dicDeviceList[369002] = "호(세대)";
            m_dicDeviceList[369003] = "세대원";
            m_dicDeviceList[370000] = "휴엔홈넷";
            m_dicDeviceList[371000] = "제습기";
            m_dicDeviceList[372000] = "차량하부 검색기";
            m_dicDeviceList[373000] = "신영비상벨";
            m_dicDeviceList[373001] = "신영비상벨슬롯";
            m_dicDeviceList[374000] = "비디오월서버";
            m_dicDeviceList[374001] = "디스플레이서버";
            m_dicDeviceList[374002] = "모니터";
            m_dicDeviceList[375000] = "화재PC";
            m_dicDeviceList[375001] = "화재수신반";
            m_dicDeviceList[376000] = "V-Alert 진동센서 수신기";
            m_dicDeviceList[376001] = "V-Alert 진동센서 분석기";
            m_dicDeviceList[376002] = "V-Alert 진동센서 존";
            m_dicDeviceList[376003] = "V-Alert 진동센서 센서그룹";
            m_dicDeviceList[380000] = "홈넷 게이트";
            m_dicDeviceList[381000] = "홈넷 APT App 서버";
            m_dicDeviceList[382000] = "홈넷 세대관리";
            m_dicDeviceList[382001] = "아파트";
            m_dicDeviceList[382002] = "동";
            m_dicDeviceList[382003] = "호(세대)";
            m_dicDeviceList[383000] = "홈넷 관제 서버";
            m_dicDeviceList[384000] = "LIDAR 센서시스템";
            m_dicDeviceList[384001] = "LIDAR 센서 미들웨어";
            m_dicDeviceList[384002] = "LIDAR 센서";
            m_dicDeviceList[384003] = "LIDAR 센서 Target";
        }
    }

    public class SVMSDeviceEventData
    {
        private int m_nID = -1;
        private string m_strGroupName = "";
        private string m_strDescription = "";

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string GroupName
        {
            get { return m_strGroupName; }
            set { m_strGroupName = value; }
        }

        public string Description
        {
            get { return m_strDescription; }
            set { m_strDescription = value; }
        }

        public SVMSDeviceEventData()
        {
        }

        public SVMSDeviceEventData(int id, string strGroupName, string strDescription)
        {
            m_nID = id;
            m_strGroupName = strGroupName;
            m_strDescription = strDescription;
        }
    }

    public class SVMSDevice
    {
        private int m_alarmCode = -1;
        private int m_deviceCode = -1;

        public int AlarmCode
        {
            get { return m_alarmCode; }
            set { m_alarmCode = value; }
        }

        public int DeviceCode
        {
            get { return m_deviceCode; }
            set { m_deviceCode = value; }
        }
    }
}
