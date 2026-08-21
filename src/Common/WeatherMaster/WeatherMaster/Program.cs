using System;
using System.Windows.Forms;

namespace WeatherMaster
{
    static class Program
    {
        private static TrayManager m_trayManager = null;

        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            m_trayManager = new TrayManager();
            Application.Run();
        }
    }
}
