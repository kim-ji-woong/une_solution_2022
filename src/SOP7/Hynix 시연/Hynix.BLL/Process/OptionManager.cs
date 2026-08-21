using System.Collections.Generic;
using Common.IDAL;
using Common.Model.Option;

namespace Hynix.BLL.Process
{
    using Response;
    using Request;

    class OptionManager
    {
        private const string LogDelete = "LogDelete";

        private IDataManager m_dataManager = null;

        public OptionManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseLogDeletePolicy RequestLogDeletePolicy()
        {
            string strErrorMessage;
            List<Options> options = m_dataManager.GetSelectManager().SelectOption(Options.OptionTarget.SDMS, LogDelete, out strErrorMessage);

            if (options == null)
                return new ResponseLogDeletePolicy(false, strErrorMessage);

            foreach (Options option in options)
            {
                if (option.PropertyValue != null)
                {
                    int deleteOption;

                    if (int.TryParse(option.PropertyValue.Trim(), out deleteOption))
                    {
                        ResponseLogDeletePolicy response = new ResponseLogDeletePolicy(true, "");
                        response.DeleteOption = deleteOption;
                        return response;
                    }
                }
            }

            // Default Option
            return new ResponseLogDeletePolicy(true, "");
        }

        public MessageResult SaveLogDeletePolicy(SaveLogDeletePolicy data)
        {
            string strErrorMessage;
            List<Options> options = m_dataManager.GetSelectManager().SelectOption(Options.OptionTarget.SDMS, LogDelete, out strErrorMessage);

            if (options == null)
                return new MessageResult(false, strErrorMessage);

            if (options.Count == 0)
            {
                if (m_dataManager.GetCreateManager().CreateOption(Options.OptionTarget.SDMS, LogDelete, data.DeleteOption.ToString(), data.SiteID) == null)
                    return new MessageResult(false, m_dataManager.GetCreateManager().GetErrorMessage());
                else
                    return new MessageResult(true, "");
            }

            Options _option = options[0];
            _option.PropertyValue = data.DeleteOption.ToString();

            if (m_dataManager.GetUpdateManager().UpdateOption(Options.OptionTarget.SDMS, _option) == false)
                return new MessageResult(false, m_dataManager.GetUpdateManager().GetErrorMessage());

            return new MessageResult(true, "");
        }
    }
}
