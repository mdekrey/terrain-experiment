import React from "react";
import { ajax } from "rxjs/ajax"

import { GameContainer } from "./GameContainer";
import { ChildInjector, Scope } from '../injector';
import { terrainSettingsFromDto, TerrainSettings, TerrainSettingsDto } from '../terrain-generation/TerrainSettings';

export function GameEngine() {
    const [terrainSettings, setTerrainSettings] = React.useState<null | TerrainSettings>(null);
    React.useEffect(loadSettings(setTerrainSettings), [setTerrainSettings]);
    if (!terrainSettings) {
        return <>Loading</>
    }
    return (
        <ChildInjector beginScopes={[ Scope.Component ]} overrideServices={{ terrainSettings }}>
          <GameContainer />
        </ChildInjector>
    )
}

function loadSettings(setTerrainSettings: (settings: TerrainSettings) => void) {
    return () => {
        let promise = ajax.getJSON<TerrainSettingsDto>(`/api/settings/terrain`).toPromise();
        if (process.env.NODE_ENV === "development") {
            promise = promise.then(v => v || require("../terrainSettingsDto.local.json"));
        }
        promise.then(terrainSettingsFromDto).then(setTerrainSettings)
    };
}
