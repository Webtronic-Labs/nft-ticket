import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NftPageComponent } from './nft-page/nft-page.component';
import { OwnerGuard } from './owner.guard';
import { WebGuard } from './web.guard';

const routes: Routes = [
  {
    path: 'nft',
    component: NftPageComponent,
  },
  {
    path: 'secret',
    loadChildren: () =>
      import('./secret/secret.module').then((m) => m.SecretModule),
    canLoad: [WebGuard],
  },
  {
    path: 'control-panel',
    loadChildren: () =>
      import('./control-panel/control-panel.module').then(
        (m) => m.ControlPanelModule
      ),
    canLoad: [OwnerGuard],
  },
  {
    path: '',
    redirectTo: 'nft',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
