/* tslint:disable */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ZonaAPIClient, USE_DOMAIN, USE_HTTP_OPTIONS } from './api-client.service';

export { ZonaAPIClient } from './api-client.service';
export { ZonaAPIClientInterface } from './api-client.interface';

/**
 * provided options, headers and params will be used as default for each request
 */
export interface ZonaDefaultHttpOptions {
  headers?: {[key: string]: string};
  params?: {[key: string]: string};
  reportProgress?: boolean;
  withCredentials?: boolean;
}

export interface ZonaHttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  reportProgress?: boolean;
  withCredentials?: boolean;
}

export interface ZonaAPIClientModuleConfig {
  domain?: string;
  httpOptions?: ZonaDefaultHttpOptions;
}

@NgModule({})
export class ZonaAPIClientModule {
  /**
   * Use this method in your root module to provide the APIClientModule
   *
   * If you are not providing
   * @param { ZonaAPIClientModuleConfig } config
   * @returns { ModuleWithProviders }
   */
  static forRoot(config: ZonaAPIClientModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: ZonaAPIClientModule,
      providers: [
        ...(config.domain != null ? [{provide: USE_DOMAIN, useValue: config.domain}] : []),
        ...(config.httpOptions ? [{provide: USE_HTTP_OPTIONS, useValue: config.httpOptions}] : []),
        ZonaAPIClient
      ]
    };
  }
}
