namespace Psycho
{
    using Microsoft.AspNetCore.Cors;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;

    [ApiController]
    [Route("/api/{controller}")]
    public class VideoController : Controller
    {
        private readonly CkClient _ckClient;
        private readonly IDataService _dataService;

        public VideoController(IDataService dataService, CkClient ckClient)
        {
            _dataService = dataService;
            _ckClient = ckClient;
        }

        [HttpGet("random")]
        [EnableCors("MyPolicy")]
        public async Task<IEnumerable<Video>> GetRandomVideos()
        {
            var videos = await _dataService.QueryRandomVideos();
            return videos;
        }

        [HttpGet]
        public async Task<IEnumerable<Video>> GetVideos(int count, int factor, Order order, int region,
            string controller)
        {
            var videos = await _dataService.GetVideos(count, factor, order, region);
            return videos;
        }

        [HttpGet("query")]
        public async Task<IEnumerable<Video>> Get(string keyword, int factor, int region, string controller)
        {
            var videos = await _dataService.QueryVideos(keyword, factor, region);
            return videos;
        }

        [HttpGet("ck")]
        public async Task<string> GetCkBaseAddress(string controller)
        {
            await _ckClient.GetVideos(1);
            return await _ckClient.GetBaseAddress();
        }

        [HttpGet("url")]
        public async System.Threading.Tasks.Task<Video> GetVideoByUrl([FromQuery] string url)
        {
            return await _dataService.QueryVideoByUrl(url);
        }

        [HttpPost("upload")]
        public async System.Threading.Tasks.Task<IActionResult> Upload([FromForm(Name = "file")] List<IFormFile> formFiles, string controller)
        {
            await using var buffer = new MemoryStream();
            await formFiles.First().CopyToAsync(buffer);
            var data = new byte[3];
            buffer.Seek(0, SeekOrigin.Begin);
            if (buffer.Read(data, 0, 3) == 3)
            {
                buffer.Seek(0, SeekOrigin.Begin);
                if (data[0] == 0xEF && data[1] == 0xBB && data[2] == 0xBF)
                {
                    buffer.Seek(3, SeekOrigin.Begin);
                }
            }
            else
            {
                return BadRequest();
            }

            var videos = await JsonSerializer.DeserializeAsync<List<Video>>(buffer);
            await _dataService.InsertVideos(videos.DistinctBy(v => v.Url));
            return Ok();
        }

        [HttpGet("57ck")]
        [EnableCors("MyPolicy")]
        public async System.Threading.Tasks.Task<int> Fetch57CkVideos(int max = 1, int type = 2)
        {
            var videos = await _ckClient.GetVideos(max, type);
            await _dataService.InsertVideos(videos);

            return videos.Count;
        }

        [HttpPost]
        public async System.Threading.Tasks.Task<string> InsertVideos(List<Video> videos)
        {
            if (videos.Count == 0)
            {
                return "不能插入空的视频集合";
            }

            await _dataService.InsertVideos(videos);
            return $"插入 {videos.Count} 个视频";
        }

        [HttpPost("update")]
        public async System.Threading.Tasks.Task<int> UpdateVideo([FromBody] Video video)
        {
            if (!CookieHelper.Check("psycho", Request, true))
            {
                Response.StatusCode = 403;
                return -1;
            }

            await _dataService.UpdateVideo(video);
            return 0;
        }

        [HttpGet("record")]
        public async System.Threading.Tasks.Task<OkResult> RecordViews(int id, int duration)
        {
            await _dataService.RecordViews(id, duration);
            return Ok();
        }

        [HttpGet("apk")]
        public string GetApk()
        {
            return "1.1.3";
        }

        [HttpGet("tencent")]
        public string Tencent()
        {
            return
                "login_remember=qq; vuserid=1428406875; main_login=wx; vusession=okAKUwwXvmja0YPoloctiw..; access_token=50_lxKKNEgXg4W8nYse305fyNZ8uiuUZgrnFwk8lXm9a4eKytAZVqLyXvC_44unTa3ULqrzbA0XjfxxDLBizJWvUw";
        }

        [HttpDelete]
        public object DeleteVideo(int id)
        {
            if (!CookieHelper.Check("psycho", Request, true))
            {
                Response.StatusCode = 403;
                return null;
            }

            return _dataService.DeleteVideo(id);
        }
    }
}