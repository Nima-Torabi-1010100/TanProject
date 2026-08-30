using TanProject.Models.Chat;

namespace TanProject.Services.AI
{
    public interface IChatAiService
    {
        Task<ChatReplyResult> GetReplyAsync(
            IReadOnlyList<ChatTurn> conversationHistory, string lang,
            CancellationToken cancellationToken = default);
        Task<ChatReplyResult> CompleteAsync(string systemPrompt, IReadOnlyList<ChatTurn> conversationHistory, string lang, CancellationToken ct = default);


    }
}
