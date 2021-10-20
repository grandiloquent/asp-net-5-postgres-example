using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Psycho
{
    [ApiController]
    [Route("/api/{controller}")]
    public class UserController : Controller
    {
        [HttpPost("login")]
        public object Login([FromForm] string username, [FromForm] string password)
        {
            var cookieUserName = CookieHelper.CheckCookie(Request);
            if (!string.IsNullOrWhiteSpace(cookieUserName))
            {
                return new
                {
                    UserName = cookieUserName
                };
            }

            if (username == "psycho" && password == "991578")
            {
                CookieHelper.Login("psycho", Response, true);
                if (HttpContext.Request.Headers.TryGetValue("Referer", out var uri))
                {
                    return new RedirectResult(WebUtility.UrlDecode(uri[0].SubstringAfter("?ReturnUrl=")));
                }
            }

            return NoContent();
        }
    }
}