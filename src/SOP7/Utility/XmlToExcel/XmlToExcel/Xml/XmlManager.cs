using System;
using System.Collections.Generic;
using System.Xml;
using System.Xml.Linq;
using UnE.Geometry;
using static dnsData.Sensor.Facility;

namespace XmlToExcel.Xml
{
    using Data;
    using Data.Sensor;
    using Excel;

    public class XmlManager
    {
        // SensorType
        private List<SensorSubType> m_fireSensorSubTypes = new List<SensorSubType>();
        private List<SensorType> m_sensorTypes = new List<SensorType>();

        // Key : BuildingGroup ID
        // Value : Parent ID
        private Dictionary<int, int> dicBuildingGroupParents = new Dictionary<int, int>();

        // Spatial
        private Dictionary<int, BuildingGroupData> m_dicBuildingGroups = new Dictionary<int, BuildingGroupData>();
        private Dictionary<int, BuildingData> m_dicBuildings = new Dictionary<int, BuildingData>();
        private Dictionary<int, ZoneData> m_dicZones = new Dictionary<int, ZoneData>();
        private Dictionary<int, EquipmentZoneData> m_dicEquipZones = new Dictionary<int, EquipmentZoneData>();

        // Sensor
        private List<FireSensor> m_fireSensors = new List<FireSensor>();
        private List<PSMSensor> m_psmSensors = new List<PSMSensor>();
        private List<EtcSensor> m_etcSensors = new List<EtcSensor>();
        private List<CCTVSensor> m_cctvs = new List<CCTVSensor>();

        public bool Load(string strFilePath, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                XElement xe = XElement.Load(strFilePath);

                if (!ReadSpaces(xe, out strErrorMessage))
                {
                    return false;
                }

                if (!ReadSensors(xe, out strErrorMessage))
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                strErrorMessage = "OpenXML : " + ex.Message;
                return false;
            }

            return true;
        }

        public string MakeExcel(string strFilePath, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strExcelFileName;
            ExcelManager excelManager = new ExcelManager();

            if (excelManager.MakeFile(strFilePath, m_dicBuildingGroups.Values, m_fireSensors, m_psmSensors, m_etcSensors, m_cctvs, out strErrorMessage, out strExcelFileName))
                return strExcelFileName;

            return null;
        }

        private bool ReadSensors(XElement xe, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                XElement xeSensors = FindElement(xe, XmlKey.XName_Sensors);

                XElement xeSensorTypes = FindElement(xeSensors, XmlKey.XName_SensorTypes);
                ReadSensorType(xeSensorTypes, out strErrorMessage);
                XElement xeFireSensorSubTypes = FindElement(xeSensors, XmlKey.XName_FireSensorSubTypes);
                ReadFireSensorSubType(xeFireSensorSubTypes, out strErrorMessage);

                XElement xeFireSensors = FindElement(xeSensors, XmlKey.XName_FireSensors);
                if (xeFireSensors != null)
                {
                    List<XElement> xeFireSensorList = FindElements(xeFireSensors, XmlKey.XName_Fire);
                    foreach (XElement xeFire in xeFireSensorList)
                        ReadEachSensor(xeFire, XmlKey.XName_Fire, out strErrorMessage);
                }

                XElement xePsmSensors = FindElement(xeSensors, XmlKey.XName_PsmSensors);
                if (xePsmSensors != null)
                {
                    List<XElement> xePsmSensorList = FindElements(xePsmSensors, XmlKey.XName_Psm);
                    foreach (XElement xePsm in xePsmSensorList)
                        ReadEachSensor(xePsm, XmlKey.XName_Psm, out strErrorMessage);
                }

                XElement xeEtcSensors = FindElement(xeSensors, XmlKey.XName_EtcSensors);
                if (xeEtcSensors != null)
                {
                    List<XElement> xeEtcSensorList = FindElements(xeEtcSensors, XmlKey.XName_Etc);
                    foreach (XElement xeEtc in xeEtcSensorList)
                        ReadEachSensor(xeEtc, XmlKey.XName_Etc, out strErrorMessage);
                }

                XElement xeCCTVs = FindElement(xeSensors, XmlKey.XName_CCTVs);
                if (xeCCTVs != null)
                {
                    List<XElement> xeCCTVList = FindElements(xeCCTVs, XmlKey.XName_CCTV);
                    foreach (XElement xeCCTV in xeCCTVList)
                        ReadEachSensor(xeCCTV, XmlKey.XName_CCTV, out strErrorMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadSensors : " + ex.Message;
                return false;
            }
        }

        private bool ReadSensors(XmlReader reader, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                while (reader.Read())
                {
                    bool isStartElement = reader.IsStartElement();
                    string readerName = reader.Name.ToString();
                    if (!isStartElement && readerName == XmlKey.XName_Sensors)
                        break;

                    switch (readerName)
                    {
                        case XmlKey.XName_SensorTypes:
                            if (!ReadSensorTypes(reader, out strErrorMessage))
                                return false;
                            break;
                        case XmlKey.XName_FireSensorSubTypes:
                            if (!ReadFireSensorSubTypes(reader, out strErrorMessage))
                                return false;
                            break;
                        case XmlKey.XName_FireSensors:
                        case XmlKey.XName_PsmSensors:
                        case XmlKey.XName_EtcSensors:
                        case XmlKey.XName_CCTVs:
                            if (!ReadEachSensors(reader, readerName, out strErrorMessage))
                                return false;
                            break;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadSensors : " + ex.Message;
                return false;
            }
        }

        private bool ReadSensorTypes(XmlReader reader, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                while (reader.Read())
                {
                    bool isStartElement = reader.IsStartElement();
                    if (!isStartElement)
                        break;

                    string readerName = reader.Name.ToString();
                    switch (readerName)
                    {
                        case XmlKey.XName_SensorType:
                            if (!ReadSensorType(reader, out strErrorMessage))
                                return false;
                            break;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadSensorTypes : " + ex.Message;
                return false;
            }
        }

        private bool ReadSensorType(XElement xe, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                List<XElement> xeSensorTypes = FindElements(xe, XmlKey.XName_SensorType);
                foreach (XElement xeSensorType in xeSensorTypes)
                {
                    string strIDValues = xeSensorType.Attribute("id").Value;
                    int? nID = GetID(strIDValues, XmlKey.KeyValue.SensorType);
                    if (nID == null)
                        throw new ApplicationException("ID 구하기 실패");

                    SensorType sensorType = new SensorType();
                    sensorType.ID = (int)nID;
                    sensorType.Name = FindElementValue(xeSensorType, XmlKey.XName_Name);

                    AddSensorType(sensorType);
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadSensorType : " + ex.Message;
                return false;
            }
        }

        private void AddSensorType(SensorType sensorType)
        {
            foreach (SensorType type in m_sensorTypes)
            {
                if (type.Name == sensorType.Name)
                {
                    foreach (SensorSubType sensorSubType in sensorType.SubType)
                    {
                        AddSensorSubType(type, sensorSubType);
                    }

                    return;
                }
            }

            m_sensorTypes.Add(sensorType);
        }

        private void AddSensorSubType(SensorType sensorType, SensorSubType sensorSubType)
        {
            foreach (SensorSubType subType in sensorType.SubType)
            {
                if (subType.Name == sensorSubType.Name)
                {
                    return;
                }
            }

            sensorType.SubType.Add(sensorSubType);
        }

        private bool ReadFireSensorSubType(XElement xe, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                List<XElement> xeSensorTypes = FindElements(xe, XmlKey.XName_FireSensorSubType);
                foreach (XElement xeSensorType in xeSensorTypes)
                {
                    string strIDValues = xeSensorType.Attribute("id").Value;
                    int? nID = GetID(strIDValues, XmlKey.KeyValue.FireSensorSubType);
                    if (nID == null)
                        throw new ApplicationException("ID 구하기 실패");

                    SensorSubType subType = new SensorSubType();
                    subType.ID = (int)nID;
                    subType.Name = FindElementValue(xeSensorType, XmlKey.XName_Name);

                    if (!m_fireSensorSubTypes.Contains(subType))
                        m_fireSensorSubTypes.Add(subType);

                    // 화재만 Sub type 등록
                    foreach (SensorType item in m_sensorTypes)
                    {
                        if (item.ID == (int)FacilityType.FIRE_SENSOR)
                        {
                            AddSensorSubType(item, subType);
                            //item.SubType.Add(subType);
                            break;
                        }
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadFireSensorSubType : " + ex.Message;
                return false;
            }
        }

        private bool ReadEachSensor(XElement xe, string xName, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                XmlKey.KeyValue keyValue = XmlKey.KeyValue.FireSensor;
                object sensor = null;
                if (xName == XmlKey.XName_Fire)
                {
                    sensor = new FireSensor();
                }
                else if (xName == XmlKey.XName_Psm)
                {
                    keyValue = XmlKey.KeyValue.PsmSensor;
                    sensor = new PSMSensor();
                }
                else if (xName == XmlKey.XName_Etc)
                {
                    keyValue = XmlKey.KeyValue.EtcSensor;
                    sensor = new EtcSensor();
                }
                else if (xName == XmlKey.XName_CCTV)
                {
                    keyValue = XmlKey.KeyValue.Cctv;
                    sensor = new CCTVSensor();
                }

                string strIDValues = xe.Attribute("id").Value;
                int? nID = GetID(strIDValues, keyValue);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strName = FindElementValue(xe, XmlKey.XName_Name);
                string strPositionName = FindElementValue(xe, XmlKey.XName_PositionName);
                string strPoint3Ds = FindElementValue(xe, XmlKey.XName_Point3D);
                float? x = null;
                float? y = null;
                float? z = null;
                string[] strPoint3D = strPoint3Ds.Split(',');
                if (strPoint3D != null && strPoint3D.Length == 3)
                {
                    float outX;
                    if (float.TryParse(strPoint3D[0], out outX))
                        x = outX;
                    float outY;
                    if (float.TryParse(strPoint3D[1], out outY))
                        y = outY;
                    float outZ;
                    if (float.TryParse(strPoint3D[2], out outZ))
                        z = outZ;
                }

                string strZoneID = FindElementValue(xe, XmlKey.XName_ZoneID);
                int? nZoneID = GetID(strZoneID, XmlKey.KeyValue.Zone);

                string strEquipzoneID = FindElementValue(xe, XmlKey.XName_EquipZoneID);
                int? nEquipzoneID = GetID(strEquipzoneID, XmlKey.KeyValue.EquipmentZone);

                string strSensorSubType = FindElementValue(xe, XmlKey.XName_SensorSubType);

                string strEquipZoneIDs = FindElementValue(xe, XmlKey.XName_EquipZoneIDs);
                List<int> equipZoneIDList = new List<int>();
                if (strEquipZoneIDs != null && strEquipZoneIDs.Length > 0)
                {
                    string[] splitEquipZones = strEquipZoneIDs.Split(',');
                    if (splitEquipZones != null && splitEquipZones.Length > 0)
                    {
                        for (int i = 0; i < splitEquipZones.Length; i++)
                        {
                            int? nTempEquipZoneID = GetID(splitEquipZones[i], XmlKey.KeyValue.EquipmentZone);
                            if (nTempEquipZoneID != null)
                                equipZoneIDList.Add((int)nTempEquipZoneID);
                        }
                    }
                }
                int? nSensorSubType = GetID(strSensorSubType, XmlKey.KeyValue.FireSensorSubType);

                string strMaterialType = FindElementValue(xe, XmlKey.XName_MaterialType);
                int? nMaterialType = GetID(strMaterialType, XmlKey.KeyValue.Material);

                string strTagNo = FindElementValue(xe, XmlKey.XName_TagNo);
                string strUniqueKey = FindElementValue(xe, XmlKey.XName_UniqueKey);
                string strUnitName = FindElementValue(xe, XmlKey.XName_UnitName);

                if (sensor is FireSensor)
                {
                    FireSensor fs = sensor as FireSensor;
                    fs.ID = (int)nID;
                    fs.Name = strName;
                    fs.PositionName = strPositionName;
                    fs.X = x;
                    fs.Y = y;
                    fs.Z = z;
                    if (nZoneID != null && nZoneID > 0)
                    {
                        fs.ZoneID = (int)nZoneID;
                        ZoneData zoneData = null;
                        if (m_dicZones.TryGetValue((int)nZoneID, out zoneData))
                            fs.BuildingID = zoneData.BuildingID;
                    }

                    fs.SensorSubType = nSensorSubType;
                    fs.EquipZoneID = (nEquipzoneID == null || nEquipzoneID == -1) ? null : nEquipzoneID;
                    int nTagNo;
                    if (int.TryParse(strTagNo, out nTagNo))
                        fs.TagNo = nTagNo;
                    m_fireSensors.Add(fs);
                }
                else if (sensor is PSMSensor)
                {
                    PSMSensor ps = sensor as PSMSensor;
                    ps.ID = (int)nID;
                    ps.Name = strName;
                    ps.PositionName = strPositionName;
                    ps.X = x;
                    ps.Y = y;
                    ps.Z = z;
                    if (nZoneID != null && nZoneID > 0)
                    {
                        ps.ZoneID = (int)nZoneID;
                        ZoneData zoneData = null;
                        if (m_dicZones.TryGetValue((int)nZoneID, out zoneData))
                            ps.BuildingID = zoneData.BuildingID;
                    }
                    ps.MaterialType = nMaterialType;
                    if (nEquipzoneID != null)
                        ps.EquipZoneID = (int)nEquipzoneID;
                    ps.UniqueKey = strUniqueKey;
                    ps.UnitName = strUnitName;

                    m_psmSensors.Add(ps);
                }
                else if (sensor is EtcSensor)
                {
                    EtcSensor es = sensor as EtcSensor;
                    es.ID = (int)nID;
                    es.Name = strName;
                    es.PositionName = strPositionName;
                    es.X = x;
                    es.Y = y;
                    es.Z = z;
                    if (nZoneID != null && nZoneID > 0)
                    {
                        es.ZoneID = (int)nZoneID;
                        ZoneData zoneData = null;
                        if (m_dicZones.TryGetValue((int)nZoneID, out zoneData))
                            es.BuildingID = zoneData.BuildingID;
                    }
                    es.EquipZoneID = (nEquipzoneID == null || nEquipzoneID == -1) ? null : nEquipzoneID;
                    es.UniqueKey = strUniqueKey;
                    es.UnitName = strUnitName;

                    m_etcSensors.Add(es);
                }
                else if (sensor is CCTVSensor)
                {
                    string strType = FindElementValue(xe, XmlKey.XName_Type);
                    string strUserID = FindElementValue(xe, XmlKey.XName_UserID);
                    string strPassword = FindElementValue(xe, XmlKey.XName_Password);
                    string strURL = FindElementValue(xe, XmlKey.XName_Url);

                    CCTVSensor cc = sensor as CCTVSensor;
                    cc.ID = (int)nID;
                    cc.Name = strName;
                    cc.PositionName = strPositionName;
                    cc.X = x;
                    cc.Y = y;
                    cc.Z = z;
                    if (nZoneID != null)
                    {
                        cc.ZoneID = (int)nZoneID;
                        ZoneData zoneData = null;
                        if (m_dicZones.TryGetValue((int)nZoneID, out zoneData))
                            cc.BuildingID = zoneData.BuildingID;
                    }

                    cc.EquipZoneID = (nEquipzoneID == null || nEquipzoneID == -1) ? null : nEquipzoneID;
                    cc.EquipZoneIDs = equipZoneIDList;
                    cc.Type = strType;
                    cc.UserID = strUserID;
                    cc.Password = strPassword;
                    cc.URL = strURL;

                    m_cctvs.Add(cc);
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadEachSensor : " + ex.Message;
                return false;
            }
        }

        private bool ReadSensorType(XmlReader reader, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                string strIDValues = reader.GetAttribute("id");
                int? nID = GetID(strIDValues, XmlKey.KeyValue.SensorType);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strName = "";

                while (reader.Read())
                {
                    bool isStartElement = reader.IsStartElement();
                    if (!isStartElement)
                        break;

                    string readerName = reader.Name.ToString();
                    switch (readerName)
                    {
                        case XmlKey.XName_Name:
                            strName = reader.ReadInnerXml();
                            break;
                    }
                }

                SensorType sensorType = new SensorType();
                sensorType.ID = (int)nID;
                sensorType.Name = strName;

                AddSensorType(sensorType);

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadSensorType : " + ex.Message;
                return false;
            }
        }

        private bool ReadFireSensorSubTypes(XmlReader reader, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                while (reader.Read())
                {
                    bool isStartElement = reader.IsStartElement();
                    if (!isStartElement)
                        break;

                    string readerName = reader.Name.ToString();
                    switch (readerName)
                    {
                        case XmlKey.XName_FireSensorSubType:
                            if (!ReadFireSensorSubType(reader, out strErrorMessage))
                                return false;
                            break;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadFireSensorSubTypes : " + ex.Message;
                return false;
            }
        }

        private bool ReadFireSensorSubType(XmlReader reader, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                string strIDValues = reader.GetAttribute("id");
                int? nID = GetID(strIDValues, XmlKey.KeyValue.FireSensorSubType);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strName = "";

                while (reader.Read())
                {
                    bool isStartElement = reader.IsStartElement();
                    if (!isStartElement)
                        break;

                    string readerName = reader.Name.ToString();
                    switch (readerName)
                    {
                        case XmlKey.XName_Name:
                            strName = reader.ReadInnerXml();
                            break;
                    }
                }

                SensorSubType subType = new SensorSubType();
                subType.ID = (int)nID;
                subType.Name = strName;

                if (!m_fireSensorSubTypes.Contains(subType))
                    m_fireSensorSubTypes.Add(subType);

                // 화재만 Sub type 등록
                foreach (SensorType item in m_sensorTypes)
                {
                    if (item.ID == 0)
                    {
                        item.SubType.Add(subType);
                        break;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadFireSensorSubType : " + ex.Message;
                return false;
            }
        }

        private bool ReadEachSensors(XmlReader reader, string xName, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                while (reader.Read())
                {
                    bool isStartElement = reader.IsStartElement();
                    string readerName = reader.Name.ToString();
                    if (!isStartElement && readerName == xName)
                        break;

                    switch (readerName)
                    {
                        case XmlKey.XName_Fire:
                        case XmlKey.XName_Psm:
                        case XmlKey.XName_Etc:
                        case XmlKey.XName_CCTV:
                            if (!ReadEachSensor(reader, readerName, out strErrorMessage))
                                return false;
                            break;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadEachSensors : " + ex.Message;
                return false;
            }
        }

        private bool ReadEachSensor(XmlReader reader, string xName, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                XmlKey.KeyValue keyValue = XmlKey.KeyValue.FireSensor;
                object sensor = null;
                if (xName == XmlKey.XName_Fire)
                {
                    sensor = new FireSensor();
                }
                else if (xName == XmlKey.XName_Psm)
                {
                    keyValue = XmlKey.KeyValue.PsmSensor;
                    sensor = new PSMSensor();
                }
                else if (xName == XmlKey.XName_Etc)
                {
                    keyValue = XmlKey.KeyValue.EtcSensor;
                    sensor = new EtcSensor();
                }
                else if (xName == XmlKey.XName_CCTV)
                {
                    keyValue = XmlKey.KeyValue.Cctv;
                    sensor = new CCTVSensor();
                }

                string strIDValues = reader.GetAttribute("id");
                int? nID = GetID(strIDValues, keyValue);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strName = "";
                string strPositionName = "";
                float? x = null;
                float? y = null;
                float? z = null;
                int? nZoneID = null;
                int? nEquipzoneID = null;
                int? nSensorSubType = null;
                int? nMaterialType = null;

                while (reader.Read())
                {
                    bool isStartElement = reader.IsStartElement();
                    string readerName = reader.Name.ToString();
                    if (!isStartElement && readerName == xName)
                        break;

                    switch (readerName)
                    {
                        case XmlKey.XName_Name:
                            strName = reader.ReadInnerXml();
                            break;
                        case XmlKey.XName_PositionName:
                            strPositionName = reader.ReadInnerXml();
                            break;
                        case XmlKey.XName_Point3D:
                            string strPoint3Ds = reader.ReadInnerXml();
                            string[] strPoint3D = strPoint3Ds.Split(',');
                            if (strPoint3D != null && strPoint3D.Length == 3)
                            {
                                float outX;
                                if (float.TryParse(strPoint3D[0], out outX))
                                    x = outX;
                                float outY;
                                if (float.TryParse(strPoint3D[1], out outY))
                                    y = outY;
                                float outZ;
                                if (float.TryParse(strPoint3D[2], out outZ))
                                    z = outZ;
                            }
                            break;
                        case XmlKey.XName_ZoneID:
                            nZoneID = GetID(reader.ReadInnerXml(), XmlKey.KeyValue.Zone);
                            //if (nZoneID == null)
                            //    throw new ApplicationException("Zone ID는 Null일 수 없습니다.");
                            break;
                        case XmlKey.XName_EquipZoneID:
                            nEquipzoneID = GetID(reader.ReadInnerXml(), XmlKey.KeyValue.EquipmentZone);
                            break;
                        case XmlKey.XName_SensorSubType:
                            nSensorSubType = GetID(reader.ReadInnerXml(), XmlKey.KeyValue.FireSensorSubType);
                            break;
                        case XmlKey.XName_MaterialType:
                            nMaterialType = GetID(reader.ReadInnerXml(), XmlKey.KeyValue.Material);
                            break;
                    }
                }

                if (sensor is FireSensor)
                {
                    FireSensor fs = sensor as FireSensor;
                    fs.ID = (int)nID;
                    fs.Name = strName;
                    fs.PositionName = strPositionName;
                    fs.X = x;
                    fs.Y = y;
                    fs.Z = z;
                    if (nZoneID != null)
                        fs.ZoneID = (int)nZoneID;
                    fs.SensorSubType = nSensorSubType;

                    m_fireSensors.Add(fs);
                }
                else if (sensor is PSMSensor)
                {
                    PSMSensor ps = sensor as PSMSensor;
                    ps.ID = (int)nID;
                    ps.Name = strName;
                    ps.PositionName = strPositionName;
                    ps.X = x;
                    ps.Y = y;
                    ps.Z = z;
                    if (nZoneID != null)
                        ps.ZoneID = (int)nZoneID;
                    ps.MaterialType = nMaterialType;

                    m_psmSensors.Add(ps);
                }
                else if (sensor is EtcSensor)
                {
                    EtcSensor es = sensor as EtcSensor;
                    es.ID = (int)nID;
                    es.Name = strName;
                    es.PositionName = strPositionName;
                    es.X = x;
                    es.Y = y;
                    es.Z = z;
                    if (nZoneID != null)
                        es.ZoneID = (int)nZoneID;

                    m_etcSensors.Add(es);
                }
                else if (sensor is CCTVSensor)
                {
                    CCTVSensor cc = sensor as CCTVSensor;
                    cc.ID = (int)nID;
                    cc.Name = strName;
                    cc.PositionName = strPositionName;
                    cc.X = x;
                    cc.Y = y;
                    cc.Z = z;
                    if (nZoneID != null)
                        cc.ZoneID = (int)nZoneID;

                    m_cctvs.Add(cc);
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadEachSensor : " + ex.Message;
                return false;
            }
        }

        private bool ReadSpaces(XElement xe, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                XElement xeSpace = FindElement(xe, XmlKey.XName_Spaces);

                XElement xeBuildingGroups = FindElement(xe, XmlKey.XName_BuildingGroups);
                List<XElement> xeBuildingGroupList = FindElements(xeBuildingGroups, XmlKey.XName_BuildingGroup);
                foreach (XElement xeBuildingGroup in xeBuildingGroupList)
                {
                    ReadBuildingGroup(xeBuildingGroup, out strErrorMessage);
                }

                XElement xeBuildings = FindElement(xe, XmlKey.XName_Buildings);
                List<XElement> xeBuildingList = FindElements(xeBuildings, XmlKey.XName_Building);
                foreach (XElement xeBuilding in xeBuildingList)
                {
                    ReadBuilding(xeBuilding, out strErrorMessage);
                }

                XElement xeZones = FindElement(xe, XmlKey.XName_Zones);
                List<XElement> xeZoneList = FindElements(xeZones, XmlKey.XName_Zone);
                foreach (XElement xeZone in xeZoneList)
                {
                    ReadZone(xeZone, out strErrorMessage);
                }

                XElement xeEquipmentZoneZones = FindElement(xe, XmlKey.XName_EquipmentZones);
                List<XElement> xeEquipmentZoneList = FindElements(xeEquipmentZoneZones, XmlKey.XName_EquipmentZone);
                foreach (XElement xeEquipmentZone in xeEquipmentZoneList)
                {
                    ReadEquipmentZone(xeEquipmentZone, out strErrorMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadSpaces : " + ex.Message;
                return false;
            }
        }

        private bool ReadBuilding(XElement xe, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                string strIDValues = xe.Attribute("id").Value;
                int? nID = GetID(strIDValues, XmlKey.KeyValue.Building);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strCode = FindElementValue(xe, XmlKey.XName_Code);
                string strName = FindElementValue(xe, XmlKey.XName_Name);
                string strBuildingGroupID = FindElementValue(xe, XmlKey.XName_BuildingGroupID);
                string strMaxFloor = FindElementValue(xe, XmlKey.XName_MaxFloor);
                string strMinFloor = FindElementValue(xe, XmlKey.XName_MinFloor);
                UnE.Geometry.Vertex3D vTextCenter = null;
                string strPoint3Ds = FindElementValue(xe, XmlKey.XName_Point3D);
                string[] strPoint3D = strPoint3Ds.Split(',');
                if (strPoint3D != null && strPoint3D.Length == 3)
                    vTextCenter = new UnE.Geometry.Vertex3D(Convert.ToDouble(strPoint3D[0]), Convert.ToDouble(strPoint3D[1]), Convert.ToDouble(strPoint3D[2]));

                string strDisplayText = FindElementValue(xe, XmlKey.XName_DisplayText);
                string strBroadcastText = FindElementValue(xe, XmlKey.XName_BroadcastText);
                string strModelFile = FindElementValue(xe, XmlKey.XName_ModelFile);

                BuildingData bData = new BuildingData();
                bData.ID = (int)nID;
                bData.BuildingCode = strCode;
                bData.BuildingName = strName;
                int? nBuildingGroupID = GetID(strBuildingGroupID, XmlKey.KeyValue.BuildingGroup);
                bData.BuildingGroupID = nBuildingGroupID == null ? -1 : (int)nBuildingGroupID;
                int nMaxFloor;
                if (int.TryParse(strMaxFloor, out nMaxFloor))
                    bData.MaxFloor = nMaxFloor;
                int nMinFloor;
                if (int.TryParse(strMinFloor, out nMinFloor))
                    bData.MinFloor = nMinFloor;
                bData.TextCenter = vTextCenter;
                bData.DisplayText = strDisplayText;
                bData.BroadcastText = strBroadcastText;

                BuildingGroupData bg;

                if (m_dicBuildingGroups.TryGetValue(bData.BuildingGroupID, out bg))
                {
                    bg.BuildingDatas.Add(bData);
                }

                m_dicBuildings[bData.ID] = bData;

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadBuilding : " + ex.Message;
                return false;
            }
        }

        private bool ReadZone(XElement xe, out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;

                string strIDValues = xe.Attribute("id").Value;
                int? nID = GetID(strIDValues, XmlKey.KeyValue.Zone);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strName = FindElementValue(xe, XmlKey.XName_Name);
                string strBuildingID = FindElementValue(xe, XmlKey.XName_BuildingID);
                string strFloorIndex = FindElementValue(xe, XmlKey.XName_FloorIndex);

                List<XElement> xe2Ds = FindElements(xe, XmlKey.XName_Point2D);
                string strBoundary = "";
                foreach (XElement xe2D in xe2Ds)
                {
                    string strPoint2Ds = FindElementValue(xe2D, XmlKey.XName_Point2D);
                    string[] strPoint2D = strPoint2Ds.Split(',');
                    if (strPoint2D != null && strPoint2D.Length == 2)
                    {
                        if (strBoundary.Length > 0)
                            strBoundary += strPoint2D[0] + "," + strPoint2D[1];
                    }
                }
                Polygon vBoundaries = StringToPolygon(strBoundary);

                UnE.Geometry.Vertex3D vTextCenter = null;
                string strPoint3Ds = FindElementValue(xe, XmlKey.XName_Point3D);
                string[] strPoint3D = strPoint3Ds.Split(',');
                if (strPoint3D != null && strPoint3D.Length == 3)
                    vTextCenter = new UnE.Geometry.Vertex3D(Convert.ToDouble(strPoint3D[0]), Convert.ToDouble(strPoint3D[1]), Convert.ToDouble(strPoint3D[2]));

                string strDisplayText = FindElementValue(xe, XmlKey.XName_DisplayText);
                string strBroadcastText = FindElementValue(xe, XmlKey.XName_BroadcastText);
                string strModelFile = FindElementValue(xe, XmlKey.XName_ModelFile);

                ZoneData zData = new ZoneData();
                zData.ID = (int)nID;
                zData.ZoneName = strName;
                int? nBuildingID = GetID(strBuildingID, XmlKey.KeyValue.Building);
                zData.BuildingID = nBuildingID;
                int nMaxFloor;
                if (int.TryParse(strFloorIndex, out nMaxFloor))
                    zData.FloorIndex = nMaxFloor;
                zData.TextCenter = vTextCenter;
                zData.Boundary = vBoundaries;
                zData.DisplayText = strDisplayText;
                zData.BroadcastText = strBroadcastText;

                BuildingData building;

                if (zData.BuildingID != null && m_dicBuildings.TryGetValue((int)zData.BuildingID, out building))
                {
                    building.ZoneDatas.Add(zData);
                }

                m_dicZones[zData.ID] = zData;

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadZone : " + ex.Message;
                return false;
            }
        }

        private Polygon StringToPolygon(string strVertices)
        {
            string[] tokens = strVertices.Split(',');

            if (tokens == null)
                return null;

            double x, y;
            int nTokenCount = tokens.Length;

            Polygon polygon = new Polygon();

            for (int i = 0; i < nTokenCount - 1; i += 2)
            {
                if (double.TryParse(tokens[i].Trim(), out x) &&
                    double.TryParse(tokens[i + 1].Trim(), out y))
                {
                    Vertex2D vertex = new Vertex2D(x, y);
                    polygon.AddVertex(vertex);
                }
                else
                    return null;
            }

            return polygon;
        }

        private bool ReadEquipmentZone(XElement xe, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                string strIDValues = xe.Attribute("id").Value;
                int? nID = GetID(strIDValues, XmlKey.KeyValue.EquipmentZone);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strName = FindElementValue(xe, XmlKey.XName_Name);
                List<int> linkedZoneIDList = new List<int>();
                XElement xeLinkedZoneIDList = FindElement(xe, XmlKey.XName_LinkedZoneIDList);
                List<XElement> xeZoneIDs = FindElements(xeLinkedZoneIDList, XmlKey.XName_ZoneID);
                foreach (XElement xeZoneID in xeZoneIDs)
                {
                    int? nZoneID = GetID(xeZoneID.Value, XmlKey.KeyValue.Zone);
                    if (nZoneID != null)
                        linkedZoneIDList.Add((int)nZoneID);
                }

                List<XElement> xe2Ds = FindElements(xe, XmlKey.XName_Point2D);
                string strBoundary = "";
                foreach (XElement xe2D in xe2Ds)
                {
                    string strPoint2Ds = FindElementValue(xe2D, XmlKey.XName_Point2D);
                    string[] strPoint2D = strPoint2Ds.Split(',');
                    if (strPoint2D != null && strPoint2D.Length == 2)
                    {
                        if (strBoundary.Length > 0)
                            strBoundary += strPoint2D[0] + "," + strPoint2D[1];
                    }
                }
                Polygon vBoundaries = StringToPolygon(strBoundary);

                UnE.Geometry.Vertex3D vTextCenter = null;
                string strPoint3Ds = FindElementValue(xe, XmlKey.XName_Point3D);
                string[] strPoint3D = strPoint3Ds.Split(',');
                if (strPoint3D != null && strPoint3D.Length == 3)
                    vTextCenter = new UnE.Geometry.Vertex3D(Convert.ToDouble(strPoint3D[0]), Convert.ToDouble(strPoint3D[1]), Convert.ToDouble(strPoint3D[2]));

                string strDisplayText = FindElementValue(xe, XmlKey.XName_DisplayText);
                string strBroadcastText = FindElementValue(xe, XmlKey.XName_BroadcastText);
                string strType = FindElementValue(xe, XmlKey.XName_Type);

                EquipmentZoneData ezData = new EquipmentZoneData();
                ezData.ID = (int)nID;
                ezData.ZoneName = strName;
                ezData.LinkedZoneIDs = linkedZoneIDList;
                ezData.Boundary = vBoundaries;
                ezData.TextCenter = vTextCenter;
                ezData.DisplayText = strDisplayText;
                ezData.BroadcastText = strBroadcastText;
                int nType;
                if (int.TryParse(strType, out nType))
                    ezData.Type = nType;

                ZoneData zone;
                foreach (int zoneID in ezData.LinkedZoneIDs)
                {
                    if (m_dicZones.TryGetValue(zoneID, out zone))
                    {
                        zone.EquipmentZoneDatas.Add(ezData);
                        ezData.LinkedZoneDatas.Add(zone);
                    }
                }

                m_dicEquipZones[ezData.ID] = ezData;

                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadEquipmentZone : " + ex.Message;
                return false;
            }
        }

        private bool ReadBuildingGroup(XElement xe, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                string strIDValues = xe.Attribute("id").Value;
                int? nID = GetID(strIDValues, XmlKey.KeyValue.BuildingGroup);
                if (nID == null)
                    throw new ApplicationException("ID 구하기 실패");

                string strName = FindElementValue(xe, XmlKey.XName_Name);
                string strDisplayText = FindElementValue(xe, XmlKey.XName_DisplayText);

                UnE.Geometry.Vertex3D vTextCenter = null;
                string strPoint3Ds = FindElementValue(xe, XmlKey.XName_Point3D);
                string[] strPoint3D = strPoint3Ds.Split(',');
                if (strPoint3D != null && strPoint3D.Length == 3)
                    vTextCenter = new UnE.Geometry.Vertex3D(Convert.ToDouble(strPoint3D[0]), Convert.ToDouble(strPoint3D[1]), Convert.ToDouble(strPoint3D[2]));

                string strParentID = FindElementValue(xe, XmlKey.XName_ParentID);
                string strSiteID = FindElementValue(xe, XmlKey.XName_SiteID);
                string strVisible = FindElementValue(xe, XmlKey.XName_Visible);

                BuildingGroupData bgData = new BuildingGroupData();
                bgData.ID = (int)nID;
                bgData.GroupName = strName;
                bgData.DisplayText = strDisplayText;
                bgData.TextCenter = vTextCenter;
                int nParentID;
                if (int.TryParse(strParentID, out nParentID))
                    bgData.ParentID = nParentID;
                int nSiteID;
                if (int.TryParse(strSiteID, out nSiteID))
                    bgData.SiteID = nSiteID;

                if (bgData.ParentID != null)
                    dicBuildingGroupParents[bgData.ID] = (int)bgData.ParentID;

                bool bVisible;
                if (bool.TryParse(strVisible, out bVisible))
                    bgData.Visible = bVisible;

                m_dicBuildingGroups[bgData.ID] = bgData;
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = "ReadBuildingGroup : " + ex.Message;
                return false;
            }
        }

        private int? GetID(string strValue, XmlKey.KeyValue keyValue)
        {
            if (strValue == null || strValue.Length == 0)
                return null;

            strValue = strValue.Replace(XmlKey.GetKeyValueSting(keyValue), "");

            int nID;
            if (int.TryParse(strValue, out nID))
                return nID;
            else
                return null;
        }

        private string FindElementValue(XElement node, string strNodeName)
        {
            if (node.Name == strNodeName)
                return "";

            foreach (XElement element in node.Elements())
            {
                XElement _element = FindElement(element, strNodeName);

                if (_element != null)
                    return _element.Value;
            }

            return "";
        }

        private XElement FindElement(XElement node, string strNodeName, bool bFindChildNodes = true)
        {
            if (node.Name == strNodeName)
                return node;

            foreach (XElement element in node.Elements())
            {
                if (bFindChildNodes)
                {
                    XElement _element = FindElement(element, strNodeName);

                    if (_element != null)
                        return _element;
                }
                else
                {
                    if (element.Name == strNodeName)
                        return element;
                }


            }

            return null;
        }

        private List<XElement> FindElements(XElement node, string strNodeName, bool bFindChildNodes = true)
        {
            List<XElement> _elements = new List<XElement>();

            if (node.Name == strNodeName)
                return _elements;

            foreach (XElement element in node.Elements())
            {
                if (bFindChildNodes)
                {
                    XElement _element = FindElement(element, strNodeName, bFindChildNodes);

                    if (_element != null)
                        _elements.Add(_element);
                }
                else
                {
                    if (element.Name == strNodeName)
                        _elements.Add(element);
                }
            }

            return _elements;
        }
    }
}
