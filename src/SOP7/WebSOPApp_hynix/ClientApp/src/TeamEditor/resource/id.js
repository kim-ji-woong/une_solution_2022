import ProjectResource from "../../Root/resource/id";

export default class TeamEditorResource {
    static menu = {
        근무표: "근무표",
        고정_근무표: "고정 근무표",
        실시간_근무표: "실시간 근무표",
        조직: "조직",
        평일_비상조직: "평일 비상조직",
        휴일_비상조직: "휴일 비상조직"
    }

    static sortType = {
        regularName: 0,
        memberName: 1,
        jobLevelName: 2,
		jopPositionName: 3,
		phoneNumber: 4,
		memberID: 5,
		officePhoneNumber: 6,
		email: 7
    }
}