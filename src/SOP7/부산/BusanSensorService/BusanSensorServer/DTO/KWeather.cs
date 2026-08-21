using System;

namespace BusanSensorServer.DTO
{
    public class KWeather
    {
        public class SensorData
        {   
            public enum Field { Temp, Humi, Pm10, Pm25, Pm10Raw, Pm25Raw, Noise, Coci, Windd, WinddMax, Winds, WindsMax, Lux, Uv, Accx, AccxMax, Accy, AccyMax, Accz, AcczMax, Wbgt, Co, O3, So2, H2s };

            public enum UseField { temp, humi, pm10, pm25, windd, winds, uv, co, o3, so2, h2s };
            
            public static bool GetFieldName(string name)
            {
                foreach (var field in Enum.GetValues(typeof(UseField)))
                {
                    if (field.ToString() == name)
                        return true;
                }
                return false;
            }
            
            public string serial_no { get; set; }
            public string station_name { get; set; }
            public string date { get; set; }
            public double temp { get; set; }
            public int humi { get; set; }
            public int pm10 { get; set; }
            public int pm25 { get; set; }
            public int pm10_raw { get; set; }
            public int pm25_raw { get; set; }
            public int noise { get; set; }
            public int coci { get; set; }
            public double windd { get; set; }
            public double windd_max { get; set; }
            public double winds { get; set; }
            public double winds_max { get; set; }
            public int lux { get; set; }
            public double uv { get; set; }
            public double accx { get; set; }
            public double accx_max { get; set; }
            public double accy { get; set; }
            public double accy_max { get; set; }
            public double accz { get; set; }
            public double accz_max { get; set; }
            public double wbgt { get; set; }
            public double co { get; set; }
            public double o3 { get; set; }
            public double so2 { get; set; }
            public double h2s { get; set; }
        }
    }
}