using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace backend.Data
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<UserBoard> UserBoards { get; set; }
        public DbSet<TaskList> TaskLists { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // Identity setup

            //Relations
            builder.Entity<UserBoard>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .IsRequired();

            builder.Entity<TaskList>()
            .HasOne(l => l.UserBoard)
            .WithMany(b => b.TaskLists)
            .HasForeignKey(l => l.UserBoardId)
            .IsRequired();

            builder.Entity<TaskItem>()
            .HasOne(t => t.TaskList)
            .WithMany(l => l.TaskItems)
            .HasForeignKey(t => t.TaskListId)
            .IsRequired();
        }
    }
}