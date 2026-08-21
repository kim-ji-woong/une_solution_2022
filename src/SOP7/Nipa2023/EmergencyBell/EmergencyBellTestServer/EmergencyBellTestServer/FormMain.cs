using System;
using System.IO;
using System.Text;
using System.Windows.Forms;
using System.Collections.Generic;

namespace EmergencyBellTestServer
{
    public partial class FormMain : Form
    {
        private string FileName = "memory.dat";

        private Network.NetworkManager m_netMgr = null;
        private CheckBox[] m_checkBoxes = null;

        private static FormMain m_instance = null;

        public static FormMain Instance
        {
            get { return m_instance; }
        }

        public FormMain()
        {
            m_instance = this;
            InitializeComponent();
            ReadMemory();

            m_checkBoxes = new CheckBox[30] { checkBoxSensor1, checkBoxSensor2, checkBoxSensor3, checkBoxSensor4, checkBoxSensor5, checkBoxSensor6, checkBoxSensor7, checkBoxSensor8, checkBoxSensor9, checkBoxSensor10, checkBoxSensor11, checkBoxSensor12, checkBoxSensor13, checkBoxSensor14, checkBoxSensor15, checkBoxSensor16, checkBoxSensor17, checkBoxSensor18, checkBoxSensor19, checkBoxSensor20, checkBoxSensor21, checkBoxSensor22, checkBoxSensor23, checkBoxSensor24, checkBoxSensor25, checkBoxSensor26, checkBoxSensor27, checkBoxSensor28, checkBoxSensor29, checkBoxSensor30 };
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            string strPort = this.textBoxPort.Text.Trim();

            if (strPort.Length == 0)
            {
                this.textBoxPort.Focus();
                MessageBox.Show("Port를 입력하세요.");
                return;
            }

            int port;

            if (int.TryParse(strPort, out port) == false || port <= 0)
            {
                this.textBoxPort.Focus();
                MessageBox.Show("Port는 0보다 큰 정수만 입력 가능합니다.");
                return;
            }

            WriteMemory(strPort);
            btnStart.Enabled = false;

            m_netMgr = new Network.NetworkManager();
            m_netMgr.Start(port);
        }

        private void ReadMemory()
        {
            if (File.Exists(FileName))
            {
                StreamReader reader = new StreamReader(FileName, Encoding.UTF8);

                while (reader.EndOfStream == false)
                {
                    string strLine = reader.ReadLine();

                    if (strLine == null)
                        break;

                    strLine = strLine.Trim().ToLower();

                    if (strLine.Length == 0)
                        continue;

                    if (strLine.StartsWith("port"))
                    {
                        string strPort = GetValue(strLine, "port");
                        this.textBoxPort.Text = strPort;
                    }
                }

                reader.Close();
            }
        }

        private string GetValue(string strSrc, string strTrg)
        {
            return strSrc.Substring(strTrg.Length + 1).Trim();
        }

        private void WriteMemory(string strPort)
        {
            StreamWriter writer = new StreamWriter(FileName, false, Encoding.UTF8);
            writer.WriteLine("port " + strPort);
            writer.Close();
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            string strSend = textBoxSend.Text.Trim();

            if (strSend.Length == 0)
                return;

            string[] tokens = strSend.Split(' ');
            byte[] bytes = new byte[tokens.Length + 1];
            int index = 0;
            int sum = 0;

            foreach (string strToken in tokens)
            {
                bytes[index++] = System.Convert.ToByte(strToken.Trim(), 16);
                sum += (int)bytes[index - 1];
            }

            if (index > 0)
            {
                byte checkSum = (byte)(sum % 256);
                bytes[index++] = checkSum;
                m_netMgr.Send(bytes, 0, index);
            }

            textBoxSend.Text = "";
        }

        public List<int> GetAlarmSensors()
        {
            List<int> sensors = new List<int>();

            this.Invoke((MethodInvoker)delegate
            {
                for (int i = 0; i < m_checkBoxes.Length; i++)
                {
                    if (m_checkBoxes[i].Checked)
                        sensors.Add(i + 1);
                }
            });

            return sensors;
        }

        public void ClearAlarms()
        {
            this.Invoke((MethodInvoker)delegate
            {
                for (int i = 0; i < m_checkBoxes.Length; i++)
                {
                    if (m_checkBoxes[i].Checked)
                        m_checkBoxes[i].Checked = false;
                }
            });
        }
    }
}
