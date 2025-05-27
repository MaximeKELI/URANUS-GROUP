using System;
using System.ComponentModel.DataAnnotations;

namespace UranusGroup.Api.DTOs
{
    public class CreateNewsDto
    {
        [Required(ErrorMessage = "Le titre est requis")]
        [StringLength(200, ErrorMessage = "Le titre ne peut pas dépasser 200 caractères")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le contenu est requis")]
        public string Content { get; set; } = string.Empty;

        [Required(ErrorMessage = "La catégorie est requise")]
        [RegularExpression("^(Business|Technology|Quality|Environment|Security)$",
            ErrorMessage = "La catégorie doit être : Business, Technology, Quality, Environment ou Security")]
        public string Category { get; set; } = string.Empty;

        [Url(ErrorMessage = "L'URL de l'image n'est pas valide")]
        public string? ImageUrl { get; set; }

        public bool IsPublished { get; set; }
    }

    public class UpdateNewsDto
    {
        [Required(ErrorMessage = "Le titre est requis")]
        [StringLength(200, ErrorMessage = "Le titre ne peut pas dépasser 200 caractères")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le contenu est requis")]
        public string Content { get; set; } = string.Empty;

        [Required(ErrorMessage = "La catégorie est requise")]
        [RegularExpression("^(Business|Technology|Quality|Environment|Security)$",
            ErrorMessage = "La catégorie doit être : Business, Technology, Quality, Environment ou Security")]
        public string Category { get; set; } = string.Empty;

        [Url(ErrorMessage = "L'URL de l'image n'est pas valide")]
        public string? ImageUrl { get; set; }

        public bool IsPublished { get; set; }
    }

    public class NewsResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Slug { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public DateTime PublishedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
    }
} 