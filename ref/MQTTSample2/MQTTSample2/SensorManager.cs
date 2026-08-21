using System.Configuration;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Windows.Forms;

namespace MQTTSample2
{
    class SensorManager
    {
        private DataManager m_dataManager = null;
        Dictionary<string, List<string>> m_dicSensors = null;

        public SensorManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public bool ReadData(ComboBox cboFloor)
        {
            string strSiteID = ConfigurationManager.AppSettings.Get("SiteID");

            string strErrorMessage;
            string strSQL = "Select b.ID id, a.Name sensorName, c.TagNo tagNo, d.ID zoneID, d.ZoneName zoneName from SdmsSensorFire a, SdmsSensorZone b, SdmsSensorTagInfo c, SdmsSpatialZone d where a.SiteID = " + strSiteID + " and a.ID = b.OrgSensorID and b.SensorType = 0 and b.ID = c.SensorZoneID and d.ID = a.ZoneID";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
            {
                MessageBox.Show(strErrorMessage);
                return false;
            }

            Dictionary<string, List<string>> dicSensors = new Dictionary<string, List<string>>();
            Dictionary<int, string> dicZoneNames = new Dictionary<int, string>();

            foreach (var item in results)
            {
                int id = item.id;
                string strSensorName = item.sensorName;
                int? tagNo = item.tagNo;
                int zoneID = item.zoneID;
                string strZoneName = item.zoneName;

                if (tagNo == null)
                    continue;

                string strSensorInfo = string.Format("{0}\t{1}\t{2}", id, strSensorName, (int)tagNo);
                List<string> sensors;

                if (dicSensors.TryGetValue(strZoneName, out sensors) == false)
                {
                    sensors = new List<string>();
                    dicSensors[strZoneName] = sensors;

                    dicZoneNames[zoneID] = strZoneName;
                }

                sensors.Add(strSensorInfo);
            }

            cboFloor.Items.Clear();

            foreach (KeyValuePair<int, string> pair in dicZoneNames)
            {
                cboFloor.Items.Add(pair.Value);
            }

            m_dicSensors = dicSensors;

            if (m_dicSensors.Count > 0)
                cboFloor.SelectedIndex = 0;

            return true;
        }

        public void SetGrid(string strFloor, DataGridView gridSensors)
        {
            gridSensors.Rows.Clear();

            List<string> sensors;

            if (m_dicSensors.TryGetValue(strFloor, out sensors))
            {
                foreach (string strSensorInfo in sensors)
                {
                    string[] tokens = strSensorInfo.Split('\t');

                    if (tokens.Length < 3)
                        continue;

                    string strSensorID = tokens[0].Trim();
                    string strSensorName = tokens[1].Trim();
                    string strSensorTagNo = tokens[2].Trim();

                    int rowIndex = gridSensors.Rows.Add();

                    if (rowIndex < 0)
                        continue;

                    DataGridViewRow row = gridSensors.Rows[rowIndex];

                    row.Cells[0].Value = strSensorID;
                    row.Cells[1].Value = strSensorName;
                    row.Cells[2].Value = strSensorTagNo;
                }
            }
        }
    }
}
