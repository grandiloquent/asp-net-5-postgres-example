namespace Psycho
{
    public record Video(string Title, string Url, string Thumbnail)
    {
        public long Id { get; set; }
        public string PublishDate { get; set; }
        public int Duration { get; set; }
        public long UpdateAt { get; set; }
        public long CreateAt { get; set; }
        public int Type { get; set; }
        public int Views { get; set; }
        public bool Hidden { get; set; }
    }
}