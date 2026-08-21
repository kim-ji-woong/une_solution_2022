using System;
using System.Collections.Generic;
using dnsSopID;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelEmergencyBell_MPia : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }

        public PanelEmergencyBell_MPia(IManager manager)
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
                if (data.ServerType == (int)ID.ServerTypes.EmergencyBell_MPia)
                {
                    textBoxUniqueKeyTag.TextChanged -= OnTextChanged;

                    if (pair.Key == ServerProperty.UniqueKeyTag)
                    {
                        textBoxUniqueKeyTag.Text = pair.Value.ToString().Trim();
                    }

                    textBoxUniqueKeyTag.TextChanged += OnTextChanged;
                } 
            }
        }

        private void OnTextChanged(object sender, EventArgs e)
        {
            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    if (sender == textBoxUniqueKeyTag)
                    {
                        m_manager.SetServerProperty(item, ServerProperty.UniqueKeyTag, textBoxUniqueKeyTag.Text.Trim());
                    }

                    break;
                }
            }
        }
    }
}
