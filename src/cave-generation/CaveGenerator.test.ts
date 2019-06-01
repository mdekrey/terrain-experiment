import { CaveGenerator } from "./CaveGenerator";

it("generates some terrain", async () => {
    const cave = new CaveGenerator(0, 50, 50, 2);

    const map = await cave.map;
    const mapDisplay = map.map(row => row.map(e => e ? "█" : " ").join("")).join("\n");

    expect(mapDisplay).toMatchSnapshot();
});
