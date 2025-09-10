namespace backend.Models
{
    public class TaskAssignment
{
    // Composite key: TaskItemId + ApplicationUserId
    public int TaskItemId { get; set; }
    public TaskItem TaskItem { get; set; } = null!;

    public string ApplicationUserId { get; set; } = null!;
    public ApplicationUser ApplicationUser { get; set; } = null!;
}
}