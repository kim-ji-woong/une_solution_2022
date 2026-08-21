using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wonik.Model;

namespace WonikBeaconServer.SpeedDetection
{
    public class DetectionManager
    {
        private string DFS1_IP = null;
        private int? DFS1_Port = null;
        private string DFS2_IP = null;
        private int? DFS2_Port = null;

        private DetectionProvider m_DFS1 = null;
        private DetectionProvider m_DFS2 = null;

        private Wonik.IDAL.IDataManager m_wonikDataManager = null;
        private SDMS.IDAL.IDataManager m_dataManager = null;

        private Logger m_logger = null;
        public Logger Logger
        {
            get { return m_logger; }
            set { m_logger = value; }
        }

        public DetectionManager(SDMS.IDAL.IDataManager dataManager, Wonik.IDAL.IDataManager wonikDataManager)
        {
            m_logger = new Logger("DetectionManager");

            m_dataManager = dataManager;
            m_wonikDataManager = wonikDataManager;

            Init();          
        }

        private void Init()
        {
            this.DFS1_IP = Startup.ConfigManager.SpeedDetection.DFS1_IP;
            this.DFS1_Port = Startup.ConfigManager.SpeedDetection.DFS1_Port;
            this.DFS2_IP = Startup.ConfigManager.SpeedDetection.DFS2_IP;
            this.DFS2_Port = Startup.ConfigManager.SpeedDetection.DFS2_Port;

            if (DFS1_IP == null || DFS1_Port == null || DFS2_IP == null || DFS2_Port == null)
            {
                Logger.Instance.Write($"DetectionManager Init() : 설정 값이 올바르지 않습니다. DFS1_IP: {this.DFS1_IP}, DFS1_Port: {this.DFS1_Port}, DFS2_IP: {this.DFS2_IP}, DFS2_Port: {this.DFS2_Port}");
            }
            else
            {
                m_DFS1 = new DetectionProvider(this, this.DFS1_IP, this.DFS1_Port.Value);
                m_DFS2 = new DetectionProvider(this, this.DFS2_IP, this.DFS2_Port.Value);
            }           
        }

        public void ReConnection(string strServerIP)
        {
            if (strServerIP == this.DFS1_IP)
            {
                m_DFS1 = new DetectionProvider(this, this.DFS1_IP, this.DFS1_Port.Value);
                m_DFS1.Start();
            }
            else if (strServerIP == this.DFS2_IP)
            {
                m_DFS2 = new DetectionProvider(this, this.DFS2_IP, this.DFS2_Port.Value);
                m_DFS2.Start();
            }
        }

        public void Start()
        {
            if (m_DFS1 == null || m_DFS2 == null)
            {
                Logger.Instance.Write($"DetectionManager Start() : DFS 설정되지 않아 시작되지 않았습니다.");
                return;
            }

            m_DFS1.Start();

            System.Threading.Thread.Sleep(200);

            m_DFS2.Start();
        }

        public bool InsertSpeedDetection(int nSpeed, DateTime dtDetectionTime, string strIP, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                // 센서 조회
                Dictionary<SDMS.Model.Sensor.ETC.Fields, object> dicConditions = new Dictionary<SDMS.Model.Sensor.ETC.Fields, object>();
                dicConditions[SDMS.Model.Sensor.ETC.Fields.UniqueKey] = strIP;

                List<SDMS.Model.Sensor.ETC> sensors = m_dataManager.GetSelectManager().SelectETCSensors(dicConditions, null, out strErrorMessage);
                if (sensors == null)
                    throw new ApplicationException(strErrorMessage);
                else if (sensors.Count < 1)                
                    throw new ApplicationException($"{strIP} 해당 하는 ETC 센서 데이터가 존재하지 않습니다.");

                SDMS.Model.Sensor.ETC sensor = sensors[0];

                VehicleSpeedDetection data = new VehicleSpeedDetection();
                data.DetectionTime = dtDetectionTime;
                data.Speed = nSpeed;
                data.SensorID = sensor.ID;

                VehicleSpeedDetection detection = m_wonikDataManager.GetCreateManager().CreateVehicleSpeedDetection(data, out strErrorMessage);
                if (detection == null)
                    throw new ApplicationException(strErrorMessage);
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }
         


            return true;
        }

        public void WriteLog(string strLog)
        {
            if (m_logger == null)
                return;

            m_logger.Write(strLog);
        }
    }
}
