using Microsoft.EntityFrameworkCore;
using TanProject.Data;
using TanProject.Prompts;
using TanProject.Services.AI;
using TanProject.Services.AI.Ollama;

var builder = WebApplication.CreateBuilder(args);
var ollamaOptions = new OllamaOptions
{
    BaseUrl = builder.Configuration["Ollama:BaseUrl"],
    Model = builder.Configuration["Ollama:Model"],
    SystemPrompt = TanSystemPrompt.Chat
};
builder.Services.AddSingleton(ollamaOptions);

builder.Services.AddHttpClient<IChatAiService, OllamaChatService>((sp, client) =>
{
    var opts = sp.GetRequiredService<OllamaOptions>();
    client.BaseAddress = new Uri(opts.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(60);
});
builder.Services.AddScoped<ISessionSummaryAiService, SessionSummaryAiService>();
builder.Services.AddAntiforgery(options => options.HeaderName = "RequestVerificationToken");
// Add services to the container.
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.AddRazorPages();

var connectionString = builder.Configuration.GetConnectionString("TanDatabase");
builder.Services.AddDbContext<TanDbContext>(x => x.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
