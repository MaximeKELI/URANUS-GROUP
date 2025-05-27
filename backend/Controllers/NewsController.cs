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
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in token");
            return int.Parse(userIdClaim.Value);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<NewsResponseDto>> CreateNews([FromBody] CreateNewsDto dto)
        {
            try
            {
                var authorId = GetUserId();
                var news = await _newsService.CreateNewsAsync(authorId, dto);
                return Ok(news);
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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<NewsResponseDto>> UpdateNews(int id, [FromBody] UpdateNewsDto dto)
        {
            try
            {
                var news = await _newsService.UpdateNewsAsync(id, dto);
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<NewsResponseDto>>> GetAllNews()
        {
            try
            {
                var news = await _newsService.GetAllNewsAsync();
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NewsResponseDto>> GetNewsById(int id)
        {
            try
            {
                var news = await _newsService.GetNewsByIdAsync(id);
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<NewsResponseDto>>> GetNewsByCategory(string category)
        {
            try
            {
                var news = await _newsService.GetNewsByCategoryAsync(category);
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteNews(int id)
        {
            try
            {
                var result = await _newsService.DeleteNewsAsync(id);
                if (!result)
                    return NotFound();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 