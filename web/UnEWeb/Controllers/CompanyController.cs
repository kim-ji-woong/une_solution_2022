using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;

namespace UnEWeb.Controllers
{
    public class CompanyController : Controller
    {
        private IConfiguration m_config = null;
        public CompanyController(IConfiguration config)
        {
            m_config = config;
        }

        [HttpPost]
        public IActionResult ContactUS(List<IFormFile> files)
        {
            if (files == null)
                return BadRequest();

            try
            {
                if (files.Count < 4)
                    return BadRequest(); 

                string strFromEmail = files[0].FileName;
                string strToEmail = files[1].FileName;
                string strSubject = files[2].FileName;
                string strBody = "발신자 정보 : " + strFromEmail + "\r\n" + files[3].FileName;
                strBody = strBody.Replace("%0A", "\r\n");

                MailMessage msg = new MailMessage(strFromEmail, strToEmail, strSubject, strBody);

                if (files.Count > 4)
                {
                    Stream file = files[4].OpenReadStream();
                    
                    System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(file, files[4].FileName);
                    msg.Attachments.Add(attachment);                    
                }

                //msg.IsBodyHtml = true; //본문이 HTML 인 경우

                // SmtpClient 셋업 (SMTP 서버, 포트)
                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
                smtp.EnableSsl = true; // SSL 사용

                // 아웃룩, Live 또는 Hotmail의 계정과 암호를 지정
                smtp.Credentials = new NetworkCredential("noreply@unes.co.kr", "gtuihesanxagonxe");

                // 메일 발송
                smtp.Send(msg);

                return Ok(true);
            }
            catch (System.Exception e)
            {
                return Ok(false);
            }
        }
    }

    public class ContactUSParam
    {
        public string FromEmail { get; set; }
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
