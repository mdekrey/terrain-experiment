namespace Game.Domain.Caves
{
    public readonly struct CaveCoordinate
    {
        public static readonly CaveCoordinate[] FourDirections = new[] {
            new CaveCoordinate(-1, 0),
            new CaveCoordinate(0, -1),
            new CaveCoordinate(0, 1),
            new CaveCoordinate(1, 0),
        };

        public static readonly CaveCoordinate[] EightDirections = new[] {
            new CaveCoordinate(-1, -1),
            new CaveCoordinate(-1, 0),
            new CaveCoordinate(-1, 1),
            new CaveCoordinate(0, -1),
            new CaveCoordinate(0, 1),
            new CaveCoordinate(1, -1),
            new CaveCoordinate(1, 0),
            new CaveCoordinate(1, 1),
        };

        public readonly int x;
        public readonly int y;

        public CaveCoordinate(int x, int y)
        {
            this.x = x;
            this.y = y;
        }

        public static CaveCoordinate operator +(CaveCoordinate lhs, CaveCoordinate rhs) => new CaveCoordinate(lhs.x + rhs.x, lhs.y + rhs.y);
        public static CaveCoordinate operator -(CaveCoordinate lhs, CaveCoordinate rhs) => new CaveCoordinate(lhs.x - rhs.x, lhs.y - rhs.y);
        public static CaveCoordinate operator -(CaveCoordinate target) => new CaveCoordinate(-target.x, -target.y);
        public static CaveCoordinate operator *(CaveCoordinate target, int scalar) => scalar * target;
        public static CaveCoordinate operator *(int scalar, CaveCoordinate target) => new CaveCoordinate(target.x * scalar, target.y * scalar);
        public static CaveCoordinate operator /(CaveCoordinate target, int scalar) => new CaveCoordinate(target.x / scalar, target.y / scalar);
        public static CaveCoordinate operator %(CaveCoordinate target, int scalar) => new CaveCoordinate(target.x % scalar, target.y % scalar);
    }
}