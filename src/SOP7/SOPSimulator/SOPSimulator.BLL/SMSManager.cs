using dnsDBUtil;
using dnsEmail;
using dnsSMS;
using SOPManager.Model.Sop.Component;
using SOPSimulator.BLL.Models.Request;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using TeamEditor.Model.Sop.Team;

namespace SOPSimulator.BLL
{
    public class SMSManager : IKakaoHelper
    {
        private class KakaoInfoEx : Common.Model.Option.KakaoInfo, IKakaoInfo
        {
            public KakaoInfoEx(Common.Model.Option.KakaoInfo info)
            {
                this.BsID = info.BsID;
                this.BsPasswd = info.BsPasswd;
                this.CountryCode = info.CountryCode;
                this.ID = info.ID;
                this.SenderKey = info.SenderKey;
            }
        }

        private string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });
        private ProcessManager m_processManager = null;

        public static bool m_bIsSopAlone = false;
        /// <summary>
        /// SOP 단독버전 (깨끗한나라등)
        /// </summary>
        public static bool IsSopAlone
        {
            get { return m_bIsSopAlone; }
            set { m_bIsSopAlone = value; }
        }

        public SMSManager(ProcessManager processManager)
        {
            this.m_processManager = processManager;
        }

        public bool ProgressInternalSpread(List<Receiver> receivers, string message)
        {
            if (m_bIsSopAlone)
            {
                List<string> phoneNumbers = GetPhoneNumber(receivers);
                if (phoneNumbers != null && phoneNumbers.Count > 0)
                    return SendSMS("", phoneNumbers, message);
            }
            else
            {
                if (m_processManager.SopSimulatorDataManager.SiteID == 12)
                {
                    List<string> emails = GetEmail(receivers);
                    if (emails != null && emails.Count > 0)
                        return SendSMS("", emails, message);
                }
                else
                {
                    List<string> phoneNumbers = GetPhoneNumber(receivers);
                    if (phoneNumbers != null && phoneNumbers.Count > 0)
                        return SendSMS("", phoneNumbers, message);
                }
            }

            return false;
        }

        private List<string> GetPhoneNumber(List<Receiver> receivers)
        {
            List<string> phoneNumbers = new List<string>();

            if (receivers == null)
                return phoneNumbers;

            foreach (Receiver receiver in receivers)
            {
                if (receiver.TeamType == (int)Receiver.TeamDataType.RegularTeam)
                {
                    string strErrorMessage = null;
                    List<RegularMember> members = m_processManager.TeamDataManager.GetSelectManager().SelectRegularMembers("RegularID=" + receiver.TeamID, out strErrorMessage);
                    if (members != null)
                    {
                        foreach (RegularMember member in members)
                        {
                            if (member.PhoneNumber?.Length > 0)
                            {
                                string phoneNumber = DecryptString(member.PhoneNumber);
                                phoneNumbers.Add(phoneNumber);
                            }
                        }
                    }                    
                }

            }

            return phoneNumbers;
        }

        private List<string> GetEmail(List<Receiver> receivers)
        {
            List<string> emails = new List<string>();

            if (receivers == null)
                return emails;

            foreach (Receiver receiver in receivers)
            {
                if (receiver.TeamType == 2)
                {
                    string strErrorMessage = null;
                    List<RegularMember> members = m_processManager.TeamDataManager.GetSelectManager().SelectRegularMembers("RegularID=" + receiver.TeamID, out strErrorMessage);
                    if (members != null)
                    {
                        foreach (RegularMember member in members)
                        {
                            if (member.Email != null && member.Email.Length > 0)
                            {                                
                                emails.Add(member.Email);
                            }
                        }
                    }
                }

            }

            return emails;
        }

        public IKakaoInfo GetKakaoInfo()
        {
            string strErrorMessage = null;
            Common.Model.Option.KakaoInfo info = m_processManager.CommonDataManager.GetSelectManager().SelectKakaoInfo(out strErrorMessage);

            return new KakaoInfoEx(info);
        }

        public string MakeMessage(int nSensorReactionHistoryID, ref string strTmpltCode, ref string strTitle)
        {
            string returnMessage = "";
            string strErrorMessage = null;

            string strCondition = string.Format("{0}.ReactionType in (0, 21, 50) And {0}.ID = {1}", SDMS.Model.History.SensorReactionHistory.TableName, nSensorReactionHistoryID);

            ArrayList arrResult = m_processManager.SdmsManager.GetSelectManager().JoinHistroysensorreactionSpatialequipmentzoneSensorZone(null, null, null, strCondition, out strErrorMessage);

            if (arrResult == null || arrResult.Count != 3)
                return "";

            SDMS.Model.History.SensorReactionHistory reactionHistory = arrResult[0] as SDMS.Model.History.SensorReactionHistory;
            SDMS.Model.Spatial.EquipmentZone equipmentZone = arrResult[1] as SDMS.Model.Spatial.EquipmentZone;
            SDMS.Model.Sensor.SensorZone sensorZone = arrResult[2] as SDMS.Model.Sensor.SensorZone;

            string varFacilityType = "";
            string varDateTime = reactionHistory.Time.ToString("yyyy-MM-dd HH:mm:ss");
            string varTest = reactionHistory.Message.Contains("[테스트]") ? "[테스트]" : "";
            string varBuilding = equipmentZone.ZoneName;

            if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                varFacilityType = "화재";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR)
                varFacilityType = "누출";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.BLACKOUT)
                varFacilityType = "정전";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND)
                varFacilityType = "강풍";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.SUBMERGENCY)
                varFacilityType = "침수";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.TERROR)
                varFacilityType = "테러";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Earthquake)
                varFacilityType = "지진";

            strTitle = varFacilityType + " 알람 ";

            if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.BEGIN_STATUS) // 알람 탐지
            {
                strTmpltCode = "alarm_detect";
                strTitle += "탐지";
                returnMessage = string.Format("SOP 시스템 {0} 알람 탐지\n{1}\n{2}[{3}]에서 {0} 신호가 탐지되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }
            else if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.MALFUNCTION) // 알람 오작동
            {
                strTmpltCode = "alarm_malfunction";
                strTitle += "오작동";
                returnMessage = string.Format("SOP 시스템 {0} 알람 오작동\n{1}\n{2}[{3}]에서 탐지된 {0} 신호가 오작동으로 신고되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }
            else if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.END_STATUS) // 알람 복구
            {
                strTmpltCode = "alarm_clear";
                strTitle += "복구";
                returnMessage = string.Format("SOP 시스템 {0} 알람 복구\n{1}\n{2}[{3}]에서 탐지된 {0} 신호가 복구되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }

            return returnMessage;
        }

        public bool SendSMS(string strCaller, List<string> strPhoneNumbers, string message)
        {
            bool returnValue = false;

            IMessageClient client = MessageClientFactory.CreateMessageClient(this);
            if (client != null)
            {
                MessageContent content = new MessageContent();
                content.Caller = strCaller;
                if (m_bIsSopAlone)
                {
                    content.PhoneNumbers.AddRange(strPhoneNumbers);
                }
                else
                {
                    if (m_processManager.SopSimulatorDataManager.SiteID == 12)
                        content.EMails.AddRange(strPhoneNumbers);
                    else
                        content.PhoneNumbers.AddRange(strPhoneNumbers);
                }
                content.Message = message;
                //content.SensorReactionHistoryID = 7; // 카톡 test

                //if (client.SendSMS(content))
                //    return true;

                returnValue = client.SendSMS(content);
            }            

            return returnValue;
        }

        public string EncryptString(string str)
        {
            return AES256Cipher.AES_encrypt(str, key);
        }

        public string DecryptString(string str)
        {
            return AES256Cipher.AES_decrypt(str, key);
        }
    }
}
