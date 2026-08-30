namespace TanProject.Models.DTOs
{
    public class StartConversationRequestDto
    {
        public string? UserName { get; set; }
        public string? UserAge { get; set; }
        public List<SensationDto> SensationsList { get; set; } = new();
        public string Lang { get; set; }
    }
}
