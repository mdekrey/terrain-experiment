using Game.Domain.Terrain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Game.Logic
{
    public class TerrainSettingsShould
    {
        [Fact]
        public void DetectIfOnGrid()
        {
            Assert.True(TerrainSettings.IsOnGrid(0, 0));
            Assert.False(TerrainSettings.IsOnGrid(TerrainSettings.localGridSize, 0));
            Assert.True(TerrainSettings.IsOnGrid(TerrainSettings.overworldGridSize, 0));
            Assert.True(TerrainSettings.IsOnGrid(TerrainSettings.overworldGridSize * 600, TerrainSettings.overworldGridSize * 300));
            Assert.False(TerrainSettings.IsOnGrid(TerrainSettings.overworldGridSize * 600 + TerrainSettings.localGridSize, TerrainSettings.overworldGridSize * 300));
            Assert.False(TerrainSettings.IsOnGrid(TerrainSettings.overworldGridSize * 600 - TerrainSettings.localGridSize, TerrainSettings.overworldGridSize * 300));

            Assert.True(TerrainSettings.IsOnGrid(TerrainSettings.overworldGridSize * 600, -TerrainSettings.overworldGridSize * 300));
            Assert.False(TerrainSettings.IsOnGrid(TerrainSettings.overworldGridSize * 600 + TerrainSettings.localGridSize, -TerrainSettings.overworldGridSize * 300));
            Assert.False(TerrainSettings.IsOnGrid(TerrainSettings.overworldGridSize * 600 - TerrainSettings.localGridSize, -TerrainSettings.overworldGridSize * 300));

            Assert.False(TerrainSettings.IsOnGrid(-TerrainSettings.localGridSize, 0));
            Assert.True(TerrainSettings.IsOnGrid(-TerrainSettings.overworldGridSize, 0));
            Assert.True(TerrainSettings.IsOnGrid(-TerrainSettings.overworldGridSize * 600, TerrainSettings.overworldGridSize * 300));
            Assert.False(TerrainSettings.IsOnGrid(-TerrainSettings.overworldGridSize * 600 + TerrainSettings.localGridSize, TerrainSettings.overworldGridSize * 300));
            Assert.False(TerrainSettings.IsOnGrid(-TerrainSettings.overworldGridSize * 600 - TerrainSettings.localGridSize, TerrainSettings.overworldGridSize * 300));

            Assert.True(TerrainSettings.IsOnGrid(-TerrainSettings.overworldGridSize * 600, -TerrainSettings.overworldGridSize * 300));
            Assert.False(TerrainSettings.IsOnGrid(-TerrainSettings.overworldGridSize * 600 - TerrainSettings.localGridSize, -TerrainSettings.overworldGridSize * 300));
        }
    }
}
