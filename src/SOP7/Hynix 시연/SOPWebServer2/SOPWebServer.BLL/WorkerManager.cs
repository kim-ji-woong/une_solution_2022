using System;
using System.Collections.Generic;
using SDMS.Model.Sensor;
using Hynix.Model.History;

namespace SOPWebServer.BLL
{
    using Response;
    using Server;

    public class WorkerManager
    {
        private const int CardTagType = 959;
        private const int SmartTagType = 960;

        private MainManager m_mainManager = null;

        public WorkerManager(MainManager mainManager)
        {
            m_mainManager = mainManager;
        }

        public MessageResult SetTag(int sensorZoneID, int? cardReaderID, int? smartTagReaderID, DateTime? timeStamp)
        {
            if (cardReaderID == null && smartTagReaderID == null)
                return new MessageResult(false, "카드리더기와 스마트태그 리더기 모두 값이 NULL입니다.");

            string strErrorMessage;
            SensorZone sensorZone = m_mainManager.SDMSDataManager.GetSelectManager().SelectSensorZone(sensorZoneID, out strErrorMessage);

            if (sensorZone == null)
                return new MessageResult(false, strErrorMessage);

            if (sensorZone.SensorType == CardTagType)
            {
                return ProcessCard(sensorZone, cardReaderID, timeStamp);
            }
            else if (sensorZone.SensorType == SmartTagType)
            {
                return ProcessSmartTag(sensorZone, smartTagReaderID, timeStamp);
            }

            return new MessageResult(false, "알수없는 센서타입 입니다.");
        }

        public MessageResult AddMovingPosition(int sensorZoneHistoryID, DateTime timestamp, string strPosition)
        {
            StrangerSensor server = new StrangerSensor(m_mainManager, m_mainManager.SensorManager.Factory);
            return server.AddMovingPosition(sensorZoneHistoryID, timestamp, strPosition);
        }

        private MessageResult ProcessCard(SensorZone sensorZone, int? cardReaderID, DateTime? timeStamp)
        {
            if (cardReaderID != null)
                return ProcessWorkerCardReader(sensorZone, (int)cardReaderID, timeStamp);

            return new MessageResult(false, "카드리더기와 스마트태그 리더기 모두 값이 NULL입니다.");
        }

        private MessageResult ProcessSmartTag(SensorZone sensorZone, int? smartTagReaderID, DateTime? timeStamp)
        {
            if (smartTagReaderID != null)
                return ProcessSmartTagReader(sensorZone, (int)smartTagReaderID, timeStamp);

            return new MessageResult(false, "카드리더기와 스마트태그 리더기 모두 값이 NULL입니다.");
        }

        private MessageResult ProcessSmartTagReader(SensorZone sensorZone, int smartTagReaderID, DateTime? timeStamp)
        {
            string strCondition = null;
            bool isNullable;

            if (timeStamp != null)
            {
                string strPrevTime = CheatedTaggingSensor.GetTimeString(((DateTime)timeStamp).AddSeconds(-3));
                string strPostTime = CheatedTaggingSensor.GetTimeString(((DateTime)timeStamp).AddSeconds(3));
                strCondition = string.Format("{0} >= '{1}' and {0} <= '{2}'", SmartTag.GetFieldName(SmartTag.Fields.Time, out isNullable), strPrevTime, strPostTime);
            }
            else
            {
                strCondition = string.Format("{0} = (Select max({0}) from {1})", SmartTag.GetFieldName(SmartTag.Fields.Time, out isNullable), SmartTag.TableName);
            }

            string strErrorMessage;
            List<SmartTag> smartTagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixSmartTagHistorys(null, strCondition, out strErrorMessage);

            if (smartTagHistories == null)
                return new MessageResult(false, strErrorMessage);

            if (smartTagHistories.Count == 0)
                return new MessageResult(false, "태그된 스마트태그 정보를 찾을수 없습니다.");

            SmartTag targetTagHistory = smartTagHistories[smartTagHistories.Count - 1];

            if (timeStamp != null)
            {
                TimeSpan _span = targetTagHistory.Time - (DateTime)timeStamp;
                double min = _span.TotalSeconds < 0 ? -_span.TotalSeconds : _span.TotalSeconds;

                // 가장 timeStamp와 가까운 시간을 찾는다.
                foreach (SmartTag tagHistory in smartTagHistories)
                {
                    TimeSpan span = tagHistory.Time - (DateTime)timeStamp;
                    double diff = span.TotalSeconds < 0 ? -span.TotalSeconds : span.TotalSeconds;

                    if (diff < min)
                    {
                        min = diff;
                        targetTagHistory = tagHistory;
                    }
                }
            }

            Hynix.Model.SmartTag smartTag = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixSmartTag(targetTagHistory.SmartTagID, out strErrorMessage);

            if (smartTag == null)
                return new MessageResult(false, strErrorMessage);

            if (smartTag.WorkerID != null)
            {
                // 꼬리물기인가?
                UntaggingSensor.CheckEvent(m_mainManager, targetTagHistory, sensorZone, smartTag, out strErrorMessage);

                // 비인가 구역에 출입하였는가?
                NotPermittedPersonSensor.CheckEvent(m_mainManager, targetTagHistory, sensorZone, smartTag, out strErrorMessage);
            }
            else if (smartTag.ItemID != null)
            {
                // 비인가 구역에 물품이 반입되었는가?
                NotPermittedItemSensor.CheckEvent(m_mainManager, targetTagHistory, sensorZone, smartTag, out strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        private MessageResult ProcessWorkerCardReader(SensorZone sensorZone, int cardReaderID, DateTime? timeStamp)
        {
            string strCondition = null;
            bool isNullable;

            if (timeStamp != null)
            {
                string strPrevTime = CheatedTaggingSensor.GetTimeString(((DateTime)timeStamp).AddSeconds(-3));
                string strPostTime = CheatedTaggingSensor.GetTimeString(((DateTime)timeStamp).AddSeconds(3));
                strCondition = string.Format("{0} >= '{1}' and {0} <= '{2}'", CardTag.GetFieldName(CardTag.Fields.Time, out isNullable), strPrevTime, strPostTime);
            }
            else
            {
                strCondition = string.Format("{0} = (Select max({0}) from {1})", CardTag.GetFieldName(CardTag.Fields.Time, out isNullable), CardTag.TableName);
            }

            string strErrorMessage;
            List<CardTag> cardTagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

            if (cardTagHistories == null)
                return new MessageResult(false, strErrorMessage);

            if (cardTagHistories.Count == 0)
                return new MessageResult(false, "태그된 사원증 정보를 찾을수 없습니다.");

            CardTag targetTagHistory = cardTagHistories[cardTagHistories.Count - 1];

            if (timeStamp != null)
            {
                TimeSpan _span = targetTagHistory.Time - (DateTime)timeStamp;
                double min = _span.TotalSeconds < 0 ? -_span.TotalSeconds : _span.TotalSeconds;

                // 가장 timeStamp와 가까운 시간을 찾는다.
                foreach (CardTag tagHistory in cardTagHistories)
                {
                    TimeSpan span = tagHistory.Time - (DateTime)timeStamp;
                    double diff = span.TotalSeconds < 0 ? -span.TotalSeconds : span.TotalSeconds;

                    if (diff < min)
                    {
                        min = diff;
                        targetTagHistory = tagHistory;
                    }
                }
            }

            // 대리태깅인가?
            CheatedTaggingSensor.CheckEvent(m_mainManager, targetTagHistory, sensorZone, out strErrorMessage);

            // 사원증 도용인가?
            StealCardSensor.CheckEvent(m_mainManager, targetTagHistory, sensorZone, out strErrorMessage);
            
            return new MessageResult(true, "");
        }

        public static int? GetSensorTagID(MainManager mainManager, int sensorZoneID, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} = {1}", TagInfo.GetFieldName(TagInfo.Fields.SensorZoneID, out isNullable), sensorZoneID);
            List<TagInfo> tagInfos = mainManager.SDMSDataManager.GetSelectManager().SelectSensorTagInfo(null, strCondition, out strErrorMessage);

            if (tagInfos == null)
                return null;

            foreach (TagInfo tagInfo in tagInfos)
            {
                return tagInfo.ID;
            }

            return null;
        }
    }
}
