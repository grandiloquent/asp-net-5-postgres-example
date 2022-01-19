using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json.Serialization;
using LiteDB;

namespace Psycho
{
    public record Keyword(string ChineseName, string Name);

    public class Article
    {
        public int Id { get; set; }
        public string UniqueId { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Thumbnail { get; set; }
        [JsonIgnore] public long CreationDate { get; set; }
        [JsonIgnore] public long UpdatedDate { get; set; }
    }
    public class Task
    {
        public string UniqueId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Tag { get; set; }
        public int Id { get; set; }
        public int State { get; set; }
        public long CreationTime { get; set; }
        public long UpdatedTime { get; set; }
    }
    public interface IService
    {
        string InsertArticle(Article article);
        IEnumerable<Article> GetArticles();
        IEnumerable<Article> QueryArticles(string topic);
        Article GetArticle(string uniqueId);
        void DeleteArticle(string uniqueId);

        string InsertTask(Task task);
        IEnumerable<Task> GetTasks(int mode);
        IEnumerable<Task> QueryTasks(string tag);
        Task GetTask(string uniqueId);
        void DeleteTask(string uniqueId);
    }

    public class Service : IService
    {
        private LiteDatabase Database { get; }

        public Service()
        {
            Database = new LiteDatabase(
                Path.Combine(AppContext.BaseDirectory,
                    "dataService.db")
            );
        }

        private static string GenerateBookUniqueId(ILiteCollection<Article> articles)
        {
            var uniqueId = 6.GenerateRandomString();
            var uniqueIdCopy = uniqueId;
            var temporary = articles.FindOne(b => b.UniqueId == uniqueIdCopy);
            if (temporary == null)
            {
                return uniqueId;
            }

            do
            {
                uniqueId = 6.GenerateRandomString();
                var immutableUniqueId = uniqueId;
                temporary = articles.FindOne(b => b.UniqueId == immutableUniqueId);
                if (temporary == null)
                    break;
            } while (true);

            return uniqueId;
        }
        private static string GenerateTaskUniqueId(ILiteCollection<Task> articles)
        {
            var uniqueId = 6.GenerateRandomString();
            var uniqueIdCopy = uniqueId;
            var temporary = articles.FindOne(b => b.UniqueId == uniqueIdCopy);
            if (temporary == null)
            {
                return uniqueId;
            }

            do
            {
                uniqueId = 6.GenerateRandomString();
                var immutableUniqueId = uniqueId;
                temporary = articles.FindOne(b => b.UniqueId == immutableUniqueId);
                if (temporary == null)
                    break;
            } while (true);

            return uniqueId;
        }


        public string InsertArticle(Article article)
        {
            if (article == null)
            {
                return null;
            }

            var c = Database.GetCollection<Article>("articles");
            if (article.Id <= 0 && !article.UniqueId.CheckUniqueId())
            {
                var creationDate = DateTime.UtcNow.GetUnixTimeStamp();
                article.CreationDate = creationDate;
                article.UpdatedDate = creationDate;
                article.UniqueId = GenerateBookUniqueId(c);
                return c.Insert(article) > 0 ? article.UniqueId : null;
            }

            var oldVideo = article.Id > 0
                ? c.FindById(article.Id)
                : c.FindOne(b => b.UniqueId == article.UniqueId);
            if (oldVideo == null) return null;


            if (article.Content != null)
            {
                oldVideo.Content = article.Content;
            }

            if (article.Title != null)
            {
                oldVideo.Title = article.Title;
            }

            if (article.Thumbnail != null)
            {
                oldVideo.Thumbnail = article.Thumbnail;
            }

            if (article.Category != null)
            {
                oldVideo.Category = article.Category;
            }

            oldVideo.UpdatedDate = DateTime.UtcNow.GetUnixTimeStamp();
            return c.Update(oldVideo) ? oldVideo.UniqueId : null;
        }

        public IEnumerable<Article> GetArticles()
        {
            var c = Database.GetCollection<Article>("articles");
            return c.FindAll();
        }

        public Article GetArticle(string uniqueId)
        {
            var c = Database.GetCollection<Article>("articles");
            return c.FindOne(b => b.UniqueId == uniqueId);
        }

        public IEnumerable<Article> QueryArticles(string topic)
        {
            var c = Database.GetCollection<Article>("articles");
            return c.Query()
                .Where(x => x.Category == topic)
                .ToEnumerable();
        }

        public void DeleteArticle(string uniquedId)
        {
            var c = Database.GetCollection<Article>("articles");
            c.Delete(c.FindOne(x => x.UniqueId == uniquedId).Id);
        }

        public string InsertTask(Task task)
        {
            if (task == null)
            {
                return null;
            }

            var c = Database.GetCollection<Task>("tasks");
            if (task.Id <= 0 && !task.UniqueId.CheckUniqueId())
            {
                var creationTime = DateTime.UtcNow.GetUnixTimeStamp();
                task.CreationTime = creationTime;
                task.UpdatedTime = creationTime;
                task.UniqueId = GenerateTaskUniqueId(c);
                return c.Insert(task) > 0 ? task.UniqueId : null;
            }

            var oldTask = task.Id > 0
                ? c.FindById(task.Id)
                : c.FindOne(b => b.UniqueId == task.UniqueId);
            if (oldTask == null) return null;
            if (task.Name != null)
            {
                oldTask.Name = task.Name;
            }
            if (task.Description != null)
            {
                oldTask.Description = task.Description;
            }
            if (task.Tag != null)
            {
                oldTask.Tag = task.Tag;
            }

            if (task.State != 0)
            {
                oldTask.State = task.State;
            }


            oldTask.UpdatedTime = DateTime.UtcNow.GetUnixTimeStamp();
            return c.Update(oldTask) ? oldTask.UniqueId : null;
        }

        public IEnumerable<Task> GetTasks(int mode)
        {
            var c = Database.GetCollection<Task>("tasks");
            if (mode == 1)
            {
                return c.Query()
                .Where(i => i.Tag == "red" && (DateTime.Now - new DateTime(i.CreationTime)).Days <= 1)
                .ToEnumerable();
            }
            return c.FindAll();
        }
        public Task GetTask(string uniqueId)
        {
            var c = Database.GetCollection<Task>("tasks");
            return c.FindOne(b => b.UniqueId == uniqueId);
        }
        public IEnumerable<Task> QueryTasks(string tag)
        {
            var c = Database.GetCollection<Task>("tasks");
            return c.Query()
                .Where(x => x.Tag == tag)
                .ToEnumerable();
        }

        public void DeleteTask(string uniquedId)
        {
            var c = Database.GetCollection<Task>("tasks");
            c.Delete(c.FindOne(x => x.UniqueId == uniquedId).Id);
        }
    }
}