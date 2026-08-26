using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace EncryptString
{
    public partial class FormMain : Form
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string strEncrypt = "Ay4a/BivsoFc8chiyqyyDg==";
            string strOrigin = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strEncrypt);
        }

        private void btnApply_Click(object sender, EventArgs e)
        {
            string strOrigin = textBoxOrigin.Text.Trim();

            if (strOrigin.Length == 0)
            {
                MessageBox.Show("원본 문자열을 입력하세요.");
                return;
            }

            string strEncrypt = dnsDapperDBUtil.AES256Cipher.AES_encrypt(strOrigin);
            textBoxEncrypt.Text = strEncrypt;
        }
    }
}
