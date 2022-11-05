/* tslint:disable */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ZonaDefaultHttpOptions, ZonaHttpOptions, ZonaAPIClientInterface } from './';

import * as models from './models';

export const USE_DOMAIN = new InjectionToken<string>('APIClient_USE_DOMAIN');
export const USE_HTTP_OPTIONS = new InjectionToken<ZonaHttpOptions>('APIClient_USE_HTTP_OPTIONS');

type ZonaAPIHttpOptions = ZonaHttpOptions & {
  headers: HttpHeaders;
  params: HttpParams;
};

/**
 * Created with https://github.com/flowup/api-client-generator
 */
@Injectable()
export class ZonaAPIClient implements ZonaAPIClientInterface {
  readonly options: ZonaAPIHttpOptions;

  readonly domain: string = `//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;

  constructor(private readonly http: HttpClient,
    @Optional() @Inject(USE_DOMAIN) domain?: string,
    @Optional() @Inject(USE_HTTP_OPTIONS) options?: ZonaDefaultHttpOptions) {

    if (domain != null) {
      this.domain = domain;
    }

    this.options = {
      headers: new HttpHeaders(options && options.headers ? options.headers : {}),
      params: new HttpParams(options && options.params ? options.params : {}),
      ...(options && options.reportProgress ? { reportProgress: options.reportProgress } : {}),
      ...(options && options.withCredentials ? { withCredentials: options.withCredentials } : {})
    };
  }
  list(args: { page: number; perPage: number; searchKeyword?: string; }, requestHttpOptions?: ZonaHttpOptions): Observable<models.ZonaResult<models.ZonaListItem[]>> {

    const path = '/solr/movie/select/';
    const options: ZonaAPIHttpOptions = { ...this.options, ...requestHttpOptions };

    const searchQuery = args.searchKeyword && args.searchKeyword != '' ? `(name_original:(${args.searchKeyword}) OR name_rus_search:(${args.searchKeyword}))AND((languages:en OR languages:null)^0.01)AND` : '';
    const searchSort = args.searchKeyword && args.searchKeyword != '' ? 'score desc,' : '';

    options.params = options.params.set('q', `(${searchQuery}(serial:false)NOT(genreId:(12 OR 15 OR 25 OR 26 OR 1747 OR 28 OR 27 OR tv)))`);
    options.params = options.params.set('fl', 'id,year,playable,trailer,quality,audio_quality,type3d,serial,languages_imdb,rating,genre2,runtime,episodes,tor_count,serial_end_year,serial_ended,abuse,release_date_int,release_date_rus,indexed,geo_rules,partner_entity_id,partner_type,name_rus,name_ukr,name_eng,name_original');
    options.params = options.params.set('version', '2.2');
    options.params = options.params.set('start', ((args.page - 1) * args.perPage).toString());
    options.params = options.params.set('rows', args.perPage.toString());
    options.params = options.params.set('wt', 'json');
    options.params = options.params.set('sort', `${searchSort}popularity desc,seeds desc,id desc`)

    return this.sendRequest<models.ZonaResult<models.ZonaListItem[]>>('GET', path, options);
  }
  details(args: { id?: string; }, requestHttpOptions?: ZonaHttpOptions): Observable<models.ZonaResult<models.ZonaDetails[]>> {
 
    const path = '/solr/movie/select/';
    const options: ZonaAPIHttpOptions = { ...this.options, ...requestHttpOptions };

    options.params = options.params.set('q', `((id:${args.id}))`);
    options.params = options.params.set('version', '2.2');
    options.params = options.params.set('start', '0');
    options.params = options.params.set('rows', '1');
    options.params = options.params.set('wt', 'json');

    return this.sendRequest<models.ZonaResult<models.ZonaDetails[]>>('GET', path, options);
  }

  torrents(args: { id: string; }, requestHttpOptions?: ZonaHttpOptions): Observable<models.ZonaResult<models.ZonaTorrent[]>> {

    const path = '/solr/torrent/select/';
    const options: ZonaAPIHttpOptions = { ...this.options, ...requestHttpOptions };

    options.params = options.params.set('q', `((kinopoisk_id:${args.id})AND(deleted:false))`);
    options.params = options.params.set('fl', 'id,kinopoisk_id,broadcast_id,translate_info,files,episodes,episodesInfo,episodes_map_auto,languages,language,languages_mod,languages_parser,subtitles,subtitles_mod,subtitles_parser,private,hash,torrent_download_link,seeds,peers,size_bytes,type3d,quality_id,audio_quality_id,trailer,resolution,video_info,loading_time_sum,loading_success_count,loading_fail_count');
    options.params = options.params.set('version', '2.2');
    options.params = options.params.set('start', '0');
    options.params = options.params.set('rows', '2147483647');
    options.params = options.params.set('wt', 'json');

    return this.sendRequest<models.ZonaResult<models.ZonaTorrent[]>>('GET', path, options);
  }

  private sendRequest<T>(method: string, path: string, options: ZonaHttpOptions, body?: any): Observable<T> {
    switch (method) {
      case 'DELETE':
        return this.http.delete<T>(`${this.domain}${path}`, options);
      case 'GET':
        return this.http.get<T>(`${this.domain}${path}`, options);
      case 'HEAD':
        return this.http.head<T>(`${this.domain}${path}`, options);
      case 'OPTIONS':
        return this.http.options<T>(`${this.domain}${path}`, options);
      case 'PATCH':
        return this.http.patch<T>(`${this.domain}${path}`, body, options);
      case 'POST':
        return this.http.post<T>(`${this.domain}${path}`, body, options);
      case 'PUT':
        return this.http.put<T>(`${this.domain}${path}`, body, options);
      default:
        console.error(`Unsupported request: ${method}`);
        return throwError(`Unsupported request: ${method}`);
    }
  }
}
