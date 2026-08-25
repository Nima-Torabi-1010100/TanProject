namespace TanProject.Models.Chat
{
    public record ChatTurn
    {
        public ChatRole Role { get; init; }
        public string Content { get; init; }
        public ChatTurn(ChatRole role, string content)
        {
            Role = role;
            Content = content;
        }
    }
}
