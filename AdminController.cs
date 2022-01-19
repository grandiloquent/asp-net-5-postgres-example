using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Psycho
{
    [Route("admin")]
    public class AdminController : Controller
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IService _dataService;

        public AdminController(IService dataService, IWebHostEnvironment environment)
        {
            _dataService = dataService;
            _environment = environment;
        }

        [HttpGet("list")]
        public IActionResult ListVideos()
        {
            var videos = _dataService.GetArticles();
            var enumerable = videos as Article[] ?? videos.ToArray();
            var ls2 = enumerable.Select(video => video.Title).OrderBy(i => i).ToList();
            return Content(string.Join(Environment.NewLine, ls2), "text/plain");
        }

        public static async Task<string> GenerateIndexPage(
            IService dataService, IWebHostEnvironment environment,
            bool release = false
        )
        {
            var content = await System.IO.File.ReadAllTextAsync(Path.Combine(environment.WebRootPath,
                "articles.html"));
            var templates = content.ParseStringTemplate();
            var sb = new StringBuilder();
            Renderers.Renderer(templates, sb, new
            {
                Articles = dataService.GetArticles().OrderByDescending(i => i.UpdatedDate),
                SiteName = "KingPunch Studio",
                Css = release,
                JavaScript = release,
                environment.WebRootPath
            });
            return sb.ToString();
        }

        [HttpGet("articles")]
        public async Task<IActionResult> Index()
        {
            return Content(await GenerateIndexPage(_dataService, _environment),
                "text/html");
        }

        private static async Task<string> GenerateArticlePage(IService dataService, IWebHostEnvironment environment,
            string query, bool release = false)
        {
            var content = await System.IO.File.ReadAllTextAsync(Path.Combine(environment.WebRootPath,
                "article.html"));
            var templates = content.ParseStringTemplate();
            var sb = new StringBuilder();
            var uniqueId = query.SubstringAfterLast("_");
            Renderers.Renderer(templates, sb, new
            {
                Article = dataService.GetArticle(uniqueId),
                SiteName = "KingPunch Studio",
                environment.WebRootPath,
                Css = release,
                JavaScript = release
            });
            return sb.ToString();
        }

        [HttpGet("articles/{query}")]
        public async Task<IActionResult> GetVideo(string query)
        {
            return Content(await GenerateArticlePage(_dataService,
                _environment, query), "text/html");
        }

        [HttpGet("article")]
        public Article GetArticle(string u)
        {
            return _dataService.GetArticle(u);
        }

        [HttpGet("editor")]
        public async Task<IActionResult> VideoEditor()
        {
            var content =
                await System.IO.File.ReadAllTextAsync(System.IO.Path.Combine(_environment.WebRootPath,
                    "editor.html"));
            return Content(content, "text/html");
        }

        [HttpPost]
        public string InsertArticle([FromBody] Article article)
        {
            return _dataService.InsertArticle(article);
        }

        [HttpGet("next")]
        public string Next()
        {
            return _dataService.GetArticles().First(x => x.Category == null).UniqueId;
        }

        [HttpPost("upload")]
        public object Upload([FromForm(Name = "image")] IFormFile file)
        {
            /*using var image = Image.Load(file.OpenReadStream());
            var width = image.Width;
            var height = image.Height;

            if (width > 1000)
            {
                width = 1000;
                height = image.Width / width / image.Height;
            }

            image.Mutate(x => x.Resize(width, height));
            var dir = System.IO.Path.Combine(_environment.WebRootPath, "images");
            var imageFile =
                $"{dir}{System.IO.Path.DirectorySeparatorChar}{DateTime.Now:yyyyMMdd}-{6.GenerateRandomString()}{System.IO.Path.GetExtension(file.FileName)}";
            image.Save(imageFile);
            return new {
                FileName = System.IO.Path.GetFileName(imageFile)
            };*/
            var dir = System.IO.Path.Combine(_environment.WebRootPath, "images");
            var imageFile =
                $"{dir}{System.IO.Path.DirectorySeparatorChar}{DateTime.Now:yyyyMMdd}-{6.GenerateRandomString()}{System.IO.Path.GetExtension(file.FileName)}";
            while (System.IO.File.Exists(imageFile))
            {
                imageFile =
                    $"{dir}{System.IO.Path.DirectorySeparatorChar}{DateTime.Now:yyyyMMdd}-{6.GenerateRandomString()}{System.IO.Path.GetExtension(file.FileName)}";
            }

            using var stream = new FileStream(imageFile, FileMode.OpenOrCreate);
            file.CopyTo(stream);
            return new
            {
                FileName = System.IO.Path.GetFileName(imageFile)
            };
        }

        [HttpGet("topics/{topic}")]
        public async Task<IActionResult> Topic(string topic)
        {
            return Content(await GenerateTopicPage(_dataService, _environment, Shared.GetCategory(topic)),
                "text/html");
        }

        public static async Task<string> GenerateTopicPage(
            IService dataService, IWebHostEnvironment environment,
            string topic,
            bool release = false
        )
        {
            var content = await System.IO.File.ReadAllTextAsync(Path.Combine(environment.WebRootPath,
                "articles.html"));
            var templates = content.ParseStringTemplate();
            var sb = new StringBuilder();
            Renderers.Renderer(templates, sb, new
            {
                Articles = dataService.QueryArticles(topic),
                SiteName = "KingPunch Studio",
                Title = topic,
                Css = release,
                JavaScript = release,
                environment.WebRootPath
            });
            return sb.ToString();
        }
        [EnableCors("MyPolicy")]
        [HttpGet("tasks/{query?}")]
        public async System.Threading.Tasks.Task<object> GetTasks(string query)
        {
            Console.Write(query);
            if (query == null || query.Length == 0)
            {

                var content =
              await System.IO.File.ReadAllTextAsync(System.IO.Path.Combine(_environment.WebRootPath,
                  "do.html"));
                return Content(content, "text/html");
            }
            int mode =1;
            return _dataService.GetTasks(mode);
        }
        [HttpPost("task")]
        public string InsertTask([FromBody] Task task)
        {
            return _dataService.InsertTask(task);
        }
        [HttpGet("task")]
        public Task GetTask(string id)
        {
            return _dataService.GetTask(id);
        }

    }
}