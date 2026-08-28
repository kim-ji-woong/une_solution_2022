// WonikBeaconServer(포트 2420) 호출용 인증 유틸.
//   - 로그인 성공 시 서버가 응답 헤더(X-Api-Token)로 내려준 JWT 를 localStorage 에 저장한다.
//   - BeaconServer 를 호출할 때 Authorization: Bearer <token> 헤더로 첨부한다.
//   - 토큰이 없으면 헤더 없이 호출한다(서버가 Auth:Enabled=false 이면 그대로 동작).

const TOKEN_KEY = 'apiToken';

// 로그인 응답(fetch Response)에서 토큰을 꺼내 저장한다.
export function saveApiTokenFromResponse(res) {
	try {
		if (!res || !res.headers) return;
		const token = res.headers.get('X-Api-Token');
		if (token) localStorage.setItem(TOKEN_KEY, token);
	} catch (e) {
		// localStorage 접근 불가 등은 무시
	}
}

export function getApiToken() {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch (e) {
		return null;
	}
}

export function clearApiToken() {
	try {
		localStorage.removeItem(TOKEN_KEY);
	} catch (e) {
		// 무시
	}
}

// BeaconServer 호출용 헤더 (Content-Type + Authorization)
export function beaconHeaders() {
	const headers = { 'Content-Type': 'application/json' };
	const token = getApiToken();
	if (token) headers['Authorization'] = 'Bearer ' + token;
	return headers;
}
