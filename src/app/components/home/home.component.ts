import { ElectronService } from './../../providers/electron.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { APIClient } from '../../api';
import { HttpHeaders } from '@angular/common/http';
import * as child_process from 'child_process'
import * as vlc from 'vlc-command';
import { MovieDTO } from '../../api/models';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private page = 1;
  private perPage = 50;
  private sub: any;
  public keyword: string;

  movies: MovieDTO[] = [];

  constructor(private readonly electron: ElectronService,
    private readonly api: APIClient,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router) {
    router.events.subscribe((val) => {
      console.log(val instanceof NavigationEnd);
      console.log(!this.sub);
      if (val instanceof NavigationEnd && this.sub) {
        console.log('updating');
        this.movies = [];
        this.page = 1;
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.sub = this.activeRoute.params.subscribe(params => {
      this.keyword = params['keyword'];
    });
    this.onScroll();
  }

  play() {

    vlc(function (err, cmd) {
      if (err) return console.error('could not find vlc command path')

      if (process.platform === 'win32') {
        console.log(cmd);
        var child = child_process.execFile(cmd, ['--fullscreen', 'E:\\Zona Downloads\\Boje.Blagoslovi.Ameriku.2011.BDRip1080p-F.HD .mkv'], function (err, stdout) {
          if (err) return console.error(err)
          console.log(stdout)
        });
        child.once('close', () => alert('closed'));
      } else {
        child_process.exec(cmd + ' --version', function (err, stdout) {
          if (err) return console.error(err)
          console.log(stdout)
        })
      }
    })
  }

  formatUrl(id: string) {
    let sub = id.substr(0, id.length - 3);

    if (sub == "") {
      sub = "0";
    }

    return `http://img2.zonapic.com/images/film\_240/${sub}/${id}.jpg`
  }

  onScroll() {
    console.log(this.keyword);
    const requst: any = { page: this.page, perPage: this.perPage };
    if (this.keyword) {
      requst.searchKeyword = this.keyword
    }
    this.api.getMovies(requst, {
      headers: new HttpHeaders(
        {
          'Accept': 'application/json',
          'rejectUnauthorized': 'false'
        })
    }).subscribe((data) => {
      this.movies = this.movies.concat(data.movies);
      this.page++;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  quality(quality: number) {
    switch (quality) {
      case -3:
      case -2:
      case -1:
      case 0: {
        return "3d"
      }
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7: {
        return "high"
      }
      case 8:
      case 9:
      case 10:
      case 11:
      case 12: {
        return "medium"
      }
      case 13:
      case 14: {
        return "low"
      }
      default: {
        return "unknown"
      }

    }
  }
}
