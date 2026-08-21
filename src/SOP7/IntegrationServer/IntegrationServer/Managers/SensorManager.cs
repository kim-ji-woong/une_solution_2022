using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using IntegrationServer.ViewModels.Option;
using IntegrationServer.ViewModels.Sdms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Nipa.Model.Sdms.Sensor;
using static dnsSopID.ID;

namespace IntegrationServer.Managers
{
    using ViewModels.Sdms.Sensor;

    public class SensorManager
    {
        private static SensorManager m_instance = null;
        public static SensorManager Instance { get { return m_instance; } }
        private IDataManager m_dataManager = null;

        // <Key:SensorServerID, <Key:TagInfoID>>
        private Dictionary<int, Dictionary<int, SensorTag>> m_dicSensorTagInfo = new Dictionary<int, Dictionary<int, SensorTag>>();
        
        public SensorManager(IDataManager dataManager)
        {
            m_instance = this;
            m_dataManager = dataManager;
        }

        public void Stop()
        {
        }

        public bool LoadData(List<ServerData> serverDatas)
        {
            m_dicSensorTagInfo.Clear();
            if (serverDatas.Count == 0)
            {
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadData : 조회할 SensorServerID가 없음");
                return false;
            }

            //string strSensorServerIDs = string.Join(",", sensorServerIDs);

            foreach (ServerData serverData in serverDatas)
            {
                if (!serverData.Use)
                    continue;

                string strSQL = string.Empty;
                if (serverData.ServerType == (int)ServerTypes.CCTV_ShinilTech)
                {
                    strSQL = $@"
                        select sz.ID SensorZoneID, sti.ID SensorTagInfoID, SensorType, OrgSensorID, SensorServerID, TagNo, sti.Description
                             , CameraIP, UserID, Password
                          from SdmsSensorZone sz
                         inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID
                         inner join SdmsCCTV c on sz.OrgSensorID=c.ID 
                         where SensorServerID = ({serverData.SeqNo})";
                }
                else
                {
                    strSQL = $@"
                        select sz.ID SensorZoneID, sti.ID SensorTagInfoID, SensorType, OrgSensorID, SensorServerID, TagNo, sti.Description
                          from SdmsSensorZone sz
                         inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID
                         where SensorServerID = ({serverData.SeqNo})";
                }

                string strError;
                IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strError);
                if (dynamics == null)
                {
                    Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadData : " + strError);
                    continue;
                }

                foreach (var item in dynamics)
                {
                    int nSensorZoneID = item.SensorZoneID;
                    int nSensorTagInfoID = item.SensorTagInfoID;
                    int nSensorType = item.SensorType;
                    int nOrgSensorID = item.OrgSensorID != null ? (int)item.OrgSensorID : 0;
                    int nSensorServerID = item.SensorServerID;
                    int nTagNo = item.TagNo;
                    string strDescription = item.Description;

                    SensorTag sensor = null;

                    if (serverData.ServerType == (int)ServerTypes.CCTV_ShinilTech)
                    {
                        string strCameraIPTemp = item.CameraIP == null ? string.Empty : item.CameraIP;
                        string strUserID = item.UserID == null ? string.Empty : item.UserID;
                        string strPassword = item.Password == null ? string.Empty : item.Password;

                        string strCameraIP = string.Empty;
                        int nPort = 0;
                        string[] ipSplit = strCameraIPTemp.Split(':');
                        if (ipSplit.Length == 2)
                        {
                            strCameraIP = ipSplit[0];
                            int.TryParse(ipSplit[1], out nPort);
                        }


                        sensor = new CCTVSensor()
                        {
                            ID = nSensorTagInfoID,
                            SensorZoneID = nSensorZoneID,
                            SensorType = nSensorType,
                            TagNo = nTagNo,
                            OrgSensorID = nOrgSensorID,
                            SensorServerID = nSensorServerID,
                            CameraIP = strCameraIP,
                            Port = nPort,
                            LoginID = strUserID,
                            LoginPw = strPassword,
                            Description = strDescription
                        };
                    }
                    else
                    {
                        sensor = new SensorTag()
                        {
                            ID = nSensorTagInfoID,
                            SensorZoneID = nSensorZoneID,
                            SensorType = nSensorType,
                            TagNo = nTagNo,
                            OrgSensorID = nOrgSensorID,
                            SensorServerID = nSensorServerID,
                            Description = strDescription
                        };
                    }

                    if (sensor != null)
                    {

                        if (!m_dicSensorTagInfo.ContainsKey(nSensorServerID))
                            m_dicSensorTagInfo.Add(nSensorServerID, new Dictionary<int, SensorTag>());

                        if (m_dicSensorTagInfo[nSensorServerID].ContainsKey(nSensorTagInfoID))
                            continue;

                        m_dicSensorTagInfo[nSensorServerID].Add(nSensorTagInfoID, sensor);
                    }
                }
            }

            return true;
        }

        public bool LoadData(List<int> sensorServerIDs)
        {
            m_dicSensorTagInfo.Clear();
            if (sensorServerIDs.Count == 0)
            {
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadData : 조회할 SensorServerID가 없음");
                return false;
            }

            string strSensorServerIDs = string.Join(",", sensorServerIDs);

            string strSQL = $@"
                select sz.ID SensorZoneID, sti.ID SensorTagInfoID, SensorType, OrgSensorID, SensorServerID, TagNo, sti.Description Description
                  from SdmsSensorZone sz
                 inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID
                 where SensorServerID in ({strSensorServerIDs})";

            string strError;
            IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strError);
            if (dynamics == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadData : " + strError);
                return false;
            }

            foreach (var item in dynamics)
            {
                int nSensorZoneID = item.SensorZoneID;
                int nSensorTagInfoID = item.SensorTagInfoID;
                int nSensorType = item.SensorType;
                int nOrgSensorID = item.OrgSensorID;
                int nSensorServerID = item.SensorServerID;
                int nTagNo = item.TagNo;
                string strDescription = item.Description;

                SensorTag tagInfo = new SensorTag()
                {
                    ID = nSensorTagInfoID,
                    SensorZoneID = nSensorZoneID,
                    SensorType = nSensorType,
                    TagNo = nTagNo,
                    OrgSensorID = nOrgSensorID,
                    SensorServerID = nSensorServerID,
                    Description = strDescription
                };

                if (!m_dicSensorTagInfo.ContainsKey(nSensorServerID))
                    m_dicSensorTagInfo.Add(nSensorServerID, new Dictionary<int, SensorTag>());

                if (m_dicSensorTagInfo[nSensorServerID].ContainsKey(nSensorTagInfoID))
                    continue;

                m_dicSensorTagInfo[nSensorServerID].Add(nSensorTagInfoID, tagInfo);
            }

            return true;
        }

        public static Dictionary<int, SensorTag> LoadSensors(IDataManager dataManager, int nSiteID, int nSensorType)
        {
            string strSensorID = EtcSensor.Fields.ID.ToString();
            string strSensorSiteID = EtcSensor.Fields.SiteID.ToString();
            string strSensorTable = EtcSensor.TableName;

            if (nSensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
            {
                strSensorID = Fire.Fields.ID.ToString();
                strSensorSiteID = Fire.Fields.SiteID.ToString();
                strSensorTable = Fire.TableName;
            }

            string strSQL = string.Format("select sz.{0} SensorZoneID, sti.{1} SensorTagInfoID, sz.{3} OrgSensorID, sti.{4} SensorServerID, sti.{5} TagNo, sti.{14} Description from {6} sz inner join {7} sti on sz.{0}=sti.{8} inner join {9} sensor on sensor.{10} = sz.{3} and sz.{2} = {11} and sensor.{12} = {13}",
                SensorZone.Fields.ID,
                TagInfo.Fields.ID,
                SensorZone.Fields.SensorType,
                SensorZone.Fields.OrgSensorID,
                TagInfo.Fields.SensorServerID,
                TagInfo.Fields.TagNo,
                SensorZone.TableName,
                TagInfo.TableName,
                TagInfo.Fields.SensorZoneID,
                strSensorTable,
                strSensorID,
                nSensorType,
                strSensorSiteID,
                nSiteID,
                TagInfo.Fields.Description);

            string strError;
            IEnumerable<dynamic> dynamics = dataManager.GetSelect().Select(strSQL, out strError);
            if (dynamics == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadSensors : " + strError);
                return null;
            }

            Dictionary<int, SensorTag> dicSensorTags = new Dictionary<int, SensorTag>();

            foreach (var item in dynamics)
            {
                int nSensorZoneID = item.SensorZoneID;
                int nSensorTagInfoID = item.SensorTagInfoID;
                int nOrgSensorID = item.OrgSensorID;
                int nSensorServerID = item.SensorServerID;
                int nTagNo = item.TagNo;
                string strDescription = item.Description;

                SensorTag tagInfo = new SensorTag()
                {
                    ID = nSensorTagInfoID,
                    SensorZoneID = nSensorZoneID,
                    SensorType = nSensorType,
                    TagNo = nTagNo,
                    OrgSensorID = nOrgSensorID,
                    SensorServerID = nSensorServerID,
                    Description = strDescription
                };

                dicSensorTags[nSensorTagInfoID] = tagInfo;
            }

            return dicSensorTags;
        }

        private static int? GetFirstZoneID(string strZoneIDs)
        {
            if (strZoneIDs == null || strZoneIDs.Length == 0)
                return null;

            string[] tokens = strZoneIDs.Split(',');
            
            foreach (string strToken in tokens)
            {
                int zoneID;

                if (int.TryParse(strToken.Trim(), out zoneID))
                    return zoneID;
            }

            return null;
        }

        // Key : Zone ID
        public static Dictionary<int, List<SensorTag>> LoadZoneSensors(IDataManager dataManager, int nSiteID, int nSensorType)
        {
            string strSensorID = EtcSensor.Fields.ID.ToString();
            string strSensorSiteID = EtcSensor.Fields.SiteID.ToString();
            string strSensorTable = EtcSensor.TableName;

            if (nSensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
            {
                strSensorID = Fire.Fields.ID.ToString();
                strSensorSiteID = Fire.Fields.SiteID.ToString();
                strSensorTable = Fire.TableName;
            }

            string strSQL = string.Format("select sz.{0} SensorZoneID, sti.{1} SensorTagInfoID, sz.{3} OrgSensorID, sti.{4} SensorServerID, sti.{5} TagNo, sti.{14} Description, sz.{15} EquipZoneID, ez.{16} ZoneIDs from {6} sz inner join {7} sti on sz.{0}=sti.{8} inner join {9} sensor on sensor.{10} = sz.{3} and sz.{2} = {11} and sensor.{12} = {13} inner join {17} ez on sz.{15} = ez.{18}",
                SensorZone.Fields.ID,
                TagInfo.Fields.ID,
                SensorZone.Fields.SensorType,
                SensorZone.Fields.OrgSensorID,
                TagInfo.Fields.SensorServerID,
                TagInfo.Fields.TagNo,
                SensorZone.TableName,
                TagInfo.TableName,
                TagInfo.Fields.SensorZoneID,
                strSensorTable,
                strSensorID,
                nSensorType,
                strSensorSiteID,
                nSiteID,
                TagInfo.Fields.Description,
                SensorZone.Fields.EquipZoneID,
                Nipa.Model.Sdms.Spatial.EquipmentZone.Fields.LinkedZoneIDList,
                Nipa.Model.Sdms.Spatial.EquipmentZone.TableName,
                Nipa.Model.Sdms.Spatial.EquipmentZone.Fields.ID);

            string strError;
            IEnumerable<dynamic> dynamics = dataManager.GetSelect().Select(strSQL, out strError);
            if (dynamics == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadSensors : " + strError);
                return null;
            }

            Dictionary<int, List<SensorTag>> dicZoneSensorTags = new Dictionary<int, List<SensorTag>>();

            foreach (var item in dynamics)
            {
                int nSensorZoneID = item.SensorZoneID;
                int nSensorTagInfoID = item.SensorTagInfoID;
                int nOrgSensorID = item.OrgSensorID;
                int nSensorServerID = item.SensorServerID;
                int nTagNo = item.TagNo;
                string strDescription = item.Description;
                int nEquipZoneID = item.EquipZoneID;
                string strZoneIDs = item.ZoneIDs;

                int? zoneID = GetFirstZoneID(strZoneIDs);

                if (zoneID == null)
                    continue;

                List<SensorTag> sensorTags = null;

                if (dicZoneSensorTags.TryGetValue((int)zoneID, out sensorTags) == false)
                {
                    sensorTags = new List<SensorTag>();
                    dicZoneSensorTags[(int)zoneID] = sensorTags;
                }

                SensorTag tagInfo = new SensorTag()
                {
                    ID = nSensorTagInfoID,
                    SensorZoneID = nSensorZoneID,
                    SensorType = nSensorType,
                    TagNo = nTagNo,
                    OrgSensorID = nOrgSensorID,
                    SensorServerID = nSensorServerID,
                    Description = strDescription
                };

                sensorTags.Add(tagInfo);
            }

            return dicZoneSensorTags;
        }

        /// <summary>
        /// SdmsSensorTagInfo.TagNo 로 센서 찾기
        /// </summary>
        /// <param name="nSensorServerID"></param>
        /// <param name="nTagNo"></param>
        /// <returns></returns>
        public SensorTag FindSensor(int nSensorServerID, int nTagNo)
        {
            Dictionary<int, SensorTag> sensorTags;
            if (m_dicSensorTagInfo.TryGetValue(nSensorServerID, out sensorTags))
            {
                foreach (KeyValuePair<int, SensorTag> item in sensorTags)
                {
                    if (item.Value.TagNo == nTagNo)
                        return item.Value;
                }
            }

            return null;
        }

        /// <summary>
        /// OrgSensorID로 센서 찾기
        /// </summary>
        /// <param name="nSensorServerID"></param>
        /// <param name="nOrgSensorID"></param>
        /// <returns></returns>
        public SensorTag FindSensorByOrgSensorID(int nSensorServerID, int nOrgSensorID)
        {
            Dictionary<int, SensorTag> sensorTags;
            if (m_dicSensorTagInfo.TryGetValue(nSensorServerID, out sensorTags))
            {
                foreach (KeyValuePair<int, SensorTag> item in sensorTags)
                {
                    if (item.Value.OrgSensorID == nOrgSensorID)
                        return item.Value;
                }
            }

            return null;
        }

        /// <summary>
        /// SdmsSensorTagInfo.ID로 센서 찾기
        /// </summary>
        /// <param name="nSensorServerID"></param>
        /// <param name="nTagID"></param>
        /// <returns></returns>
        public SensorTag FindSensorByTagID(int nSensorServerID, int nTagID)
        {
            Dictionary<int, SensorTag> sensorTags;
            if (m_dicSensorTagInfo.TryGetValue(nSensorServerID, out sensorTags))
            {
                SensorTag sensorTag;
                if (sensorTags.TryGetValue(nTagID, out sensorTag))
                    return sensorTag;
            }

            return null;
        }

        public Dictionary<int, SensorTag> FindSensors(int nSensorServerID)
        {
            Dictionary<int, SensorTag> sensorTags;
            if (m_dicSensorTagInfo.TryGetValue(nSensorServerID, out sensorTags))
            {
                return sensorTags;
            }

            return null;
        }

        public static int GetPsmAlarmLevel(double limitBase, int limitType, string limitValue, double value)
        {
            if (limitValue == null)
                return 0;

            string[] tokens = limitValue.Split('|');

            if (tokens.Length != 2)
                return 0;

            string[] alarmUse = tokens[0].Split(',');
            string[] valueRange = tokens[1].Split(',');

            if (alarmUse.Length != 3 || valueRange.Length != 3)
                return 0;

            for (int i = 2; i >= 0; i--)
            {
                if (alarmUse[i].Trim().ToLower() != "true")
                    continue;

                // 일반형
                if (limitType == 1)
                {
                    double data;

                    if (double.TryParse(valueRange[i].Trim(), out data) == false)
                    {
                        if (i == 0 && value >= limitBase)
                            return i + 1;
                        else
                            continue;
                    }

                    if ((limitBase <= data && value >= data) || 
                        (limitBase >= data && value <= data))
                        return i + 1;
                }
                // On/Off형
                else if (limitType == 2)
                {
                    if (value != 0)
                        return i + 1;
                }
                // 분포형
                else if (limitType == 3)
                {
                    double data;

                    if (double.TryParse(valueRange[i].Trim(), out data) == false)
                        continue;

                    if (value >= limitBase + data || value <= limitBase - data)
                        return i + 1;
                }
                // 범위형
                else if (limitType == 4)
                {
                    string[] arrRange = valueRange[i].Trim().Split('&');

                    foreach (string strRange in arrRange)
                    {
                        if (CheckRangeValue(strRange.Trim(), value, limitBase))
                            return i + 1;
                    }
                }
            }

            return 0;
        }

        private static bool CheckRangeValue(string strRange, double value, double limitBase)
        {
            string[] tokens = strRange.Split('~');

            double data1, data2;

            if (tokens.Length == 2)
            {
                if (tokens[0].Trim() == "")
                {
                    if (double.TryParse(tokens[1].Trim(), out data1))
                    {
                        if (value >= limitBase && value <= data1)
                            return true;
                    }
                }
                else if (tokens[1].Trim() == "")
                {
                    if (double.TryParse(tokens[0].Trim(), out data1))
                    {
                        if (value >= data1)
                            return true;
                    }
                }
                else
                {
                    if (double.TryParse(tokens[0].Trim(), out data1) && double.TryParse(tokens[1].Trim(), out data2))
                    {
                        if (value >= data1 && value <= data2)
                            return true;
                    }
                }
            }

            return false;
        }
    }

    public class SensorTag
    {
        private int m_nID = 0;
        private int m_nSensorType = 0;
        private int m_nTagNo = 0;
        private int m_nSensorZoneID = 0;
        private int m_nOrgSensorID = 0;
        private int m_nSensorServerID = 0;
        private string m_strDescription = string.Empty;

        /// <summary>
        /// SensorTagInfo 테이블 ID
        /// </summary>
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int TagNo
        {
            get { return m_nTagNo; }
            set { m_nTagNo = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int OrgSensorID
        {
            get { return m_nOrgSensorID; }
            set { m_nOrgSensorID = value; }
        }

        public int SensorServerID
        {
            get { return m_nSensorServerID; }
            set { m_nSensorServerID = value; }
        }

        public string Description
        {
            get { return m_strDescription; }
            set { m_strDescription = value; }
        }
    }

    public class SensorTagGroup
    {
        private int m_nMinTagNo = -1;
        private int m_nMaxTagNo = -1;
        private string m_strGroupName = "";
        // Key : TagNo
        private Dictionary<int, SensorTag> m_dicSensorTags = new Dictionary<int, SensorTag>();

        public int MinTagNo
        {
            get { return m_nMinTagNo; }
            set { m_nMinTagNo = value; }
        }
        
        public int MaxTagNo
        {
            get { return m_nMaxTagNo; }
            set { m_nMaxTagNo = value; }
        }

        public string GroupName
        {
            get { return m_strGroupName; }
            set { m_strGroupName = value; }
        }

        public Dictionary<int, SensorTag> SensorTags
        {
            get { return m_dicSensorTags; }
        }

        public SensorTagGroup(string strGroupName)
        {
            m_strGroupName = strGroupName;
        }

        public void AddSensorTag(SensorTag sensorTag)
        {
            if (sensorTag.TagNo > m_nMaxTagNo)
                m_nMaxTagNo = sensorTag.TagNo;

            if (m_nMinTagNo < 0 || sensorTag.TagNo < m_nMinTagNo)
                m_nMinTagNo = sensorTag.TagNo;
        }
    }

    public class CCTVSensor : SensorTag
    {
        public string CameraIP { get; set; }
        public int Port { get; set; }
        public string LoginID { get; set; }
        public string LoginPw { get; set; }
    }

    public class AlarmInfo
    {
        public int SensorZoneHistoryID { get; set; }
        public int SensorType { get; set; }
        public DateTime TimeStamp { get; set; }
        public int SopStatus { get; set; }
        public int AlarmDepth { get; set; }
        public int SensorZoneID { get; set; }
    }
}
