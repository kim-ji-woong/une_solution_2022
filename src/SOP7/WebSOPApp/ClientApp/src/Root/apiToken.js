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

// ── go2rtc 인증 프록시(WonikStreamProxy)용 스트림 토큰 ──
//   - 로그인/세션확인 성공 시 서버가 응답 헤더(X-Stream-Token)로 내려준 JWT(aud=go2rtc)를 저장한다.
//   - 영상 URL(stream.html?src=...&mode=mse) 에 &token=<JWT> 로 부착 → 프록시가 검증 후 통과시킨다.
//   - 토큰이 없으면 URL 을 그대로 둔다(프록시 Auth:Enabled=false 이면 그대로 동작).
const STREAM_TOKEN_KEY = 'streamToken';

export function saveStreamTokenFromResponse(res) {
	try {
		if (!res || !res.headers) return;
		const token = res.headers.get('X-Stream-Token');
		// Auth:Enabled=true 면 서버가 토큰을 내려줌 → 저장. false 면 헤더가 없음 → 저장분 제거(예전 방식으로 복귀).
		if (token) localStorage.setItem(STREAM_TOKEN_KEY, token);
		else localStorage.removeItem(STREAM_TOKEN_KEY);
	} catch (e) {
		// 무시
	}
}

export function getStreamToken() {
	try {
		return localStorage.getItem(STREAM_TOKEN_KEY);
	} catch (e) {
		return null;
	}
}

// go2rtc(stream.html) URL 에만 최신 스트림 토큰을 부착한다. 다른 URL(직접 카메라 http 등)은 그대로 반환.
export function withStreamToken(url) {
	try {
		if (!url || url.indexOf('/stream.html') === -1) return url;
		const token = getStreamToken();
		if (!token) return url;
		// 기존 token 파라미터가 있으면 제거 후 최신값으로 재부착(만료 대비)
		let base = url.replace(/([?&])token=[^&]*/g, '$1').replace(/[?&]$/, '');
		const sep = base.indexOf('?') === -1 ? '?' : '&';
		return base + sep + 'token=' + encodeURIComponent(token);
	} catch (e) {
		return url;
	}
}
