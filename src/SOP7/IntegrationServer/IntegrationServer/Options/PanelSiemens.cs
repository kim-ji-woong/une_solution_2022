using System;
using System.Collections.Generic;
using dnsSopID;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelSiemens : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set; 
        }

        public PanelSiemens(IManager manager)
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
                if (data.ServerType == (int)ID.ServerTypes.Fire_Siemens)
                {
                    rbServerMode.CheckedChanged -= rb_CheckedChanged;
                    rbClientMode.CheckedChanged -= rb_CheckedChanged;

                    if (pair.Key == ServerProperty.ServerMode)
                    {
                        if ((int)pair.Value == (int)ServerModes.Server)
                            rbServerMode.Checked = true;
                        else if ((int)pair.Value == (int)ServerModes.Client)
                            rbClientMode.Checked = true;
                    }

                    rbServerMode.CheckedChanged += rb_CheckedChanged;
                    rbClientMode.CheckedChanged += rb_CheckedChanged;
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
                        if (rbBtn == rbServerMode || rbBtn == rbClientMode)
                        {
                            int nServerType = rbServerMode.Checked ? (int)ServerModes.Server : rbClientMode.Checked ? (int)ServerModes.Client : (int)ServerModes.Server;
                            m_manager.SetServerProperty(item, ServerProperty.ServerMode, nServerType);
                        }
                        break;
                    }
                }
            }
        }
    }
}
