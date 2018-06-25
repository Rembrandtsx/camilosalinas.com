import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { TalksComponent } from './talks/talks.component';


import {TransferHttpCacheModule} from '@nguniversal/common';

import { routes } from './routes';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    TalksComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    RouterModule.forRoot(routes),
    TransferHttpCacheModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
