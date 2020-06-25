/* tslint:disable */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DefaultHttpOptions, HttpOptions, APIClientInterface } from './';

import * as models from './models';

export const USE_DOMAIN = new InjectionToken<string>('APIClient_USE_DOMAIN');
export const USE_HTTP_OPTIONS = new InjectionToken<HttpOptions>('APIClient_USE_HTTP_OPTIONS');

type APIHttpOptions = HttpOptions & {
  headers: HttpHeaders;
  params: HttpParams;
};

/**
 * Created with https://github.com/flowup/api-client-generator
 */
@Injectable()
export class APIClient implements APIClientInterface {

  readonly options: APIHttpOptions;

  readonly domain: string = `//${window.location.hostname}${window.location.port ? ':'+window.location.port : ''}`;

  constructor(private readonly http: HttpClient,
              @Optional() @Inject(USE_DOMAIN) domain?: string,
              @Optional() @Inject(USE_HTTP_OPTIONS) options?: DefaultHttpOptions) {

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

  list(
    args: {
      page?: number,
      perPage?: number,
      searchKeyword?: string,
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.MoviesDTO> {
    const path = `/Movie/List`;
    const options: APIHttpOptions = {...this.options, ...requestHttpOptions};

    if ('page' in args) {
      options.params = options.params.set('Page', String(args.page));
    }
    if ('perPage' in args) {
      options.params = options.params.set('PerPage', String(args.perPage));
    }
    if ('searchKeyword' in args) {
      options.params = options.params.set('SearchKeyword', String(args.searchKeyword));
    }
    return this.sendRequest<models.MoviesDTO>('GET', path, options);
  }

  details(
    args: {
      id?: number,
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.MovieDetailsDTO> {
    const path = `/Movie/Details`;
    const options: APIHttpOptions = {...this.options, ...requestHttpOptions};

    if ('id' in args) {
      options.params = options.params.set('Id', String(args.id));
    }
    return this.sendRequest<models.MovieDetailsDTO>('GET', path, options);
  }

  private sendRequest<T>(method: string, path: string, options: HttpOptions, body?: any): Observable<T> {
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
