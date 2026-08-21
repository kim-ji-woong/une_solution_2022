using System;
using System.Collections.Generic;
using System.IO;
using System.Globalization;

namespace LogSimulator.Utility
{
    class LogManager
    {
        public static List<byte[]> GetByteList(string strPath, string strTag)
        {
            List<byte[]> byteList = new List<byte[]>();

            StreamReader reader = new StreamReader(strPath, false);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                byte[] bytes = GetBytes(strLine, strTag);

                if (bytes != null)
                    byteList.Add(bytes);
            }

            reader.Close();
            return byteList;
        }

        public static byte[] GetBytes(string strLine, string strTag)
        {
            if (strTag != null && strTag.Length > 0)
            {
                int index1 = strLine.IndexOf(strTag);

                if (index1 < 0)
                    return null;

                strLine = strLine.Substring(index1 + strTag.Length).Trim();
            }

            string[] tokens = strLine.Split(' ');
            byte[] bytes = new byte[tokens.Length];
            int index = 0;
            byte b;

            foreach (string strToken in tokens)
            {
                if (byte.TryParse(strToken.Trim(), NumberStyles.HexNumber, null, out b))
                {
                    bytes[index++] = b;
                }
            }

            if (index == 0)
                return null;

            byte[] results = new byte[index];

            for (int i = 0; i < index; i++)
                results[i] = bytes[i];

            return results;
        }
    }
}
