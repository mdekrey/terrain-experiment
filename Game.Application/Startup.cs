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

namespace WoostiDatasetReview
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddJsonFile($"appsettings.local.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // dotnet 3.0 preview code
        //public Startup(IConfiguration configuration)
        //{
        //    Configuration = configuration;
        //}

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot";
            });

            var keySecret = Configuration["JwtSigningKey"];
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keySecret));

            services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters.ValidateIssuerSigningKey = true;
                    options.TokenValidationParameters.IssuerSigningKey = symmetricKey;

                    options.TokenValidationParameters.ValidateAudience = false;
                    options.TokenValidationParameters.ValidateIssuer = false;
                });
            services.AddAuthorization(options =>
            {
                var defaultAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder(
                    JwtBearerDefaults.AuthenticationScheme);
                defaultAuthorizationPolicyBuilder =
                    defaultAuthorizationPolicyBuilder.RequireAuthenticatedUser();
                options.DefaultPolicy = defaultAuthorizationPolicyBuilder.Build();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            // dotnet 3.0 preview code
            //app.UseRouting(routes =>
            //{
            //    routes.MapControllers();
            //});
            //app.UseAuthorization();

            app.UseSpaStaticFiles();

            Task.Run(() => JobSchedulerLoop(app.ApplicationServices));


            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "dataset-review-js";

                if (env.IsDevelopment())
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
