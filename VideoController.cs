using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
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
        public async Task<string> Get(string controller)
        {
            var result = await _dataService.InsertVideo(new Video("1", "2", "3"));
            Console.WriteLine(result);
            var databases = await _dataService.ListAllDatabases();
            return string.Join("\n", databases);
        }

        [HttpGet("ck")]
        public Task<string> GetCkBaseAddress(string controller)
        {
            return _ckClient.GetBaseAddress();
        }

        [HttpPost("/upload")]
        public IActionResult Upload()
        {
            return Ok();
        }
    }
}