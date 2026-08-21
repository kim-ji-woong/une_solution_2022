using System.Collections.Generic;

namespace IntegrationServer.Servers.EmergencyBell.Eraeseeds
{
    using Managers;

    class Cep5000
    {
        public const byte EventOn = 0x41;
        public const byte EventOff = 0x42;

        public static SensorTag GetSensor(byte cmd, int len, byte[] bytes, Dictionary<string, SensorTag> dicSensorTags)
        {
            if (len < 3)
                return null;

            if (cmd == EventOn || cmd == EventOff)
            {
                int deviceType = (int)bytes[0];
                int subControllerID = (int)bytes[1];
                int btnID = (int)bytes[2];
            }

            return null;
        }
    }
}
