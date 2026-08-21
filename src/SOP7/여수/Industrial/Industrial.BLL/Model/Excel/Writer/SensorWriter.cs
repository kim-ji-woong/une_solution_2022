using Common.IDAL;
using Industrial.BLL.Model.Sensors;
using SDMS.Model.Spatial;
using SensorServer.Model.Yeosu;
using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Excel.Writer
{
    public class SensorWriter : ExcelWriter
    {
        public enum SensorType { None, Atmosphere, Water, Weather, VOC, OU};

        public SensorWriter(SensorServer.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager) 
            : base(dataManager, sdmsDataManager)
        {

        }


        protected override string GetSubject()
        {
            return "센서 정보";
        }

        protected override SheetData ReadSheetDatas(out string strErrorMessage)
        {
            if (m_dataManager == null)
            {
                strErrorMessage = "DB에 연결할 수 없습니다. - Industrial";
                return null;
            }

            string strCondition = "order by ID";

            List<SensorServer.Model.Yeosu.EtcSensorData> sensors = m_dataManager.GetSelectManager().SelectEtcSensorDatas(null, null, out strErrorMessage);
            List<SDMS.Model.Spatial.Zone> zones = m_sdmsDataManager.GetSelectManager().SelectZones(null, strCondition, out strErrorMessage);

            if (sensors.Count != zones.Count)
            {
                strErrorMessage = "잘못된 센서 테이블 정보입니다. 관리자에게 문의해주세요.";
            }

            if (sensors == null || sensors.Count == 0)
                return null;

            SheetData sheetData = new SheetData("data");

            // Column Name
            string sensorName = "센서명";
            string sensorPosition = "위치";
            string sensorCategory = "센서종류";
            string latitude = "위도";
            string longitude = "경도";

            sheetData.Titles[0] = sensorName; // Sdms
            sheetData.Titles[1] = sensorPosition;
            sheetData.Titles[2] = sensorCategory;
            sheetData.Titles[3] = latitude;
            sheetData.Titles[4] = longitude;

            List<string> nameList = new List<string>();
            List<string> positionList = new List<string>();
            List<string> categoryList = new List<string>();
            List<string> latitudeList = new List<string>();
            List<string> longitudeList = new List<string>();

            foreach(Zone zone in zones)
            {
                nameList.Add(zone.ZoneName);
            }

            foreach(EtcSensorData sensor in sensors)
            {
                positionList.Add(sensor.PositionName);
                categoryList.Add(Enum.GetName(typeof(SensorType) , sensor.SensorType));
                latitudeList.Add((sensor.Latitude).ToString());
                longitudeList.Add((sensor.Longitude).ToString());
            }

            sheetData.ColumnDatas[0] = nameList;
            sheetData.ColumnDatas[1] = positionList;
            sheetData.ColumnDatas[2] = categoryList;
            sheetData.ColumnDatas[3] = latitudeList;
            sheetData.ColumnDatas[4] = longitudeList;

            return sheetData;
        }
    }
}
