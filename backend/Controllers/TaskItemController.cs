using backend.Data;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/taskitems")]
    public class TaskItemController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskItemController(AppDbContext context)
        {
            _context = context;
        }

        // GET tasks by list ID (flat)
        [HttpGet("~/api/tasklists/{listId}/taskitems")]
        public async Task<IActionResult> GetByTaskList(int listId)
        {
            var tasks = await _context.TaskItems
                .Where(t => t.TaskListId == listId)
                .ToListAsync();

            var result = tasks.Select(t => new TaskItemDto
            {
                Id = t.Id,
                Title = t.Title!,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                TaskListId = t.TaskListId
            });

            return Ok(result);
        }

        // POST, PUT, DELETE remain the same using DTOs
        [HttpPost]
        public async Task<IActionResult> Create(TaskItemCreateDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                TaskListId = dto.TaskListId
            };

            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            var result = new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title!,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                TaskListId = task.TaskListId
            };

            return CreatedAtAction(nameof(GetByTaskList), new { listId = task.TaskListId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TaskItemUpdateDto dto)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null) return NotFound();

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}