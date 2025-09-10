namespace backend.Models.Dto
{
    public class UserBoardDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string UserId { get; set; } = "";
        public int ColorIndex { get; set; }
    }

    public class UserBoardCreateDto
    {
        public string Title { get; set; } = "";
    }

    public class UserBoardUpdateDto
    {
        public string Title { get; set; } = "";
    }

    public class UserBoardNestedDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public List<TaskListNestedDto> TaskLists { get; set; } = new();
        public int ColorIndex { get; set; }
    }
    
}