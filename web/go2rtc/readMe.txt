1. 빌드
- 커맨드 창에서 go2rtc 폴더 경로로 이동한다.

>cd \go2rtc
>go build .

다만 go 버전이 1.20 이상이여야 빌드가 실행된다.




2. 스트림 설정
- go2rtc.exe 같은 위치에 go2rtc.yaml 생성 후 아래와 같이 추가

streams:
    1:
    - rtsp://admin:9449966Ab@192.168.0.233:554/trackID=1
    2:
    - rtsp://admin:9449966Ab@192.168.0.233:554/trackID=2
	
	
1과 2는 src ID로 문자열 형식으로도 지정이 가능
해당하는 rtsp 주소를 ID 밑에 지정하면 된다.




3. 영상 스트림 URL 방식
[미디어 서버 URL]:[port]/stream.html?src=[스트림 ID]&mode=[스트림 방식]
- 스트림 방식: webrtc, mse, mp4, mjpeg >> 다 함께 쓴다면 카메라 영상 코덱에 따라 방식을 자동 설정 

ex) http://127.0.0.1:1984/stream.html?src=1&mode=mse



4. git 주소
https://github.com/AlexxIT/go2rtc




5. ffmpeg 사용법 (코덱 변환 h.265 >> h.264)
- ffmpeg 홈페이지(https://www.ffmpeg.org/)에 접속하여 다운 받는다. 
- 해당 프로그램을 원하는 경로에 넣고 환경변수 실행파일(./bin/ffmpeg.exe)을 등록한다.
- cmd 창에서 ffmpeg 명령어를 입력하여 동작을 확인한다.
- go2rtc.yaml 설정 파일에서 rtsp url 입력하는 장소에 ffmpeg 변환 url 작성한다.

예시) 
    5192:
    - rtsp://admin:Dnjsdlr1!@10.6.11.203:554/live/1/2

위 주소가 h.265 rtsp url 주소이라면 다음과 같이 h.264 변환 할 수 있다.

    5192:
    - ffmpeg:rtsp://admin:Dnjsdlr1!@10.6.11.203:554/live/1/2#video=h264





