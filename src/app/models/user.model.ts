export class User
{
  user_id: number = 0;
  user_name: string = " ";
  user_password: string = " ";
  user_mail: string = " ";
  age: number = 18;
  city: string = " ";

  constructor(user_name: string = "", user_mail: string = "")
  {
    this.user_name = user_name;
    this.user_mail = user_mail;
  }
}