import React from "react";
import { SpriteAtlasContext, Sprite, SpriteCoordinates } from "./SpriteAtlas";

export type SpriteLookup<T extends string | number | symbol> = Record<T, Sprite>;

export interface SpriteDefinition<T extends string | number | symbol> {
    image: string
    coords: Partial<SpriteCoordinates>
    key: T
}

export function useSpritelookup<TKey extends string | number | symbol>(definitions: SpriteDefinition<TKey>[]): Partial<SpriteLookup<TKey>> {
    const spriteAtlas = React.useContext(SpriteAtlasContext);

    const [ sprites, addSprite ] = React.useReducer((sprites: Partial<SpriteLookup<TKey>>, { key, sprite }: { key: TKey, sprite: Sprite }) => {
        return { ...sprites, [key]: sprite };
    }, {});
    React.useMemo(() => {
        for (const {key,image,coords} of definitions) {
            spriteAtlas.getSprite(image, coords).then(sprite => {
                addSprite({ key, sprite });
                console.log("loaded ", key, sprite)
            }, err => console.error(err));
        }
    }, [spriteAtlas, definitions]);

    return sprites;
}