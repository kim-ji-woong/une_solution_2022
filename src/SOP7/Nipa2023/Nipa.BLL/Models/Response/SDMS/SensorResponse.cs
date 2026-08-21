using System.Collections.Generic;
using Nipa.Model.Sdms.Sensor;

namespace Nipa.BLL.Models.Response.SDMS
{
    public class ResponseSensorList : MessageResult
    {
        private List<FireSensor> m_fireSensors = null;
        private List<PSMSensor> m_gasSensors = null;
        private List<PSMSensor> m_atmosphereSensors = null;
        private List<EtcSensor> m_emergencyBells = null;
        private List<EtcSensor> m_aps = null;
        private List<CCTVSensor> m_thermalCCTVs = null;
        private List<CCTVSensor> m_cctvs = null;

        public List<FireSensor> FireSensors
        {
            get { return m_fireSensors; }
            set { m_fireSensors = value; }
        }

        public List<PSMSensor> GasSensors
        {
            get { return m_gasSensors; }
            set { m_gasSensors = value; }
        }

        public List<PSMSensor> AtmosphereSensors
        {
            get { return m_atmosphereSensors; }
            set { m_atmosphereSensors = value; }
        }

        public List<EtcSensor> EmergencyBells
        {
            get { return m_emergencyBells; }
            set { m_emergencyBells = value; }
        }

        public List<EtcSensor> Aps
        {
            get { return m_aps; }
            set { m_aps = value; }
        }

        public List<CCTVSensor> ThermalCCTVs
        {
            get { return m_thermalCCTVs; }
            set { m_thermalCCTVs = value; }
        }

        public List<CCTVSensor> Cctvs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        public ResponseSensorList()
            : base()
        {
        }

        public ResponseSensorList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponsePSMSensorInfo : MessageResult
    {
        private List<PSMSensorData> m_sensorInfos = new List<PSMSensorData>();

        public List<PSMSensorData> SensorInfos
        {
            get { return m_sensorInfos; }
            set { m_sensorInfos = value; }
        }

        public ResponsePSMSensorInfo()
            : base()
        {
        }

        public ResponsePSMSensorInfo(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class PSMSensorData
    {
        private string m_strMaterialName = "";
        private string m_uom = "";
        private float? m_data = null;
        private int? m_status = null;

        public string MaterialName
        {
            get { return m_strMaterialName; }
            set { m_strMaterialName = value; }
        }

        public string UoM
        {
            get { return m_uom; }
            set { m_uom = value; }
        }

        public float? Data
        {
            get { return m_data; }
            set { m_data = value; }
        }

        // 알람단계
        // 1(정상 - 관심), 2(1단계 알람 - 주의), 3(2단계 알람 - 경계), 4(3단계 알람 - 심각)
        public int? Status
        {
            get { return m_status; }
            set { m_status = value; }
        }
    }

    public class ResponseAPStatistics : MessageResult
    {
        // 구역당 몇개의 AP가 존재하는가?
        private List<string> m_locationCount = new List<string>();
        // 구역당 몇명의 작업자가 존재하는가?
        private List<string> m_locationWorkerCount = new List<string>();
        private int m_nNormalCount = 0;
        private int m_nLowCount = 0;
        private int m_nChangingCount = 0;

        // 구역당 몇개의 AP가 존재하는가?
        public List<string> LocationCount
        {
            get { return m_locationCount; }
            set { m_locationCount = value; }
        }

        // 구역당 몇명의 작업자가 존재하는가?
        public List<string> LocationWorkerCount
        {
            get { return m_locationWorkerCount; }
            set { m_locationWorkerCount = value; }
        }

        public int NormalCount
        {
            get { return m_nNormalCount; }
            set { m_nNormalCount = value; }
        }

        public int LowCount
        {
            get { return m_nLowCount; }
            set { m_nLowCount = value; }
        }

        public int ChangingCount
        {
            get { return m_nChangingCount; }
            set { m_nChangingCount = value; }
        }

        public ResponseAPStatistics()
            : base()
        {
        }

        public ResponseAPStatistics(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseWorkerStatistics : MessageResult
    {
        private int m_nNormalCount = 0;
        private int m_nChangingCount = 0;

        public int NormalCount
        {
            get { return m_nNormalCount; }
            set { m_nNormalCount = value; }
        }

        public int ChangingCount
        {
            get { return m_nChangingCount; }
            set { m_nChangingCount = value; }
        }

        public ResponseWorkerStatistics()
            : base()
        {
        }

        public ResponseWorkerStatistics(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseAPList : MessageResult
    {
        private List<APData> m_apList = new List<APData>();

        public List<APData> ApList
        {
            get { return m_apList; }
            set { m_apList = value; }
        }

        public ResponseAPList()
            : base()
        {
        }

        public ResponseAPList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseWorkerList : MessageResult
    {
        private List<WorkerData> m_workerList = new List<WorkerData>();

        public List<WorkerData> WorkerList
        {
            get { return m_workerList; }
            set { m_workerList = value; }
        }

        public ResponseWorkerList()
            : base()
        {
        }

        public ResponseWorkerList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class APData
    {
        private int m_nSensorID = -1;
        private string m_strMacAddress = "";
        private string m_strName = "";
        private string m_strPowerType = "POE";
        private bool m_mapping = false;
        private string m_strRegDate = "";
        private bool m_use = false;
        private string m_strLocationName = "";

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string MacAddress
        {
            get { return m_strMacAddress; }
            set { m_strMacAddress = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public string PowerType
        {
            get { return m_strPowerType; }
            set { m_strPowerType = value; }
        }

        public bool Mapping
        {
            get { return m_mapping; }
            set { m_mapping = value; }
        }

        public string RegDate
        {
            get { return m_strRegDate; }
            set { m_strRegDate = value; }
        }

        public bool Use
        {
            get { return m_use; }
            set { m_use = value; }
        }

        public string LocationName
        {
            get { return m_strLocationName; }
            set { m_strLocationName = value; }
        }
    }

    public class WorkerData
    {
        private int m_nSensorID = -1;
        private string m_strMacAddress = "";
        private string m_strName = "";
        private string m_strPowerType = "POE";
        private bool m_mapping = false;
        private string m_strRegDate = "";
        private bool m_use = false;
        private string m_strWorkerName = "";
        private string m_strTagNo = "";

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string MacAddress
        {
            get { return m_strMacAddress; }
            set { m_strMacAddress = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public string PowerType
        {
            get { return m_strPowerType; }
            set { m_strPowerType = value; }
        }

        public bool Mapping
        {
            get { return m_mapping; }
            set { m_mapping = value; }
        }

        public string RegDate
        {
            get { return m_strRegDate; }
            set { m_strRegDate = value; }
        }

        public bool Use
        {
            get { return m_use; }
            set { m_use = value; }
        }

        public string WorkerName
        {
            get { return m_strWorkerName; }
            set { m_strWorkerName = value; }
        }

        public string TagNo
        {
            get { return m_strTagNo; }
            set { m_strTagNo = value; }
        }
    }

    public class ResponseRealSensorData : MessageResult
    {
        private PSM m_psmSensor = null;
        private ETC m_etcSensor = null;

        public PSM Psm
        {
            get { return m_psmSensor; }
            set { m_psmSensor = value; }
        }

        public ETC Etc
        {
            get { return m_etcSensor; }
            set { m_etcSensor = value; }
        }

        public ResponseRealSensorData()
            : base()
        {
        }

        public ResponseRealSensorData(bool success, string message)
            : base(success, message)
        {
        }
    }
}