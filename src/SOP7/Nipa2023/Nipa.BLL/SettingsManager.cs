using System;
using System.Collections.Generic;
using System.Text;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.DAL;
using Nipa.Model.Account;
using Nipa.Model.Sdms;
using Nipa.Model.Sdms.Sensor;
using Nipa.Model.Sop;
using Nipa.Model.Sop.Category;

namespace Nipa.BLL
{
    using Models;
    using Models.Request;
    using Models.Response;

    public class SettingsManager
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;

        private const string Category_Popup = "popup";
        private const string Category_IdleTime = "IdleTime";

        public SettingsManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(m_dataManager);
        }

        public MessageResult ResetPopup(RequestResetPopup data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} = '{3}'", Option.Fields.UserID, data.UserID, Option.Fields.Category, Category_Popup);

            if (m_dataManager.GetDelete().Delete<Option>(strCondition, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        public ResponseOptions GetSettings(RequestOptions data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} = '{3}'", Option.Fields.UserID, data.UserID, Option.Fields.Category, Category_IdleTime);
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return new ResponseOptions(false, strErrorMessage);

            ResponseOptions response = new ResponseOptions(true, "");

            foreach (Option option in options)
            {
                response.Option3DNormal.SetIdleTime(option.PropertyValue1);
                break;
            }

            IEnumerable<OptionSDMS> sdmsOptions = m_dataManager.GetSelect().Select<OptionSDMS>(null, out strErrorMessage);

            if (sdmsOptions == null)
                return new ResponseOptions(false, "");

            foreach (OptionSDMS option in sdmsOptions)
            {
                response.Option3DSensor.SetOption(option.PropertyName, option.PropertyValue);
            }

            IEnumerable<OptionSopSimulator> sopOptions = m_dataManager.GetSelect().Select<OptionSopSimulator>(null, out strErrorMessage);

            if (sopOptions == null)
                return new ResponseOptions(false, "");

            foreach (OptionSopSimulator option in sopOptions)
            {
                response.OptionSopNormal.SetOption(option.PropertyName, option.PropertyValue);
            }

            return response;
        }

        public MessageResult UpdateSettings(UpdateOptions data, bool transaction = true)
        {
            string strErrorMessage, strErrorMessage2;
            string strCondition = string.Format("{0} = {1} and {2} = '{3}'", Option.Fields.UserID, data.UserID, Option.Fields.Category, Category_IdleTime);
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return new ResponseOptions(false, strErrorMessage);

            bool update = false;
            ResponseOptions response = new ResponseOptions(true, "");

            if (transaction)
            {
                if (m_dataManager.BeginBatch(out strErrorMessage) == false)
                    return new MessageResult(false, strErrorMessage);
            }

            foreach (Option option in options)
            {
                option.PropertyValue1 = data.Option3DNormal.GetIdleTime();

                if (m_dataManager.GetUpdate().Update<Option>(option, null, out strErrorMessage) == false)
                {
                    if (transaction)
                        m_dataManager.BatchRollback(out strErrorMessage2);

                    return new MessageResult(false, strErrorMessage);
                }
                else
                    update = true;

                break;
            }

            if (update == false)
            {
                Option option = new Option();
                option.UserID = data.UserID;
                option.Category = Category_IdleTime;
                option.SubCategory = "";
                option.PropertyValue1 = data.Option3DNormal.GetIdleTime();
                option.PropertyValue2 = option.PropertyValue3 = option.PropertyValue4 = "";

                if (m_dataManager.GetCreate().Insert<Option>(option, out strErrorMessage) == false)
                {
                    if (transaction)
                        m_dataManager.BatchRollback(out strErrorMessage2);

                    return new MessageResult(false, strErrorMessage);
                }
            }

            IEnumerable<OptionSDMS> sdmsOptions = m_dataManager.GetSelect().Select<OptionSDMS>(null, out strErrorMessage);

            if (sdmsOptions == null)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new ResponseOptions(false, strErrorMessage);
            }

            if (UpdateMoveDisplayAlarm(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateReceiveFireAlarm(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateReceiveGasAlarm(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateReceiveAtmosphereAlarm(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateReceiveEmergencyBellAlarm(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateReceiveWorkerAlarm(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateReceiveThermalCameraAlarm(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateReceiveFacilityError(data, sdmsOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            IEnumerable<OptionSopSimulator> sopOptions = m_dataManager.GetSelect().Select<OptionSopSimulator>(null, out strErrorMessage);

            if (sopOptions == null)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new ResponseOptions(false, strErrorMessage);
            }

            if (UpdateWorkingBeginHour(data, sopOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateWorkingEndHour(data, sopOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateAutoMoveSOPScreen(data, sopOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateSMS(data, sopOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateSopWaitTime(data, sopOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateSopResultSummary(data, sopOptions, ref strErrorMessage) == false)
            {
                if (transaction)
                    m_dataManager.BatchRollback(out strErrorMessage2);

                return new MessageResult(false, strErrorMessage);
            }

            if (transaction)
            {
                if (m_dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    m_dataManager.BatchRollback(out strErrorMessage2);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            return new MessageResult(true, "");
        }

        private bool UpdateSopResultSummary(UpdateOptions data, IEnumerable<OptionSopSimulator> sopOptions, ref string strErrorMessage)
        {
            OptionSopSimulator option = data.OptionSopNormal.GetOption(sopOptions, OptionSopNormal.Property_ResultSummary);

            if (option != null)
            {
                option.PropertyValue = data.OptionSopNormal.UseSopResultSummary.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSopSimulator>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSopSimulator();
                option.PropertyName = OptionSopNormal.Property_ResultSummary;
                option.PropertyValue = data.OptionSopNormal.UseSopResultSummary.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSopSimulator>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateSopWaitTime(UpdateOptions data, IEnumerable<OptionSopSimulator> sopOptions, ref string strErrorMessage)
        {
            OptionSopSimulator option = data.OptionSopNormal.GetOption(sopOptions, OptionSopNormal.Property_SopWaitTime);

            if (option != null)
            {
                option.PropertyValue = string.Format("{0};{1};{2}", data.OptionSopNormal.AutoCloseTime, data.OptionSopNormal.AutoCloseTimeUnit, data.OptionSopNormal.UseSopAutoClose ? (int)OptionSopNormal.AutoCloseOption.ConfirmNClose : (int)OptionSopNormal.AutoCloseOption.NoAutoClose);

                if (m_dataManager.GetUpdate().Update<OptionSopSimulator>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSopSimulator();
                option.PropertyName = OptionSopNormal.Property_SopWaitTime;
                option.PropertyValue = string.Format("{0};{1};{2}", data.OptionSopNormal.AutoCloseTime, data.OptionSopNormal.AutoCloseTimeUnit, data.OptionSopNormal.UseSopAutoClose ? (int)OptionSopNormal.AutoCloseOption.ConfirmNClose : (int)OptionSopNormal.AutoCloseOption.NoAutoClose);
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSopSimulator>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateSMS(UpdateOptions data, IEnumerable<OptionSopSimulator> sopOptions, ref string strErrorMessage)
        {
            OptionSopSimulator option = data.OptionSopNormal.GetOption(sopOptions, OptionSopNormal.Property_SMS);

            if (option != null)
            {
                option.PropertyValue = data.OptionSopNormal.UseSms.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSopSimulator>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSopSimulator();
                option.PropertyName = OptionSopNormal.Property_SMS;
                option.PropertyValue = data.OptionSopNormal.UseSms.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSopSimulator>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateAutoMoveSOPScreen(UpdateOptions data, IEnumerable<OptionSopSimulator> sopOptions, ref string strErrorMessage)
        {
            OptionSopSimulator option = data.OptionSopNormal.GetOption(sopOptions, OptionSopNormal.Property_AutoMoveSOPScreen);

            if (option != null)
            {
                option.PropertyValue = data.OptionSopNormal.UseAutoMoveSOPScreen.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSopSimulator>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSopSimulator();
                option.PropertyName = OptionSopNormal.Property_WorkingEndHour;
                option.PropertyValue = data.OptionSopNormal.UseAutoMoveSOPScreen.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSopSimulator>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateWorkingEndHour(UpdateOptions data, IEnumerable<OptionSopSimulator> sopOptions, ref string strErrorMessage)
        {
            OptionSopSimulator option = data.OptionSopNormal.GetOption(sopOptions, OptionSopNormal.Property_WorkingEndHour);

            if (option != null)
            {
                option.PropertyValue = string.Format("{0}:{1}", data.OptionSopNormal.WorkingEndHour, data.OptionSopNormal.WorkingEndMinute);

                if (m_dataManager.GetUpdate().Update<OptionSopSimulator>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSopSimulator();
                option.PropertyName = OptionSopNormal.Property_WorkingEndHour;
                option.PropertyValue = string.Format("{0}:{1}", data.OptionSopNormal.WorkingEndHour, data.OptionSopNormal.WorkingEndMinute);
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSopSimulator>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateWorkingBeginHour(UpdateOptions data, IEnumerable<OptionSopSimulator> sopOptions, ref string strErrorMessage)
        {
            OptionSopSimulator option = data.OptionSopNormal.GetOption(sopOptions, OptionSopNormal.Property_WorkingBeginHour);

            if (option != null)
            {
                option.PropertyValue = string.Format("{0}:{1}", data.OptionSopNormal.WorkingBeginHour, data.OptionSopNormal.WorkingBeginMinute);

                if (m_dataManager.GetUpdate().Update<OptionSopSimulator>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSopSimulator();
                option.PropertyName = OptionSopNormal.Property_WorkingBeginHour;
                option.PropertyValue = string.Format("{0}:{1}", data.OptionSopNormal.WorkingBeginHour, data.OptionSopNormal.WorkingBeginMinute);
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSopSimulator>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateReceiveFacilityError(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_ReceiveFacilityError);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.ReceiveFacilityError.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_ReceiveFacilityError;
                option.PropertyValue = data.Option3DSensor.ReceiveFacilityError.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateReceiveThermalCameraAlarm(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_ReceiveThermalCamera);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.ReceiveThermalCameraAlarm.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_ReceiveThermalCamera;
                option.PropertyValue = data.Option3DSensor.ReceiveThermalCameraAlarm.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateReceiveWorkerAlarm(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_ReceiveWorker);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.ReceiveWorkerAlarm.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_ReceiveWorker;
                option.PropertyValue = data.Option3DSensor.ReceiveWorkerAlarm.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateReceiveEmergencyBellAlarm(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_ReceiveEmergencyBell);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.ReceiveEmergencyBellAlarm.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_ReceiveEmergencyBell;
                option.PropertyValue = data.Option3DSensor.ReceiveEmergencyBellAlarm.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateReceiveAtmosphereAlarm(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_ReceiveAtmosphere);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.ReceiveAtmosphereAlarm.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_ReceiveAtmosphere;
                option.PropertyValue = data.Option3DSensor.ReceiveAtmosphereAlarm.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateReceiveGasAlarm(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_ReceiveGas);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.ReceiveGasAlarm.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_ReceiveGas;
                option.PropertyValue = data.Option3DSensor.ReceiveGasAlarm.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateReceiveFireAlarm(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_ReceiveFire);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.ReceiveFireAlarm.ToString().ToLower();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_ReceiveFire;
                option.PropertyValue = data.Option3DSensor.ReceiveFireAlarm.ToString().ToLower();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateMoveDisplayAlarm(UpdateOptions data, IEnumerable<OptionSDMS> sdmsOptions, ref string strErrorMessage)
        {
            OptionSDMS option = data.Option3DSensor.GetOption(sdmsOptions, Option3DSensor.Property_MoveDisplayAlarm);

            if (option != null)
            {
                option.PropertyValue = data.Option3DSensor.MoveDisplayAlarm.ToString();

                if (m_dataManager.GetUpdate().Update<OptionSDMS>(option, null, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                option = new OptionSDMS();
                option.PropertyName = Option3DSensor.Property_MoveDisplayAlarm;
                option.PropertyValue = data.Option3DSensor.MoveDisplayAlarm.ToString();
                option.SiteID = data.CampusID;

                if (m_dataManager.GetCreate().Insert<OptionSDMS>(option, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        public ResponseLinkedSOPList GetLinkedSOPList(RequestLinkedSOPList data)
        {
            dnsDapperDBUtil.Manager.WebDBManager webDBManager = m_dataManager.GetDBManager();
            SOPManager.DAL.DataManager sopDataManager = new SOPManager.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, data.CampusID);

            Dictionary<SOPManager.Model.Sop.Config.LinkedSop.Fields, object> dicConditions = new Dictionary<SOPManager.Model.Sop.Config.LinkedSop.Fields, object>();
            dicConditions[SOPManager.Model.Sop.Config.LinkedSop.Fields.SiteID] = data.CampusID;

            string strErrorMessage;
            List<SOPManager.Model.Sop.Config.LinkedSop> linkedSOPs = sopDataManager.GetSelectManager().SelectLinkedSops(dicConditions, out strErrorMessage);

            if (linkedSOPs == null)
                return new ResponseLinkedSOPList(false, strErrorMessage);

            IEnumerable<DisasterCategory> disasterCategories = m_dataManager.GetSelect().Select<DisasterCategory>(null, out strErrorMessage);

            if (disasterCategories == null)
                return new ResponseLinkedSOPList(false, strErrorMessage);

            IEnumerable<SubDisasterCategory> subDisasterCategories = m_dataManager.GetSelect().Select<SubDisasterCategory>(null, out strErrorMessage);

            if (subDisasterCategories == null)
                return new ResponseLinkedSOPList(false, strErrorMessage);

            IEnumerable<Material> materials = m_dataManager.GetSelect().Select<Material>(null, out strErrorMessage);

            if (materials == null)
                return new ResponseLinkedSOPList(false, strErrorMessage);

            Dictionary<int, DisasterCategory> dicDisasterCategories = new Dictionary<int, DisasterCategory>();
            Dictionary<int, SubDisasterCategory> dicSubDisasterCategories = new Dictionary<int, SubDisasterCategory>();
            Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();

            foreach (DisasterCategory disasterCategory in disasterCategories)
            {
                dicDisasterCategories[disasterCategory.ID] = disasterCategory;
            }

            foreach (SubDisasterCategory subDisasterCategory in subDisasterCategories)
            {
                dicSubDisasterCategories[subDisasterCategory.ID] = subDisasterCategory;
            }

            foreach (Material material in materials)
            {
                dicMaterials[material.ID] = material;
            }

            ResponseLinkedSOPList response = new ResponseLinkedSOPList(true, "");

            foreach (var linkedSOP in linkedSOPs)
            {
                LinkedSOPData linkedSOPData = new LinkedSOPData();

                linkedSOPData.DisasterCategoryID = linkedSOP.DisasterCategoryID;
                linkedSOPData.SubDisasterCategoryID = linkedSOP.SubDisasterCategoryID;
                linkedSOPData.DisasterName = linkedSOP.DisasterName;

                DisasterCategory disasterCategory;
                SubDisasterCategory subDisasterCategory;

                if (dicDisasterCategories.TryGetValue(linkedSOP.DisasterCategoryID, out disasterCategory))
                    linkedSOPData.DisasterCategoryName = disasterCategory.CategoryName;

                if (dicSubDisasterCategories.TryGetValue(linkedSOP.SubDisasterCategoryID, out subDisasterCategory))
                    linkedSOPData.SubDisasterCategoryName = subDisasterCategory.SubCategoryName;

                linkedSOPData.FacilityType = linkedSOP.FacilityTypeID;
                linkedSOPData.LinkedBuildingID = linkedSOP.LinkedBuildingID;
                linkedSOPData.LInkedZoneID = linkedSOP.LinkedZoneID;
                linkedSOPData.SensorType = GetSensorTypeName(linkedSOP.FacilityTypeID, dicMaterials);

                response.SopList.Add(linkedSOPData);
            }

            return response;
        }

        private string GetSensorTypeName(int facilityType, Dictionary<int, Material> dicMaterials)
        {
            Material material;

            if (dicMaterials.TryGetValue(facilityType, out material))
            {
                string strMaterialName = material.MaterialName.ToLower();

                if (strMaterialName == "화재")
                    return "화재";
                else if (strMaterialName == "co" ||
                    strMaterialName == "h2s" ||
                    strMaterialName == "o2" ||
                    strMaterialName == "ch4" ||
                    strMaterialName == "co2")
                    return "가스";
                else if (strMaterialName == "ou" ||
                    strMaterialName.StartsWith("미세먼지") ||
                    strMaterialName == "voc" ||
                    strMaterialName.StartsWith("휘발성"))
                    return "대기오염";
                else if (strMaterialName == "비상벨")
                    return "비상벨";
                else if (strMaterialName == "화재감지" ||
                    strMaterialName == "비인가구역")
                    return "열화상카메라";
                else if (strMaterialName.StartsWith("작업자"))
                    return "작업자";
            }

            return "";
        }

        public ResponseSOPList GetSOPList(RequestSOPList data)
        {
            string strErrorMessage;
            IEnumerable<DisasterCategory> disasterCategories = m_dataManager.GetSelect().Select<DisasterCategory>(null, out strErrorMessage);

            if (disasterCategories == null)
                return new ResponseSOPList(false, "");

            IEnumerable<SubDisasterCategory> subDisasterCategories = m_dataManager.GetSelect().Select<SubDisasterCategory>(null, out strErrorMessage);

            if (subDisasterCategories == null)
                return new ResponseSOPList(false, "");

            dnsDapperDBUtil.Manager.WebDBManager webDBManager = m_dataManager.GetDBManager();
            SOPManager.DAL.DataManager sopDataManager = new SOPManager.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, data.CampusID);

            string strCondition = string.Format("concat({0}, {1}) in (Select concat({0}, max({1})) from {2} group by {0})",
                SOPManager.Model.Sop.Category.Disaster.Fields.DisasterName,
                SOPManager.Model.Sop.Category.Disaster.Fields.VersionID,
                SOPManager.Model.Sop.Category.Disaster.TableName);
            List<SOPManager.Model.Sop.Category.Disaster> disasters = sopDataManager.GetSelectManager().SelectDisasters(strCondition, out strErrorMessage);

            if (disasters == null)
                return new ResponseSOPList(false, strErrorMessage);

            ResponseSOPList response = new ResponseSOPList(true, "");

            foreach (DisasterCategory disasterCategory in disasterCategories)
            {
                DisasterCategoryData dc = new DisasterCategoryData();

                dc.CategoryName = disasterCategory.CategoryName;
                dc.ID = disasterCategory.ID;
                
                foreach (SubDisasterCategory subDisasterCategory in subDisasterCategories)
                {
                    if (subDisasterCategory.DisasterCategoryID == dc.ID)
                    {
                        SubDisasterCategoryData sdc = new SubDisasterCategoryData();

                        sdc.DisasterCategoryID = dc.ID;
                        sdc.ID = subDisasterCategory.ID;
                        sdc.SubCategoryName = subDisasterCategory.SubCategoryName;
                        
                        foreach (var disaster in disasters)
                        {
                            if (disaster.SubDisasterCategoryID == sdc.ID)
                            {
                                DisasterData d = new DisasterData();

                                d.DisasterName = disaster.DisasterName;
                                d.ID = disaster.ID;
                                d.SubDisasterCategoryID = sdc.ID;

                                sdc.Disasters.Add(d);
                            }
                        }

                        dc.SubDisasterCategories.Add(sdc);
                    }
                }

                response.DisasterCategories.Add(dc);
            }

            return response;
        }

        private MessageResult UpdateLinkedSop(UpdateLinkedSOP data, SOPManager.Model.Sop.Config.LinkedSop linkedSOP, SOPManager.DAL.DataManager sopDataManager)
        {
            linkedSOP.DisasterCategoryID = data.DisasterCategoryID;
            linkedSOP.SubDisasterCategoryID = data.SubDisasterCategoryID;
            linkedSOP.DisasterName = data.DisasterName;

            if (sopDataManager.GetUpdateManager().UpdateLinkedSop(linkedSOP) == false)
                return new MessageResult(false, sopDataManager.GetUpdateManager().GetErrorMessage());

            return new MessageResult(true, "");
        }

        private MessageResult CreateLinkedSOP(List<UpdateLinkedSOP> newLinkedSOPs, SOPManager.DAL.DataManager sopDataManager)
        {
            foreach (UpdateLinkedSOP data in newLinkedSOPs)
            {
                if (sopDataManager.GetCreateManager().CreateLinkedSop(data.FacilityTypeID, data.DisasterCategoryID, data.SubDisasterCategoryID, data.DisasterName, null, data.LinkedBuildingID, data.LinkedZoneID, null, data.CampusID) == null)
                    return new MessageResult(false, sopDataManager.GetCreateManager().GetErrorMessage());
            }

            return new MessageResult(true, "");
        }

        private MessageResult RemoveLinkedSOP(Dictionary<string, SOPManager.Model.Sop.Config.LinkedSop>.ValueCollection values, SOPManager.DAL.DataManager sopDataManager)
        {
            string strIDs = "";

            foreach (var linkedSOP in values)
            {
                if (strIDs.Length == 0)
                    strIDs = linkedSOP.ID.ToString();
                else
                    strIDs += "," + linkedSOP.ID.ToString();
            }

            if (strIDs.Length == 0)
                return new MessageResult(true, "");

            string strCondition = string.Format("{0} in ({1})",
                SOPManager.Model.Sop.Config.LinkedSop.Fields.ID, strIDs);

            if (sopDataManager.GetDeleteManager().DeleteLinkedSop(strCondition) == false)
                return new MessageResult(false, sopDataManager.GetDeleteManager().GetErrorMessage());

            return new MessageResult(true, "");
        }

        private string MakeNullConditionString(string strFieldName, int? data)
        {
            if (data == null)
                return string.Format("{0} is null", strFieldName);

            return string.Format("{0} = {1}", strFieldName, (int)data);
        }

        public MessageResult UpdateSettings(UpdateSettings data)
        {
            string strErrorMessage;

            if (m_dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            MessageResult result = UpdateSettings(data.UpdateOptions, false);

            if (result.Success == false)
            {
                m_dataManager.BatchRollback(out strErrorMessage);
                return result;
            }

            dnsDapperDBUtil.Manager.WebDBManager webDBManager = m_dataManager.GetDBManager();
            SOPManager.DAL.DataManager sopDataManager = new SOPManager.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, data.UpdateOptions.CampusID);

            #region SOP Link

            string strError = null;
            List<int> linkIDs = new List<int>();
            foreach (UpdateLinkedSOP item in data.UpdateLinkedSOPList)
            {
                SOPManager.Model.Sop.Config.LinkedSop temp = new SOPManager.Model.Sop.Config.LinkedSop()
                {
                    ID = item.ID,
                    FacilityTypeID = item.FacilityTypeID,
                    DisasterCategoryID = item.DisasterCategoryID,
                    SubDisasterCategoryID = item.SubDisasterCategoryID,
                    DisasterName = item.DisasterName,
                    LinkedBuildingGroupID = item. LinkedBuildingGroupID,
                    LinkedBuildingID = item.LinkedBuildingID,
                    LinkedZoneID = item.LinkedZoneID,
                    //SiteID = item.SiteID
                    SiteID = data.UpdateOptions.CampusID
                };

                if (item.ID <= 0)
                {
                    SOPManager.Model.Sop.Config.LinkedSop createLinkedSop = sopDataManager.GetCreateManager().CreateLinkedSop(
                        item.FacilityTypeID, item.DisasterCategoryID, item.SubDisasterCategoryID, item.DisasterName, item.LinkedBuildingGroupID, item.LinkedBuildingID, item.LinkedZoneID, "", data.UpdateOptions.CampusID);
                    if (createLinkedSop == null)
                    {
                        m_dataManager.BatchRollback(out strErrorMessage);
                        return result;
                    }

                    temp.ID = createLinkedSop.ID;
                }
                else
                {
                    if (!sopDataManager.GetUpdateManager().UpdateLinkedSop(temp))
                    {
                        m_dataManager.BatchRollback(out strErrorMessage);
                        return result;
                    }
                }

                linkIDs.Add(temp.ID);
            }

            string strQuery = $"SiteID={data.UpdateOptions.CampusID}";
            if (linkIDs.Count > 0)
                strQuery += $" and ID not in ({string.Join(",", linkIDs)})";

            if (!sopDataManager.GetDeleteManager().DeleteLinkedSop(strQuery))
            {
                m_dataManager.BatchRollback(out strErrorMessage);
                result.Message = "신호별 SOP 링크 삭제 실패";
                return result;
            }

            #endregion            

            //Dictionary<SOPManager.Model.Sop.Config.LinkedSop.Fields, object> dicConditions = new Dictionary<SOPManager.Model.Sop.Config.LinkedSop.Fields, object>();
            //dicConditions[SOPManager.Model.Sop.Config.LinkedSop.Fields.SiteID] = data.UpdateOptions.CampusID;

            //List<SOPManager.Model.Sop.Config.LinkedSop> linkedSOPs = sopDataManager.GetSelectManager().SelectLinkedSops(dicConditions, out strErrorMessage);

            //if (linkedSOPs == null)
            //{
            //    result = new MessageResult(false, strErrorMessage);
            //    m_dataManager.BatchRollback(out strErrorMessage);
            //    return result;
            //}

            //Dictionary<string, SOPManager.Model.Sop.Config.LinkedSop> dicLinkedSOPs = new Dictionary<string, SOPManager.Model.Sop.Config.LinkedSop>();

            //foreach (var linkedSOP in linkedSOPs)
            //{
            //    string strKey = string.Format("{0}_{1}_{2}",
            //        linkedSOP.FacilityTypeID,
            //        linkedSOP.LinkedBuildingGroupID == null ? "null" : ((int)linkedSOP.LinkedBuildingGroupID).ToString(),
            //        linkedSOP.LinkedBuildingID == null ? "null" : ((int)linkedSOP.LinkedBuildingID).ToString());

            //    dicLinkedSOPs[strKey] = linkedSOP;
            //}

            //List<UpdateLinkedSOP> newLinkedSOPs = new List<UpdateLinkedSOP>();

            //foreach (var linkedSOP in data.UpdateLinkedSOPList)
            //{
            //    string strKey = string.Format("{0}_{1}_{2}",
            //        linkedSOP.FacilityTypeID,
            //        linkedSOP.LinkedBuildingID == null ? "null" : ((int)linkedSOP.LinkedBuildingID).ToString(),
            //        linkedSOP.LinkedZoneID == null ? "null" : ((int)linkedSOP.LinkedZoneID).ToString());

            //    SOPManager.Model.Sop.Config.LinkedSop _linkedSOP;

            //    if (dicLinkedSOPs.TryGetValue(strKey, out _linkedSOP))
            //    {
            //        result = UpdateLinkedSop(linkedSOP, _linkedSOP, sopDataManager);

            //        if (result.Success == false)
            //        {
            //            m_dataManager.BatchRollback(out strErrorMessage);
            //            return result;
            //        }

            //        dicLinkedSOPs.Remove(strKey);
            //    }
            //    else
            //        newLinkedSOPs.Add(linkedSOP);
            //}

            //result = RemoveLinkedSOP(dicLinkedSOPs.Values, sopDataManager);

            //if (result.Success == false)
            //{
            //    m_dataManager.BatchRollback(out strErrorMessage);
            //    return result;
            //}

            //result = CreateLinkedSOP(newLinkedSOPs, sopDataManager);

            //if (result.Success == false)
            //{
            //    m_dataManager.BatchRollback(out strErrorMessage);
            //    return result;
            //}

            if (m_dataManager.BatchCommit(out strErrorMessage) == false)
            {
                result = new MessageResult(false, strErrorMessage);
                m_dataManager.BatchRollback(out strErrorMessage);
            }

            return result;
        }

        public ResponseAlarmOptions GetAlarmOptions()
        {
            string strErrorMessage;
            IEnumerable<OptionSDMS> sdmsOptions = m_dataManager.GetSelect().Select<OptionSDMS>(null, out strErrorMessage);

            if (sdmsOptions == null)
                return new ResponseAlarmOptions(false, "");

            ResponseAlarmOptions response = new ResponseAlarmOptions(true, "");

            foreach (OptionSDMS option in sdmsOptions)
            {
                response.Option3DSensor.SetOption(option.PropertyName, option.PropertyValue);
            }

            return response;
        }

        public MessageResult SaveSOPSetting(RequestSaveSetting req)
        {
            MessageResult result = new MessageResult();

            OptionSopSimulator option = m_dataManager.GetSelect().SelectFirst<OptionSopSimulator>($"{OptionSopSimulator.Fields.PropertyName}='{req.PropertyName}'", out string strErrorMessage);
            if (option == null)            
            {
                option = new OptionSopSimulator();
                option.PropertyName = req.PropertyName;
                option.PropertyValue = req.PropertyValue;
                option.SiteID = req.CampusID;

                if (!m_dataManager.GetCreate().Insert<OptionSopSimulator>(option, out strErrorMessage))
                {
                    result.Message = strErrorMessage;
                    return result;
                }
            }
            else
            {                
                option.PropertyValue = req.PropertyValue;
                if (!m_dataManager.GetUpdate().Update<OptionSopSimulator>(option, null, out strErrorMessage))
                {
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            result.Success = true;
            return result;
        }
    }
}
