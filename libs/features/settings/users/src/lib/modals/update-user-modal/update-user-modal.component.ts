import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { keys as __keys, pickBy as __pickBy } from 'lodash';

import { KuUser } from '@app/model/common/user';
import { Organisation } from '@app/model/organisation';

import { KujaliUsersService } from '@app/state/user';

@Component({
  selector: 'kujali-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.scss']
})
export class UpdateUserModalComponent implements OnInit {

  updateUserForm: FormGroup;

  constructor(private _fb: FormBuilder,
              public dialogRef: MatDialogRef<UpdateUserModalComponent>,
              @Inject(MAT_DIALOG_DATA) public userData: {org: Organisation, user: KuUser},
              private _userService: KujaliUsersService
  ) { }

  ngOnInit(): void {
    this.buildUpdateFormGroup(this.userData.user);
  }

  buildUpdateFormGroup(user: KuUser) {
    let firstName = user.displayName?.split(' ')[0];
    let lastName = user.displayName?.split(' ')[1];
    let roles = __keys(__pickBy(user.roles[this.userData.org.id!]));

    this.updateUserForm = this._fb.group({
      firstName: [firstName ?? ''],
      lastName: [lastName ?? ''],
      email: [user.email ?? ''],
      roles: [roles ?? []]
    })
  }

  updateUserDetails() {
    this._userService.updateUserDetails(this.userData.user, this.updateUserForm);
  }
}
