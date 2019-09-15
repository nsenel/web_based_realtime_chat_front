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

  /**
   * Inıt socket connection
   * @param user_id 
   */
  public initSocket(user_id: Number): void
  {
    this.socket = socketIo.connect(SERVER_URL + '/connect', {query: 'user_id='+ user_id});
    this.socket = socketIo(SERVER_URL);
  }

  /**
   * @description Emit message to socket connection
   * @param message 
   */
  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  /**
   * @description Get message on socket and send message to observer
   */
  public onMessage(): Observable<Message>
  {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  /**
   * @description Get action on socket and send message to observer
   */
  public onUserAction(): Observable<Message>
  {
    return new Observable<UserAction>(observer => {
      this.socket.on('user_action', (data: UserAction) => observer.next(data));
    });
  }
}
