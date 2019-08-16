import { User } from './user.model';
import { Action } from './action.model';

export class Message
{
  from?: User;
  content?: any;
  action?: Action;

  constructor(from?: User, content?: any, action?: Action)
  {
    this.from = from;
    this.content = content;
    this.action = action;

  }
}