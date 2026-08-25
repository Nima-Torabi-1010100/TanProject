using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using TanProject.Framework.Messages;
using TanProject.Models.Chat;
using TanProject.Models.DTOs;
using TanProject.Prompts;
using TanProject.Services.AI;

namespace TanProject.Pages
{
    public class ChatModel : PageModel
    {
        private readonly IChatAiService _chatAiService;
        private readonly ILogger<ChatModel> _Logger;
        public ChatModel(IChatAiService chatAiService, ILogger<ChatModel> logger)
        {
            _chatAiService = chatAiService;
            _Logger = logger;
        }

        public void OnGet() { }

        public async Task<IActionResult> OnPostSendMessageAsync(
            [FromBody] ChatRequestDto request,
            CancellationToken cancellationToken)
        {
            if (request?.Messages == null || request.Messages.Count == 0)
                return BadRequest(new { error = UIMessages.MessageRequired });

            var history = request.Messages
                .Select(m => new ChatTurn(
                    m.Role == "assistant" ? ChatRole.Assistant : ChatRole.User,
                    m.Content))
                .ToList();

            var result = await _chatAiService.GetReplyAsync(history, cancellationToken);

            if (!result.Success)
                return StatusCode(502, new { reply = UIMessages.ModelUnavailableMessage });

            return new JsonResult(new { reply = result.Text });
        }

        public async Task<IActionResult> OnPostStartConversationAsync(
            [FromBody] StartConversationRequestDto request,
            CancellationToken cancellationToken)
        {
            var seedText = TanSeedPromptBuilder.Build(request);
            var history = new List<ChatTurn> { new ChatTurn(ChatRole.User, seedText) };

            var result = await _chatAiService.GetReplyAsync(history, cancellationToken);

            if (!result.Success)
                return StatusCode(502, new { reply = UIMessages.ModelUnavailableMessage });

            return new JsonResult(new { reply = result.Text, seed = seedText });
        }
    }
}
