using Microsoft.EntityFrameworkCore;
using TanProject.Models.Reflection;

namespace TanProject.Data
{
    public class TanDbContext : DbContext
    {
        public DbSet<ReflectionFeedback> ReflectionFeedbacks { get; set; }
        public TanDbContext(DbContextOptions<TanDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ReflectionFeedback>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.RelevanceRating)
                .IsRequired();

                entity.Property(x => x.CreatedAt)
                .IsRequired();
            });
        }
    }
}
