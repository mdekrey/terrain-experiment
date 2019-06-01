import { CaveGenerator } from "./CaveGenerator";

it("generates some terrain", async () => {
  const cave = new CaveGenerator(0, 50, 50, 2);

  const map = await cave.map;
  const treasure = await cave.treasure;
  const mapDisplay = map
    .map((row, y) =>
      row
        .map((e, x) =>
          treasure.find(entry =>
            entry.x === x && entry.y === y) ? "*"
            : e ? "█"
            : " "
        )
        .join("")
    )
    .join("\n");

  expect(mapDisplay).toMatchSnapshot();
});
