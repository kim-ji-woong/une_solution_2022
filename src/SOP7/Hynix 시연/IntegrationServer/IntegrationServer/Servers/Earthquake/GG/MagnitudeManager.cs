using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.Servers.Earthquake.GG
{
    using ViewModels.Earthquake;

    // 규모
    class MagnitudeManager
    {
        public static double GetMagnitude(KEvtInfo info)
        {
            if (info.MAG == null)
                return 0;

            return (double)info.MAG;
        }

        // nMagnitude : magnitude에 100을 곱한 값
        public static int GetAlarmLevel(KEvtInfo info, out int nMagnitude)
        {
            nMagnitude = 0;

            if (info.MAG == null)
                return 0;

            nMagnitude = (int)(info.MAG * 100);
            return GetAlarmLevel((double)info.MAG);
        }

        private static int GetAlarmLevel(double magnitude)
        {
            if (magnitude < 4.0)
                return 0;
            else if (magnitude < 5.0)
                return 1;
            else if (magnitude < 6.0)
                return 2;

            return 3;
        }
    }
}
