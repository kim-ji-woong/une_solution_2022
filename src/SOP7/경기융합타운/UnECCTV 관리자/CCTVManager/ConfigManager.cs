using System.IO;
using System.Text;

namespace CCTVManager
{
    class ConfigManager
    {
        private static string m_strFilePath = "data.cfg";

        public static bool GetData(out string strUrl, out string strTitle, out int x, out int y, out int id)
        {
            strUrl = strTitle = null;
            x = y = id = 0;
            bool readUrl = false, readTitle = false;
            bool readLocation = false, readID = false;

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

                    if (strLine.StartsWith("url"))
                    {
                        strUrl = strValue;
                        readUrl = true;
                    }
                    else if (strLine.StartsWith("title"))
                    {
                        strTitle = strValue;
                        readTitle = true;
                    }
                    else if (strLine.StartsWith("location"))
                    {
                        string[] tokens = strValue.Split(',');

                        if (tokens.Length == 2)
                        {
                            if (int.TryParse(tokens[0].Trim(), out x) && int.TryParse(tokens[1].Trim(), out y))
                            {
                                readLocation = true;
                            }
                        }
                    }
                    else if (strLine.StartsWith("id"))
                    {
                        if (int.TryParse(strValue, out id))
                        {
                            readID = true;
                        }
                    }
                }

                reader.Close();
            }

            return readUrl && readTitle && readLocation && readID;
        }

        public static void SetData(string strUrl, string strTitle, string strLocation, string strID)
        {
            int x, y, id;

            string[] tokens = strLocation.Split(',');

            if (tokens.Length == 2)
            {
                if (int.TryParse(tokens[0].Trim(), out x) && int.TryParse(tokens[1].Trim(), out y))
                {
                    if (int.TryParse(strID, out id))
                    {
                        StreamWriter writer = new StreamWriter(m_strFilePath, false, Encoding.UTF8);

                        writer.WriteLine("url : " + strUrl);
                        writer.WriteLine("title : " + strTitle);
                        writer.WriteLine("location : " + strLocation);
                        writer.WriteLine("id : " + strID);
                        writer.Close();
                    }
                }
            }
        }
    }
}
