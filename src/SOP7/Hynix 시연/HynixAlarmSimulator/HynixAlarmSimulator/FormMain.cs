using System;
using System.Data.SqlClient;
using System.Drawing;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.Manager;
using HynixAlarmSimulator.Data;
using HynixAlarmSimulator.Managers;
using System.Windows.Forms;
using Microsoft.Extensions.Configuration;

namespace HynixAlarmSimulator
{
    public partial class FormMain : Form
    {

        private int m_nSelectedNumber = -1;
        private bool m_bDatabaseConnected = false;
        private string m_strSOPWebServerURL = "";

        private DataManager? m_dataManager = null;
        private ProcessManager? m_processManager = null;
        private ExternalControllerForm? m_externalControllerForm = null;
        private FormSmartTagManager? m_formSmartTagManager = null;
        private FormStrangerManager? m_formStrangerManager = null;
        private FormDetourItemManager? m_formDetourItemManager = null;
        private FormSensorManager? m_formSensorManager = null;

        public FormMain()
        {
            InitializeComponent();
            InitData();
        }

        private void UpdateUI(string message)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action(() => UpdateUI(message)));
                return;
            }

            ResultText.Text = message;
        }

        private void InitData()
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(Application.StartupPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();
            var databaseConfig = new Config.Database();
            configuration.GetSection("Database").Bind(databaseConfig);
            var appConfig = new Config.AppConfig();
            configuration.GetSection("AppConfig").Bind(appConfig);

            if (databaseConfig.DbHost == null || databaseConfig.DbName == null || databaseConfig.DbType == null || databaseConfig.DbID == null || databaseConfig.DbPw == null)
            {
                MessageBox.Show("DB 설정 정보를 확인해주세요.");
                return;
            }

            string strDbHost = databaseConfig.DbHost;
            //string strDbHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(databaseConfig.DbHost);
            string strDbName = databaseConfig.DbName;
            //string strId = dnsDapperDBUtil.AES256Cipher.AES_decrypt(databaseConfig.DbID);
            //string strPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(databaseConfig.DbPw);
            string strId = databaseConfig.DbID;
            string strPw = databaseConfig.DbPw;

            if (string.IsNullOrEmpty(strDbHost) || string.IsNullOrEmpty(strDbName) || string.IsNullOrEmpty(strId) || string.IsNullOrEmpty(strPw) || string.IsNullOrEmpty(appConfig.SOPWebServerURL))
            {
                MessageBox.Show("입력값이 누락되었습니다. 설정 파일을 확인해주세요.", "에러", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }
            
            m_strSOPWebServerURL = appConfig.SOPWebServerURL;

            string connectionString = $@"Server={strDbHost};Database={strDbName};User ID={strId};Password={strPw};";

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    m_bDatabaseConnected = true;

                    UpdateUI("데이터 베이스 연결에 성공하였습니다.");

                    m_dataManager = new DataManager((int)WebDBManager.DBType.sqlserver, strDbHost, strDbName, strId, strPw);

                    if (this.InvokeRequired)
                    {
                        this.BeginInvoke(new Action(() =>
                        {
                            AlarmButton.Enabled = true;
                            LoadCategoryList();
                        }));
                    }
                    else
                    {
                        AlarmButton.Enabled = true;
                        LoadCategoryList();
                    }
                }
                
                m_processManager = new ProcessManager(m_dataManager, m_strSOPWebServerURL);
            }
            catch (Exception ex)
            {
                m_bDatabaseConnected = false;
                UpdateUI("데이터 베이스 연결에 실패하였습니다.");

                if (this.InvokeRequired)
                {
                    this.BeginInvoke(new Action(() => MessageBox.Show(ex.Message)));
                }
                else
                {
                    MessageBox.Show(ex.Message);
                }

            }
        }

        private void LoadCategoryList()
        {
            CategoryList.DisplayMember = "Value";
            CategoryList.ValueMember = "Key";

            foreach (var category in Const.DicCategories)
            {
                CategoryList.Items.Add(category);
            }
        }


        private void AlarmButton_Click(object sender, EventArgs e)
        {
            if (m_nSelectedNumber == -1)
            {
                MessageBox.Show("카테고리를 선택해주세요.");
                return;
            }

            Model.Category category = Const.ListCategories[m_nSelectedNumber - 1];

            if (!m_processManager.RequestInsertData(category))
            {
                MessageBox.Show("데이터 베이스에 데이터 삽입에 실패하였습니다.", "에러", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else
            {
                MessageBox.Show("이벤트 발생에 성공하였습니다.", "성공", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        /// <summary>
        /// 외부 컨트롤러 호출
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void CategoryList_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_nSelectedNumber = CategoryList.SelectedIndex + 1;

            // m_nSelectedNumber가 9일 때 외부 컨트롤러 창 로드
            if (m_nSelectedNumber == (int)Const.Categories.AddHistory)
            {
                LoadExternalController();
            }
            else if (m_nSelectedNumber == (int)Const.Categories.AddSmartTagHistory)
            {
                LoadSmartTagManager();
            }
            else if (m_nSelectedNumber == (int)Const.Categories.Stranger)
            {
                LoadStrangerManager();
            }
            else if (m_nSelectedNumber == (int)Const.Categories.Detour)
            {
                LoadDetourManager();
            }
            else if (m_nSelectedNumber == (int)Const.Categories.PSM)
            {
                LoadSensorManager();
            }
            
            if (m_nSelectedNumber == (int)Const.Categories.ForcedOpen)
                AlarmButton.Enabled = true;
            else
                AlarmButton.Enabled = false;
        }
        
        private void ShowFormBesideMain(Form form)
        {
            form.StartPosition = FormStartPosition.Manual;
            form.Location = new Point(this.Right + 10, this.Top);
            if (form.Location.X + form.Width > Screen.PrimaryScreen.WorkingArea.Right)
            {
                form.Location = new Point(this.Left - form.Width - 10, this.Top);
            }
            form.Show();
        }

        private void LoadSensorManager()
        {
            if (m_formSensorManager == null || m_formSensorManager.IsDisposed)
            {
                m_formSensorManager = new FormSensorManager(m_dataManager);
                m_formSensorManager.FormClosed += (sender, e) => {
                    m_formSensorManager = null;
                };
        
                ShowFormBesideMain(m_formSensorManager);
            }
            else
            {
                m_formSensorManager.BringToFront();
            }
        }

        private void LoadDetourManager()
        {
            if (m_formDetourItemManager == null || m_formDetourItemManager.IsDisposed)
            {
                m_formDetourItemManager = new FormDetourItemManager(m_dataManager, m_strSOPWebServerURL);
                m_formDetourItemManager.FormClosed += (sender, e) => {
                    m_formDetourItemManager = null;
                };
        
                ShowFormBesideMain(m_formDetourItemManager);
            }
            else
            {
                m_formDetourItemManager.BringToFront();
            }
        }       

        private void LoadExternalController()
        {
            if (m_externalControllerForm == null || m_externalControllerForm.IsDisposed)
            {
                m_externalControllerForm = new ExternalControllerForm(m_dataManager, m_strSOPWebServerURL);
                m_externalControllerForm.FormClosed += (sender, e) => {
                    m_externalControllerForm = null;
                };
        
                ShowFormBesideMain(m_externalControllerForm);
            }
            else
            {
                m_externalControllerForm.BringToFront();
            }
        }

        private void LoadSmartTagManager()
        {
            if (m_formSmartTagManager == null || m_formSmartTagManager.IsDisposed)
            {
                m_formSmartTagManager = new FormSmartTagManager(m_dataManager, m_strSOPWebServerURL);
                m_formSmartTagManager.FormClosed += (sender, e) => {
                    m_formSmartTagManager = null;
                };
        
                ShowFormBesideMain(m_formSmartTagManager);
            }
            else
            {
                m_formSmartTagManager.BringToFront();
            }
        }

        private void LoadStrangerManager()
        {
            if (m_formStrangerManager == null || m_formStrangerManager.IsDisposed)
            {
                m_formStrangerManager = new FormStrangerManager(m_dataManager, m_strSOPWebServerURL);
                m_formStrangerManager.FormClosed += (sender, e) => {
                    m_formStrangerManager = null;
                };
        
                ShowFormBesideMain(m_formStrangerManager);
            }
            else
            {
                m_formStrangerManager.BringToFront();
            }
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            
        }
        
    }
}
