// 이력 조회 - 숫자 표시 공통 규칙
//   - 1,000 이상의 숫자는 천 단위마다 쉼표(,)를 넣는다. (예: 10875 -> 10,875)
// 카드 · 표 · 그래프(축 눈금 · 막대 위 값 · 툴팁)에 동일하게 적용한다.

// 숫자를 천 단위 쉼표로 표시한다.
//   fractionDigits : 소수 자릿수를 고정할 때만 넘긴다. (예: formatNumber(62.34, 1) -> '62.3')
//   숫자가 아니면(null, '-' 등) 받은 값을 그대로 돌려준다.
export function formatNumber(value, fractionDigits) {
	if (value === null || value === undefined || value === '') {
		return value;
	}

	const n = (typeof value === 'number') ? value : Number(value);
	if (!isFinite(n)) {
		return value;
	}

	if (fractionDigits === undefined) {
		return n.toLocaleString('ko-KR');
	}

	return n.toLocaleString('ko-KR', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
}
