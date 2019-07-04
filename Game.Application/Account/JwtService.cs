using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Game.Application.Account
{
    public class JwtService
    {
        private readonly IOptionsMonitor<JwtBearerOptions> options;
        private readonly ILogger<JwtService> logger;

        public JwtService(IOptionsMonitor<JwtBearerOptions> options, ILoggerFactory logger)
        {
            this.options = options;
            this.logger = logger.CreateLogger<JwtService>();
        }

        private JwtBearerOptions Options => options.CurrentValue;

        public ClaimsPrincipal CheckToken(string token)
        {
            var validationParameters = Options.TokenValidationParameters.Clone();
            SecurityToken validatedToken;
            foreach (var validator in Options.SecurityTokenValidators)
            {
                if (validator.CanReadToken(token))
                {
                    try
                    {
                        return validator.ValidateToken(token, validationParameters, out validatedToken);
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }
            return null;
        }

        public string GetJwtFor(ClaimsPrincipal user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(new SecurityTokenDescriptor
            {
                Subject = user.Identities.First(),
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = new SigningCredentials(Options.TokenValidationParameters.IssuerSigningKey, SecurityAlgorithms.HmacSha256Signature),
                Audience = Options.TokenValidationParameters.ValidAudience,
                Issuer = Options.TokenValidationParameters.ValidIssuer,
                IssuedAt = DateTime.UtcNow,
            });
            return tokenHandler.WriteToken(token);
        }
    }
}
