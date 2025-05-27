using System;

namespace UranusGroup.Api.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        public virtual User User { get; set; } = null!;
        public virtual Service Service { get; set; } = null!;
    }
} 