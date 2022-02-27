// import * as Phaser from 'phaser';

import { PhaserSingletonService, Scene_Keys } from '../../phaser-singleton.module';
import { General } from '../../utilities/general';
import { AbstractScene } from '../abstract.scene';
import { AvailableClickableObject, Level } from './level.model';

enum AssetKeys {
    MonsterLaugh = 'monster_laugh.wav',
    MonsterApplause = 'monster_applause.wav',
    ClickCorrect = 'click_correct.wav',
    ClickWrong = 'click_wrong.wav',
}

export class LevelScene extends AbstractScene {
    private SOUNDS_ASSETS_PATH: string = 'assets/sounds/';
    private BACKGROUND_KEY: string = 'level_background';
    private BACKGROUND_IMAGE; // Is used in create();
    private BACKGROUND_SCORE: string = 'score_background';
    private BACKGROUND_SEARCH: string = 'assets/wanted.png';
    private backgroundScorePath = 'assets/chalkboard.jpg';
    private FADE_ANIMATION = 300;
    private OBJECT_MARGIN = 100;

    private availableClickableObjects: AvailableClickableObject[];
    private objectToFind: AvailableClickableObject;

    private level: Level = {
        assetsPrefix: 'assets/level_monster_factory/',
        background: 'background1280x720.png',
        // spawnYAxis: [140, 255, 320, 412, 495, 608, 650, 715],
        spawnYAxis: [140, 255, 412, 495, 608, 715],
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
            { path: 'monsterd1.svg' },
            { path: 'monsterd2.svg' },
            { path: 'monsterd3.svg' },
            { path: 'monsterd4.svg' },
            { path: 'monsterd5.svg' },
            { path: 'monsterd6.svg' },
            { path: 'monsterd7.svg' },
            { path: 'monsterd8.svg' },
            { path: 'monstere1.svg' },
            { path: 'monstere2.svg' },
            { path: 'monstere3.svg' },
            { path: 'monstere4.svg' },
            { path: 'monstere5.svg' },
            { path: 'monstere6.svg' },
            { path: 'monstere7.svg' },
            { path: 'monstere8.svg' },
        ],
    };

    firstMonster = 'monsterb1.svg';

    searchLabel;
    searchRect;
    searchImage: Phaser.GameObjects.Image;
    scoreLabel;
    scoreTextObject: Phaser.GameObjects.Text;
    score = 0;
    IMAGE_SCALE = 0.15;

    SHOW_HINT_ANINIMATION_AFTER = 10000; // in ms

    hintTimeout;

    constructor() {
        // Config
        super(Scene_Keys.Level);
    }

    async preload() {
        try {
            General.debugLog('level.scene.ts', 'Preloading Assets...');

            // * Now load the background image
            this.load.image(this.BACKGROUND_KEY, this.level.assetsPrefix + this.level.background);
            this.load.image(this.BACKGROUND_SCORE, this.backgroundScorePath);
            this.load.image(this.BACKGROUND_SEARCH, this.BACKGROUND_SEARCH);

            // *** Load Sounds
            try {
                this.load.audio(AssetKeys.ClickCorrect, this.SOUNDS_ASSETS_PATH + AssetKeys.ClickCorrect);
                this.load.audio(AssetKeys.ClickWrong, this.SOUNDS_ASSETS_PATH + AssetKeys.ClickWrong);
                this.load.audio(AssetKeys.MonsterApplause, this.SOUNDS_ASSETS_PATH + AssetKeys.MonsterApplause);
                this.load.audio(AssetKeys.MonsterLaugh, this.SOUNDS_ASSETS_PATH + AssetKeys.MonsterLaugh);
            } catch (error) {
                console.error('Error loading sounds assets', error);
            }
            this.load.audio(AssetKeys.ClickCorrect, this.SOUNDS_ASSETS_PATH + AssetKeys.ClickCorrect);

            this.level.clickableObjects.forEach(clickableObject => {
                try {
                    this.load.image(clickableObject.name || clickableObject.path, this.level.assetsPrefix + clickableObject.path);
                } catch (error) {
                    console.error('Error loading image ' + clickableObject.path, error);
                }
            });

            this.score = 0;

            // Load particle Effects
            this.scene.run(Scene_Keys.ParticleEffects);
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

        // this.matter.world.setBounds(0, 0, 1200, 720, 1);
        this.matter.world.setBounds();

        // this.scoreLabel = this.add.rectangle(0, 0, 50, 50, 0x66ff66);
        // this.scoreLabel = this.matter.add.image(0, 0, this.BACKGROUND_SCORE).setStatic(true);
        // Phaser.Display.Align.In.TopLeft(this.scoreLabel, this.BACKGROUND_IMAGE); // Not needed
        // this.scoreTextObject = this.add.text(0, 0, this.score.toString(), { font: '50px Courier', color: '#ffffff' });
        // Phaser.Display.Align.In.Center(this.scoreTextObject, this.scoreLabel);

        await this.showWanted();

        this.level.spawnYAxis.forEach(y => {
            // this.add.rectangle(0,y,(1280*2),5, 0x66ff66);
            this.matter.add.rectangle(0, y, 1280 * 2, 1, {
                isStatic: true,
            });
        });

        this.level.clickableObjects.forEach(clickableObject => {
            try {
                const { randomX, randomY } = this.getRandomCoordinates();

                //const image = this.physics.add.image(randomX, -100, clickableObject.name || clickableObject.path);
                const image = this.matter.add.image(randomX, randomY, clickableObject.name || clickableObject.path, null, {
                    // chamfer: { radius: [250,250,30,30],
                    // qualityMin: 100
                    //  },
                    //  render: { sprite: { xOffset: 0.30, yOffset: 0.15 } },
                    circleRadius: 200,

                    restitution: 0.5, // elasticity
                    // slop: 1
                });

                // image.setOrigin(0, 0.5); // Set anchor center botom, so we can position the monsters on the shelves
                image.setAlpha(0).setScale(this.IMAGE_SCALE); // Hide image so we can show it with the animation tween
                image.setBounce(0);
                //image.setCollideWorldBounds(true);

                this.tweens.add({
                    targets: image,
                    alpha: 1,
                    // scale: 1,
                    //y: randomY,
                    ease: 'Bounce',
                    delay: Phaser.Math.Between(0, 300),
                    duration: 300,
                });

                // Grow on mouse over. Only relevant in browser
                image.on('pointerover', () => {
                    image.scaleX = this.IMAGE_SCALE + 0.01;
                    image.scaleY = this.IMAGE_SCALE + 0.01;
                });
                image.on('pointerout', () => {
                    image.scaleX = this.IMAGE_SCALE;
                    image.scaleY = this.IMAGE_SCALE;
                });

                if (clickableObject.flipX) {
                    image.toggleFlipX();
                }

                // To make the image clickable
                image.setInteractive();

                // Add image to available objects, so we can later search or delete them.
                // Without affecting the core level clickable objects
                this.availableClickableObjects.push({ go: image, clickableObject, path: this.level.assetsPrefix + clickableObject.path });
            } catch (error) {
                console.error('Error adding image ' + clickableObject.path, error);
            }
        });

        // Handle click events
        this.input
            .setTopOnly(false) // If you want to check if more than the top most hitbox was clicked
            .on('pointerdown', (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => this.clickedOnObjects(objectsClicked));

        // * Now handle scrolling
        //this.cameras.main.setBackgroundColor('0xEBF0F3');

        // Set initial object to find
        // This will be updated everytime the user correctly searches for the object
        this.setNewObjectToFind();
    }

    showWanted() {
        // return new Promise((resolve, reject) => {
            this.searchLabel = this.matter.add
                .image(500, 600, this.BACKGROUND_SEARCH, null, {
                    isStatic: true,
                    // render: { sprite: { xOffset: -0.50, yOffset: -0.5 } }
                })
                .setScale(1);
            Phaser.Display.Align.In.TopRight(this.searchLabel, this.BACKGROUND_IMAGE);

            // this.tweens.add({
            //     targets: this.searchLabel,
            //     scale: 1,
            //     x: 90,
            //     y: 130,
            //     //y: randomY,
            //     // ease: 'Bounce',
            //     delay: 500,
            //     duration: 2400,
            // });

            // return setTimeout(() => {
            //     // Bug: As the hitbox doesn't scale in the tween. We remake it.
            //     this.searchLabel.destroy();

            //     this.searchLabel = this.matter.add
            //         .image(90, 130, this.BACKGROUND_SEARCH, null, {
            //             isStatic: true,
            //             // render: { sprite: { xOffset: -0.50, yOffset: -0.5 } }
            //         })
            //         .setScale(1);
            //     return resolve({});
            // }, 3001);
        // });
    }

    /**
     * Get random coordinates to place an object
     */
    getRandomCoordinates() {
        let { width, height } = this.sys.game.canvas;

        // Make sure objects down spawn half out of the screen
        width -= this.OBJECT_MARGIN;

        const randomX = General.getRandomInt(width);
        let randomY = General.getRandomInt(height);

        // Can we use random Y coordinates to spawn clickable objects or do we need to adhere to specific spawn points
        if (this.level.spawnYAxis) {
            const randomIndex = Phaser.Math.Between(0, this.level.spawnYAxis.length);
            // const randomIndex = Math.floor(Math.random() * this.level.spawnYAxis.length);
            // randomY = this.level.spawnYAxis[randomIndex];
        }

        return { randomX, randomY };
    }

    setNewObjectToFind() {
        // Take a random object
        this.objectToFind = this.availableClickableObjects[Math.floor(Math.random() * this.availableClickableObjects.length)];

        setTimeout(() => {
            if (this.searchImage) {
                this.searchImage.destroy();
            }
            this.searchImage = this.add.image(96, 145, this.objectToFind.clickableObject.name || this.objectToFind.clickableObject.path).setScale(this.IMAGE_SCALE * 0.8);
            Phaser.Display.Align.In.Center(this.searchImage, this.searchLabel);
        }, 1000);

        // this.searchRect = this.add.rectangle(0, 0, 90, 120, 0xdcdcdc, 0.5);
        // Phaser.Display.Align.In.Center(this.searchRect, this.searchLabel);

        // Pass it to ui
        PhaserSingletonService.findObjectObservable.next(this.objectToFind);

        this.showHintAnimation();
    }

    /**
     * Function called when the user clicks on object(s).
     * Will pass in multiple when they overlap.
     *
     * @param objectsClicked
     */
    clickedOnObjects(objectsClicked: Phaser.GameObjects.GameObject[]) {
        General.debugLog(objectsClicked);

        this.showHintAnimation();

        if (!objectsClicked || objectsClicked.length === 0) {
            return this.showObjectMissClickAnimation();
        }

        let foundObject = false;

        objectsClicked.forEach((objectClicked: Phaser.GameObjects.Image) => {
            // If the object clicked is the same as the player is looking for, the player has found it.
            if (this.isObjectEqual(objectClicked, this.objectToFind.go) && !foundObject) {
                this.showObjectFoundAnimation(objectClicked);
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
    showObjectFoundAnimation(object: Phaser.GameObjects.Image) {
        // this.tweens.add({
        //     targets: object,
        // alpha: 0,

        // ease: 'Bounce',
        //   duration: 1000,
        //});

        const particleEffects = this.scene.get(Scene_Keys.ParticleEffects);

        particleEffects.events.emit('trail-to', {
            fromX: object.getCenter().x,
            fromY: object.getCenter().y,
            toX: this.searchLabel.getCenter().x,
            toY: this.searchLabel.getCenter().y,
        });

        this.sound.play(AssetKeys.ClickCorrect);

        this.score += 1;

        // Wait 1s for the particle effect to finish before updating the score
        if (this.scoreTextObject) {
            setTimeout(() => {
                this.scoreTextObject.setText(this.score.toString());
                // Realign it
                Phaser.Display.Align.In.Center(this.scoreTextObject, this.scoreLabel);
            }, 1000);
        }

        return this.cameras.main.fadeFrom(this.FADE_ANIMATION, 0, 250, 0);
    }

    /**
     * Shows an animation when the user finds the right object
     */
    showObjectMissClickAnimation() {
        this.sound.play(AssetKeys.ClickWrong);
        return this.cameras.main.fadeFrom(this.FADE_ANIMATION, 150, 0, 0);
    }

    /**
     * After X seconds we show a hint animation
     * @param object
     */
    showHintAnimation(object: Phaser.GameObjects.Image = this.objectToFind.go) {
        clearTimeout(this.hintTimeout);

        this.hintTimeout = setTimeout(() => {
            this.tweens.add({
                targets: object,
                scaleX: { from: this.IMAGE_SCALE - 0.01, to: this.IMAGE_SCALE },
                scaleY: { from: this.IMAGE_SCALE - 0.01, to: this.IMAGE_SCALE },
                // ease: 'Bounce',
                duration: 300,
                repeat: 2,
            });
            // this.sound.play(AssetKeys.MonsterLaugh);
            this.showHintAnimation();
        }, this.SHOW_HINT_ANINIMATION_AFTER);
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
            this.gameOver();
        }
    }

    gameOver() {
        // Wait a second for all animations to finish
        setTimeout(() => {
            this.cameras.main.fade(this.FADE_ANIMATION, 0, 0, 0);
            setTimeout(() => {
                this.scene.start(Scene_Keys.GameOver);
            }, this.FADE_ANIMATION);
        }, 1500);
    }
}
