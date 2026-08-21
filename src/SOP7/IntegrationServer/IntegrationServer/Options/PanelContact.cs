using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static dnsSopID.ID;

namespace IntegrationServer.Options
{
    public partial class PanelContact : UserControl, IOptionPanel
    {
        private IManager m_manager = null;
        public int SequenceNo
        {
            get; set;
        }

        public PanelContact(IManager manager)
        {
            m_manager = manager;
            InitializeComponent();
        }

        public void LoadServerDetailData(ServerData data)
        {
            if (data.ServerProperties == null)
                return;

            foreach (KeyValuePair<ServerProperty, object> pair in data.ServerProperties)
            {
                if (data.ServerType == (int)ServerTypes.ContactSignal)
                {
                    rbContact1.CheckedChanged -= rb_CheckedChanged;
                    rbContact1.CheckedChanged -= rb_CheckedChanged;
                    rbContact3.CheckedChanged -= rb_CheckedChanged;

                    txtSensorType.TextChanged -= OnTextChanged;
                    txtSensorID.TextChanged -= OnTextChanged;

                    rbAlarmDepth0.CheckedChanged -= rb_DepthChanged;
                    rbAlarmDepth1.CheckedChanged -= rb_DepthChanged;
                    rbAlarmDepth2.CheckedChanged -= rb_DepthChanged;
                    rbAlarmDepth3.CheckedChanged -= rb_DepthChanged;
                    rbAlarmDepth4.CheckedChanged -= rb_DepthChanged;

                    if (pair.Key == ServerProperty.ContactType)
                    {
                        // json 파일 읽을때 int64 타입으로 읽어와서 그냥 string으로 비교했음
                        if (pair.Value.ToString() == ((int)ContactTypes.First_Dry).ToString())
                            rbContact1.Checked = true;
                        else if (pair.Value.ToString() == ((int)ContactTypes.Second_Wet).ToString())
                            rbContact2.Checked = true;
                        else if (pair.Value.ToString() == ((int)ContactTypes.Both).ToString())
                            rbContact3.Checked = true;
                    }
                    else if (pair.Key == ServerProperty.ContactSensorType)
                        txtSensorType.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.ContactSensorID)
                        txtSensorID.Text = pair.Value.ToString();
                    else if (pair.Key == ServerProperty.ContactAlarmDepth)
                    {
                        if (pair.Value.ToString() == ((int)AlarmDepths.None).ToString())
                            rbAlarmDepth0.Checked = true;
                        else if (pair.Value.ToString() == ((int)AlarmDepths.Interest).ToString())
                            rbAlarmDepth1.Checked = true;
                        else if (pair.Value.ToString() == ((int)AlarmDepths.Caution).ToString())
                            rbAlarmDepth2.Checked = true;
                        else if (pair.Value.ToString() == ((int)AlarmDepths.Alert).ToString())
                            rbAlarmDepth3.Checked = true;
                        else if (pair.Value.ToString() == ((int)AlarmDepths.Serious).ToString())
                            rbAlarmDepth4.Checked = true;
                    }


                    rbContact1.CheckedChanged += rb_CheckedChanged;
                    rbContact1.CheckedChanged += rb_CheckedChanged;
                    rbContact3.CheckedChanged += rb_CheckedChanged;

                    txtSensorType.TextChanged += OnTextChanged;
                    txtSensorID.TextChanged += OnTextChanged;

                    rbAlarmDepth0.CheckedChanged += rb_DepthChanged;
                    rbAlarmDepth1.CheckedChanged += rb_DepthChanged;
                    rbAlarmDepth2.CheckedChanged += rb_DepthChanged;
                    rbAlarmDepth3.CheckedChanged += rb_DepthChanged;
                    rbAlarmDepth4.CheckedChanged += rb_DepthChanged;
                }
            }
        }
        
        private void rb_CheckedChanged(object sender, EventArgs e)
        {
            if (m_manager.ServerSetting.ServerDatas == null)
                return;

            if (sender is RadioButton)
            {
                RadioButton rbBtn = sender as RadioButton;
                if (rbBtn == null)
                    return;

                foreach (var item in m_manager.ServerSetting.ServerDatas)
                {
                    if (item.SeqNo == m_manager.CurrentServerSeqNo)
                    {
                        if (rbBtn == rbContact1 || rbBtn == rbContact2 || rbBtn == rbContact3)
                        {
                            int nContactType = rbContact1.Checked ? (int)ContactTypes.First_Dry : rbContact2.Checked ? (int)ContactTypes.Second_Wet : (int)ContactTypes.Both;
                            m_manager.SetServerProperty(item, ServerProperty.ContactType, nContactType);
                        }
                        break;
                    }
                }
            }
        }

        private void OnTextChanged(object sender, EventArgs e)
        {
            if (m_manager.ServerSetting.ServerDatas == null)
                return;

            TextBox txtCtrl = sender as TextBox;
            if (txtCtrl == null)
                return;

            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    if (txtCtrl == txtSensorType)
                    {
                        if (int.TryParse(txtSensorType.Text, out int nSensorType) == false)
                        {
                            MessageBox.Show("숫자입력");
                            txtSensorType.Text = "0";
                            nSensorType = 0;
                        }

                        m_manager.SetServerProperty(item, ServerProperty.ContactSensorType, nSensorType);
                    }
                    else if (txtCtrl == txtSensorID)
                    {
                        if (int.TryParse(txtSensorID.Text, out int nSensorID) == false)
                        {
                            MessageBox.Show("숫자입력");
                            txtSensorID.Text = "0";
                            nSensorID = 0;
                        }

                        m_manager.SetServerProperty(item, ServerProperty.ContactSensorID, nSensorID);
                    }   
                    break;
                }
            }
        }

        private void rb_DepthChanged(object sender, EventArgs e)
        {
            if (m_manager.ServerSetting.ServerDatas == null)
                return;

            if (sender is RadioButton)
            {
                RadioButton rbBtn = sender as RadioButton;
                if (rbBtn == null)
                    return;

                foreach (var item in m_manager.ServerSetting.ServerDatas)
                {
                    if (item.SeqNo == m_manager.CurrentServerSeqNo)
                    {
                        if (rbBtn == rbAlarmDepth0 || rbBtn == rbAlarmDepth1 || rbBtn == rbAlarmDepth2 || rbBtn == rbAlarmDepth3 || rbBtn == rbAlarmDepth4)
                        {
                            int nAlarmDepth = rbAlarmDepth0.Checked ? (int)AlarmDepths.None : rbAlarmDepth1.Checked ? (int)AlarmDepths.Interest : rbAlarmDepth2.Checked ? (int)AlarmDepths.Caution : rbAlarmDepth3.Checked ? (int)AlarmDepths.Alert : (int)AlarmDepths.Serious;
                            m_manager.SetServerProperty(item, ServerProperty.ContactAlarmDepth, nAlarmDepth);
                        }
                        break;
                    }
                }
            }
        }
    }
}
