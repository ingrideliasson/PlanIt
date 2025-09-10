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
            // Get existing lists for this board to determine color index
            var existingLists = await _context.TaskLists
                .Where(l => l.BoardId == dto.BoardId)
                .ToListAsync();

            // Define your default color count (matches frontend)
            int defaultColorCount = 5; // e.g., Blue, Green, Pink, Yellow
            int colorIndex = existingLists.Count % defaultColorCount;

            var list = new TaskList
            {
                Title = dto.Title,
                BoardId = dto.BoardId,
                ColorIndex = colorIndex
            };

            _context.TaskLists.Add(list);
            await _context.SaveChangesAsync();

            var result = new TaskListDto
            {
                Id = list.Id,
                Title = list.Title!,
                BoardId = list.BoardId,
                ColorIndex = list.ColorIndex // Return color index
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
    }
}
