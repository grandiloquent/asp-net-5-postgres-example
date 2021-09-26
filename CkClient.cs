using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
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

        public async Task<String> GetBaseAddress()
        {
            var hp = new HttpRequestMessage(HttpMethod.Head, "/?u=http://52ck.cc/&p=/");
            var rs = await _client.SendAsync(hp);
            if (rs.Headers.TryGetValues(HeaderNames.Location, out var values))
            {
                return values.FirstOrDefault();
            }

            Console.WriteLine(rs.StatusCode);
            Console.WriteLine(await rs.Content.ReadAsStringAsync());
            return _client.BaseAddress.ToString();
        }
    }
}
/*

private CkClient _ckClient;

public VideoController(CkClient ckClient)
{
 _ckClient = ckClient;
}
*/