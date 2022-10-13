import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';
import { ToastService } from '@iote/bricks-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-share-budget-modal',
  templateUrl: './share-budget-modal.component.html',
  styleUrls: [ './share-budget-modal.component.scss' ]
})
/** Modal responsible for sharing budgets. */
export class ShareBudgetModalComponent implements OnInit, OnDestroy
{
  private _sbS = new Subscription();

  users!: KuUser[]; 
  uId!:   string; 

  editableUserIds: string[] = [];  
  saving = false; 

  constructor(
      public dialogRef: MatDialogRef<ShareBudgetModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
                
      private _users$$: UserService<KuUser>,
      private _toasts$: ToastService) 
  { }

  ngOnInit() {
    // Get the all the users
    this._sbS.add(
      this._users$$.getUsers()
        .subscribe(users =>
            this.users = users
      ));

    this._sbS.add(
      this._users$$.getUserId()
        .subscribe(uId => 
            this.uId = uId
      )); 
  }

  /** Check if the user has access to this budget. */ 
  checkBudgetOwnership(user: KuUser) {
    return user.profile.budgets && Object.keys(user.profile.budgets).includes(this.data.id);
  }

  /** Omit the current user from the list of users. */
  omitCurrentUser(users: KuUser[]) {
    return users.filter(u => u.uid !== this.uId); 
  }

  /** Assign the selected budget to a user. */
  assignBudgetToUser(check: boolean, user: KuUser) 
  {    
    // See if the user has been edited, if not add them to editable
    if(!this.editableUserIds.includes(user.uid))
      this.editableUserIds.push(user.uid); 

    // If check is true - Assign the budget to the user
    if(check) {

      // Check if the user has a budgets prop
      if(!user.profile.budgets)
        user.profile.budgets = {}; 

      user.profile.budgets[this.data.id] = { view: true, edit: true }; 
    } else {

      // If check is false - Check if the user has the budget assigned to them and Unassign it 
      delete user.profile.budgets[this.data.id]; 
    }
  }

  /** Save the budget configuration. */
  async saveChanges() 
  {
    this.saving = true; 
    // Get the users to edit 
    const usersToEdit = this.users.filter((u) => this.editableUserIds.includes(u.uid)); 

    await Promise.all(usersToEdit.map(u => this._users$$.updateUser(u)))
           .then(() => {

              this._toasts$.doSimpleToast('Budgets assigned successfully', 3000);
              this.saving = false; 
              this.closeModal(); 
           }); 
  }

  async updateUser(u: KuUser) {
    return this._users$$.updateUser(u);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }

}