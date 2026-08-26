// 배포된 새 빌드를 자동으로 감지해 새로고침한다.
//   - 빌드 때마다 asset-manifest.json 의 main.js 파일명(해시)이 바뀐다.
//   - 주기적으로 이 값을 확인해, 처음 로드 때와 달라지면(=재배포) window.location.reload() 로 새 버전을 불러온다.
//   - 서비스워커 캐시로 인한 지연을 피하려고 index.js 에서 서비스워커는 unregister 한다.

function getBaseUrl() {
	const base = document.getElementsByTagName('base')[0];
	let href = (base && base.getAttribute('href')) || '/';
	if (!href.endsWith('/')) href += '/';
	return href;
}

async function fetchBuildId() {
	try {
		// 캐시를 타지 않도록 no-store + 캐시버스터
		const url = getBaseUrl() + 'asset-manifest.json?t=' + Date.now();
		const res = await fetch(url, { cache: 'no-store' });
		if (!res.ok) return null;

		const manifest = await res.json();
		const files = manifest.files || manifest;   // CRA 버전에 따라 구조 차이 대응
		return files['main.js'] || JSON.stringify(files);
	} catch (e) {
		return null;
	}
}

// intervalMs 마다 배포 여부를 확인한다. (기본 60초)
export function initVersionChecker(intervalMs) {
	intervalMs = intervalMs || 60000;

	let loadedBuildId = null;

	// 현재 로드된 빌드 식별값
	fetchBuildId().then((id) => { loadedBuildId = id; });

	setInterval(async () => {
		const current = await fetchBuildId();
		if (!current) return;                         // 조회 실패 시 아무것도 안 함(오탐 방지)
		if (!loadedBuildId) { loadedBuildId = current; return; }

		if (current !== loadedBuildId) {
			// 새 빌드가 배포됨 → 자동 새로고침
			window.location.reload();
		}
	}, intervalMs);
}
