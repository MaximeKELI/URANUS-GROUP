using System;

namespace UranusGroup.Api.DTOs
{
    public class CreateAppointmentDto
    {
        public int ServiceId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Notes { get; set; }
    }

    public class UpdateAppointmentDto
    {
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
    }

    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public string UserEmail { get; set; }
        public string UserFullName { get; set; }
    }
} 