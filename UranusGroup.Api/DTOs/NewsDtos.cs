using System;

namespace UranusGroup.Api.DTOs
{
    public class CreateNewsDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPublished { get; set; }
    }

    public class UpdateNewsDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPublished { get; set; }
    }

    public class NewsResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
        public string Slug { get; set; }
        public bool IsPublished { get; set; }
        public DateTime PublishedAt { get; set; }
        public string AuthorName { get; set; }
    }
} 