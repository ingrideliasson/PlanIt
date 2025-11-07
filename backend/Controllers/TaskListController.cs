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

        // POST
        [HttpPost]
        public async Task<IActionResult> Create(TaskListCreateDto dto)
        {
            // Get existing lists for this board to determine color index and position
            var existingLists = await _context.TaskLists
                .Where(l => l.BoardId == dto.BoardId)
                .ToListAsync();

            // Define your default color count (matches frontend)
            int defaultColorCount = 5; // e.g., Blue, Green, Pink, Yellow
            int colorIndex = existingLists.Count % defaultColorCount;
            
            // Get max position to place new list at the end
            int maxPosition = existingLists.Any() ? existingLists.Max(l => l.Position) : -1;

            var list = new TaskList
            {
                Title = dto.Title,
                BoardId = dto.BoardId,
                ColorIndex = colorIndex,
                Position = maxPosition + 1
            };

            _context.TaskLists.Add(list);
            await _context.SaveChangesAsync();

            var result = new TaskListDto
            {
                Id = list.Id,
                Title = list.Title!,
                BoardId = list.BoardId,
                ColorIndex = list.ColorIndex, // Return color index
                Position = list.Position
            };

            return Ok(result);
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

        // PUT: Move list to new position
        [HttpPut("{id}/move")]
        public async Task<IActionResult> MoveList(int id, TaskListMoveDto dto)
        {
            var list = await _context.TaskLists.FindAsync(id);
            if (list == null) return NotFound();

            var boardId = list.BoardId;

            // Get all lists for this board excluding the moving list
            var lists = await _context.TaskLists
                .Where(l => l.BoardId == boardId && l.Id != id)
                .OrderBy(l => l.Position)
                .ToListAsync();

            // Clamp destination position to [0, lists.Count]
            var position = Math.Min(Math.Max(dto.Position, 0), lists.Count);

            // Insert the moving list at the new position
            lists.Insert(position, list);

            // Rebuild positions for all lists
            for (int i = 0; i < lists.Count; i++)
            {
                lists[i].Position = i;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
