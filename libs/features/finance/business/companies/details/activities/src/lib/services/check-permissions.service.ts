import { Injectable } from '@angular/core';
// import { kujaliPermissions } from '@app/model/orgs';

// import { PermissionsStateService } from '@kujali/state/orgs';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  // constructor(private _permissionsService: PermissionsStateService) { }

  checkActionsPermissions() {
    // return this._permissionsService.checkAccessRight((p: any) => p.CompanySettings.CanViewCompanyActions);
  }

  checkOppsPermissions() {
    // return this._permissionsService.checkAccessRight((p: any) => p.OpportunitiesSettings.CanViewOpportunities);
  }

  checkInvoicesPermissions() {
    // return this._permissionsService.checkAccessRight((p: any) => p.InvoicesSettings.CanViewInvoices);
  }

  _checkQuotesPermissions() {
    // return this._permissionsService.checkAccessRight((p: any) => p.QuotesSettings.CanViewQuotes);
  }

  _checkOrdersPermissions() {
    // return this._permissionsService.checkAccessRight((p: any) => p.OrdersSettings.CanViewOrders);
  }

  _checkContactsPermissions() {
    // return this._permissionsService.checkAccessRight((p: any) => p.ContactsSettings.CanViewContacts);
  }
}
