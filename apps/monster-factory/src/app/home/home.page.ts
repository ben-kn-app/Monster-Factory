import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PhaserSingletonService } from 'libs/monster-factory/phaser/singleton/src/lib/phaser-singleton.module';
import { CreditsModal } from '../credits/credits.component';

@Component({
    selector: 'openforge-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePageComponent implements OnInit {
    constructor(public modalController: ModalController) {}
    /**
     * * On Init, initilize the Phaser Singleton instance
     * The initialisation is delayed by 500ms to give the HomePage the chance to render
     * the <div class="phaser" id="forge-main">
     *
     * If we don't delay it, the canvas size in preload() and create() will be 0.
     * With the delay the canvas size will be set correctly.
     */
    async ngOnInit() {
        setTimeout(this.init, 500);
        // this.openModal();
    }

    async init() {
        await PhaserSingletonService.init();
    }

    goToGithub() {
        (window as any).open("https://github.com/ben-kn-app/Monster-Factory", "_blank");
        // this.document.location.href = 'https://github.com/ben-kn-app/Monster-Factory';
    }

    public async openModal() {
        const modal = await this.modalController.create({
            component: CreditsModal,
            cssClass: 'fullscreen',
        });
        return await modal.present();
    }

    restartGame() {
        PhaserSingletonService.restart();
    }
}
