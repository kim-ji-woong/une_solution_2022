namespace dnsBroadcast
{
    public class MessageClientFactory
    {
        public static BaseMessageClient CreateMessageClient(object param = null)
        {
#if NST
            return new MessageClientNST(param);
#else
            return new MessageClientDefault(param);
#endif
        }
    }
}
