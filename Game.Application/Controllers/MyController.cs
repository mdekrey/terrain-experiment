using Game.Application.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Application.Controllers
{
    public partial class MyApiController : IMyApiController
    {
        private static readonly Guid hero = Guid.NewGuid();
        private static readonly Guid femaleSoldier = Guid.NewGuid();
        private static readonly Guid femaleMerchant = Guid.NewGuid();
        private static readonly IntCoordinate initialPortal = new IntCoordinate { X = 3, Y = 7 };
        private readonly Dictionary<Guid, Character> characters = new Dictionary<Guid, Character>
        {
            { hero,               new Character { Id = hero,            PawnType = PawnType.Hero.ToString("g"), Coordinate = initialPortal } },
            { femaleSoldier,      new Character { Id = femaleSoldier,   PawnType = PawnType.FemaleSoldier.ToString("g"), Coordinate = initialPortal } },
            { femaleMerchant,     new Character { Id = femaleMerchant,  PawnType = PawnType.FemaleMerchant.ToString("g"), Coordinate = initialPortal } },
        };

        public async Task<IActionResult> GetMyCharactersAsync()
        {
            await Task.Yield();
            return Ok(new PaginatedListOfCharacters
            {
                InitialOffset = 0,
                TotalCount = 3,
                Items = characters.Values.ToList()
            });
        }

        public async Task<IActionResult> GetMyCharacterAsync([FromRoute, Required] Guid? characterId)
        {
            await Task.Yield();
            return Ok(characters[characterId.Value]);
        }

    }
}
