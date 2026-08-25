using TanProject.Models.Chat;

namespace TanProject.Services.AI
{
    public interface IChatAiService
    {
        Task<ChatReplyResult> GetReplyAsync(
            IReadOnlyList<ChatTurn> conversationHistory,
            CancellationToken cancellationToken = default);
        Task<ChatReplyResult> CompleteAsync(string systemPrompt, IReadOnlyList<ChatTurn> conversationHistory, CancellationToken ct = default);


    }
}
