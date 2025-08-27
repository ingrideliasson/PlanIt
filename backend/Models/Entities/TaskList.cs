using System.Collections.Generic;

namespace backend.Models
{
    public class TaskList
{
    public int Id { get; set; }
    public string? Title { get; set; }

    public int UserBoardId { get; set; } //FK to Board
    public UserBoard UserBoard { get; set; } = null!;

    public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();
}
}
