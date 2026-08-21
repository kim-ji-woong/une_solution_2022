# BusanElectron

## 프로젝트 기본 설정

settings.json 파일에서 프로젝트 기본 설정이 가능하다.

settings.json 예시
```
{
  "executionTypes": [ "main", "no connection", "seperate" ],
  "executionType": "main",
  "logTypes": [ "main", "event", "all" ],
  "logType": "main",
  "websocket": {
    "unity": 65533,
    "web": 1237
  },
  "project": {
    "preload": "preload.js",
    "color": "#293239"
  },
  "webfront": {
    "url": "http://192.168.0.241:12002/",
    "zoomFactor": 1.0
  },
  "unity": {
    "filename": "ICProject",
    "dir": "/exe/unity"
  }
}
```

- `executionTypes`
  - 프로젝트 실행 타입 목록
  - ["main", "seperate", "no connectoin"]
- `executionType` 
  - 프로젝트 실행 타입 지정
  - `main` : 기본값. electron + web + unity 가 통합되어 실행되는 버전
  - `seperate` : electron + web만 실행되는 버전. 유니티는 별도 실행 필요
  - `no connection` : 웹소켓통신 연결 없이 프로젝트만 실행하는 버전
- `logTypes`
  - 저장할 로그 타입 목록
  - ["main", "event", "all"]
- `logType`
  - 저장할 로그 타입 지정
  - `main` : 기본값. 일렉트론 메인 파일에서 발생하는 로그만 저장.
    - 프로그램 실행/종료 로그. 웹소켓통신 연결/해제/메시지송수신 로그.
  - `event` : 일렉트론에서 발생하는 input 이벤트에 관련한 로그만 저장.
    - 마우스 이벤트, 키보드 이벤트, 터치 이벤트 등
  - `all` : 일렉트론에서 출력되는 모든 로그를 파일로 저장
- `websocket`
  - 웹소켓통신 포트 지정
  - `unity` : electorn, unity 간의 웹소켓통신포트 지정
  - `web` : electron, web 간의 웹소켓통신포트 지정
- `project`
  - 프로젝트 기본 설정
  - `preload` : 터치 이벤트 제어를 위한 preload 스크립트 경로
  - `color` : 웹프론트 로딩 전 표출할 배경석 지정
- `webfront`
  - 웹프론트 관련 설정
  - `url` : 연결할 웹프론트 url
  - `zoomFactor` : 웹프론트 기본 줌 배율 지정. 기본값 1.0이며 1.0 = 100%
- `unity`
  - 유니티 관련 설정
  - `filename` : 유니티 빌드 파일 이름
  - `dir` : 유니티 빌드 파일 위치

<br>

## 프로젝트 실행
- `npm install` : 필요한 의존성 모듈 설치
- `npm run start` : 프로젝트 실행