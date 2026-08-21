using System.Collections;
using System.Collections.Generic;
using GGH.Model;

namespace GGH.BLL
{
    using IDAL;
    using Models.Request;
    using Models.Response;

    public class ParkingManager
    {
        private IDataManager m_dataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;

        public ParkingManager(IDataManager dataManager, Common.IDAL.IDataManager commonDataManager)
        {
            m_dataManager = dataManager;
            m_commonDataManager = commonDataManager;
        }

        public ResponseParkingGateList GetParkingGateList(int siteID)
        {
            Dictionary<ParkingGate.Fields, object> dicConditions = null;

            if (siteID > 0)
            {
                dicConditions = new Dictionary<ParkingGate.Fields, object>();
                dicConditions[ParkingGate.Fields.SiteID] = siteID;
            }

            string strErrorMessage;
            List<ParkingGate> gates = m_dataManager.GetSelectManager().SelectParkingGates(dicConditions, null, out strErrorMessage);

            if (gates == null)
                return new ResponseParkingGateList(false, strErrorMessage);

            ResponseParkingGateList response = new ResponseParkingGateList(true, "");
            response.GateList.AddRange(gates);
            return response;
        }

        public ResponseParkingUplock GetParkingUplockOption()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 'UseParkingUplock'", Common.Model.Option.Options.Fields.PropertyName);
            List<Common.Model.Option.Options> options = m_commonDataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return new ResponseParkingUplock(false, strErrorMessage);

            bool use = true;

            foreach (var option in options)
            {
                if (option.PropertyValue != null)
                {
                    string strValue = option.PropertyValue.ToLower().Trim();

                    if (strValue == "1" || strValue == "true")
                        use = true;
                    else if (strValue == "0" || strValue == "false")
                        use = false;
                }

                break;
            }

            ResponseParkingUplock response = new ResponseParkingUplock(true, "");
            response.Use = use;
            return response;
        }

        public MessageResult UpdateParkingUplock(UpdateParkingUplock data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 'UseParkingUplock'", Common.Model.Option.Options.Fields.PropertyName);
            List<Common.Model.Option.Options> options = m_commonDataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return new MessageResult(false, strErrorMessage);

            string strValue = data.Use.ToString().ToLower();

            foreach (var option in options)
            {
                Dictionary<Common.Model.Option.Options.Fields, object> dicSets = new Dictionary<Common.Model.Option.Options.Fields, object>();
                dicSets[Common.Model.Option.Options.Fields.PropertyValue] = strValue;

                Dictionary<Common.Model.Option.Options.Fields, object> dicConditions = new Dictionary<Common.Model.Option.Options.Fields, object>();
                dicConditions[Common.Model.Option.Options.Fields.ID] = option.ID;

                if (m_commonDataManager.GetUpdateManager().UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, dicSets, dicConditions, null, out strErrorMessage) == true)
                    return new MessageResult(true, "");
                else
                    return new MessageResult(false, strErrorMessage);
            }

            if (m_commonDataManager.GetCreateManager().CreateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseParkingUplock", strValue, 40) != null)
                return new MessageResult(true, "");

            return new MessageResult(false, m_commonDataManager.GetCreateManager().GetErrorMessage());
        }
    }
}
