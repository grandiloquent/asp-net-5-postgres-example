using System;
using Microsoft.AspNetCore.Http;

namespace Psycho
{
    public static class CookieHelper
    {
        public static void Login(string username, HttpResponse response, bool isAdmin = false)
        {
            var expires = new DateTimeOffset(DateTime.UtcNow).AddYears(1);
            var cookieOptions = new CookieOptions()
            {
                Path = "/",
                Expires = expires,
                HttpOnly = false
            };
            var cookieValue = $"{username}|{(isAdmin ? "Admin" : "User")}|{expires.Millisecond.ToString()}";
            response.Cookies.Append("Cookie", KeyExtensions.AESEncrypt(cookieValue, "psycho_euphoria"), cookieOptions);
        }


        public static string CheckCookie(HttpRequest request)
        {
            if (!request.Cookies.TryGetValue("Cookie", out var cookie)) return string.Empty;
            try
            {
                var value = KeyExtensions.AESDecrypt(cookie, "psycho_euphoria");

                return (value.Contains($"|User|") || value.Contains($"|Admin|"))
                    ? value.AsSpan().SubstringBefore("|").ToString()
                    : string.Empty;
            }
            catch (System.Exception)
            {
                // ignored
            }

            return string.Empty;
        }

        public static bool Check(string username, HttpRequest request, bool isAdmin = false)
        {
            if (!request.Cookies.TryGetValue("Cookie", out var cookie)) return false;
            try
            {
                var value = KeyExtensions.AESDecrypt(cookie, "psycho_euphoria");
                //Console.WriteLine(value+$"{username}|{(isAdmin ? "Admin" : "User")}|"+value.StartsWith($"{username}|{(isAdmin ? "Admin" : "User")}|"));

                return value.StartsWith($"{username}|{(isAdmin ? "Admin" : "User")}|");
            }
            catch (System.Exception)
            {
                // ignored
            }

            return false;
        }
    }
}