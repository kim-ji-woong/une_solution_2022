using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wonik.Model;

namespace WonikBeaconServer.Model
{
    public class ResponseEquipZoneMembers : MessageResult
    {
        public List<AlarmData> EquipZoneMembers { get; set; }

        public ResponseEquipZoneMembers()
        {

        }

        public ResponseEquipZoneMembers(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponseVehicleSpeedDetections : MessageResult
    {
        public List<SpeedDetectionData> SpeedDetectionDatas { get; set; }

        public ResponseVehicleSpeedDetections()
        {

        }

        public ResponseVehicleSpeedDetections(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponseSpeedLimit : MessageResult
    {
        /// <summary>
        /// 과속 기준 속도(km/h). 이 값을 "초과"하는 경우만 과속으로 본다.
        /// (25 이면 26km/h 부터 과속)
        /// </summary>
        public int SpeedLimit { get; set; }

        public ResponseSpeedLimit()
        {

        }

        public ResponseSpeedLimit(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponseSpeedDetectionSensors : MessageResult
    {
        public List<SDMS.Model.Sensor.ETC> Sensors { get; set; }

        public ResponseSpeedDetectionSensors()
        {

        }

        public ResponseSpeedDetectionSensors(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }



    public class Result
    {
        private bool m_result = false;

        public bool Success
        {
            get { return m_result; }
            set { m_result = value; }
        }
    }

    public class MessageResult : Result
    {
        private string m_strMessage = "";

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            m_strMessage = strMessage;
        }
    }
}
