namespace backend.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }

        public int TaskListId { get; set; } //FK to TaskList
        public TaskList TaskList { get; set; } = null!;

        public int Position { get; set; } // Order of the task within the list
        
        public ICollection<TaskAssignment> TaskAssignments { get; set; } = new List<TaskAssignment>();
    }
}