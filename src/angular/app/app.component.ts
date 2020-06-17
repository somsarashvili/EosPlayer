import { Common } from './common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { MainProcessAPI } from './services/main-process/MainProcessAPI';
import { interval } from 'rxjs';
import { PlayerModel } from '../../shared/types/PlayerModel';
import { MainProcessService } from './services/main-process/main-process.service';

declare global {
  interface Window {
    Common: typeof Common;    
    MainProcessAPI: MainProcessAPI;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchKeyword = new FormControl('');
  faSearch = faSearch;
  faTimes = faTimes;
  isMaximized: boolean;
  isLoading = true;
  playerStatus: PlayerModel;

  constructor(
    private translate: TranslateService,
    private mainProcessService: MainProcessService,
    private location: Location,
    private router: Router) {
    this.playerStatus = {
      name: '',
      downloadProgress: 0,
      downloadSpeed: 0,
      peers: 0,
      playing: false,
      imageUrl: null
    };

    // if (localStorage.getItem('savePath') == null) {
    //   localStorage.setItem('savePath', electronService.app.getPath('documents') + '\\Eos');
    // }

    window.MainProcessAPI.setTitleBar();

    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'en');
    }
    translate.setDefaultLang(localStorage.getItem('language'));
    console.log('AppConfig', AppConfig);
    window.Common = Common;

    interval(500).subscribe(async () => {
      this.playerStatus = (await this.mainProcessService.getPlayerStatus()).data;
    });

  }

  search() {
    this.router.navigate(['/search', this.searchKeyword.value]);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    if (!this.location.isCurrentPathEqualTo('/')) {
      this.location.back();
    }
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  progress(prc: number) {
    return Math.round(prc * 1000) / 10;
  }

  downloadSpeed(speed: number) {
    return `${window.Common.fileSize(speed)}/s`;
  }
}
