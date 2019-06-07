import React from "react";
import { SpriteAtlasContext, Sprite, SpriteCoordinates } from "./SpriteAtlas";

export type SpriteLookup<T extends string | number | symbol> = Record<
  T,
  Sprite
>;

export interface SpriteDefinition {
  image: string;
  coords: Partial<SpriteCoordinates>[];
  fallbackColor?: string;
}

export function useSpritelookup<TKey extends string | number | symbol>(
  definitions: Record<TKey, SpriteDefinition>
): SpriteLookup<TKey> {
  const spriteAtlas = React.useContext(SpriteAtlasContext);

  const [sprites, addSprite] = React.useReducer(
    (
      sprites: Partial<SpriteLookup<TKey>>,
      { key, sprite }: { key: TKey; sprite: Sprite }
    ) => {
      return { ...sprites, [key]: sprite };
    },
    {}
  );
  React.useMemo(() => {
    for (const key in definitions) {
      if (definitions.hasOwnProperty(key)) {
        const { image, coords, fallbackColor } = definitions[key];
        addSprite({
          key,
          sprite: {
            isFinal: false,
            frameCount: 1,
            render: (_, context, x, y, width, height) => {
              if (fallbackColor) {
                context.fillStyle = fallbackColor;
                context.fillRect(x, y, width, height);
              }
            }
          }
        });
        spriteAtlas.getSprite(image, coords).then(
          sprite => {
            addSprite({ key, sprite });
          },
          err => console.error(err)
        );
      }
    }
  }, [spriteAtlas, definitions]);

  return sprites;
}
