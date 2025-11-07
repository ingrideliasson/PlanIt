using System.Collections.Generic;

namespace backend.Models
{
    public class TaskList
    {
        public int Id { get; set; }
        public string? Title { get; set; }

        public int BoardId { get; set; } //FK to Board
        public Board Board { get; set; } = null!;

        public int ColorIndex { get; set; }
        public int Position { get; set; } // Order of the list within the board

        public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();
    }
}
