using System.Collections.Generic;
using System.Threading.Tasks;

namespace Psycho
{
    public interface IDataService
    {
        Task<IEnumerable<string>> ListAllDatabases();
        void InitializeDatabase();
        Task<int> InsertVideo(Video video);
        Task<IEnumerable<Video>> QueryAllVideos();

        Task InsertVideosBatch(IEnumerable<Video> videos);
    }
}