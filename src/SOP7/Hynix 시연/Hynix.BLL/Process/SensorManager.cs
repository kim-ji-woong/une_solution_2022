using System;
using System.Collections.Generic;
using Hynix.IDAL;
using SDMS.BLL.Models.Response;
using Hynix.Model;

namespace Hynix.BLL.Process
{
    using Response;

    class SensorManager
    {
        private IDataManager m_dataManager = null;

        public SensorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSensorListEx ToResponseSensorListEx(ResponseSensorList data)
        {
            ResponseSensorListEx response = new ResponseSensorListEx(data.Success, data.Message);

            if (data.Success == false)
                return response;

            if (data.FireSensors != null)
                response.FireSensors.AddRange(data.FireSensors);

            if (data.PSMSensors != null)
                response.PSMSensors.AddRange(data.PSMSensors);

            if (data.EtcSensors != null)
                response.EtcSensors.AddRange(data.EtcSensors);

            if (data.Cctvs != null)
                response.Cctvs.AddRange(data.Cctvs);

            if (data.EarthquakeSensors != null)
                response.EarthquakeSensors.AddRange(data.EarthquakeSensors);

            if (data.StrongWindSensors != null)
                response.StrongWindSensors.AddRange(data.StrongWindSensors);

            if (data.EnvironmentSensors != null)
                response.EnvironmentSensors.AddRange(data.EnvironmentSensors);

            if (data.ManufactureSensors != null)
                response.ManufactureSensors.AddRange(data.ManufactureSensors);

            if (data.EmergencyBellSensors != null)
                response.EmergencyBellSensors.AddRange(data.EmergencyBellSensors);

            if (data.LaserSensors != null)
                response.LaserSensors.AddRange(data.LaserSensors);

            string strErrorMessage;

            List<Door> doors = ReadDoors(out strErrorMessage);

            if (doors == null)
                return new ResponseSensorListEx(false, strErrorMessage);

            List<CardReader> cardReaders = ReadCardReaders(out strErrorMessage);

            if (cardReaders == null)
                return new ResponseSensorListEx(false, strErrorMessage);

            List<SmartTagReader> smartTagReaders = ReadSmartTagReaders(out strErrorMessage);

            if (smartTagReaders == null)
                return new ResponseSensorListEx(false, strErrorMessage);

            response.Doors.AddRange(doors);
            response.CardReaders.AddRange(cardReaders);
            response.SmartTagReaders.AddRange(smartTagReaders);
            response.TotalCount = data.TotalCount + doors.Count + cardReaders.Count + smartTagReaders.Count;

            return response;
        }

        private List<Door> ReadDoors(out string strErrorMessage)
        {
            return m_dataManager.GetSelectManager().SelectHynixDoors(null, null, out strErrorMessage);
        }

        private List<CardReader> ReadCardReaders(out string strErrorMessage)
        {
            return m_dataManager.GetSelectManager().SelectHynixCardReaders(null, null, out strErrorMessage);
        }

        private List<SmartTagReader> ReadSmartTagReaders(out string strErrorMessage)
        {
            return m_dataManager.GetSelectManager().SelectHynixSmartTagReaders(null, null, out strErrorMessage);
        }
    }
}
