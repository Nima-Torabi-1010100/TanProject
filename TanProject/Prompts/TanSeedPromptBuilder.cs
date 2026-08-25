using TanProject.Models.DTOs;

namespace TanProject.Prompts
{
    public class TanSeedPromptBuilder
    {
        public static string Build(StartConversationRequestDto request)
        {
            var name = string.IsNullOrWhiteSpace(request.UserName)
                ? "کاربر"
                : request.UserName;

            var age = string.IsNullOrWhiteSpace(request.UserAge)
                ? "نامشخص"
                : request.UserAge;

            var sensations = request.SensationsList is { Count: > 0 }
                ? string.Join("، ", request.SensationsList.Select(s =>
                    $"{s.PartLabel} - {s.Sensation} (والنس: {s.Valence}, برانگیختگی: {s.Arousal})"))
                : "ثبت نشده";

            return $"اطلاعات کاربر برای شروع گفتگو:\n" +
                   $"نام: {name}\n" +
                   $"سن: {age}\n" +
                   $"حس‌های ثبت‌شده: {sensations}\n\n" +
                   "بر اساس این اطلاعات، گفتگوی تن‌آگاه رو با یک سوال شروع کن. " +
                   "این اطلاعات رو مستقیم به کاربر تکرار نکن، فقط راهنمای سوالت باشه."+
                   "نیازی به سلام دادن نیست.";
        }
    }
}
