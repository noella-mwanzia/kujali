import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { PermissionsStateService } from '@app/state/organisation';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  constructor(private _permissionsService: PermissionsStateService) { }

  checkActionsPermissions() {
    return this._permissionsService.checkAccessRight((p: any) => p.CompanySettings.CanViewCompanyActions);
  }

  checkOppsPermissions() {
    return this._permissionsService.checkAccessRight((p: any) => p.OpportunitiesSettings.CanViewOpportunities);
  }

  checkInvoicesPermissions() {
    return this._permissionsService.checkAccessRight((p: any) => p.InvoicesSettings.CanViewInvoices);
  }

  _checkContactsPermissions() {
    return this._permissionsService.checkAccessRight((p: any) => p.ContactsSettings.CanViewContacts);
  }
}
