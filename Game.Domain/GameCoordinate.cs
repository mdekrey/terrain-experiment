namespace Game.Domain
{
    public readonly struct GameCoordinate
    {
        public readonly double x;
        public readonly double y;

        public GameCoordinate(double x, double y)
        {
            this.x = x;
            this.y = y;
        }

        public static GameCoordinate operator +(GameCoordinate lhs, GameCoordinate rhs) => new GameCoordinate(lhs.x + rhs.x, lhs.y + rhs.y);
        public static GameCoordinate operator -(GameCoordinate lhs, GameCoordinate rhs) => new GameCoordinate(lhs.x - rhs.x, lhs.y - rhs.y);
        public static GameCoordinate operator -(GameCoordinate target) => new GameCoordinate(-target.x, -target.y);
        public static GameCoordinate operator *(GameCoordinate target, double scalar) => scalar * target;
        public static GameCoordinate operator *(double scalar, GameCoordinate target) => new GameCoordinate(target.x * scalar, target.y * scalar);
        public static GameCoordinate operator /(GameCoordinate target, double scalar) => new GameCoordinate(target.x / scalar, target.y / scalar);
        public static GameCoordinate operator %(GameCoordinate target, double scalar) => new GameCoordinate(target.x % scalar, target.y % scalar);
    }
}