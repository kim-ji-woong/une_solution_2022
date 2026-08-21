using System;
using System.Net;
using System.Net.Mail;

namespace dnsEmail
{
    internal class BaseEmailBroker
    {

    }

#if Soulbrain
    internal class EmailBrokerSoulbrain
    {
        // 서버 정보
        private const string m_strHost = "oasis.soulbrain.co.kr";
        private const int m_nClientPort = 587;
        private const bool m_bEnableSsl = false;
        private const bool m_bUseDefaultCredentials = false;
        private const SmtpDeliveryMethod m_DeliveryMethod = SmtpDeliveryMethod.Network;

        // 계정 정보
        private const string m_strAccountID = "Z51079";
        private const string m_strAccountPW = "iot1255!@";
        private const string m_strSystemMail = "esh@soulbrain.co.kr";

        private SmtpClient m_Client;

        public EmailBrokerSoulbrain()
        {
            // Credentials
            var credentials = new NetworkCredential(m_strAccountID, m_strAccountPW);

            // Smtp client
            m_Client = new SmtpClient()
            {
                Port = m_nClientPort,
                DeliveryMethod = m_DeliveryMethod,
                UseDefaultCredentials = m_bUseDefaultCredentials,
                Host = m_strHost,
                EnableSsl = m_bEnableSsl,
                Credentials = credentials
            };
        }

        public bool SendEmail(string strEmail, string strSubject, string strMessage, string strEmailTitle, DateTime dtTime, ref string strResultMessage)
        {
            try
            {
                // 내용에 현재 시간 추가
                string strYear = dtTime.ToString("yyyy") + "년";
                string strMonth = dtTime.ToString("MM") + "월";
                string strDay = dtTime.ToString("dd") + "일";

                string strHour = dtTime.ToString("HH") + "시";
                string strMinute = dtTime.ToString("mm") + "분";
                string strSecond = dtTime.ToString("ss") + "초";

                string date = strYear + " " + strMonth + " " + strDay + " " + strHour + " " + strMinute + " " + strSecond;

                strMessage = strMessage + "\n\n" + date;

                // Mail message
                var mail = new MailMessage()
                {
                    From = new MailAddress(m_strSystemMail),
                    Subject = strSubject,
                    Body = strMessage
                };

                mail.To.Add(new MailAddress(strEmail));

                // Send it...         
                m_Client.Send(mail);
            }
            catch (Exception ex)
            {
                strResultMessage = "Error in sending email: " + ex.Message;
                return false;
            }

            if (strEmailTitle != null && strEmailTitle.Length > 0)
                strResultMessage = strEmailTitle + " 메일이 발송되었습니다.\r\n메일을 확인해 주세요.";
            else
                strResultMessage = "메일이 발송되었습니다.\r\n메일을 확인해 주세요.";

            return true;
        }
    }
#endif

#if Wonikqnc
    internal class EmailBrokerWonikqnc
    {
        /*
        // 서버 정보
        private const string m_strHost = "61.78.55.105";
        private const int m_nClientPort = 25;
        private const bool m_bEnableSsl = false;
        private const bool m_bUseDefaultCredentials = false;
        private const SmtpDeliveryMethod m_DeliveryMethod = SmtpDeliveryMethod.Network;

        // 계정 정보
        private const string m_strSystemMail = "no_reply@wonik.com";
        private const string m_strSystemCode = "";       

        private SmtpClient m_Client;
        */

        private static string SYSTEM_ID = "SDMS";
        private static string ACCESS_TOKEN = "ccf8bf69-a92c@4426-8db9=5bd336b0ead2";

        public EmailBrokerWonikqnc()
        {
            // 기존 메일 형식에서 REST API 형식으로 변경
            /*
            // Credentials
            var credentials = new NetworkCredential(m_strSystemMail, m_strSystemCode);

            // Smtp client
            m_Client = new SmtpClient()
            {
                Port = m_nClientPort,
                DeliveryMethod = m_DeliveryMethod,
                UseDefaultCredentials = m_bUseDefaultCredentials,
                Host = m_strHost,
                EnableSsl = m_bEnableSsl,
                Credentials = credentials
            };
            */
        }
        /*
        public bool SendEmail(string strEmail, string strSubject, string strMessage, string strEmailTitle, DateTime dtTime, ref string strResultMessage)
        {
            try
            {
                // 내용에 현재 시간 추가
                string strYear = dtTime.ToString("yyyy") + "년";
                string strMonth = dtTime.ToString("MM") + "월";
                string strDay = dtTime.ToString("dd") + "일";

                string strHour = dtTime.ToString("HH") + "시";
                string strMinute = dtTime.ToString("mm") + "분";
                string strSecond = dtTime.ToString("ss") + "초";

                string date = "발송일시 : " + strYear + " " + strMonth + " " + strDay + " " + strHour + " " + strMinute + " " + strSecond;

                strMessage = strMessage + "\n\n" + date;

                // Mail message
                var mail = new MailMessage()
                {
                    From = new MailAddress(m_strSystemMail),
                    Subject = strSubject,
                    Body = strMessage,
                    IsBodyHtml = true                    
                };

                mail.To.Add(new MailAddress(strEmail));

                // Send it...         
                m_Client.Send(mail);
            }
            catch (Exception ex)
            {
                strResultMessage = "Error in sending email: " + ex.Message;
                return false;
            }

            if (strEmailTitle != null && strEmailTitle.Length > 0)
                strResultMessage = strEmailTitle + " 메일이 발송되었습니다.\r\n메일을 확인해 주세요.";
            else
                strResultMessage = "메일이 발송되었습니다.\r\n메일을 확인해 주세요.";
            

            return true;
        }
        */

        public bool SendQuery(System.Collections.Generic.Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = null;
            string url = "https://apihub.wonikqnc.com";

            if (strURL.StartsWith("/"))
                url += strURL;
            else
                url += "/" + strURL;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));

            request.Method = strMethodType;

            // Authentication 설정
            if (dicHeaders != null)
            {
                request.ContentType = "application/json; charset=utf-8";

                // 요청 헤더 추가
                foreach (System.Collections.Generic.KeyValuePair<string, string> pair in dicHeaders)
                {
                    string key = pair.Key;
                    string value = pair.Value;
                    request.Headers.Add(key, value);
                }
            }

            string strResponse = "";

            try
            {
                if (strBodyJson != null && strBodyJson != "")
                {
                    System.IO.StreamWriter streamWriter = new System.IO.StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBodyJson);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                System.IO.Stream respPostStream = wRes.GetResponseStream();
                System.IO.StreamReader readerPost = new System.IO.StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Status.ToString();
                return false;
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return false;
            }

            strErrorMessage = "success";
            return true;
        }
    }
#endif

#if UnEInternal
    internal class EmailBrokerUnEInternal
    {
        // 서버 정보
        private const string m_strHost = "smtp.gmail.com";
        private const int m_nClientPort = 587;
        private const bool m_bEnableSsl = true;
        private const bool m_bUseDefaultCredentials = false;
        private const SmtpDeliveryMethod m_DeliveryMethod = SmtpDeliveryMethod.Network;

        // 계정 정보
        private const string m_strSystemMail = "noreply@unes.co.kr";
        private const string m_strSystemCode = "gtuihesanxagonxe";

        private SmtpClient m_Client;

        public EmailBrokerUnEInternal()
        {
            // Credentials
            var credentials = new NetworkCredential(m_strSystemMail, m_strSystemCode);

            // Smtp client
            m_Client = new SmtpClient()
            {
                Port = m_nClientPort,
                DeliveryMethod = m_DeliveryMethod,
                UseDefaultCredentials = m_bUseDefaultCredentials,
                Host = m_strHost,
                EnableSsl = m_bEnableSsl,
                Credentials = credentials
            };
        }

        public bool SendEmail(string strEmail, string strSubject, string strMessage, string strEmailTitle, DateTime dtTime, ref string strResultMessage)
        {
            try
            {
                // 내용에 현재 시간 추가
                string strYear = dtTime.ToString("yyyy") + "년";
                string strMonth = dtTime.ToString("MM") + "월";
                string strDay = dtTime.ToString("dd") + "일";

                string strHour = dtTime.ToString("HH") + "시";
                string strMinute = dtTime.ToString("mm") + "분";
                string strSecond = dtTime.ToString("ss") + "초";

                string date = strYear + " " + strMonth + " " + strDay + " " + strHour + " " + strMinute + " " + strSecond;

                strMessage = strMessage + "\n\n" + date;

                // Mail message
                var mail = new MailMessage()
                {
                    From = new MailAddress(m_strSystemMail),
                    Subject = strSubject,
                    Body = strMessage
                };

                mail.To.Add(new MailAddress(strEmail));

                // Send it...         
                m_Client.Send(mail);
            }
            catch (Exception ex)
            {
                strResultMessage = "Error in sending email: " + ex.Message;
                return false;
            }

            if (strEmailTitle != null && strEmailTitle.Length > 0)
                strResultMessage = strEmailTitle + " 메일이 발송되었습니다.\r\n메일을 확인해 주세요.";
            else
                strResultMessage = "메일이 발송되었습니다.\r\n메일을 확인해 주세요.";

            return true;
        }
    }
#endif
}
