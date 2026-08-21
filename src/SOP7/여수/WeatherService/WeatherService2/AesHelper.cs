using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherService2
{
    public class AesHelper
    {
        private const int KeySize = 32;

        private static char[] BaseArr = MakeBaseArray();

        private static char[] MakeBaseArray()
        {
            char[] arr = new char[62];
            int i = 0;

            for (char ch = '0'; ch <= '9'; ch++)
            {
                arr[i++] = ch;
            }

            for (char ch = 'a'; ch <= 'z'; ch++)
            {
                arr[i++] = ch;
            }

            for (char ch = 'A'; ch <= 'Z'; ch++)
            {
                arr[i++] = ch;
            }

            return arr;
        }

        public static string MakeRandomKey(long? num)
        {
            string strKey = "";
            int max = BaseArr.Length - 1;

            int seed = num == null ? DateTime.Now.GetHashCode() : (int)num;
            Random rand = new Random(seed);

            for (int i = 0; i < KeySize; i++)
            {
                int nIndex = rand.Next(max);
                strKey += BaseArr[nIndex];
            }

            return strKey;
        }

        /// <summary>  
        /// AES encryption algorithm  
        /// </summary>  
        /// <param name="input">plain string</param>  
        /// <param name="key">key (32 bit)</param>  

        public static string Encrypt(string input, string key)
        {
            byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
            using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
            {
                aesAlg.Key = keyBytes;
                aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                System.Security.Cryptography.ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream())
                {
                    using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, encryptor, System.Security.Cryptography.CryptoStreamMode.Write))
                    {
                        using (System.IO.StreamWriter swEncrypt = new System.IO.StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(input);
                        }
                        byte[] bytes = msEncrypt.ToArray();
                        return ByteArrayToHexString(bytes);
                    }
                }
            }
        }

        /// <summary>  
        /// AES decryption  
        /// </summary>  
        /// <param name="input"> ciphertext byte array</param>  
        /// <param name="key">key (32 bit)</param>  
        /// <returns> returns the decrypted string</returns>  
        public static string Decrypt(string input, string key)
        {
            byte[] inputBytes = HexStringToByteArray(input);
            byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
            using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
            {
                aesAlg.Key = keyBytes;
                aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                System.Security.Cryptography.ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream(inputBytes))
                {
                    using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, decryptor, System.Security.Cryptography.CryptoStreamMode.Read))
                    {
                        using (System.IO.StreamReader srEncrypt = new System.IO.StreamReader(csEncrypt))
                        {
                            return srEncrypt.ReadToEnd();
                        }
                    }
                }
            }
        }

        public static string GetHashCode(string input)
        {
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(input);
            byte[] hashed = System.Security.Cryptography.SHA256.Create().ComputeHash(bytes);

            string strHashed = "";

            foreach (byte b in hashed)
            {
                strHashed += string.Format("{0:x2}", b);
            }

            return strHashed;
        }

        /// <summary>
        /// Convert the specified hex string to a byte array
        /// </summary>
        /// <param name="s">hexadecimal string (eg "7F 2C 4A" or "7F2C4A")</param>
        /// <returns>byte array corresponding to hexadecimal string</returns>
        public static byte[] HexStringToByteArray(string s)
        {
            s = s.Replace(" ", "");
            byte[] buffer = new byte[s.Length / 2];
            for (int i = 0; i < s.Length; i += 2)
                buffer[i / 2] = (byte)Convert.ToByte(s.Substring(i, 2), 16);
            return buffer;
        }

        /// <summary>
        /// Convert a byte array into a formatted hex string
        /// </summary>
        /// <param name="data">byte array</param>
        /// <returns> formatted hexadecimal string</returns>
        public static string ByteArrayToHexString(byte[] data)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder(data.Length * 3);
            foreach (byte b in data)
            {
                //hexadecimal number
                sb.Append(Convert.ToString(b, 16).PadLeft(2, '0'));
                //16 digits separated by spaces
                //sb.Append(Convert.ToString(b, 16).PadLeft(2, '0').PadRight(3, ' '));
            }
            return sb.ToString().ToUpper();
        }
    }
}
