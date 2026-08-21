using System;
using System.Collections.Generic;
using GGH.Model;

namespace GGH.BLL.Models.Response
{
    public class ResponseEvacuations : MessageResult
    {
        private List<Evacuation> m_evacuations = new List<Evacuation>();

        public List<Evacuation> Evacuations
        {
            get { return m_evacuations; }
        }

        public ResponseEvacuations()
            : base()
        {
        }

        public ResponseEvacuations(bool success, string message)
            : base(success, message)
        {
        }
    }
}
