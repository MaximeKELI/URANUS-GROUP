using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UranusGroup.Api.DTOs;
using UranusGroup.Api.Services;

namespace UranusGroup.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in token");
            return int.Parse(userIdClaim.Value);
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentResponseDto>> CreateAppointment([FromBody] CreateAppointmentDto dto)
        {
            try
            {
                var userId = GetUserId();
                var appointment = await _appointmentService.CreateAppointmentAsync(userId, dto);
                return Ok(appointment);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentResponseDto>> UpdateAppointment(int id, [FromBody] UpdateAppointmentDto dto)
        {
            try
            {
                var userId = GetUserId();
                var appointment = await _appointmentService.UpdateAppointmentAsync(id, userId, dto);
                return Ok(appointment);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("my")]
        public async Task<ActionResult<List<AppointmentResponseDto>>> GetMyAppointments()
        {
            try
            {
                var userId = GetUserId();
                var appointments = await _appointmentService.GetUserAppointmentsAsync(userId);
                return Ok(appointments);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<AppointmentResponseDto>>> GetAllAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetAllAppointmentsAsync();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {
            try
            {
                var userId = GetUserId();
                var result = await _appointmentService.DeleteAppointmentAsync(id, userId);
                if (!result)
                    return NotFound();
                return Ok();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("available-slots")]
        public async Task<ActionResult<List<DateTime>>> GetAvailableTimeSlots([FromQuery] int serviceId, [FromQuery] DateTime date)
        {
            try
            {
                var slots = await _appointmentService.GetAvailableTimeSlotsAsync(serviceId, date);
                return Ok(slots);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 