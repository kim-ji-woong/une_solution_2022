// 이력 조회 - 조회기간 공통 규칙
//   - 시작일자: 현재 날짜로부터 최대 1년 전까지 선택 가능
//   - 종료일자: 현재 날짜까지 선택 가능
// 모든 이력 조회 화면의 DatePicker 에 동일하게 적용한다.

// 선택 가능한 최소 일자 (현재로부터 1년 전)
export function getSearchMinDate() {
	const d = new Date();
	d.setFullYear(d.getFullYear() - 1);
	return d;
}

// 선택 가능한 최대 일자 (현재 일자)
export function getSearchMaxDate() {
	return new Date();
}
