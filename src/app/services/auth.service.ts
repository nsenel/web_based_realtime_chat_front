import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
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
  private  SERVER_URL = environment.server_url + "/auth";

  public headers: HttpHeaders;
  public isLoggedIn: boolean;

  constructor(private http: HttpClient)
  {
    // this.headers.set('Content-Type',  'application/json');
    this.isLoggedIn = true;
    // Initialize httpHeaders with content type and authorization credentials
    this.headers = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token')
      }
    );
  }

  /**
   * @description Set logged in variable
   * @param isLoggedIn
   */
  public setLoggedInFlag(isLoggedIn: boolean): void
  {
    this.isLoggedIn = isLoggedIn;
  }

  // HttpClient API get() method => Fetch employees list
  /**
   * @description Login user with user information
   * @param user 
   */
  public login(user: User): Observable<Response>
  {
    return this.http.post<Response>(this.SERVER_URL + '/login', user, {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method => Fetch employees list
  /**
   * @description Register user with user information
   * @param user 
   */
  public register(user: User): Observable<Response>
  {
    return this.http.post<Response>(this.SERVER_URL + '/register', user, {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  /**
   * @description Get logged in user information 
   */
  public getLoggedInUser(): Observable<User>
  {
    return this.http.get<User>(this.SERVER_URL + '/status', {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  /**
   * @description Log out user
   */
  public logout(): Observable<Response>
  {
    return this.http.get<Response>(this.SERVER_URL + '/logout', {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  /**
   * @description Handle error
   * @param error 
   */
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
