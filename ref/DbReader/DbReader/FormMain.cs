using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace DbReader
{
    public partial class FormMain : Form
    {
        private DbManager m_dbManager = null;
        private List<DBTable> m_dbTables = new List<DBTable>();
        private string m_strFileName = "data.txt";

        public FormMain()
        {
            InitializeComponent();
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            string strDbHost = textBoxDbHost.Text.Trim();

            if (strDbHost.Length == 0)
            {
                textBoxDbHost.Focus();
                MessageBox.Show("연결할 IP를 입력하세요.");
                return;
            }

            DbManager dbManager = new DbManager(strDbHost, SchemaReader.GetSysDbName());

            string strErrorMessage;
            List<string> dbNames = dbManager.ReadDbNames(out strErrorMessage);

            if (dbNames != null)
            {
                FormDbNames frm = new FormDbNames(dbNames);
                
                if (frm.ShowDialog() == DialogResult.OK)
                {
                    textBoxDbName.Text = frm.SelectedDbName;
                }
            }
            else
            {
                MessageBox.Show(strErrorMessage);
            }
        }

        private void btnSearchTable_Click(object sender, EventArgs e)
        {
            string strDbName = textBoxDbName.Text.Trim();

            if (strDbName.Length == 0)
            {
                textBoxDbName.Focus();
                MessageBox.Show("연결할 DB 이름을 입력하세요.");
                return;
            }

            string strDbHost = textBoxDbHost.Text.Trim();

            if (strDbHost.Length == 0)
            {
                textBoxDbHost.Focus();
                MessageBox.Show("연결할 IP를 입력하세요.");
                return;
            }

            m_dbManager = new DbManager(strDbHost, strDbName);

            string strErrorMessage;
            List<DBTable> tables = m_dbManager.ReadTables(out strErrorMessage);

            if (tables == null)
            {
                MessageBox.Show(strErrorMessage);
            }
            else
            {
                SetTableNames(tables);
            }
        }

        private void textBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                if (sender == textBoxDbHost)
                    btnSearch_Click(null, null);
                else if (sender == textBoxDbName)
                    btnSearchTable_Click(null, null);
            }
        }

        private void SetTableNames(List<DBTable> tables)
        {
            gridTable.Rows.Clear();

            foreach (var table in tables)
            {
                int rowIndex = gridTable.Rows.Add();

                if (rowIndex < 0)
                    continue;

                DataGridViewRow row = gridTable.Rows[rowIndex];
                row.Cells[1].Value = table.TableName;
                row.Tag = table;
            }

            m_dbTables = tables;
        }

        private void btnSelectData_Click(object sender, EventArgs e)
        {
            List<DBTable> tables = GetSelectedTables();

            if (tables == null || tables.Count == 0)
            {
                MessageBox.Show("값을 읽을 DB 테이블을 선택하세요.");
                return;
            }

            string strExeFilePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
            string strWorkPath = System.IO.Path.GetDirectoryName(strExeFilePath);

            if (m_dbManager != null)
            {
                string strErrorMessage;

                if (m_dbManager.SelectDatas(strWorkPath + "\\" + m_strFileName, tables, out strErrorMessage) == false)
                    MessageBox.Show(strErrorMessage);
                else
                    MessageBox.Show("파일이 생성되었습니다.(" + m_strFileName + ")");
            }
        }

        private List<DBTable> GetSelectedTables()
        {
            List<DBTable> tables = new List<DBTable>();

            foreach (DataGridViewRow row in gridTable.Rows)
            {
                if (row.Cells[0].Value != null && (bool)row.Cells[0].Value == true)
                {
                    tables.Add((DBTable)row.Tag);
                }
            }

            return tables;
        }

        private void checkBoxSelectAll_CheckedChanged(object sender, EventArgs e)
        {
            if (checkBoxSelectAll.Checked)
            {
                foreach (DataGridViewRow row in gridTable.Rows)
                {
                    row.Cells[0].Value = true;
                }
            }
            else
            {
                foreach (DataGridViewRow row in gridTable.Rows)
                {
                    row.Cells[0].Value = false;
                }
            }
        }
    }
}
