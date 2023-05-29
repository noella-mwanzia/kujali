import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

// import { PermissionsStateService } from '@app/state/orgs';

@Injectable({
  providedIn: 'root',
})
export class ActionsPermissionsService {
  // constructor(private _permissionsService: PermissionsStateService) {}

  checkCreatePermissions(domain: string) {
    return of(true);
    // return this._permissionsService.checkAccessRight(
    //   this.getPermissionsDomain(domain, 'create')
    // );
  }

  checkDeletePermissions(domain: string) {
    return of(true);
    // return this._permissionsService.checkAccessRight(
    //   this.getPermissionsDomain(domain, 'delete')
    // );
  }

  private getPermissionsDomain(_domain: string, action: string): (p: any) => any {
    switch (_domain) {
      case 'companies':
        switch (action) {
          case 'create':
            return (p: any) => p.CompanySettings.CanCreateCompanyActions;

          case 'delete':
            return (p: any) => p.CompanySettings.CanDeleteCompanyActions;
          default:
            return () => {};
        }

      case 'contacts':
        switch (action) {
          case 'create':
            return (p: any) => p.ContactsSettings.CanCreateContactsActions;

          case 'delete':
            return (p: any) => p.ContactsSettings.CanDeleteContactsActions;

          default:
            return () => {};
        }

      case 'opportunities':
        switch (action) {
          case 'create':
            return (p: any) =>
              p.OpportunitiesSettings.CanCreateOpportunitiesActions;

          case 'delete':
            return (p: any) =>
              p.OpportunitiesSettings.CanDeleteOpportunitiesActions;

          default:
            return () => {};
        }

      default:
        return () => {};
    }
  }
}
