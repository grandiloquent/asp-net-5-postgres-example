using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace Psycho
{
    public class DataService : IDataService
    {
        private readonly NpgsqlConnection _connection;

        public DataService()
        {
            var connString = "Host=localhost;Username=postgres;Password=995588;Database=psycho";
            _connection = new NpgsqlConnection(connString);
        }

        public async Task<IEnumerable<Video>> QueryAllVideos()
        {
            List<Video> videos = new();
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new("Select id,title,url,thumbnail,publish_date,duration,update_at,create_at FROM videos", _connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (reader.Read())
            {
                var id = reader.GetInt32(0);
                var title = reader.GetString(1);
                var url = reader.GetString(2);
                var thumbnail = reader.GetString(3);
                var publishDate = reader.GetString(4);
                var duration = reader.GetInt32(5);
                var updateAt = reader.GetInt32(6);
                var createAt = reader.GetInt32(7);
                Video video = new(title, url, thumbnail)
                {
                    CreateAt = createAt,
                    UpdateAt = updateAt,
                    Duration = duration,
                    PublishDate = publishDate,
                    Id = id
                };
                videos.Add(video);
            }

            await _connection.CloseAsync();

            return videos;
        }

        public async Task InsertVideosBatch(IEnumerable<Video> videos)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "INSERT INTO videos (title,url,thumbnail,publish_date,duration,update_at,create_at) SELECT * FROM UNNEST(@Title,@Url,@Thumbnail,@PublishDate,@Duration,@UpdateAt,@CreateAt)"
                    , _connection);
            var enumerable = videos as Video[] ?? videos.ToArray();
            var timestamp = DateTime.UtcNow.GetUnixTimeStamp();
            var timestamps = new long[enumerable.Length];
            for (var i = 0; i < timestamps.Length; i++)
            {
                timestamps[i] = timestamp;
            }

            command.Parameters.AddWithValue("@Title", enumerable.Select(i => i.Title).ToArray());
            command.Parameters.AddWithValue("@Url", enumerable.Select(i => i.Url).ToArray());
            command.Parameters.AddWithValue("@Thumbnail", enumerable.Select(i => i.Thumbnail).ToArray());
            command.Parameters.AddWithValue("@PublishDate", enumerable.Select(i => i.PublishDate).ToArray());
            command.Parameters.AddWithValue("@Duration", enumerable.Select(i => i.Duration).ToArray());
            command.Parameters.AddWithValue("@UpdateAt", timestamps);
            command.Parameters.AddWithValue("@CreateAt", timestamps);

            await command.ExecuteNonQueryAsync();
            
            await _connection.CloseAsync();
        }

        public async Task<int> InsertVideo(Video video)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "INSERT INTO videos (title,url,thumbnail,publish_date,duration,create_at,update_at) VALUES (@Title,@Url,@Thumbnail,@PublishDate,@Duration,@CreateAt,@UpdateAt)"
                    , _connection);
            command.Parameters.AddWithValue("@Title", video.Title);
            command.Parameters.AddWithValue("@Url", video.Url);
            command.Parameters.AddWithValue("@Thumbnail", video.Thumbnail);

            command.Parameters.AddWithValue("@PublishDate", video.PublishDate ?? string.Empty);
            command.Parameters.AddWithValue("@Duration", video.Duration);
            var timestamp = DateTime.UtcNow.GetUnixTimeStamp();
            command.Parameters.AddWithValue("@CreateAt", timestamp);
            command.Parameters.AddWithValue("@UpdateAt", timestamp);

            var result = await command.ExecuteScalarAsync();

            await _connection.CloseAsync();
            if (result != null)
            {
                return (int) result;
            }

            return 0;
        }

        public async void InitializeDatabase()
        {
            await _connection.OpenAsync();
            var databases = await GetAllDatabases();
            if (!databases.Contains("psycho"))
            {
                NpgsqlCommand command =
                    new(@"CREATE DATABASE psycho
                WITH 
                    OWNER = postgres
                ENCODING = 'UTF8'
                LC_COLLATE = 'Chinese (Simplified)_People''s Republic of China.936'
                LC_CTYPE = 'Chinese (Simplified)_People''s Republic of China.936'
                TABLESPACE = pg_default
                CONNECTION LIMIT = -1;", _connection);
                await command.ExecuteScalarAsync();
            }

            await _connection.CloseAsync();
        }

        public async Task<IEnumerable<string>> ListAllDatabases()
        {
            await _connection.OpenAsync();
            var databases = await GetAllDatabases();
            await _connection.CloseAsync();
            return databases;
        }

        private async Task<List<string>> GetAllDatabases()
        {
            const string listDatabases = "SELECT datname FROM pg_database WHERE datistemplate = false;";
            NpgsqlCommand command =
                new(listDatabases, _connection);
            var npgsqlDataReader = await command.ExecuteReaderAsync();
            var databases = new List<string>();
            while (npgsqlDataReader.Read())
            {
                databases.Add(npgsqlDataReader.GetString(0));
            }

            return databases;
        }
    }
}
/*
CREATE TABLE IF NOT EXISTS public.videos
(
    "id" serial PRIMARY KEY,
    "title" text,
    "url" text,
    "thumbnail" text,
    "publish_date" text,
    "duration" bigint,
    "create_at" bigint,
    "update_at" bigint
)

TABLESPACE pg_default;

ALTER TABLE public.videos
    OWNER to postgres;
    
(?<=\")[A-Z][a-z]+(?=\" )

insert into videos (title,url) select * from unnest(array['1','2'],array['a','b'])

*/