using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UranusGroup.Api.Data;
using UranusGroup.Api.DTOs;
using UranusGroup.Api.Models;

namespace UranusGroup.Api.Services
{
    public interface IAppointmentService
    {
        Task<AppointmentResponseDto> CreateAppointmentAsync(int userId, CreateAppointmentDto dto);
        Task<AppointmentResponseDto> UpdateAppointmentAsync(int appointmentId, int userId, UpdateAppointmentDto dto);
        Task<List<AppointmentResponseDto>> GetUserAppointmentsAsync(int userId);
        Task<List<AppointmentResponseDto>> GetAllAppointmentsAsync();
        Task<bool> DeleteAppointmentAsync(int appointmentId, int userId);
        Task<List<DateTime>> GetAvailableTimeSlotsAsync(int serviceId, DateTime date);
    }

    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;

        public AppointmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AppointmentResponseDto> CreateAppointmentAsync(int userId, CreateAppointmentDto dto)
        {
            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (service == null)
                throw new Exception("Service not found");

            var appointment = new Appointment
            {
                UserId = userId,
                ServiceId = dto.ServiceId,
                AppointmentDate = dto.AppointmentDate,
                Status = "Scheduled",
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return await GetAppointmentResponseDto(appointment);
        }

        public async Task<AppointmentResponseDto> UpdateAppointmentAsync(int appointmentId, int userId, UpdateAppointmentDto dto)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.UserId == userId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.Status = dto.Status;
            appointment.Notes = dto.Notes;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetAppointmentResponseDto(appointment);
        }

        public async Task<List<AppointmentResponseDto>> GetUserAppointmentsAsync(int userId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.User)
                .Where(a => a.UserId == userId)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();

            var responses = new List<AppointmentResponseDto>();
            foreach (var appointment in appointments)
            {
                responses.Add(await GetAppointmentResponseDto(appointment));
            }
            return responses;
        }

        public async Task<List<AppointmentResponseDto>> GetAllAppointmentsAsync()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.User)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();

            var responses = new List<AppointmentResponseDto>();
            foreach (var appointment in appointments)
            {
                responses.Add(await GetAppointmentResponseDto(appointment));
            }
            return responses;
        }

        public async Task<bool> DeleteAppointmentAsync(int appointmentId, int userId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.UserId == userId);

            if (appointment == null)
                return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<DateTime>> GetAvailableTimeSlotsAsync(int serviceId, DateTime date)
        {
            var service = await _context.Services.FindAsync(serviceId);
            if (service == null)
                throw new Exception("Service not found");

            var startTime = new TimeSpan(9, 0, 0); // 9:00 AM
            var endTime = new TimeSpan(17, 0, 0);  // 5:00 PM
            var duration = TimeSpan.FromMinutes(service.DurationMinutes);

            var existingAppointments = await _context.Appointments
                .Where(a => a.ServiceId == serviceId && a.AppointmentDate.Date == date.Date)
                .Select(a => a.AppointmentDate.TimeOfDay)
                .ToListAsync();

            var availableSlots = new List<DateTime>();
            var currentTime = startTime;

            while (currentTime.Add(duration) <= endTime)
            {
                var slotTime = date.Date.Add(currentTime);
                if (!existingAppointments.Any(t => 
                    t >= currentTime && 
                    t < currentTime.Add(duration)))
                {
                    availableSlots.Add(slotTime);
                }
                currentTime = currentTime.Add(duration);
            }

            return availableSlots;
        }

        private async Task<AppointmentResponseDto> GetAppointmentResponseDto(Appointment appointment)
        {
            await _context.Entry(appointment).Reference(a => a.Service).LoadAsync();
            await _context.Entry(appointment).Reference(a => a.User).LoadAsync();

            return new AppointmentResponseDto
            {
                Id = appointment.Id,
                ServiceId = appointment.ServiceId,
                ServiceName = appointment.Service.Name,
                AppointmentDate = appointment.AppointmentDate,
                Status = appointment.Status,
                Notes = appointment.Notes,
                UserEmail = appointment.User.Email,
                UserFullName = $"{appointment.User.FirstName} {appointment.User.LastName}"
            };
        }
    }
} 