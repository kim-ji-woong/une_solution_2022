using AgentFactory.BLL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using HynixAlarmSimulator.Data;
using HynixAlarmSimulator.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace HynixAlarmSimulator
{
    public partial class FormSensorManager : Form
    {
        private DataManager? m_dataManager;

        private int m_nMaterialType = 231;

        //private Dictionary<int, PSM> m_dicSensorList = new Dictionary<int, PSM>();

        private string m_strSOPWebServerURL = null;

        private PSM m_SelectedSensor = null;

        public FormSensorManager(DataManager? dataManager)
        {
            InitializeComponent();

            m_dataManager = dataManager;

            Reload_GridData();
        }

        private void CardLabel_Click(object sender, EventArgs e)
        {

        }


        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void CL_Radio_CheckedChanged(object sender, EventArgs e)
        {
            if (this.CL_Radio.Checked == true)
            {
                m_nMaterialType = (int)Facility.FacilityType.CL;
                m_SelectedSensor = null;
                Reload_GridData();
            }
                
        }

        private void VOC_Radio_CheckedChanged(object sender, EventArgs e)
        {
            if (this.VOC_Radio.Checked == true)
            {
                m_nMaterialType = (int)Facility.FacilityType.VOC;
                m_SelectedSensor = null;
                Reload_GridData();
            }
                
        }

        private void H2_Radio_CheckedChanged(object sender, EventArgs e)
        {
            if (this.H2_Radio.Checked == true)
            {
                m_nMaterialType = (int)Facility.FacilityType.H2;
                m_SelectedSensor = null;
                Reload_GridData();
            }
              
        }

        private void Reload_GridData()
        {
            string strConditions = $"{PSM.Fields.MaterialType} = {m_nMaterialType}";

            IEnumerable<PSM> psms = m_dataManager.GetSelect().Select<PSM>(strConditions, out string strErrorMessage);
            if (psms == null)
            {
                MessageBox.Show($"센서 데이터를 가져오는데 실패했습니다. ({strErrorMessage})");
                return;
            }

            SensorList.Items.Clear();

            foreach (PSM psm in psms)
            {
                //m_dicSensorList.Add(psm.ID, psm);
                SensorList.Items.Add(psm);
            }
        }

        private void SensorList_SelectedIndexChanged(object sender, EventArgs e)
        {
            PSM sensor = (PSM)SensorList.SelectedItem;
            m_SelectedSensor = sensor;
            //m_SelectedSensor = m_dicSensorList[(int)SensorList.SelectedItem];
            //SensorList.SelectedItem = m_SelectedSensor;
        }

        private void InsertButton_Click(object sender, EventArgs e)
        {
            string strErrorMessage;
            string strValue = ValueTextBox.Text;
            double dValue = 0;

            if (double.TryParse(strValue, out dValue) == false)
            {
                MessageBox.Show($"올바른 데이터를 입력하세요. (ex: 1.0)");
                return;
            }

            if (m_SelectedSensor == null)
            {
                MessageBox.Show($"센서를 선택하세요.");
                return;
            }


            //Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();
            //dicSets[PSM.Fields.CurrentData] = dValue;

            //string strCondition = $"{PSM.Fields.ID} = {m_SelectedSensor.ID}";

            string strSQL = $"update {PSM.TableName} set {PSM.Fields.CurrentData} = {dValue} where {PSM.Fields.ID} = {m_SelectedSensor.ID}";

            if (m_dataManager.GetUpdate().Update(strSQL, out strErrorMessage) == false)
            {
                MessageBox.Show($"PSM Update Error: {strErrorMessage}");
            }
            else
            {
                MessageBox.Show($"수치 정보 업데이트 되었습니다.");
            }
        }
    }
}
