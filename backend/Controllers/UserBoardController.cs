using backend.Data;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/userboards")]
    public class UserBoardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserBoardController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET all boards (dev/admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var boards = await _context.UserBoards.ToListAsync();
            var result = boards.Select(b => new UserBoardDto
            {
                Id = b.Id,
                Title = b.Title ?? "",
                UserId = b.UserId ?? ""
            });
            return Ok(result);
        }

        // GET board by id (dev/admin only)
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get(int id)
        {
            var b = await _context.UserBoards.FindAsync(id);
            if (b == null) return NotFound();

            var result = new UserBoardDto
            {
                Id = b.Id,
                Title = b.Title ?? "",
                UserId = b.UserId ?? ""
            };
            return Ok(result);
        }

        // GET board with nested lists and tasks for frontend board view
        [HttpGet("{id}/details")]
        [AllowAnonymous]
        public async Task<IActionResult> GetNested(int id)
        {
        var board = await _context.UserBoards
            .Include(b => b.TaskLists)
                .ThenInclude(l => l.TaskItems)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (board == null) return NotFound();

        var nestedDto = new UserBoardNestedDto
        {
            Id = board.Id,
            Title = board.Title ?? "",
            TaskLists = board.TaskLists.Select(l => new TaskListNestedDto
            {
                Id = l.Id,
                Title = l.Title ?? "",
                TaskItems = l.TaskItems
                    .OrderBy(t => t.Position) // 👈 enforce ordering here
                    .Select(t => new TaskItemNestedDto
                    {
                        Id = t.Id,
                        Title = t.Title ?? "",
                        Description = t.Description,
                        IsCompleted = t.IsCompleted,
                        Position = t.Position
                    })
                    .ToList()
            }).ToList()
        };

        return Ok(nestedDto);
        }

        // POST new board
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(UserBoardCreateDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized("User not found");

            var board = new UserBoard
            {
                Title = dto.Title ?? "",
                UserId = user.Id
            };

            _context.UserBoards.Add(board);
            await _context.SaveChangesAsync();

            var result = new UserBoardDto
            {
                Id = board.Id,
                Title = board.Title,
                UserId = board.UserId
            };

            return CreatedAtAction(nameof(Get), new { id = board.Id }, result);
        }

        // PUT update board
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, UserBoardUpdateDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var board = await _context.UserBoards.FindAsync(id);
            if (board == null) return NotFound();
            if (board.UserId != user.Id) return Forbid();

            board.Title = dto.Title ?? "";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE board
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var board = await _context.UserBoards.FindAsync(id);
            if (board == null) return NotFound();
            if (board.UserId != user.Id) return Forbid();

            _context.UserBoards.Remove(board);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET boards for current user
        [HttpGet("mine")]
        [Authorize]
        public async Task<IActionResult> GetMyBoards()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var boards = await _context.UserBoards
                .Where(b => b.UserId == user.Id)
                .ToListAsync();

            var result = boards.Select(b => new UserBoardDto
            {
                Id = b.Id,
                Title = b.Title ?? "",
                UserId = b.UserId ?? ""
            });

            return Ok(result);
        }
    }
}

