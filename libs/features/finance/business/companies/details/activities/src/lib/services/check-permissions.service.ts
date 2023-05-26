import { Injectable } from '@angular/core';
import { of } from 'rxjs';
// import { kujaliPermissions } from '@app/model/orgs';

// import { PermissionsStateService } from '@kujali/state/orgs';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  // constructor(private _permissionsService: PermissionsStateService) { }

  checkActionsPermissions() {
    return of(true);
    // return this._permissionsService.checkAccessRight((p: any) => p.CompanySettings.CanViewCompanyActions);
  }

  checkOppsPermissions() {
    return of(true);
    // return this._permissionsService.checkAccessRight((p: any) => p.OpportunitiesSettings.CanViewOpportunities);
  }

  checkInvoicesPermissions() {
    return of(true);
    // return this._permissionsService.checkAccessRight((p: any) => p.InvoicesSettings.CanViewInvoices);
  }

  _checkContactsPermissions() {
    return of(true);
    // return this._permissionsService.checkAccessRight((p: any) => p.ContactsSettings.CanViewContacts);
  }
}
