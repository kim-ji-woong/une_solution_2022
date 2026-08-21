using SDMS.Model.CCTV;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Response
{
    public class ResponseUseSensor : MessageResult
    {
        ICollection<Data.Sensor.FireSensor> m_fireSensors = null;
        ICollection<Data.Sensor.FireSensor> m_disabledFireSensors = null;
        ICollection<Data.Sensor.PSMSensor> m_psmSensors = null;
        ICollection<Data.Sensor.PSMSensor> m_disabledPSMSensors = null;
        ICollection<Data.Sensor.EtcSensor> m_etcSensors = null;
        ICollection<Data.Sensor.EtcSensor> m_disabledEtcSensors = null;

        ICollection<Data.Sensor.EtcSensor> m_environmentSensors = null;
        ICollection<Data.Sensor.EtcSensor> m_disabledEnvironmentSensors = null;
        ICollection<Data.Sensor.EtcSensor> m_manufactureSensors = null;
        ICollection<Data.Sensor.EtcSensor> m_disabledManufactureSensors = null;
        ICollection<Data.Sensor.EtcSensor> m_speedDetectionSensors = null;
        ICollection<Data.Sensor.EtcSensor> m_disabledSpeedDetectionSensors = null;

        ICollection<Data.Sensor.CCTVSensor> m_cctvSensors = null;
        ICollection<Data.Sensor.CCTVSensor> m_disabledCCTVs = null;


        // 전체 화재센서 
        public ICollection<Data.Sensor.FireSensor> FireSensors
        {
            get { return m_fireSensors; }
            set { m_fireSensors = value; }
        }

        // 사용할수 없는 화재센서 
        public ICollection<Data.Sensor.FireSensor> DisabledFireSensors
        {
            get { return m_disabledFireSensors; }
            set { m_disabledFireSensors = value; }
        }

        // 전체 누출센서 
        public ICollection<Data.Sensor.PSMSensor> PsmSensors
        {
            get { return m_psmSensors; }
            set { m_psmSensors = value; }
        }

        // 사용할수 없는 누출센서
        public ICollection<Data.Sensor.PSMSensor> DisabledPSMSensors
        {
            get { return m_disabledPSMSensors; }
            set { m_disabledPSMSensors = value; }
        }

        // 전체 기타센서 
        public ICollection<Data.Sensor.EtcSensor> EtcSensors
        {
            get { return m_etcSensors; }
            set { m_etcSensors = value; }
        }

        // 사용할수 없는 기타센서 
        public ICollection<Data.Sensor.EtcSensor> DisabledEtcSensors
        {
            get { return m_disabledEtcSensors; }
            set { m_disabledEtcSensors = value; }
        }






        // 전체 환경설비 센서 
        public ICollection<Data.Sensor.EtcSensor> EnvironmentSensors
        {
            get { return m_environmentSensors; }
            set { m_environmentSensors = value; }
        }

        // 사용할수 없는 환경설비 센서 
        public ICollection<Data.Sensor.EtcSensor> DisabledEnvironmentSensors
        {
            get { return m_disabledEnvironmentSensors; }
            set { m_disabledEnvironmentSensors = value; }
        }

        // 전체 제조설비 센서 
        public ICollection<Data.Sensor.EtcSensor> ManufactureSensors
        {
            get { return m_manufactureSensors; }
            set { m_manufactureSensors = value; }
        }

        // 사용할수 없는 제조설비 센서 
        public ICollection<Data.Sensor.EtcSensor> DisabledManufactureSensors
        {
            get { return m_disabledManufactureSensors; }
            set { m_disabledManufactureSensors = value; }
        }

        // 전체 차량과속 센서 
        public ICollection<Data.Sensor.EtcSensor> SpeedDetectionSensors
        {
            get { return m_speedDetectionSensors; }
            set { m_speedDetectionSensors = value; }
        }

        // 사용할수 없는 차량과속 센서 
        public ICollection<Data.Sensor.EtcSensor> DisabledSpeedDetectionSensors
        {
            get { return m_disabledSpeedDetectionSensors; }
            set { m_disabledSpeedDetectionSensors = value; }
        }





        // 전체 CCTV 
        public ICollection<Data.Sensor.CCTVSensor> CCTVs
        {
            get { return m_cctvSensors; }
            set { m_cctvSensors = value; }
        }

        // 사용할수 없는 CCTV 
        public ICollection<Data.Sensor.CCTVSensor> DisabledCCTVs
        {
            get { return m_disabledCCTVs; }
            set { m_disabledCCTVs = value; }
        }
    }
}
