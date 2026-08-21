using System;
using System.Collections.Generic;
using System.Text;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseBusanSdmsOption : MessageResult
    {
        private List<BusanTP.Model.SdmsOption> m_sdmsOptions = new List<BusanTP.Model.SdmsOption>();

        public List<BusanTP.Model.SdmsOption> SdmsOptions
        {
            get { return m_sdmsOptions; }
            set { m_sdmsOptions = value; }
        }

        public ResponseBusanSdmsOption() : base()
        {
        }

        public ResponseBusanSdmsOption(bool success, string message) : base(success, message)
        {
        }
    }
}
