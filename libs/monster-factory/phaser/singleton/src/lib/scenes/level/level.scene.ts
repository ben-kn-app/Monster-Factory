// import * as Phaser from 'phaser';

import { General } from '../../utilities/general';
import { AbstractScene } from '../abstract.scene';
import { Level } from './level.model';

export class LevelScene extends AbstractScene {
    private BACKGROUND_KEY: string = 'level_background';
    private BACKGROUND_IMAGE; // Is used in create();
    private FADE_ANIMATION = 300;

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

                const randomWidth = General.getRandomInt(width);
                const randomHeight = General.getRandomInt(height);

                // Seems to be a bug here, as the images are too 'bundled', don't know what yet.
                General.debugLog(width, height, randomWidth, randomHeight);

                const image = this.add.image(randomWidth, randomHeight, clickableObject.name || clickableObject.path);

                image.setScale(1);

                if (clickableObject.flipX) {
                    image.toggleFlipX();
                }

                // To make the image clickable
                image.setInteractive();

                //  Enables all kind of input actions on this image (click, etc)
                // image.inputEnabled = true;

                // text = game.add.text(250, 16, '', { fill: '#ffffff' });

                // image.events.onInputDown.add(listener, this);
            } catch (error) {
                console.error('Error adding image ' + clickableObject.path, error);
            }
        });

        // Handle click events
        this.input
            .setTopOnly(false) // If you want to check if more than the top most hitbox was clicked
            .on('pointerdown', (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => this.clickedOnObjects(objectsClicked));

        // * Now handle scrolling
        this.cameras.main.setBackgroundColor('0xEBF0F3');

        // * Register our custom scroll manager
        // this.scrollManager = new ScrollManager(this);
        // this.scrollManager.registerScrollingBackground(this.backgroundImage);
        // * Set cameras to the correct position
        // const ZOOM = 0.25;
        const ZOOM = 1;
        this.cameras.main.setZoom(ZOOM);
        //this.scrollManager.scrollToCenter();

        this.scale.on('resize', this.resize, this);
    }

    /**
     * Function called when the user clicks on object(s).
     * Will pass in multiple when they overlap.
     *
     * @param objectsClicked
     */
    clickedOnObjects(objectsClicked: Phaser.GameObjects.GameObject[]) {
        General.debugLog(objectsClicked);
        if (!objectsClicked || objectsClicked.length === 0) {
            return this.cameras.main.fadeFrom(this.FADE_ANIMATION, 150, 0, 0);
        }
        objectsClicked.forEach(objectClicked => {
            this.cameras.main.fadeFrom(this.FADE_ANIMATION, 0, 150, 0);
            objectClicked.destroy();
        });
    }
}
