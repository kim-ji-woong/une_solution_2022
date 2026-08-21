using System.Collections.Generic;
using Common.IDAL;
using Common.Model.Option;

namespace PatternScheduler
{
    class ScheduleReader
    {
        private const string ForcedDoorOpen = "ForedDoorOpen";
        private const string CheatedTagging = "CheatedTagging";
        private const string Untagging = "Untagging";
        private const string StealCard = "StealCard";
        private const string Stranger = "Stranger";
        private const string StrangerLv3 = "StrangerLv3";
        private const string EvasionItem = "EvasionItem";
        private const string NotPermittedPerson = "NotPermittedPerson";
        private const string NotPermittedItem = "NotPermittedItem";

        private IDataManager m_dataManager = null;

        public ScheduleReader(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public Dictionary<string, List<string>> ReadSchedules()
        {
            bool isNulable;
            string strCondition = string.Format("{0} like 'time%' order by {0}", Options.GetFieldName(Options.Fields.PropertyName, out isNulable));

            string strErrorMessage;
            List<Options> options = m_dataManager.GetSelectManager().SelectOptions(Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return null;

            Dictionary<string, List<string>> dicSchedules = new Dictionary<string, List<string>>();

            foreach (Options option in options)
            {
                string strEventType;
                List<string> schedules = GetSchedules(option, out strEventType);

                if (schedules != null)
                    dicSchedules[strEventType] = schedules;
            }

            string strForcedDoorOpen = ForcedDoorOpen.ToLower(); ;
            string strCheatedTagging = CheatedTagging.ToLower();
            string strUntagging = Untagging.ToLower();
            string strStealCard = StealCard.ToLower();
            string strStranger = Stranger.ToLower();
            string strStrangerLv3 = StrangerLv3.ToLower();
            string strEvasionItem = EvasionItem.ToLower();
            string strNotPermittedPerson = NotPermittedPerson.ToLower();
            string strNotPermittedItem = NotPermittedItem.ToLower();

            if (dicSchedules.ContainsKey(strForcedDoorOpen) == false)
                dicSchedules[strForcedDoorOpen] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strCheatedTagging) == false)
                dicSchedules[strCheatedTagging] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strUntagging) == false)
                dicSchedules[strUntagging] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strStealCard) == false)
                dicSchedules[strStealCard] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strEvasionItem) == false)
                dicSchedules[strEvasionItem] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strStranger) == false)
                dicSchedules[strStranger] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strStrangerLv3) == false)
                dicSchedules[strStrangerLv3] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strNotPermittedPerson) == false)
                dicSchedules[strNotPermittedPerson] = GetDefaultSchedule();

            if (dicSchedules.ContainsKey(strNotPermittedItem) == false)
                dicSchedules[strNotPermittedItem] = GetDefaultSchedule();

            return dicSchedules;
        }

        private List<string> GetDefaultSchedule()
        {
            List<string> schedules = new List<string>();
            schedules.Add("00:00:00-23:59:59");
            return schedules;
        }

        private List<string> GetSchedules(Options option, out string strEventType)
        {
            strEventType = null;

            if (option.PropertyValue == null || option.PropertyName.Length <= 4)
                return null;

            strEventType = option.PropertyName.Substring(4).ToLower();

            List<string> schedules = new List<string>();
            string[] tokens = option.PropertyValue.Split(';');

            foreach (string strToken in tokens)
            {
                string[] times = strToken.Split('-');

                if (times.Length == 2)
                {
                    int hour, min, sec;

                    if (GetTime(times[0], out hour, out min, out sec) && GetTime(times[1], out hour, out min, out sec))
                        schedules.Add(strToken);
                }
            }

            return schedules;
        }

        private bool GetTime(string strTime, out int hour, out int min, out int sec)
        {
            string[] tokens = strTime.Split(':');

            if (tokens.Length == 3)
            {
                if (int.TryParse(tokens[0].Trim(), out hour) && int.TryParse(tokens[1].Trim(), out min) && int.TryParse(tokens[2].Trim(), out sec))
                    return true;
            }

            hour = min = sec = 0;
            return false;
        }

        public bool UpdateSchedule(string strEventType, string strSchedule, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strPropertyName = GetPropertyName(strEventType);

            if (strPropertyName == null)
                return false;

            bool isNullable;
            string strCondition = string.Format("{0} = '{1}'", Options.GetFieldName(Options.Fields.PropertyName, out isNullable), strPropertyName);
            List<Options> options = m_dataManager.GetSelectManager().SelectOptions(Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return false;

            if (options.Count > 0)
            {
                Options option = options[0];
                option.PropertyValue = strSchedule;

                if (m_dataManager.GetUpdateManager().UpdateOption(Options.OptionTarget.SDMS, option) == false)
                {
                    strErrorMessage = m_dataManager.GetUpdateManager().GetErrorMessage();
                    return false;
                }
                else
                    return true;
            }

            if (m_dataManager.GetCreateManager().CreateOption(Options.OptionTarget.SDMS, strPropertyName, strSchedule, m_dataManager.SiteID) == null)
            {
                strErrorMessage = m_dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }

            return true;
        }

        private string GetPropertyName(string strEventType)
        {
            if (strEventType == ForcedDoorOpen.ToLower())
                return "time" + ForcedDoorOpen;
            else if (strEventType == CheatedTagging.ToLower())
                return "time" + CheatedTagging;
            else if (strEventType == Untagging.ToLower())
                return "time" + Untagging;
            else if (strEventType == StealCard.ToLower())
                return "time" + StealCard;
            else if (strEventType == Stranger.ToLower())
                return "time" + Stranger;
            else if (strEventType == StrangerLv3.ToLower())
                return "time" + StrangerLv3;
            else if (strEventType == EvasionItem.ToLower())
                return "time" + EvasionItem;
            else if (strEventType == NotPermittedPerson.ToLower())
                return "time" + NotPermittedPerson;
            else if (strEventType == NotPermittedItem.ToLower())
                return "time" + NotPermittedItem;

            return null;
        }
    }
}
