using backend.Data;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/tasklists")]
    public class TaskListController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskListController(AppDbContext context)
        {
            _context = context;
        }

        // // GET lists by board ID, currently not needed
        // [HttpGet("~/api/userboards/{boardId}/tasklists")]
        // public async Task<IActionResult> GetByBoard(int boardId)
        // {
        //     var lists = await _context.TaskLists
        //         .Where(l => l.UserBoardId == boardId)
        //         .ToListAsync();

        //     var result = lists.Select(l => new TaskListDto
        //     {
        //         Id = l.Id,
        //         Title = l.Title!,
        //         UserBoardId = l.UserBoardId
        //     });

        //     return Ok(result);
        // }

        // POST
        [HttpPost]
        public async Task<IActionResult> Create(TaskListCreateDto dto)
        {
            var list = new TaskList
            {
                Title = dto.Title,
                BoardId = dto.BoardId
            };

            _context.TaskLists.Add(list);
            await _context.SaveChangesAsync();

            var result = new TaskListDto
            {
                Id = list.Id,
                Title = list.Title!,
                BoardId = list.BoardId
            };

            return Ok(result);

            // return CreatedAtAction(
            //     "GetNested",
            //     "UserBoard",
            //     new { id = list.BoardId },
            //     result);
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TaskListUpdateDto dto)
        {
            var list = await _context.TaskLists.FindAsync(id);
            if (list == null) return NotFound();

            list.Title = dto.Title;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var list = await _context.TaskLists.FindAsync(id);
            if (list == null) return NotFound();

            _context.TaskLists.Remove(list);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
