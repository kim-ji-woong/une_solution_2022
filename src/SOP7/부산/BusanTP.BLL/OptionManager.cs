using System;
using System.Collections.Generic;
using System.Timers;
using BusanTP.BLL.Models.Request;
using BusanTP.BLL.Models.Response;
using BusanTP.IDAL;
using BusanTP.Model;
using Common.Model;
using Common.Model.Option;
using SOPManager.Model.Sop.Account;

namespace BusanTP.BLL
{
    public class OptionManager
    {
        private const string OriginViewport = "OriginViewport";
        
        private ProcessManager m_processManager = null;
        
        private IDataManager m_externalDataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;

        private static bool m_bTimerRunning = false;
        private static Timer m_timer = null;
        
        private static List<Common.Model.Option.Options> m_sdmsOptions = new List<Options>();
        /// <summary>
        /// SDMS 옵션
        /// </summary>
        public List<Options> SDMSOptions { get { return m_sdmsOptions; } }

        private static List<Common.Model.Option.Options> m_sopOptions = new List<Options>();
        /// <summary>
        /// SOP 옵션
        /// </summary>
        public List<Options> SOPOptions { get { return m_sopOptions; } }

        public OptionManager(ProcessManager processManager, IDataManager externalDataManager, SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager)
        {
            m_processManager = processManager;
            m_externalDataManager = externalDataManager;
            m_sdmsDataManager = sdmsDataManager;
            m_commonDataManager = commonDataManager;
        }
        
        public MessageResult ResetPopup(RequestResetPopup data)
        {
            MessageResult result = new MessageResult();

            string strCategory = "popup";
            string strErrorMessage = null;
            
            if (data.PopupState.WeatherInfo != null)
            {
                if (!UpdateAccountOption(data.UserID, strCategory, "weatherInfo", data.PopupState.WeatherInfo.X, out strErrorMessage, data.PopupState.WeatherInfo.Y, data.PopupState.WeatherInfo.Height, data.PopupState.WeatherInfo.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.PopupState.StatusInfo != null)
            {
                if (!UpdateAccountOption(data.UserID, strCategory, "statusInfo", data.PopupState.StatusInfo.X, out strErrorMessage, data.PopupState.StatusInfo.Y, data.PopupState.StatusInfo.Height, data.PopupState.StatusInfo.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.PopupState.Event != null)
            {
                if (!UpdateAccountOption(data.UserID, strCategory, "event", data.PopupState.Event.X, out strErrorMessage, data.PopupState.Event.Y, data.PopupState.Event.Height, data.PopupState.Event.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }
            
            if (data.PopupState.CctvInfo != null)
            {
                if (!UpdateAccountOption(data.UserID, strCategory, "cctvInfo", data.PopupState.CctvInfo.X, out strErrorMessage, data.PopupState.CctvInfo.Y, data.PopupState.CctvInfo.Height, data.PopupState.CctvInfo.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }
            
            if (data.PopupState.MiniMap != null)
            {
                if (!UpdateAccountOption(data.UserID, strCategory, "miniMap", data.PopupState.MiniMap.X, out strErrorMessage, data.PopupState.MiniMap.Y, data.PopupState.MiniMap.Height, data.PopupState.MiniMap.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }
            
            if (data.PopupState.StatusPsmSensorInfo != null)
            {
                if (!UpdateAccountOption(data.UserID, strCategory, "statusPsmSensorInfo", data.PopupState.StatusPsmSensorInfo.X, out strErrorMessage, data.PopupState.StatusPsmSensorInfo.Y, data.PopupState.StatusPsmSensorInfo.Height, data.PopupState.StatusPsmSensorInfo.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.PopupState.Simulation != null)
            {
                if (!UpdateAccountOption(data.UserID, strCategory, "simulation", data.PopupState.Simulation.X, out strErrorMessage, data.PopupState.Simulation.Y, data.PopupState.Simulation.Height, data.PopupState.Simulation.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            result.Success = true;
            return result;
        }

        private bool UpdateAccountOption(int nUserID, string strCategory, string strSubCategory,
            string strPropertyValue1, out string strErrorMessage, string strPropertyValue2 = "",
            string strPropertyValue3 = "", string strPropertyValue4 = "")
        {
            strErrorMessage = "";
            
            Dictionary<SOPManager.Model.Sop.Account.Option.Fields, object> dicCondition = new Dictionary<SOPManager.Model.Sop.Account.Option.Fields, object>();
            dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.UserID, nUserID);
            dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.Category, strCategory);
            dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.SubCategory, strSubCategory);

            List<SOPManager.Model.Sop.Account.Option> options = m_processManager.SopDataManager.GetSelectManager().SelectOptions(dicCondition, out strErrorMessage);
            if (options == null)
            {
                return false;
            }

            if (options.Count == 0)
            {   // 새로 생성
                SOPManager.Model.Sop.Account.Option retOption = m_processManager.SopDataManager.GetCreateManager().CreateOption(nUserID, strCategory, strSubCategory, strPropertyValue1, strPropertyValue2, strPropertyValue3, strPropertyValue4);

                if (retOption == null)
                {
                    strErrorMessage = strCategory + " " + strSubCategory + " CreateOption 실패.";
                    return false;
                }
            }
            else if (options.Count > 0)
            {   // 업데이트
                SOPManager.Model.Sop.Account.Option optionData = options[0];
                optionData.PropertyValue1 = strPropertyValue1;
                optionData.PropertyValue2 = strPropertyValue2;
                optionData.PropertyValue3 = strPropertyValue3;
                optionData.PropertyValue4 = strPropertyValue4;

                if (!m_processManager.SopDataManager.GetUpdateManager().UpdateOption(optionData))
                {
                    strErrorMessage = strCategory + " " + strSubCategory + " UpdateOption 실패.";
                    return false;
                }
            }

            return true;
        }

        public MessageResult UpdateUseReceives(RequestUpdateUseReceives data)
        {
            MessageResult result = new MessageResult();

            string strErrorMessage;
            
            List<SdmsOption> sdmsOptions = data.SdmsOptions;
            
            if (sdmsOptions.Count == 0)
            {
                result.Success = false;
                result.Message = "수신 데이터가 없습니다.";
                return result;
            }
            
            foreach (SdmsOption sdmsOption in sdmsOptions)
            {
                Dictionary<SdmsOption.Fields , object> dicSet = new Dictionary<SdmsOption.Fields, object>();
                dicSet.Add(SdmsOption.Fields.PropertyName, sdmsOption.PropertyName);
                dicSet.Add(SdmsOption.Fields.PropertyValue, sdmsOption.PropertyValue);
                
                Dictionary<SdmsOption.Fields , object> dicCondition = new Dictionary<SdmsOption.Fields, object>();
                dicCondition.Add(SdmsOption.Fields.ID, sdmsOption.ID);
                
                if (!m_externalDataManager.GetUpdateManager().UpdateBusanSdmsOption(dicSet, dicCondition, null, out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }
            
            result.Success = true;
            return result;
        }

        public ResponseViewport ReadViewport()
        {
            string strErrorMessage;
            
            ResponseViewport response = new ResponseViewport(true, "");
            
            string strCondition = string.Format("{0} = '{1}'", Options.GetFieldName(Options.Fields.PropertyName, out bool isNullable), OriginViewport);
            List<Options> options = m_commonDataManager.GetSelectManager().SelectOptions(Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);
            
            if (options == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            if (options.Count > 0)
            {
                foreach (Options option in options)
                {
                    if (option.PropertyValue == null)
                        continue;

                    string[] tokens = option.PropertyValue.Split(',');
                    if (tokens.Length != 8)
                        continue;
                    
                    int spaceID;
                    float locationX, locationY, locationZ;
                    float rotationX, rotationY, rotationZ;
                    float zoom;
                    
                    if (int.TryParse(tokens[0].Trim(), out spaceID) && 
                        float.TryParse(tokens[1].Trim(), out locationX) && float.TryParse(tokens[2].Trim(), out locationY) && float.TryParse(tokens[3].Trim(), out locationZ) &&
                        float.TryParse(tokens[4].Trim(), out rotationX) && float.TryParse(tokens[5].Trim(), out rotationY) && float.TryParse(tokens[6].Trim(), out rotationZ) &&
                        float.TryParse(tokens[7].Trim(), out zoom))
                    {
                        response.SpaceID = spaceID;
                        response.LocationX = locationX;
                        response.LocationY = locationY;
                        response.LocationZ = locationZ;
                        response.RotationX = rotationX;
                        response.RotationY = rotationY;
                        response.RotationZ = rotationZ;
                        response.Zoom = zoom;
                    }
                    
                    return response;

                }
            }
            
            response.Success = false;
            response.Message = "뷰포트 데이터가 없습니다.";
            return response;
            
        }

        public MessageResult SaveViewport(RequestSaveViewport request)
        {
            string strErrorMessage;
            
            MessageResult response = new MessageResult();
            
            string strPropertyValue = string.Format("{0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}", 
                request.SpaceID, 
                request.LocationX, 
                request.LocationY, 
                request.LocationZ, 
                request.RotationX, 
                request.RotationY, 
                request.RotationZ, 
                request.Zoom);
            
            Dictionary<Options.Fields, object> dicCondition = new Dictionary<Options.Fields, object>();
            dicCondition.Add(Options.Fields.PropertyName, OriginViewport);
            
            Dictionary<Options.Fields, object> dicSets = new Dictionary<Options.Fields, object>();
            dicSets.Add(Options.Fields.PropertyValue, strPropertyValue);

            if (!m_commonDataManager.GetUpdateManager().UpdateOption(Options.OptionTarget.SDMS, dicSets, dicCondition,
                    null, out strErrorMessage))
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }
            
            response.Success = true;
            return response;
        }
    }
    
}