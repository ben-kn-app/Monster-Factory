import { Component, NgZone, OnDestroy } from '@angular/core';
import { PhaserSingletonService } from '@knapp/monster-factory/phaser/singleton';

@Component({
    selector: 'knapp-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {

    constructor(public phaserInstance: PhaserSingletonService) {
    }

    /**
     * * Need to handle the destroy method so we dont lock up our computer!
     */
    ngOnDestroy(): void {
        PhaserSingletonService.destroyActiveGame();
    }

    
}
