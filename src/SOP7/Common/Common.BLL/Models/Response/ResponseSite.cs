using Common.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Common.BLL.Models.Response
{
    public class ResponseSite : MessageResult
    {
        public List<Site> Sites { get; set; }
        public bool UseMultiSite { get; set; }
    }
}
