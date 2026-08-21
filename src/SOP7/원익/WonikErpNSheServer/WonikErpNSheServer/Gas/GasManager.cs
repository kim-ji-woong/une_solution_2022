using dnsCommunicateSopServer;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WonikErpNSheServer.Gas
{
    public class GasManager
    {
        //private List<GasProvider> m_providers = null;
        private DBDataManager m_dbDataManager = null;
        private SopQueryManager m_sopQueryMgr = null;
        public Logger Logger { get; set; }

        /// <summary>
        /// 현재 상태값 및 상태변화 체크용
        /// </summary>
        //private Dictionary<string, GasData> m_dicGasDatas = new Dictionary<string, GasData>();
        //private Dictionary<string, GasSensorData> m_dicGasSensors = null;

        //private string m_strSOPWebServerURL = null;

        private List<GasHProvider> m_providersH = new List<GasHProvider>();
        private List<GasAProvider> m_providersA = new List<GasAProvider>();
        private List<GasCProvider> m_providersC = new List<GasCProvider>();


        private List<GasVProvider> m_providersV = new List<GasVProvider>();
        private List<GasSProvider> m_providersS = new List<GasSProvider>();

        public GasManager(DBDataManager dbDataManager)
        {
            m_dbDataManager = dbDataManager;
            m_sopQueryMgr = new SopQueryManager();

            Init();

            this.Logger = Logger.Instance.Clone("LOG_Gas");
        }

        private void Init()
        {
            string strSOPWebServerURL = ConfigurationManager.AppSettings.Get("SOPWebServerURL");
            if (strSOPWebServerURL == null || strSOPWebServerURL.Length == 0)
                strSOPWebServerURL = "http://127.0.0.1:44379/api/PSMSensor";

            //m_strSOPWebServerURL = strSOPWebServerURL;

            string strH_Device_IP = ConfigurationManager.AppSettings.Get("H_Device_IP");
            if (strH_Device_IP == null || strH_Device_IP.Length == 0)
                strH_Device_IP = "10.0.21.105";

            string strA_Device1_IP = ConfigurationManager.AppSettings.Get("A_Device1_IP");
            if (strA_Device1_IP == null || strA_Device1_IP.Length == 0)
                strA_Device1_IP = "10.0.21.102";
            string strA_Device2_IP = ConfigurationManager.AppSettings.Get("A_Device2_IP");
            if (strA_Device2_IP == null || strA_Device2_IP.Length == 0)
                strA_Device2_IP = "10.0.21.103";


            string strC_Device1_IP = ConfigurationManager.AppSettings.Get("C_Device1_IP");
            if (strC_Device1_IP == null || strC_Device1_IP.Length == 0)
                strC_Device1_IP = "10.0.21.109";
            string strC_Device2_IP = ConfigurationManager.AppSettings.Get("C_Device2_IP");
            if (strC_Device2_IP == null || strC_Device2_IP.Length == 0)
                strC_Device2_IP = "10.0.21.110";
            string strC_Device3_IP = ConfigurationManager.AppSettings.Get("C_Device3_IP");
            if (strC_Device3_IP == null || strC_Device3_IP.Length == 0)
                strC_Device3_IP = "10.0.21.111";


            string strV_Device1_IP = ConfigurationManager.AppSettings.Get("V_Device1_IP");
            if (strV_Device1_IP == null || strV_Device1_IP.Length == 0)
                strV_Device1_IP = "10.2.20.25";
            string strV_Device2_IP = ConfigurationManager.AppSettings.Get("V_Device2_IP");
            if (strV_Device2_IP == null || strV_Device2_IP.Length == 0)
                strV_Device2_IP = "10.2.20.26";
            string strV_Device3_IP = ConfigurationManager.AppSettings.Get("V_Device3_IP");
            if (strV_Device3_IP == null || strV_Device3_IP.Length == 0)
                strV_Device3_IP = "10.2.20.27";
            string strV_Device4_IP = ConfigurationManager.AppSettings.Get("V_Device4_IP");
            if (strV_Device4_IP == null || strV_Device4_IP.Length == 0)
                strV_Device4_IP = "10.2.20.28";
            string strV_Device5_IP = ConfigurationManager.AppSettings.Get("V_Device5_IP");
            if (strV_Device5_IP == null || strV_Device5_IP.Length == 0)
                strV_Device5_IP = "10.2.20.29";


            string strS_Device1_IP = ConfigurationManager.AppSettings.Get("S_Device1_IP");
            if (strS_Device1_IP == null || strS_Device1_IP.Length == 0)
                strS_Device1_IP = "10.6.30.23";
            string strS_Device2_IP = ConfigurationManager.AppSettings.Get("S_Device2_IP");
            if (strS_Device2_IP == null || strS_Device2_IP.Length == 0)
                strS_Device2_IP = "10.6.30.25";
            string strS_Device3_IP = ConfigurationManager.AppSettings.Get("S_Device3_IP");
            if (strS_Device3_IP == null || strS_Device3_IP.Length == 0)
                strS_Device3_IP = "10.6.30.27";
            string strS_Device4_IP = ConfigurationManager.AppSettings.Get("S_Device4_IP");
            if (strS_Device4_IP == null || strS_Device4_IP.Length == 0)
                strS_Device4_IP = "10.6.30.29";
            string strS_Device5_IP = ConfigurationManager.AppSettings.Get("S_Device5_IP");
            if (strS_Device5_IP == null || strS_Device5_IP.Length == 0)
                strS_Device5_IP = "10.6.30.31";
            string strS_Device6_IP = ConfigurationManager.AppSettings.Get("S_Device6_IP");
            if (strS_Device6_IP == null || strS_Device6_IP.Length == 0)
                strS_Device6_IP = "10.6.30.42";
            string strS_Device7_IP = ConfigurationManager.AppSettings.Get("S_Device7_IP");
            if (strS_Device7_IP == null || strS_Device7_IP.Length == 0)
                strS_Device7_IP = "10.6.30.40";
            string strS_Device8_IP = ConfigurationManager.AppSettings.Get("S_Device8_IP");
            if (strS_Device8_IP == null || strS_Device8_IP.Length == 0)
                strS_Device8_IP = "10.6.30.41";
            string strS_Device9_IP = ConfigurationManager.AppSettings.Get("S_Device9_IP");
            if (strS_Device9_IP == null || strS_Device9_IP.Length == 0)
                strS_Device9_IP = "10.6.30.43";



            Dictionary<string, GasSensorData> dicGasSensors = m_dbDataManager.LoadPSMSensors(out string strErrorMessage);
            if (dicGasSensors == null)
            {
                this.Logger.Write("Init Error: " + strErrorMessage);
            }

            int nPort = 502;




            GasAProvider providerA = new GasAProvider(this, GasAProvider.Types.Device1, strA_Device1_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersA.Add(providerA);
            providerA = new GasAProvider(this, GasAProvider.Types.Device2, strA_Device2_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersA.Add(providerA);

            GasCProvider providerC = new GasCProvider(this, GasCProvider.Types.Device1, strC_Device1_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersC.Add(providerC);
            providerC = new GasCProvider(this, GasCProvider.Types.Device2, strC_Device2_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersC.Add(providerC);
            providerC = new GasCProvider(this, GasCProvider.Types.Device3, strC_Device3_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersC.Add(providerC);



            GasHProvider provider = new GasHProvider(this, strH_Device_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersH.Add(provider);

            GasVProvider providerV = new GasVProvider(this, GasVProvider.Types.Device1, strV_Device1_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersV.Add(providerV);
            providerV = new GasVProvider(this, GasVProvider.Types.Device2, strV_Device2_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersV.Add(providerV);
            providerV = new GasVProvider(this, GasVProvider.Types.Device3, strV_Device3_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersV.Add(providerV);
            providerV = new GasVProvider(this, GasVProvider.Types.Device4, strV_Device4_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersV.Add(providerV);
            providerV = new GasVProvider(this, GasVProvider.Types.Device5, strV_Device5_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersV.Add(providerV);




            GasSProvider providerS = new GasSProvider(this, GasSProvider.Types.Device1, strS_Device1_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device2, strS_Device2_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device3, strS_Device3_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device4, strS_Device4_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device5, strS_Device5_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device6, strS_Device6_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device7, strS_Device7_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device8, strS_Device8_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);
            providerS = new GasSProvider(this, GasSProvider.Types.Device9, strS_Device9_IP, nPort, m_dbDataManager, m_sopQueryMgr, dicGasSensors, strSOPWebServerURL);
            m_providersS.Add(providerS);

        }

        public void Start()
        {
            if (m_providersA == null || m_providersA.Count == 0 ||
                m_providersC == null || m_providersC.Count == 0 ||
                m_providersH == null || m_providersH.Count == 0 ||
                m_providersV == null || m_providersV.Count == 0 ||
                m_providersS == null || m_providersS.Count == 0)
                return;


            foreach (GasAProvider provider in m_providersA)
            {
                provider.Start();
                System.Threading.Thread.Sleep(200);
            }
            foreach (GasCProvider provider in m_providersC)
            {
                provider.Start();
                System.Threading.Thread.Sleep(200);
            }


            foreach (GasHProvider provider in m_providersH)
            {
                provider.Start();
                System.Threading.Thread.Sleep(200);
            }
            foreach (GasVProvider provider in m_providersV)
            {
                provider.Start();
                System.Threading.Thread.Sleep(200);
            }


            foreach (GasSProvider provider in m_providersS)
            {
                provider.Start();
                System.Threading.Thread.Sleep(200);
            }
        }

        public void Stop()
        {
            if (m_providersA == null || m_providersA.Count == 0 ||
                m_providersC == null || m_providersC.Count == 0 ||
                m_providersH == null || m_providersH.Count == 0 ||
                m_providersV == null || m_providersV.Count == 0 ||
                m_providersS == null || m_providersS.Count == 0)
                return;


            foreach (GasAProvider provider in m_providersA)
            {
                provider.Stop();
            }
            foreach (GasCProvider provider in m_providersC)
            {
                provider.Stop();
            }


            foreach (GasHProvider provider in m_providersH)
            {
                provider.Stop();
            }
            foreach (GasVProvider provider in m_providersV)
            {
                provider.Stop();
            }


            foreach (GasSProvider provider in m_providersS)
            {
                provider.Stop();
            }
        }

        //public bool CheckGasAlarm(Dictionary<string, GasData> dicGasDatas, out string strErrorMessage)
        //{
        //    strErrorMessage = "";

        //    if (dicGasDatas == null || dicGasDatas.Count == 0)
        //    {
        //        strErrorMessage = "체크할 데이터가 존재하지 않습니다.";
        //        return false;
        //    }

        //    GasData chkData = new GasData();    // 체크용

        //    foreach (KeyValuePair<string, GasData> pair in dicGasDatas)
        //    {
        //        string strSensorName = pair.Key;
        //        GasData currentData = pair.Value;    // 현재값

        //        GasSensorData gasSensor = null;
        //        if (m_dicGasSensors.ContainsKey(strSensorName + "_" + currentData.Type))
        //            gasSensor = m_dicGasSensors[strSensorName + "_" + currentData.Type];

        //        GasSensorData faultSensor = null;
        //        if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Fault))
        //            faultSensor = m_dicGasSensors[strSensorName + "_" + ID.Fault];

        //        GasSensorData pressSensor = null;
        //        if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Press))
        //            pressSensor = m_dicGasSensors[strSensorName + "_" + ID.Press];

        //        GasSensorData flameSensor = null;
        //        if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Flame))
        //            flameSensor = m_dicGasSensors[strSensorName + "_" + ID.Flame];

        //        GasSensorData statusSensor = null;
        //        if (m_dicGasSensors.ContainsKey(strSensorName + "_" + ID.Status))
        //            statusSensor = m_dicGasSensors[strSensorName + "_" + ID.Status];



        //        bool bIsAlarm = true;
        //        int nAlarmLevel = 2;
        //        int nSensorType = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;

        //        ArrayList arrData = null;

        //        if (m_dicGasDatas.ContainsKey(strSensorName))
        //        {
        //            GasData gasData = m_dicGasDatas[strSensorName];    // 기존값                    

        //            // 물질 알람
        //            if (gasSensor != null)
        //            {
        //                arrData = null;

        //                if (gasData.LoLowAlarm == false && gasData.HiHighAlarm == false && (currentData.HiHighAlarm == true || currentData.LoLowAlarm == true))
        //                {   // 2단계 발생 또는 격상

        //                    nAlarmLevel = 3;

        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(gasSensor.TagInfoID);
        //                    arrData.Add(gasSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }
        //                else if ((gasData.LoLowAlarm == false && gasData.HiHighAlarm == false && gasData.LoAlarm == false && gasData.HiAlarm == false &&
        //                    (currentData.LoAlarm == true || currentData.HiAlarm == true))
        //                    ||
        //                    ((gasData.HiHighAlarm == true || gasData.LoLowAlarm == true) &&
        //                    (currentData.HiHighAlarm == false && currentData.LoLowAlarm == false && (currentData.LoAlarm == true || currentData.HiAlarm == true))))
        //                {   // 1단계 발생
        //                    // 1단계로 하향
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(gasSensor.TagInfoID);
        //                    arrData.Add(gasSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);

        //                }
        //                else if ((gasData.LoLowAlarm == true || gasData.HiHighAlarm == true || gasData.LoAlarm == true || gasData.HiAlarm == true) &&
        //                    (currentData.LoLowAlarm == false && currentData.HiHighAlarm == false && currentData.LoAlarm == false && currentData.HiAlarm == false))
        //                {   // 알람 해제
        //                    bIsAlarm = false;

        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(gasSensor.TagInfoID);
        //                    arrData.Add(gasSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {gasSensor.SensorName} {currentData.Type} (UniqueKey: {gasSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"1. SendAlarmQuery 실패 (Name: {gasSensor.SensorName}, Type: {currentData.Type}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {gasSensor.TagInfoID}, SensorZoneID: {gasSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }





        //            // 고장 알람
        //            if (faultSensor != null)
        //            {
        //                arrData = null;
        //                bIsAlarm = true;
        //                nAlarmLevel = 2;

        //                if (gasData.FaultAlarm == false && currentData.FaultAlarm == true)
        //                {   // 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(faultSensor.TagInfoID);
        //                    arrData.Add(faultSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }
        //                else if (gasData.FaultAlarm == true && currentData.FaultAlarm == false)
        //                {   // 해제
        //                    bIsAlarm = false;

        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(faultSensor.TagInfoID);
        //                    arrData.Add(faultSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {faultSensor.SensorName} (UniqueKey: {faultSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"2. SendAlarmQuery 실패 (Name: {faultSensor.SensorName}, Type: 고장, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {faultSensor.TagInfoID}, SensorZoneID: {faultSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }






        //            // 압력 알람
        //            if (pressSensor != null)
        //            {
        //                arrData = null;
        //                bIsAlarm = true;
        //                nAlarmLevel = 2;

        //                if ((gasData.PressHiAlarm == false && gasData.PressLoAlarm == false) && (currentData.PressHiAlarm == true || currentData.PressLoAlarm == true))
        //                {   // 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(pressSensor.TagInfoID);
        //                    arrData.Add(pressSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }
        //                else if ((gasData.PressHiAlarm == true || gasData.PressLoAlarm == true) && (currentData.PressHiAlarm == false || currentData.PressLoAlarm == false))
        //                {   // 해제
        //                    bIsAlarm = false;

        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(pressSensor.TagInfoID);
        //                    arrData.Add(pressSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {pressSensor.SensorName} (UniqueKey: {pressSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"3. SendAlarmQuery 실패 (Name: {pressSensor.SensorName}, Type: 압력, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {pressSensor.TagInfoID}, SensorZoneID: {pressSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }






        //            // 불꽃 알람
        //            if (flameSensor != null)
        //            {
        //                arrData = null;
        //                bIsAlarm = true;
        //                nAlarmLevel = 2;

        //                if (gasData.FireAlarm == false && currentData.FireAlarm == true)
        //                {   // 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(flameSensor.TagInfoID);
        //                    arrData.Add(flameSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }
        //                else if (gasData.FireAlarm == true && currentData.FireAlarm == false)
        //                {   // 해제
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(flameSensor.TagInfoID);
        //                    arrData.Add(flameSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {flameSensor.SensorName} (UniqueKey: {flameSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"4. SendAlarmQuery 실패 (Name: {flameSensor.SensorName}, Type: 불꽃, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {flameSensor.TagInfoID}, SensorZoneID: {flameSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }






        //            // 가동중지 알람
        //            if (statusSensor != null)
        //            {
        //                arrData = null;
        //                bIsAlarm = true;
        //                nAlarmLevel = 2;

        //                if (gasData.Status == true && currentData.Status == false)
        //                { // 알람 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(statusSensor.TagInfoID);
        //                    arrData.Add(statusSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }
        //                else if (gasData.Status == false && currentData.Status == true)
        //                { // 알람 해제
        //                    bIsAlarm = false;

        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(statusSensor.TagInfoID);
        //                    arrData.Add(statusSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {statusSensor.SensorName} (UniqueKey: {statusSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"5. SendAlarmQuery 실패 (Name: {statusSensor.SensorName}, Type: 동작중지, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {statusSensor.TagInfoID}, SensorZoneID: {statusSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }

        //        }
        //        else
        //        {
        //            bIsAlarm = true;

        //            if (gasSensor != null)
        //            {   // 물질 알람
        //                arrData = null;
        //                nAlarmLevel = 2;

        //                if (currentData.HiHighAlarm == true || currentData.LoLowAlarm == true)
        //                {   // 2단계 발생
        //                    nAlarmLevel = 3;

        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(gasSensor.TagInfoID);
        //                    arrData.Add(gasSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);

        //                }
        //                else if (currentData.LoAlarm == true || currentData.HiAlarm == true)
        //                {   // 1단계 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(gasSensor.TagInfoID);
        //                    arrData.Add(gasSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {gasSensor.SensorName} {currentData.Type} (UniqueKey: {gasSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"6. SendAlarmQuery 실패 (Name: {gasSensor.SensorName}, Type: {currentData.Type}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {gasSensor.TagInfoID}, SensorZoneID: {gasSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }



        //            if (faultSensor != null)
        //            { // 고장 알람
        //                arrData = null;
        //                nAlarmLevel = 2;

        //                if (currentData.FaultAlarm == true)
        //                {   // 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(faultSensor.TagInfoID);
        //                    arrData.Add(faultSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {faultSensor.SensorName} (UniqueKey: {faultSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"7. SendAlarmQuery 실패 (Name: {faultSensor.SensorName}, Type: 고장, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {faultSensor.TagInfoID}, SensorZoneID: {faultSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }


        //            // 압력 알람
        //            if (pressSensor != null)
        //            {
        //                arrData = null;
        //                nAlarmLevel = 2;

        //                if (currentData.PressHiAlarm == true || currentData.PressLoAlarm == true)
        //                {   // 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(pressSensor.TagInfoID);
        //                    arrData.Add(pressSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {pressSensor.SensorName} (UniqueKey: {pressSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"8. SendAlarmQuery 실패 (Name: {pressSensor.SensorName}, Type: 압력, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {pressSensor.TagInfoID}, SensorZoneID: {pressSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }


        //            // 불꽃 알람
        //            if (flameSensor != null)
        //            {
        //                arrData = null;
        //                nAlarmLevel = 2;

        //                if (currentData.FireAlarm == true)
        //                {   // 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(flameSensor.TagInfoID);
        //                    arrData.Add(flameSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {flameSensor.SensorName} (UniqueKey: {flameSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"9. SendAlarmQuery 실패 (Name: {flameSensor.SensorName}, Type: 불꽃, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {flameSensor.TagInfoID}, SensorZoneID: {flameSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }


        //            // 가동중지 알람
        //            if (statusSensor != null)
        //            {
        //                arrData = null;
        //                nAlarmLevel = 2;

        //                if (currentData.Status == false)
        //                { // 알람 발생
        //                    arrData = new ArrayList();
        //                    arrData.Add(nSensorType);
        //                    arrData.Add(statusSensor.TagInfoID);
        //                    arrData.Add(statusSensor.SensorZoneID);
        //                    arrData.Add(bIsAlarm);
        //                    arrData.Add(nAlarmLevel);
        //                }

        //                if (arrData != null)
        //                {   // 알람 발생 및 해제 신호
        //                    this.Logger.Write($"SendAlarm 알람: {bIsAlarm} {nAlarmLevel} {statusSensor.SensorName} (UniqueKey: {statusSensor.UniqueKey})");

        //                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strSOPWebServerURL) == false)
        //                    {
        //                        strErrorMessage = $"10. SendAlarmQuery 실패 (Name: {statusSensor.SensorName}, Type: 동작중지, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {statusSensor.TagInfoID}, SensorZoneID: {statusSensor.SensorZoneID})";
        //                        return false;
        //                    }
        //                }
        //            }

        //        }

        //        m_dicGasDatas[strSensorName] = currentData;
        //    }

        //    return true;
        //}

        //public bool UpdateSensorData(Dictionary<string, GasData> dicGasDatas, out string strErrorMessage)
        //{
        //    return m_dbDataManager.UpdateSensorData(dicGasDatas, out strErrorMessage);
        //}
    }
}
