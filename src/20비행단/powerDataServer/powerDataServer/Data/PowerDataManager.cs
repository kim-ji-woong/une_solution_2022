using Airbase20.DAL;
using Airbase20.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace powerDataServer.Data
{
    public class PowerDataManager
    {
        private DataManager m_dataManager = null;

        private Dictionary<int, SwitchData> m_dicSwitchDatas = null;
        public Dictionary<int, SwitchData> SwitchDatas 
        {
            get { return m_dicSwitchDatas; }
            set { m_dicSwitchDatas = value; }
        }

        private Dictionary<int, PeckPower> m_dicPeckPowers = null;
        public Dictionary<int, PeckPower> PeckPowers
        {
            get { return m_dicPeckPowers; }
            set { m_dicPeckPowers = value; }
        }

        private Dictionary<int, Relay> m_dicRelays = null;
        public Dictionary<int, Relay> Relays
        {
            get { return m_dicRelays; }
            set { m_dicRelays = value; }
        }

        public PowerDataManager()
        {

        }

        public PowerDataManager(DataManager dataManager)
        {
            m_dataManager = dataManager;

            Init();
        }

        private void Init()
        {
            string strErrorMessage;

            if (LoadSensors(out strErrorMessage) == false)
            {
                Logger.Instance.Write(strErrorMessage);
            }
        }

        private bool LoadSensors(out string strErrorMessage)
        {
            strErrorMessage = "";

            List<Switch> switches = m_dataManager.GetSelectManager().SelectSwitchs(null, null, out strErrorMessage);
            if (switches == null)
            {
                strErrorMessage = "1. LoadSensors Error (SelectSwitchs 실패: " + strErrorMessage + ")";
                return false;
            } 
            else if (switches.Count == 0)
            {
                strErrorMessage = "2. LoadSensors Error (DB에 Switch 데이터가 존재하지 않습니다.)";
                return false;
            }

            foreach (Switch data in switches)
            {
                SwitchData switchData = new SwitchData(data);

                if (m_dicSwitchDatas == null)
                    m_dicSwitchDatas = new Dictionary<int, SwitchData>();

                m_dicSwitchDatas[switchData.ID] = switchData;
            }

            List<SwitchDetail> switchDetails = m_dataManager.GetSelectManager().SelectSwitchDetails(null, null, out strErrorMessage);
            if (switchDetails == null)
            {
                strErrorMessage = "3. LoadSensors Error (SelectSwitchDetails 실패: " + strErrorMessage + ")";
                return false;
            }
            else if (switchDetails.Count == 0)
            {
                strErrorMessage = "4. LoadSensors Error (DB에 SwitchDetail 데이터가 존재하지 않습니다.)";
                return false;
            }

            foreach (SwitchDetail detail in switchDetails)
            {
                if (m_dicSwitchDatas.ContainsKey(detail.SwitchID) == false)
                    continue;

                SwitchData switchData = m_dicSwitchDatas[detail.SwitchID];

                if (switchData.SwitchDetails == null)
                    switchData.SwitchDetails = new Dictionary<int, SwitchDetail>();

                switchData.SwitchDetails[detail.Circuit] = detail;
            }

            List<Relay> relays = m_dataManager.GetSelectManager().SelectRelays(null, null, out strErrorMessage);
            if (relays == null)
            {
                strErrorMessage = "5. LoadSensors Error (SelectRelays 실패: " + strErrorMessage + ")";
                return false;
            }
            else if (relays.Count == 0)
            {
                strErrorMessage = "6. LoadSensors Error (DB에 Relay 데이터가 존재하지 않습니다.)";
                return false;
            }

            foreach (Relay relay in relays)
            {
                if (m_dicRelays == null)
                    m_dicRelays = new Dictionary<int, Relay>();

                m_dicRelays[relay.ID] = relay;
            }


            List<PeckPower> peckPowers = m_dataManager.GetSelectManager().SelectPeckPowers(null, null, out strErrorMessage);
            if (relays == null)
            {
                strErrorMessage = "7. LoadSensors Error (SelectPeckPowers 실패: " + strErrorMessage + ")";
                return false;
            }
            else if (relays.Count == 0)
            {
                strErrorMessage = "8. LoadSensors Error (DB에 PeckPower 데이터가 존재하지 않습니다.)";
                return false;
            }

            foreach (PeckPower peck in peckPowers)
            {
                if (m_dicPeckPowers == null)
                    m_dicPeckPowers = new Dictionary<int, PeckPower>();

                m_dicPeckPowers[peck.ID] = peck;
            }

            return true;
        }

        public bool UpdateSwitchDetails(Dictionary<int, SwitchDetail> SwitchDetails, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (SwitchDetails == null && SwitchDetails.Count == 0)
            {
                strErrorMessage = "1. UpdateSwitchDetails Error (SwitchDetails 데이터가 존재하지 않습니다.)";
                return false;
            }

            foreach (KeyValuePair<int, SwitchDetail> pair in SwitchDetails)
            {
                SwitchDetail switchDetail = pair.Value;

                if (m_dataManager.GetUpdateManager().UpdateSwitchDetail(switchDetail, out strErrorMessage) == false)
                {
                    strErrorMessage = "2. UpdateSwitchDetails Error (" + strErrorMessage + ")";
                    return false;
                }
            }

            return true;
        }

        public bool UpdateRelay(Relay relay, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (relay == null)
            {
                strErrorMessage = "1. UpdateRelay Error (Relay 데이터가 존재하지 않습니다.)";
                return false;
            }

            if (m_dataManager.GetUpdateManager().UpdateRelay(relay, out strErrorMessage) == false)
            {
                strErrorMessage = "2. UpdateRelay Error (" + strErrorMessage + ")";
                return false;
            }

            // 오늘 날짜 히스토리 조회
            DateTime dtToday = DateTime.Today;

            Dictionary<RelayHistory.Fields, object> dicConditions = new Dictionary<RelayHistory.Fields, object>();
            dicConditions[RelayHistory.Fields.RelayID] = relay.ID;
            dicConditions[RelayHistory.Fields.Date] = dtToday;

            List<RelayHistory> relayHistories = m_dataManager.GetSelectManager().SelectRelayHistorys(dicConditions, null, out strErrorMessage);
            if (relayHistories == null)
            {
                strErrorMessage = "3. SelectRelayHistorys Error (" + strErrorMessage + ")";
                return false;
            }
            else if (relayHistories.Count == 0)
            {
                // 없으면 새로 생성
                RelayHistory relayHistory = new RelayHistory();
                relayHistory.RelayID = relay.ID;
                relayHistory.Date = dtToday;
                relayHistory.ActivePowerTotal = relay.ActivePowerTotal;
                relayHistory.ReactivePowerTotal = relay.ReactivePowerTotal;

                if (m_dataManager.GetCreateManager().CreateRelayHistory(relayHistory, out strErrorMessage) == null)
                {
                    strErrorMessage = "4. CreateRelayHistory Error (" + strErrorMessage + ")";
                    return false;
                }
            }
            else if (relayHistories.Count == 1)
            {
                // 있다면 업데이트
                RelayHistory relayHistory = relayHistories[0];
                relayHistory.ActivePowerTotal = relay.ActivePowerTotal;
                relayHistory.ReactivePowerTotal = relay.ReactivePowerTotal;

                if (m_dataManager.GetUpdateManager().UpdateRelayHistory(relayHistory, out strErrorMessage) == false)
                {
                    strErrorMessage = "5. UpdateRelayHistory Error (" + strErrorMessage + ")";
                    return false;
                }
            }
            else if (relayHistories.Count > 1)
            {
                // 있다면 업데이트
                RelayHistory relayHistory = relayHistories[0];
                relayHistory.ActivePowerTotal = relay.ActivePowerTotal;
                relayHistory.ReactivePowerTotal = relay.ReactivePowerTotal;

                if (m_dataManager.GetUpdateManager().UpdateRelayHistory(relayHistory, out strErrorMessage) == false)
                {
                    strErrorMessage = "6. UpdateRelayHistory Error (" + strErrorMessage + ")";
                    return false;
                }

                // 이외 삭제
                Dictionary<RelayHistory.Fields, object> dicConditions_RelayHistory = new Dictionary<RelayHistory.Fields, object>();
                dicConditions_RelayHistory[RelayHistory.Fields.RelayID] = relay.ID;
                dicConditions_RelayHistory[RelayHistory.Fields.Date] = dtToday;

                string strAdditionalConditions = string.Format("{0} != {1}", RelayHistory.Fields.ID, relayHistory.ID);

                if (m_dataManager.GetDeleteManager().DeleteRelayHistory(dicConditions_RelayHistory, strAdditionalConditions, out strErrorMessage) == false)
                {
                    strErrorMessage = "7. DeleteRelayHistory Error (" + strErrorMessage + ")";
                    return false;
                }
            }

            return true;
        }


        public bool UpdatePeckPowers(Dictionary<int, PeckPower> PeckPowers, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (PeckPowers == null && PeckPowers.Count == 0)
            {
                strErrorMessage = "1. UpdatePeckPowers Error (PeckPowers 데이터가 존재하지 않습니다.)";
                return false;
            }

            foreach (KeyValuePair<int, PeckPower> pair in PeckPowers)
            {
                PeckPower peckPower = pair.Value;

                if (m_dataManager.GetUpdateManager().UpdatePeckPower(peckPower, out strErrorMessage) == false)
                {
                    strErrorMessage = "2. UpdatePeckPowers Error (" + strErrorMessage + ")";
                    return false;
                }
            }

            return true;
        }
    }
}
