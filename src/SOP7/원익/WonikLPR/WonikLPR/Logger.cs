using System;

namespace WonikLPR
{
    /// <summary>
    /// 콘솔 전용 로거. (파일/DB 로그는 추후 정리 예정)
    /// </summary>
    public static class Logger
    {
        private static readonly object m_lock = new object();

        public static void Info(string message)
        {
            Write("INFO ", message);
        }

        public static void Error(string message)
        {
            Write("ERROR", message);
        }

        public static void Error(string message, Exception ex)
        {
            Write("ERROR", message + " : " + (ex == null ? string.Empty : ex.ToString()));
        }

        private static void Write(string level, string message)
        {
            lock (m_lock)
            {
                Console.WriteLine("[{0:yyyy-MM-dd HH:mm:ss.fff}][{1}] {2}",
                    DateTime.Now, level, message);
            }
        }
    }
}
