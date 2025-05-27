using System;
using System.ComponentModel.DataAnnotations;

namespace UranusGroup.Api.DTOs
{
    public class CreateAppointmentDto
    {
        [Required(ErrorMessage = "Le service est requis")]
        public int ServiceId { get; set; }

        [Required(ErrorMessage = "La date du rendez-vous est requise")]
        [FutureDate(ErrorMessage = "La date du rendez-vous doit être dans le futur")]
        public DateTime AppointmentDate { get; set; }

        [StringLength(500, ErrorMessage = "Les notes ne peuvent pas dépasser 500 caractères")]
        public string? Notes { get; set; }
    }

    public class UpdateAppointmentDto
    {
        [Required(ErrorMessage = "La date du rendez-vous est requise")]
        [FutureDate(ErrorMessage = "La date du rendez-vous doit être dans le futur")]
        public DateTime AppointmentDate { get; set; }

        [Required(ErrorMessage = "Le statut est requis")]
        [RegularExpression("^(Scheduled|Confirmed|Cancelled|Completed)$", 
            ErrorMessage = "Le statut doit être : Scheduled, Confirmed, Cancelled ou Completed")]
        public string Status { get; set; } = "Scheduled";

        [StringLength(500, ErrorMessage = "Les notes ne peuvent pas dépasser 500 caractères")]
        public string? Notes { get; set; }
    }

    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
    }

    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is DateTime date)
            {
                return date > DateTime.UtcNow;
            }
            return false;
        }
    }
} 