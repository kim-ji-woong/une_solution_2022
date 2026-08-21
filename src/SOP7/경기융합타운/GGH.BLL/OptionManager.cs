using System.Collections.Generic;
using Common.BLL.Models.Request;
using Common.BLL.Models.Response;
using dnsDBUtil;

namespace GGH.BLL
{
    public class OptionManager
    {
        private static readonly string AES_key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;

        public OptionManager(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, SOPManager.IDAL.IDataManager sopDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_sdmsDataManager = sdmsDataManager;
            m_commonDataManager = commonDataManager;
            m_sopDataManager = sopDataManager;
            m_teamDataManager = teamDataManager;
        }

        public MessageResult SaveSettings(RequestSaveSettings data)
        {
            Common.BLL.ProcessManager commonProcessManager = new Common.BLL.ProcessManager(m_commonDataManager, m_sopDataManager, m_teamDataManager, m_sdmsDataManager);
            MessageResult result = commonProcessManager.GetOptionManager().SaveSettings(data);

            if (result.Success == false)
                return result;

            int nSiteID = data.SiteID == null ? 40 : (int)data.SiteID;
            Common.IDAL.IDataManager commonDataManager = nSiteID == 40 ? null : GetExternalCommonDataManager(nSiteID);

            // Key : Site ID
            Dictionary<int, Common.IDAL.IDataManager> dicDataManagers = new Dictionary<int, Common.IDAL.IDataManager>();
            dicDataManagers[nSiteID] = commonDataManager;

            Dictionary<Common.IDAL.IDataManager, bool> disabledManager = new Dictionary<Common.IDAL.IDataManager, bool>();

            foreach (var propertyData in data.UsePropertyDatas)
            {
                string strPropertyName = propertyData.Name.ToLower();

                if (strPropertyName.StartsWith("usereceive"))
                {
                    Common.IDAL.IDataManager dataManager = null;

                    if (commonDataManager != null)
                    {
                        if (propertyData.SiteID == nSiteID)
                            dataManager = commonDataManager;
                    }
                    else
                        dataManager = GetExternalCommonDataManager(propertyData.SiteID, dicDataManagers);

                    UpdateOption(dataManager, propertyData, disabledManager);
                }
            }

            return result;
        }

        private void UpdateOption(Common.IDAL.IDataManager dataManager, UsePropertyData propertyData, Dictionary<Common.IDAL.IDataManager, bool> disabledManager)
        {
            if (dataManager == null)
                return;

            if (disabledManager.ContainsKey(dataManager))
                return;

            string strErrorMessage;
            List<Common.Model.Option.Options> options = dataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, propertyData.Name, propertyData.SiteID, out strErrorMessage);

            if (options == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                disabledManager[dataManager] = true;
                return;
            }

            if (options.Count > 0)
            {
                var option = options[0];

                Dictionary<Common.Model.Option.Options.Fields, object> dicSets = new Dictionary<Common.Model.Option.Options.Fields, object>();
                dicSets[Common.Model.Option.Options.Fields.PropertyValue] = propertyData.Value.ToString().ToLower();

                Dictionary<Common.Model.Option.Options.Fields, object> dicConditions = new Dictionary<Common.Model.Option.Options.Fields, object>();
                dicConditions[Common.Model.Option.Options.Fields.ID] = option.ID;

                if (dataManager.GetUpdateManager().UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    disabledManager[dataManager] = true;
                }
            }
            else
            {
                if (dataManager.GetCreateManager().CreateOption(Common.Model.Option.Options.OptionTarget.SDMS, propertyData.Name, propertyData.Value.ToString().ToLower(), propertyData.SiteID) == null)
                {
                    System.Diagnostics.Trace.WriteLine(dataManager.GetCreateManager().GetErrorMessage());
                    disabledManager[dataManager] = true;
                }
            }
        }

        private Common.IDAL.IDataManager GetExternalCommonDataManager(int siteID, Dictionary<int, Common.IDAL.IDataManager> dicDataManagers)
        {
            Common.IDAL.IDataManager dataManager;

            if (dicDataManagers.TryGetValue(siteID, out dataManager) == false)
            {
                dataManager = GetExternalCommonDataManager(siteID);
                dicDataManagers[siteID] = dataManager;
            }

            return dataManager;
        }

        private Common.IDAL.IDataManager GetExternalCommonDataManager(int siteID)
        {
            string strErrorMessage;
            List<Common.Model.Option.Options> options = m_commonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, "ExternalAlarmDB", siteID, out strErrorMessage);

            if (options == null)
                return null;

            foreach (var option in options)
            {
                if (option.PropertyValue != null)
                {
                    string strValue = AES256Cipher.AES_decrypt(option.PropertyValue, AES_key);
                    string[] tokens = strValue.Split('/');

                    if (tokens.Length == 4)
                    {
                        string strHost = tokens[0].Trim();
                        string strDbName = tokens[1].Trim();
                        string strId = tokens[2].Trim();
                        string strPw = tokens[3].Trim();

                        return m_commonDataManager.Clone(strHost, strDbName, strId, strPw, siteID);
                    }
                }

                break;
            }

            return null;
        }
    }
}
