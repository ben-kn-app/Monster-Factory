import * as Phaser from 'phaser';

import { General } from '../utilities/general';

export abstract class AbstractScene extends Phaser.Scene {
    constructor(key: string) {
        // Config
        super({ key });
    }

    abstract preload();
    abstract create();

    /**
     * * When the screen is resized, we
     *
     * @param gameSize
     */
    resize(gameSize: Phaser.Structs.Size) {
        General.debugLog('Resizing', gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}
