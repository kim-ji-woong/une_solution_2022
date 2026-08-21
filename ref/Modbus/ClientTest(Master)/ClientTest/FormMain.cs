using System;
using System.Windows.Forms;
using System.Configuration;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;

namespace ClientTest
{
    public partial class FormMain : Form, IOwner
    {
        private ModbusManager m_modbusManager = null;
        private DataManager m_dataManager = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            string strServerIP = textBoxServerIP.Text.Trim();

            if (strServerIP.Length == 0)
            {
                textBoxServerIP.Focus();
                MessageBox.Show("Server IP를 입력하세요");
                return;
            }

            string strSlaveID = textBoxSlaveID.Text.Trim();

            if (strSlaveID.Length == 0)
            {
                textBoxSlaveID.Focus();
                MessageBox.Show("Slave ID를 입력하세요");
                return;
            }

            string strStartAddr = textBoxStartAddress.Text.Trim();

            if (strStartAddr.Length == 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("시작주소를 입력하세요");
                return;
            }

            string strLength = textBoxLength.Text.Trim();

            if (strLength.Length == 0)
            {
                textBoxLength.Focus();
                MessageBox.Show("읽을 데이터 개수를 입력하세요");
                return;
            }

            int startAddr, length, slaveID;

            if (int.TryParse(strStartAddr, out startAddr) == false || startAddr < 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("시작주소는 0 또는 0 보다 큰 정수만 가능합니다.");
                return;
            }

            if (int.TryParse(strLength, out length) == false || length < 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("읽을 데이터 개수는 0 보다 큰 정수만 가능합니다.");
                return;
            }

            int functionCode = GetFunctionCode();

            if (functionCode < 0)
            {
                MessageBox.Show("Function Code를 선택하세요");
                return;
            }

            if (int.TryParse(strSlaveID, out slaveID) == false || slaveID < 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("Slave ID는 0 보다 큰 정수만 가능합니다.");
                return;
            }

            m_modbusManager = new ModbusManager(strServerIP, functionCode, this);
            m_modbusManager.StartAddress = startAddr;
            m_modbusManager.RequestLength = (ushort)length;
            m_modbusManager.SlaveID = slaveID;

            if (chkRequestFromDB.Checked)
            {
                GetRequestFromDB();
            }

            m_modbusManager.Start(this);
            btnStop.Enabled = true;
            btnStart.Enabled = false;
        }

        private int GetFunctionCode()
        {
            int selectedIndex = cboFunctionCode.SelectedIndex;

            if (selectedIndex == 0)
                return 0x01;
            else if (selectedIndex == 1)
                return 0x03;
            else if (selectedIndex == 2)
                return 0x04;

            return -1;
        }

        private void btnApply_Click(object sender, EventArgs e)
        {
            if (m_modbusManager == null)
                return;

            string strStartAddr = textBoxStartAddress.Text.Trim();

            if (strStartAddr.Length == 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("시작주소를 입력하세요");
                return;
            }

            string strSlaveID = textBoxSlaveID.Text.Trim();

            if (strSlaveID.Length == 0)
            {
                textBoxSlaveID.Focus();
                MessageBox.Show("Slave ID를 입력하세요");
                return;
            }

            string strLength = textBoxLength.Text.Trim();

            if (strLength.Length == 0)
            {
                textBoxLength.Focus();
                MessageBox.Show("읽을 데이터 개수를 입력하세요");
                return;
            }

            int startAddr, length, slaveID;

            if (int.TryParse(strStartAddr, out startAddr) == false || startAddr < 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("시작주소는 0 또는 0 보다 큰 정수만 가능합니다.");
                return;
            }

            if (int.TryParse(strLength, out length) == false || length < 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("읽을 데이터 개수는 0 보다 큰 정수만 가능합니다.");
                return;
            }

            if (int.TryParse(strSlaveID, out slaveID) == false || slaveID < 0)
            {
                textBoxStartAddress.Focus();
                MessageBox.Show("Slave ID는 0 보다 큰 정수만 가능합니다.");
                return;
            }

            m_modbusManager.StartAddress = startAddr;
            m_modbusManager.RequestLength = (ushort)length;
            m_modbusManager.SlaveID = slaveID;
        }

        private void btnStop_Click(object sender, EventArgs e)
        {
            if (m_modbusManager == null)
                return;

            m_modbusManager.Stop();
            m_modbusManager = null;

            btnStart.Enabled = true;
            btnStop.Enabled = false;
        }

        public void WriteLog(string strLog)
        {
            this.Invoke((MethodInvoker)delegate
            {
                string strText = this.textBoxLog.Text;

                if (strText.Length == 0)
                    this.textBoxLog.Text = strLog;
                else
                    this.textBoxLog.Text = strText + "\r\n" + strLog;

                this.textBoxLog.SelectionStart = this.textBoxLog.Text.Length;
                this.textBoxLog.ScrollToCaret();
            });
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            this.textBoxLog.Text = "";
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (m_modbusManager != null)
                m_modbusManager.Stop();
        }

        private void chkRequestFromDB_CheckedChanged(object sender, EventArgs e)
        {
            if (chkRequestFromDB.Checked)
                GetRequestFromDB();
            else
                m_modbusManager.Requests = null;
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            string strDbName = ConfigurationManager.AppSettings.Get("DBName");
            string strDbHost = ConfigurationManager.AppSettings.Get("DBHost");
            string strId = ConfigurationManager.AppSettings.Get("ID");
            string strPw = ConfigurationManager.AppSettings.Get("PW");

            m_dataManager = new DataManager(0, strDbHost, strDbName, strId, strPw);
        }

        private void GetRequestFromDB()
        {
            if (m_dataManager == null || m_modbusManager == null)
                return;

            if (m_modbusManager.Requests != null)
                return;

            string strQuery = ConfigurationManager.AppSettings.Get("Query");

            int requestCount;

            string strErrorMessage;
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);

            if (results == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return;
            }

            int startAddr;
            int min = 100, max = -1;

            Dictionary<int, int> dicStartAddress = new Dictionary<int, int>();

            foreach (var item in results)
            {
                if (item.startAddr == null)
                    continue;

                if (int.TryParse(item.startAddr.ToString().Trim(), out startAddr))
                {
                    dicStartAddress[startAddr] = startAddr;

                    if (min > max)
                    {
                        min = max = startAddr;
                    }
                    else
                    {
                        if (min > startAddr)
                        {
                            min = startAddr;
                        }

                        if (max < startAddr)
                        {
                            max = startAddr;
                        }
                    }
                }
            }

            if (max >= min)
            {
                // Key : Start Address
                // Value : Request Count
                Dictionary<int, int> dicRequests = new Dictionary<int, int>();

                int endIndex = GetNext(max, out requestCount);

                for (int i=min;i<endIndex;)
                {
                    int next = GetNext(ref i, max, dicStartAddress, out requestCount);

                    if (next < 0)
                    {
                        m_modbusManager.Requests = null;
                        return;
                    }

                    dicRequests[i] = requestCount;
                    i = next;
                }

                m_modbusManager.Requests = dicRequests;
            }
        }

        private int GetNext(ref int data, int max, Dictionary<int, int> dicStartAddress, out int requestCount)
        {
            int next = -1;

            if (data % 100 == 0)
            {
                next = data + 1;
            }

            int end = (data + 100) / 100 * 100;
            next = end + 1;

            bool find = false;

            while (find == false)
            {
                for (int i = data; i < next && i <= max; i++)
                {
                    if (dicStartAddress.ContainsKey(i))
                    {
                        find = true;
                        data = i;
                        break;
                    }
                }

                if (find == false)
                {
                    data = next;
                    next += 100;

                    if (data > max)
                        break;
                }
            }

            if (find == false)
            {
                requestCount = 0;
                return -1;
            }

            return GetNext(data, out requestCount);
        }

        private int GetNext(int data, out int requestCount)
        {
            if (data % 100 == 0)
            {
                requestCount = 1;
                return data + 1;
            }

            int end = (data + 100) / 100 * 100;
            requestCount = end - data + 1;
            return end + 1;
        }
    }
}
