using dnsCommunicateSopServer;
using dnsData.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace IntegrationServer.Servers
{
    /// <summary>
    /// SOPWebServer 통신
    /// </summary>
    public class SopServerManager
    {        
        //private SopQueryManager m_sopQueryManager = null;

        private static SopServerManager m_instance = null;
        public static SopServerManager Instance
        {
            get { return m_instance; }
        }

        public SopServerManager(/*string strSOPWebServerURL*/)
        {
            m_instance = this;

            //m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);
        }

        public bool SendSensorData(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, bool bIsAlarm)
        {
            if (sopQueryManager == null)
                return false;

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(nSensorType);
            arrDatas.Add(nTagID); 
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(bIsAlarm);

            bool result = sopQueryManager.SendAlarmQuery(arrDatas, "POST"); 
            return result;
        }

        public bool SendSensorData(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, bool bIsAlarm, int nAlarmLevel)
        {
            if (sopQueryManager == null)
                return false;

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(nSensorType);
            arrDatas.Add(nTagID);
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(bIsAlarm);
            arrDatas.Add(nAlarmLevel);

            bool result = sopQueryManager.SendAlarmQuery(arrDatas, "POST");
            return result;
        }

        public void SendSensorDataAsync(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, bool bIsAlarm)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(sopQueryManager);
            arrDatas.Add(nTagID);
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(bIsAlarm);
            arrDatas.Add(nSensorType);

            Thread t = new Thread(new ParameterizedThreadStart(SendSensorDataThread));
            t.Start(arrDatas);
        }

        private void SendSensorDataThread(object param)
        {
            ArrayList arrDatas = (ArrayList)param;
            SopQueryManager sopQueryManager = (SopQueryManager)arrDatas[0];
            int nTagID = (int)arrDatas[1];
            int nSensorZoneID = (int)arrDatas[2];
            bool bIsAlarm = (bool)arrDatas[3];
            int nSensorType = (int)arrDatas[4];

            if (sopQueryManager == null)
                return;

            SendSensorData(sopQueryManager, nSensorType, nTagID, nSensorZoneID, bIsAlarm);
        }


        /// <summary>
        /// 알람해제
        /// </summary>
        /// <param name="sopQueryManager"></param>
        /// <param name="nSensorType"></param>
        /// <param name="nTagID"></param>
        /// <param name="nSensorZoneID"></param>
        /// <param name="nClearType">1:오작동,2:사용자복구,3:timeout</param>
        /// <returns></returns>
        public bool SendClearAlarm(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, int nClearType)
        {
            if (sopQueryManager == null)
                return false;

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(nSensorType);
            arrDatas.Add(nTagID);
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(false);

            bool result = false;
            if (nClearType == 1)
                result = sopQueryManager.SendAlarmMalfunctionQuery(true, arrDatas, "POST");
            else if (nClearType == 2)
                result = sopQueryManager.SendAlarmUserResetQuery(true, arrDatas, "POST");
            else if (nClearType == 3)
                result = sopQueryManager.SendAlarmTimeoutQuery(arrDatas, "POST");
            return result;
        }

        public void SendClearAlarmAsync(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, int nClearType)
        {
            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(sopQueryManager);
            arrDatas.Add(nTagID);
            arrDatas.Add(nSensorZoneID);            
            arrDatas.Add(nSensorType);
            arrDatas.Add(nClearType);

            Thread t = new Thread(new ParameterizedThreadStart(SendClearAlarmThread));
            t.Start(arrDatas);
        }

        private void SendClearAlarmThread(object param)
        {
            ArrayList arrDatas = (ArrayList)param;
            SopQueryManager sopQueryManager = (SopQueryManager)arrDatas[0];
            int nTagID = (int)arrDatas[1];
            int nSensorZoneID = (int)arrDatas[2];
            int nSensorType = (int)arrDatas[3];
            int nClearType = (int)arrDatas[4];
            
            if (sopQueryManager == null)
                return;

            SendClearAlarm(sopQueryManager, nSensorType, nTagID, nSensorZoneID, nClearType);
        }

        public bool SendClearPsmAlarm(SopQueryManager sopQueryManager, int nSensorZoneID)
        {
            if (sopQueryManager == null)
                return false;

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(-1); // AccountUserID

            bool result = sopQueryManager.SendPsmAlarmTimeout(arrDatas, "POST");
            return result;
        }



        public bool SendAllClear(SopQueryManager sopQueryManager, int? nSiteID = null)
        {
            if (sopQueryManager == null)
                return false;

            return sopQueryManager.SendAllClearQuery("POST", nSiteID);
        }

        public void SendAllClearAsync(SopQueryManager sopQueryManager)
        {
            Thread t = new Thread(new ParameterizedThreadStart(SendAllClearThread));
            t.Start(sopQueryManager);
        }

        private void SendAllClearThread(object sopQueryManager)
        {
            if (sopQueryManager is SopQueryManager)
                SendAllClear((SopQueryManager)sopQueryManager);
        }
    }
}
