import {Injectable} from '@angular/core';
import {Hero} from "./hero";
import {HEROES} from "./mock-heroes";
import {Observable, of} from "rxjs";
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes'; // URL to web api


  constructor(
    private httpClient: HttpClient,
    public messageService: MessageService) {
  }

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log("fetched heroes")),
        catchError((this.handleError('getHeroes', [])))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>('getHeroes'))
    )
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  updateHero(hero: Hero): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.httpClient.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`added hero w/ id=${hero.id}`)),
      catchError((this.handleError<any>('updateHero')))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.httpClient.post(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero id=${hero.id}`)),
      catchError((this.handleError<Hero>('addHero')))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero == 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/$id`;
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.httpClient.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError((this.handleError<Hero>('deleteHero')))
    );
  }

  searchHeroes(term: string):Observable<Hero[]>{
    if(!term.trim()){
      // return empty arry of heroes
      return of([]);
    }
    return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>('searchHero', []))
    );
  }

}
