import { Component, NgZone, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhaserSingletonService } from '@knapp/monster-factory/phaser/singleton';

import { ShopPageComponent } from './shop/shop.component';

@Component({
    selector: 'openforge-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
    public actionsHistoryRef: string[];
    public objectToFind: Phaser.GameObjects.Image;

    // * for our app template to use the actions History)
    constructor(public phaserInstance: PhaserSingletonService, public modalController: ModalController, public zone: NgZone) {
        this.actionsHistoryRef = PhaserSingletonService.actionsHistory;

        PhaserSingletonService.findObjectObservable.subscribe(objectToFind => {
            console.log(objectToFind);
            console.log(objectToFind.path);

            //objectToFind.source[0].currentSrc
            this.zone.run(() => {
                this.objectToFind = objectToFind;
            });
        });
    }

    public async openShop() {
        const modal = await this.modalController.create({
            component: ShopPageComponent,
            cssClass: 'fullscreen',
        });
        return await modal.present();
    }

    /**
     * * Need to handle the destroy method so we dont lock up our computer!
     */
    ngOnDestroy(): void {
        PhaserSingletonService.destroyActiveGame();
    }

    restartGame() {
        PhaserSingletonService.restart();
    }
}
