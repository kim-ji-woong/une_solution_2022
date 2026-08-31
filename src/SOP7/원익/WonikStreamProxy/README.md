# WonikStreamProxy — go2rtc 인증 리버스 프록시

go2rtc(미디어 서버) 앞단에 두어, **로그인한 사용자만 CCTV 영상에 접근**하도록 하는 프록시입니다.
브라우저가 go2rtc 에 직접 붙던 것을 이 프록시로 돌려, 요청의 **JWT 토큰(또는 쿠키)** 을 검증한 뒤에만 go2rtc 로 전달합니다.

```
브라우저 ─(…?token=<JWT>)─▶ WonikStreamProxy(:1984)  ── 토큰 검증 ──▶ go2rtc(127.0.0.1:1985)
                                       └ 실패 → 401
```

- 토큰 서명 검증: HMAC-SHA256, **WebSOPApp 과 동일한 `Auth:Secret`**.
- WebSocket(go2rtc MSE, `/api/ws`) 프록시 지원(YARP).
- `Auth:Enabled=false` 면 검증 없이 그대로 프록시(기존 동작).

---

## 1. 빌드 (.NET 8 SDK 필요)

런타임 미설치 Windows 서버에서도 돌아가도록 **자체 포함 단일 exe** 로 배포 권장:

```
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o publish
```

`publish\WonikStreamProxy.exe` + `publish\appsettings.json` 를 미디어 서버(10.6.13.44)로 복사.

## 2. go2rtc 를 localhost 로 숨기기

`C:\UnE\go2rtc-1.9.2\go2rtc.yaml`:

```yaml
api:
  listen: "127.0.0.1:1985"   # 기존 :1984(전체 공개) → 로컬 전용, 포트 변경
# RTSP 를 외부에서 안 받아도 되면 함께 로컬로:
# rtsp:
#   listen: "127.0.0.1:8554"
```

→ go2rtc 재시작. 이제 go2rtc 는 이 서버 로컬에서만 접근됩니다.

## 3. 프록시 설정 (`appsettings.json`)

- `Urls`: 프록시 공개 포트. **기존 go2rtc 가 쓰던 `1984`** 를 그대로 사용 → 프론트 주소(streamServerURL) 변경 최소화.
- `ReverseProxy...Destinations.d1.Address`: `http://127.0.0.1:1985/` (숨긴 go2rtc).
- `Auth:Secret`: **WebSOPApp 의 `Auth:Secret` 과 동일**하게 설정.
- `Auth:Issuer/Audience`: WebSOPApp 이 발급하는 **스트림 토큰의 iss/aud** 와 일치(기본 `WebSOPApp` / `go2rtc`).
- `Auth:Enabled`: 연동 준비 전에는 `false` 로 두고, 준비되면 `true`.

## 4. Windows 서비스로 등록 (부팅 시 자동 실행)

**NSSM** 사용 예:
```
nssm install WonikStreamProxy "C:\path\publish\WonikStreamProxy.exe"
nssm set WonikStreamProxy AppDirectory "C:\path\publish"
nssm start WonikStreamProxy
```
또는 내장 `sc.exe`:
```
sc create WonikStreamProxy binPath= "C:\path\publish\WonikStreamProxy.exe" start= auto
sc start WonikStreamProxy
```

## 5. 방화벽

- go2rtc(**1985**, 필요시 **8554**): **localhost 만** (외부 차단).
- 프록시(**1984**): **CCTV 를 봐야 하는 내부 클라이언트 대역 + WebSOPApp/BeaconServer 호스트만** 허용.

---

## 6. 연동에 필요한 나머지 작업 (아직 미구현)

이 프록시는 "토큰을 검증"하는 쪽입니다. **토큰을 발급·전달**하는 두 부분이 더 필요합니다:

1. **WebSOPApp**: 로그인 뒤 호출하는 **인증된 스트림 토큰 발급 엔드포인트** 추가
   - `WebSOPApp.Security.JwtHmac.Create(secret, "WebSOPApp", "go2rtc", "", 만료분)` 로 **단명 JWT** 반환(응답 본문).
   - 동일 `Auth:Secret` 사용.

2. **프론트(cctvInfo.jsx)**: 영상 URL 에 그 토큰을 부착
   - 현재: `{streamServerURL}/stream.html?src=<id>&mode=mse`
   - 변경: `…&token=<발급받은 JWT>`
   - 참고: go2rtc `stream.html` 이 여는 WebSocket(`/api/ws`)에는 이 토큰이 안 붙으므로,
     - (A) 이 프록시가 최초 토큰 검증 시 심어주는 **쿠키**로 후속 WS 를 통과시키거나(HTTP 는 iframe 교차 컨텍스트 제약이 있어 **HTTPS 권장**), 또는
     - (B) go2rtc `stream.html` 대신 **직접 `ws://…/api/ws?src=<id>&token=<JWT>` 로 여는 커스텀 MSE 플레이어**를 쓰면 쿠키 없이 확실합니다(권장).

→ 원하시면 1·2 도 이어서 구현해 드립니다.

---

## 동작 확인
- `Auth:Enabled=false` 로 먼저 띄워 **영상이 프록시를 거쳐 정상 재생**되는지 확인(무중단 검증).
- 그 다음 토큰 발급/부착(6번)을 배포하고 `Auth:Enabled=true` 로 전환 → **토큰 없는 접근은 401**.
