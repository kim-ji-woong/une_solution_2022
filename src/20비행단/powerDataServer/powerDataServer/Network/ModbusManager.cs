using Airbase20.DAL;
using Airbase20.Model;
using powerDataServer.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace powerDataServer.Network
{
    public class ModbusManager
    {
        private Dictionary<int, ClientSwitchProvider> m_dicClientSwitchProviders = null;
        private Dictionary<int, ClientRelayProvider> m_dicClientRelayProviders = null;
        private ClientPeckProvider m_peckProvider = null;

        public ModbusManager(DataManager dataManager, PowerDataManager powerDataManager)
        {
            Init(dataManager, powerDataManager);
        }

        public void Start()
        {
            if (m_dicClientSwitchProviders != null)
            {
                foreach (KeyValuePair<int, ClientSwitchProvider> pair in m_dicClientSwitchProviders)
                {
                    ClientSwitchProvider provider = pair.Value;

                    provider.Start();
                }
            }

            if (m_dicClientRelayProviders != null)
            {
                foreach (KeyValuePair<int, ClientRelayProvider> pair in m_dicClientRelayProviders)
                {
                    ClientRelayProvider provider = pair.Value;

                    provider.Start();
                }
            }

            if (m_peckProvider != null)
                m_peckProvider.Start();
        }

        public void Stop()
        {
            if (m_dicClientSwitchProviders != null)
            {
                foreach (KeyValuePair<int, ClientSwitchProvider> pair in m_dicClientSwitchProviders)
                {
                    ClientSwitchProvider provider = pair.Value;

                    provider.Stop();
                }
            }

            if (m_dicClientRelayProviders != null)
            {
                foreach (KeyValuePair<int, ClientRelayProvider> pair in m_dicClientRelayProviders)
                {
                    ClientRelayProvider provider = pair.Value;

                    provider.Stop();
                }
            }

            if (m_peckProvider != null)
                m_peckProvider.Stop();
        }

        private void Init(DataManager dataManager, PowerDataManager powerDataManager)
        {
            Dictionary<int, SwitchData> SwitchDatas = powerDataManager.SwitchDatas;
            Dictionary<int, Relay> Relays = powerDataManager.Relays;

            if (SwitchDatas != null)
            {
                foreach (KeyValuePair<int, SwitchData> pair in SwitchDatas)
                {
                    int nSwitchID = pair.Key;
                    SwitchData switchData = pair.Value;

                    if (m_dicClientSwitchProviders == null)
                        m_dicClientSwitchProviders = new Dictionary<int, ClientSwitchProvider>();

                    ClientSwitchProvider switchProvider = new ClientSwitchProvider(powerDataManager, switchData);

                    m_dicClientSwitchProviders[nSwitchID] = switchProvider;
                }
            }

            if (Relays != null)
            {
                foreach (KeyValuePair<int, Relay> pair in Relays)
                {
                    int nRelayID = pair.Key;
                    Relay relay = pair.Value;

                    if (m_dicClientRelayProviders == null)
                        m_dicClientRelayProviders = new Dictionary<int, ClientRelayProvider>();

                    ClientRelayProvider relayProvider = new ClientRelayProvider(powerDataManager, relay);

                    m_dicClientRelayProviders[nRelayID] = relayProvider;
                }
            }

            m_peckProvider = new ClientPeckProvider(powerDataManager);
        }
    }
}
