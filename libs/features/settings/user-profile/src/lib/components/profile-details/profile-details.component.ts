import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {flatMap as __flatMap, keys as __keys, pickBy as __pickBy} from 'lodash';

import { KuUser } from '@app/model/common/user';
import { Organisation } from '@app/model/organisation';

import { AppClaimDomains } from '@app/model/access-control';

import { UserStore, KujaliUsersService } from '@app/state/user';
import { OrganisationService } from '@app/state/organisation';

import { UpdateProfilePictureModalComponent } from '../..//modals/update-profile-picture-modal/update-profile-picture-modal.component';

@Component({
  selector: 'kujali-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  org$: Observable<Organisation>;
  user: KuUser;

  userFormGroup: FormGroup;

  roles: string;
  userDetailsLoaded: boolean;

  editProfile: boolean = false;

  readonly CAN_PERFOM_ADMIN_ACTIONS = AppClaimDomains.Admin;

  constructor(private _dialog: MatDialog,
              private _fb: FormBuilder,
              private _orgService: OrganisationService,
              private _user$$: UserStore,
              private _userService: KujaliUsersService
  ) { }

  ngOnInit(): void {
    this.org$ = this._orgService.getActiveOrg();
    this.getUser();
  }

  getUser() {
    this._user$$.getUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this.userDetailsLoaded = true;
        this.user = user;
        this.roles =  __keys(__pickBy(user.roles[user.profile.activeOrg])) as any;
        this.buildUserFormGroup(user);
      }
    })
  }

  buildUserFormGroup(user: KuUser) {
    let name: string[] = user.displayName!.split(' ');
    this.userFormGroup = this._fb.group({
      firstName: [name[0]],
      lastName: [name[1]]
    })
    this.userFormGroup.disable();
  }

  editUserProfile() {
    this.editProfile = !this.editProfile;
    if (this.editProfile) {
      this.userFormGroup.enable();
    } else {
      this.updateUserName();
      this.userFormGroup.disable();
    }
  }

  updateUserName() {
    this._userService.updateUserName(this.user, this.userFormGroup);
  }

  updatePassword() {
    this._user$$.getUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this._userService.updatePassword(user.email);
       }
    })
  }

  newProfileImg() {
    this._dialog.open(UpdateProfilePictureModalComponent, {
      data: this.user}).afterClosed().subscribe();
  }
}
