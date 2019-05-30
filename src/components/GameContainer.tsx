import React from "react";
import { TerrainGenerator } from "../terrain-generation/TerrainGenerator";
import { Canvas } from "./canvas";
import { TerrainGrid } from "./terrain";
export function GameContainer() {
    const [{ centerX, centerY }, setCenter] = React.useState({ centerX: 0, centerY: 0 });
    const terrainGenerator = React.useMemo(() => new TerrainGenerator(), []);
    const width = 1216;
    const height = 800;
    const pixelSize = 16;
    const zoom = 20000;
    const moveAmount = 1;
    return (<>
        <button onClick={() => setCenter({ centerX: centerX - moveAmount, centerY })}>Left</button>
        <button onClick={() => setCenter({ centerX, centerY: centerY + moveAmount })}>Down</button>
        <button onClick={() => setCenter({ centerX, centerY: centerY - moveAmount })}>Up</button>
        <button onClick={() => setCenter({ centerX: centerX + moveAmount, centerY })}>Right</button>
        <Canvas width={width} height={height}>
            <TerrainGrid rows={height / pixelSize} columns={width / pixelSize} terrain={terrainGenerator} gridSize={1 / zoom * pixelSize} pixelSize={pixelSize} centerX={centerX} centerY={centerY} />
        </Canvas>
    </>);
}
