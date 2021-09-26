using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Psycho
{
    [ApiController]
    [Route("/api/{controller}")]
    [EnableCors("MyPolicy")]
    public class VideoController : Controller
    {
        private readonly IDataService _dataService;
        private readonly CkClient _ckClient;

        public VideoController(IDataService dataService, CkClient ckClient)
        {
            _dataService = dataService;
            _ckClient = ckClient;
        }

        [HttpGet]
        public async Task<IEnumerable<Video>> Get(string controller)
        {
            var videos = await _dataService.QueryAllVideos();
            return videos;
        }

        [HttpGet("ck")]
        public Task<string> GetCkBaseAddress(string controller)
        {
            return _ckClient.GetBaseAddress();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm(Name = "file")] List<IFormFile> formFiles, string controller)
        {
            await using var buffer = new MemoryStream();

            await formFiles.First().CopyToAsync(buffer);
            using var reader = new StreamReader(buffer, Encoding.UTF8);
            var videos = JsonSerializer.Deserialize<List<Video>>(await reader.ReadToEndAsync());
            await _dataService.InsertVideosBatch(videos);
            // if (formFile != null)
            //     Console.WriteLine("{0} {1} {2}", formFile.FileName, formFile.Length, formFile.ContentType);
            return Ok();
        }
    }
}