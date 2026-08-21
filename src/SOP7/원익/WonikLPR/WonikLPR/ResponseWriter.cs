using System;
using System.IO;
using System.Text;

namespace WonikLPR
{
    /// <summary>
    /// API 응답(XML 원문)을 파일에 누적 저장한다.
    /// 저장 경로는 App.config 의 LPR_RESPONSE_FILE 이며, 값이 비어 있으면 저장하지 않는다.
    /// </summary>
    public class ResponseWriter
    {
        private readonly string m_filePath;
        private readonly object m_lock = new object();

        // 동일한 실패 메시지가 매 주기마다 반복 출력되는 것을 막는다.
        private string m_lastError = null;

        public ResponseWriter(string filePath)
        {
            m_filePath = filePath == null ? string.Empty : filePath.Trim();
        }

        /// <summary>저장 사용 여부 (경로 미설정시 false)</summary>
        public bool Enabled
        {
            get { return string.IsNullOrEmpty(m_filePath) == false; }
        }

        /// <summary>저장 경로</summary>
        public string FilePath
        {
            get { return m_filePath; }
        }

        /// <summary>
        /// 응답 1건 기록. 저장에 실패해도 예외를 던지지 않는다. (API 폴링을 중단시키지 않기 위함)
        /// </summary>
        public void Write(string url, string response)
        {
            if (Enabled == false)
            {
                return;
            }

            try
            {
                lock (m_lock)
                {
                    EnsureDirectory();

                    // append 모드에서 StreamWriter 는 파일이 비어있을 때만 BOM 을 기록한다.
                    using (StreamWriter writer = new StreamWriter(m_filePath, true, new UTF8Encoding(true)))
                    {
                        writer.WriteLine("[{0:yyyy-MM-dd HH:mm:ss.fff}] {1}", DateTime.Now, url);
                        writer.WriteLine(response);
                        writer.WriteLine();
                    }

                    m_lastError = null;
                }
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message != m_lastError)
                {
                    m_lastError = message;
                    Logger.Error(string.Format("응답 파일 저장 실패 ({0})", m_filePath), ex);
                }
            }
        }

        private void EnsureDirectory()
        {
            string folder = Path.GetDirectoryName(m_filePath);
            if (string.IsNullOrEmpty(folder) == false && Directory.Exists(folder) == false)
            {
                Directory.CreateDirectory(folder);
            }
        }
    }
}
