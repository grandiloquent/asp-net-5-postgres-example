namespace Psycho
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IDataService
    {
        Task<int> DeleteVideo(int id);
        Task<IEnumerable<Video>> GetVideos(int count, int factor);
        void InitializeDatabase();
        Task<int> InsertVideo(Video video);
        Task InsertVideos(IEnumerable<Video> videos);
        Task<IEnumerable<string>> ListAllDatabases();
        Task<IEnumerable<Video>> QueryAllVideos();
        Task<Video> QueryVideoByUrl(string url);
        Task<IEnumerable<Video>> QueryVideos(string keyword, int factor);
        
        Task RecordViews(int id);
    }
}