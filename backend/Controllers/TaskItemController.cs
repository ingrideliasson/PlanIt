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
                .OrderBy(t => t.Position)
                .ToListAsync();

            var result = tasks.Select(t => new TaskItemDto
            {
                Id = t.Id,
                Title = t.Title!,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                TaskListId = t.TaskListId,
                Position = t.Position
            });

            return Ok(result);
        }

        // POST, PUT, DELETE remain the same using DTOs
        [HttpPost]
        public async Task<IActionResult> Create(TaskItemCreateDto dto)
        {
            // Get current highest position to determine where to place task
            var maxPosition = await _context.TaskItems
                .Where(t => t.TaskListId == dto.TaskListId)
                .MaxAsync(t => (int?)t.Position) ?? -1;

            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                TaskListId = dto.TaskListId,
                Position = maxPosition + 1 // Place at end
            };

            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            var result = new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title!,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                TaskListId = task.TaskListId,
                Position = task.Position
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

        [HttpPut("{id}/move")]
        public async Task<IActionResult> MoveTask(int id, TaskItemMoveDto dto)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null) return NotFound();

            var sourceListId = task.TaskListId;

            // Get source tasks excluding the moving task
            var sourceTasks = await _context.TaskItems
                .Where(t => t.TaskListId == sourceListId && t.Id != task.Id)
                .OrderBy(t => t.Position)
                .ToListAsync();

            // Rebuild positions in source list
            for (int i = 0; i < sourceTasks.Count; i++)
                sourceTasks[i].Position = i;

            // Get destination tasks excluding the moving task
            var destTasks = await _context.TaskItems
                .Where(t => t.TaskListId == dto.TaskListId && t.Id != task.Id)
                .OrderBy(t => t.Position)
                .ToListAsync();

            // Clamp destination position to [0, destTasks.Count]
            var position = Math.Min(Math.Max(dto.Position, 0), destTasks.Count);

            // Update task’s list if moving across lists
            task.TaskListId = dto.TaskListId;

            // Insert task into destination list
            destTasks.Insert(position, task);

            // Rebuild positions in destination list
            for (int i = 0; i < destTasks.Count; i++)
                destTasks[i].Position = i;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: /api/taskitems/{taskId}/assignments
        [HttpGet("{taskId}/assignments")]
        public async Task<IActionResult> GetAssignments(int taskId)
        {
            var task = await _context.TaskItems
                .Include(t => t.TaskAssignments)
                    .ThenInclude(ta => ta.ApplicationUser)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null) return NotFound("Task not found");

            var assignedUsers = task.TaskAssignments.Select(ta => new TaskAssignmentUserDto
            {
                ApplicationUserId = ta.ApplicationUserId,
                FirstName = ta.ApplicationUser.FirstName ?? "",
                LastName = ta.ApplicationUser.LastName ?? ""
            });

            return Ok(assignedUsers);
        }

        // POST: /api/taskitems/{taskId}/assignments
        [HttpPost("{taskId}/assignments")]
        public async Task<IActionResult> AssignUser(int taskId, TaskAssignmentCreateDto dto)
        {
            var task = await _context.TaskItems.FindAsync(taskId);
            if (task == null) return NotFound("Task not found");

            // Check if user is already assigned
            if (await _context.TaskAssignments.AnyAsync(ta => ta.TaskItemId == taskId && ta.ApplicationUserId == dto.ApplicationUserId))
                return BadRequest("User already assigned to this task");

            // Optional: verify user is member of the board
            var taskList = await _context.TaskLists.Include(tl => tl.Board)
                                    .ThenInclude(b => b.UserBoards)
                                    .FirstOrDefaultAsync(tl => tl.Id == task.TaskListId);

            if (taskList == null) return BadRequest("TaskList not found");

            var isBoardMember = taskList.Board.UserBoards.Any(ub => ub.ApplicationUserId == dto.ApplicationUserId);
            if (!isBoardMember) return BadRequest("User is not a member of this board");

            var assignment = new TaskAssignment
            {
                TaskItemId = taskId,
                ApplicationUserId = dto.ApplicationUserId
            };

            _context.TaskAssignments.Add(assignment);
            await _context.SaveChangesAsync();

            return Ok(new { dto.ApplicationUserId });
        }

        // DELETE: /api/taskitems/{taskId}/assignments/{userId}
        [HttpDelete("{taskId}/assignments/{userId}")]
        public async Task<IActionResult> RemoveAssignment(int taskId, string userId)
        {
            var assignment = await _context.TaskAssignments
                .FirstOrDefaultAsync(ta => ta.TaskItemId == taskId && ta.ApplicationUserId == userId);

            if (assignment == null) return NotFound("Assignment not found");

            _context.TaskAssignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}