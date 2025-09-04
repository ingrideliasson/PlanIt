namespace backend.Models.Dto
{
    public class TaskItemDto // Flat DTO, used in CRUD / list endpoints
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public int TaskListId { get; set; }
        public int Position { get; set; }
    }

    public class TaskItemCreateDto
    {
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public int TaskListId { get; set; }
    }

    public class TaskItemUpdateDto
    {
        public string? Title { get; set; } = "";
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
    }

    // Nested DTO used for hierarchical read views (in board details)
    public class TaskItemNestedDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public int Position { get; set; }
    }

    // For moving tasks between and inside lists
    public class TaskItemMoveDto
    {
        public int TaskListId { get; set; }
        public int Position { get; set; }
    }
}