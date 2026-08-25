using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using TanProject.Framework.Messages;
using TanProject.Models.Chat;
using TanProject.Models.Reflection;
using TanProject.Services.AI;

namespace TanProject.Pages
{
    public class ReflectionModel : PageModel
    {
        private readonly ISessionSummaryAiService _aiService;
        public ReflectionModel(ISessionSummaryAiService aiService)
        {
            _aiService = aiService;
        }
        public void OnGet()
        {
        }
        public async Task<IActionResult> OnPostGenerate(
            [FromBody] ReflectionRequestDto request, CancellationToken ct)
        {
            if (request?.Messages == null || request.Messages.Count == 0)
                return BadRequest(new { error = UIMessages.MessageRequired });

            var history = request.Messages
                .Select(m => new ChatTurn(
                    m.Role == "assistant" ? ChatRole.Assistant : ChatRole.User,
                    m.Content)).ToList();

            var classification = await _aiService.ClassifyEmotionAsync(history, ct);
            var emotion = classification?.Emotion ?? "Calm";

            var reflectionText = await _aiService.GenerateReflectionAsync(emotion, request.BodyArea, history, ct);

            if (string.IsNullOrWhiteSpace(reflectionText))
                return StatusCode(502, new { error = "متن بازتاب تولید نشد." });

            return new JsonResult(new
            {
                emotion,
                imageUrl = EmotionImageMap.GetValueOrDefault(emotion, EmotionImageMap["Calm"]),
                paragraphs = ExtractParagraphs(reflectionText)
            });
        }
        private static IReadOnlyList<string> ExtractParagraphs(string html) =>
            html.Replace("<p>", "").Split("</p>", StringSplitOptions.RemoveEmptyEntries)
                .Select(p => p.Trim())
                .Where(p => !string.IsNullOrEmpty(p))
                .ToArray();
        private static readonly Dictionary<string, string> EmotionImageMap = new()
        {
            ["Grief"] = "/images/reflection/grief.jpg",
            ["Anxiety"] = "/images/reflection/anxiety.jpg",
            ["Anger"] = "/images/reflection/anger.jpg",
            ["Tension"] = "/images/reflection/tension.jpeg",
            ["Numbness"] = "/images/reflection/numbness.jpg",
            ["Coldness"] = "/images/reflection/coldness.jpg",
            ["Relief"] = "/images/reflection/relief.jpg",
            ["Calm"] = "/images/reflection/calm.jpg",
        };
    }
}
