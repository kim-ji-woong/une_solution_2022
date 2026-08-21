using System;
using System.Configuration;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Text;
using System.Security.Cryptography;

namespace AccountManager
{
    public partial class FormLogin : Form
    {
        private string m_strLoginUrl = "";

        public FormLogin()
        {
            InitializeComponent();
            m_strLoginUrl = ConfigurationManager.AppSettings.Get("LoginURL");
        }

        private void btnJoin_Click(object sender, EventArgs e)
        {
            string strID = textBoxID.Text.Trim();
            string strPW = textBoxPW.Text.Trim();

            if (strID.Length == 0)
            {
                textBoxID.Focus();
                MessageBox.Show("ID를 입력하세요.");
                return;
            }

            if (strPW.Length == 0)
            {
                textBoxPW.Focus();
                MessageBox.Show("비밀번호를 입력하세요.");
                return;
            }

            if (Login(strID, strPW))
            {
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
        }

        private bool Login(string strID, string strPW)
        {
            SHA256 sha = SHA256.Create();
            byte[] _bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(strPW));
            string strHash = BitConverter.ToString(_bytes).Replace("-", "").ToLower();

            JObject jsonData = new JObject();

            jsonData.Add("userID", strID);
            jsonData.Add("hashCode", strHash);

            JObject json = new JObject();
            json.Add("externalLogin", jsonData);

            string strJson = json.ToString();

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(m_strLoginUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";
            string strErrorMessage = null;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                string strUserID, strUserName, strTeamName;
                bool success = GetJsonResult(JObject.Parse(strResult), out strUserID, out strUserName, out strTeamName, out strErrorMessage);

                if (success)
                {
                    MessageBox.Show(strUserName + "님 어서오세요.");
                    return true;
                }
                else
                {
                    MessageBox.Show(strErrorMessage);
                }
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return false;
        }

        private bool GetJsonResult(JObject json, out string strUserID, out string strUserName, out string strTeamName, out string strErrorMessage)
        {
            strUserID = strUserName = strTeamName = null;
            strErrorMessage = null;

            if (json == null)
                return false;

            JToken tokenName = json.GetValue("name");
            JToken tokenUserID = json.GetValue("userID");
            JToken tokenTeamName = json.GetValue("teamName");
            JToken tokenMessage = json.GetValue("message");
            JToken tokenSuccess = json.GetValue("success");

            if (tokenMessage != null)
                strErrorMessage = tokenMessage.Value<string>();

            if (tokenName == null || tokenUserID == null)
                return false;

            strUserID = tokenUserID.Value<string>();
            strUserName = tokenName.Value<string>();

            if (tokenTeamName != null)
                strTeamName = tokenTeamName.Value<string>();

            if (tokenSuccess != null)
            {
                string strSuccess = tokenSuccess.Value<string>().ToLower();

                if (strSuccess == "true")
                    return true;
            }

            return false;
        }

        private void textBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                btnJoin_Click(null, null);
            }
        }
    }
}
