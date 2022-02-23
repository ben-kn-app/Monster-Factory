export interface Levels {
    levels: Level[];
}

export interface Level {
    assetsPrefix: string; // prefix to the path
    background: string; // path to background image asset
    clickableObjects: ClickableObject[];
}

export interface ClickableObject {
    path: string;
    name?: string; // Optional, internal UNIQUE reference to the clickable object, if this is unset, the path will be used.
    flipX?: boolean; // Default false, if true, the image will be flipped horizontally.
}

export interface AvailableClickableObject {
    clickableObject: ClickableObject;
    path: string; // Used in ui to show image
    go: Phaser.GameObjects.Image; // GameObject
}
