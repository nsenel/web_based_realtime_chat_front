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
    // redirect to home if user is already logged in
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
    this.auth_service.getLoggedInUser().subscribe(data => 
      {
        this.logged_in_user = data;
        // Initialize socket connection
        this.initSocketConnection();
        // Get logged in user list to show in user list on chat page
        this.getUserList();
      });
  }

  /**
   * @description Send user message to socket with user information
   * @param message
   */
  public sendMessage(message: string): void
  {
    var msg = new Message(this.logged_in_user, message);
    this.socket_service.send(msg);
    // Clean the input field
    this.message_input = null;
  }

  /**
   * @description Show user dıalog to view profıles and edit own user profile
   * @param user 
   * @param edit 
   */
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

    // Check if thereis any data to save after closing profile dialog
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

  /**
   * @description Initialize socket connection to react on messages and actions
   */
  private initSocketConnection(): void {
    // Init socket with logged in user id
    this.socket_service.initSocket(this.logged_in_user.user_id);

    // Push messages to message array when socket receives a message
    this.socket_connection = this.socket_service.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    // Update user list regarding user action(add-remove user from list)
    this.socket_connection = this.socket_service.onUserAction()
    .subscribe((message: UserAction) => {

      if (message.action == Action.JOINED) // Remove user from current connected user list
      {
        this.user_list.push(message.user);
      }
      else if (message.action == Action.LEFT) // Remove user from current connected user list
      {
        this.user_list = this.user_list.filter(user => user.user_name !== message.user.user_name);
      }
      // Send notification message for each user action 
      this.sendNotification(message);
    });
  }

  /**
   * @description Send notifications of user actions and update messages array
   * @param user_action 
   */
  public sendNotification(user_action: UserAction): void {
    var message: Message;

    if (user_action.action == Action.JOINED || user_action.action == Action.LEFT)
    {
      message = {
        from: user_action.user,
        action: user_action.action
      }
      this.messages.push(message);
    }
  }

  /**
   * @description Log out user with removing user token and navigate page 
   */
  public logout(): void
  {
    this.auth_service.logout().subscribe(data =>
      {
        if (data.status == 'Success')
        {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
        }
      });
  }

  /**
   * Scroll chat list to bottom toshow alwazs the latest message on the bottom
   */
  public scrollToBottom(): void
  {
    var chat_field = document.getElementById('chat-list');
    chat_field.scrollTop = chat_field.scrollHeight;
  }

  /**
   * Get logged in user list 
   */
  private getUserList(): void
  {
    this.user_service.getUserList().subscribe(data =>
      {
        this.user_list = data;
      })
  }
}
