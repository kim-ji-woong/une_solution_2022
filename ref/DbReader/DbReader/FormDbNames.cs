using System.Collections.Generic;
using System.Windows.Forms;

namespace DbReader
{
    public partial class FormDbNames : Form
    {
        private List<string> m_dbNames = null;
        private string m_strSelectedDbName = null;

        public string SelectedDbName
        {
            get { return m_strSelectedDbName; }
        }

        public FormDbNames(List<string> dbNames)
        {
            InitializeComponent();
            m_dbNames = dbNames;
        }

        private void FormDbNames_Load(object sender, System.EventArgs e)
        {
            SetGrid();
        }

        private void SetGrid()
        {
            foreach (string strDbName in m_dbNames)
            {
                int rowIndex = gridDbNames.Rows.Add();

                if (rowIndex >= 0)
                {
                    DataGridViewRow row = gridDbNames.Rows[rowIndex];
                    row.Cells[0].Value = strDbName;
                }
            }
        }

        private void gridDbNames_MouseClick(object sender, MouseEventArgs e)
        {
            if (gridDbNames.SelectedCells.Count > 0)
            {
                m_strSelectedDbName = gridDbNames.SelectedCells[0].Value.ToString();
            }
            else
            {
                m_strSelectedDbName = null;
            }
        }

        private void btnOk_Click(object sender, System.EventArgs e)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        private void btnCancel_Click(object sender, System.EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }

        private void gridDbNames_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            if (gridDbNames.SelectedCells.Count > 0)
            {
                m_strSelectedDbName = gridDbNames.SelectedCells[0].Value.ToString();
                btnOk_Click(null, null);
            }
            else
            {
                m_strSelectedDbName = null;
            }
        }
    }
}
