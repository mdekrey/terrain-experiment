using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Application.Account
{
    public static class JwtAuthExtensionos
    {
        public static AuthenticationBuilder AddJwtSignIn(this AuthenticationBuilder builder, Action<JwtBearerOptions> configureOptions)
        {
            builder.Services.AddSingleton<JwtService>()
                .Configure(configureOptions);
            return builder.AddScheme<JwtBearerOptions, JwtSignInHandler>(JwtBearerDefaults.AuthenticationScheme, "Jwt Auth", configureOptions);
        }
    }
}
