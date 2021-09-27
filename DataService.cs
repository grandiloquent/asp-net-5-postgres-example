using System.Data;

namespace Psycho
{
    using Npgsql;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class DataService : IDataService
    {
        private readonly NpgsqlConnection _connection;

        public DataService()
        {
            var connString = "";
            _connection = new NpgsqlConnection(connString);
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

        public async Task<int> InsertVideo(Video video)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "INSERT INTO videos (title,url,thumbnail,publish_date,duration,create_at,update_at) VALUES (@Title,@Url,@Thumbnail,@PublishDate,@Duration,@CreateAt,@UpdateAt) RETURNING id"
                    , _connection);
            command.Parameters.AddWithValue("@Title", video.Title);
            command.Parameters.AddWithValue("@Url", video.Url);
            command.Parameters.AddWithValue("@Thumbnail", video.Thumbnail);
            command.Parameters.AddWithValue("@PublishDate", video.PublishDate ?? string.Empty);
            command.Parameters.AddWithValue("@Duration", video.Duration);
            var timestamp = DateTime.UtcNow.GetUnixTimeStamp();
            command.Parameters.AddWithValue("@CreateAt", timestamp);
            command.Parameters.AddWithValue("@UpdateAt", timestamp);
            await using var reader = await command.ExecuteReaderAsync();
            var result = 0;
            if (reader.Read())
            {
                result = reader.GetInt32(0);
            }

            await _connection.CloseAsync();

            return result;
        }

        public async Task<Video> QueryVideoByUrl(string url)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "SELECT id,title,thumbnail,publish_date,duration FROM videos WHERE url = @Url"
                    , _connection);
            command.Parameters.AddWithValue("@Url", url);
            await using var reader = await command.ExecuteReaderAsync();
            Video video = null;
            while (reader.Read())
            {
                var id = reader.GetInt32(0);
                var title = reader.GetString(1);
                var thumbnail = reader.GetString(2);
                var publishDate = await reader.IsDBNullAsync(3) ? string.Empty : reader.GetString(3);
                var duration = reader.GetInt32(4);
                video = new Video(title, url, thumbnail) {Duration = duration, PublishDate = publishDate, Id = id};
            }

            await _connection.CloseAsync();
            return video;
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

        public async Task<int> DeleteVideo(int id)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "WITH d AS (DELETE FROM videos WHERE id = @Id RETURNING id) SELECT COUNT(*) FROM d"
                    , _connection);
            command.Parameters.AddWithValue("@Id", id);
            await using var reader = await command.ExecuteReaderAsync();
            var result = 0;
            if (reader.Read())
            {
                result = reader.GetInt32(0);
            }

            await _connection.CloseAsync();

            return result;
        }

        public async Task<IEnumerable<string>> ListAllDatabases()
        {
            await _connection.OpenAsync();
            var databases = await GetAllDatabases();
            await _connection.CloseAsync();
            return databases;
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
                var title = await reader.IsDBNullAsync(1) ? string.Empty : reader.GetString(1);
                var url = await reader.IsDBNullAsync(2) ? string.Empty : reader.GetString(2);
                var thumbnail = await reader.IsDBNullAsync(3) ? string.Empty : reader.GetString(3);
                var publishDate = await reader.IsDBNullAsync(4) ? string.Empty : reader.GetString(4);
                var duration = reader.GetInt32(5);
                Video video = new(title, url, thumbnail)
                {
                    Duration = duration,
                    PublishDate = publishDate,
                    Id = id
                };
                videos.Add(video);
            }

            await _connection.CloseAsync();
            return videos;
        }
    }
}