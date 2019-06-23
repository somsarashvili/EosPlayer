/* tslint:disable */

import { Observable } from 'rxjs';
import { HttpOptions } from './';
import * as models from './models';

export interface APIClientInterface {

  getMovies(
    args: {
      page?: number,
      perPage?: number,
      searchKeyword?: string,
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.MoviesDTO>;

}
