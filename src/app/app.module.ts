import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NftComponent } from './nft/nft.component';
import { SpinnerModule } from './spinner/spinner.module';
import {
  rootReducer,
  rootStateFeatureKey,
} from './store-root/reducers/root-state.reducer';
import { NftPageComponent } from './nft-page/nft-page.component';

@NgModule({
  declarations: [AppComponent, NftComponent, NftPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(rootStateFeatureKey, rootReducer),
    SpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
