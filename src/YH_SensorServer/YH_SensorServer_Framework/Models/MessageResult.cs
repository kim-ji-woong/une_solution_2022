using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YH_SensorServer_Framework.Models
{
    public class MessageResult
    {
        private bool success = false;
        private string errorMessage = "";

        public bool Success
        {
            get { return success; }
            set { success = value; }
        }

        public string ErrorMessage
        {
            get { return errorMessage; }
            set { errorMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string errorMessage)
        {
            this.success = success;
            this.errorMessage = errorMessage;
        }
    }
}
