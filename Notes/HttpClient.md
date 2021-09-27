# HttpClient

## Startup.cs

```c#
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpClient<CkClient>()
                .ConfigurePrimaryHttpMessageHandler(x =>
                    new HttpClientHandler
                    {
                        UseProxy = false,
                        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
                    }
                );
        }
```

## Controller.cs

```c#
private Client _client;

        public VideoController(Client client)
        {
            _client = client;
        }
```

```c#
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;

namespace Psycho
{
    public class Client
    {
        private readonly HttpClient _client;

        public Client(HttpClient client)
        {
            _client = client;
            _client.BaseAddress = new Uri("");
            _client.DefaultRequestHeaders.Add(HeaderNames.UserAgent,
                "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36");
        }

        public async Task<String> GetBaseAddress()
        {
            var hp = new HttpRequestMessage(HttpMethod.Head, "/");
            var rs = await _client.SendAsync(hp);
            if (rs.Headers.TryGetValues(HeaderNames.Location, out var values))
            {
                return values.FirstOrDefault();
            }
            return _client.BaseAddress.ToString();
        }
    }
}
```
