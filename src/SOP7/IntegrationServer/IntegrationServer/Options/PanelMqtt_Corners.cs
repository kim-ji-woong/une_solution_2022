using System;
using System.Collections.Generic;
using dnsSopID;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelMqtt_Corners : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }

        public PanelMqtt_Corners(IManager manager)
        {
            m_manager = manager;
            InitializeComponent();
        }

        public void LoadServerDetailData(ServerData data)
        {
            if (data.ServerProperties == null)
            {
                textBoxSiteID.TextChanged += OnTextChanged;
                textBoxMpcID.TextChanged += OnTextChanged;
                return;
            }

            foreach (KeyValuePair<ServerProperty, object> pair in data.ServerProperties)
            {
                if (data.ServerType == (int)ID.ServerTypes.Mqtt_Corners)
                {
                    textBoxSiteID.TextChanged -= OnTextChanged;
                    textBoxMpcID.TextChanged -= OnTextChanged;

                    string strValue = pair.Value.ToString().Trim();
                    
                    if (pair.Key == ServerProperty.SiteID)
                    {
                        textBoxSiteID.Text = strValue;
                    }
                    else if (pair.Key == ServerProperty.MpcID)
                    {
                        textBoxMpcID.Text = strValue;
                    }
                    
                    textBoxSiteID.TextChanged += OnTextChanged;
                    textBoxMpcID.TextChanged += OnTextChanged;
                }
            }
        }

        private void OnTextChanged(object sender, EventArgs e)
        {
            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    if (sender == textBoxSiteID)
                    {
                        string strSiteID = textBoxSiteID.Text.Trim();

                        if (strSiteID.Length > 0)
                        {
                            int nSiteID;

                            if (int.TryParse(strSiteID, out nSiteID))
                                m_manager.SetServerProperty(item, ServerProperty.SiteID, nSiteID);
                        }
                    }
                    else if (sender == textBoxMpcID)
                    {
                        // 수신반 ID
                        string strMpcID = textBoxMpcID.Text.Trim();

                        if (strMpcID.Length > 0)
                        {
                            int nMpcID;

                            if (int.TryParse(strMpcID, out nMpcID))
                                m_manager.SetServerProperty(item, ServerProperty.MpcID, nMpcID);
                        }
                    }

                    break;
                }
            }
        }
    }
}
