import { GenreDTO } from "./genre-dto.model";

/* tslint:disable */

export interface MovieDetailsDTO {
  backdropId?: number;
  audioQuality?: number;
  country?: string;
  description?: string;
  descriptionEng?: string;
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
