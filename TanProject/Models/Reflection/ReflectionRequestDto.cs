using TanProject.Models.DTOs;

namespace TanProject.Models.Reflection
{
    public class ReflectionRequestDto
    {
        public List<ChatMessageDto> Messages { get; set; } = new();
        public string BodyArea { get; set; } = "";
    }
}
