import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home/home.page';
import { CreditsModal } from './credits/credits.component';

const routes: Routes = [
    {
        path: 'game',
        component: HomePageComponent,
    },
    {
        path: 'credits',
        component: CreditsModal,
    },
    {
        path: '',
        redirectTo: 'game',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
