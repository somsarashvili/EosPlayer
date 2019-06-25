import { ZonaTorrent } from './zona-torrent.model';

export class ZonaResponse<T> {
  numFound: number;
  docs: T;
}
