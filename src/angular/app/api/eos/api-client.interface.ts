/* tslint:disable */

import { Observable } from 'rxjs';
import { HttpOptions } from './';
import * as models from './models';

export interface APIClientInterface {

  list(
    args: {
      page?: number,
      perPage?: number,
      searchKeyword?: string,
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.MoviesDTO>;

  details(
    args: {
      id?: number,
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.MovieDetailsDTO>;

}
