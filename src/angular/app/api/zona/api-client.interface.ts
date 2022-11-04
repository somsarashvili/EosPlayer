import { Observable } from 'rxjs';
import { ZonaHttpOptions } from './';
import * as models from './models';

export interface ZonaAPIClientInterface {
  torrents(
    args: {
      id: string,
    },
    requestHttpOptions?: ZonaHttpOptions
  ): Observable<models.ZonaResult<models.ZonaTorrent[]>>;
  list(
    args: {
      page: number,
      perPage: number,
      searchKeyword?: string,
    },
    requestHttpOptions?: ZonaHttpOptions
  ): Observable<models.ZonaResult<models.ZonaListItem[]>>;
  details(
    args: {
      id?: string,
    },
    requestHttpOptions?: ZonaHttpOptions
  ): Observable<models.ZonaResult<models.ZonaDetails[]>>;
}
