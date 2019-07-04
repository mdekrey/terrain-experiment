using Game.Application.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Game.Application.Hubs
{
    public class CharacterHub : Hub
    {
        private readonly JwtService jwtService;

        public CharacterHub(JwtService jwtService)
        {
            this.jwtService = jwtService;
        }

        public string ContextJwt
        {
            get => Context.Items["Jwt"] as string;
            set { Context.Items["Jwt"] = value; }
        }

        public ClaimsPrincipal ContextUser
        {
            get => Context.Items["User"] as ClaimsPrincipal;
            set { Context.Items["User"] = value; }
        }

        public Guid? ContextCharacterId
        {
            get => Context.Items["CharacterId"] as Guid?;
            set { Context.Items["CharacterId"] = value; }
        }

        public ChannelReader<string> Jwt(string jwt, CancellationToken cancellation)
        {
            ContextJwt = jwt;
            ContextUser = jwtService.CheckToken(jwt);
            var observable = Observable
                .Interval(TimeSpan.FromSeconds(10))
                .Select(_ => ContextJwt = jwtService.GetJwtFor(ContextUser));

            var allCancellation = CancellationTokenSource.CreateLinkedTokenSource(cancellation, Context.ConnectionAborted);
            return observable.AsChannelReader(allCancellation.Token);
        }

        public void SetCharacterId(Guid characterId)
        {
            ContextCharacterId = characterId;
        }

        public void SetPosition(Game.Application.Models.IntCoordinate coordinate)
        {

        }
    }
}
