using dnsTcpLib2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WonikBeaconServer.SpeedDetection
{
    class DetectionProvider : ClientServiceProvider
    {
        public enum TYPE { Speed = 0, Time }

        public static byte OPCODE_SPEED = 0x01;
        public static byte OPCODE_TIME = 0x03;

        public static int SPEED_LENGTH = 3;
        public static int TIME_LENGTH = 6;

        public static byte START = 0x40;
        public static byte END = 0x21;

        private static int ERROR_SLEEP = 1000 * 60;
        private static int TIME_SLEEP = 1000 * 60 * 5;
        private static int RELOAD_SLEEP = 1000 * 60 * 10;

        private string m_strServerIP = null;
        private int m_nPort = 0;

        private bool m_runThread = false;
        private bool m_bIsConnect = false;

        Thread m_ConnectionThread = null;

        //private Logger m_logger = null;

        DateTime m_dtLastTime = DateTime.Now;
        TimeSpan  m_diffDFS = new TimeSpan();

        private byte m_lastDistance = 0x00;
        private bool m_bIsNewCar = true;

        DetectionManager m_parent = null;

        public DetectionProvider(DetectionManager parent, string strServerIP, int nPort)
        {
            m_parent = parent;

            m_strServerIP = strServerIP;
            m_nPort = nPort;

            //m_logger = new Logger($"DetectionProvider_{strServerIP}");
        }

        public override void OnDropConnection()
        {
            //throw new NotImplementedException();
            m_bIsConnect = false;
            m_parent.WriteLog("OnDropConnection() : 연결 끊김 " + m_strServerIP + ":" + m_nPort.ToString());

            m_runThread = false;
            Thread.Sleep(RELOAD_SLEEP);
            
            // 부모에서 재 생성한 뒤 재 연결
            m_parent.ReConnection(m_strServerIP);
        }

        public override void OnReceiveData()
        {
            try
            {
                byte[] data = this.ReceivedData;

                //WriteBinaryLog(data, 0, data.Length, $"[Received ({m_strServerIP})]");                

                if (data == null)
                {
                    m_parent.WriteLog($"OnReceiveData() ERROR ({m_strServerIP}) (ReceivedData 값이 NULL)");
                    return;
                }

                byte start = data[0];
                byte end = data[data.Length - 1];                
                byte mode = data[1];
                byte opcode = data[2];

                byte[] arrLength = new byte[2];
                Array.Copy(data, 3, arrLength, 0, arrLength.Length);
                UInt16 nLength = BitConverter.ToUInt16(arrLength, 0);

                if (start != START || end != END)
                {
                    m_parent.WriteLog($"OnReceiveData() ERROR ({m_strServerIP}) : START, END  데이터가 올바르지 않습니다. (START: {string.Format("{0:X2}", start)} END: {string.Format("{0:X2}", end)})");
                    return;
                }
                else if (nLength < 1)
                {
                    m_parent.WriteLog($"OnReceiveData() ERROR ({m_strServerIP}) : Length 데이터가 올바르지 않습니다. (Length: {nLength})");
                    return;
                }
                else if (mode != 0x04 || (opcode != OPCODE_SPEED && opcode != OPCODE_TIME))
                {
                    if (mode == 0x05 && opcode == 0x00)
                    {   // 김우형 대리 예외처리 부탁함 - 20250723
                        // 데이터 너무 쌓이기 때문에 로그 처리 안함
                        //m_parent.WriteLog($"OnReceiveData() ERROR ({m_strServerIP}) : mode, opcode 데이터가 올바르지 않습니다. (MODE: {string.Format("{0:X2}", mode)}, OPCODE: {string.Format("{0:X2}", opcode)})");
                    }
                    else
                        m_parent.WriteLog($"OnReceiveData() ERROR ({m_strServerIP}) : mode, opcode 데이터가 올바르지 않습니다. (MODE: {string.Format("{0:X2}", mode)}, OPCODE: {string.Format("{0:X2}", opcode)})");

                    return;
                }              
                else if ((opcode == OPCODE_SPEED && nLength != SPEED_LENGTH) || (opcode == OPCODE_TIME && nLength != TIME_LENGTH))
                {
                    m_parent.WriteLog($"OnReceiveData() ERROR ({m_strServerIP}) : opcode, length 데이터가 맞지 않습니다. (OPCODE: {string.Format("{0:X2}", opcode)}, LENGTH: {nLength})");
                    return;
                }

                m_dtLastTime = DateTime.Now;

                byte[] arrResData = new byte[nLength];
                Array.Copy(data, 5, arrResData, 0, arrResData.Length);

                if (opcode == OPCODE_SPEED)
                {
                    byte speed = arrResData[0];
                    byte distance = arrResData[1];
                    byte lane = arrResData[2];

                    m_parent.WriteLog($"OnReceiveData() ({m_strServerIP}) : 속도 데이터 수신 (속도: {speed}km/h, 거리: {distance}m, 차선: {lane})");

                    // 기존 인식된 거리보다 더 클 경우 새로운 차로 인식
                    if (distance > m_lastDistance + 10)
                    {
                        m_parent.WriteLog($"OnReceiveData() ({m_strServerIP}) : 새로운 차량 인식, 마지막 측정거리: {m_lastDistance}, 신규 측정거리: {distance})");
                        m_bIsNewCar = true;
                    }                        

                    m_lastDistance = distance;

                    // 기준 속도 "초과"만 기록 (appsettings.json 의 SpeedDetection:SpeedLimit, 기본 25 → 26km/h 부터)
                    // 측정 거리가 70 M 이상도 제외
                    if (speed <= Startup.ConfigManager.SpeedDetection.SpeedLimit || distance > 70)
                        return;

                    DateTime dtNow = DateTime.Now;

                    double diffTime = m_diffDFS.TotalMilliseconds * -1;
                    //DateTime dtAlarmTime = dtNow.AddMinutes(diffTime);
                    DateTime dtAlarmTime = dtNow;

                    // 새로운 차량일 경우만 과속 기록
                    if (m_bIsNewCar == true)
                    {   // 차량 과속 테이블에 데이터 생성
                        // 동일 차량은 한번만 기록
                        m_bIsNewCar = false;

                        // 테이블 생성 하지 않았기 때문에 주석처리 중 -----------------------------------------------
                        if (m_parent.InsertSpeedDetection((int)speed, dtAlarmTime, m_strServerIP, out string strErrorMessage) == false)
                        {
                            m_parent.WriteLog($"InsertSpeedDetection() ({m_strServerIP}) Error (speed: {speed}, DetectionTime: {dtAlarmTime.ToString("yyyy-MM-dd HH:mm:ss")}) : {strErrorMessage}");
                        }
                        else
                        {
                            m_parent.WriteLog($"InsertSpeedDetection() ({m_strServerIP}) 성공 (speed: {speed}, DetectionTime: {dtAlarmTime.ToString("yyyy-MM-dd HH:mm:ss")})");
                        }
                    }
                    else 
                    {
                        m_parent.WriteLog($"InsertSpeedDetection() ({m_strServerIP}) 동일 차량 과속으로 예외 (speed: {speed}, DetectionTime: {dtAlarmTime.ToString("yyyy-MM-dd HH:mm:ss")})");
                    }

                }
                else if (opcode == OPCODE_TIME)
                {
                    byte year = arrResData[0];
                    byte month = arrResData[1];
                    byte day = arrResData[2];
                    byte hour = arrResData[3];
                    byte minute = arrResData[4];
                    byte second = arrResData[5];

                    int nYear = 2000 + year;

                    DateTime dtData = new DateTime(nYear, month, day, hour, minute, second);
                    DateTime dtNow = DateTime.Now;

                    m_diffDFS = dtNow - dtData;

                    m_parent.WriteLog($"OnReceiveData() ({m_strServerIP}) : 시간 데이터 수신 (DFS 시간: {dtData.ToString("yyyy-MM-dd HH:mm:ss")}, 시스템 시간: {dtNow.ToString("yyyy-MM-dd HH:mm:ss")}, 차이: {m_diffDFS.TotalMinutes}분)");                    
                }
                
            }
            catch (Exception e)
            {
                m_parent.WriteLog($"OnReceiveData() Exception ({m_strServerIP}) : {e.Message}");
            }
        }

        public void Start()
        {
            m_runThread = true;

            m_ConnectionThread = new Thread(new ThreadStart(ConnectionThread));
            m_ConnectionThread.Start();
        }

        private void ConnectionThread()
        {
            bool bIsFirst = true;

            while (m_runThread)
            {
                try
                {
                    DateTime dtNow = DateTime.Now;
                    TimeSpan diffTime = dtNow - m_dtLastTime;

                    if (diffTime.TotalMinutes > 10)
                    {
                        // diffTime은 TimeSpan이므로 날짜 형식 지정자를 사용하면 FormatException 발생 → 마지막 수신 시각과 경과 분으로 출력
                        m_parent.WriteLog($"ConnectionThread() 마지막 데이터 수신 시간 초과로 연결 해제 ({m_strServerIP}) : 현재 시간: {dtNow.ToString("yyyy-MM-dd HH:mm:ss")}, 마지막 수신 시간: {m_dtLastTime.ToString("yyyy-MM-dd HH:mm:ss")}, 경과: {diffTime.TotalMinutes.ToString("F1")}분");
                        this.Close();

                        m_bIsConnect = false;

                        // 리셋하지 않으면 재연결 성공 직후에도 조건이 계속 참이 되어 즉시 다시 Close되는 무한 루프 발생
                        m_dtLastTime = DateTime.Now;
                    }

                    if (!this.IsConnected || m_bIsConnect == false)
                    {   // 연결이 안되었을 경우 
                        lock (this)
                        {
                            if (m_strServerIP != null && m_strServerIP != "" && m_nPort > 0)
                            {
                                m_parent.WriteLog("ConnectionThread() : 연결 시도 " + m_strServerIP + ":" + m_nPort.ToString());

                                bool bResult = this.Connect(m_strServerIP, m_nPort);

                                if (m_bIsConnect == false && bResult == true)
                                {   // 연결 성공
                                    m_bIsConnect = true;
                                    m_dtLastTime = DateTime.Now;    // 연결 직후 데이터가 없어도 수신 타임아웃 10분 유예를 다시 부여
                                    m_parent.WriteLog("ConnectionThread() : 연결 성공 " + m_strServerIP + ":" + m_nPort.ToString());

                                    Thread.Sleep(500);

                                    // 데이터 연동 방안 1 ----                                    
                                    byte[] arrData = null;

                                    if (bIsFirst)
                                    {   // 시간 동기화 우선
                                        bIsFirst = false;

                                        arrData = MakeTypeData(DetectionProvider.TYPE.Time);
                                        SendBytes(arrData);

                                        Thread.Sleep(500);
                                    }

                                    // 실시간 검지 속도값 요청
                                    arrData = MakeTypeData(DetectionProvider.TYPE.Speed);
                                    SendBytes(arrData);
                                    // -----------------------

                                }
                                else if (bResult == false)
                                {   // 연결 실패
                                    m_bIsConnect = false;
                                    m_parent.WriteLog("ConnectionThread() : 연결 실패 " + m_strServerIP + ":" + m_nPort.ToString());

                                    Thread.Sleep(ERROR_SLEEP);
                                }
                            }
                        }

                        Thread.Sleep(500);
                    }
                    else
                    {   // 연결이 될 경우
                        // 5분마다 시간 값 요청 및 연결 확인 테스트
                        byte[] arrData = MakeTypeData(DetectionProvider.TYPE.Time);
                        SendBytes(arrData);               

                        Thread.Sleep(TIME_SLEEP);
                    }

                   
                }
                catch (Exception e)
                {
                    m_parent.WriteLog($"ConnectionThread() Exception ({m_strServerIP}): {e.Message}");

                    Thread.Sleep(ERROR_SLEEP);
                }
            }
        }

        public byte[] MakeTypeData(DetectionProvider.TYPE Type)
        {
            byte mode = 0x03;
            byte opcode = new byte();
            UInt16 nLength = 6;

            byte[] arrData = new byte[6];

            if (Type == DetectionProvider.TYPE.Speed)
            {
                opcode = 0x01;      // 속도 정보 요청

                arrData[0] = 0x01;  // 실시간 검지 정보 요청
                //arrData[0] = 0x02;  // 트리거 위치 검지 정보 요청

                arrData[1] = 0x01;  // 무한 전송

                arrData[2] = 0x00;  // 의미 없음
                arrData[3] = 0x00;  // 의미 없음
                arrData[4] = 0x00;  // 의미 없음
                arrData[5] = 0x00;  // 의미 없음

            }
            else if (Type == DetectionProvider.TYPE.Time)
            {
                opcode = 0x02;      // 시간 정보 요청

                arrData[0] = 0x01;  // 시간 정보 요청

                arrData[1] = 0x00;  // 단발 전송

                arrData[2] = 0x00;  // 의미 없음
                arrData[3] = 0x00;  // 의미 없음
                arrData[4] = 0x00;  // 의미 없음
                arrData[5] = 0x00;  // 의미 없음
            }
            else
            {
                m_parent.WriteLog($"MakeTypeData() ERROR ({m_strServerIP}): Type 값이 올바르지 않습니다. Type: {(int)Type}");
            }

            byte[] data = MakeRequestMsg(mode, opcode, nLength, arrData);

            return data;
        }

        public static byte[] MakeRequestMsg(byte mode, byte opcode, UInt16 nLength, byte[] arrData)
        {
            byte[] data = new byte[12];

            data[0] = START;         // START

            data[1] = mode;         // MODE

            data[2] = opcode;       // OPCODE

            // LENGTH
            byte[] arrLength = BitConverter.GetBytes(nLength);
            Array.Copy(arrLength, 0, data, 3, arrLength.Length);

            Array.Copy(arrData, 0, data, 5, arrData.Length);        // DATA

            data[11] = END;       // END

            return data;
        }

        public void SendBytes(byte[] CmdBuff)
        {
            try
            {
                if (!this.IsClientDisposed && this.IsConnected)
                {
                    this.LengthAdd = false;
                    int nResult = this.Send(CmdBuff, 0, CmdBuff.Length);

                    if (nResult < 0)
                    {
                        WriteBinaryLog(CmdBuff, 0, CmdBuff.Length, $"[Send ERROR ({m_strServerIP})]");

                        lock (this)
                        {
                            //if (this.Client.Client != null)
                            //{
                            //    if (this.Client.Connected)
                            //        this.Client.Close();
                            //}
                        }
                    }
                    else
                        WriteBinaryLog(CmdBuff, 0, CmdBuff.Length, $"[Send ({m_strServerIP})]");
                }
            }
            catch (Exception e)
            {
                m_parent.WriteLog($"SendBytes() Exception ({m_strServerIP}): {e.Message}");
            }
        }

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = Logger.GetByteString(bytes, nIndex, len);
            m_parent.WriteLog(strTag + " : " + strBytesLog);
            return strTag + " : " + strBytesLog;
        }

    }
}
