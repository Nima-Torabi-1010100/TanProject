using System.ComponentModel.DataAnnotations;

namespace TanProject.Models.Reflection
{
    public class CreateReflectionFeedbackDto
    {
        [Range(1, 5)]
        public int RelevanceRating { get; set; }
    }
}
