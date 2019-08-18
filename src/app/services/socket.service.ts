import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';
import { Connection } from '../models/connection.model';
import { UserAction } from '../models/action.model';

import * as socketIo from 'socket.io-client';

const SERVER_URL = environment.server_url;

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
      this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message>
  {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onUserAction(): Observable<Message>
  {
    return new Observable<UserAction>(observer => {
      this.socket.on('user_action', (data: UserAction) => observer.next(data));
    });
  }

  public onEvent(event: Connection): Observable<any>
  {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
