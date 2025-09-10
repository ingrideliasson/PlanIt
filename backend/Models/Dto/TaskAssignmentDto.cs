namespace backend.Models.Dto
{
    // DTO to send assigned users for a task
    public class TaskAssignmentDto
    {
        public int TaskItemId { get; set; }
        public string ApplicationUserId { get; set; } = null!;
    }

    // DTO to assign a user to a task
    public class TaskAssignmentCreateDto
    {
        public string ApplicationUserId { get; set; } = null!;
    }

    // Optional DTO if you want to return assignments with user info
    public class TaskAssignmentUserDto
    {
        public string ApplicationUserId { get; set; } = null!;
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
    }
}
