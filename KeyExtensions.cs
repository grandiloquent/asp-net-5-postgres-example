using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Psycho
{
    public static class KeyExtensions
    {
        private static readonly char[] HexChars =
        {
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F'
        };

        public static string ComputeMd5(this string signString)
        {
            var bytes = MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(signString));
            //Span<char> result = stackalloc char[32];
            char[] result = new char[32];
            var j = 0;
            for (var i = 0; i < 16; i++)
            {
                var value = (int) bytes[i];
                result[j++] = HexChars[value / 16];
                result[j++] = HexChars[value % 16];
            }

            return new string(result);
        }

        public static string? AESEncrypt(string data, string key)
        {
            using MemoryStream memory = new();
            using Aes aes = Aes.Create();
            byte[] plainBytes = Encoding.UTF8.GetBytes(data);
            byte[] bKey = new byte[32];
            Array.Copy(Encoding.UTF8.GetBytes(key.PadRight(bKey.Length)), bKey, bKey.Length);

            aes.Mode = CipherMode.ECB;
            aes.Padding = PaddingMode.PKCS7;
            aes.KeySize = 256;
            aes.Key = bKey;

            using CryptoStream cryptoStream =
                new(memory, aes.CreateEncryptor(), CryptoStreamMode.Write);
            try
            {
                cryptoStream.Write(plainBytes, 0, plainBytes.Length);
                cryptoStream.FlushFinalBlock();
                return Convert.ToBase64String(memory.ToArray());
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string? AESDecrypt(string? data, string key)
        {
            byte[] encryptedBytes = Convert.FromBase64String(data);
            byte[] bKey = new byte[32];
            Array.Copy(Encoding.UTF8.GetBytes(key.PadRight(bKey.Length)), bKey, bKey.Length);

            using MemoryStream memory = new(encryptedBytes);
            using Aes aes = Aes.Create();
            aes.Mode = CipherMode.ECB;
            aes.Padding = PaddingMode.PKCS7;
            aes.KeySize = 256;
            aes.Key = bKey;

            using CryptoStream cryptoStream =
                new(memory, aes.CreateDecryptor(), CryptoStreamMode.Read);
            try
            {
                byte[] tmp = new byte[encryptedBytes.Length];
                var len = cryptoStream.Read(tmp, 0, encryptedBytes.Length);
                byte[] ret = new byte[len];
                Array.Copy(tmp, 0, ret, 0, len);

                return Encoding.UTF8.GetString(ret, 0, len);
            }
            catch (Exception)
            {
                return null;
            }
        }


        public static string GenerateRandomNumberString(this int length)
        {
            var coupon = new StringBuilder();
            var rng = new RNGCryptoServiceProvider();
            var rnd = new byte[1];
            var n = 0;
            while (n < length)
            {
                rng.GetBytes(rnd);
                var c = (char) rnd[0];
                if (c <= 57 && c >= 48)
                {
                    ++n;
                    coupon.Append(c);
                }
            }

            return coupon.ToString();
        }

        
        // 计算MD5值
        public static string EncryptString(string str)
        {
            var md5 = MD5.Create();
            // 将字符串转换成字节数组
            var byteOld = Encoding.UTF8.GetBytes(str);
            // 调用加密方法
            var byteNew = md5.ComputeHash(byteOld);
            // 将加密结果转换为字符串
            var sb = new StringBuilder();
            foreach (var b in byteNew)
            {
                // 将字节转换成16进制表示的字符串，
                sb.Append(b.ToString("x2"));
            }

            // 返回加密的字符串
            return sb.ToString();
        }

        public static string NewSalt(int length = 8, bool numberOnly = true) => GetRandomString(length, numberOnly);

        public static string GetRandomString(int length, bool numberOnly = false)
        {
            StringBuilder sb = new StringBuilder(length);
            for (int i = 0; i < length; i++)
            {
                sb.Append(GetRandomChar(numberOnly));
            }

            return sb.ToString();
        }

        static Random m_rnd = new Random();

        static char GetRandomChar(bool numberOnly = false)
        {
            int[][] charsets = new int[][]
            {
                new int[] {48, 58}, // 0-9
                new int[] {65, 91}, // A-Z
                new int[] {97, 123}
            }; // a-z
            short startIndex = 3;
            if (numberOnly)
                startIndex = 1;
            int charsetIndex = m_rnd.Next(0, startIndex);
            return (char) m_rnd.Next(
                charsets[charsetIndex][0],
                charsets[charsetIndex][1]);
        }

        public static string Md5String(string content)
        {
            byte[] inputBytes = Encoding.ASCII.GetBytes(content);
            using (var md5 = MD5.Create())
            {
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }

                return sb.ToString();
            }
        }
    }
}