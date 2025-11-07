namespace backend.Models.Dto
{
    public class TaskListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public int BoardId { get; set; }

        public int ColorIndex { get; set; }
        public int Position { get; set; }
    }

    public class TaskListCreateDto
    {
        public string Title { get; set; } = "";
        public int BoardId { get; set; }
    }

    public class TaskListUpdateDto
    {
        public string Title { get; set; } = "";
    }

    public class TaskListMoveDto
    {
        public int Position { get; set; }
    }

    public class TaskListNestedDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";

        public int ColorIndex { get; set; }
        public List<TaskItemNestedDto> TaskItems { get; set; } = new();
    }

    
}