using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media;
using S1.Frameworks.Commands;

namespace SoPluginContainer
{
    /// <summary>
    /// App.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class App : Application
    {
        
        private static TrayManager m_trayManager = null;

        public App()
        {
            AppDomain currentDomain = AppDomain.CurrentDomain;
            var probingPath = System.AppDomain.CurrentDomain.BaseDirectory + "\\DLLs;";
            currentDomain.AppendPrivatePath(probingPath);
        }

        private void Application_Startup(object sender, StartupEventArgs e)
        {
            var envPath = Environment.GetEnvironmentVariable("PATH") + ";" + Environment.CurrentDirectory + ";" + Environment.CurrentDirectory + "\\DLLs";
            Environment.SetEnvironmentVariable("PATH", envPath, EnvironmentVariableTarget.Process);

            this.DispatcherUnhandledException += App_DispatcherUnhandledException;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            LoadFontFamily();

            m_trayManager = new TrayManager();
                
        }

        private void Application_Exit(object sender, ExitEventArgs e)
        {

        }

        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
        }

        private void App_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            e.Handled = true;
        }

        private void LoadFontFamily()
        {
            bool IsChangeFont = true;
            FontFamily fontResource = Resources["NotoSansCJKkrRegular"] as FontFamily;

            if (fontResource != null)
            {
                try
                {
                    GlyphTypeface glytypeFace;
                    Typeface typeFace = new Typeface(fontResource, FontStyles.Normal, FontWeights.Normal, FontStretches.Normal);

                    if (typeFace.TryGetGlyphTypeface(out glytypeFace))
                    {
                        if (fontResource.FamilyNames.Values.Any(t => "Noto Sans CJK KR".Equals(t)))
                        {
                            IsChangeFont = false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Resources.Remove("NotoSansCJKkrRegular");
                }
            }

            if (IsChangeFont == true) // 폰트 변경
            {
                try
                {
                    GlyphTypeface glytypeFace;
                    FontFamily myFont = new FontFamily(new Uri("pack://application:,,,/"), "./Fonts/#Noto Sans");
                    Typeface typeFace = new Typeface(myFont, FontStyles.Normal, FontWeights.Normal, FontStretches.Normal);

                    fontResource = typeFace.TryGetGlyphTypeface(out glytypeFace) ? myFont : null;
                    Resources["NotoSansCJKkrRegular"] = fontResource;
                }
                catch (Exception ex)
                {
                }
            }
        }
    }
}