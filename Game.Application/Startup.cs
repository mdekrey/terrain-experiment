using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Game.Application.Account;
using Game.Application.Hubs;
using Game.Domain.Characters;

namespace WoostiDatasetReview
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc()
                .AddJsonOptions(options =>
                {
                    // TODO: preview 7
                    // options.JsonSerializerOptions.Converters
                });

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot";
            });

            services.AddAuthentication()
                .AddGoogle(options =>
                {
                    var googleAuthNSection = Configuration.GetSection("Authentication:Google");
                    options.ClientId = googleAuthNSection["ClientId"];
                    options.ClientSecret = googleAuthNSection["ClientSecret"];
                });

            var keySecret = Configuration["JwtSigningKey"];
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keySecret));

            services.AddSignalR();

            services.AddAuthentication(options =>
                {
                    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.Google.GoogleDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtSignIn(options =>
                {
                    options.TokenValidationParameters.ValidateIssuerSigningKey = true;
                    options.TokenValidationParameters.IssuerSigningKey = symmetricKey;

                    options.TokenValidationParameters.ValidateAudience = false;
                    options.TokenValidationParameters.ValidateIssuer = false;

                    // We have to hook the OnMessageReceived event in order to
                    // allow the JWT authentication handler to read the access
                    // token from the query string when a WebSocket or 
                    // Server-Sent Events request comes in.
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/hub")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                })
                .AddCookie();
            services.AddAuthorization(options =>
            {
                var builder = new AuthorizationPolicyBuilder(
                    JwtBearerDefaults.AuthenticationScheme);
                builder =
                    builder.RequireAuthenticatedUser();
                options.DefaultPolicy = builder.Build();
            });

            services.AddSingleton<CharacterRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.EnvironmentName == "Development")
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            //app.UseAuthorization();
            app.UseRouting().UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<CharacterHub>("/hub");
            });

            app.UseSpaStaticFiles();

            Task.Run(() => JobSchedulerLoop(app.ApplicationServices));


            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "dataset-review-js";

                if (env.EnvironmentName == "Development")
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });
        }

        private async Task JobSchedulerLoop(IServiceProvider services)
        {
            await Task.Yield();
            //try
            //{
            //    while (true)
            //    {
            //        using (var scope = services.CreateScope())
            //        {
            //            var jobScheduler = scope.ServiceProvider.GetRequiredService<IJobScheduler>();
            //            try
            //            {
            //                await jobScheduler.EnsureJobsAsync();
            //            }
            //            catch (Exception ex)
            //            {
            //                scope.ServiceProvider.GetRequiredService<ILogger<Startup>>()
            //                    .LogError(ex, "Exception while ensuring jobs");
            //            }
            //        }
            //        await Task.Delay(5000);
            //    }
            //}
            //catch (Exception ex)
            //{
            //    services.GetRequiredService<ILogger<Startup>>()
            //        .LogCritical(ex, "Could not start job scheduler loop");
            //}
        }
    }
}
