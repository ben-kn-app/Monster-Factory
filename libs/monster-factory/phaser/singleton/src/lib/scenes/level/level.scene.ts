// import * as Phaser from 'phaser';

import { AbstractScene } from '../abstract.scene';
import { Level } from './level.model';

export class LevelScene extends AbstractScene {
    private BACKGROUND_KEY: string = 'level_background';
    private BACKGROUND_IMAGE;

    private level: Level = {
        assetsPrefix: 'assets/level_monster_factory/',
        background: 'blacksmith_bg.png',
        clickableObjects: [{ path: 'monster1.png' }, { path: 'monster2.png' }],
    };

    constructor() {
        // Config
        super('level');
    }

    async preload() {
        try {
            console.log('level.scene.ts', 'Preloading Assets...');

            // * Now load the background image
            this.load.image(this.BACKGROUND_KEY, this.level.assetsPrefix + this.level.background);
        } catch (e) {
            console.error('level.scene.ts', 'error preloading', e);
        }
    }

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create() {
        console.log('level.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height);

        // * Setup the Background Image
        this.BACKGROUND_IMAGE = this.add.image(0, 0, this.BACKGROUND_KEY);

        // * Now handle scrolling
        this.cameras.main.setBackgroundColor('0xEBF0F3');

        // * Register our custom scroll manager
        // this.scrollManager = new ScrollManager(this);
        // this.scrollManager.registerScrollingBackground(this.backgroundImage);
        // * Set cameras to the correct position
        const ZOOM = 0.25;
        this.cameras.main.setZoom(ZOOM);
        // this.scrollManager.scrollToCenter();

        this.scale.on('resize', this.resize, this);
    }
}
