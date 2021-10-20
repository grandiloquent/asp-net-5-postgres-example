namespace Psycho
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;

    public static class Shared
    {
        private static readonly char[] HexChars =
        {
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F'
        };

        private static readonly Random MRnd = new();
        private const string Rfc822DateFormat = "ddd, dd MMM yyyy HH:mm:ss \\G\\M\\T";

        public static string AesDecrypt(string? data, string key)
        {
            var encryptedBytes = Convert.FromBase64String(data);
            var bKey = new byte[32];
            Array.Copy(Encoding.UTF8.GetBytes(key.PadRight(bKey.Length)), bKey, bKey.Length);
            using MemoryStream memory = new(encryptedBytes);
            using var aes = Aes.Create();
            aes.Mode = CipherMode.ECB;
            aes.Padding = PaddingMode.PKCS7;
            aes.KeySize = 256;
            aes.Key = bKey;
            using CryptoStream cryptoStream =
                new(memory, aes.CreateDecryptor(), CryptoStreamMode.Read);
            try
            {
                var tmp = new byte[encryptedBytes.Length];
                var len = cryptoStream.Read(tmp, 0, encryptedBytes.Length);
                var ret = new byte[len];
                Array.Copy(tmp, 0, ret, 0, len);
                return Encoding.UTF8.GetString(ret, 0, len);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string AesEncrypt(string data, string key)
        {
            using MemoryStream memory = new();
            using var aes = Aes.Create();
            var plainBytes = Encoding.UTF8.GetBytes(data);
            var bKey = new byte[32];
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

        public static bool CheckUniqueId(this string? uniqueId)
        {
            return uniqueId is {Length: 6} && uniqueId.All(i => 97 <= i && i <= 122);
        }

        public static string ComputeMd5(this string signString)
        {
            var bytes = MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(signString));
            //Span<char> result = stackalloc char[32];
            var result = new char[32];
            var j = 0;
            for (var i = 0; i < 16; i++)
            {
                var value = (int) bytes[i];
                result[j++] = HexChars[value / 16];
                result[j++] = HexChars[value % 16];
            }

            return new string(result);
        }

        public static string ConvertToRfc822Format(this DateTime dateTime)
        {
            return dateTime.ToString(Rfc822DateFormat, CultureInfo.GetCultureInfo("en-US"));
        }

        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source,
            Func<TSource, TKey> keySelector)
        {
            var seenKeys = new HashSet<TKey>();
            foreach (var element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
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

        public static string GenerateRandomString(this int length)
        {
            var coupon = new StringBuilder();
            var rng = new RNGCryptoServiceProvider();
            var rnd = new byte[1];
            var n = 0;
            while (n < length)
            {
                rng.GetBytes(rnd);
                var c = (char) rnd[0];
                if (c <= 122 && c >= 97)
                {
                    ++n;
                    coupon.Append(c);
                }
            }

            return coupon.ToString();
        }

        public static string GetRandomString(int length, bool numberOnly = false)
        {
            var sb = new StringBuilder(length);
            for (var i = 0; i < length; i++)
            {
                sb.Append(GetRandomChar(numberOnly));
            }

            return sb.ToString();
        }

        public static long GetUnixTimeStamp(this DateTime dateTime)
        {
            // / TimeSpan.TicksPerSecond
            return ((dateTime.Ticks - 621355968000000000));
        }

        public static string Md5String(string content)
        {
            var inputBytes = Encoding.ASCII.GetBytes(content);
            using var md5 = MD5.Create();
            var hashBytes = md5.ComputeHash(inputBytes);
            // Convert the byte array to hexadecimal string
            var sb = new StringBuilder();
            foreach (var t in hashBytes)
            {
                sb.Append(t.ToString("X2"));
            }

            return sb.ToString();
        }

        public static string NewSalt(int length = 8, bool numberOnly = true) => GetRandomString(length, numberOnly);

        public static string SubstringAfter(this string s, string delimiter, string missingDelimiterValue = null)
        {
            var index = s.IndexOf(delimiter, StringComparison.Ordinal);
            if (index == -1) return missingDelimiterValue ?? s;
            var pieces = s.AsSpan();
            return pieces[(index + delimiter.Length)..].ToString();
        }

        public static ReadOnlySpan<char> SubstringAfter(this ReadOnlySpan<char> s, string delimiter)
        {
            var index = s.IndexOf(delimiter);
            return index == -1 ? s : s[(index + delimiter.Length)..];
        }

        public static ReadOnlySpan<char> SubstringAfterKeep(this ReadOnlySpan<char> s, string delimiter)
        {
            var index = s.IndexOf(delimiter);
            return index == -1 ? s : s[index..];
        }

        public static ReadOnlySpan<char> SubstringBefore(this ReadOnlySpan<char> s, string delimiter)
        {
            var index = s.IndexOf(delimiter);
            return index == -1 ? s : s[..index];
        }

        public static string SubstringBeforeLast(this string s, char delimiter, string missingDelimiterValue = null)
        {
            var index = s.LastIndexOf(delimiter);
            if (index == -1) return missingDelimiterValue ?? s;
            return s.AsSpan()[..index].ToString();
        }

        static char GetRandomChar(bool numberOnly = false)
        {
            var charsets = new[]
            {
                new[] {48, 58}, // 0-9
                new[] {65, 91}, // A-Z
                new[] {97, 123}
            }; // a-z
            short startIndex = 3;
            if (numberOnly)
                startIndex = 1;
            var charsetIndex = MRnd.Next(0, startIndex);
            return (char) MRnd.Next(
                charsets[charsetIndex][0],
                charsets[charsetIndex][1]);
        }
    }
}