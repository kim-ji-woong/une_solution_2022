namespace dnsBroadcast
{
    public delegate void CompleteBroadcast_Event(BaseMessageClient sender, BaseMessageClient.Status staus);

    public abstract class BaseMessageClient
    {
        public enum Status { Completed, Stopped, Error };

        public CompleteBroadcast_Event OnCompleteBroadcast { get; set; }

        public string SirenFile { get; set; }
        public object Tag { get; set; }

        public abstract void Run(bool useSiren, string message);
        public abstract void Stop();
        public abstract void Pause();
        public abstract void Resume();
    }
}
