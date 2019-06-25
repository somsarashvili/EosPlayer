import { PlayerService } from './../../services/player.service';
import { LoaderService } from './../../services/loader.service';
import { ZonaAPIClient } from './../../api/zona';
import { ZonaTorrent } from './../../api/zona/models/zona-torrent.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieDetailsDTO } from '../../api/eos/models';
import { APIClient } from '../../api/eos';
import { ElectronService } from '../../providers/electron.service';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  private sub: any;
  private id: number;
  private WebtorrentHealth;
  private sender = Math.random();
  private readonly player: PlayerService;
  movie: MovieDetailsDTO;
  torrents: ZonaTorrent[];
  faPlay = faPlay;

  private cancelTorrentHealth = function () { };
  private torrentHealthRestarted = null;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly electron: ElectronService,
    private readonly eosApi: APIClient,
    private readonly zonaApi: ZonaAPIClient,
    private readonly loader: LoaderService,
    private readonly router: Router) {

    this.player = PlayerService.INSTANCE;
    this.WebtorrentHealth = electron.remote.require('webtorrent-health');
  }

  ngOnInit() {
    this.sub = this.activeRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.loader.setSender(this.sender);
      this.loadData();
    });
  }

  fileSize(s) {
    return window.Common.fileSize(s);
  }

  private loadData() {
    this.loader.emitLoading(this.sender, true);
    this.eosApi.details({ id: this.id }).subscribe(data => {
      this.movie = data;

      this.loader.emitLoading(this.sender, false);
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
    this.player.playTorrent({ torrent: torrent, name: name });
  }

  duarationFormat(duration: number) {
    const date = new Date(duration * 60000);
    return `${date.getUTCHours()}:${date.getUTCMinutes()}`;
  }

  async checkHealth(torrent: ZonaTorrent) {
    this.loader.emitLoading(this.sender, true);

    this.cancelTorrentHealth();

    // Use fancy coding to cancel
    // pending webtorrent-health's
    let cancelled = false;
    this.cancelTorrentHealth = function () {
      cancelled = true;
    };
    try {
      const result = await new Promise<any>((resolve, reject) => {

        this.WebtorrentHealth(torrent.torrent_download_link, {
          timeout: 1000,
          trackers: window.Common.trackers
        }, (err, res) => {
          if (cancelled || err) {
            console.log(cancelled, err);
            reject(err);
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
            resolve({
              health: health,
              seeds: res.seeds,
              peers: res.peers
            });
          }
        });
      });
      torrent.seeds = result.seeds;
      torrent.peers = result.peers;
      torrent._health = result.health;
      this.loader.emitLoading(this.sender, false);
    } catch (e) {
      console.error(e);
      this.loader.emitLoading(this.sender, false);
    }
  }

  formatUrl(id: string) {
    let sub = id.substr(0, id.length - 3);

    if (sub === '') {
      sub = '0';
    }

    return `http://img2.zonapic.com/images/film\_240/${sub}/${id}.jpg`;
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
