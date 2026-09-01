using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using TanProject.Data;
using TanProject.Framework.Messages;
using TanProject.Models.Chat;
using TanProject.Models.Reflection;
using TanProject.Services.AI;

namespace TanProject.Pages
{
    public class ReflectionModel : PageModel
    {
        private readonly ISessionSummaryAiService _aiService;
        private readonly TanDbContext _context;
        public ReflectionModel(ISessionSummaryAiService aiService, TanDbContext context)
        {
            _aiService = aiService;
            _context = context;
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

            var classification = await _aiService.ClassifyEmotionAsync(history, request.Lang, ct);
            var emotion = classification?.Emotion ?? "Calm";

            var reflectionText = await _aiService.GenerateReflectionAsync(emotion, request.BodyArea, history, request.Lang, ct);

            if (string.IsNullOrWhiteSpace(reflectionText))
                return StatusCode(502, new { error = "متن بازتاب تولید نشد." });

            return new JsonResult(new
            {
                emotion,
                imageUrl = EmotionImageMap.GetValueOrDefault(emotion, EmotionImageMap["Calm"]),
                paragraphs = ExtractParagraphs(reflectionText)
            });
        }
        public async Task<IActionResult> OnPostFeedbackAsync(int relevanceRating)
        {
            if (relevanceRating < 1 || relevanceRating > 5)
                return BadRequest();

            var feedback = new ReflectionFeedback
            {
                RelevanceRating = relevanceRating,
                CreatedAt = DateTime.UtcNow
            };

            _context.ReflectionFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return new JsonResult(new { success = true });
        }
        private static IReadOnlyList<string> ExtractParagraphs(string html) =>
            html.Replace("<p>", "").Split("</p>", StringSplitOptions.RemoveEmptyEntries)
                .Select(p => p.Trim())
                .Where(p => !string.IsNullOrEmpty(p))
                .ToArray();
        private static readonly Dictionary<string, string> EmotionImageMap = new()
        {
            ["Anger"] = "/images/reflection/anger.jpeg",
            ["Anxiety"] = "/images/reflection/anxiety.jpeg",
            ["Calm"] = "/images/reflection/calm.jpeg",
            ["Coldness"] = "/images/reflection/coldness.jpeg",
            ["Grief"] = "/images/reflection/grief.jpeg",
            ["Numbness"] = "/images/reflection/numbness.jpeg",
            ["Relief"] = "/images/reflection/relief.jpeg",
            ["Tension"] = "/images/reflection/tension.jpeg",
        };

    }
}
