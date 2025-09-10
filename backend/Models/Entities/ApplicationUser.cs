using Microsoft.AspNetCore.Identity;
using backend.Models;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public ICollection<UserBoard> UserBoards { get; set; } = new List<UserBoard>();

    public ICollection<TaskAssignment> TaskAssignments { get; set; } = new List<TaskAssignment>();
}
