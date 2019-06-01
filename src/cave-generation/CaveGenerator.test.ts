import { CaveGenerator } from "./CaveGenerator";
import { coordinatesEqual } from "../game/GameCoordinates";

it("generates some terrain", async () => {
  const cave = new CaveGenerator(0, 50, 50, 2);

  const map = await cave.map;
  const treasure = await cave.treasure;
  const entrance = await cave.entrance;
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
