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

  torrents(args: { id: number; }, requestHttpOptions?: ZonaHttpOptions): Observable<models.ZonaResult<models.ZonaTorrent[]>> {

    const path = ``;
    const options: ZonaAPIHttpOptions = { ...this.options, ...requestHttpOptions };

    options.params = options.params.set('q', `((kinopoisk_id:${args.id})AND(deleted:false))AND(indexed%3A[1+TO+8])`);
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
