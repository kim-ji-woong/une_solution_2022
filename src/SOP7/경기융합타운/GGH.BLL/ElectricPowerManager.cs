using SDMS.IDAL;
using System.Collections.Generic;
using SDMS.Model.Sensor;
using dnsData.Sensor;

namespace GGH.BLL
{
    using Models.Response;

    public class ElectricPowerManager
    {
        private IDataManager m_dataManager = null;

        public ElectricPowerManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseUpsStatus GetUpsStatus(int siteID)
        {
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.MaterialType] = (int)Facility.FacilityType.LowBattery;
            dicConditions[ETC.Fields.SiteID] = siteID;

            string strErrorMessage;
            List<ETC> sensors = m_dataManager.GetSelectManager().SelectETCSensors(dicConditions, null, out strErrorMessage);

            if (sensors == null)
                return new ResponseUpsStatus(false, strErrorMessage);

            ResponseUpsStatus response = new ResponseUpsStatus(true, "");
            response.SiteID = siteID;

            foreach (ETC sensor in sensors)
            {
                Ups ups = new Ups();

                ups.ID = sensor.ID;
                ups.CurrentData = ToDouble(sensor.CurrentData);
                ups.Name = sensor.Name;

                response.UpsList.Add(ups);
            }

            return response;
        }

        private double? ToDouble(string strData)
        {
            if (strData == null)
                return null;

            double data;

            if (double.TryParse(strData.Trim(), out data))
                return data;

            return null;
        }
    }
}
