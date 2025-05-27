using System;
using System.ComponentModel.DataAnnotations;

namespace UranusGroup.Api.DTOs
{
    public class ChatMessageDto
    {
        [Required(ErrorMessage = "Le message est requis")]
        [StringLength(1000, ErrorMessage = "Le message ne peut pas dépasser 1000 caractères")]
        public string Content { get; set; } = string.Empty;
    }

    public class ChatResponseDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
} 