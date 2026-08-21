using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers
{
    public interface IServer
    {
        ServerManager GetServerManager();
        int ServerSeqNo { get; }
        ServerTypes ServerType { get; }
        string ServerAlias { get; }
        void Start();
        void Stop();

        bool IsConnected { get; }
        Logger Logger { get; set; }

        //dnsTcpLib2.ClientServiceProvider Provider { get; }
    }
}
