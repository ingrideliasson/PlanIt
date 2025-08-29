using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace backend.Models
{
    public class UserBoard
{
    public int Id { get; set; }
    public string Title { get; set; } = "";

    public string? UserId { get; set; } //FK to IdentityUser
    public ApplicationUser User { get; set; } = null!;

    public ICollection<TaskList> TaskLists { get; set; } = new List<TaskList>();
}
}
