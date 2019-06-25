import { PlayerService } from './services/player.service';
import { Common } from './common';
import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from './services/loader.service';
import { BrowserWindow } from 'electron';
import { Observable, interval } from 'rxjs';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { EosShared } from '../../eos/eos.shared';
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
  private playerService: PlayerService;

  searchKeyword = new FormControl('');
  faSearch = faSearch;
  faTimes = faTimes;
  isMaximized: boolean;
  isLoading = true;
  playerStatus: EosShared.Models.PlayerModel

  constructor(public electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private readonly loader: LoaderService) {
    this.playerStatus = {
      name: '',
      downloadProgress: 0,
      downloadSpeed: 0,
      peers: 0,
      playing: false
    }
    new Titlebar({
      backgroundColor: Color.fromHex('#394146'),
      icon: './favicon.png',
      menu: null
    });

    this.playerService = PlayerService.INSTANCE;
    this.window = electronService.remote.getCurrentWindow();

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

    interval(500).subscribe(async () => {
      this.playerStatus = (await this.playerService.getPlayerStatus()).result;
    });
  }

  search() {
    this.router.navigate(['/search', this.searchKeyword.value]);
    console.log(this.searchKeyword.value);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  progress(prc: number) {
    return Math.round(prc * 1000) / 10;
  }

  downloadSpeed(speed: number) {
    return `${window.Common.fileSize(speed)}/s`;
  }
}
