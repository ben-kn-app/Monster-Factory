// import * as Phaser from 'phaser';

import { PhaserSingletonService } from '../../phaser-singleton.module';
import { General } from '../../utilities/general';
import { AbstractScene } from '../abstract.scene';
import { AvailableClickableObject, Level } from './level.model';

export class LevelScene extends AbstractScene {
    private BACKGROUND_KEY: string = 'level_background';
    private BACKGROUND_IMAGE; // Is used in create();
    private FADE_ANIMATION = 300;

    private availableClickableObjects: AvailableClickableObject[];
    private objectToFind: AvailableClickableObject;

    private level: Level = {
        assetsPrefix: 'assets/level_monster_factory/',
        background: 'background1280x720.png',
        clickableObjects: [
            { path: 'monstera1.svg' },
            { path: 'monstera2.svg' },
            { path: 'monstera3.svg' },
            { path: 'monstera4.svg' },
            { path: 'monstera5.svg' },
            { path: 'monstera6.svg' },
            { path: 'monsterb1.svg' },
            { path: 'monsterb2.svg' },
            { path: 'monsterb3.svg' },
            { path: 'monsterb4.svg' },
            { path: 'monsterb5.svg' },
            { path: 'monsterb6.svg' },
            { path: 'monsterb7.svg' },
            { path: 'monsterb8.svg' },
            { path: 'monsterc1.svg' },
            { path: 'monsterc2.svg' },
            { path: 'monsterc3.svg' },
            { path: 'monsterc4.svg' },
            { path: 'monsterc5.svg' },
            { path: 'monsterc6.svg' },
            // { path: 'monster1.png', flipX: true },
            // { path: 'monster2.png', flipX: true }
        ],
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
        this.BACKGROUND_IMAGE = this.add.image(0, 0, this.BACKGROUND_KEY).setOrigin(0, 0); // Set Origin as in phaser all game objects are positioned base on their center by default

        // reset available object
        this.availableClickableObjects = [];

        // this.scale.on('resize', this.resize, this);

        const { width, height } = this.sys.game.canvas;
        // const r1 = this.add.rectangle(0, 0, width, height, 0x66ff66);
        // Phaser.Display.Align.In.Center(r1, this.BACKGROUND_IMAGE);

        General.debugLog(width, height);
        // this.add.rectangle(0, 0, width, height, 0x6666ff);

        const spawnYAxis = [1100, 1000, 930, 750, 630, 490, 385, 210, 90];

        this.level.clickableObjects.forEach(clickableObject => {
            try {
                // const { width, height } = this.sys.game.canvas;
                // width = width * (1 + ZOOM);
                // height = height * (1 + ZOOM);
                const randomX = General.getRandomInt(width * 1.2);
                // const randomY = General.getRandomInt(height*1.2);
                const randomY = spawnYAxis[Math.random() * spawnYAxis.length || 0];

                // Seems to be a bug here, as the images are too 'bundled', don't know what yet.
                // General.debugLog(width, height, randomX, randomY);

                const image = this.add.image(randomX, randomY, clickableObject.name || clickableObject.path);

                image.setScale(0.25);

                if (clickableObject.flipX) {
                    image.toggleFlipX();
                }

                // To make the image clickable
                image.setInteractive();

                // Add image to available objects, so we can later search or delete them.
                // Without affecting the core level clickable objects
                this.availableClickableObjects.push({ go: image, clickableObject, path: this.level.assetsPrefix + clickableObject.path });

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

        // Set initial object to find
        // This will be updated everytime the user correctly searches for the object
        this.setNewObjectToFind();
    }

    setNewObjectToFind() {
        // Take a random object
        this.objectToFind = this.availableClickableObjects[Math.floor(Math.random() * this.availableClickableObjects.length)];

        // Pass it to ui
        PhaserSingletonService.findObjectObservable.next(this.objectToFind);
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
            return this.showObjectMissClickAnimation();
        }

        let foundObject = false;

        objectsClicked.forEach((objectClicked: Phaser.GameObjects.Image) => {
            // If the object clicked is the same as the player is looking for, the player has found it.
            if (this.isObjectEqual(objectClicked, this.objectToFind.go)) {
                this.showObjectFoundAnimation();
                this.removeFoundObject(objectClicked);
                this.setNewObjectToFind();
                foundObject = true;
            }
        });

        if (!foundObject) {
            return this.showObjectMissClickAnimation();
        }
    }

    /**
     * Shows an animation when the user finds the right object
     */
    showObjectFoundAnimation() {
        return this.cameras.main.fadeFrom(this.FADE_ANIMATION, 0, 150, 0);
    }

    /**
     * Shows an animation when the user finds the right object
     */
    showObjectMissClickAnimation() {
        return this.cameras.main.fadeFrom(this.FADE_ANIMATION, 150, 0, 0);
    }

    /**
     * Boolean check if 2 objects are equal
     *
     * @param object1
     * @param object2
     */
    isObjectEqual(object1: Phaser.GameObjects.Image, object2: Phaser.GameObjects.Image) {
        // We check by positioning, but there must be a better way?
        // TODO If we keep it this way, we need to make sure in create() to not spawn to images with the same position.
        if (object1.x === object2.x && object1.y === object2.y) {
            return true;
        }
        return false;
    }
    /**
     * Returns index if the object is available
     * -1 if not found.
     */
    getIndexOfAvailableObject(object: Phaser.GameObjects.Image) {
        return this.availableClickableObjects.findIndex(availableClickableObject => this.isObjectEqual(availableClickableObject.go, object));
    }

    /**
     * Remove object it from the level
     *
     * @param object
     */
    removeFoundObject(object: Phaser.GameObjects.Image) {
        this.availableClickableObjects.splice(this.getIndexOfAvailableObject(object), 1);
        General.debugLog('Removed Object new available objects', this.availableClickableObjects);
        object.destroy();

        // If no available objects are available we restart the level
        if (this.availableClickableObjects.length === 0) {
            this.scene.restart();
        }
    }
}
