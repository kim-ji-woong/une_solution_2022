using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WishServer.Model;

namespace WishServer
{
    public class BuildingData
    {
        public BuildingData(int nID, string strDisplayName, string strName = null, int? nFloorIndex = null)
        {
            this.ID = nID;
            this.DisplayName = strDisplayName;
            this.Name = strName;
            this.FloorIndex = nFloorIndex;
        }

        public int ID { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public int? FloorIndex { get; set; }
    }

    public class ProcessManager
    {
        DirectDBManager m_dbManager = null;

        Dictionary<string, string> m_dicTeamData = null;
        Dictionary<string, BuildingData> m_dicPlaceID = null;
        Dictionary<string, BuildingData> m_dicPlaceID2 = null;
        Dictionary<string, BuildingData> m_dicPlaceID3 = null;

        Dictionary<string, string> m_dicWorkData = null;

        public ProcessManager(DirectDBManager dbManager)
        {
            m_dbManager = dbManager;

            Init();
        }

        private void Init()
        {
            m_dicWorkData = new Dictionary<string, string>();
            m_dicWorkData["S_WO_WORK_TYPE_1"] = "신설";
            m_dicWorkData["S_WO_WORK_TYPE_2"] = "증설";
            m_dicWorkData["S_WO_WORK_TYPE_3"] = "정비";
            m_dicWorkData["S_WO_WORK_TYPE_4"] = "기타";

            m_dicTeamData = new Dictionary<string, string>();
            m_dicTeamData["00001001"] = "솔브레인그룹";
            m_dicTeamData["00001002"] = "솔브레인홀딩스(주)";
            m_dicTeamData["00001004"] = "솔브레인에스엘디(주)";
            m_dicTeamData["00001005"] = "훽트(주)";
            m_dicTeamData["00001006"] = "머티리얼즈파크(주)";
            m_dicTeamData["00001007"] = "엠씨솔루션(주)";
            m_dicTeamData["00001008"] = "유피시스템(주)";
            m_dicTeamData["00001009"] = "HR실";
            m_dicTeamData["00001032"] = "MCSC Plant";
            m_dicTeamData["00001033"] = "지원부문";
            m_dicTeamData["00001034"] = "신사업전략팀";
            m_dicTeamData["00001036"] = "인재경영팀";
            m_dicTeamData["00001037"] = "법무실";
            m_dicTeamData["00001043"] = "경영관리팀";
            m_dicTeamData["00001064"] = "훽트제조팀";
            m_dicTeamData["00001106"] = "제조1팀";
            m_dicTeamData["00001107"] = "인프라팀";
            m_dicTeamData["00001109"] = "품질팀";
            m_dicTeamData["00001112"] = "물류출하파트";
            m_dicTeamData["00001113"] = "유기재료개발팀";
            m_dicTeamData["00001117"] = "생산관리팀";
            m_dicTeamData["00001120"] = "기획관리팀";
            m_dicTeamData["00001124"] = "가공파트";
            m_dicTeamData["00001126"] = "공정기술파트";
            m_dicTeamData["00001133"] = "품질파트";
            m_dicTeamData["00001167"] = "기술개발연구소";
            m_dicTeamData["00001171"] = "바이오헬스케어본부";
            m_dicTeamData["00001187"] = "재무팀";
            m_dicTeamData["00001188"] = "회계팀";
            m_dicTeamData["00001192"] = "(주)프로웰";
            m_dicTeamData["00001196"] = "솔브레인라사(주)";
            m_dicTeamData["00001242"] = "유통사업팀";
            m_dicTeamData["00001261"] = "사업제조본부";
            m_dicTeamData["00001263"] = "MCT가공팀";
            m_dicTeamData["00001264"] = "제조기술팀";
            m_dicTeamData["00001266"] = "CNC가공팀";
            m_dicTeamData["00001268"] = "품질관리팀";
            m_dicTeamData["00001329"] = "SR제조팀";
            m_dicTeamData["00009100"] = "외관파트";
            m_dicTeamData["00009137"] = "영업팀";
            m_dicTeamData["00009150"] = "화질파트";
            m_dicTeamData["00009151"] = "컷팅파트";
            m_dicTeamData["00009152"] = "생산관리파트";
            m_dicTeamData["00009154"] = "인프라파트";
            m_dicTeamData["00009155"] = "물류팀";
            m_dicTeamData["00009165"] = "제조2팀";
            m_dicTeamData["00009175"] = "연구소";
            m_dicTeamData["00009191"] = "감사실";
            m_dicTeamData["00009192"] = "재경실";
            m_dicTeamData["00009198"] = "신사업팀";
            m_dicTeamData["00009199"] = "경영지원팀";
            m_dicTeamData["00009200"] = "지원파트";
            m_dicTeamData["00009201"] = "물류파트";
            m_dicTeamData["00009202"] = "환경안전팀";
            m_dicTeamData["00009210"] = "화학사업부문";
            m_dicTeamData["00009213"] = "연구개발팀";
            m_dicTeamData["00009214"] = "생산관리팀";
            m_dicTeamData["00009223"] = "제조3팀";
            m_dicTeamData["00009224"] = "생산관리팀";
            m_dicTeamData["00009225"] = "표면처리팀";
            m_dicTeamData["00009226"] = "유통사업부";
            m_dicTeamData["00009227"] = "리드탭사업부";
            m_dicTeamData["00009228"] = "생산팀";
            m_dicTeamData["00009229"] = "품질관리팀";
            m_dicTeamData["00009230"] = "개발팀";
            m_dicTeamData["00009239"] = "인재개발팀";
            m_dicTeamData["00009251"] = "정밀세정부문";
            m_dicTeamData["00009252"] = "정밀세정팀";
            m_dicTeamData["00009259"] = "회계팀";
            m_dicTeamData["00009260"] = "ESH지원팀";
            m_dicTeamData["00009266"] = "자재파트";
            m_dicTeamData["00009267"] = "라이프아웃도어팀";
            m_dicTeamData["00009268"] = "내부회계관리팀";
            m_dicTeamData["00009271"] = "사업개발부문";
            m_dicTeamData["00009272"] = "제조1부문";
            m_dicTeamData["00009273"] = "제조2부문";
            m_dicTeamData["00009279"] = "Display사업부";
            m_dicTeamData["00009280"] = "Mems사업부";
            m_dicTeamData["00009281"] = "MEMS제조부문";
            m_dicTeamData["00009282"] = "품질관리팀";
            m_dicTeamData["00009283"] = "제조기술1팀";
            m_dicTeamData["00009284"] = "제조기술2팀";
            m_dicTeamData["00009285"] = "사업부문";
            m_dicTeamData["00009286"] = "기술영업팀";
            m_dicTeamData["00009287"] = "AT팀";
            m_dicTeamData["00009292"] = "기구설계팀";
            m_dicTeamData["00009293"] = "회로설계팀";
            m_dicTeamData["00009303"] = "제조기술3팀";
            m_dicTeamData["00009305"] = "경영지원팀";
            m_dicTeamData["00009306"] = "자원운영팀";
            m_dicTeamData["00009309"] = "솔브레인(주)";
            m_dicTeamData["00009310"] = "구매실";
            m_dicTeamData["00009314"] = "SCM팀";
            m_dicTeamData["00009315"] = "운영지원팀";
            m_dicTeamData["00009316"] = "생산본부";
            m_dicTeamData["00009317"] = "생산지원실";
            m_dicTeamData["00009318"] = "사업본부";
            m_dicTeamData["00009319"] = "중앙연구소";
            m_dicTeamData["00009320"] = "제조1부문";
            m_dicTeamData["00009321"] = "제조2부문";
            m_dicTeamData["00009322"] = "제조3부문";
            m_dicTeamData["00009323"] = "기술지원실";
            m_dicTeamData["00009324"] = "품질보증부문";
            m_dicTeamData["00009325"] = "환경안전부문";
            m_dicTeamData["00009326"] = "사업1부문";
            m_dicTeamData["00009327"] = "사업2부문";
            m_dicTeamData["00009328"] = "사업3부문";
            m_dicTeamData["00009329"] = "전지사업부문";
            m_dicTeamData["00009331"] = "신소재개발실";
            m_dicTeamData["00009332"] = "성장소재개발실";
            m_dicTeamData["00009333"] = "인사지원팀";
            m_dicTeamData["00009334"] = "물류관리팀";
            m_dicTeamData["00009335"] = "회계지원팀";
            m_dicTeamData["00009337"] = "생산기획팀";
            m_dicTeamData["00009338"] = "TF소재제조팀";
            m_dicTeamData["00009339"] = "에천트제조팀";
            m_dicTeamData["00009340"] = "CMP소재제조팀";
            m_dicTeamData["00009341"] = "전해액제조팀";
            m_dicTeamData["00009342"] = "파주제조팀";
            m_dicTeamData["00009344"] = "HF제조팀";
            m_dicTeamData["00009345"] = "불화물제조팀";
            m_dicTeamData["00009346"] = "TG제조팀";
            m_dicTeamData["00009347"] = "TG지원팀";
            m_dicTeamData["00009348"] = "공무팀";
            m_dicTeamData["00009349"] = "엔지니어링팀";
            m_dicTeamData["00009350"] = "품질보증팀";
            m_dicTeamData["00009351"] = "화학분석팀";
            m_dicTeamData["00009353"] = "ESH인프라팀";
            m_dicTeamData["00009354"] = "ESH운영팀";
            m_dicTeamData["00009355"] = "반도체사업1팀";
            m_dicTeamData["00009356"] = "반도체사업2팀";
            m_dicTeamData["00009357"] = "반도체사업3팀";
            m_dicTeamData["00009359"] = "우시사무소";
            m_dicTeamData["00009360"] = "디스플레이사업1팀";
            m_dicTeamData["00009363"] = "전지사업1팀";
            m_dicTeamData["00009365"] = "박막소재개발팀";
            m_dicTeamData["00009366"] = "전해액연구팀";
            m_dicTeamData["00009367"] = "전해액소재개발팀";
            m_dicTeamData["00009368"] = "C&E개발팀";
            m_dicTeamData["00009369"] = "나노소재연구팀";
            m_dicTeamData["00009370"] = "WET기술팀";
            m_dicTeamData["00009372"] = "연구기획관리팀";
            m_dicTeamData["00009373"] = "지식재산팀";
            m_dicTeamData["00009375"] = "품질관리팀";
            m_dicTeamData["00009376"] = "유기재료제조팀";
            m_dicTeamData["00009377"] = "제조혁신팀";
            m_dicTeamData["00009378"] = "LT사업부";
            m_dicTeamData["00009379"] = "생산팀";
            m_dicTeamData["00009380"] = "자원운영팀";
            m_dicTeamData["00009381"] = "경영지원팀";
            m_dicTeamData["00009382"] = "품질관리팀(LT)";
            m_dicTeamData["00009383"] = "화학사업부";
            m_dicTeamData["00009384"] = "개발품질부문";
            m_dicTeamData["00009387"] = "파주도금팀";
            m_dicTeamData["00009391"] = "개발품질부문";
            m_dicTeamData["00009392"] = "우브에팀";
            m_dicTeamData["00009393"] = "해외영업실";
            m_dicTeamData["00009394"] = "전략기획실";
            m_dicTeamData["00009395"] = "바이오헬스연구소";
            m_dicTeamData["00009396"] = "신성장부문";
            m_dicTeamData["00009398"] = "ICT실";
            m_dicTeamData["00009399"] = "데이터사이언스팀";
            m_dicTeamData["00009400"] = "Digital협력팀";
            m_dicTeamData["00009401"] = "정보보안팀";
            m_dicTeamData["00009403"] = "제조4부문";
            m_dicTeamData["00009404"] = "디스플레이사업2팀";
            m_dicTeamData["00009408"] = "제조팀";
            m_dicTeamData["00009409"] = "문화개선파트";
            m_dicTeamData["00009413"] = "Display제조부문";
            m_dicTeamData["00009414"] = "지원부문";
            m_dicTeamData["00009415"] = "물류파트";
            m_dicTeamData["00009416"] = "스마트제조혁신실";
            m_dicTeamData["00009420"] = "프로테오믹스팀";
            m_dicTeamData["00009421"] = "신성장부문";
            m_dicTeamData["00009422"] = "상생협력팀";
            m_dicTeamData["00009423"] = "파주지원팀";
            m_dicTeamData["00009426"] = "구매자재팀";
            m_dicTeamData["00009427"] = "전략구매팀";
            m_dicTeamData["00009428"] = "ESH본부";
            m_dicTeamData["00009429"] = "ESH경영팀";
            m_dicTeamData["00009431"] = "생산운영부문";
            m_dicTeamData["00009434"] = "안전보건파트";
            m_dicTeamData["00009435"] = "체외진단연구팀";
            m_dicTeamData["00009436"] = "사업관리팀";
            m_dicTeamData["00009437"] = "전략마케팅팀";
            m_dicTeamData["00009438"] = "예방보전팀";
            m_dicTeamData["00009439"] = "생산관리부문";
            m_dicTeamData["00009442"] = "개발팀";
            m_dicTeamData["00009443"] = "BOE제조팀";
            m_dicTeamData["00009451"] = "재무부문";
            m_dicTeamData["00009452"] = "경영지원팀";
            m_dicTeamData["00009453"] = "경영지원 ESH운영팀";
            m_dicTeamData["00009454"] = "경영관리 ESH운영팀";
            m_dicTeamData["00009455"] = "경영지원ESH운영팀";
            m_dicTeamData["00009456"] = "사업전략팀";
            m_dicTeamData["00009457"] = "생산기획팀";
            m_dicTeamData["00009459"] = "기술기획팀";
            m_dicTeamData["00009460"] = "NGP제조팀";
            m_dicTeamData["00009461"] = "도금기술팀";
            m_dicTeamData["00009462"] = "경영관리팀";
            m_dicTeamData["00009470"] = "정밀세정기술영업팀";
            m_dicTeamData["00009471"] = "제조부문";
            m_dicTeamData["00009472"] = "ESH파트";
            m_dicTeamData["00009477"] = "고객지원팀";
            m_dicTeamData["00009478"] = "SBB본부";
            m_dicTeamData["00009479"] = "사업개발팀";
            m_dicTeamData["00009480"] = "기술개발팀";
            m_dicTeamData["00009481"] = "전지사업2팀";
            m_dicTeamData["00009482"] = "설계팀";
            m_dicTeamData["00009510"] = "경영지원실";
            m_dicTeamData["00009511"] = "혁신실";
            m_dicTeamData["00009512"] = "공주제조팀";
            m_dicTeamData["00009521"] = "펫사업영업팀";
            m_dicTeamData["00009522"] = "펫사업생산팀";
            m_dicTeamData["00009523"] = "디스플레이사업팀";
            m_dicTeamData["00009524"] = "인사실";
            m_dicTeamData["00009525"] = "경영관리실";
            m_dicTeamData["00009526"] = "인사팀";
            m_dicTeamData["00009527"] = "ER팀";
            m_dicTeamData["00009528"] = "경영관리팀";
            m_dicTeamData["00009529"] = "경영전략팀";
            m_dicTeamData["00009530"] = "신사업전략팀";
            m_dicTeamData["00009532"] = "제조3팀";
            m_dicTeamData["00009533"] = "유통사업부문";
            m_dicTeamData["00009544"] = "ESG추진팀";
            m_dicTeamData["C999999"] = "공통부서";


            m_dicPlaceID = new Dictionary<string, BuildingData>();
            m_dicPlaceID["1000100"] = new BuildingData(1, "제1공장", "T1");
            m_dicPlaceID["1000200"] = new BuildingData(2, "제2공장", "T2");
            m_dicPlaceID["1000300"] = new BuildingData(3, "제3공장", "T3");
            m_dicPlaceID["1000400"] = new BuildingData(4, "제4공장", "T4");
            m_dicPlaceID["1000500"] = new BuildingData(5, "제5공장", "T5");
            m_dicPlaceID["1000600"] = new BuildingData(6, "제6공장", "T6");
            m_dicPlaceID["1000700"] = new BuildingData(7, "제7공장", "T7");
            m_dicPlaceID["1000800"] = new BuildingData(10, "제8공장", "T8");
            m_dicPlaceID["1000900"] = new BuildingData(11, "제9공장", "T9");
            m_dicPlaceID["1000901"] = new BuildingData(14, "제10공장", "T10");
            m_dicPlaceID["1000902"] = new BuildingData(20000, "전지역");
            m_dicPlaceID["2000100"] = new BuildingData(20000, "제1공장");
            m_dicPlaceID["2000200"] = new BuildingData(20000, "제2공장");
            m_dicPlaceID["2000300"] = new BuildingData(20000, "전지역");
            m_dicPlaceID["3000100"] = new BuildingData(20000, "연구소");
            m_dicPlaceID["4000100"] = new BuildingData(20000, "본사");


            m_dicPlaceID2 = new Dictionary<string, BuildingData>();
            m_dicPlaceID2["1000100100"] = new BuildingData(1, "T1-1");
            m_dicPlaceID2["1000100101"] = new BuildingData(2, "T1-2");
            m_dicPlaceID2["1000100102"] = new BuildingData(3, "T1-3");
            m_dicPlaceID2["1000100103"] = new BuildingData(4, "T1-4");
            m_dicPlaceID2["1000100104"] = new BuildingData(5, "T1-5");
            m_dicPlaceID2["1000100105"] = new BuildingData(6, "T1-6");
            m_dicPlaceID2["1000100106"] = new BuildingData(7, "T1-7");
            m_dicPlaceID2["1000100107"] = new BuildingData(14, "T1-8");
            m_dicPlaceID2["1000100108"] = new BuildingData(15, "T1-9");
            m_dicPlaceID2["1000100109"] = new BuildingData(18, "T1-10");
            m_dicPlaceID2["1000100110"] = new BuildingData(20, "T1-12");
            m_dicPlaceID2["1000100111"] = new BuildingData(21, "T1-13");
            m_dicPlaceID2["1000100112"] = new BuildingData(22, "T1-14");
            m_dicPlaceID2["1000100113"] = new BuildingData(23, "T1-15");
            m_dicPlaceID2["1000100199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000200100"] = new BuildingData(24, "T2-1");
            m_dicPlaceID2["1000200101"] = new BuildingData(103, "T2-2-1");
            m_dicPlaceID2["1000200102"] = new BuildingData(20000, "T2-2-2");
            m_dicPlaceID2["1000200103"] = new BuildingData(105, "T2-2-3");
            m_dicPlaceID2["1000200104"] = new BuildingData(106, "T2-2-4");
            m_dicPlaceID2["1000200105"] = new BuildingData(109, "T2-2-5");
            m_dicPlaceID2["1000200106"] = new BuildingData(110, "T2-2-6");
            m_dicPlaceID2["1000200107"] = new BuildingData(113, "T2-2-7");
            m_dicPlaceID2["1000200108"] = new BuildingData(20000, "T2-2-8");
            m_dicPlaceID2["1000200109"] = new BuildingData(114, "T2-2-9");
            m_dicPlaceID2["1000200110"] = new BuildingData(26, "T2-3");
            m_dicPlaceID2["1000200111"] = new BuildingData(27, "T2-4");
            m_dicPlaceID2["1000200112"] = new BuildingData(28, "T2-6");
            m_dicPlaceID2["1000200113"] = new BuildingData(29, "T2-7");
            m_dicPlaceID2["1000200114"] = new BuildingData(30, "T2-8");
            m_dicPlaceID2["1000200115"] = new BuildingData(35, "T2-9");
            m_dicPlaceID2["1000200116"] = new BuildingData(36, "T2-10");
            m_dicPlaceID2["1000200117"] = new BuildingData(37, "T2-11");
            m_dicPlaceID2["1000200118"] = new BuildingData(39, "T2-12(TG1동)");
            m_dicPlaceID2["1000200119"] = new BuildingData(38, "T2-12(TG2동)");
            m_dicPlaceID2["1000200120"] = new BuildingData(45, "T2-13");
            m_dicPlaceID2["1000200199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000300100"] = new BuildingData(46, "T3-1");
            m_dicPlaceID2["1000300101"] = new BuildingData(50, "T3-2");
            m_dicPlaceID2["1000300102"] = new BuildingData(52, "T3-3");
            m_dicPlaceID2["1000300103"] = new BuildingData(53, "T3-5");
            m_dicPlaceID2["1000300104"] = new BuildingData(54, "T3-6");
            m_dicPlaceID2["1000300105"] = new BuildingData(55, "T3-7");
            m_dicPlaceID2["1000300106"] = new BuildingData(56, "T3-8");
            m_dicPlaceID2["1000300107"] = new BuildingData(57, "T3-9");
            m_dicPlaceID2["1000300108"] = new BuildingData(58, "T3-10");
            m_dicPlaceID2["1000300199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000400100"] = new BuildingData(59, "T4-1");
            m_dicPlaceID2["1000400101"] = new BuildingData(61, "T4-2");
            m_dicPlaceID2["1000400102"] = new BuildingData(64, "T4-3");
            m_dicPlaceID2["1000400103"] = new BuildingData(65, "T4-5");
            m_dicPlaceID2["1000400104"] = new BuildingData(66, "T4-11");
            m_dicPlaceID2["1000400105"] = new BuildingData(118, "T4-12");
            m_dicPlaceID2["1000400199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000500100"] = new BuildingData(68, "T5-1");
            m_dicPlaceID2["1000500199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000600100"] = new BuildingData(69, "T6-1");
            m_dicPlaceID2["1000600101"] = new BuildingData(70, "T6-2");
            m_dicPlaceID2["1000600102"] = new BuildingData(71, "T6-3");
            m_dicPlaceID2["1000600199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000700100"] = new BuildingData(72, "T7-1");
            m_dicPlaceID2["1000700101"] = new BuildingData(75, "T7-2");
            m_dicPlaceID2["1000700102"] = new BuildingData(77, "T7-3");
            m_dicPlaceID2["1000700103"] = new BuildingData(78, "T7-4");
            m_dicPlaceID2["1000700104"] = new BuildingData(80, "T7-5");
            m_dicPlaceID2["1000700105"] = new BuildingData(81, "T7-6");
            m_dicPlaceID2["1000700106"] = new BuildingData(82, "T7-7");
            m_dicPlaceID2["1000700199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000800100"] = new BuildingData(116, "T8-1");
            m_dicPlaceID2["1000800101"] = new BuildingData(117, "T8-2");
            m_dicPlaceID2["1000800102"] = new BuildingData(89, "T8-5");
            m_dicPlaceID2["1000800103"] = new BuildingData(96, "T8-6");
            m_dicPlaceID2["1000800199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000900100"] = new BuildingData(97, "두드림센터");
            m_dicPlaceID2["1000900101"] = new BuildingData(98, "T9-2");
            m_dicPlaceID2["1000900102"] = new BuildingData(99, "T9-3");
            m_dicPlaceID2["1000900103"] = new BuildingData(100, "T9-4");
            m_dicPlaceID2["1000900104"] = new BuildingData(101, "T9-5");
            m_dicPlaceID2["1000900105"] = new BuildingData(102, "T9-6");
            m_dicPlaceID2["1000900199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["1000901100"] = new BuildingData(115, "T10-1");
            m_dicPlaceID2["1000901199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["2000100100"] = new BuildingData(20000, "P1");
            m_dicPlaceID2["2000100101"] = new BuildingData(20000, "P3");
            m_dicPlaceID2["2000100102"] = new BuildingData(20000, "P5");
            m_dicPlaceID2["2000100103"] = new BuildingData(20000, "P8");
            m_dicPlaceID2["2000100104"] = new BuildingData(20000, "P10");
            m_dicPlaceID2["2000100105"] = new BuildingData(20000, "P11");
            m_dicPlaceID2["2000100106"] = new BuildingData(20000, "P2");
            m_dicPlaceID2["2000100107"] = new BuildingData(20000, "P4");
            m_dicPlaceID2["2000100108"] = new BuildingData(20000, "P6");
            m_dicPlaceID2["2000100109"] = new BuildingData(20000, "P7");
            m_dicPlaceID2["2000100110"] = new BuildingData(20000, "P9");
            m_dicPlaceID2["2000100199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["2000200100"] = new BuildingData(20000, "파주2공장");
            m_dicPlaceID2["2000200199"] = new BuildingData(20000, "신규");
            m_dicPlaceID2["3000100100"] = new BuildingData(20000, "A동");
            m_dicPlaceID2["3000100101"] = new BuildingData(20000, "B동");
            m_dicPlaceID2["4000100100"] = new BuildingData(20000, "본사");


            m_dicPlaceID3 = new Dictionary<string, BuildingData>();
            m_dicPlaceID3["1000100100100"] = new BuildingData(1, "1층", null, 0);
            m_dicPlaceID3["1000100100101"] = new BuildingData(2, "2층", null, 1);
            m_dicPlaceID3["1000100100102"] = new BuildingData(2, "옥상", null, 1);
            m_dicPlaceID3["1000100101100"] = new BuildingData(3, "1층", null, 0);
            m_dicPlaceID3["1000100101101"] = new BuildingData(4, "2층", null, 1);
            m_dicPlaceID3["1000100101102"] = new BuildingData(4, "옥상", null, 1);
            m_dicPlaceID3["1000100102100"] = new BuildingData(8, "1층", null, 0);
            m_dicPlaceID3["1000100102101"] = new BuildingData(9, "2층", null, 1);
            m_dicPlaceID3["1000100102102"] = new BuildingData(10, "3층", null, 2);
            m_dicPlaceID3["1000100102103"] = new BuildingData(10, "옥상", null, 2);
            m_dicPlaceID3["1000100103100"] = new BuildingData(11, "1층", null, 0);
            m_dicPlaceID3["1000100103101"] = new BuildingData(11, "옥상", null, 0);
            m_dicPlaceID3["1000100104100"] = new BuildingData(12, "1층", null, 0);
            m_dicPlaceID3["1000100104101"] = new BuildingData(12, "옥상", null, 0);
            m_dicPlaceID3["1000100105100"] = new BuildingData(13, "1층", null, 0);
            m_dicPlaceID3["1000100105101"] = new BuildingData(13, "옥상", null, 0);
            m_dicPlaceID3["1000100106100"] = new BuildingData(14, "1층", null, 0);
            m_dicPlaceID3["1000100106101"] = new BuildingData(15, "2층", null, 1);
            m_dicPlaceID3["1000100106102"] = new BuildingData(15, "옥상", null, 1);
            m_dicPlaceID3["1000100107100"] = new BuildingData(19, "1층", null, 0);
            m_dicPlaceID3["1000100107101"] = new BuildingData(19, "옥상", null, 0);
            m_dicPlaceID3["1000100108100"] = new BuildingData(20, "1층", null, 0);
            m_dicPlaceID3["1000100108101"] = new BuildingData(20, "옥상", null, 0);
            m_dicPlaceID3["1000100109100"] = new BuildingData(24, "1층", null, 0);
            m_dicPlaceID3["1000100109101"] = new BuildingData(25, "2층", null, 1);
            m_dicPlaceID3["1000100109102"] = new BuildingData(212, "3층", null, 2);
            m_dicPlaceID3["1000100109103"] = new BuildingData(23, "지하1층", null, -1);
            m_dicPlaceID3["1000100109104"] = new BuildingData(212, "옥상", null, 2);
            m_dicPlaceID3["1000100110100"] = new BuildingData(27, "1층", null, 0);
            m_dicPlaceID3["1000100110101"] = new BuildingData(28, "2층", null, 1);
            m_dicPlaceID3["1000100110102"] = new BuildingData(28, "옥상", null, 1);
            m_dicPlaceID3["1000100111100"] = new BuildingData(29, "1층", null, 0);
            m_dicPlaceID3["1000100111101"] = new BuildingData(29, "옥상", null, 0);
            m_dicPlaceID3["1000100112100"] = new BuildingData(30, "1층", null, 0);
            m_dicPlaceID3["1000100112101"] = new BuildingData(30, "옥상", null, 0);
            m_dicPlaceID3["1000100113100"] = new BuildingData(31, "1층", null, 0);
            m_dicPlaceID3["1000100113101"] = new BuildingData(32, "2층", null, 1);
            m_dicPlaceID3["1000100113102"] = new BuildingData(33, "3층", null, 2);
            m_dicPlaceID3["1000100113103"] = new BuildingData(34, "옥상", null, 3);
            m_dicPlaceID3["1000200100100"] = new BuildingData(35, "1층", null, 0);
            m_dicPlaceID3["1000200100101"] = new BuildingData(35, "옥상", null, 0);
            m_dicPlaceID3["1000200101100"] = new BuildingData(180, "1층", null, 0);
            m_dicPlaceID3["1000200101101"] = new BuildingData(180, "옥상", null, 0);
            m_dicPlaceID3["1000200102100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["1000200102101"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["1000200103100"] = new BuildingData(183, "2층", null, 1);
            m_dicPlaceID3["1000200103101"] = new BuildingData(182, "1층", null, 0);
            m_dicPlaceID3["1000200103102"] = new BuildingData(183, "옥상", null, 1);
            m_dicPlaceID3["1000200104100"] = new BuildingData(184, "1층", null, 0);
            m_dicPlaceID3["1000200104101"] = new BuildingData(185, "옥상", null, 1);
            m_dicPlaceID3["1000200105100"] = new BuildingData(188, "1층", null, 0);
            m_dicPlaceID3["1000200105101"] = new BuildingData(188, "옥상", null, 0);
            m_dicPlaceID3["1000200106100"] = new BuildingData(189, "1층", null, 0);
            m_dicPlaceID3["1000200106101"] = new BuildingData(189, "옥상", null, 0);
            m_dicPlaceID3["1000200107100"] = new BuildingData(192, "1층", null, 0);
            m_dicPlaceID3["1000200107101"] = new BuildingData(192, "옥상", null, 0);
            m_dicPlaceID3["1000200108100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["1000200108101"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["1000200109100"] = new BuildingData(193, "1층", null, 0);
            m_dicPlaceID3["1000200109101"] = new BuildingData(193, "옥상", null, 0);
            m_dicPlaceID3["1000200110100"] = new BuildingData(38, "1층", null, 0);
            m_dicPlaceID3["1000200110101"] = new BuildingData(41, "옥상", null, 3);
            m_dicPlaceID3["1000200110102"] = new BuildingData(39, "2층", null, 1);
            m_dicPlaceID3["1000200110103"] = new BuildingData(40, "3층", null, 2);
            m_dicPlaceID3["1000200110104"] = new BuildingData(37, "지하1층", null, -1);
            m_dicPlaceID3["1000200111100"] = new BuildingData(42, "1층", null, 0);
            m_dicPlaceID3["1000200111101"] = new BuildingData(42, "옥상", null, 0);
            m_dicPlaceID3["1000200112100"] = new BuildingData(43, "1층", null, 0);
            m_dicPlaceID3["1000200112101"] = new BuildingData(43, "옥상", null, 0);
            m_dicPlaceID3["1000200113100"] = new BuildingData(44, "옥상", null, 0);
            m_dicPlaceID3["1000200113101"] = new BuildingData(44, "1층", null, 0);
            m_dicPlaceID3["1000200114100"] = new BuildingData(46, "2층", null, 1);
            m_dicPlaceID3["1000200114101"] = new BuildingData(47, "3층", null, 2);
            m_dicPlaceID3["1000200114102"] = new BuildingData(45, "1층", null, 0);
            m_dicPlaceID3["1000200114103"] = new BuildingData(47, "옥상", null, 2);
            m_dicPlaceID3["1000200115100"] = new BuildingData(52, "1층", null, 0);
            m_dicPlaceID3["1000200115101"] = new BuildingData(53, "2층", null, 1);
            m_dicPlaceID3["1000200115102"] = new BuildingData(54, "옥상", null, 2);
            m_dicPlaceID3["1000200115103"] = new BuildingData(54, "3층", null, 2);
            m_dicPlaceID3["1000200116100"] = new BuildingData(55, "옥상", null, 0);
            m_dicPlaceID3["1000200116101"] = new BuildingData(55, "1층", null, 0);
            m_dicPlaceID3["1000200117100"] = new BuildingData(56, "옥상", null, 0);
            m_dicPlaceID3["1000200117101"] = new BuildingData(56, "1층", null, 0);
            m_dicPlaceID3["1000200117102"] = new BuildingData(56, "2층", null, 0);
            m_dicPlaceID3["1000200118100"] = new BuildingData(65, "옥상", null, 3);
            m_dicPlaceID3["1000200118101"] = new BuildingData(62, "1층", null, 0);
            m_dicPlaceID3["1000200118102"] = new BuildingData(63, "2층", null, 1);
            m_dicPlaceID3["1000200118103"] = new BuildingData(64, "3층", null, 2);
            m_dicPlaceID3["1000200118104"] = new BuildingData(65, "4층", null, 3);
            m_dicPlaceID3["1000200119100"] = new BuildingData(58, "1층", null, 0);
            m_dicPlaceID3["1000200119101"] = new BuildingData(61, "옥상", null, 3);
            m_dicPlaceID3["1000200119102"] = new BuildingData(59, "2층", null, 1);
            m_dicPlaceID3["1000200119103"] = new BuildingData(60, "3층", null, 2);
            m_dicPlaceID3["1000200119104"] = new BuildingData(61, "4층", null, 3);
            m_dicPlaceID3["1000200120100"] = new BuildingData(72, "옥상", null, 1);
            m_dicPlaceID3["1000200120101"] = new BuildingData(71, "1층", null, 0);
            m_dicPlaceID3["1000200120102"] = new BuildingData(72, "2층", null, 1);
            m_dicPlaceID3["1000300100100"] = new BuildingData(73, "1층", null, 0);
            m_dicPlaceID3["1000300100101"] = new BuildingData(74, "2층", null, 1);
            m_dicPlaceID3["1000300100102"] = new BuildingData(75, "3층", null, 1);
            m_dicPlaceID3["1000300100103"] = new BuildingData(75, "옥상", null, 1);
            m_dicPlaceID3["1000300101100"] = new BuildingData(80, "1층", null, 0);
            m_dicPlaceID3["1000300101101"] = new BuildingData(81, "2층", null, 1);
            m_dicPlaceID3["1000300101102"] = new BuildingData(79, "지하1층", null, -1);
            m_dicPlaceID3["1000300101103"] = new BuildingData(81, "옥상", null, 1);
            m_dicPlaceID3["1000300102100"] = new BuildingData(83, "1층", null, 0);
            m_dicPlaceID3["1000300102101"] = new BuildingData(84, "2층", null, 1);
            m_dicPlaceID3["1000300102102"] = new BuildingData(85, "3층", null, 2);
            m_dicPlaceID3["1000300102103"] = new BuildingData(86, "4층", null, 3);
            m_dicPlaceID3["1000300102104"] = new BuildingData(86, "옥상", null, 3);
            m_dicPlaceID3["1000300103100"] = new BuildingData(87, "1층", null, 0);
            m_dicPlaceID3["1000300103101"] = new BuildingData(88, "2층", null, 1);
            m_dicPlaceID3["1000300103102"] = new BuildingData(88, "옥상", null, 1);
            m_dicPlaceID3["1000300104100"] = new BuildingData(89, "1층", null, 0);
            m_dicPlaceID3["1000300104101"] = new BuildingData(89, "옥상", null, 0);
            m_dicPlaceID3["1000300105100"] = new BuildingData(90, "1층", null, 0);
            m_dicPlaceID3["1000300105101"] = new BuildingData(91, "2층", null, 1);
            m_dicPlaceID3["1000300105102"] = new BuildingData(92, "3층", null, 2);
            m_dicPlaceID3["1000300105103"] = new BuildingData(93, "4층", null, 3);
            m_dicPlaceID3["1000300105104"] = new BuildingData(93, "옥상", null, 3);
            m_dicPlaceID3["1000300106100"] = new BuildingData(94, "1층", null, 0);
            m_dicPlaceID3["1000300106101"] = new BuildingData(94, "옥상", null, 0);
            m_dicPlaceID3["1000300107100"] = new BuildingData(95, "1층", null, 0);
            m_dicPlaceID3["1000300107101"] = new BuildingData(95, "옥상", null, 0);
            m_dicPlaceID3["1000300108100"] = new BuildingData(96, "1층", null, 0);
            m_dicPlaceID3["1000300108101"] = new BuildingData(96, "옥상", null, 0);
            m_dicPlaceID3["1000400100100"] = new BuildingData(97, "1층", null, 0);
            m_dicPlaceID3["1000400100101"] = new BuildingData(98, "2층", null, 1);
            m_dicPlaceID3["1000400100102"] = new BuildingData(99, "3층", null, 2);
            m_dicPlaceID3["1000400100103"] = new BuildingData(99, "옥상", null, 2);
            m_dicPlaceID3["1000400101100"] = new BuildingData(101, "1층", null, 0);
            m_dicPlaceID3["1000400101101"] = new BuildingData(102, "2층", null, 1);
            m_dicPlaceID3["1000400101102"] = new BuildingData(103, "옥상", null, 2);
            m_dicPlaceID3["1000400102100"] = new BuildingData(106, "1층", null, 0);
            m_dicPlaceID3["1000400102101"] = new BuildingData(106, "옥상", null, 0);
            m_dicPlaceID3["1000400103100"] = new BuildingData(107, "1층", null, 0);
            m_dicPlaceID3["1000400103101"] = new BuildingData(108, "2층", null, 1);
            m_dicPlaceID3["1000400103102"] = new BuildingData(109, "3층", null, 2);
            m_dicPlaceID3["1000400103103"] = new BuildingData(109, "옥상", null, 2);
            m_dicPlaceID3["1000400104100"] = new BuildingData(110, "1층", null, 0);
            m_dicPlaceID3["1000400104101"] = new BuildingData(111, "2층", null, 1);
            m_dicPlaceID3["1000400104102"] = new BuildingData(112, "3층", null, 2);
            m_dicPlaceID3["1000400104103"] = new BuildingData(112, "옥상", null, 2);
            m_dicPlaceID3["1000400105100"] = new BuildingData(233, "1층", null, 0);
            m_dicPlaceID3["1000400105101"] = new BuildingData(233, "2층", null, 0);
            m_dicPlaceID3["1000400105102"] = new BuildingData(233, "옥상", null, 0);
            m_dicPlaceID3["1000500100100"] = new BuildingData(114, "지하1층", null, -1);
            m_dicPlaceID3["1000500100101"] = new BuildingData(115, "1층", null, 0);
            m_dicPlaceID3["1000500100102"] = new BuildingData(116, "2층", null, 1);
            m_dicPlaceID3["1000500100103"] = new BuildingData(117, "3층", null, 2);
            m_dicPlaceID3["1000500100104"] = new BuildingData(118, "4층", null, 3);
            m_dicPlaceID3["1000500100105"] = new BuildingData(201, "4.1층", null, 3);
            m_dicPlaceID3["1000500100106"] = new BuildingData(202, "4.2층", null, 3);
            m_dicPlaceID3["1000500100107"] = new BuildingData(204, "옥상", null, 5);
            m_dicPlaceID3["1000600100100"] = new BuildingData(120, "1층", null, 0);
            m_dicPlaceID3["1000600100101"] = new BuildingData(121, "2층", null, 1);
            m_dicPlaceID3["1000600100102"] = new BuildingData(121, "2층 A", null, 1);
            m_dicPlaceID3["1000600100103"] = new BuildingData(122, "3층", null, 2);
            m_dicPlaceID3["1000600100104"] = new BuildingData(123, "4층", null, 3);
            m_dicPlaceID3["1000600100105"] = new BuildingData(124, "5층", null, 4);
            m_dicPlaceID3["1000600100106"] = new BuildingData(124, "7층", null, 4);
            m_dicPlaceID3["1000600100107"] = new BuildingData(124, "옥상", null, 4);
            m_dicPlaceID3["1000600101100"] = new BuildingData(125, "1층", null, 0);
            m_dicPlaceID3["1000600101104"] = new BuildingData(125, "옥상", null, 0);
            m_dicPlaceID3["1000600102100"] = new BuildingData(128, "1층", null, 0);
            m_dicPlaceID3["1000600102101"] = new BuildingData(128, "1.1층", null, 0);
            m_dicPlaceID3["1000600102102"] = new BuildingData(129, "2층", null, 1);
            m_dicPlaceID3["1000600102103"] = new BuildingData(129, "2.1층", null, 1);
            m_dicPlaceID3["1000600102104"] = new BuildingData(130, "3층", null, 2);
            m_dicPlaceID3["1000600102105"] = new BuildingData(205, "3.1층", null, 2);
            m_dicPlaceID3["1000600102106"] = new BuildingData(206, "3.2층", null, 2);
            m_dicPlaceID3["1000600102107"] = new BuildingData(131, "4층", null, 3);
            m_dicPlaceID3["1000600102108"] = new BuildingData(207, "4.1층", null, 3);
            m_dicPlaceID3["1000600102109"] = new BuildingData(208, "4.2층", null, 3);
            m_dicPlaceID3["1000700100100"] = new BuildingData(133, "지하1층", null, -1);
            m_dicPlaceID3["1000700100101"] = new BuildingData(134, "1층", null, 0);
            m_dicPlaceID3["1000700100102"] = new BuildingData(135, "2층", null, 1);
            m_dicPlaceID3["1000700100103"] = new BuildingData(135, "옥상", null, 1);
            m_dicPlaceID3["1000700101100"] = new BuildingData(138, "1층", null, 0);
            m_dicPlaceID3["1000700101101"] = new BuildingData(139, "2층", null, 1);
            m_dicPlaceID3["1000700101102"] = new BuildingData(140, "3층", null, 2);
            m_dicPlaceID3["1000700101103"] = new BuildingData(140, "4층", null, 2);
            m_dicPlaceID3["1000700101104"] = new BuildingData(140, "옥상", null, 2);
            m_dicPlaceID3["1000700102100"] = new BuildingData(142, "1층", null, 0);
            m_dicPlaceID3["1000700102101"] = new BuildingData(142, "옥상", null, 0);
            m_dicPlaceID3["1000700102102"] = new BuildingData(142, "2층", null, 0);
            m_dicPlaceID3["1000700103100"] = new BuildingData(143, "1층", null, 0);
            m_dicPlaceID3["1000700103101"] = new BuildingData(143, "옥상", null, 0);
            m_dicPlaceID3["1000700104100"] = new BuildingData(145, "1층", null, 0);
            m_dicPlaceID3["1000700104101"] = new BuildingData(146, "2층", null, 1);
            m_dicPlaceID3["1000700104102"] = new BuildingData(147, "3층", null, 2);
            m_dicPlaceID3["1000700104103"] = new BuildingData(148, "4층", null, 3);
            m_dicPlaceID3["1000700104104"] = new BuildingData(148, "옥상", null, 3);
            m_dicPlaceID3["1000700105100"] = new BuildingData(149, "1층", null, 0);
            m_dicPlaceID3["1000700105101"] = new BuildingData(150, "2층", null, 1);
            m_dicPlaceID3["1000700105102"] = new BuildingData(151, "3층", null, 2);
            m_dicPlaceID3["1000700105103"] = new BuildingData(151, "옥상", null, 2);
            m_dicPlaceID3["1000700106100"] = new BuildingData(152, "1층", null, 0);
            m_dicPlaceID3["1000700106101"] = new BuildingData(152, "옥상", null, 0);
            m_dicPlaceID3["1000800100100"] = new BuildingData(226, "1층", null, 0);
            m_dicPlaceID3["1000800100101"] = new BuildingData(227, "2층", null, 1);
            m_dicPlaceID3["1000800100102"] = new BuildingData(228, "3층", null, 2);
            m_dicPlaceID3["1000800100103"] = new BuildingData(229, "옥상", null, 3);
            m_dicPlaceID3["1000800101100"] = new BuildingData(230, "1층", null, 0);
            m_dicPlaceID3["1000800101101"] = new BuildingData(232, "2층", null, 1);
            m_dicPlaceID3["1000800102100"] = new BuildingData(162, "1층", null, 0);
            m_dicPlaceID3["1000800102101"] = new BuildingData(163, "2층", null, 1);
            m_dicPlaceID3["1000800103100"] = new BuildingData(170, "1층", null, 0);
            m_dicPlaceID3["1000900100100"] = new BuildingData(171, "1층", null, 0);
            m_dicPlaceID3["1000900100101"] = new BuildingData(172, "2층", null, 1);
            m_dicPlaceID3["1000900100102"] = new BuildingData(173, "3층", null, 2);
            m_dicPlaceID3["1000900100103"] = new BuildingData(173, "4층", null, 2);
            m_dicPlaceID3["1000900100104"] = new BuildingData(173, "옥상, null, 2");
            m_dicPlaceID3["1000900100105"] = new BuildingData(174, "지하1층", null, -1);
            m_dicPlaceID3["1000900101100"] = new BuildingData(175, "1층", null, 0);
            m_dicPlaceID3["1000900101101"] = new BuildingData(175, "옥상", null, 0);
            m_dicPlaceID3["1000900102100"] = new BuildingData(176, "1층", null, 0);
            m_dicPlaceID3["1000900102101"] = new BuildingData(176, "옥상", null, 0);
            m_dicPlaceID3["1000900103100"] = new BuildingData(177, "1층", null, 0);
            m_dicPlaceID3["1000900103101"] = new BuildingData(177, "옥상", null, 0);
            m_dicPlaceID3["1000900104100"] = new BuildingData(178, "1층", null, 0);
            m_dicPlaceID3["1000900105100"] = new BuildingData(179, "1층", null, 0);
            m_dicPlaceID3["1000901100100"] = new BuildingData(213, "지하1층", null, 0);
            m_dicPlaceID3["1000901100101"] = new BuildingData(213, "1층", null, 0);
            m_dicPlaceID3["1000901100102"] = new BuildingData(216, "2층", null, 1);
            m_dicPlaceID3["1000901100103"] = new BuildingData(219, "3층", null, 2);
            m_dicPlaceID3["1000901100104"] = new BuildingData(221, "4층", null, 3);
            m_dicPlaceID3["1000901100105"] = new BuildingData(222, "4.1층", null, 3);
            m_dicPlaceID3["1000901100106"] = new BuildingData(223, "4.2층", null, 3);
            m_dicPlaceID3["1000901100107"] = new BuildingData(225, "옥상", null, 4);
            m_dicPlaceID3["2000100100100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100100101"] = new BuildingData(20000, "2층");
            m_dicPlaceID3["2000100100201"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100101100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100101200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100102100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100102200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100103100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100103200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100104100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100104200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100105100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100105200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100106100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100106101"] = new BuildingData(20000, "2층");
            m_dicPlaceID3["2000100106200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100107100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100107200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100108100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100108200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100109100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100109200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000100110100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000100110200"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["2000200100100"] = new BuildingData(20000, "지하1층");
            m_dicPlaceID3["2000200100101"] = new BuildingData(20000, "지하2층");
            m_dicPlaceID3["2000200100102"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["2000200100103"] = new BuildingData(20000, "2층");
            m_dicPlaceID3["2000200100104"] = new BuildingData(20000, "3층");
            m_dicPlaceID3["2000200100105"] = new BuildingData(20000, "4층");
            m_dicPlaceID3["2000200100106"] = new BuildingData(20000, "5층");
            m_dicPlaceID3["2000200100107"] = new BuildingData(20000, "6층");
            m_dicPlaceID3["2000200100108"] = new BuildingData(20000, "7층");
            m_dicPlaceID3["2000200100208"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["3000100100100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["3000100100101"] = new BuildingData(20000, "2층");
            m_dicPlaceID3["3000100100102"] = new BuildingData(20000, "3층");
            m_dicPlaceID3["3000100100103"] = new BuildingData(20000, "지하1층");
            m_dicPlaceID3["3000100100104"] = new BuildingData(20000, "4층");
            m_dicPlaceID3["3000100100204"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["3000100101100"] = new BuildingData(20000, "지하2층");
            m_dicPlaceID3["3000100101101"] = new BuildingData(20000, "지하1층");
            m_dicPlaceID3["3000100101102"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["3000100101202"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["4000100100100"] = new BuildingData(20000, "1층");
            m_dicPlaceID3["4000100100101"] = new BuildingData(20000, "2층");
            m_dicPlaceID3["4000100100102"] = new BuildingData(20000, "3층");
            m_dicPlaceID3["4000100100103"] = new BuildingData(20000, "4층");
            m_dicPlaceID3["4000100100104"] = new BuildingData(20000, "5층");
            m_dicPlaceID3["4000100100105"] = new BuildingData(20000, "6층");
            m_dicPlaceID3["4000100100106"] = new BuildingData(20000, "7층");
            m_dicPlaceID3["4000100100107"] = new BuildingData(20000, "8층");
            m_dicPlaceID3["4000100100108"] = new BuildingData(20000, "지하1층");
            m_dicPlaceID3["4000100100109"] = new BuildingData(20000, "지하2층");
            m_dicPlaceID3["4000100100110"] = new BuildingData(20000, "지하3층");
            m_dicPlaceID3["4000100100111"] = new BuildingData(20000, "9층");
            m_dicPlaceID3["4000100100112"] = new BuildingData(20000, "지하4층");
            m_dicPlaceID3["4000100100211"] = new BuildingData(20000, "옥상");
            m_dicPlaceID3["10006001021010"] = new BuildingData(208, "4.3층", null, 3);
            m_dicPlaceID3["10006001021011"] = new BuildingData(132, "5층", null, 4);
            m_dicPlaceID3["10006001021012"] = new BuildingData(128, "지하1층", null, 0);
            m_dicPlaceID3["10006001021013"] = new BuildingData(132, "옥상", null, 4);

        }

        public ResponseTodayWorkList GetTodayWorkList()
        {
            ResponseTodayWorkList response = new ResponseTodayWorkList();

            DateTime dtToday = DateTime.Today;
            DateTime dtTomorrow = dtToday.AddDays(1);

            string strSQL = string.Format($"Select SAFE_WKOD_ID, PLACE_ID3, PLAN_NAME, WORK_GBN, WORK_ENTRANT_NAME, COMPANY_GBN, SDATE, EDATE, SUBCONTRACTOR_NAME, FIELD_MANAGER_NAME, FIELD_PEOPLE_NUM, APPR_DEPT1, APPR_DEPT2, STIME, ETIME, PLACE_ID, PLACE_ID2, CONST_NAME" +
                $" From SWOT_DSAFE_WKOD_NEW Where SDATE >='{dtToday.ToString("yyyy-MM-dd 00:00:00")}' And SDATE < '{dtTomorrow.ToString("yyyy-MM-dd 00:00:00")}' And [STATUS] = 'S_WO_DSAFE_STATUS_APPROVE'");

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                response.Success = false;
                response.Message = $"SWOT_DSAFE_WKOD_NEW 조회 실패: " + m_dbManager.LastErrorMessage;
                return response;
            }

            int nCount = arrResult.Count;

            for (int i = 0; i < nCount - 17; i += 18)
            {
                int SAFE_WKOD_ID = WebDBManager.GetIntField(arrResult[i].ToString(), -1);
                string strPLACE_ID3 = WebDBManager.GetStringField(arrResult[i + 1].ToString());
                string strPLAN_NAME = WebDBManager.GetStringField(arrResult[i + 2].ToString());
                string strWORK_GBN = WebDBManager.GetStringField(arrResult[i + 3].ToString());
                string strWORK_ENTRANT_NAME = WebDBManager.GetStringField(arrResult[i + 4].ToString());
                string strCOMPANY_GBN = WebDBManager.GetStringField(arrResult[i + 5].ToString());
                VariousData<DateTime> SDATE = WebDBManager.GetDateTimeField(arrResult[i + 6]);
                VariousData<DateTime> EDATE = WebDBManager.GetDateTimeField(arrResult[i + 7]);
                string strSUBCONTRACTOR_NAME = WebDBManager.GetStringField(arrResult[i + 8].ToString());
                string strFIELD_MANAGER_NAME = WebDBManager.GetStringField(arrResult[i + 9].ToString());
                int nFIELD_PEOPLE_NUM = WebDBManager.GetIntField(arrResult[i + 10].ToString(), 0);
                string strAPPR_DEPT1 = WebDBManager.GetStringField(arrResult[i + 11].ToString());
                string strAPPR_DEPT2 = WebDBManager.GetStringField(arrResult[i + 12].ToString());
                string strSTIME = WebDBManager.GetStringField(arrResult[i + 13].ToString());
                string strETIME = WebDBManager.GetStringField(arrResult[i + 14].ToString());

                string strPLACE_ID = WebDBManager.GetStringField(arrResult[i + 15].ToString());
                string strPLACE_ID2 = WebDBManager.GetStringField(arrResult[i + 16].ToString());

                string strCONST_NAME = WebDBManager.GetStringField(arrResult[i + 17].ToString());

                DateTime dtSDATE = DateTime.Today;
                DateTime? dtEDATE = null;

                if (SDATE != null)
                    dtSDATE = SDATE.Data;
                if (EDATE != null)
                    dtEDATE = EDATE.Data;

                if (SAFE_WKOD_ID < 0)
                    continue;

                if (response.WorkList == null)
                    response.WorkList = new List<WorkList>();

                WorkList work = new WorkList();
                work.ID = SAFE_WKOD_ID;
                //work.PLAN_NAME = strPLAN_NAME;
                work.PLAN_NAME = strCONST_NAME;
                work.WORK_ENTRANT_NAME = strWORK_ENTRANT_NAME;
                work.COMPANY_GBN = strCOMPANY_GBN;
                work.SDATE = dtSDATE.ToString("yyyyy-MM-dd ") + strSTIME;
                //work.EDATE = dtSDATE.ToString("yyyyy-MM-dd ") + strETIME;
                work.EDATE = strETIME;
                work.SUBCONTRACTOR_NAME = strSUBCONTRACTOR_NAME;
                work.FIELD_MANAGER_NAME = strFIELD_MANAGER_NAME;
                work.FIELD_PEOPLE_NUM = nFIELD_PEOPLE_NUM;
                

                // 장소 데이터 변환
                string strPLACE_NAME = "";
                if (strPLACE_ID != null && strPLACE_ID.Length > 0 && m_dicPlaceID.ContainsKey(strPLACE_ID))
                {
                    BuildingData buildingData = m_dicPlaceID[strPLACE_ID];
                    strPLACE_NAME = buildingData.DisplayName;
                    work.BuildingGroupID = buildingData.ID;
                    work.BuildingGroupName = buildingData.Name;
                }

                if (strPLACE_ID2 != null && strPLACE_ID2.Length > 0 && m_dicPlaceID2.ContainsKey(strPLACE_ID2))
                {
                    BuildingData buildingData = m_dicPlaceID2[strPLACE_ID2];
                    if (strPLACE_NAME.Length == 0)
                        strPLACE_NAME = buildingData.DisplayName;
                    else
                        strPLACE_NAME += " " + buildingData.DisplayName;
                    work.BuildingID = buildingData.ID;
                }

                if (strPLACE_ID3 != null && strPLACE_ID3.Length > 0 && m_dicPlaceID3.ContainsKey(strPLACE_ID3))
                {
                    BuildingData buildingData = m_dicPlaceID3[strPLACE_ID3];
                    if (strPLACE_NAME.Length == 0)
                        strPLACE_NAME = buildingData.DisplayName;
                    else
                        strPLACE_NAME += " " + buildingData.DisplayName;

                    work.ZoneID = buildingData.ID;
                    work.FloorIndex = buildingData.FloorIndex;
                }

                work.PLACE_NAME = strPLACE_NAME;

                // 부서 변환
                if (m_dicTeamData.ContainsKey(strAPPR_DEPT1))
                    work.APPR_DEPT1 = m_dicTeamData[strAPPR_DEPT1];
                if (m_dicTeamData.ContainsKey(strAPPR_DEPT2))
                    work.APPR_DEPT2 = m_dicTeamData[strAPPR_DEPT2];


                // 작업 종류
                if (m_dicWorkData.ContainsKey(strWORK_GBN))
                    work.WORK_GBN = m_dicWorkData[strWORK_GBN];

                response.WorkList.Add(work);
            }

            response.Success = true;
            return response;
        }
    }
}
