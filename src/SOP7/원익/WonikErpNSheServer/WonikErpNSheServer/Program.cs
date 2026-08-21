using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WonikErpNSheServer
{
    static class Program
    {
        private static TrayManager m_trayManager = null;

        /// <summary>
        /// 해당 애플리케이션의 주 진입점입니다.
        /// </summary>
        [STAThread]
        static void Main()
        {
#if SERVICE
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new WonikErpNSheService()
            };
            ServiceBase.Run(ServicesToRun);
#elif BACKUP
            m_trayManager = new TrayManager();
            Application.Run();
#else
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Form1());
#endif
        }
    }
}
