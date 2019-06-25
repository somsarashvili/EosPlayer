import { Common } from './common';
import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faSearch, faTimes, faWindowMaximize, faWindowRestore, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from './services/loader.service';
import { BrowserWindow } from 'electron';
import { Observable } from 'rxjs';
import { Titlebar, Color } from 'custom-electron-titlebar';
declare global {
  interface Window {
    Common: typeof Common;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private window: BrowserWindow;

  searchKeyword = new FormControl('');
  faSearch = faSearch;
  faWindowClose = faTimes;
  faWindowMaximize = faWindowMaximize;
  faWindowRestore = faWindowRestore;
  faWindowMinimize = faWindowMinimize;
  isMaximized: boolean;
  isLoading = true;

  constructor(public electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private readonly loader: LoaderService) {

    new Titlebar({
      backgroundColor: Color.fromHex('#394146'),
      icon: './favicon.png',
      menu: null
    });
    this.window = electronService.remote.getCurrentWindow();
    new Observable(observable => {
      this.window.on('move', () => {
        console.log('maximize');
        this.isMaximized = this.window.isMaximized();
        observable.next();
      });
      this.window.on('unmaximize', () => {
        this.isMaximized = this.window.isMaximized();
        observable.next();
      });
    });
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'en');
    }
    translate.setDefaultLang(localStorage.getItem('language'));
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
    window.Common = Common;
    loader.loading$.subscribe(item => this.isLoading = item);
  }

  search() {
    this.router.navigate(['/search', this.searchKeyword.value]);
    console.log(this.searchKeyword.value);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  windowClose() {

  }

  windowToggle() {

  }

  windowMinimize() {

  }
}
