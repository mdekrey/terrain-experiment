using Game.Application.Models;
using Game.Domain.Characters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Game.Application.Controllers
{
    [Authorize]
    public partial class MyApiController : IMyApiController
    {
        private readonly CharacterRepository repository;

        public MyApiController(CharacterRepository repository)
        {
            this.repository = repository;
        }

        public async Task<IActionResult> GetMyCharactersAsync()
        {
            await Task.Yield();
            var characters = repository.GetCharactersForPlayer(User.FindFirst(ClaimTypes.NameIdentifier).Value)
                .Select(c => c.ToApi(true))
                .ToList();
            return Ok(new PaginatedListOfCharacters
            {
                InitialOffset = 0,
                TotalCount = characters.Count,
                Items = characters,
            });
        }

        public async Task<IActionResult> GetMyCharacterAsync([FromRoute, Required] Guid? characterId)
        {
            await Task.Yield();
            return Ok(repository.GetCharacter(characterId.Value).ToApi(true));
        }

    }
}
