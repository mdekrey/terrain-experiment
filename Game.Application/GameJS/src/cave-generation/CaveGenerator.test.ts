import { CaveGenerator } from "./CaveGenerator";
import { coordinatesEqual } from "../game/GameCoordinates";

snapshotCave(0);
snapshotCave(38361);
snapshotCave(66335);

function snapshotCave(seed: number) {
  it(`generates a cave at seed ${seed}`, async () => {
    await makeCave(seed);
  });
}

async function makeCave(seed: number) {
  const caveGenerator = new CaveGenerator(seed, 50, 50, 2, { x: 0, y: 0 });
  const cave = await caveGenerator.cave;
  const map = cave.isSolid;
  const treasure = cave.treasure;
  const entrance = cave.entrance;
  const mapDisplay = map
    .map((row, y) => row
      .map((e, x) => coordinatesEqual({ x, y }, entrance) ? "/"
        : treasure.find(entry => coordinatesEqual({ x, y }, entry)) ? "*"
          : e ? "█"
            : " ")
      .join(""))
    .join("\n");
  expect(mapDisplay).toMatchSnapshot();
}
