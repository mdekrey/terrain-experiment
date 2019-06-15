namespace Game.Domain
{
    public readonly struct GameCoordinate
    {
        public float X { get; }
        public float Y { get; }

        public GameCoordinate(float x, float y)
        {
            this.X = x;
            this.Y = y;
        }

        public static GameCoordinate operator +(GameCoordinate lhs, GameCoordinate rhs) => new GameCoordinate(lhs.X + rhs.X, lhs.Y + rhs.Y);
        public static GameCoordinate operator -(GameCoordinate lhs, GameCoordinate rhs) => new GameCoordinate(lhs.X - rhs.X, lhs.Y - rhs.Y);
        public static GameCoordinate operator -(GameCoordinate target) => new GameCoordinate(-target.X, -target.Y);
        public static GameCoordinate operator *(GameCoordinate target, float scalar) => scalar * target;
        public static GameCoordinate operator *(float scalar, GameCoordinate target) => new GameCoordinate(target.X * scalar, target.Y * scalar);
        public static GameCoordinate operator /(GameCoordinate target, float scalar) => new GameCoordinate(target.X / scalar, target.Y / scalar);
        public static GameCoordinate operator %(GameCoordinate target, float scalar) => new GameCoordinate(target.X % scalar, target.Y % scalar);
    }
}