namespace Game.Domain
{
    public readonly struct GameCoordinate
    {
        public readonly float x;
        public readonly float y;

        public GameCoordinate(float x, float y)
        {
            this.x = x;
            this.y = y;
        }

        public static GameCoordinate operator +(GameCoordinate lhs, GameCoordinate rhs) => new GameCoordinate(lhs.x + rhs.x, lhs.y + rhs.y);
        public static GameCoordinate operator -(GameCoordinate lhs, GameCoordinate rhs) => new GameCoordinate(lhs.x - rhs.x, lhs.y - rhs.y);
        public static GameCoordinate operator -(GameCoordinate target) => new GameCoordinate(-target.x, -target.y);
        public static GameCoordinate operator *(GameCoordinate target, float scalar) => scalar * target;
        public static GameCoordinate operator *(float scalar, GameCoordinate target) => new GameCoordinate(target.x * scalar, target.y * scalar);
        public static GameCoordinate operator /(GameCoordinate target, float scalar) => new GameCoordinate(target.x / scalar, target.y / scalar);
        public static GameCoordinate operator %(GameCoordinate target, float scalar) => new GameCoordinate(target.x % scalar, target.y % scalar);
    }
}