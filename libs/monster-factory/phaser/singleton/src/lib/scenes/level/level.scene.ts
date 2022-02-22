// import * as Phaser from 'phaser';

import { General } from '../../utilities/general';
import { AbstractScene } from '../abstract.scene';
import { Level } from './level.model';

export class LevelScene extends AbstractScene {
    private BACKGROUND_KEY: string = 'level_background';
    private BACKGROUND_IMAGE;

    private level: Level = {
        assetsPrefix: 'assets/level_monster_factory/',
        background: 'blacksmith_bg.png',
        clickableObjects: [{ path: 'monster1.png' }, { path: 'monster2.png' }, { path: 'monster1.png' }, { path: 'monster2.png', flipX: true }],
    };

    constructor() {
        // Config
        super('level');
    }

    async preload() {
        try {
            General.debugLog('level.scene.ts', 'Preloading Assets...');

            // * Now load the background image
            this.load.image(this.BACKGROUND_KEY, this.level.assetsPrefix + this.level.background);

            this.level.clickableObjects.forEach(clickableObject => {
                try {
                    this.load.image(clickableObject.name || clickableObject.path, this.level.assetsPrefix + clickableObject.path);
                } catch (error) {
                    console.error('Error loading image ' + clickableObject.path, error);
                }
            });
        } catch (e) {
            console.error('level.scene.ts', 'error preloading', e);
        }
    }

    getRandomInt(max, min = 0) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create() {
        General.debugLog('level.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height);

        // * Setup the Background Image
        this.BACKGROUND_IMAGE = this.add.image(0, 0, this.BACKGROUND_KEY);

        this.level.clickableObjects.forEach(clickableObject => {
            try {
                const { width, height } = this.sys.game.canvas;

                const randomWidth = this.getRandomInt(width);
                const randomHeight = this.getRandomInt(height);

                const image = this.add.image(randomWidth, randomHeight, clickableObject.name || clickableObject.path);

                image.setScale(3);

                if (clickableObject.flipX) {
                    image.toggleFlipX();
                }
            } catch (error) {
                console.error('Error adding image ' + clickableObject.path, error);
            }
        });

        // * Now handle scrolling
        this.cameras.main.setBackgroundColor('0xEBF0F3');

        // * Register our custom scroll manager
        // this.scrollManager = new ScrollManager(this);
        // this.scrollManager.registerScrollingBackground(this.backgroundImage);
        // * Set cameras to the correct position
        const ZOOM = 0.25;
        this.cameras.main.setZoom(ZOOM);
        //this.scrollManager.scrollToCenter();

        this.scale.on('resize', this.resize, this);
    }
}
