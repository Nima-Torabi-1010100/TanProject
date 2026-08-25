namespace TanProject.Services.AI.Ollama
{
    public class OllamaOptions
    {
        public string BaseUrl { get; set; } = "";
        public string Model { get; set; } = "";
        public string SystemPrompt { get; set; } = string.Empty;
    }
}
