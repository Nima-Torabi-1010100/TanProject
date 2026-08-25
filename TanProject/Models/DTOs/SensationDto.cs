namespace TanProject.Models.DTOs
{
    public class SensationDto
    {
        public long Id { get; set; }
        public string Part { get; set; } = "";
        public string PartLabel { get; set; } = "";
        public string Sensation { get; set; } = "";
        public int Valence { get; set; }
        public int Arousal { get; set; }
    }
}
