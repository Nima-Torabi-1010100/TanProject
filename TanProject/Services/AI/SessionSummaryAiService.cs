using System.Text.Json;
using TanProject.Models.Chat;
using TanProject.Models.Reflection;
using TanProject.Prompts;

namespace TanProject.Services.AI
{
    public class SessionSummaryAiService : ISessionSummaryAiService
    {
        private readonly IChatAiService _aiService;
        public SessionSummaryAiService(IChatAiService aiService)
        {
            _aiService = aiService;
        }

        public async Task<EmotionClassificationResult?> ClassifyEmotionAsync(
            IReadOnlyList<ChatTurn> conversationHistory, string lang, CancellationToken ct = default)
        {
            var result = await _aiService.CompleteAsync(TanSystemPrompt.EmotionClassification, conversationHistory, lang, ct: ct);
            if (!result.Success) return null;

            try
            {
                var json = result.Text
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();

                var parsed = JsonSerializer.Deserialize<EmotionClassificationResult>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (parsed is null || !AllowedEmotions.Contains(parsed.Emotion))
                    return null;

                return parsed;
            }
            catch (JsonException)
            {
                return null;
            }
        }

        public async Task<string> GenerateReflectionAsync(
            string emotion, string bodyArea, IReadOnlyList<ChatTurn> conversationHistory, string lang, CancellationToken ct = default)
        {
            var languageName = lang == "en" ? "English" : "فارسی";
            var imageDescription = TanImageDescription.ByEmotion.GetValueOrDefault(emotion, TanImageDescription.ByEmotion["Calm"]);
            var prompt = TanSystemPrompt.ReflectionTemplate
                .Replace("{{emotion}}", emotion)
                .Replace("{{body_area}}", bodyArea)
                .Replace("{{image_description}}", imageDescription)
                .Replace("{{language}}", languageName);

            var result = await _aiService.CompleteAsync(prompt, conversationHistory, lang, ct: ct);
            return result.Success ? result.Text : string.Empty;
        }

        private static readonly HashSet<string> AllowedEmotions = new(StringComparer.OrdinalIgnoreCase) {
        "Grief", "Anxiety", "Anger", "Tension", "Numbness", "Coldness", "Relief", "Calm"
        };
    }
}
