import { User } from '../models/user.model';

export enum Action
{
  JOINED,
  LEFT
}

export class UserAction
{
  user?: User;
  action?: Action;
}
