import { Injectable } from '@angular/core';
import { of } from 'rxjs';

// import { PermissionsStateService } from '@app/state/organisation';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  // constructor(private _permissionsService: PermissionsStateService) { }
  constructor() { }

  checkActionsPermissions() {
    return of(true);
    // return this._permissionsService.checkAccessRight((p: any) => p.ContactsSettings.CanViewContactsActions);
  }

  checkOppsPermissions() {
    return of(true);
    // return this._permissionsService.checkAccessRight((p: any) => p.OpportunitiesSettings.CanViewOpportunities);
  }

  checkInvoicesPermissions() {
    return of(true);
    // return this._permissionsService.checkAccessRight((p: any) => p.InvoicesSettings.CanViewInvoices);
  }
}
