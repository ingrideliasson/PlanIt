namespace backend.Models.Dto
{
    public class UserDto
    {
        public string Id { get; set; } = null!;
        public string? UserName { get; set; }
        public string? Email { get; set; }
    }
}