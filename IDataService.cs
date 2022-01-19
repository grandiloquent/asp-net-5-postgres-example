namespace Psycho
{
    using System.Collections.Generic;
    
    public enum Order
    {
        UpdateAt = 1 << 1,
        DurationMax = 1 << 2,
        ViewMax = 5,
        Create = 6
    }

    public interface IDataService
    {
        System.Threading.Tasks.Task<int> DeleteVideo(int id);
        System.Threading.Tasks.Task<IEnumerable<Video>> GetVideos(int count, int factor, Order order, int type);
        void InitializeDatabase();
        System.Threading.Tasks.Task<int> InsertVideo(Video video);
        System.Threading.Tasks.Task InsertVideos(IEnumerable<Video> videos);
        System.Threading.Tasks.Task<IEnumerable<string>> ListAllDatabases();
        System.Threading.Tasks.Task<IEnumerable<Video>> QueryAllVideos();
        System.Threading.Tasks.Task<Video> QueryVideoByUrl(string url);
        System.Threading.Tasks.Task<IEnumerable<Video>> QueryVideos(string keyword, int factor, int type);
        System.Threading.Tasks.Task<IEnumerable<Video>> QueryRandomVideos();

        System.Threading.Tasks.Task RecordViews(int id, int duration);
        System.Threading.Tasks.Task UpdateVideo(Video video);
    }
}