using System.IO;
using System.Text;

namespace ClientTest
{
    class ConfigManager
    {
        private static string m_strFilePath = "data.cfg";

        public static bool GetConnection(out string strIP, out int port)
        {
            strIP = null;
            port = 0;
            bool readIP = false, readPort = false;

            if (File.Exists(m_strFilePath))
            {
                StreamReader reader = new StreamReader(m_strFilePath, Encoding.UTF8);

                while (reader.EndOfStream == false)
                {
                    string strLine = reader.ReadLine().Trim();

                    if (strLine.Length == 0)
                        continue;

                    int index = strLine.IndexOf(':');

                    if (index <= 0)
                        continue;

                    string strValue = strLine.Substring(index + 1).Trim();

                    if (strLine.StartsWith("ip"))
                    {
                        strIP = strValue;
                        readIP = true;
                    }
                    else if (strLine.StartsWith("port"))
                    {
                        if (int.TryParse(strValue, out port))
                            readPort = true;
                    }
                }

                reader.Close();
            }

            return readIP && readPort;
        }

        public static void SetConnection(string strIP, int port)
        {
            StreamWriter writer = new StreamWriter(m_strFilePath, false, Encoding.UTF8);

            writer.WriteLine("ip : " + strIP);
            writer.WriteLine("port : " + port);
            writer.Close();
        }
    }
}
