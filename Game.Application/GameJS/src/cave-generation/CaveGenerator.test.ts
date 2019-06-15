import { CaveGenerator } from "./CaveGenerator";
import { coordinatesEqual } from "../game/GameCoordinates";

it.skip("generates some terrain", async () => {
  const caveGenerator = new CaveGenerator(0, 50, 50, 2, {x: 0, y: 0});

  const cave = await caveGenerator.cave;
  const map = cave.isSolid;
  const treasure = cave.treasure;
  const entrance = cave.entrance;
  const mapDisplay = map
    .map((row, y) =>
      row
        .map((e, x) =>
            coordinatesEqual({ x, y }, entrance) ? "/"
                : treasure.find(entry => coordinatesEqual({x, y}, entry)) ? "*"
                : e ? "█"
                : " "
        )
        .join("")
    )
    .join("\n");

  expect(mapDisplay).toMatchSnapshot();
});
