using System.ComponentModel.DataAnnotations;

namespace TanProject.Models.Reflection
{
    public class ReflectionFeedback
    {
        public int Id { get; set; }
        [Range(1, 5)]
        public int RelevanceRating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
