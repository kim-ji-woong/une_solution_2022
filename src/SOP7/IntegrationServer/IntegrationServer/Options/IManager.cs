using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationServer.Options
{
    using Datas;

    public interface IManager
    {
        int CurrentServerSeqNo { get; set; }
        ServerSetting ServerSetting { get; set; }
        void SetServerProperty(ServerData data, ServerProperty property, object value);
    }
}
