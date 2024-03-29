import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ZonaAPIClient } from '../../api/zona';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { ZonaListItem } from '../../api/zona/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private page = 1;
  private perPage = 50;
  private done = false;
  private sub: any;
  public keyword: string;
  private loading = false;
  private onScrollCallback;
  faList = faList;

  movies: ZonaListItem[] = [];

  constructor(
    private readonly api: ZonaAPIClient,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router) {
    this.onScrollCallback = this.onScroll.bind(this);
  }


  ngOnInit() {
    window.addEventListener('scroll', this.onScrollCallback, true);
    this.done = false;
    this.sub = this.activeRoute.params.subscribe(params => {
      this.keyword = params['keyword'];
      this.page = 1;
      this.perPage = 50;
      this.done = false;
      this.movies = [];
      this.loadData();
    });
  }

  goToMovie(id: number) {
    this.router.navigate(['/movie', id]);
  }

  formatUrl(id: string) {
    let sub = id.substr(0, id.length - 3);

    if (sub === '') {
      sub = '0';
    }

    return `http://img2.zonapic.com/images/film\_240/${sub}/${id}.jpg`;
  }

  private offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  onScroll() {
    const offset = this.offset(document.getElementById('scroll-end'));
    const height = window.innerHeight;
    if (offset.top - height < 1500) {
      this.loadData();
    }
  }

  loadData() {
    if (this.loading || this.done) { return; }
    this.loading = true;
    const requst: any = { page: this.page, perPage: this.perPage };
    if (this.keyword) {
      requst.searchKeyword = this.keyword;
    }
    this.api.list(requst, {
      headers: new HttpHeaders(
        {
          'Accept': 'application/json',
          'rejectUnauthorized': 'false'
        })
    }).subscribe((data) => {
      this.loading = false;
      if (data.response.docs.length === 0) {
        this.done = true;
        return;
      }
      this.movies = this.movies.concat(data.response.docs);
      this.page++;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    window.removeEventListener('scroll', this.onScrollCallback, true);
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
}
