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

// go2rtc(stream.html) 영상 URL 처리.
//   - 스트림 토큰이 없으면(Auth:Enabled=false) 원래 URL(go2rtc stream.html) 그대로 반환 → 예전 방식.
//   - 토큰이 있으면(Auth:Enabled=true) WebSOPApp 이 호스팅하는 커스텀 MSE 플레이어(streamPlayer.html) URL 로 전환한다.
//     · go2rtc stream.html 은 영상 WebSocket 에 토큰을 못 실어, 교차 사이트/HTTP 에서 쿠키가 막혀 401 이 난다.
//     · 커스텀 플레이어는 토큰을 WS URL 에 직접 실어(ws://proxy/api/ws?src=..&token=..) 쿠키 없이 통과시킨다.
export function withStreamToken(url) {
	try {
		if (!url || url.indexOf('/stream.html') === -1) return url;   // go2rtc 스트림 URL 이 아니면 그대로
		const token = getStreamToken();
		if (!token) return url;   // Auth off → 예전 방식(원래 stream.html)

		const base = url.substring(0, url.indexOf('/stream.html'));   // 프록시 베이스: 예) http://10.6.13.44:1984
		const m = url.match(/[?&]src=([^&]+)/);                       // 스트림 이름(뒤에 ?w= 등이 붙어도 안전하게 추출)
		const src = m ? m[1] : '';

		return '/streamPlayer.html?proxy=' + encodeURIComponent(base)
			+ '&src=' + encodeURIComponent(src)
			+ '&token=' + encodeURIComponent(token);
	} catch (e) {
		return url;
	}
}
