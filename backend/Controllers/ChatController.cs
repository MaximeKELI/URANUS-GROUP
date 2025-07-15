using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UranusGroup.Api.DTOs;
using UranusGroup.Api.Services;
using UranusGroup.Api.Models;

namespace UranusGroup.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in token");
            return int.Parse(userIdClaim.Value);
        }

        [HttpPost("message")]
        public async Task<ActionResult<ChatMessage>> SendMessage([FromBody] ChatMessage message)
        {
            if (string.IsNullOrEmpty(message.Content))
            {
                return BadRequest("Le message ne peut pas être vide");
            }

            var response = await _chatService.ProcessMessageAsync(message.Content, message.SessionId);
            return Ok(response);
        }

        [HttpGet("history")]
        public async Task<ActionResult<List<ChatResponseDto>>> GetChatHistory()
        {
            try
            {
                var userId = GetUserId();
                var history = await _chatService.GetUserChatHistoryAsync(userId);
                return Ok(history);
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
    }
} 