using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using UranusGroup.Api.Data;
using UranusGroup.Api.DTOs;
using UranusGroup.Api.Models;

namespace UranusGroup.Api.Services
{
    public interface IChatService
    {
        Task<ChatResponseDto> SendMessageAsync(int userId, ChatMessageDto messageDto);
        Task<List<ChatResponseDto>> GetUserChatHistoryAsync(int userId);
    }

    public class ChatService : IChatService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly string _geminiApiKey;
        private readonly string _geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

        public ChatService(ApplicationDbContext context, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
            _geminiApiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini API Key is not configured");
        }

        public async Task<ChatResponseDto> SendMessageAsync(int userId, ChatMessageDto messageDto)
        {
            var prompt = $@"Tu es un assistant virtuel pour URANUS GROUP, une entreprise de services aux entreprises. 
            Tu dois répondre de manière professionnelle et concise aux questions des utilisateurs concernant nos services :
            - Conseil en stratégie et organisation
            - Services informatiques et transformation digitale
            - Qualité, Sécurité et Environnement (QSE)

            Question de l'utilisateur : {messageDto.Content}";

            var geminiRequest = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var response = await _httpClient.PostAsync(
                $"{_geminiApiUrl}?key={_geminiApiKey}",
                new StringContent(JsonSerializer.Serialize(geminiRequest), Encoding.UTF8, "application/json")
            );

            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseContent);

            var chatMessage = new ChatMessage
            {
                UserId = userId,
                Content = messageDto.Content,
                Response = geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text ?? "Désolé, je n'ai pas pu générer une réponse.",
                CreatedAt = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            return new ChatResponseDto
            {
                Id = chatMessage.Id,
                Content = chatMessage.Content,
                Response = chatMessage.Response,
                CreatedAt = chatMessage.CreatedAt
            };
        }

        public async Task<List<ChatResponseDto>> GetUserChatHistoryAsync(int userId)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .Take(50)
                .Select(m => new ChatResponseDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    Response = m.Response,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return messages;
        }

        private class GeminiResponse
        {
            public List<Candidate>? Candidates { get; set; }
        }

        private class Candidate
        {
            public Content? Content { get; set; }
        }

        private class Content
        {
            public List<Part>? Parts { get; set; }
        }

        private class Part
        {
            public string? Text { get; set; }
        }
    }
} 