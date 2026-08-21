using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace RTSPViewer
{
    static class Program
    {
        /// <summary>
        /// 해당 애플리케이션의 주 진입점입니다.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            int? x, y, width, height;
            string strUrl;

            if (ParseParameters(args, out x, out y, out width, out height, out strUrl) == false)
            {
                x = y = width = height = null;
                strUrl = null;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new FormMain(x, y, width, height, strUrl));
        }

        private static bool ParseParameters(string[] args, out int? x, out int? y, out int? width, out int? height, out string strUrl)
        {
            strUrl = null;
            x = y = width = height = null;
            int _x, _y, _width, _height;

            int paramCount = args.Length;

            if (paramCount >= 1)
            {
                if (int.TryParse(args[0].Trim(), out _x))
                    x = _x;
                else
                {
                    if (args[0].Trim().ToLower() != "null")
                        return false;
                }
            }

            if (paramCount >= 2)
            {
                if (int.TryParse(args[1].Trim(), out _y))
                    y = _y;
                else
                {
                    if (args[1].Trim().ToLower() != "null")
                        return false;
                }
            }

            if (paramCount >= 3)
            {
                if (int.TryParse(args[2].Trim(), out _width))
                    width = _width;
                else
                {
                    if (args[2].Trim().ToLower() != "null")
                        return false;
                }
            }

            if (paramCount >= 4)
            {
                if (int.TryParse(args[3].Trim(), out _height))
                    height = _height;
                else
                {
                    if (args[3].Trim().ToLower() != "null")
                        return false;
                }
            }

            if (paramCount >= 5)
                strUrl = args[4].Trim();

            return true;
        }
    }
}
