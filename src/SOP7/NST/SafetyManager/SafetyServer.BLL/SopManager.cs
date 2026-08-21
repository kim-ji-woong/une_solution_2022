using AgentFactory.BLL;
using System.Collections;
using dnsSopID;

namespace SafetyServer.BLL
{
    using Data.Response;

    public class SopManager
    {
        private MainManager m_mainManager = null;
        private Server.SopServer m_sopServer = null;

        public SopManager(MainManager mainManager, Factory factory)
        {
            m_mainManager = mainManager;
            m_sopServer = new Server.SopServer(mainManager, factory);
        }

        public Result OnReceive(int header, string strClientInfo, ArrayList arrDatas)
        {
            if (header > 0)
                return m_sopServer.OnReceive(header, strClientInfo, arrDatas);

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_COMMAND));
        }
    }
}
