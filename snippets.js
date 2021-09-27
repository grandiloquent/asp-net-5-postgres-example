(function () {
    function deCapitalize(string) {
        return string.substring(0, 1).toLowerCase() + string.substring(1);
    }

    function underscore(string) {
        return string.replaceAll(/(?<=[a-z])[A-Z]/g, m => `_${m[0].toLowerCase()}`).toLowerCase();
    }

    const string = `CREATE TABLE IF NOT EXISTS public.videos
(
    "Id" serial PRIMARY KEY,
    "Title" text,
    "Url" text,
    "Thumbnail" text,
    "PublishDate" text,
    "Duration" bigint,
    "UpdateAt" time without time zone NOT NULL DEFAULT current_timestamp,
    "CreateAt" time without time zone NOT NULL DEFAULT current_timestamp
)`;
    const matches = [...string.matchAll(/(?<=")[A-Z][a-zA-Z]+(?=" )/g)];

    const results = [];
    for (let i = 0; i < matches.length; i++) {
        //results.push(`public string ${matches[i][0]}{get;set;}`);
        //  results.push(`var ${deCapitalize(matches[i][0])} = reader["${matches[i][0]}"];`);
         results.push(`var ${deCapitalize(matches[i][0])} = reader.GetString(${i});`);
      // results.push(`${underscore(matches[i][0])}`);
        //results.push(`@${matches[i][0]}`);
        //results.push(`command.Parameters.AddWithValue("@${matches[i][0]}", video.${matches[i][0]});`);
        // results.push(`command.Parameters.AddWithValue("@${matches[i][0]}", videos.Select(i=>i.${matches[i][0]}).ToArray());`);
        // videos.Select(i=>i.Thumbnail).ToArray()
    }
    console.log(results.join('\n'));
})();

(function () {
    const string = `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: no-cache
Connection: keep-alive
Host: 91porn.com
Pragma: no-cache
sec-ch-ua: "Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36`;
    const lines = string.split('\n');
    const results = [];
    for (let i = 0; i < lines.length; i++) {
        const pieces = lines[i].split(':', 2);
        results.push(`{"${pieces[0]}","${pieces[1].trim().replaceAll('"','\\"')}"}`);
    }
    console.log(results.join(",\n"));
})();