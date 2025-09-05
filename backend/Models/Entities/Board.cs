using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace backend.Models
{
    public class Board
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";

        // A board can have many users through UserBoard join table
        public ICollection<UserBoard> UserBoards { get; set; } = new List<UserBoard>();

        public ICollection<TaskList> TaskLists { get; set; } = new List<TaskList>();
    }
}
