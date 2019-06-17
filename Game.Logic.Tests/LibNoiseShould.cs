using LibNoise.Generator;
using System;
using System.Linq;
using Xunit;

namespace Game.Logic
{
    public class LibNoiseShould
    {
        [Fact]
        public void MatchJavaScript()
        {
            var perlin = new Perlin();


            const float step = 0.1f;
            const int microsteps = 30;

            var result = Enumerable.Range(0, microsteps).Select(v => (v - microsteps / 2f) * step / microsteps).Select(v => perlin.GetValue(v, 0, 0)).ToArray();

            var expected = new[]
            {
              0.15051893273369998f,
              0.1358378323433078f,
              0.12111284006069127f,
              0.10714938081818756f,
              0.09482144367274355f,
              0.08507158180591605f,
              0.07849762872395467f,
              0.07164112578630137f,
              0.06378286587358317f,
              0.0552470114311219f,
              0.0462945860424161f,
              0.03712347442914019f,
              0.02786842245114511f,
              0.018601037106458284f,
              0.009329786531283205f,
              0f,
              -0.008952971355287062f,
              -0.017756530973588543f,
              -0.027280669802972012f,
              -0.03809382441738114f,
              -0.05046287701663581f,
              -0.06435315542643202f,
              -0.07942843309834188f,
              -0.09505092910981376f,
              -0.110281308164172f,
              -0.12398248438839508f,
              -0.13610736529508502f,
              -0.14737914491638404f,
              -0.1583748269310998f,
              -0.16950533281833757f,
            };

            var diffs = expected.Zip(result, (a, b) => a - b).ToArray();
            Assert.DoesNotContain(diffs, v => v > 1e-7f);
        }
    }
}
