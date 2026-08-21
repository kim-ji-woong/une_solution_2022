using System;
using System.Collections.Generic;
using System.Text;

namespace VDS.BLL.Models.Response
{
    public class ResponseCFDImages : MessageResult
    {
        private List<DateTime> m_imageTimes = new List<DateTime>();
        private List<string> m_imageUrls = new List<string>();

        public List<DateTime> ImageTimes
        {
            get { return m_imageTimes; }
            set { m_imageTimes = value; }
        }

        public List<string> ImageUrls
        {
            get { return m_imageUrls; }
            set { m_imageUrls = value; }
        }

        public ResponseCFDImages()
            : base()
        {
        }

        public ResponseCFDImages(bool success, string message)
            : base(success, message)
        {
        }
    }
}
