import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
import { SwordTypeEnum } from '@knapp/shared/data-access-model';
import * as Phaser from 'phaser';
import { Subject } from 'rxjs';
import GameOver from './scenes/gameOver';

// import { ForgeScene } from './scenes/forge.scene';
import { LevelScene } from './scenes/level/level.scene';
import ParticleEffects from './scenes/ParticleEffects';

/**
 * * The PhaserInstance is a singleton that controls the Game Scene, which is the UI portion of the Game Engine
 */

export enum Scene_Keys {
    Level = 'level',
    ParticleEffects = 'particle_effects',
    GameOver = 'game_over'
} 

@NgModule({
    imports: [CommonModule],
    declarations: [],
    exports: [],
})
export class PhaserSingletonService {
    // * We need the Phaser.Game to live inside our own class because extending Phaser.Game would require a super call
    public static activeGame: Phaser.Game;
    private static ngZone: NgZone;
    public static actionsHistory: string[] = []; // * Since phaser is a singleton, let's store the history of actions here for all components.
    public static shopObservable: Subject<SwordTypeEnum> = new Subject<SwordTypeEnum>();
    public static findObjectObservable: Subject<any> = new Subject();

    constructor(private _ngZone: NgZone, @Optional() @SkipSelf() parentModule?: PhaserSingletonService) {
        if (parentModule) {
            console.error('Phaser Singleton is already loaded. Import it in the AppModule only');
        } else {
            PhaserSingletonService.ngZone = this._ngZone;
            PhaserSingletonService.actionsHistory.push('Initializing Phaser...');
        }
    }

    /**
     * * This function is required for singleton instance
     *
     * @returns PhaserSingletonService & List of Providers
     */
    public static forRoot(): ModuleWithProviders<PhaserSingletonService> {
        return {
            ngModule: PhaserSingletonService,
            providers: [],
        };
    }

    /**
     * * When A user Logs out, destroy the active game.
     */
    public static destroyActiveGame() {
        //* Param 1: Set to true if you would like the parent canvas element removed from the DOM.
        //* Param 2: Set to false  If you do need to create another game instance on the same page
        if (PhaserSingletonService.activeGame) {
            PhaserSingletonService.activeGame.destroy(true, false);
        }
    }

    /**
     * Restarts a scene
     */
    public static restart() {
        if (PhaserSingletonService.activeGame) {
            PhaserSingletonService.activeGame.scene.getScene('level').scene.restart();
        }
    }

    /**
     * * Initializes the active Phaser.Game
     * * The Phaser.Game instance owns Scene Manager, Texture Manager, Animations FrameHandler, and Device Class as GLOBALS
     * * The Scene Manager owns the individual Scenes and is accessed by activeGame.scene
     * * Each Scene owns it's own "world", which includes all game objects.
     * ! GameInstance must be the parent class to scenes.
     * ! Should only be called *when* we want it to load in memory.  I.e. during simulation.
     */
    public static async init() {
        console.warn('phaser-singleton init');
        /**
         * * Phaser by default runs at 60 FPS, and each frame that triggers change detection in Angular which causes
         * * Performance to go out the door.  NgZone's runOutsideAngular will prevent Phaser from automatically hitting change detection
         * * https://angular.io/guide/zone
         */
        PhaserSingletonService.ngZone.runOutsideAngular(() => {
            if (!PhaserSingletonService.activeGame) {
                // To scale game to always fit in parent container
                // https://photonstorm.github.io/phaser3-docs/Phaser.Scale.ScaleManager.html
                PhaserSingletonService.activeGame = new Phaser.Game({
                    type: Phaser.AUTO,
                    scale: {
                        // The width and height are automatically adjusted to fit inside the given target area,
                        // while keeping the aspect ratio. Depending on the aspect ratio there may be some space inside the area which is not covered.
                        // Source: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scalemanager/
                        mode: Phaser.Scale.FIT,
                        // we choose 1280x720 for good fit for tablet. And 16:9 ratio
                        // https://gamedev.stackexchange.com/questions/104192/what-size-should-i-use-for-my-game-design
                        width: 1280,
                        height: 720,
                        autoCenter: Phaser.Scale.CENTER_BOTH,
                        // width: window.innerWidth,
                        // height: window.innerHeight,
                    },
                    parent: 'monster-factory-main',
                    scene: [LevelScene, ParticleEffects, GameOver],
                    physics: {
                        default: 'matter',
                        matter: {
                            debug: true,
                            enableSleeping: true, // improves performance when objects are not in velocity.
                            gravity: {
                                y: 1
                            }
                        }
                    },
                    plugins: {
                        global: [],
                        scene: [],
                    },
                    fps: {
                        forceSetTimeOut: true,
                    },
                    render: {
                        transparent: false,
                    },
                });
            }
        });
    }

    /**
     * * gets the actionsHistory
     *
     * @returns string[]
     */
    public static getActionsHistory() {
        return PhaserSingletonService.actionsHistory;
    }
}
