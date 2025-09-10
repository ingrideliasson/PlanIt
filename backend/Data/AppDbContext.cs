using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Board> Boards { get; set; }
        public DbSet<UserBoard> UserBoards { get; set; }
        public DbSet<TaskList> TaskLists { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<TaskAssignment> TaskAssignments { get; set; } // ✅ new entity

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- UserBoard ---
            modelBuilder.Entity<UserBoard>()
                .HasKey(ub => ub.Id);

            modelBuilder.Entity<UserBoard>()
                .HasIndex(ub => new { ub.ApplicationUserId, ub.BoardId })
                .IsUnique();

            modelBuilder.Entity<UserBoard>()
                .HasOne(ub => ub.ApplicationUser)
                .WithMany(u => u.UserBoards)
                .HasForeignKey(ub => ub.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserBoard>()
                .HasOne(ub => ub.Board)
                .WithMany(b => b.UserBoards)
                .HasForeignKey(ub => ub.BoardId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- TaskList ---
            modelBuilder.Entity<TaskList>()
                .HasOne(tl => tl.Board)
                .WithMany(b => b.TaskLists)
                .HasForeignKey(tl => tl.BoardId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- TaskItem ---
            modelBuilder.Entity<TaskItem>()
                .HasOne(ti => ti.TaskList)
                .WithMany(tl => tl.TaskItems)
                .HasForeignKey(ti => ti.TaskListId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- TaskAssignment ---
            modelBuilder.Entity<TaskAssignment>()
                .HasKey(ta => new { ta.TaskItemId, ta.ApplicationUserId }); 

            modelBuilder.Entity<TaskAssignment>()
                .HasOne(ta => ta.TaskItem)
                .WithMany(ti => ti.TaskAssignments) 
                .HasForeignKey(ta => ta.TaskItemId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskAssignment>()
                .HasOne(ta => ta.ApplicationUser)
                .WithMany(u => u.TaskAssignments) 
                .HasForeignKey(ta => ta.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
