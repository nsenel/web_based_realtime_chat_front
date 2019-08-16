import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class Response
{
  status: string;
  message: string;
  auth_token: string = "";
}

export class AuthService
{
  // Define API
  apiURL = 'https://boiling-plains-77861.herokuapp.com/auth';

  // Http Options
  // public httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json'
  //   })
  // };

  public headers: HttpHeaders = new HttpHeaders();
  public isLoggedIn: boolean;

  constructor(private http: HttpClient)
  {
    this.headers.set('Content-Type',  'application/json');
    // this.headers.set("Access-Control-Allow-Origin", "*")
    // this.headers.set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    // this.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    this.isLoggedIn = true;
  }

  // HttpClient API get() method => Fetch employees list
  public login(user: User): Observable<Response>
  {
    var httpOptions = {headers: this.headers};
    return this.http.post<Response>(this.apiURL + '/login', user, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method => Fetch employees list
  public register(user: User): Observable<Response>
  {
    var httpOptions = {headers: this.headers};
    return this.http.post<Response>(this.apiURL + '/register', user, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public getLoggedInUser(): Observable<User>
  {
    var auth_token = {'Authorization': 'chat_token ' + localStorage.getItem('token')};
    var httpOptions = {headers: this.headers};

    return this.http.post<User>(this.apiURL + '/status', auth_token, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public logout(): Observable<Response>
  {
    var auth_token = {'Authorization': 'chat_token ' + localStorage.getItem('token')};
    var httpOptions = {headers: this.headers};
    return this.http.post<Response>(this.apiURL + '/logout', auth_token, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // Error handling 
  private handleError(error)
  {
    let errorMessage = '';

    if(error.error instanceof ErrorEvent)
    {
      // Get client-side error
      errorMessage = error.error.message;
    }
    else
    {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
