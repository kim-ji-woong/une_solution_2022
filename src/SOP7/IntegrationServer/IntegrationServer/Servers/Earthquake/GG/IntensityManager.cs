using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.Servers.Earthquake.GG
{
    using ViewModels.Earthquake;

    // 진도
    class IntensityManager
    {
        public static int GetIntensity(HEvtInfo info)
        {
            if (info.pga_val == null)
                return 0;

            return GetIntensity((double)info.pga_val);
        }

        public static int GetIntensity(double gal)
        {
            if (gal < 0.6867)
                return 1;
            else if (gal >= 0.6867 && gal < 2.2563)
                return 2;
            else if (gal >= 2.2563 && gal < 7.4556)
                return 3;
            else if (gal >= 7.4556 && gal < 25.1136)
                return 4;
            else if (gal >= 25.1136 && gal < 67.2966)
                return 5;
            else if (gal >= 67.2966 && gal < 144.5013)
                return 6;
            else if (gal >= 144.5013 && gal < 310.5846)
                return 7;
            else if (gal >= 310.5846 && gal < 667.1781)
                return 8;
            else if (gal >= 667.1781 && gal < 1433.6334)
                return 9;
            else if (gal >= 1433.6334 && gal < 3080.34)
                return 10;
            //else if (gal >= 3080.34)
            return 11;
        }

        public static int GetAlarmLevel(HEvtInfo info, out int intensity)
        {
            intensity = 0;

            if (info.pga_val == null)
                return 0;

            return GetAlarmLevel((double)info.pga_val, out intensity);
        }

        public static int GetAlarmLevel(double gal, out int intensity)
        {
            intensity = GetIntensity(gal);

            if (intensity < 4)
                return 0;
            else if (intensity < 5)
                return 1;
            else if (intensity < 6)
                return 2;

            return 3;
        }
    }
}
