using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserBoard>()
                .HasKey(ub => new { ub.ApplicationUserId, ub.BoardId });

            modelBuilder.Entity<UserBoard>()
                .HasOne(ub => ub.ApplicationUser)
                .WithMany(u => u.UserBoards)
                .HasForeignKey(ub => ub.ApplicationUserId);

            modelBuilder.Entity<UserBoard>()
                .HasOne(ub => ub.Board)
                .WithMany(b => b.UserBoards)
                .HasForeignKey(ub => ub.BoardId);
        }
            }
}