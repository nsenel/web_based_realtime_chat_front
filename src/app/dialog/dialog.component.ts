import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  providers: [UserService]
})
export class DialogComponent implements OnInit
{
  public edittable: boolean;
  public user: User;
  public items: Array<string>;
  
  // Initialize static dialog config which blocks closing of dialog when clicking outside 
  static BlockingDialogConfig: MatDialogConfig = {disableClose: true};

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public user_service: UserService)
  {
    
    this.user = data.user;
    this.edittable = data.edittable;
  }

  ngOnInit()
  {
    this.items = this.user_service.getUserAttributes(this.user);
  }

  /**
   * @description Hide user id information in user dialog
   * @param item 
   */
  public hideItem(item: string): boolean
  {
    return (item == 'user_id');
  }

  /**
   * @description Close dialog with success and logged in user information
   * @param success 
   */
  public onClose(success: boolean)
  {
    this.dialogRef.close({
      'success': success,
      'user': this.user
    });
  }

}
