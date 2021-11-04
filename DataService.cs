namespace Psycho
{
    using Microsoft.Extensions.Configuration;
    using Npgsql;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class DataService : IDataService
    {
        private readonly NpgsqlConnection _connection;

        public DataService(IConfiguration configuration)
        {
            _connection = new NpgsqlConnection(configuration.GetConnectionString("DbConnectionString"));
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

        private static async Task PerformRead(NpgsqlConnection connection, string cmdText,
            Action<NpgsqlDataReader> action,
            Action<NpgsqlCommand> cmd = null)
        {
            await connection.OpenAsync();
            await using NpgsqlCommand command =
                new(cmdText, connection);
            cmd?.Invoke(command);
            await using var reader = await command.ExecuteReaderAsync();
            action(reader);
            await connection.CloseAsync();
        }

        private static async Task Perform(NpgsqlConnection connection, string cmdText,
            Action<NpgsqlCommand> cmd = null)
        {
            await connection.OpenAsync();
            await using NpgsqlCommand command =
                new(cmdText, connection);
            cmd?.Invoke(command);
            await command.ExecuteNonQueryAsync();
            await connection.CloseAsync();
        }

        public async Task<int> DeleteVideo(int id)
        {
            var result = 0;
            const string cmdText = "update videos set hidden = @Hidden where id = @Id";
            //"WITH d AS (DELETE FROM videos WHERE id = @Id RETURNING id) SELECT COUNT(*) FROM d";

            await PerformRead(_connection,
                cmdText, reader =>
                {
                    while (reader.Read())
                    {
                        result = reader.GetInt32(0);
                    }
                },
                command =>
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@Hidden", true);
                }
            );
            return result;
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
            var result = 0;
            const string cmdText =
                "INSERT INTO videos (title,url,thumbnail,publish_date,duration,create_at,update_at) VALUES (@Title,@Url,@Thumbnail,@PublishDate,@Duration,@CreateAt,@UpdateAt) RETURNING id";
            await PerformRead(_connection,
                cmdText, reader =>
                {
                    while (reader.Read())
                    {
                        result = reader.GetInt32(0);
                    }
                },
                command =>
                {
                    command.Parameters.AddWithValue("@Title", video.Title);
                    command.Parameters.AddWithValue("@Url", video.Url);
                    command.Parameters.AddWithValue("@Thumbnail", video.Thumbnail);
                    command.Parameters.AddWithValue("@PublishDate", video.PublishDate ?? string.Empty);
                    command.Parameters.AddWithValue("@Duration", video.Duration);
                    var timestamp = DateTime.UtcNow.GetUnixTimeStamp();
                    command.Parameters.AddWithValue("@CreateAt", timestamp);
                    command.Parameters.AddWithValue("@UpdateAt", timestamp);
                }
            );
            return result;
        }

        public async Task InsertVideos(IEnumerable<Video> videos)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "INSERT INTO videos (title,url,thumbnail,publish_date,duration,update_at,create_at,type) SELECT * FROM UNNEST(@Title,@Url,@Thumbnail,@PublishDate,@Duration,@UpdateAt,@CreateAt,@Type) as r ON CONFLICT (url) DO UPDATE set duration = excluded.duration"
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
            command.Parameters.AddWithValue("@Type", enumerable.Select(i => i.Type).ToArray());

            await command.ExecuteNonQueryAsync();
            await _connection.CloseAsync();
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
                new("Select id,title,url,thumbnail,publish_date,duration,type FROM videos", _connection);
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
                    Id = id,
                    Type = await reader.IsDBNullAsync(6) ? 0 : reader.GetInt32(6)
                };
                videos.Add(video);
            }

            await _connection.CloseAsync();
            return videos;
        }

        public async Task<Video> QueryVideoByUrl(string url)
        {
            await _connection.OpenAsync();
            await using NpgsqlCommand command =
                new(
                    "SELECT * FROM get_video(@Url)"
                    , _connection);
            command.Parameters.AddWithValue("@Url", url);
            await using var reader = await command.ExecuteReaderAsync();
            Video video = null;
            if (reader.Read())
            {
                var id = await reader.IsDBNullAsync(0) ? 0 : reader.GetInt32(0);
                var title = await reader.IsDBNullAsync(1) ? string.Empty : reader.GetString(1);
                var thumbnail = await reader.IsDBNullAsync(3) ? string.Empty : reader.GetString(3);
                var publishDate = await reader.IsDBNullAsync(4) ? string.Empty : reader.GetString(4);
                var duration = await reader.IsDBNullAsync(5) ? 0 : reader.GetInt32(5);
                var createAt = await reader.IsDBNullAsync(6) ? 0 : reader.GetInt64(6);
                var updateAt = await reader.IsDBNullAsync(7) ? 0 : reader.GetInt64(7);
                var views = await reader.IsDBNullAsync(8) ? 0 : reader.GetInt32(8);
                var type = await reader.IsDBNullAsync(9) ? 0 : reader.GetInt32(9);
                var hidden = !await reader.IsDBNullAsync(10) && reader.GetBoolean(10);
                video = new Video(title, url, thumbnail)
                {
                    Id = id,
                    PublishDate = publishDate,
                    Duration = duration,
                    CreateAt = createAt,
                    UpdateAt = updateAt,
                    Views = views,
                    Type = type,
                    Hidden = hidden,
                };
            }

            await _connection.CloseAsync();
            return video;
        }

        public async Task<IEnumerable<Video>> QueryVideos(string keyword, int factor, int type)
        {
            List<Video> videos = new();
            await PerformRead(_connection,
                @"select * from query_videos(@Keyword,@Type,@Limit, @Offset)",
                async reader =>
                {
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
                            Id = id,
                            Type = await reader.IsDBNullAsync(6) ? 0 : reader.GetInt32(6)
                        };
                        videos.Add(video);
                    }
                },
                command =>
                {
                    command.Parameters.AddWithValue("@Keyword", keyword);
                    command.Parameters.AddWithValue("@Type", type);
                    command.Parameters.AddWithValue("@Limit", 20);
                    command.Parameters.AddWithValue("@Offset", 20 * factor);
                }
            );
            return videos;
        }

        public async Task<IEnumerable<Video>> QueryRandomVideos()
        {
            List<Video> videos = new();
            await PerformRead(_connection,
                @"select * from get_random_videos()",
                async reader =>
                {
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
                            Id = id,
                            Type = await reader.IsDBNullAsync(6) ? 0 : reader.GetInt32(6)
                        };
                        videos.Add(video);
                    }
                },
                command => { }
            );
            return videos;
        }

        public async Task RecordViews(int id)
        {
            await Perform(_connection,
                "UPDATE videos set views = coalesce(views,0) + 1,update_at = @UpdateAt WHERE id = @Id",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@UpdateAt", DateTime.UtcNow.GetUnixTimeStamp());
                });
        }

        public async Task UpdateVideo(Video video)
        {
            await Perform(_connection,
                "UPDATE videos set title = @Title, url = @Url, thumbnail = @Thumbnail, publish_date = @PublishDate, duration = @Duration, create_at = @CreateAt, update_at = @UpdateAt, views = @Views, type = @Type, hidden = @Hidden WHERE id = @Id",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("@Id", video.Id);
                    cmd.Parameters.AddWithValue("@Title", video.Title);
                    cmd.Parameters.AddWithValue("@Url", video.Url);
                    cmd.Parameters.AddWithValue("@Thumbnail", video.Thumbnail);
                    cmd.Parameters.AddWithValue("@PublishDate", video.PublishDate);
                    cmd.Parameters.AddWithValue("@Duration", video.Duration);
                    cmd.Parameters.AddWithValue("@CreateAt", video.CreateAt);
                    cmd.Parameters.AddWithValue("@UpdateAt", DateTime.UtcNow.GetUnixTimeStamp());
                    cmd.Parameters.AddWithValue("@Views", video.Views);
                    cmd.Parameters.AddWithValue("@Type", video.Type);
                    cmd.Parameters.AddWithValue("@Hidden", video.Hidden);
                });
        }

        public async Task<IEnumerable<Video>> GetVideos(int count = 20, int factor = 0, Order order = Order.UpdateAt,
            int type = 0)
        {
            List<Video> videos = new();
            string orderly;
            switch (order)
            {
                case Order.DurationMax:
                    orderly = "duration";
                    break;

                case Order.UpdateAt:
                    orderly = "update_at";
                    break;
                case Order.ViewMax:
                    orderly = "views";
                    break;
                case Order.Create:
                    orderly = "create_at";
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(order), order, null);
            }

            await PerformRead(_connection, $"SELECT * FROM get_videos('{orderly}',@Type,@Limit,@Offset)",
                async reader =>
                {
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
                            Id = id,
                            Type = await reader.IsDBNullAsync(6) ? 0 : reader.GetInt32(6)
                        };
                        videos.Add(video);
                    }
                },
                command =>
                {
                    command.Parameters.AddWithValue("@Limit", count);
                    command.Parameters.AddWithValue("@Offset", count * factor);
                    command.Parameters.AddWithValue("@Type", type);
                }
            );
            return videos;
        }
    }
}