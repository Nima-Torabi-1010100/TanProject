namespace TanProject.Models.DTOs
{
    public class ChatRequestDto
    {
        public List<ChatMessageDto> Messages { get; set; } = new();
    }
}
