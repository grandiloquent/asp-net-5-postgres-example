using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;

namespace Psycho
{
    public record Video(string Title, string Url, string Thumbnail)
    {
        public long Id { get; set; }
        public string PublishDate { get; set; }
        public int Duration { get; set; }
        public DateTime UpdateAt { get; set; }
        public DateTime CreateAt { get; set; }
    }

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
                new("Select Id,Title,Url,Thumbnail,PublishDate,Duration,UpdateAt,CreateAt FROM psycho", _connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (reader.Read())
            {
                var id = reader.GetInt32(0);
                var title = reader.GetString(1);
                var url = reader.GetString(2);
                var thumbnail = reader.GetString(3);
                var publishDate = reader.GetString(4);
                var duration = reader.GetInt32(5);
                var updateAt = reader.GetDateTime(6);
                var createAt = reader.GetDateTime(7);
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

        public async Task<int> InsertVideo(Video video)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "INSERT INTO videos (title,url,thumbnail,publish_date,duration) VALUES (@Title,@Url,@Thumbnail,@PublishDate,@Duration)"
                    , _connection);
            command.Parameters.AddWithValue("@Title", video.Title);
            command.Parameters.AddWithValue("@Url", video.Url);
            command.Parameters.AddWithValue("@Thumbnail", video.Thumbnail);

            command.Parameters.AddWithValue("@PublishDate", video.PublishDate ?? string.Empty);
            command.Parameters.AddWithValue("@Duration", video.Duration);

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
    "update_at" time without time zone NOT NULL DEFAULT current_timestamp,
    "create_at" time without time zone NOT NULL DEFAULT current_timestamp
)

TABLESPACE pg_default;

ALTER TABLE public.videos
    OWNER to postgres;
    
(?<=\")[A-Z][a-z]+(?=\" )
*/