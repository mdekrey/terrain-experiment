import React from "react";

export interface Sprite {
    toDrawImageParams(): [CanvasImageSource, number, number, number, number]
}

export interface SpriteCoordinates { x : number, y : number, width : number, height : number }

class SpriteAtlas {
    private atlas = new Map<string, Promise<HTMLImageElement>>();

    async getSprite(image: string, { x = 0, y = 0, width = 16, height = 16 }: Partial<SpriteCoordinates>): Promise<Sprite> {
        const img = this.atlas.get(image) ||
            (function () {
                const temp = new Image();
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    temp.onload = () => resolve(temp);
                    temp.onerror = (err) => reject(err);
                    temp.src = image;
                })
            })();
        const imageSource = await img;
        return {
            toDrawImageParams: () => [imageSource, x, y, width, height]
        };
    }
}

export const SpriteAtlasContext = React.createContext<SpriteAtlas>(new SpriteAtlas());
