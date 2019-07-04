import * as React from "react";
// import { Link } from "react-router-dom";
import { useService } from "../injector";
import { useObservable } from "../rxjs";
import { Canvas } from "./canvas";
import { Avatar } from "./Avatar";
import { Pawn } from "../game";
import { Character, PawnType } from "../api";
import { Viewport } from "./Viewport";
import { Link } from "react-router-dom";

const displayPosition = () => ({ x: 0, y: 0 });
const size = 128;

export const DrawCharacter = ({ character }: { character: Character }) => {
    const pawn = React.useMemo(() => {
        const result = new Pawn();
        result.type = character.pawnType as PawnType;
        return result;
    }, [character]);

    return <Canvas width={size} height={size} clear="transparent">
        <Viewport width={size * 2} height={size * 2} x={-size} y={-size} center={displayPosition} pixelSize={size}>
            <Avatar pawn={pawn} zoomFactor={0}
                frameDelay={250} />
        </Viewport>
    </Canvas>
}

export const CharacterSelection = () => {
    const my = useService("myService");
    const characters = useObservable(React.useMemo(() => my.getMyCharacters(), [my]), undefined);

    if (!characters) {
        return <>Loading</>;
    }

    return <>
        {characters.data.items.map(character =>
            <Link key={character.id} to={"/play/" + character.id} style={{ backgroundColor: "limegreen", display: "inline-block" }}>
                <DrawCharacter character={character} />
            </Link>)}
    </>;
};
