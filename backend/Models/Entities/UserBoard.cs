namespace backend.Models
{
    public class UserBoard
    {
        public int Id { get; set; }

        public string ApplicationUserId { get; set; } = null!;
        public ApplicationUser ApplicationUser { get; set; } = null!;

        public int BoardId { get; set; }
        public Board Board { get; set; } = null!;

        public string Role { get; set; } = "Member"; // Default role
        public int ColorIndex { get; set; }
    }
}