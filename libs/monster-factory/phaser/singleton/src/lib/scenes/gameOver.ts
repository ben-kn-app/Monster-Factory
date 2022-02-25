import * as Phaser from 'phaser';
import { Scene_Keys } from '../phaser-singleton.module';
import { General } from '../utilities/general';

enum AssetKeys {
    VictorySprite = 'victory_sprite.png',
    LevelComplete = 'level_complete.wav',
    ImageReplay = 'replay.svg',
}

// Gif to sprite created from https://ezgif.com/gif-to-sprite/ezgif-4-bd087a5e39.gif

export default class GameOver extends Phaser.Scene {
    private SOUNDS_ASSETS_PATH: string = 'assets/sounds/';

    constructor() {
        super(Scene_Keys.GameOver);
    }

    preload() {
        General.debugLog('Game Over loaded');

        try {
            this.load.audio(AssetKeys.LevelComplete, this.SOUNDS_ASSETS_PATH + AssetKeys.LevelComplete);
            this.load.image(AssetKeys.ImageReplay, 'assets/' + AssetKeys.ImageReplay);

            this.load.spritesheet(AssetKeys.VictorySprite, 'assets/' + AssetKeys.VictorySprite, {
                frameWidth: 1200,
                frameHeight: 720,
            });
        } catch (e) {
            console.error('Error preloading GameOver Assets ', e);
        }
    }

    create() {
        const sprite = this.add.sprite(0, 0, AssetKeys.VictorySprite).setOrigin(0, 0);
        // Animation set
        this.anims.create({
            key: 'playVictoryGif',
            frames: this.anims.generateFrameNumbers(AssetKeys.VictorySprite, {
                frames: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
            }),
            frameRate: 8,
        });
        sprite.play('playVictoryGif');

        // Delay sound?
        this.sound.play(AssetKeys.LevelComplete);

        setTimeout(() => {
            const replayImage = this.add.image(0, 0, AssetKeys.ImageReplay).setScale(0.25);
            Phaser.Display.Align.In.BottomCenter(replayImage, sprite);

        }, 2000);

        this.input.on(
            'pointerup',
            pointer => {
                this.playAgain();
            },
            this
        );
    }

    playAgain() {
        this.scene.start(Scene_Keys.Level);
    }
}
