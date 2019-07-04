import React from "react";

import { GameContainer } from "./GameContainer";
import { ChildInjector, Scope, useService } from '../injector';
import { withRouter, RouteComponentProps } from "react-router";
import { useObservable } from "../rxjs";
import { Pawn, Direction } from "../game";
import { localZoom } from "../terrain-generation";
import { PawnType } from "../api";

export const GameEngine = withRouter(function GameEngine({ match }: RouteComponentProps<{ characterId: string }>) {
    const { characterId } = match.params;
    const myService = useService("myService");
    const hub = useService("hubClient");
    const characterApi = React.useMemo(() => myService.getMyCharacter(characterId), [characterId, myService]);
    const character = useObservable(characterApi, undefined);
    const pawn = React.useMemo(() => {
        if (!character) return null;
        const result = new Pawn();
        result.moveTo({ x: character.data.coordinate.x / localZoom, y: character.data.coordinate.y / localZoom }, Direction.Down);
        result.type = character.data.pawnType as PawnType;
        return result;
    }, [character]);
    React.useEffect(() => {
        if (character) {
            hub.setCharacter(character.data.id);
        }
    }, [character, hub]);

    if (!pawn) {
        return null;
    }

    return (
        <ChildInjector beginScopes={[Scope.Component]} overrideServices={{ player: pawn }}>
            <GameContainer />
        </ChildInjector>
    )
});
