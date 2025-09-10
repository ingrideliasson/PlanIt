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

            // Load board with navigation properties
            var boardEntity = await _context.Boards
                .Include(b => b.UserBoards)
                    .ThenInclude(ub => ub.ApplicationUser)
                .Include(b => b.TaskLists)
                    .ThenInclude(l => l.TaskItems)
                        .ThenInclude(t => t.TaskAssignments)
                            .ThenInclude(a => a.ApplicationUser)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (boardEntity == null) return NotFound();

            // Map manually
            var board = new
            {
                boardEntity.Id,
                boardEntity.Title,
                UserBoardId = boardEntity.UserBoards.FirstOrDefault(ub => ub.ApplicationUserId == user.Id)?.Id,
                OwnerId = boardEntity.UserBoards.FirstOrDefault(ub => ub.Role == "Owner")?.ApplicationUserId,

                // 👇 Add members with ColorIndex here
                Members = boardEntity.UserBoards.Select(ub => new
                {
                    ub.ApplicationUserId,
                    ub.ApplicationUser.FirstName,
                    ub.ApplicationUser.LastName,
                    ub.Role,
                    ub.ColorIndex
                }).ToList(),

                TaskLists = boardEntity.TaskLists.Select(l => new
                {
                    l.Id,
                    l.Title,
                    l.ColorIndex,
                    TaskItems = l.TaskItems
                        .OrderBy(t => t.Position)
                        .Select(t => new
                        {
                            t.Id,
                            t.Title,
                            t.Description,
                            t.IsCompleted,
                            t.Position,
                            AssignedUsers = t.TaskAssignments.Select(a => new
                            {
                                a.ApplicationUserId,
                                a.ApplicationUser.FirstName,
                                a.ApplicationUser.LastName,
                                ColorIndex = boardEntity.UserBoards
                                    .FirstOrDefault(ub => ub.ApplicationUserId == a.ApplicationUserId)?.ColorIndex ?? 0
                            }).ToList()
                        }).ToList()
                }).ToList()
            };

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
                Board = board,
                ColorIndex = 0
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
