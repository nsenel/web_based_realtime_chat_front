import { User } from './user.model';

export class Room
{
  public id: number;
  public name: string;
  public user_list: Array<User>;
}