using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;

namespace Psycho
{
    public class DataService : IDataService
    {
        private readonly NpgsqlConnection _connection;

        public DataService()
        {
            var connString = "Host=localhost;Username=postgres;Password=995588;Database=postgres";
            _connection = new NpgsqlConnection(connString);
        }

        public async Task<IEnumerable<object>> QueryAllVideos()
        {
            await _connection.OpenAsync();

            await _connection.CloseAsync();

            return null;
        }
    }
}