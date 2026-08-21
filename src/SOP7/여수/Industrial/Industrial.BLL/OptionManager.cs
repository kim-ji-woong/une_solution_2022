using System;
using System.Collections.Generic;
using System.Text;
using Common.IDAL;
using Common.Model.Option;

namespace Industrial.BLL
{
    using Model.Response;
    using Model.Request;

    public class OptionManager
    {
        private const string OriginViewport = "OriginViewport";
        private IDataManager m_dataManager = null;

        public OptionManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public MessageResult SaveViewport(RequestSaveViewport request)
        {
            bool isNullable;
            string strCondition = string.Format("{0} = '{1}'", Options.GetFieldName(Options.Fields.PropertyName, out isNullable), OriginViewport);

            string strErrorMessage;
            List<Options> options = m_dataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return new MessageResult(false, strErrorMessage);

            if (options.Count > 0)
            {
                options[0].PropertyValue = string.Format("{0}, {1}, {2}, {3}, {4}, {5}", request.LocationX, request.LocationY, request.LocationZ, request.RotationX, request.RotationY, request.RotationZ);

                if (m_dataManager.GetUpdateManager().UpdateOption(Options.OptionTarget.SDMS, options[0]))
                    return new MessageResult(true, "");
                else
                    return new MessageResult(false, m_dataManager.GetUpdateManager().GetErrorMessage());
            }

            string strValue = string.Format("{0}, {1}, {2}, {3}, {4}, {5}", request.LocationX, request.LocationY, request.LocationZ, request.RotationX, request.RotationY, request.RotationZ);

            if (m_dataManager.GetCreateManager().CreateOption(Options.OptionTarget.SDMS, OriginViewport, strValue, m_dataManager.SiteID) != null)
                return new MessageResult(true, "");

            return new MessageResult(false, m_dataManager.GetCreateManager().GetErrorMessage());
        }

        public ResponseViewport GetViewport()
        {
            bool isNullable;
            string strCondition = string.Format("{0} = '{1}'", Options.GetFieldName(Options.Fields.PropertyName, out isNullable), OriginViewport);

            string strErrorMessage;
            List<Options> options = m_dataManager.GetSelectManager().SelectOptions(Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return new ResponseViewport(false, strErrorMessage);

            if (options.Count > 0)
            {
                foreach (Options option in options)
                {
                    if (option.PropertyValue == null)
                        continue;

                    string[] tokens = option.PropertyValue.Split(',');

                    if (tokens.Length != 6)
                        continue;

                    float locationX, locationY, locationZ;
                    float rotationX, rotationY, rotationZ;

                    if (float.TryParse(tokens[0].Trim(), out locationX) && float.TryParse(tokens[1].Trim(), out locationY) && float.TryParse(tokens[2].Trim(), out locationZ) &&
                        float.TryParse(tokens[3].Trim(), out rotationX) && float.TryParse(tokens[4].Trim(), out rotationY) && float.TryParse(tokens[5].Trim(), out rotationZ))
                    {
                        ResponseViewport response = new ResponseViewport(true, "");

                        response.LocationX = locationX;
                        response.LocationY = locationY;
                        response.LocationZ = locationZ;
                        response.RotationX = rotationX;
                        response.RotationY = rotationY;
                        response.RotationZ = rotationZ;

                        return response;
                    }
                }
            }

            return new ResponseViewport(false, "Database에 Viewport 정보가 저장되어 있지 않습니다.");
        }
    }
}
