using Microsoft.AspNetCore.Http;
using WonikStreamProxy;

var builder = WebApplication.CreateBuilder(args);

#if SERVICE
// SERVICE 심볼이 정의된 빌드에서만 Windows 서비스로 동작(부팅 시 자동 시작).
//   서비스로 뜰 때 ContentRoot 를 exe 폴더로 잡아주므로 appsettings.json 을 정상적으로 읽는다.
//   심볼이 없는(콘솔) 빌드에서는 이 호출이 컴파일에 포함되지 않아 일반 콘솔 앱으로 실행된다.
builder.Host.UseWindowsService();
#endif

// YARP 리버스 프록시 (appsettings.json 의 ReverseProxy 섹션 사용)
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// --- 설정 읽기 ---
var cfg = app.Configuration;
bool authEnabled = bool.TryParse(cfg["Auth:Enabled"], out var ae) && ae;
string secret = cfg["Auth:Secret"] ?? "";
string issuer = cfg["Auth:Issuer"] ?? "";
string audience = cfg["Auth:Audience"] ?? "";
string cookieName = string.IsNullOrEmpty(cfg["Auth:CookieName"]) ? "go2rtc_auth" : cfg["Auth:CookieName"];

// === 인증 미들웨어 ===
//   Auth:Enabled=true 일 때만 검사. go2rtc 로 넘기기 전에 토큰/쿠키를 검증한다.
//   1) ?token=<JWT> (WebSocket 업그레이드 포함 모든 요청에 적용) → 유효하면 통과 + 같은 출처 쿠키 발급
//   2) 쿠키(go2rtc_auth) → 유효하면 통과 (stream.html 이 여는 후속 WS/자산 요청 커버)
//   3) 둘 다 없으면 401
app.Use(async (context, next) =>
{
    if (authEnabled)
    {
        bool ok = false;
        string reason = "no credential";

        string token = context.Request.Query["token"];
        if (!string.IsNullOrEmpty(token) && JwtValidator.Validate(token, secret, issuer, audience, out reason))
        {
            ok = true;

            // 후속 요청(자산/WS)용 브리지 쿠키. HTTPS 면 SameSite=None(iframe 교차 컨텍스트 허용), HTTP 면 Lax.
            context.Response.Cookies.Append(cookieName, token, new CookieOptions
            {
                HttpOnly = true,
                Secure = context.Request.IsHttps,
                SameSite = context.Request.IsHttps ? SameSiteMode.None : SameSiteMode.Lax,
                Path = "/"
            });
        }

        if (!ok)
        {
            string cookie = context.Request.Cookies[cookieName];
            if (!string.IsNullOrEmpty(cookie) && JwtValidator.Validate(cookie, secret, issuer, audience, out reason))
                ok = true;
        }

        if (!ok)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized: " + reason);
            return;
        }
    }

    await next();
});

// 모든 경로를 go2rtc(로컬)로 프록시 (WebSocket 포함)
app.MapReverseProxy();

app.Run();
