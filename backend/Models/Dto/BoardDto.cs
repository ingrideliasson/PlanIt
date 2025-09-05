namespace backend.Models.Dto
{
    public class BoardDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public int UserBoardId { get; set; }
    }

}

