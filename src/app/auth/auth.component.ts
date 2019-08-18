import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [ './auth.component.css' ],
  providers: [ AuthService ]
})
export class AuthComponent implements OnInit
{
  public loginForm = new FormControl('');
  public user: User;
  public error_msg: string;
  public icon_name = "visibility";
  public password_type = "password";

  constructor(private auth_service: AuthService,
              private router: Router)
  {
  }

  ngOnInit()
  {
    this.user = new User();
    this.error_msg = "";
  }

  public submitLogin(): void
  {
    this.error_msg = "";
    this.auth_service.login(this.user).subscribe(data =>
      {
        if (data.status == 'Success')
        {
          localStorage.setItem('token', data.auth_token);
          this.router.navigateByUrl("/chat");
        }
        else
        {
          this.error_msg = data.message;
        }
      })
  }

  public register(): void
  {
    this.router.navigateByUrl("/register");
  }

  public showPassword(): void
  {
    if (this.password_type == "text")
    {
      this.password_type = "password";
      this.icon_name = "visibility"
    }
    else
    {
      this.password_type = "text";
      this.icon_name = "visibility_off"
    }
  }


}
