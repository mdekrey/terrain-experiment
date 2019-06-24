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
        class TerrainValues
        {
            public float altitude { get; set; }
            public float heat { get; set; }
            public float humidity { get; set; }
            public float feature { get; set; }
            public float caveIndicator { get; set; }
        }

        private static readonly string TerrainSnapshot = "[[{\"altitude\":0.50573568172917,\"heat\":0.5781803300735093,\"humidity\":0.47441132008803133,\"feature\":1,\"caveIndicator\":1741141072},{\"altitude\":0.7441342610041861,\"heat\":0.43499787097289566,\"humidity\":0.34061352369839415,\"feature\":1,\"caveIndicator\":344681984},{\"altitude\":0.7548685098274789,\"heat\":0.4471665040173972,\"humidity\":0.35876919659332235,\"feature\":1,\"caveIndicator\":946355392}],[{\"altitude\":0.5971997405852287,\"heat\":0.5140591806256702,\"humidity\":0.4086814260293044,\"feature\":1,\"caveIndicator\":1116926384},{\"altitude\":0.763777091777715,\"heat\":0.5401414928503099,\"humidity\":0.3480521095437313,\"feature\":1,\"caveIndicator\":197114192},{\"altitude\":0.7684713085327803,\"heat\":0.47649505252258123,\"humidity\":0.22835549873345326,\"feature\":1,\"caveIndicator\":275846992}],[{\"altitude\":0.4829401480856731,\"heat\":0.5596004014212869,\"humidity\":0.3851184700722593,\"feature\":0.9077816202726714,\"caveIndicator\":1553905792},{\"altitude\":0.6531368773722629,\"heat\":0.5015699985853355,\"humidity\":0.2588383084445926,\"feature\":0.9728803956655292,\"caveIndicator\":578005312},{\"altitude\":0.779964935345529,\"heat\":0.4973351868593006,\"humidity\":0.23034340763029934,\"feature\":0.9415393716399494,\"caveIndicator\":690160480}]]";

        [Fact]
        public void BeGenerated()
        {
            var settings = new TerrainSettingsGenerator().Generate();

            const float step = 0.1f;
            const int microsteps = 3;

            var steps = Enumerable.Range(0, microsteps).Select(i => (i - microsteps / 2f) / microsteps * step);
            var result = steps.Select(y =>
                steps.Select(x =>
                {
                    var altitude = settings.Altitude.GetValue(x, y, 0);
                    var heat = settings.Heat.GetValue(x, y, 0) - settings.CalculateTemperaturePenalty(altitude);
                    return new TerrainValues
                    {
                        altitude = altitude,
                        heat = heat,
                        humidity = settings.CalculateHumidity(settings.Humidity.GetValue(x, y, 0), heat),
                        feature = settings.Feature.GetValue(x, y, 0),
                        caveIndicator = settings.CaveIndicator.GetValue(x, y, 0)
                    };
                }).ToArray()).ToArray();
            var fromJson = System.Text.Json.Serialization.JsonSerializer.Parse<TerrainValues[][]>(TerrainSnapshot);

            for (var x = 0; x < microsteps; x++)
            {
                for (var y = 0; y < microsteps; y++)
                {
                    Assert.Equal(fromJson[y][x].altitude, result[y][x].altitude, 3);
                    Assert.Equal(fromJson[y][x].heat, result[y][x].heat, 3);
                    Assert.Equal(fromJson[y][x].humidity, result[y][x].humidity, 3);
                    Assert.Equal(fromJson[y][x].feature, result[y][x].feature, 3);
                    Assert.Equal(fromJson[y][x].caveIndicator, result[y][x].caveIndicator);
                }
            }
        }
    }
}
