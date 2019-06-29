import React from "react";

import { GameContainer } from "./GameContainer";
import { ChildInjector, Scope } from '../injector';

export function GameEngine() {
    return (
        <ChildInjector beginScopes={[Scope.Component]}>
            <GameContainer />
        </ChildInjector>
    )
}
