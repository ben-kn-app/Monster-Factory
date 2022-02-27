import * as Phaser from 'phaser';
import { Scene_Keys } from '../phaser-singleton.module';
import { General } from '../utilities/general';

export enum TextureKeys {
    ParticleStar = 'particle-star',
}

export interface TrailToData {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

// Inspiration https://blog.ourcade.co/posts/2020/how-to-make-particle-trail-effect-phaser-3/

export default class ParticleEffects extends Phaser.Scene {
    constructor() {
        super(Scene_Keys.ParticleEffects);
    }

    preload() {
        General.debugLog('particle Effects loaded');

        try {
            this.load.image(TextureKeys.ParticleStar, 'assets/star.png');
        } catch (e) {
            console.error('Error perloading Particle Effects', e);
        }
    }

    create() {
        const particles = this.add.particles(TextureKeys.ParticleStar);

        this.events.on('trail-to', (data: TrailToData) => {
            const emitter = particles.createEmitter({
                x: data.fromX,
                y: data.fromY,
                quantity: 5,
                speed: { random: [50, 100] },
                lifespan: { random: [200, 400] },
                scale: { random: true, start: 1, end: 0 },
                rotate: { random: true, start: 0, end: 180 },
                angle: { random: true, start: 0, end: 270 },
                blendMode: 'ADD',
            });

            const xVals = [data.fromX, data.toX - 100, data.toX];
            const yVals = [data.fromY, data.toY - 50, data.toY];

            this.tweens.addCounter({
                from: 0,
                to: 1,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: 1000,
                onUpdate: tween => {
                    const v = tween.getValue();
                    const x = Phaser.Math.Interpolation.CatmullRom(xVals, v);
                    const y = Phaser.Math.Interpolation.CatmullRom(yVals, v);

                    emitter.setPosition(x, y);
                },
                onComplete: () => {
                    emitter.explode(50, data.toX, data.toY);
                    emitter.stop();

                    this.time.delayedCall(1000, () => {
                        particles.removeEmitter(emitter);
                    });
                },
            });
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.events.off('trail-to')
        })
    }
}
