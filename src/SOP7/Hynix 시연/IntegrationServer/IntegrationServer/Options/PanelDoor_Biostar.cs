using System;
using System.Collections.Generic;
using dnsSopID;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelDoor_Biostar : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }

        public PanelDoor_Biostar(IManager manager)
        {
            m_manager = manager;
            InitializeComponent();
        }

        public void LoadServerDetailData(ServerData data)
        {
            if (data.ServerProperties == null || data.ServerProperties.Count == 0)
            {
                textBoxID.TextChanged += OnTextChanged;
                textBoxPassword.TextChanged += OnTextChanged;
                return;
            }

            List<ServerProperty> keys = new List<ServerProperty>();
            keys.AddRange(data.ServerProperties.Keys);

            foreach (ServerProperty key in keys)
            {
                object value;

                if (data.ServerProperties.TryGetValue(key, out value))
                {
                    if (data.ServerType == (int)ID.ServerTypes.Door_Biostar)
                    {
                        textBoxID.TextChanged -= OnTextChanged;
                        textBoxPassword.TextChanged -= OnTextChanged;

                        string strValue = value.ToString().Trim();

                        if (key == ServerProperty.Biostar_id)
                        {
                            textBoxID.Text = strValue;
                        }
                        else if (key == ServerProperty.Biostar_pw)
                        {
                            textBoxPassword.Text = strValue;
                        }

                        textBoxID.TextChanged += OnTextChanged;
                        textBoxPassword.TextChanged += OnTextChanged;
                    }
                }
            }
            /*foreach (KeyValuePair<ServerProperty, object> pair in data.ServerProperties)
            {

                if (data.ServerType == (int)ID.ServerTypes.Door_Biostar)
                {
                    textBoxID.TextChanged -= OnTextChanged;
                    textBoxPassword.TextChanged -= OnTextChanged;

                    string strValue = pair.Value.ToString().Trim();

                    if (pair.Key == ServerProperty.Biostar_id)
                    {
                        textBoxID.Text = strValue;
                    }
                    else if (pair.Key == ServerProperty.Biostar_pw)
                    {
                        textBoxPassword.Text = strValue;
                    }

                    textBoxID.TextChanged += OnTextChanged;
                    textBoxPassword.TextChanged += OnTextChanged;
                }
            }*/
        }

        private void OnTextChanged(object sender, EventArgs e)
        {
            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    if (sender == textBoxID)
                    {
                        string strID = textBoxID.Text.Trim();

                        if (strID.Length > 0)
                        {
                            m_manager.SetServerProperty(item, ServerProperty.Biostar_id, strID);
                        }
                    }
                    else if (sender == textBoxPassword)
                    {
                        string strPassword = textBoxPassword.Text.Trim();

                        if (strPassword.Length > 0)
                        {
                            m_manager.SetServerProperty(item, ServerProperty.Biostar_pw, strPassword);
                        }
                    }

                    break;
                }
            }
        }
    }
}
