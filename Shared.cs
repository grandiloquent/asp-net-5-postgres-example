using System.Reflection;
using System.Text.RegularExpressions;

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
        public static object CallStaticMethod(Type t, string name, object?[]? parameters)
        {
            var m = t.GetMethod(name, BindingFlags.Public | BindingFlags.Static);

            return m != null ? m.Invoke(null, parameters) : string.Empty;
        }
          private static string Base64UrlEncode(byte[] input)
        {
            return Base64UrlEncode(input, offset: 0, count: input.Length);
        }

        private static string Base64UrlEncode(byte[] input, int offset, int count)
        {
            // Special-case empty input
            if (count == 0)
            {
                return string.Empty;
            }

            var buffer = new char[GetArraySizeRequiredToEncode(count)];
            var numBase64Chars = Base64UrlEncode(input, offset, buffer, outputOffset: 0, count: count);

            return new String(buffer, startIndex: 0, length: numBase64Chars);
        }
        private static int GetArraySizeRequiredToEncode(int count)
        {
            var numWholeOrPartialInputBlocks = checked(count + 2) / 3;
            return checked(numWholeOrPartialInputBlocks * 4);
        }
        private static int Base64UrlEncode(byte[] input, int offset, char[] output, int outputOffset, int count)
        {
            var arraySizeRequired = GetArraySizeRequiredToEncode(count);


            // Special-case empty input.
            if (count == 0)
            {
                return 0;
            }

            // Use base64url encoding with no padding characters. See RFC 4648, Sec. 5.

            // Start with default Base64 encoding.
            var numBase64Chars = Convert.ToBase64CharArray(input, offset, count, output, outputOffset);

            // Fix up '+' -> '-' and '/' -> '_'. Drop padding characters.
            for (var i = outputOffset; i - outputOffset < numBase64Chars; i++)
            {
                var ch = output[i];
                if (ch == '+')
                {
                    output[i] = '-';
                }
                else if (ch == '/')
                {
                    output[i] = '_';
                }
                else if (ch == '=')
                {
                    // We've reached a padding character; truncate the remainder.
                    return i - outputOffset;
                }
            }

            return numBase64Chars;
        }

        public static string GetHashForString(this string str)
        {
            // https://github.com/aspnet/Mvc/blob/master/src/Microsoft.AspNetCore.Mvc.Razor/Infrastructure/DefaultFileVersionProvider.cs
            using (var sha256 = SHA256.Create())
            {
                var hash = sha256.ComputeHash(new UTF8Encoding(false).GetBytes(str));
                return Base64UrlEncode(hash);
            }
        }
        public static string SubstringAfterLast(this string s, string delimiter, string missingDelimiterValue = null)
        {
            var index = s.LastIndexOf(delimiter, StringComparison.Ordinal);
            if (index == -1) return missingDelimiterValue ?? s;
            var pieces = s.AsSpan();
            return pieces[(index + delimiter.Length)..].ToString();
        }
         public static List<Tuple<int, string, string>>
                    ParseStringTemplate(this string str)
        {
            // {{key}}
            var span = str.AsSpan();
            var lines = new List<Tuple<int, string, string>>();
            var offset = 0;
            for (int i = 0; i < span.Length; i++)
            {
                if (span[i] == '{' && span[i + 1] == '{')
                {
                    lines.Add(new Tuple<int, string, string>(
                        0, span.Slice(offset, i - offset).ToString(), string.Empty));
                    i += 2;
                    offset += i - offset;
                    while (i + 1 < span.Length && span[i] != '}' && span[i + 1] != '}')
                    {
                        i++;
                    }

                    if (i + 1 < span.Length)
                    {
                        var key = span.Slice(offset, i - offset + 1);
                        var value = string.Empty;
                        // 类型1 {{Key}} 读取传入数据的Key字段
                        var type = 1;
                        // 类型 2: {{!key}}
                        // 类型 3: {{key || key}}
                        // 类型 4: {{|key}}
                        // 类型 5: {{.key}}
                        // 类型 6: {{/key}}
                        // 类型 7: {{%key}}
                        // 类型 8: {{^key}}
                        // 类型 9: {{~key}}
                        // 类型 10: {{@key}}

                        if (key[0] == '!')
                        {
                            // 类型2 {{!Key<保留值>}} 测试传入数据的Key字段是否为空，非空时返回<保留值>
                            type = 2;
                            value = key.SubstringAfterKeep("<").ToString();
                            key = key[1..].SubstringBefore("<");
                        }
                        else if (key.IndexOf("||") != -1)
                        {
                            // 类型3 {{Key||值}} 测试传入数据的Key字段是否为空，非空时返回Key字段的值，否则返回值
                            type = 3;
                            value = key.SubstringAfter("||").ToString();
                            key = key.SubstringBefore("||").Trim();
                        }
                        else if (key[0] == '|')
                        {
                            type = 4;
                            value = string.Empty;
                            key = key[1..].Trim().ToString();
                        }
                        else if (key[0] == '.')
                        {
                            type = 5;
                            value = string.Empty;
                            key = key[1..].Trim().ToString();
                        }
                        else if (key[0] == '/')
                        {
                            // 类型6 {{/Key}} Key字段值转化为时间字符串
                            type = 6;
                            value = string.Empty;
                            key = key[1..].Trim().ToString();
                        }
                        else if (key[0] == '%')
                        {
                            // 类型7 {{%Key}} 逃逸Key字段的值
                            type = 7;
                            value = string.Empty;
                            key = key[1..].Trim().ToString();
                        }
                        else if (key[0] == '^')
                        {
                            // 类型7 {{^Key}} 转化数据为字符串
                            type = 8;
                            value = string.Empty;
                            key = key[1..].Trim().ToString();
                        }
                        else if (key[0] == '~')
                        {
                            // 类型9 {{~Key}} 转化Key字符的值为Markdown
                            type = 9;
                            value = string.Empty;
                            key = key[1..].Trim().ToString();
                        }
                        else if (key[0] == '@')
                        {
                            type = 10;
                            var index = key.IndexOf('=');
                            value =
                                index != -1 ? key[(index + 1)..].ToString() : string.Empty;
                            key = index != -1
                                ? key.Slice(1, index - 1).Trim().ToString()
                                : key[1..].Trim();
                        }
                        else if (key[0] == '$')
                        {
                            type = 11;
                            value = key.SubstringAfter("|").ToString();
                            key = key.SubstringBefore("|")[1..].ToString();
                        }


                        lines.Add(
                            new Tuple<int, string, string>(type, key.ToString(), value));
                        offset += i - offset + 3;
                    }
                }
            }

            if (span.Length > offset)
            {
                lines.Add(new Tuple<int, string, string>(
                    0, span.Slice(offset, span.Length - offset).ToString(),
                    string.Empty));
            }

            return lines;
        }
         public static string Undercore(string value)
         {
             if (value == null) return null;
             return Regex.Replace(Regex.Replace(value, " ", "_").ToLower(), "\\W+", "");
         }
         public static string FormatDuration(long duration)
         {
             int h = (int)(duration / 3600);
             int m = (int)(duration % 3600 / 60);
             int s = (int)(duration % 3600 % 60);
             var v = string.Empty;
             if (h > 0)
             {
                 v = $"{h}时{m}分";
             }
             else
             {
                 v = $"{m}分";
             }
             if (s > 0)
             {
                 v += $"{s}秒";
             }
             return v;
         }
         private static Dictionary<string, string> topics = new Dictionary<string, string>(){
             {"photoshop","Photoshop"},
             {"android","Android"},
             {"illustrator","Illustrator"},
             {"marketing","营销"},
             {"c","C"},
             {"web_development","Web开发"},
         };
         public static string FormatCategory(String value)
         {
             foreach (var item in topics.Keys)
             {
                 if (topics[item] == value)
                 {
                     return item;
                 }
             }
             return string.Empty;
         }
         public static string GetCategory(String value)
         {
             if (topics.TryGetValue(value, out var t))
             {
                 return t;
             }
             return string.Empty;
         }
    }
}