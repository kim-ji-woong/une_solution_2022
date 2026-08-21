using System;
using System.Net.Http;
using System.Text;
using System.Windows.Forms;

namespace FireSignalTester
{
    /// <summary>
    /// 2026-08-03 13:16:35에 발생했던 화재 알람 신호를 SOPWebServer로 재전송하는 테스트 도구.
    ///
    /// 원본 신호 (IntegrationServer 로그 D:\20260803.log)
    ///   [Fire_Johnson] Receiver(1), RealyTeam(2), Loop(1), RelayID(48), Tag(1), On(True), Type : 6
    ///   → TagNo = 3*100000000 + 1*10000000 + 2*100000 + 1*10000 + 48*10 + 1 = 310210481
    ///   → SdmsSensorTagInfo.ID 1159 (C4-1F 1-31(가공,상,중) 발신기, EquipZone 599, SiteID 32)
    ///
    /// SOPWebServer 수신 로그
    ///   [2026-08-03 13:16:35] FireSensor ProcessSensorData 수신
    ///       (SensorType: 0, SensorTagID: 1159, SensorZoneID: 1159, SensorData: 1)
    /// </summary>
    public partial class FormMain : Form
    {
        // dnsSopID.Header.SENSOR_DATA = 100 (실제 화재신호)
        // 테스트 신호(SENSOR_DATA_TEST)는 101이며 서버에서 isReal=false로 처리되어
        // DetectionStatus가 Test(3)로 기록되는 등 실제 신호와 처리 경로가 다르다.
        private const int HEADER_SENSOR_DATA = 100;

        // dnsSopID.DATA_TYPE.INT = 1
        private const int DATA_TYPE_INT = 1;

        private const int SENSOR_TYPE = 0;      // Facility.FacilityType.FIRE_SENSOR
        private const int SENSOR_TAG_ID = 1159; // SdmsSensorTagInfo.ID
        private const int SENSOR_ZONE_ID = 1159; // SdmsSensorZone.ID
        private const int SENSOR_DATA = 1;      // 1: 알람 발생, 0: 알람 해제

        private static readonly HttpClient m_httpClient = new HttpClient();

        public FormMain()
        {
            InitializeComponent();

            m_httpClient.Timeout = TimeSpan.FromSeconds(120);

            lblSignal.Text =
                "Header        : " + HEADER_SENSOR_DATA + "  (SENSOR_DATA / 실제 화재신호)" + Environment.NewLine +
                "SensorType    : " + SENSOR_TYPE + "  (FIRE_SENSOR)" + Environment.NewLine +
                "SensorTagID   : " + SENSOR_TAG_ID + Environment.NewLine +
                "SensorZoneID  : " + SENSOR_ZONE_ID + "  (C4-1F 1-31(가공,상,중) 발신기 / EquipZone 599 / SiteID 32)" + Environment.NewLine +
                "SensorData    : " + SENSOR_DATA + "  (알람 발생)";
        }

        private string BuildJson()
        {
            // { "Header":100, "ClientInfo":"", "Values":["1,0","1,1159","1,1159","1,1"] }
            StringBuilder sb = new StringBuilder();

            sb.Append("{\"Header\":").Append(HEADER_SENSOR_DATA);
            sb.Append(",\"ClientInfo\":\"\"");
            sb.Append(",\"Values\":[");
            sb.AppendFormat("\"{0},{1}\",", DATA_TYPE_INT, SENSOR_TYPE);
            sb.AppendFormat("\"{0},{1}\",", DATA_TYPE_INT, SENSOR_TAG_ID);
            sb.AppendFormat("\"{0},{1}\",", DATA_TYPE_INT, SENSOR_ZONE_ID);
            sb.AppendFormat("\"{0},{1}\"", DATA_TYPE_INT, SENSOR_DATA);
            sb.Append("]}");

            return sb.ToString();
        }

        private void WriteLog(string strLog)
        {
            txtLog.AppendText("[" + DateTime.Now.ToString("HH:mm:ss") + "] " + strLog + Environment.NewLine);
        }

        private async void btnSend_Click(object sender, EventArgs e)
        {
            string strUrl = txtUrl.Text.Trim();

            if (strUrl.Length == 0)
            {
                MessageBox.Show(this, "API URL을 입력하세요.", "화재 신호 테스터",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtUrl.Focus();
                return;
            }

            string strJson = BuildJson();

            btnSend.Enabled = false;

            try
            {
                WriteLog("전송 → " + strUrl);
                WriteLog("      " + strJson);

                using (StringContent content = new StringContent(strJson, Encoding.UTF8, "application/json"))
                using (HttpResponseMessage response = await m_httpClient.PostAsync(strUrl, content))
                {
                    string strBody = await response.Content.ReadAsStringAsync();

                    WriteLog("응답 ← HTTP " + (int)response.StatusCode + " " + response.StatusCode);

                    if (strBody != null && strBody.Trim().Length > 0)
                        WriteLog("      " + strBody.Trim());
                }
            }
            catch (Exception ex)
            {
                WriteLog("[오류] " + ex.GetType().Name + " : " + ex.Message);

                if (ex.InnerException != null)
                    WriteLog("       " + ex.InnerException.Message);
            }
            finally
            {
                btnSend.Enabled = true;
                WriteLog(new string('-', 60));
            }
        }
    }
}
