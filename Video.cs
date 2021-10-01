namespace Psycho
{
    public record Video(string Title, string Url, string Thumbnail)
    {
        public long Id { get; set; }
        public string PublishDate { get; set; }
        public int Duration { get; set; }
        public int UpdateAt { get; set; }
        public int CreateAt { get; set; }
        public int Type { get; set; }
    }
}