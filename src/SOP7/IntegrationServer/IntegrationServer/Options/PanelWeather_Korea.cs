using System;
using System.Collections.Generic;
using dnsSopID;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;

namespace IntegrationServer.Options
{
    using Datas;

    public partial class PanelWeather_Korea : UserControl, IOptionPanel
    {
        private IManager m_manager = null;
        private List<string> m_gridDatas = new List<string>();

        public int SequenceNo
        {
            get; set;
        }

        public PanelWeather_Korea(IManager manager)
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
                if (data.ServerType == (int)ID.ServerTypes.Weather)
                {
                    textBoxServiceKey.TextChanged -= textBoxServiceKey_TextChanged;

                    if (pair.Key == ServerProperty.Weather_KoreaData)
                    {
                        if (pair.Value is JArray)
                        {
                            JArray arr = (JArray)pair.Value;

                            foreach (var item in arr.Children())
                            {
                                string strValue = item.Value<string>().ToString();
                                string[] tokens = strValue.Split(',');

                                if (tokens.Length >= 3)
                                {
                                    int nRowIndex = gridDatas.Rows.Add();

                                    if (nRowIndex >= 0)
                                    {
                                        DataGridViewRow row = gridDatas.Rows[nRowIndex];

                                        row.Cells[0].Value = nRowIndex + 1;
                                        row.Cells[1].Value = tokens[0].Trim();
                                        row.Cells[2].Value = tokens[1].Trim();
                                        row.Cells[3].Value = tokens[2].Trim();
                                    }
                                }
                            }
                        }
                        else if (pair.Value is List<string>)
                        {
                            List<string> values = (List<string>)pair.Value;

                            foreach (string strValue in values)
                            {
                                string[] tokens = strValue.Split(',');

                                if (tokens.Length >= 3)
                                {
                                    int nRowIndex = gridDatas.Rows.Add();

                                    if (nRowIndex >= 0)
                                    {
                                        DataGridViewRow row = gridDatas.Rows[nRowIndex];

                                        row.Cells[0].Value = nRowIndex + 1;
                                        row.Cells[1].Value = tokens[0].Trim();
                                        row.Cells[2].Value = tokens[1].Trim();
                                        row.Cells[3].Value = tokens[2].Trim();
                                    }
                                }
                            }
                        }
                    }
                    else if (pair.Key == ServerProperty.ServiceKey)
                    {
                        textBoxServiceKey.Text = pair.Value.ToString();
                    }

                    textBoxServiceKey.TextChanged += textBoxServiceKey_TextChanged;
                }
            }
        }

        private void btnAddRegion_Click(object sender, EventArgs e)
        {
            int nRowIndex = gridDatas.Rows.Add();

            if (nRowIndex >= 0)
            {
                DataGridViewRow row = gridDatas.Rows[nRowIndex];
                row.Cells[0].Value = nRowIndex + 1;
            }
        }

        private void btnDeleteRegion_Click(object sender, EventArgs e)
        {
            if (gridDatas.SelectedCells.Count == 0)
            {
                MessageBox.Show("삭제할 지역을 선택하세요.");
                return;
            }

            int deleteIndex = gridDatas.SelectedCells[0].OwningRow.Index;
            gridDatas.Rows.RemoveAt(deleteIndex);

            for (int i=gridDatas.Rows.Count-1;i>=deleteIndex;i--)
            {
                DataGridViewRow row = gridDatas.Rows[i];
                row.Cells[0].Value = i + 1;
            }

            SetProperty();
        }

        private void gridDatas_CellEndEdit(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                SetProperty();
            }
        }

        private void SetProperty()
        {
            m_gridDatas.Clear();
            int nColumnCount = gridDatas.Columns.Count;
            int nRowCount = gridDatas.Rows.Count;

            for (int i = 0; i < nRowCount; i++)
            {
                DataGridViewRow row = gridDatas.Rows[i];

                if (row.IsNewRow)
                    continue;

                string strData = "";

                for (int j = 1; j < nColumnCount; j++)
                {
                    string str = row.Cells[j].Value == null ? "" : row.Cells[j].Value.ToString().Trim();

                    if (j == 1)
                        strData = str;
                    else
                        strData += "," + str;
                }

                m_gridDatas.Add(strData);
            }

            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    m_manager.SetServerProperty(item, ServerProperty.Weather_KoreaData, m_gridDatas);
                    break;
                }
            }
        }

        private void textBoxServiceKey_TextChanged(object sender, EventArgs e)
        {
            foreach (var item in m_manager.ServerSetting.ServerDatas)
            {
                if (item.SeqNo == m_manager.CurrentServerSeqNo)
                {
                    m_manager.SetServerProperty(item, ServerProperty.ServiceKey, textBoxServiceKey.Text.Trim());
                    break;
                }
            }
        }
    }
}
