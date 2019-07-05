using System;
using System.Collections.Generic;
using System.Text;

namespace Game.Domain.Characters
{
    public class Character
    {
        public Guid Id { get; set; }
        public PawnType PawnType { get; set; }
        public GameCoordinate Coordinate { get; set; }
        public Direction Facing { get; set; }

    }
}
