import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// eslint-disable-next-line import/no-unresolved
import { PhaserSingletonService } from '@knapp/monster-factory/phaser/singleton';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './home/home.page';
import { CreditsModal } from './credits/credits.component';

@NgModule({
    declarations: [AppComponent, CreditsModal, HomePageComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), PhaserSingletonService.forRoot(), AppRoutingModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    bootstrap: [AppComponent],
})
export class AppModule {}
