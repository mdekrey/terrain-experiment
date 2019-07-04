using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;

namespace Game.Application.Account
{
    internal class JwtSignInHandler : JwtBearerHandler, IAuthenticationSignInHandler
    {
        private const string HeaderValueNoCache = "no-cache";
        private const string HeaderValueEpocDate = "Thu, 01 Jan 1970 00:00:00 GMT";
        private readonly JwtService jwtService;

        public JwtSignInHandler(IOptionsMonitor<JwtBearerOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock, JwtService jwtService) : base(options, logger, encoder, clock)
        {
            this.jwtService = jwtService;
        }

        public async Task SignInAsync(ClaimsPrincipal user, AuthenticationProperties properties)
        {
            Context.User = user;
            ApplyHeaders(user);
            await Task.Yield();
        }

        public async Task SignOutAsync(AuthenticationProperties properties)
        {
            await Task.Yield();
        }

        private void ApplyHeaders(ClaimsPrincipal user = null)
        {
            Response.Headers[HeaderNames.CacheControl] = HeaderValueNoCache;
            Response.Headers[HeaderNames.Pragma] = HeaderValueNoCache;
            Response.Headers[HeaderNames.Expires] = HeaderValueEpocDate;
            var jwt = jwtService.GetJwtFor(user);

            Context.Response.OnStarting(async () =>
            {
                Context.Response.Redirect($"/#{jwt}");
                await Task.Yield();
            });
        }
    }
}