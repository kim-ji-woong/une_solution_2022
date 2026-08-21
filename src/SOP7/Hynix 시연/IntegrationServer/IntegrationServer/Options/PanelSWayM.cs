using System;
using System.Collections.Generic;
using dnsSopID;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelSWayM : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }

        public PanelSWayM(IManager manager)
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
                if (data.ServerType == (int)ID.ServerTypes.Worker_SWayM)
                {
                    textBoxBaseUrl.TextChanged -= OnTextChanged;
                    
                    string strValue = pair.Value.ToString().Trim();
                    int index = strValue.IndexOf('_');

                    if (pair.Key == ServerProperty.BaseUrl)
                    {
                        textBoxBaseUrl.Text = strValue;
                    }

                    textBoxBaseUrl.TextChanged += OnTextChanged;
                }
            }
        }

        private void OnTextChanged(object sender, EventArgs e)
        {
            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    if (sender == textBoxBaseUrl)
                    {
                        string strBaseUrl = textBoxBaseUrl.Text.Trim();

                        if (strBaseUrl.Length > 0)
                        {
                            m_manager.SetServerProperty(item, ServerProperty.BaseUrl, strBaseUrl);
                        }
                    }

                    break;
                }
            }
        }
    }
}
