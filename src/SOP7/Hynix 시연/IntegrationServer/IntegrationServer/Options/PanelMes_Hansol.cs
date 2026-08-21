using System;
using System.Collections.Generic;
using dnsSopID;
using System.Windows.Forms;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelMes_Hansol : UserControl, IOptionPanel
    {
        private IManager m_manager = null;

        public int SequenceNo
        {
            get; set;
        }

        public PanelMes_Hansol(IManager manager)
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
                if (data.ServerType == (int)ID.ServerTypes.MES_Hansol)
                {
                    textBoxHost1.TextChanged -= OnTextChanged;
                    textBoxHost2.TextChanged -= OnTextChanged;
                    textBoxID1.TextChanged -= OnTextChanged;
                    textBoxID2.TextChanged -= OnTextChanged;
                    textBoxPW1.TextChanged -= OnTextChanged;
                    textBoxPW2.TextChanged -= OnTextChanged;
                    textBoxSid1.TextChanged -= OnTextChanged;
                    textBoxSid2.TextChanged -= OnTextChanged;

                    string strValue = pair.Value.ToString().Trim();
                    int index = strValue.IndexOf('_');

                    if (pair.Key == ServerProperty.DB_Host)
                    {
                        if (index > 0)
                        {
                            string strHost1 = strValue.Substring(0, index).Trim();
                            string strHost2 = strValue.Substring(index + 1).Trim();

                            textBoxHost1.Text = strHost1;
                            textBoxHost2.Text = strHost2;
                        }
                    }
                    else if (pair.Key == ServerProperty.DB_ID)
                    {
                        if (index > 0)
                        {
                            string strID1 = strValue.Substring(0, index).Trim();
                            string strID2 = strValue.Substring(index + 1).Trim();

                            textBoxID1.Text = strID1;
                            textBoxID2.Text = strID2;
                        }
                    }
                    else if (pair.Key == ServerProperty.DB_PW)
                    {
                        if (index > 0)
                        {
                            string strPW1 = strValue.Substring(0, index).Trim();
                            string strPW2 = strValue.Substring(index + 1).Trim();

                            textBoxPW1.Text = strPW1;
                            textBoxPW2.Text = strPW2;
                        }
                    }
                    else if (pair.Key == ServerProperty.Oracle_SID)
                    {
                        if (index > 0)
                        {
                            string strSid1 = strValue.Substring(0, index).Trim();
                            string strSid2 = strValue.Substring(index + 1).Trim();

                            textBoxSid1.Text = strSid1;
                            textBoxSid2.Text = strSid2;
                        }
                    }

                    textBoxHost1.TextChanged += OnTextChanged;
                    textBoxHost2.TextChanged += OnTextChanged;
                    textBoxID1.TextChanged += OnTextChanged;
                    textBoxID2.TextChanged += OnTextChanged;
                    textBoxPW1.TextChanged += OnTextChanged;
                    textBoxPW2.TextChanged += OnTextChanged;
                    textBoxSid1.TextChanged += OnTextChanged;
                    textBoxSid2.TextChanged += OnTextChanged;
                }
            }
        }

        private void OnTextChanged(object sender, EventArgs e)
        {
            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    if (sender == textBoxHost1 || sender == textBoxHost2)
                    {
                        string strHost1 = textBoxHost1.Text.Trim();
                        string strHost2 = textBoxHost2.Text.Trim();

                        if (strHost1.Length > 0 && strHost2.Length > 0)
                        {
                            string strValue = strHost1 + "_" + strHost2;
                            m_manager.SetServerProperty(item, ServerProperty.DB_Host, strValue);
                        }
                    }
                    else if (sender == textBoxID1 || sender == textBoxID2)
                    {
                        string strID1 = textBoxID1.Text.Trim();
                        string strID2 = textBoxID2.Text.Trim();

                        if (strID1.Length > 0 && strID2.Length > 0)
                        {
                            string strValue = strID1 + "_" + strID2;
                            m_manager.SetServerProperty(item, ServerProperty.DB_ID, strValue);
                        }
                    }
                    else if (sender == textBoxPW1 || sender == textBoxPW2)
                    {
                        string strPW1 = textBoxPW1.Text.Trim();
                        string strPW2 = textBoxPW2.Text.Trim();

                        if (strPW1.Length > 0 && strPW2.Length > 0)
                        {
                            string strValue = strPW1 + "_" + strPW2;
                            m_manager.SetServerProperty(item, ServerProperty.DB_PW, strValue);
                        }
                    }
                    else if (sender == textBoxSid1 || sender == textBoxSid2)
                    {
                        string strSid1 = textBoxSid1.Text.Trim();
                        string strSid2 = textBoxSid2.Text.Trim();

                        if (strSid1.Length > 0 && strSid2.Length > 0)
                        {
                            string strValue = strSid1 + "_" + strSid2;
                            m_manager.SetServerProperty(item, ServerProperty.Oracle_SID, strValue);
                        }
                    }

                    break;
                }
            }
        }
    }
}
