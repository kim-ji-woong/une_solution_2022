using System;
using System.Runtime.InteropServices;
using System.ServiceProcess;
using System.Windows.Forms;

namespace WonikLPR
{
    /// <summary>
    /// 진입점.
    /// 프로젝트 조건부 컴파일 상수 SERVICE 정의 여부에 따라 동작 방식이 결정된다.
    ///   SERVICE  정의  : Windows Service 로 동작
    ///   SERVICE  미정의 : WinForm 으로 동작
    /// (csproj DefineConstants 에서 SERVICE / _SERVICE 로 전환)
    /// </summary>
    static class Program
    {
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
                new WonikLPRService()
            };
            ServiceBase.Run(ServicesToRun);
#else
            // 로그를 콘솔에만 출력하므로 WinForm 모드에서는 콘솔 창을 확보한다.
            NativeMethods.EnsureConsole();

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
#endif
        }

        private static class NativeMethods
        {
            private const int ATTACH_PARENT_PROCESS = -1;

            [DllImport("kernel32.dll", SetLastError = true)]
            private static extern bool AttachConsole(int processId);

            [DllImport("kernel32.dll", SetLastError = true)]
            private static extern bool AllocConsole();

            /// <summary>
            /// 부모 콘솔에 연결하고, 없으면 새 콘솔 창을 만든다.
            /// </summary>
            public static void EnsureConsole()
            {
                if (AttachConsole(ATTACH_PARENT_PROCESS) == false)
                {
                    AllocConsole();
                }
            }
        }
    }
}
