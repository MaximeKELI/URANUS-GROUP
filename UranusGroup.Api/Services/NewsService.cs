using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UranusGroup.Api.Data;
using UranusGroup.Api.DTOs;
using UranusGroup.Api.Models;

namespace UranusGroup.Api.Services
{
    public interface INewsService
    {
        Task<NewsResponseDto> CreateNewsAsync(int authorId, CreateNewsDto dto);
        Task<NewsResponseDto> UpdateNewsAsync(int newsId, UpdateNewsDto dto);
        Task<List<NewsResponseDto>> GetAllNewsAsync();
        Task<NewsResponseDto> GetNewsByIdAsync(int newsId);
        Task<List<NewsResponseDto>> GetNewsByCategoryAsync(string category);
        Task<bool> DeleteNewsAsync(int newsId);
    }

    public class NewsService : INewsService
    {
        private readonly ApplicationDbContext _context;

        public NewsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<NewsResponseDto> CreateNewsAsync(int authorId, CreateNewsDto dto)
        {
            var news = new News
            {
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                ImageUrl = dto.ImageUrl,
                Slug = GenerateSlug(dto.Title),
                IsPublished = dto.IsPublished,
                PublishedAt = dto.IsPublished ? DateTime.UtcNow : DateTime.MinValue,
                CreatedAt = DateTime.UtcNow,
                AuthorId = authorId
            };

            _context.News.Add(news);
            await _context.SaveChangesAsync();

            return await GetNewsResponseDto(news);
        }

        public async Task<NewsResponseDto> UpdateNewsAsync(int newsId, UpdateNewsDto dto)
        {
            var news = await _context.News.FindAsync(newsId);
            if (news == null)
                throw new Exception("News not found");

            news.Title = dto.Title;
            news.Content = dto.Content;
            news.Category = dto.Category;
            news.ImageUrl = dto.ImageUrl;
            news.Slug = GenerateSlug(dto.Title);
            
            if (!news.IsPublished && dto.IsPublished)
            {
                news.PublishedAt = DateTime.UtcNow;
            }
            news.IsPublished = dto.IsPublished;
            news.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetNewsResponseDto(news);
        }

        public async Task<List<NewsResponseDto>> GetAllNewsAsync()
        {
            var news = await _context.News
                .Include(n => n.Author)
                .OrderByDescending(n => n.PublishedAt)
                .ToListAsync();

            return await Task.WhenAll(news.Select(async n => await GetNewsResponseDto(n)));
        }

        public async Task<NewsResponseDto> GetNewsByIdAsync(int newsId)
        {
            var news = await _context.News
                .Include(n => n.Author)
                .FirstOrDefaultAsync(n => n.Id == newsId);

            if (news == null)
                throw new Exception("News not found");

            return await GetNewsResponseDto(news);
        }

        public async Task<List<NewsResponseDto>> GetNewsByCategoryAsync(string category)
        {
            var news = await _context.News
                .Include(n => n.Author)
                .Where(n => n.Category == category)
                .OrderByDescending(n => n.PublishedAt)
                .ToListAsync();

            return await Task.WhenAll(news.Select(async n => await GetNewsResponseDto(n)));
        }

        public async Task<bool> DeleteNewsAsync(int newsId)
        {
            var news = await _context.News.FindAsync(newsId);
            if (news == null)
                return false;

            _context.News.Remove(news);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<NewsResponseDto> GetNewsResponseDto(News news)
        {
            await _context.Entry(news).Reference(n => n.Author).LoadAsync();

            return new NewsResponseDto
            {
                Id = news.Id,
                Title = news.Title,
                Content = news.Content,
                Category = news.Category,
                ImageUrl = news.ImageUrl,
                Slug = news.Slug,
                IsPublished = news.IsPublished,
                PublishedAt = news.PublishedAt,
                AuthorName = $"{news.Author.FirstName} {news.Author.LastName}"
            };
        }

        private string GenerateSlug(string title)
        {
            string str = title.ToLower();
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"\s+", " ").Trim();
            str = Regex.Replace(str, @"\s", "-");
            return str;
        }
    }
} 