using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Models.Dto;

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

        [HttpGet]
        public async Task<IActionResult> GetUserBoards()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var boards = await _context.UserBoards
                .Where(ub => ub.ApplicationUserId == user.Id)
                .Select(ub => new BoardDto
                {
                    Id = ub.Board.Id,
                    Title = ub.Board.Title,
                    UserBoardId = ub.Id
                })
                .ToListAsync();

            return Ok(boards);
        }


        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetBoardDetails(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var board = await _context.Boards
                .Where(b => b.Id == id)
                .Select(b => new 
                {
                    b.Id,
                    b.Title,
                    UserBoardId = b.UserBoards
                        .Where(ub => ub.ApplicationUserId == user.Id)
                        .Select(ub => ub.Id)
                        .FirstOrDefault(),
                    OwnerId = b.UserBoards
                        .Where(ub => ub.Role == "Owner")
                        .Select(ub => ub.ApplicationUserId)
                        .FirstOrDefault(),
                    TaskLists = b.TaskLists
                        .Select(l => new 
                        {
                            l.Id,
                            l.Title,
                            TaskItems = l.TaskItems
                                .OrderBy(t => t.Position)
                                .Select(t => new 
                                {
                                    t.Id,
                                    t.Title,
                                    t.Description,
                                    t.IsCompleted,
                                    t.Position
                                })
                                .ToList()
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (board == null) return NotFound();

            return Ok(board);
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

            return Ok(new BoardDto { Id = board.Id, Title = board.Title, UserBoardId = userBoard.Id });
        }
    }

    public class BoardCreateDto
    {
        public string Title { get; set; } = "";
    }
}
