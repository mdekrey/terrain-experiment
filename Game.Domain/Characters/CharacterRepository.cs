using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Game.Domain.Characters
{
    public class CharacterRepository
    {
        private static readonly Guid hero = Guid.NewGuid();
        private static readonly Guid femaleSoldier = Guid.NewGuid();
        private static readonly Guid femaleMerchant = Guid.NewGuid();
        private static readonly GameCoordinate initialPortal = new GameCoordinate(0.03, 0.07);
        private readonly Dictionary<Guid, Character> characters = new Dictionary<Guid, Character>
        {
            { hero,               new Character { Id = hero,            PawnType = PawnType.Hero, Coordinate = initialPortal } },
            { femaleSoldier,      new Character { Id = femaleSoldier,   PawnType = PawnType.FemaleSoldier, Coordinate = initialPortal } },
            { femaleMerchant,     new Character { Id = femaleMerchant,  PawnType = PawnType.FemaleMerchant, Coordinate = initialPortal } },
        };

        public IEnumerable<Character> GetCharactersForPlayer(string userId)
        {
            return characters.Values;
        }

        public Character GetCharacter(Guid characterId)
        {
            return characters[characterId];
        }

        public void SetPosition(Guid characterId, GameCoordinate gameCoordinate, Direction facing)
        {
            var character = characters[characterId];
            character.Coordinate = gameCoordinate;
            character.Facing = facing;
        }
    }
}
