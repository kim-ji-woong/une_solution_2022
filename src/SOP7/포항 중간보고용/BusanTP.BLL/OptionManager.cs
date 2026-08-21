using System;
using System.Collections.Generic;
using System.Timers;
using BusanTP.BLL.Models.Request;
using BusanTP.BLL.Models.Response;
using BusanTP.IDAL;
using BusanTP.Model;
using Common.Model;
using Common.Model.Option;

namespace BusanTP.BLL
{
    public class OptionManager
    {
        private ProcessManager m_processManager = null;
        
        private IDataManager m_externalDataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;

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

        public OptionManager(ProcessManager processManager, IDataManager externalDataManager, SDMS.IDAL.IDataManager sdmsDataManager)
        {
            this.m_processManager = processManager;
            this.m_externalDataManager = externalDataManager;
            this.m_sdmsDataManager = sdmsDataManager;
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
    }
    
}