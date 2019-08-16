import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { User } from '../models/user.model';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})

export class Response
{
  status: string;
  message: string;
}

export class UserService
{
  // Define API
  private apiURL = 'https://boiling-plains-77861.herokuapp.com/auth';
  // Http Options
  private headers: HttpHeaders;

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  public getUserList(): Observable<Array<User>>
  {
    return this.http.get<Array<User>>(this.apiURL + '/user_list', {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // public getUserInfo(username: string): Observable<User>
  // {
  //   this.headers.append('username', username);

  //   return this.http.get<User>(this.apiURL + '/user_info', {headers: this.headers})
  //   .pipe(
  //     retry(1),
  //     catchError(this.handleError)
  //   )
  // }

  public updateUserInfo(user: User): Observable<Response>
  {
    return this.http.post<Response>(this.apiURL + '/user_info', user, {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public getChatRoomList(): Observable<Response>
  {
    return this.http.get<Response>(this.apiURL + '/chat_room_list', {headers: this.headers})
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public getUserAttributes(user: User): Array<string>
  {
    return Object.keys(user);
  }

  public fixName(name: string): string
  {
    return name.split("_").join(" ");
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
