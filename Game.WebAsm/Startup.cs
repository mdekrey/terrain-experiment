using Microsoft.AspNetCore.Components.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;

namespace Game.WebAsm
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IComponentsApplicationBuilder app)
        {
            //app.AddComponent<App>("app");
            app.Services.GetRequiredService<IJSRuntime>().InvokeAsync<object>("startReact");
        }
    }
}
