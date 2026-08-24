import ProjectResource from "../../Root/resource/id";

export default class HistoryResource {
    static menu = {
        데이터_수정_이력: "데이터 수정 이력",
        센서_탐지_이력: "센서 탐지 이력",
        센서_탐지_분석: "센서 탐지 분석",
        SOP_이력: "SOP 이력",
        상황전파_이력: "상황전파 이력",
        상세보기: "상세보기",
        안전구역_평가_이력: "안전구역 평가 이력",
        이벤트_이력: "이벤트 이력",
        고장_이력: "고장 이력",
        점검_이력: "점검 이력",
        차량과속_이력: "차량과속 이력",
        반복과속_의심차량: "반복 과속 의심차량",
    }

    static AssessmentClass = {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E"
    }

    static AssessmentType = {
        EqZone: 1,
        Environ: 2
    };
}