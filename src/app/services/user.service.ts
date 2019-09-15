import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class Response
{
  status: string;
  message: string;
  user?: User
}

export class UserService
{
  private  SERVER_URL = environment.server_url + "/auth";
  // Http Options
  private headers: HttpHeaders;

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token')
      }
    );
  }

  /**
   * @description Get logged in user list
   */
  public getUserList(): Observable<Array<User>>
  {
    return this.http.get<Array<User>>(this.SERVER_URL + '/user_list', {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  /**
   * @description Update logged in user information 
   * @param user 
   */
  public updateUserInfo(user: User): Observable<Response>
  {
    return this.http.post<Response>(this.SERVER_URL + '/user_info', user, {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  /**
   * @description Get chat room list
   */
  public getChatRoomList(): Observable<Response>
  {
    return this.http.get<Response>(this.SERVER_URL + '/chat_room_list', {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  /**
   * @description Get user information attributes 
   * @param user 
   */
  public getUserAttributes(user: User): Array<string>
  {
    return Object.keys(user);
  }

  /**
   * @description Fix variable name  to split underscores
   * @param name 
   */
  public fixName(name: string): string
  {
    return name.split("_").join(" ");
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
