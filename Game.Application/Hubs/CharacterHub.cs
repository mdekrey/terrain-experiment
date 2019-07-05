using Game.Application.Account;
using Game.Application.Models;
using Game.Domain.Characters;
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
        private readonly CharacterRepository repository;

        public CharacterHub(JwtService jwtService, CharacterRepository repository)
        {
            this.jwtService = jwtService;
            this.repository = repository;
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
            // TODO - authorize
            ContextCharacterId = characterId;
        }

        public void SetPosition(IntCoordinate coordinate, string direction)
        {
            repository.SetPosition(ContextCharacterId.Value, coordinate.FromApi(true), Enum.Parse<Direction>(direction).FromApi());
        }

        public ChannelReader<Application.Models.Character> GetMovement(CancellationToken cancellation)
        {
            var observable = repository.MovementUpdates()
                .Where(c => c.Id != ContextCharacterId)
                .Select(c => c.ToApi(true));


            var allCancellation = CancellationTokenSource.CreateLinkedTokenSource(cancellation, Context.ConnectionAborted);
            return observable.AsChannelReader(allCancellation.Token);
        }
    }
}
