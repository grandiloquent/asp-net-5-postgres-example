namespace Psycho
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public enum Order
    {
        UpdateAt = 1 << 1,
        DurationMax = 1 << 2,
        ViewMax = 5,
        Create = 6
    }

    public interface IDataService
    {
        Task<int> DeleteVideo(int id);
        Task<IEnumerable<Video>> GetVideos(int count, int factor, Order order, int type);
        void InitializeDatabase();
        Task<int> InsertVideo(Video video);
        Task InsertVideos(IEnumerable<Video> videos);
        Task<IEnumerable<string>> ListAllDatabases();
        Task<IEnumerable<Video>> QueryAllVideos();
        Task<Video> QueryVideoByUrl(string url);
        Task<IEnumerable<Video>> QueryVideos(string keyword, int factor, int type);
        Task<IEnumerable<Video>> QueryRandomVideos();

        Task RecordViews(int id);
        Task UpdateVideo(Video video);
    }
}