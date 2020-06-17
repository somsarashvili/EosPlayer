import { Observable } from 'rxjs';
import { ZonaHttpOptions } from './';
import * as models from './models';

export interface ZonaAPIClientInterface {
  torrents(
    args: {
      id: number,
    },
    requestHttpOptions?: ZonaHttpOptions
  ): Observable<models.ZonaResult<models.ZonaTorrent[]>>;

}
