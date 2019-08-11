import { PlayerService } from './services/player.service';
import { ZonaAPIClientModule } from './api/zona/index';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MovieComponent } from './components/movie/movie.component';
import { APIClientModule } from './api/eos';
import { SettingsComponent } from './components/settings/settings.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    MovieComponent,
    SettingsComponent
  ],
  imports: [
    APIClientModule.forRoot({
      domain: 'http://eos.sol.ge', // or use value defined in environment `environment.apiUrl`
    }),
    ZonaAPIClientModule.forRoot({
      domain: 'http://zsolr3.zonasearch.com/solr/torrent/select/'
    }),
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    InfiniteScrollModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
