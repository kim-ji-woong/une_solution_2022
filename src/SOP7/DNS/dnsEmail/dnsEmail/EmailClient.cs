using System;
using System.Collections.Generic;

namespace dnsEmail
{
    internal class MessageClientDummy : IEmailClient
    {
        public void Dispose()
        {
            
        }

        //bool IEmailClient.SendEmail(string strEmail, string strSubject, string strMessage, string strTitle, ref string strResultMsg)
        //{
        //    return true;
        //}

        bool IEmailClient.SendEmail(EmailContent message, ref string strResultMsg)
        {
            return true;
        }

        //bool IEmailClient.SendEmail(List<EmailContent> messages, ref string strResultMsg)
        //{
        //    return true;
        //}
    }

#if Soulbrain
    internal class EmailClientSoulbrain : IEmailClient
    {
        private EmailBrokerSoulbrain m_broker = null;

        public EmailClientSoulbrain()
        {
            m_broker = new EmailBrokerSoulbrain();
        }

        public void Dispose()
        {

        }

        //public bool SendEmail(string strEmail, string strSubject, string strMessage, string strTitle, ref string strResultMsg)
        //{
        //    if (m_broker != null)
        //    {
        //        if (m_broker.SendEmail(strEmail, strSubject, strMessage, strTitle, ref strResultMsg) == false)
        //            return false;

        //        return true;
        //    }

        //    return false;
        //}

        public bool SendEmail(EmailContent message, ref string strResultMsg)
        {
            if (m_broker != null && message != null && message.EmailList.Count > 0)
            {
                foreach (string strEmail in message.EmailList)
                {
                    if (m_broker.SendEmail(strEmail, message.Subject, message.Message, message.Title, message.TimeStamp, ref strResultMsg) == false)
                        return false;
                }
                
                return true;
            }

            return false;
        }

        //public bool SendEmail(List<EmailContent> messages, ref string strResultMsg)
        //{
        //    if (messages == null || m_broker == null)
        //        return false;

        //    foreach (EmailContent message in messages)
        //    {
        //        if (SendEmail(message, ref strResultMsg) == false)
        //            return false;
        //    }

        //    return true;
        //}
    }
#endif

#if Wonikqnc
    internal class EmailClientWonikqnc : IEmailClient
    {
        private EmailBrokerWonikqnc m_broker = null;

        private static string SYSTEM_ID = "SDMS";
        private static string ACCESS_TOKEN = "ccf8bf69-a92c@4426-8db9=5bd336b0ead2";
        private static string SEND_EMAIL = "no_reply@wonik.com";
        private static string SECU_TYPE = "PERSONAL";
        private static string MAIL_URL = "/api/mail/v1.0/simpleMails";

        public EmailClientWonikqnc()
        {
            m_broker = new EmailBrokerWonikqnc();
        }

        public void Dispose()
        {

        }

        public bool SendEmail(EmailContent message, ref string strResultMsg)
        {
            if (m_broker != null && message != null && message.EmailList.Count > 0)
            {
                string[] arrReceiver = null;
                string strContentType = "TEXT";

                // 원익 수신자 이름 정보 - 안전평가
                if (message.Tag != null && message.Tag.GetType() == typeof(string))
                {
                    string strReceivers = (string)message.Tag;
                    if (strReceivers.Length > 0)
                    {
                        arrReceiver = strReceivers.Split(',');
                        if (message.EmailList.Count != arrReceiver.Length)
                            arrReceiver = null;

                        strContentType = "HTML";
                    }
                }

                if (message.Caller == null || message.Caller == "")
                    message.Caller = "안전관리시스템";

                Newtonsoft.Json.Linq.JObject jObject = new Newtonsoft.Json.Linq.JObject();
                jObject.Add("senderName", message.Caller);                  // 송신자 이름
                jObject.Add("subject", message.Subject);
                jObject.Add("docSecuType", SECU_TYPE);
                jObject.Add("content", message.Message);
                jObject.Add("contentType", strContentType);
                jObject.Add("senderEmailAddress", SEND_EMAIL);              // 송신자 이메일주소
                                                               

                Newtonsoft.Json.Linq.JArray jReceivers = new Newtonsoft.Json.Linq.JArray();
                int i = 0;

                foreach (string strEmail in message.EmailList)
                {
                    if (strEmail.Length == 0)
                        continue;

                    string strReceiver = "";

                    if (arrReceiver != null)
                        strReceiver = arrReceiver[i];
                    else
                        strReceiver = $"수신자{i + 1}";

                    Newtonsoft.Json.Linq.JObject jReceiver = new Newtonsoft.Json.Linq.JObject();
                    jReceiver.Add("name", strReceiver);
                    jReceiver.Add("emailAddress", strEmail);
                    jReceiver.Add("recipientType", "TO");

                    jReceivers.Add(jReceiver);

                    i++;
                }

                jObject.Add("mailReceivers", jReceivers);

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["System-Id"] = SYSTEM_ID;
                dicHeaders["Access-Token"] = ACCESS_TOKEN;

                return m_broker.SendQuery(dicHeaders, jObject.ToString(), MAIL_URL, out strResultMsg, "POST");         
            }

            return false;
        }
    }
#endif

#if UnEInternal
    internal class EmailClientUnEInternal : IEmailClient
    {
        private EmailBrokerUnEInternal m_broker = null;

        public EmailClientUnEInternal()
        {
            m_broker = new EmailBrokerUnEInternal();
        }

        void IDisposable.Dispose()
        {
            
        }

        //public bool SendEmail(string strEmail, string strSubject, string strMessage, string strTitle, ref string strResultMsg)
        //{
        //    if (m_broker != null)
        //    {
        //        if (m_broker.SendEmail(strEmail, strSubject, strMessage, strTitle, ref strResultMsg) == false)
        //            return false;

        //        return true;
        //    }

        //    return false;
        //}

        //public bool SendEmail(EmailContent message, ref string strResultMsg)
        //{
        //    if (m_broker != null && message != null && message.EmailList.Count > 0)
        //    {
        //        foreach (string strEmail in message.EmailList)
        //        {
        //            if (m_broker.SendEmail(strEmail, message.Subject, message.Message, message.Title, ref strResultMsg) == false)
        //                return false;
        //        }

        //        return true;
        //    }

        //    return false;
        //}

        public bool SendEmail(EmailContent message, ref string strResultMsg)
        {
            if (m_broker != null && message != null && message.EmailList.Count > 0)
            {
                foreach (string strEmail in message.EmailList)
                {
                    if (m_broker.SendEmail(strEmail, message.Subject, message.Message, message.Title, message.TimeStamp, ref strResultMsg) == false)
                        return false;
                }

                return true;
            }

            return false;
        }

        //public bool SendEmail(List<EmailContent> messages, ref string strResultMsg)
        //{
        //    if (messages == null || m_broker == null)
        //        return false;

        //    foreach (EmailContent message in messages)
        //    {
        //        if (SendEmail(message, ref strResultMsg) == false)
        //            return false;
        //    }

        //    return true;
        //}
    }

#endif
}
