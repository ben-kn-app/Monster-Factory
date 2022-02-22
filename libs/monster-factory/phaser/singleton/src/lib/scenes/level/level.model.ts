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
}
