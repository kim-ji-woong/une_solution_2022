using dnsTcpLib2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationServer.Servers.AirPollution.Senko
{
    public class AirPollutionProvider : TcpServiceProvider
    {
        private AirPollutionManager m_mgr = null;

        public AirPollutionProvider() 
        {

        }

        public AirPollutionProvider(AirPollutionManager airPollutionManager) 
        {
            airPollutionManager.Logger.Write(Datas.LogTypes.Info, airPollutionManager.ServerType, airPollutionManager.ServerSeqNo, "Enter AirPollutionProvider");
            m_mgr = airPollutionManager;
        }

        public override object Clone()
        {
            return new AirPollutionProvider();
        }

        public override bool OnReceiveData(ConnectionState state)
        {
            if (!base.OnReceiveData(state)) 
                return false;

            IntegrationServer.Servers.AirPollution.Senko.AirPollutionManager.Instance.OnReceive(state, state.RecivedBuffer);

            return true;

        }

        public override void OnAcceptConnection(ConnectionState state)
        {
            AirPollutionManager.Instance.OnAccept(state);
        }

        public override void OnDropConnection(ConnectionState state)
        {
            AirPollutionManager.Instance.OnDropConnection(state);
        }

    }
}
