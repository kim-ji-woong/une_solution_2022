using System;
using System.Collections.Generic;
using System.Windows.Forms;
using System.Text;
using System.Security.Cryptography;

namespace AccountManager
{
    using Models;

    public partial class FormMain : Form
    {
        private const int UserID_Index = 1;
        private const int NickName_Index = 2;
        private const int UserLevel_Index = 3;

        private bool m_isLogin = false;
        private WebServiceManager m_webServiceManager = new WebServiceManager();

        private List<AccountUser> m_users = new List<AccountUser>();
        private List<Level> m_levels = new List<Level>();

        public FormMain()
        {
            InitializeComponent();

            FormLogin frm = new FormLogin();

            if (frm.ShowDialog() == DialogResult.OK)
            {
                m_isLogin = true;
            }
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            if (m_isLogin == false)
                Application.Exit();

            List<Level> levels = new List<Level>();
            List<AccountUser> users = m_webServiceManager.ReadAccountUsers(levels);

            if (users != null)
            {
                InitGrid(users, levels);

                m_users.AddRange(users);
                m_levels.AddRange(levels);
            }
        }

        private void InitGrid(List<AccountUser> users, List<Level> levels)
        {
            foreach (AccountUser user in users)
            {
                int nRowIndex = gridUsers.Rows.Add();

                if (nRowIndex < 0)
                    continue;

                DataGridViewRow row = gridUsers.Rows[nRowIndex];

                row.Cells[UserID_Index].Value = user.UserID;
                row.Cells[NickName_Index].Value = user.NickName;
                row.Cells[UserLevel_Index].Value = user.UserLevel.LevelName;
                row.Tag = user;
            }
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            FormUser frm = new FormUser(m_users, m_levels);

            if (frm.ShowDialog() == DialogResult.OK)
            {
                int nRowIndex = gridUsers.Rows.Add();

                if (nRowIndex < 0)
                    return;

                AccountUser user = frm.User;
                DataGridViewRow row = gridUsers.Rows[nRowIndex];

                row.Cells[UserID_Index].Value = user.UserID;
                row.Cells[NickName_Index].Value = user.NickName;
                row.Cells[UserLevel_Index].Value = user.UserLevel.LevelName;
                row.Tag = user;

                user.Password = PasswordHash(user);
                m_users.Add(user);
            }
        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            List<int> checkedIDs = new List<int>();

            foreach (DataGridViewRow row in gridUsers.Rows)
            {
                if (row.Cells[0].Value != null && (bool)row.Cells[0].Value == true)
                {
                    checkedIDs.Add(row.Index);
                }
            }

            if (checkedIDs.Count == 0)
            {
                MessageBox.Show("삭제할 계정들이 선택되지 않았습니다.");
                return;
            }

            if (MessageBox.Show("선택된 계정들을 삭제하시겠습니까?", "확인", MessageBoxButtons.YesNo) == DialogResult.Yes)
            {
                for (int i = checkedIDs.Count - 1; i >= 0; i--)
                {
                    int index = checkedIDs[i];
                    DataGridViewRow row = gridUsers.Rows[index];

                    m_users.Remove((AccountUser)row.Tag);
                    gridUsers.Rows.RemoveAt(index);
                }
            }
        }

        private void gridUsers_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0)
                return;

            DataGridViewRow row = gridUsers.Rows[e.RowIndex];
            AccountUser user = (AccountUser)row.Tag;

            FormUser frm = new FormUser(m_users, m_levels, user);
            
            if (frm.ShowDialog() == DialogResult.OK)
            {
                user.Password = PasswordHash(user);
            }
        }

        private void btnApply_Click(object sender, EventArgs e)
        {
            List<Level> levels = new List<Level>();
            List<AccountUser> users = m_webServiceManager.UpdateAccountUsers(m_users, levels);

            if (users != null)
            {
                m_users = users;
                m_levels = levels;
                gridUsers.Rows.Clear();

                InitGrid(m_users, m_levels);
                MessageBox.Show("적용되었습니다.");
            }
        }

        private string PasswordHash(AccountUser user)
        {
            SHA256 sha = SHA256.Create();
            byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(user.Password + user.Salt));
            string strHash = BitConverter.ToString(bytes).Replace("-", "").ToLower();
            return strHash;
        }
    }
}
