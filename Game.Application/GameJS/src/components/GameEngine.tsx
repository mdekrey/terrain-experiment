import React from "react";
import { ajax, AjaxResponse } from "rxjs/ajax"

import { GameContainer } from "./GameContainer";
import { ChildInjector, Scope } from '../injector';
import { terrainSettingsFromDto, TerrainSettings, TerrainSettingsDto } from '../terrain-generation/TerrainSettings';

export function GameEngine() {
    const terrainSettings = useTerrainSettings();
    if (!terrainSettings) {
        return <>Loading</>
    }
    if (terrainSettings instanceof Error) {
        return <>{terrainSettings.toString()}</>;
    }
    return (
        <ChildInjector beginScopes={[Scope.Component]} overrideServices={{ terrainSettings }}>
            <GameContainer />
        </ChildInjector>
    )
}

function useTerrainSettings() {
    const [terrainSettings, setTerrainSettings] = React.useState<null | TerrainSettings | Error>(null);
    React.useEffect(() => {
        const subscription = ajax.getJSON<TerrainSettingsDto>(`/api/settings/terrain`)
                                 .subscribe({ next: processResponse, error: processResponse });
        function processResponse(response: TerrainSettingsDto | null) {
            try {
                setTerrainSettings(terrainSettingsFromDto(response!));
            } catch (ex) {
                if (process.env.NODE_ENV === "development") {
                    setTerrainSettings(terrainSettingsFromDto(require("../terrainSettingsDto.local.json") as TerrainSettingsDto));
                } else {
                    setTerrainSettings(ex);
                }
            }
        }
        return () => subscription.unsubscribe();
    }, [setTerrainSettings]);
    return terrainSettings;
}
