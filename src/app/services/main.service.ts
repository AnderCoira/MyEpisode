import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AnimeSearch } from 'src/interfaces/anime-search';
import { AnimeEpisode } from 'src/interfaces/anime-episode';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  URL: string = "https://api.jikan.moe/v4";

  constructor(private http: HttpClient) { }

  searchAnime(animeName: String){
    return this.http.get<AnimeSearch>(`${this.URL}/anime?q=${animeName}`);
  }

  getAnimeEpisodeById(animeId: Number, episodeNumber: Number){
    return this.http.get<AnimeEpisode>(`${this.URL}/anime/${animeId}/episodes/${episodeNumber}`);
  }

}
