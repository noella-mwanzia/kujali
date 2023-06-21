import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { KujaliUsersService } from '@app/state/user';

@Component({
  selector: 'kujali-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss']
})
export class NewUserDialogComponent implements OnInit {

  newUserFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              public dialogRef: MatDialogRef<NewUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public org: any,
              private _usersService: KujaliUsersService
    ) { }

  ngOnInit(): void {
    this.buildNewUserFormGroup();    
  }

  buildNewUserFormGroup() {
    this.newUserFormGroup = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roles:[[]],
      email: ['', Validators.email]
    });
  }

  inviteNewUser() {
    if (!!this.newUserFormGroup.valid) {
      this._usersService.addUserToOrg(this.newUserFormGroup);
      this.dialogRef.close();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
