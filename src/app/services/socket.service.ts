import { Injectable } from '@angular/core';

import { Observer, Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { Connection } from '../models/connection.model';
import { UserAction } from '../models/action.model';

import * as socketIo from 'socket.io-client';
// const io = require('socket.io')(http);

const SERVER_URL = 'https://boiling-plains-77861.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;
  constructor() { }

  public initSocket(): void
  {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: Message): void {
    console.log(message);
      this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message>
  {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => {observer.next(data);console.log(data);});
    });
  }

  public onUserAction(): Observable<Message>
  {
    return new Observable<UserAction>(observer => {
      this.socket.on('user_action', (data: UserAction) => {observer.next(data);console.log(data);});
    });
  }

  public onEvent(event: Connection): Observable<any>
  {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
