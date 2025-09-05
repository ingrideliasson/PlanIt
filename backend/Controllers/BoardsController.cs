using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public BoardsController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard([FromBody] BoardCreateDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var board = new Board
            {
                Title = dto.Title
            };

            var userBoard = new UserBoard
            {
                ApplicationUserId = user.Id,
                Role = "Owner",
                Board = board
            };

            board.UserBoards.Add(userBoard);

            _context.Boards.Add(board);
            await _context.SaveChangesAsync();

            return Ok(new { board.Id, board.Title });
        }
    }

    public class BoardCreateDto
    {
        public string Title { get; set; } = "";
    }
}
