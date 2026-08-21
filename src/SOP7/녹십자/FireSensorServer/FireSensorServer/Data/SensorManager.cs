using dnsDBUtil;
using SDMS.DAL;
using SDMS.Model.Sensor;
using System.Collections.Generic;

namespace FireSensorServer.Data
{
    public class SensorManager
    {
        // 센서 Tag번호는 00으로 시작할수도 있기 때문에 10억을 앞에 붙인다.
        private const int PaddingTag = 1000000000;

        // 센서타입별로 SensorTag들을 따로 관리한다.
        // 예를 들어 화재업체가 다를경우 같은 TagNo를 가진 센서가 존재할 수 있다.
        // 그래서, 화재업체별(센서타입별)로 따로 SensorTag를 관리하도록 한다.
        // 첫번째 Key : SensorServerInfo ID
        // 두번째 Key : TagNo
        private Dictionary<int, Dictionary<int, TagInfo>> m_dicSensorTags = new Dictionary<int, Dictionary<int, TagInfo>>();

        private static Common.DAL.DataManager m_commDataManager = null;

        private static SensorManager m_instance = null;

        public static SensorManager Instance
        {
            get { return m_instance; }
        }

        public SensorManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw, int nSiteID)
        {
            m_instance = this;
            DataManager dataManager = new DataManager(nDbType, strDbHost, strDbName, strDbID, strDbPw, nSiteID);
            ReadSensorTagInfo(dataManager);

            m_commDataManager = new Common.DAL.DataManager(nDbType, strDbHost, strDbName, strDbID, strDbPw, nSiteID);
        }

        private void ReadSensorTagInfo(DataManager dataManager)
        {
            string strErrorMessage;
            List<TagInfo> sensorTagInfos = dataManager.GetSelectManager().SelectSensorTagInfo(null, null, out strErrorMessage);

            if (sensorTagInfos == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadSensorTagInfo Error : " + strErrorMessage);
                return;
            }

            Dictionary<int, TagInfo> dicSensorTags = null;

            foreach (TagInfo tag in sensorTagInfos)
            {
                if (m_dicSensorTags.TryGetValue(tag.SensorServerID, out dicSensorTags) == false)
                {
                    dicSensorTags = new Dictionary<int, TagInfo>();
                    m_dicSensorTags[tag.SensorServerID] = dicSensorTags;
                }

                int tagNo = (tag.SensorServerID == 2) ? GetTagNo(tag.TagNo) : tag.TagNo;
                dicSensorTags[tagNo] = tag;
            }
        }

        private int GetTagNo(int tagNo)
        {
            return tagNo - PaddingTag;
            /*if (tagNo < 0)
            {
                string strTagNo = tagNo.ToString().Substring(2);

                int no;

                if (int.TryParse(strTagNo, out no))
                    return no;
            }

            return tagNo;*/
        }

        public TagInfo GetTagInfo(int nSensorServerID, int tagNo)
        {
            TagInfo tag;
            Dictionary<int, TagInfo> dicSensorTags = null;

            if (m_dicSensorTags.TryGetValue(nSensorServerID, out dicSensorTags))
            {
                if (dicSensorTags.TryGetValue(tagNo, out tag))
                    return tag;
            }

            return null;
        }

        public TagInfo GetTagInfo(int nSensorServerID, int nReceiverID, int nRelayTeam, int nLoopID, int nRelayID, int nTagID)
        {
            int tagNo = GetSensorTagNumber(nReceiverID, nRelayTeam, nLoopID, nRelayID, nTagID);
            return GetTagInfo(nSensorServerID, tagNo);
        }

        public static int GetSensorTagNumber(int nReceiverID, int nRelayTeam, int nLoopID, int nRelayID, int nTagID)
        {
            //1000000000 + 수신기*10000000 + 중계반*100000 + Loop*10000 + Relay*10 + TagID
            return /*PaddingTag +*/ nReceiverID * 10000000 + nRelayTeam * 100000 + nLoopID * 10000 + nRelayID * 10 + nTagID;
        }

        public static bool UpdateConnState(int nConnState, out string strErrorMessage)
        {
            Dictionary<Common.Model.Option.Options.Fields, object> dicSets = new Dictionary<Common.Model.Option.Options.Fields, object>();
            dicSets[Common.Model.Option.Options.Fields.PropertyValue] = nConnState.ToString();

            Dictionary<Common.Model.Option.Options.Fields, object> dicConditions = new Dictionary<Common.Model.Option.Options.Fields, object>();
            dicSets[Common.Model.Option.Options.Fields.PropertyName] = "ServerConnState_Fire";


            bool bResult = m_commDataManager.GetUpdateManager().UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, dicSets, dicConditions, null, out strErrorMessage);
            return bResult;
        }
    }
}
