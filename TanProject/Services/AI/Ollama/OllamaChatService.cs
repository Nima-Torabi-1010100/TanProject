using System.Threading;
using TanProject.Models.Chat;

namespace TanProject.Services.AI.Ollama
{
    public class OllamaChatService : IChatAiService
    {
        private readonly HttpClient _client;
        private readonly OllamaOptions _options;
        public OllamaChatService(HttpClient client, OllamaOptions options)
        {
            _client = client;
            _options = options;
        }

        public async Task<ChatReplyResult> CompleteAsync(string systemPrompt, IReadOnlyList<ChatTurn> conversationHistory, string lang, CancellationToken ct = default)
        {
            var languageInstruction = lang == "en"
                ? "Respond only in English."
                : "همیشه فقط به زبان فارسی پاسخ بده.";

            systemPrompt = $"{systemPrompt}\n\n{languageInstruction}";

            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };
            messages.AddRange(conversationHistory.Select(m => new
            {
                role = m.Role switch
                {
                    ChatRole.User => "user",
                    ChatRole.Assistant => "assistant",
                    _ => "system"
                },
                content = m.Content
            }));
            var payload = new
            {
                model = _options.Model,
                messages,
                stream = false,
                think = false
            };
            try
            {
                var response = await _client.PostAsJsonAsync("/api/chat", payload, ct);
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadFromJsonAsync<OllamaChatResponse>(cancellationToken: ct);
                var text = result?.Message?.Content?.Trim() ?? string.Empty;
                return new ChatReplyResult(text, success: !string.IsNullOrEmpty(text));
            }
            catch (Exception ex)
            {
                return new ChatReplyResult(string.Empty, success: false, errorMessage: ex.Message);
            }
        }

        public async Task<ChatReplyResult> GetReplyAsync(IReadOnlyList<ChatTurn> conversationHistory, string lang, CancellationToken ct = default)
        {
            var languageInstruction = lang == "en"
                ? "Respond only in English, regardless of the language used elsewhere."
                : "همیشه فقط به زبان فارسی پاسخ بده.";

            var systemPrompt = $"{_options.SystemPrompt}\n\n{languageInstruction}";
            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt}
            };
            messages.AddRange(conversationHistory.Select(m => new
            {
                role = m.Role switch
                {
                    ChatRole.User => "user",
                    ChatRole.Assistant => "assistant",
                    _ => "system"
                },
                content = m.Content
            }));
            var payload = new
            {
                model = _options.Model,
                messages,
                stream = false,
                think = false
            };

            try
            {
                var response = await _client.PostAsJsonAsync("/api/chat", payload, ct);
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadFromJsonAsync<OllamaChatResponse>(cancellationToken: ct);
                var text = result?.Message?.Content?.Trim() ?? string.Empty;
                return new ChatReplyResult(text, success: !string.IsNullOrEmpty(text));
            }
            catch (Exception ex)
            {
                return new ChatReplyResult(string.Empty, success: false, errorMessage: ex.Message);
            }
        }
    }
}
