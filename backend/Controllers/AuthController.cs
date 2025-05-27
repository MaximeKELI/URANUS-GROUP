using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UranusGroup.Api.Models.Auth;
using UranusGroup.Api.Services;
using UranusGroup.Api.DTOs;

namespace UranusGroup.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                if (response == null)
                    return Unauthorized(new { message = "Email ou mot de passe incorrect" });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la tentative de connexion pour {Email}", request.Email);
                return StatusCode(500, new { message = "Une erreur est survenue lors de la connexion" });
            }
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<LoginResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var response = await _authService.RefreshTokenAsync(request.RefreshToken);
                if (response == null)
                    return Unauthorized(new { message = "Token de rafraîchissement invalide" });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors du rafraîchissement du token");
                return StatusCode(500, new { message = "Une erreur est survenue lors du rafraîchissement du token" });
            }
        }
    }
} 