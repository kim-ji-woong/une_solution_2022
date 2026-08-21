namespace CCTVMonitor.WebSocket
{
    interface IClientOwner
    {
        void OnReceive(string strMessage, ClientController controller);
    }
}
