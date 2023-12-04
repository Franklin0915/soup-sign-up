import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Form } from './form';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor(private http:HttpClient) { }

  postForms(user: Form): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
    });

    const options = {
      headers: headers,
      observe: 'response' as 'response', 
    };
    console.log('User data before posting:', user); 
    return this.http.post<any>("https://soup-data-collection-default-rtdb.firebaseio.com/users.json", user, options).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error during POST request:', error);
        return throwError(error);
      })
    );
  }

  private errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || "Server Error"));
    
  }

  



}
