namespace TanProject.Models.Chat
{
    public record ChatReplyResult
    {
        public string Text { get; init; }
        public bool Success { get; init; }
        public string? ErrorMessage { get; init; }
        public ChatReplyResult(string text, bool success, string? errorMessage = null)
        {
            Text = text;
            Success = success;
            ErrorMessage = errorMessage;
        }

    }
}
