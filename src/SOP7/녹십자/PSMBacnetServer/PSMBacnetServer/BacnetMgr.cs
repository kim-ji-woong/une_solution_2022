using SDMS.Model.Sensor;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO.BACnet;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PSMBacnetServer
{
    public class BacnetMgr
    {
        public static int STATE_NORMAL = 0;
        public static int STATE_ALARM = 2;
        static string VALUE_NORMAL = "0";
        static string VALUE_ALARM = "1";

        static float LIMIT_DATA = 17;

        static BacnetClient bacnet_client;
        DataMgr m_dataMgr = null;

        // All the present Bacnet Device List
        static List<BacNode> DevicesList = new List<BacNode>();

        public BacnetMgr(DataMgr dataMgr, out string strErrorMessage)
        {
            strErrorMessage = null;
            m_dataMgr = dataMgr;

            StartActivity();

            if (Init(out strErrorMessage) == false)
                return;
        }

        public bool Init(out string strErrorMessage)
        {
            strErrorMessage = null;

            string strIP_7001 = ConfigurationManager.AppSettings.Get("7001");
            if (strIP_7001 == null || strIP_7001.Length == 0)
            {
                strErrorMessage = "7001 주소를 확인해주세요.";
                return false;
            }

            string strIP_7002 = ConfigurationManager.AppSettings.Get("7002");
            if (strIP_7002 == null || strIP_7002.Length == 0)
            {
                strErrorMessage = "7002 주소를 확인해주세요.";
                return false;
            }

            string strIP_7003 = ConfigurationManager.AppSettings.Get("7003");
            if (strIP_7003 == null || strIP_7003.Length == 0)
            {
                strErrorMessage = "7003 주소를 확인해주세요.";
                return false;
            }

            string strIP_7004 = ConfigurationManager.AppSettings.Get("7004");
            if (strIP_7004 == null || strIP_7004.Length == 0)
            {
                strErrorMessage = "7004 주소를 확인해주세요.";
                return false;
            }

            BacnetAddress adr = new BacnetAddress(BacnetAddressTypes.IP, strIP_7001);
            uint device_id = 7001;
            DevicesList.Add(new BacNode(adr, device_id));   // add it


            adr = new BacnetAddress(BacnetAddressTypes.IP, strIP_7002);
            device_id = 7002;
            DevicesList.Add(new BacNode(adr, device_id));   // add it

            adr = new BacnetAddress(BacnetAddressTypes.IP, strIP_7003);
            device_id = 7003;
            DevicesList.Add(new BacNode(adr, device_id));   // add it

            adr = new BacnetAddress(BacnetAddressTypes.IP, strIP_7004);
            device_id = 7004;
            DevicesList.Add(new BacNode(adr, device_id));   // add it

            return true;
        }

        static void StartActivity()
        {
            // Bacnet on UDP/IP/Ethernet
            bacnet_client = new BacnetClient(new BacnetIpUdpProtocolTransport(0xBAC0, false));
            // or Bacnet Mstp on COM4 à 38400 bps, own master id 8
            // m_bacnet_client = new BacnetClient(new BacnetMstpProtocolTransport("COM4", 38400, 8);
            // Or Bacnet Ethernet
            // bacnet_client = new BacnetClient(new BacnetEthernetProtocolTransport("Connexion au réseau local"));          
            // Or Bacnet on IPV6
            // bacnet_client = new BacnetClient(new BacnetIpV6UdpProtocolTransport(0xBAC0));

            bacnet_client.Start();    // go

            // Send WhoIs in order to get back all the Iam responses :  
            //bacnet_client.OnIam += new BacnetClient.IamHandler(handler_OnIam);

            //bacnet_client.WhoIs();

            /* Optional Remote Registration as A Foreign Device on a BBMD at @192.168.1.1 on the default 0xBAC0 port
                           
            bacnet_client.RegisterAsForeignDevice("192.168.1.1", 60);
            Thread.Sleep(20);
            bacnet_client.RemoteWhoIs("192.168.1.1");
            */
        }

        public bool RequestSensorData(string strAlarmKey, List<string> listSensorKeys, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strAlarmKey == null || strAlarmKey == "" ||
                listSensorKeys == null || listSensorKeys.Count == 0)
            {
                strErrorMessage = "strAlarmKey, listSensorKeys이 제대로 된 값이 아닙니다.";
                return false;
            }

            string[] tokens = strAlarmKey.Split('_');
            int nTokenCount = tokens.Length;

            if (nTokenCount != 2)
            {
                strErrorMessage = "strAlarmKey 이 제대로 된 값이 아닙니다.";
                return false;
            }

            int nDeviceID = -1;
            uint nInstance = 0;

            if (int.TryParse(tokens[0], out nDeviceID) == false || uint.TryParse(tokens[1], out nInstance) == false)
            {
                strErrorMessage = "strAlarmKey 이 제대로 된 값이 아닙니다.";
                return false;
            }

            bool bAlarm = false;
            

            // 알람 읽어오기
            if (ReadAlarmValue(nDeviceID, nInstance, out bAlarm, out strErrorMessage) == false)
            {
                //return false;
                Logger.Instance.Write("ReadAlarmValue 실패 (" + strErrorMessage + ")");
            }

            bool isCheckLog = false;
            string strLog = strAlarmKey + " 알람 상태: " + bAlarm.ToString() + ", 해당 센서 상태 >> ";
            

            // 센서값 읽어오기
            foreach (string sensorKey in listSensorKeys)
            {
                float fSensorValue = 0;
                tokens = sensorKey.Split('_');
                nTokenCount = tokens.Length;

                if (nTokenCount != 2)
                {
                    strErrorMessage = "sensorKey 이 제대로 된 값이 아닙니다.";
                    return false;
                }

                nDeviceID = -1;
                nInstance = 0;

                if (int.TryParse(tokens[0], out nDeviceID) == false || uint.TryParse(tokens[1], out nInstance) == false)
                {
                    strErrorMessage = "sensorKey 이 제대로 된 값이 아닙니다.";
                    return false;
                }

                if (ReadSensorValue(nDeviceID, nInstance, out fSensorValue, out strErrorMessage) == false)
                {
                    //return false;
                    Logger.Instance.Write("ReadSensorValue 실패 (" + strErrorMessage + ")");
                    //continue;
                }

                PSM sensor = m_dataMgr.DicPSMSensors[sensorKey];
                if (sensor == null)
                    continue;

                sensor.CurrentData = fSensorValue;

                // 알람 발생 및 해제 데이터 입력 부분
                if (bAlarm == true)
                {   // 알람 발생 경우, 17 값 이상일때, 알람 발생 입력
                    if (sensor.CurrentData >= LIMIT_DATA)
                        sensor.Status = STATE_ALARM;
                    else
                        sensor.Status = STATE_NORMAL;

                    isCheckLog = true;
                }
                else
                {   // 알람 발생하지 않을 경우, 알람 해제 입력

                    // 예외처리 (알람 발생 중에 중간중간에 알람 신호가 false 값이 들어옴)
                    if (sensor.Status == STATE_ALARM && sensor.CurrentData >= LIMIT_DATA)
                    {
                        sensor.Status = STATE_ALARM;
                        isCheckLog = true;
                    }
                    else
                        sensor.Status = STATE_NORMAL;
                }

                strLog = strLog + sensorKey + "(" + sensor.Status + "): " + fSensorValue.ToString() + ", ";
            }

            // 알람 발생 시 센서 데이터 로그
            if (isCheckLog == true)
                Logger.Instance.Write(strLog);

            return true;
        }

        bool ReadAlarmValue(int nDeviceID, uint nInstance, out bool bAlarm, out string strErrorMessage)
        {
            strErrorMessage = null;
            bAlarm = false;

            BacnetValue Value;
            bool ret;

            try
            {
                ret = ReadScalarValue(nDeviceID, new BacnetObjectId(BacnetObjectTypes.OBJECT_BINARY_OUTPUT, nInstance), BacnetPropertyIds.PROP_PRESENT_VALUE, out Value);
                if (ret == false)
                {
                    strErrorMessage = "ReadScalarValue 실패 (Device ID: " + nDeviceID.ToString() + ", Instance: " + nInstance.ToString() + ")";
                    return ret;
                }

                string strValue = Value.Value.ToString();

                if (strValue == VALUE_ALARM)
                    bAlarm = true;
            }
            catch (Exception e)
            {
                strErrorMessage = "ReadScalarValue 예외 ( " + e.Message + ", Device ID: " + nDeviceID.ToString() + ", Instance: " + nInstance.ToString() + ")";
                ret = false;
            }
            
            return ret;
        }

        bool ReadSensorValue(int nDeviceID, uint nInstance, out float fValue, out string strErrorMessage)
        {
            strErrorMessage = null;
            fValue = 0;

            BacnetValue Value;
            bool ret;

            try
            {
                ret = ReadScalarValue(nDeviceID, new BacnetObjectId(BacnetObjectTypes.OBJECT_ANALOG_INPUT, nInstance), BacnetPropertyIds.PROP_PRESENT_VALUE, out Value);
                if (ret == false)
                {
                    strErrorMessage = "ReadScalarValue 실패 (Device ID: " + nDeviceID.ToString() + ", Instance: " + nInstance.ToString() + ")";
                    return ret;
                }

                string strValue = Value.Value.ToString();

                if (float.TryParse(strValue, out fValue) == false)
                {
                    strErrorMessage = "ReadScalarValue의 Value가 제대로 된 값이 아닙니다. Value: " + strValue;
                    ret = false;
                }
            }
            catch (Exception e)
            {
                strErrorMessage = "ReadScalarValue의 예외 (" + e.Message + ", Device ID: " + nDeviceID.ToString() + ", Instance: " + nInstance.ToString() + ")";
                ret = false;
            }

            return ret;
        }

        bool ReadScalarValue(int device_id, BacnetObjectId BacnetObjet, BacnetPropertyIds Propriete, out BacnetValue Value)
        {
            BacnetAddress adr;
            IList<BacnetValue> NoScalarValue;

            Value = new BacnetValue(null);

            // Looking for the device
            adr = DeviceAddr((uint)device_id);
            if (adr == null) return false;  // not found

            // Property Read
            if (bacnet_client.ReadPropertyRequest(adr, BacnetObjet, Propriete, out NoScalarValue) == false)
                return false;

            Value = NoScalarValue[0];
            return true;
        }

        BacnetAddress DeviceAddr(uint device_id)
        {
            BacnetAddress ret;

            lock (DevicesList)
            {
                foreach (BacNode bn in DevicesList)
                {
                    ret = bn.getAdd(device_id);
                    if (ret != null) return ret;
                }
                // not in the list
                return null;
            }
        }

        
    }

    class BacNode
    {
        BacnetAddress adr;
        uint device_id;

        public BacNode(BacnetAddress adr, uint device_id)
        {
            this.adr = adr;
            this.device_id = device_id;
        }

        public BacnetAddress getAdd(uint device_id)
        {
            if (this.device_id == device_id)
                return adr;
            else
                return null;
        }
    }
}
