using System.Collections.Generic;
using System.Windows.Forms;

namespace AccountManager
{
    using Models;

    public partial class FormUser : Form
    {
        private List<AccountUser> m_users = null;
        private AccountUser m_user = null;

        public AccountUser User
        {
            get { return m_user; }
        }

        public FormUser(List<AccountUser> users, List<Level> levels)
        {
            InitializeComponent();
            m_users = users;

            foreach (Level level in levels)
            {
                cboLevel.Items.Add(level);
            }

            if (cboLevel.Items.Count > 0)
                cboLevel.SelectedIndex = 0;
        }

        public FormUser(List<AccountUser> users, List<Level> levels, AccountUser user)
        {
            InitializeComponent();
            m_users = users;
            m_user = user;

            foreach (Level level in levels)
            {
                cboLevel.Items.Add(level);
            }

            for (int i=0;i<cboLevel.Items.Count;i++)
            {
                Level level = (Level)cboLevel.Items[i];

                if (level.ID == user.UserLevel.ID)
                {
                    cboLevel.SelectedIndex = i;
                    break;
                }
            }

            textBoxID.Text = user.UserID;
            textBoxNickName.Text = user.NickName;

            textBoxID.Enabled = false;

            this.Text = "계정 편집";
            this.btnCreate.Text = "적용";
        }

        private void textBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                btnCreate_Click(null, null);
            }
        }

        private void btnCreate_Click(object sender, System.EventArgs e)
        {
            string strUserID = textBoxID.Text.Trim();
            string strNickName = textBoxNickName.Text.Trim();
            string strPW = textBoxPW.Text.Trim();
            string strPWConfirm = textBoxPWConfirm.Text.Trim();

            if (strUserID.Length == 0)
            {
                textBoxID.Focus();
                MessageBox.Show("사용자 ID를 입력하세요.");
                return;
            }

            if (strNickName.Length == 0)
            {
                textBoxNickName.Focus();
                MessageBox.Show("별칭을 입력하세요.");
                return;
            }

            if (strPW.Length == 0)
            {
                textBoxPW.Focus();
                MessageBox.Show("비밀번호를 입력하세요.");
                return;
            }

            if (strPW.Length < 4)
            {
                textBoxPW.Focus();
                MessageBox.Show("비밀번호는 최소한 4글자 이상이어야 합니다.");
                return;
            }

            if (strPW != strPWConfirm)
            {
                textBoxPWConfirm.Focus();
                MessageBox.Show("비밀번호가 일치하지 않습니다.");
                return;
            }

            if (textBoxID.Enabled)
            {
                foreach (AccountUser _user in m_users)
                {
                    if (strUserID.ToLower() == _user.UserID.ToLower())
                    {
                        textBoxID.Focus();
                        MessageBox.Show("이미 사용중인 ID입니다.");
                        return;
                    }
                }
            }

            AccountUser user = m_user == null ? new AccountUser() : m_user;

            user.UserID = strUserID;
            user.NickName = strNickName;
            user.UserLevel = (Level)cboLevel.SelectedItem;
            user.Password = strPW;

            m_user = user;

            this.DialogResult = DialogResult.OK;
            this.Close();
        }
    }
}
