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
    [EnableCors("MyPolicy")]
    public class VideoController : Controller
    {
        private readonly CkClient _ckClient;
        private readonly IDataService _dataService;

        public VideoController(IDataService dataService, CkClient ckClient)
        {
            _dataService = dataService;
            _ckClient = ckClient;
        }

        [HttpGet]  
        public async Task<IEnumerable<Video>> GetVideos(int count, int factor, Order order, string controller)
        {
            var videos = await _dataService.GetVideos(count, factor,order);
            return videos;
        }

        [HttpGet("query")]
        public async Task<IEnumerable<Video>> Get(string keyword, int factor, string controller)
        {
            var videos = await _dataService.QueryVideos(keyword, factor);
            return videos;
        }

        [HttpGet("ck")]
        public async Task<string> GetCkBaseAddress(string controller)
        {
            await _ckClient.GetVideos(1);
            return await _ckClient.GetBaseAddress();
        }

        [HttpGet("url")]
        public async Task<Video> GetVideoByUrl(string url)
        {
            return await _dataService.QueryVideoByUrl(url);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm(Name = "file")] List<IFormFile> formFiles, string controller)
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
        public async Task<int> Fetch57CkVideos(int max = 1)
        {
            var videos = await _ckClient.GetVideos(max);
            await _dataService.InsertVideos(videos);

            return videos.Count;
        }

        [HttpPost]
        public async Task<int> InsertVideos(List<Video> videos)
        {
            await _dataService.InsertVideos(videos);
            return videos.Count;
        }

        [HttpGet("record")]
        public async Task<OkResult> RecordViews(int id)
        {
            await _dataService.RecordViews(id);
            return Ok();
        }
    }
}