import { Component, OnInit, Inject, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatList, MatListItem } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { Action, UserAction } from '../models/action.model';
import { Connection } from '../models/connection.model';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [SocketService,
              UserService,
              AuthService]
})
export class ChatRoomComponent implements OnInit
{
  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, {read: ElementRef, static: true }) matList: ElementRef;

  public messages: Message[] = [];
  public message_input: string;
  public action = Action;
  public user_list: Array<User>;
  public logged_in_user: User;

  private profileDialogRef: MatDialogRef<DialogComponent>;
  private socket_connection: any;

  constructor(private socket_service: SocketService,
              private user_service: UserService,
              private auth_service: AuthService,
              private router: Router,
              private profileDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private toaster: ToastrService)
  {
    this.user_list = [];
    this.messages = [];
    this.logged_in_user = new User();
  }

  ngOnInit()
  {
    // redirect to home if already logged in
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }

    this.initSocketConnection();
    this.auth_service.getLoggedInUser().subscribe(data => 
      {
        this.logged_in_user = data;
        this.sendNotification(Action.JOINED);
        this.getUserList();
      });
  }

  public sendMessage(message: string): void
  {
    var msg = new Message(this.logged_in_user, message);
    this.socket_service.send(msg);

    this.scrollToBottom();
    // Clean the input field
    this.message_input = null;
  }

  public viewProfile(user: User, edit: boolean = false): void
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      'user': user,
      'edittable': edit
    }
    // Create loading dialog if it is not created before
    this.profileDialogRef = this.profileDialog.open(DialogComponent, dialogConfig);

    this.profileDialogRef.afterClosed().subscribe((data) =>
      {
        if (data.success)
        {
          if (data.user.user_id != this.logged_in_user.user_id)
          {
            return;
          }
          // var user = this.profileDialogRef.componentInstance.getUser();
          this.user_service.updateUserInfo(user).subscribe(data =>
            {
              if (data.status == "Fail")
              {
                this.toaster.error('Profile Update', 'Profile could not updated! Please try again.');
              }
              else
              {
                this.logged_in_user = data.user;
                this.toaster.success('Profile Update', data.message);
              }
            });
        }
        else
        {
          this.toaster.warning('Profile Update', 'Profile update is cancelled!');
        }
      });
  }

  private initSocketConnection(): void {
    this.socket_service.initSocket();

    this.socket_connection = this.socket_service.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.socket_connection = this.socket_service.onUserAction()
    .subscribe((message: UserAction) => {
      if (message.action == Action.JOINED)
      {
        this.user_list.push(message.user);
      }
      else if (message.action == Action.LEFT)
      {
        var index = this.user_list.indexOf(message.user);
        if (index > -1) {
          this.user_list.splice(index, 1);
        }
      }
    });

    this.socket_service.onEvent(Connection.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socket_service.onEvent(Connection.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  public sendNotification(action: Action): void {
    var message: Message;

    if (action == Action.JOINED || action == Action.LEFT)
    {
      message = {
        from: this.logged_in_user,
        action: action
      }
    }

    this.socket_service.send(message);
  }

  public logout(): void
  {
    this.auth_service.logout().subscribe(data =>
      {
        if (data.status == 'Success')
        {
          localStorage.removeItem('token');
          this.sendNotification(Action.LEFT);
          this.router.navigateByUrl('/login');
        }
      });
  }

  private getUserList(): void
  {
    this.user_service.getUserList().subscribe(data =>
      {
        this.user_list = data;
      })
  }

  private scrollToBottom(): void
  {
    this.matList.nativeElement.scrollTo(0, this.matList.nativeElement.clientHeight);
  }
}
