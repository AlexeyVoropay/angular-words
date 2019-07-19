import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Conversion } from './conversion';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ConversionService {

  private conversionsUrl = 'http://localhost:50473/api/conversions';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET conversions from the server */
  getConversions (): Observable<Conversion[]> {
    return this.http.get<Conversion[]>(this.conversionsUrl)
      .pipe(
        tap(_ => this.log('fetched conversions')),
        catchError(this.handleError<Conversion[]>('getConversions', []))
      );
  }

  /** GET conversion by id. Return `undefined` when id not found */
  getConversionNo404<Data>(id: number): Observable<Conversion> {
    const url = `${this.conversionsUrl}/?id=${id}`;
    return this.http.get<Conversion[]>(url)
      .pipe(
        map(conversions => conversions[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} conversion id=${id}`);
        }),
        catchError(this.handleError<Conversion>(`getConversion id=${id}`))
      );
  }

  /** GET conversion by id. Will 404 if id not found */
  getConversion(id: number): Observable<Conversion> {
    const url = `${this.conversionsUrl}/${id}`;
    return this.http.get<Conversion>(url).pipe(
      tap(_ => this.log(`fetched conversion id=${id}`)),
      catchError(this.handleError<Conversion>(`getConversion id=${id}`))
    );
  }

  /* GET conversions whose name contains search term */
  searchConversions(term: string): Observable<Conversion[]> {
    if (!term.trim()) {
      // if not search term, return empty conversion array.
      return of([]);
    }
    return this.http.get<Conversion[]>(`${this.conversionsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found conversions matching "${term}"`)),
      catchError(this.handleError<Conversion[]>('searchConversions', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new conversion to the server */
  addConversion (conversion: Conversion): Observable<Conversion> {
    return this.http.post<Conversion>(this.conversionsUrl, conversion, httpOptions).pipe(
      tap((newConversion: Conversion) => this.log(`added conversion w/ id=${newConversion.id}`)),
      catchError(this.handleError<Conversion>('addConversion'))
    );
  }

  /** DELETE: delete the conversion from the server */
  deleteConversion (conversion: Conversion | number): Observable<Conversion> {
    const id = typeof conversion === 'number' ? conversion : conversion.id;
    const url = `${this.conversionsUrl}/${id}`;

    return this.http.delete<Conversion>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted conversion id=${id}`)),
      catchError(this.handleError<Conversion>('deleteConversion'))
    );
  }

  /** PUT: update the conversion on the server */
  updateConversion (conversion: Conversion): Observable<any> {
    return this.http.put(this.conversionsUrl, conversion, httpOptions).pipe(
      tap(_ => this.log(`updated conversion id=${conversion.id}`)),
      catchError(this.handleError<any>('updateConversion'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ConversionService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ConversionService: ${message}`);
  }
}
