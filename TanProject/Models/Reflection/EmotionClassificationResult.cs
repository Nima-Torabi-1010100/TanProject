namespace TanProject.Models.Reflection
{
    public record EmotionClassificationResult
    {
        public string? Emotion { get; init; }
        public string? Confidence { get; init; }
        public EmotionClassificationResult(string emotion, string confidence)
        {
            Emotion = emotion;
            Confidence = confidence;
        }
    }
}
