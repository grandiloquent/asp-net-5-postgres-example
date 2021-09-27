namespace Psycho
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IDataService
    {
        Task<int> DeleteVideo(int id);
        void InitializeDatabase();
        Task<int> InsertVideo(Video video);
        Task InsertVideosBatch(IEnumerable<Video> videos);
        Task<IEnumerable<string>> ListAllDatabases();
        Task<IEnumerable<Video>> QueryAllVideos();
        Task<Video> QueryVideoByUrl(string url);
    }
}