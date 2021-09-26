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
        // results.push(`var ${deCapitalize(matches[i][0])} = reader.GetString(${i});`);
        //  results.push(`${underscore(matches[i][0])}`);
        //results.push(`@${matches[i][0]}`);
        //results.push(`command.Parameters.AddWithValue("@${matches[i][0]}", video.${matches[i][0]});`);
        results.push(`command.Parameters.AddWithValue("@${matches[i][0]}", videos.Select(i=>i.${matches[i][0]}).ToArray());`);
        // videos.Select(i=>i.Thumbnail).ToArray()
    }
    console.log(results.join('\n'));
})();