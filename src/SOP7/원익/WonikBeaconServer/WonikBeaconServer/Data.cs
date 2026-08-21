using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;
using Wonik.Model;

namespace WonikBeaconServer
{
    public class ID
    {
        public const int Campus_H = 1;
        public const int Campus_C = 3;

        public const int Campus_A = 2;
        public const int Campus_V = 4;
        public const int Campus_S = 5;

        public const int Assembly_H = 20000;
        public const int Assembly_C = 20002;

        public const int Assembly_A = 20001;
        public const int Assembly_V = 20003;
        public const int Assembly_S = 20004;
    }

    public class CommonString
    {
        public const string SUCESS = "success";
        public const string YES = "Y";
        public const string NO = "N";
        public const string ALARM_METHOD = "POST";

        public const string ASSEM_FLOOR_H = "h-out";
        public const string ASSEM_FLOOR_C = "c-out";

        public const string ASSEM_FLOOR_A = "a-out";
        public const string ASSEM_FLOOR_V = "v-out";
        public const string ASSEM_FLOOR_S = "s-out";
    }

    public class BeaconCount
    {
        public BeaconCount(string strID, int? nEmployeeInCount, int? nVisitInCount)
        {
            this.ID = strID;
            this.EmployeeInCount = nEmployeeInCount;
            this.VisitInCount = nVisitInCount;
        }

        public string ID { get; set; }
        public int? EmployeeInCount { get; set; }
        public int? VisitInCount { get; set; }
    }

    public class GeofenceData
    {
        public GeofenceData()
        {

        }

        public GeofenceData(string strFcName, int nEquipZoneID)
        {
            this.FcName = strFcName;
            this.EquipZoneID = nEquipZoneID;
        }

        public int? FcNum { get; set; }
        public string FcName { get; set; }

        public int EquipZoneID { get; set; }
    }

    public class PersonData
    {
        public enum ComNum_Type { Worker = 1 }

        /// <summary>
        /// 구역 ID
        /// </summary>
        public int EquipZoneID { get; set; }
        /// <summary>
        /// 업체 구분 ID (1: 임직원)
        /// </summary>
        public int? ComNum { get; set; }
        /// <summary>
        /// 체류자 이름
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 체류자 사번
        /// </summary>
        public string TargetId { get; set; }
        /// <summary>
        /// 소속
        /// </summary>
        public string Belong { get; set; }
        /// <summary>
        /// 휴대 전화번호
        /// </summary>
        public string PhoneNumber { get; set; }
        /// <summary>
        /// 체류 시간
        /// </summary>
        public string StayTime { get; set; }
        /// <summary>
        /// 층 정보
        /// </summary>
        public string Floor { get; set; }
    }

    public class AlarmData : PersonData
    {
        public AlarmData()
        {

        }
        public AlarmData(PersonData data)
        {
            this.EquipZoneID = data.EquipZoneID;
            this.ComNum = data.ComNum;
            this.Name = data.Name;
            this.TargetId = data.TargetId;
            this.Belong = data.Belong;
            this.PhoneNumber = data.PhoneNumber;
            this.StayTime = data.StayTime;
            this.Floor = data.Floor;
        }

        /// <summary>
        /// SOS 알람 여부
        /// </summary>
        public string SosOn { get; set; }
        /// <summary>
        /// 체류 알람 여부
        /// </summary>
        public string LongStayZoneOn { get; set; }
        


        public int? SensorType { get; set; }
        public int? SensorTagID { get; set; }
        public int? SensorZoneID { get; set; }

        public AlarmData Clone()
        {
            AlarmData data = new AlarmData();
            data.EquipZoneID = this.EquipZoneID;
            data.ComNum = this.ComNum;
            data.Name = this.Name;
            data.TargetId = this.TargetId;
            data.Belong = this.Belong;
            data.PhoneNumber = this.PhoneNumber;
            data.SosOn = this.SosOn;
            data.LongStayZoneOn = this.LongStayZoneOn;
            data.StayTime = this.StayTime;
            data.Floor = this.Floor;
            data.SensorType = this.SensorType;
            data.SensorTagID = this.SensorTagID;
            data.SensorZoneID = this.SensorZoneID;

            return data;
        }

       
    }

    public class RegularMemberData : RegularMember 
    {
        public RegularMemberData()
        {

        }
        public RegularMemberData(RegularMember member)
        {
            this.ID = member.ID;
            this.MemberName = member.MemberName;
            this.MemberID = member.MemberID;
            this.OfficePhoneNumber = member.OfficePhoneNumber;
            this.PhoneNumber = member.PhoneNumber;
            this.JobLevelID = member.JobLevelID;
            this.JobPositionID = member.JobPositionID;
            this.Email = member.Email;
            this.StatusID = member.StatusID;
        }

        public string RegularName { get; set; }
    }

    public class SpeedDetectionData : VehicleSpeedDetection
    {
        /// <summary>
        /// 센서 이름 >> 위치 이름
        /// </summary>
        public string SensorName { get; set; }

        public SpeedDetectionData(VehicleSpeedDetection vehicleSpeedDetection)
        {
            this.ID = vehicleSpeedDetection.ID;
            this.DetectionTime = vehicleSpeedDetection.DetectionTime;
            this.SensorID = vehicleSpeedDetection.SensorID;
            this.Speed = vehicleSpeedDetection.Speed;
        }
    }
}
