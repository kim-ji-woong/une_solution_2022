using System;
using System.Collections;
using System.Windows.Forms;
using dnsDBUtil;

namespace ChangeSite
{
    public partial class FormMain : Form
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private void btnChange_Click(object sender, EventArgs e)
        {
            string strDBName = textBoxDBName.Text.Trim();
            string strDBHost = textBoxDBHost.Text.Trim();
            string strSiteID = textBoxSiteID.Text.Trim();

            if (strDBName.Length == 0)
            {
                textBoxDBName.Focus();
                MessageBox.Show("DB 이름을 입력하세요.");
                return;
            }

            if (strDBHost.Length == 0)
            {
                textBoxDBHost.Focus();
                MessageBox.Show("DB Host를 입력하세요.");
                return;
            }

            if (strSiteID.Length == 0)
            {
                textBoxSiteID.Focus();
                MessageBox.Show("Site ID를 입력하세요.");
                return;
            }

            int nSiteID;

            if (int.TryParse(strSiteID, out nSiteID) == false || nSiteID <= 0)
            {
                textBoxSiteID.Focus();
                MessageBox.Show("Site ID는 0보다 큰 정수 형태이어야 합니다.");
                return;
            }

            UpdateSite(nSiteID, strDBName, strDBHost);
        }

        private void UpdateSite(int nSiteID, string strDBName, string strDBHost)
        {
            DirectDBManager dbMgr = new DirectDBManager(0, strDBHost, strDBName, "sa", "9449966Ab");

            string strSQL = "Select ID from Site";
            ArrayList arrResult = dbMgr.GetResultData(strSQL);

            if (arrResult == null)
            {
                System.Diagnostics.Trace.WriteLine("QueryError : " + strSQL + ", ErrorMessage : " + dbMgr.LastErrorMessage);
                return;
            }

            int nResultCount = arrResult.Count;

            for (int i=0;i<nResultCount;i++)
            {
                VariousData<int> id = WebDBManager.GetIntField(arrResult[i].ToString());

                if (id == null)
                    continue;

                if (id.Data == nSiteID)
                    return;
            }

            strSQL = string.Format("Insert into Site (ID, SiteName, TeamID) values ({0}, 'Temp Site', NULL)", nSiteID);
            
            if (dbMgr.GetResultData(strSQL) == null)
            {
                System.Diagnostics.Trace.WriteLine("QueryError : " + strSQL + ", ErrorMessage : " + dbMgr.LastErrorMessage);
                return;
            }

            UpdateManager updateManager = new UpdateManager(dbMgr);

            if (updateManager.UpdateSite(nSiteID))
                MessageBox.Show("변환 성공");
            else
                MessageBox.Show("변환 실패");
        }
    }
}
