using Newtonsoft.Json.Linq;

namespace IntegrationServer.Servers.Worker.SWayM
{
    public class JsonManager
    {
        protected string GetValue(JToken tag, string strKey)
        {
            object obj = tag[strKey];

            if (obj == null)
                return null;

            return obj.ToString();
        }
    }
}
