using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Dom;
using Microsoft.Net.Http.Headers;

namespace Psycho
{
    public class CkClient
    {
        private readonly HttpClient _client;

        public CkClient(HttpClient client)
        {
            _client = client;
            _client.BaseAddress = new Uri("https://user.seven301.xyz:8899");
            _client.DefaultRequestHeaders.Add(HeaderNames.UserAgent,
                "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36");
        }

        public async Task<string> GetBaseAddress()
        {
            var hp = new HttpRequestMessage(HttpMethod.Head, "/?u=http://52ck.cc/&p=/");
            var rs = await _client.SendAsync(hp);
            return rs.Headers.TryGetValues(HeaderNames.Location, out var values) ? values.FirstOrDefault() : null;
        }

        public async Task<List<Video>> GetVideos(int max)
        {
            var baseUrl = await GetBaseAddress();
            const int maxConcurrency = 2;
            var messages = new List<string>();
            for (int i = 0; i < max; i++)
            {
                messages.Add($"{baseUrl}vodtype/2-{i + 1}.html");
            }

            using var concurrencySemaphore = new SemaphoreSlim(maxConcurrency);
            var tasks = new List<Task<Task<List<Video>>>>();
            foreach (var msg in messages)
            {
                await concurrencySemaphore.WaitAsync();

                var t = Task.Factory.StartNew(async () =>
                {
                    try
                    {
                        var result = await _client.GetAsync(msg);
                        var config = Configuration.Default;
                        var context = BrowsingContext.New(config);
                        using var sr = new StreamReader(await result.Content.ReadAsStreamAsync(), Encoding.UTF8);
                        var source = await sr.ReadToEndAsync();

                        var document = await context.OpenAsync(req => req.Content(source));
                        var items = document.QuerySelectorAll(".stui-vodlist li");
                        var list = new List<Video>();
                        foreach (var element in items)
                        {
                            var thumb = element.QuerySelector(".stui-vodlist__thumb");
                            var videoUrl = thumb
                                .GetAttribute("href");
                            var videoTitle = WebUtility.HtmlDecode(element.QuerySelector(".title a")
                                .GetAttribute("title"));
                            var videoThumb = thumb.GetAttribute("data-original");
                            var durationString = thumb.QuerySelector(".text-right").Text().Trim();
                            var datetime = element.QuerySelector(".sub").ChildNodes
                                .Last(i => i.NodeType == NodeType.Text).Text().Trim();
                            var duration = 0;
                            try
                            {
                                duration = DurationToSeconds(durationString);
                            }
                            catch (Exception e)
                            {
                            }

                            Video videoItem = new(
                                videoTitle,
                                videoUrl,
                                videoThumb)
                            {
                                Duration = duration,
                                PublishDate = datetime
                            };
                            list.Add(videoItem);
                        }

                        return list;
                    }
                    finally
                    {
                        concurrencySemaphore.Release();
                    }
                });

                tasks.Add(t);
            }

            var results = await Task.WhenAll(tasks.ToArray());
            return results.SelectMany(vResult => vResult.Result).ToList();
        }

        static int DurationToSeconds(string value)
        {
            var s = value.AsSpan();
            var index = -1;

            var count = 0;
            var seconds = 0;
            do
            {
                index = s.LastIndexOf(":");
                seconds += int.Parse(s[(index + 1)..]) * (int) Math.Pow(60, count++);
                if (index != -1)
                    s = s[..index];
            } while (index != -1);

            return seconds;
        }
    }
}