using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace SoPluginContainer
{
    /// <summary>
    /// LoginWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class LoginWindow : Window
    {
        public LoginWindow()
        {
            InitializeComponent();
        }

        public string UserID { get; private set; }
        public string Password { get; private set; }
        public string ServerIP { get; private set; }

        public int ServerPort { get; private set; }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var userID = UserTextBox.Text;
            var password = PassTextBox.Password;
            var serverIP = ServerIPTextBox.Text;
            var serverPortStr = PortTextBox.Text;

            if (string.IsNullOrWhiteSpace(serverIP) || string.IsNullOrWhiteSpace(serverPortStr) || string.IsNullOrWhiteSpace(userID) || string.IsNullOrWhiteSpace(password))
            {
                MessageBox.Show(this, "서버 계정 및 연결 정보를 입력하세요");
                return;
            }

            int serverPort = 8020;
            int.TryParse(serverPortStr, out serverPort);

            UserID = userID;
            Password = password;
            ServerIP = serverIP;
            ServerPort = serverPort;

            DialogResult = true;

            this.Close();
        }
    }
}
