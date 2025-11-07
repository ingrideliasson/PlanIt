namespace backend.Models.Dto
{
    public class BoardDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public int UserBoardId { get; set; }
        public string Role { get; set; } = "";
        public string? OwnerId { get; set; }
    }

}

