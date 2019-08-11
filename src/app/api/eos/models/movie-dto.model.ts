import { GenreDTO } from './genre-dto.model';

/* tslint:disable */

export interface MovieDTO {
  audioQuality?: number;
  genreName?: string;
  id?: number;
  nameEng?: string;
  nameOriginal?: string;
  nameRus?: string;
  quality?: number;
  rating?: number;
  releaseDate?: string;
  runtime?: number;
  year?: number;
  genres?: GenreDTO[];
}
