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
        private IDataService _dataService;
        private CkClient _ckClient;

        public VideoController(IDataService dataService, CkClient ckClient)
        {
            _dataService = dataService;
            _ckClient = ckClient;
        }

        [HttpGet]
        public IActionResult Get(string controller)
        {
            return Ok();
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