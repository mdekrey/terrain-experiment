using Game.Application.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Game.Application.Hubs
{
    [Authorize]
    public class CharacterHub : Hub
    {
        private readonly JwtService jwtService;

        public CharacterHub(JwtService jwtService)
        {
            this.jwtService = jwtService;
        }

        public ChannelReader<string> Jwt(CancellationToken cancellation)
        {
            var observable = Observable.Interval(TimeSpan.FromSeconds(10)).Select(_ => jwtService.GetJwtFor(Context.User));

            var allCancellation = CancellationTokenSource.CreateLinkedTokenSource(cancellation, Context.ConnectionAborted);
            return observable.AsChannelReader(allCancellation.Token);
        }
    }
}
