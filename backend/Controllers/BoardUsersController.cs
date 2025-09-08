using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/boards/{boardId}/users")]
    [Authorize]
    public class BoardUsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BoardUsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/boards/{boardId}/users
        [HttpGet]
        public async Task<IActionResult> GetBoardUsers(int boardId)
        {
            var board = await _context.Boards
                .Include(b => b.UserBoards)
                    .ThenInclude(ub => ub.ApplicationUser)
                .FirstOrDefaultAsync(b => b.Id == boardId);

            if (board == null) return NotFound("Board not found");

            var users = board.UserBoards.Select(ub => new
            {
                ub.ApplicationUserId,
                ub.ApplicationUser.UserName,
                ub.ApplicationUser.FirstName,
                ub.ApplicationUser.LastName,
                ub.Role
            });

            return Ok(users);
        }

        // GET: api/boards/{boardId}/users/search?username=foo
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return BadRequest("Username is required");

            var users = await _context.Users
                .Where(u => EF.Functions.Like(u.UserName, $"%{username}%"))
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.FirstName,
                    u.LastName
                })
                .ToListAsync();

            return Ok(users);
        }

        // POST: api/boards/{boardId}/users
        [HttpPost]
        public async Task<IActionResult> AddUserToBoard(int boardId, [FromBody] AddUserDto dto)
        {
            var board = await _context.Boards
                .Include(b => b.UserBoards)
                .FirstOrDefaultAsync(b => b.Id == boardId);
            if (board == null) return NotFound("Board not found");

            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return NotFound("User not found");

            if (board.UserBoards.Any(ub => ub.ApplicationUserId == dto.UserId))
                return BadRequest("User already added to board");

            var userBoard = new UserBoard
            {
                ApplicationUserId = dto.UserId,
                BoardId = boardId,
                Role = string.IsNullOrWhiteSpace(dto.Role) ? "Member" : dto.Role
            };

            _context.UserBoards.Add(userBoard);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                userBoard.ApplicationUserId,
                user.UserName,
                user.FirstName,
                user.LastName,
                userBoard.Role
            });
        }

        // PUT: api/boards/{boardId}/users/{userId}
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserRole(int boardId, string userId, [FromBody] UpdateRoleDto dto)
        {
            var userBoard = await _context.UserBoards
                .FirstOrDefaultAsync(ub => ub.BoardId == boardId && ub.ApplicationUserId == userId);

            if (userBoard == null) return NotFound("User not found on this board");

            userBoard.Role = dto.Role;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/boards/{boardId}/users/{userId}
        [HttpDelete("{userId}")]
        public async Task<IActionResult> RemoveUserFromBoard(int boardId, string userId)
        {
            var userBoard = await _context.UserBoards
                .FirstOrDefaultAsync(ub => ub.BoardId == boardId && ub.ApplicationUserId == userId);

            if (userBoard == null) return NotFound("User not found on this board");

            _context.UserBoards.Remove(userBoard);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class AddUserDto
    {
        public string UserId { get; set; } = null!;
        public string? Role { get; set; }
    }

    public class UpdateRoleDto
    {
        public string Role { get; set; } = "Member";
    }
}


