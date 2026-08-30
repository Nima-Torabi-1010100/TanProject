using TanProject.Models.Chat;
using TanProject.Models.Reflection;

namespace TanProject.Services.AI
{
    public interface ISessionSummaryAiService
    {
        Task<EmotionClassificationResult> ClassifyEmotionAsync(IReadOnlyList<ChatTurn> conversationHistory, string lang, CancellationToken ct = default);
        Task<string> GenerateReflectionAsync(string emotion, string bodyArea, IReadOnlyList<ChatTurn> conversationHistory, string lang, CancellationToken ct = default);
    }
}
