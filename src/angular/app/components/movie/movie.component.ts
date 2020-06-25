import { MainProcessService } from './../../services/main-process/main-process.service';
import { ZonaAPIClient } from './../../api/zona';
import { ZonaTorrent } from './../../api/zona/models/zona-torrent.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieDetailsDTO } from '../../api/eos/models';
import { APIClient } from '../../api/eos';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  private sub: any;
  private id: number;
  private WebtorrentHealth;
  private torrentHealthRestarted = null;
  movie: MovieDetailsDTO;
  torrents: ZonaTorrent[];
  faPlay = faPlay;

  private cancelTorrentHealth = function () { };

  constructor(
    private readonly mainProcess: MainProcessService,
    private readonly activeRoute: ActivatedRoute,
    private readonly eosApi: APIClient,
    private readonly zonaApi: ZonaAPIClient,
    private loadingBar: LoadingBarService) {
    this.WebtorrentHealth = mainProcess.getWebTorrentHealthModule();
  }

  ngOnInit() {
    this.sub = this.activeRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.loadData();
    });
  }

  fileSize(s) {
    return window.Common.fileSize(s);
  }

  private loadData() {
    this.eosApi.details({ id: this.id }).subscribe(data => {
      this.movie = data;
      console.log(data);
    });
    this.zonaApi.torrents({ id: this.id }).subscribe(data => {
      this.torrents = data.response.docs.sort((a, b) => {
        if (a.seeds > b.seeds) {
          return -1;
        } return 1;
      }).filter(e => {
        return !e.trailer;
      });
    });
  }

  play(torrent: string, name: string) {
    this.mainProcess.playTorrent({
      torrent: torrent,
      name: name,
      imageUrl: this.formatUrl(this.id.toString()),
      savePath: localStorage.getItem('savePath')
    });
  }

  duarationFormat(duration: number) {
    const date = new Date(duration * 60000);
    const minutes = date.getUTCMinutes();
    return `${date.getUTCHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  async checkHealth(torrent: ZonaTorrent) {
    this.cancelTorrentHealth();

    // Use fancy coding to cancel
    // pending webtorrent-health's
    let cancelled = false;
    this.cancelTorrentHealth = function () {
      cancelled = true;
    };
    this.loadingBar.start();
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.loadingBar.stop();
          this.cancelTorrentHealth();
        }, 10000);
        this.WebtorrentHealth(torrent.torrent_download_link, {
          trackers: window.Common.trackers
        }, (err, res) => {
          console.log('checking', cancelled, err);
          if (cancelled || err) {
            console.log(cancelled, err);
            clearTimeout(timeout);
            reject(err);
            this.loadingBar.complete();
          }
          if (res.seeds === 0 && this.torrentHealthRestarted < 5) {
            this.torrentHealthRestarted++;
          } else {
            this.torrentHealthRestarted = 0;
            const h = window.Common.calcHealth({
              seed: res.seeds,
              peer: res.peers
            });
            const health = window.Common.healthMap[h];
            const ratio = res.peers > 0 ? res.seeds / res.peers : +res.seeds;
            console.log('resolving');
            clearTimeout(timeout);
            resolve({
              health: health,
              seeds: res.seeds,
              peers: res.peers
            });
            this.loadingBar.complete();
          }
        });
      });
      torrent.seeds = result.seeds;
      torrent.peers = result.peers;
      torrent._health = result.health;
    } catch (e) {
      console.error(e);
    }
  }

  formatUrl(id: string) {
    let sub = id.substr(0, id.length - 3);

    if (sub === '') {
      sub = '0';
    }

    return `http://img2.zonapic.com/images/film\_240/${sub}/${id}.jpg`;
  }

  backdrop() {
    if (this.movie.backdropId == null) {
      return `linear-gradient(rgba(30, 37, 43, 0.3), #1e252b),
          url(https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/vfPFP3W/movie-theater-film-reel-background-in-seamless-loop_xk6ivnb9__F0000.png)`;
    }

    const id = this.movie.backdropId.toString();
    let sub = id.substr(0, id.length - 3);

    if (sub === '') {
      sub = '0';
    }

    return `linear-gradient(rgba(30, 37, 43, 0.3), #1e252b),
     url(http://img4.zonapic.com/images/backdrop_1920/${sub}/${id}.jpg),
      url(https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/vfPFP3W/movie-theater-film-reel-background-in-seamless-loop_xk6ivnb9__F0000.png)`;
  }

  quality(quality: number) {
    switch (quality) {
      case -3:
      case -2:
      case -1:
      case 0: {
        return '3d';
      }
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7: {
        return 'high';
      }
      case 8:
      case 9:
      case 10:
      case 11:
      case 12: {
        return 'medium';
      }
      case 13:
      case 14: {
        return 'low';
      }
      default: {
        return 'unknown';
      }

    }
  }

  videoQualit(quality: number) {
    switch (quality) {
      case -3: return 'Blu-Ray 3D';
      case -2: return 'Cтереопара';
      case -1: return 'Interlaced';
      case 0: return 'Анаглиф';
      case 1: return 'Blu-ray';
      case 2: return 'BDRip';
      case 3: return 'HDRip';
      case 4: return 'WEB-DLRip';
      case 5: return 'DVD9';
      case 6: return 'DVD5';
      case 7: return 'DVDRip';
      case 8: return 'TELECINE';
      case 9: return 'SATRip';
      case 10: return 'TVRip';
      case 11: return 'VHSRip';
      case 12: return 'Workprint';
      case 13: return 'TeleSync';
      case 14: return 'CamRip';
    }
  }

  audioQuality(quality: number) {
    switch (quality) {
      case 1: return '"Лицензия"';
      case 2: return 'iTunes';
      case 3: return 'Дублированный';
      case 4: return 'Профессиональный многоголосый';
      case 5: return 'Профессиональный одноголосый/двуголосый';
      case 6: return 'Авторский';
      case 7: return 'Любительский одноголосый/многоголосый';
      case 8: return 'Звук с TS';
    }
  }
}
