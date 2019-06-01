import React from "react";

export interface Sprite {
    frameCount: number;
    render(frameIndex: number, context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
}

export interface SpriteCoordinates { x : number, y : number, width : number, height : number }

const defaultCoordinates: SpriteCoordinates = { x: 0, y: 0, width: 16, height: 16 };

class SpriteAtlas {
    private atlas = new Map<string, Promise<HTMLImageElement>>();

    async getSprite(image: string, coords: Partial<SpriteCoordinates>[]): Promise<Sprite> {
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
            frameCount: coords.length,
            render: (index, context, targetX, targetY, targetWidth, targetHeight) => {
                const { x = defaultCoordinates.x, y = defaultCoordinates.y, width = defaultCoordinates.width, height = defaultCoordinates.height, } = coords[index];
                context.drawImage(imageSource, x, y, width, height, targetX, targetY, targetWidth, targetHeight);
            }
        };
    }
}

export const SpriteAtlasContext = React.createContext<SpriteAtlas>(new SpriteAtlas());
