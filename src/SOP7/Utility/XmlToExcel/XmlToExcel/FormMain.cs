using System;
using System.Windows.Forms;
using System.IO;

namespace XmlToExcel
{
    using Xml;

    public partial class FormMain : Form
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            this.ActiveControl = btnOpenFile;
        }

        private void textBoxXmlPath_DragDrop(object sender, DragEventArgs e)
        {
            string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);

            if (files != null && files.Length > 0)
            {
                foreach (string strFilePath in files)
                {
                    int index = strFilePath.LastIndexOf('.');

                    if (index < 0)
                        continue;

                    string strExt = strFilePath.Substring(index + 1).Trim().ToLower();

                    if (strExt == "xml")
                    {
                        textBoxXmlPath.Text = strFilePath;
                        break;
                    }
                }
            }
        }

        private void textBoxXmlPath_DragOver(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
                e.Effect = DragDropEffects.Copy;
            else
                e.Effect = DragDropEffects.None;
        }

        private void btnOpenFile_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog openFileDialog = new OpenFileDialog())
            {
                openFileDialog.Filter = "XML Files (*.xml)|*.xml";
                openFileDialog.FilterIndex = 2;
                openFileDialog.RestoreDirectory = true;

                if (openFileDialog.ShowDialog() == DialogResult.OK)
                {
                    //Get the path of specified file
                    string strFilePath = openFileDialog.FileName;
                    textBoxXmlPath.Text = strFilePath;
                }
            }
        }

        private void btnCreateExcel_Click(object sender, EventArgs e)
        {
            string strFilePath = textBoxXmlPath.Text.Trim();

            if (strFilePath.Length == 0)
            {
                MessageBox.Show("XML 파일을 입력하세요.");
                return;
            }

            if (File.Exists(strFilePath) == false)
            {
                MessageBox.Show("존재하지 않는 파일입니다.");
                return;
            }

            XmlManager xmlManager = new XmlManager();

            string strErrorMessage;
            
            if (xmlManager.Load(strFilePath, out strErrorMessage) == false)
            {
                MessageBox.Show("XML 파일을 열수 없습니다.\r\n파일 사용권한이 없거나 잘못된 형식의 파일입니다.");
            }
            else
            {
                string strExcelFileName = xmlManager.MakeExcel(strFilePath, out strErrorMessage);

                if (strExcelFileName != null)
                    MessageBox.Show("엑셀파일이 생성되었습니다. : " + strExcelFileName);
                else
                    MessageBox.Show("엑셀파일 생성 실패 : " + strErrorMessage);
            }
        }
    }
}
