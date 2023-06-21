import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AccessRights, AppClaimDomains } from '@app/model/access-control';

import { PerformActionRightsQuery }      from '../queries/base/perfom-action-rights.query';
import { PerformAdminActionRightsQuery } from '../queries/base/perfom-admin-actions-rights.query';
import { PerformSuperAdminActionRightsQuery } from '../queries/base/perfom-super-admin-actions-rights.query';

import { PerformCreateKujaliMembersActionRightsQuery } from '../queries/base/perfom-create-kujali-member-actions.query';

import { PerformCompanyActionRightsQuery } from '../queries/companies/perfom-company-actions-rights.query';
import { PerformCreateCompaniesActionRightsQuery } from '../queries/companies/perfom-create-companies-actions-rights.query';
import { PerformCompaniesActionsViewRightsQuery } from '../queries/companies/perfom-companies-actions-view-rights.query';
import { PerformDeleteCompaniesActionRightsQuery } from '../queries/companies/perfom-delete-companies-actions-rights.query';

import { PerformContactsActionRightsQuery } from '../queries/contacts/perfom-contact-actions-rights.query';
import { PerformCreateContactsActionRightsQuery } from '../queries/contacts/perfom-create-contacts-actions-rights.query';
import { PerformDeleteContactsActionRightsQuery } from '../queries/contacts/perfom-delete-contacts-actions-rights.query';


import { PerformOpportunitiesActionRightsQuery } from '../queries/opportunities/perfom-opportunities-actions-rights.query';
import { PerformCreateOpportunitiesActionRightsQuery } from '../queries/opportunities/perfom-create-opportunities-actions-rights.query';
import { PerformDeleteOppsActionRightsQuery } from '../queries/opportunities/perfom-delete-opportunities-actions-rights.query';


import { PerformInvoicesActionRightsQuery } from '../queries/invoices/perfom-invoices-actions-rights.query';
import { PerformCreateInvoicesActionRightsQuery } from '../queries/invoices/perfom-create-invoices-actions-rights.query';
import { PerformDeleteInvoicesActionRightsQuery } from '../queries/invoices/perfom-delete-invoices-actions-rights.query';

import { PerformSettingsActionRightsQuery } from '../queries/settings/perfom-settings-actions-rights.query';

import { IAccessControlService } from './access-control-service.interface';
import { PerformSendInvoicesActionRightsQuery } from '../queries/invoices/perfom-send-invoices-actions-rights.query';
import { PerformEditCompaniesActionRightsQuery } from '../queries/companies/perfom-edit-companies-actions-rights.query';
import { PerformEditContactsActionRightsQuery } from '../queries/contacts/perfom-edit-contacts-actions-rights.query';
import { PerformEditOpportunitiesActionRightsQuery } from '../queries/opportunities/perfom-edit-opportunities-actions-rights.query';

import { PerformEditInvoicesActionRightsQuery } from '../queries/invoices/perfom-edit-invoices-actions-rights.query';

@Injectable({
  providedIn: 'root',
})
export class AccessControlMainService implements IAccessControlService {

  constructor(// base actions access
              private _baseActionAccess: PerformActionRightsQuery,
              private _createMembersActionsAccess: PerformCreateKujaliMembersActionRightsQuery,
              private _adminActionAccess: PerformAdminActionRightsQuery,
              private _superAdminActionAccess: PerformSuperAdminActionRightsQuery,

              //company actions rights
              private _companyActionsAccess: PerformCompanyActionRightsQuery,
              private _viewCompaniesActionsAccess: PerformCompaniesActionsViewRightsQuery,
              private _createCompaniesActionAccess: PerformCreateCompaniesActionRightsQuery,
              private _deleteCompaniesActionsAccess: PerformDeleteCompaniesActionRightsQuery,
              private _editCompaniesActionsAccess: PerformEditCompaniesActionRightsQuery,

              //contacts actions rights
              private _contactActionsAccess: PerformContactsActionRightsQuery,
              private _createContactsActionsAccess: PerformCreateContactsActionRightsQuery,
              private _deleteContactsActionsAccess: PerformDeleteContactsActionRightsQuery,
              private _editContactsActionsAccess: PerformEditContactsActionRightsQuery,

              // opps actions rights
              private _oppsActionsAccess: PerformOpportunitiesActionRightsQuery,
              private _createOppsActionsAccess: PerformCreateOpportunitiesActionRightsQuery,
              private _deleteOppsActionsAccess: PerformDeleteOppsActionRightsQuery,
              private _editOppsActionsAccess: PerformEditOpportunitiesActionRightsQuery,

              // invoices actions access
              private _invActionsAccess: PerformInvoicesActionRightsQuery,
              private _createInvoicesActionsAccess: PerformCreateInvoicesActionRightsQuery,
              private _deleteInvoicesActionsAccess: PerformDeleteInvoicesActionRightsQuery,
              private _editInvoicesActionsAccess: PerformEditInvoicesActionRightsQuery,
              private _sendInvoicesActionsAccess: PerformSendInvoicesActionRightsQuery,

              //settings actions access
              private _settingsActionsAccess: PerformSettingsActionRightsQuery
  ) {}

  getRights(claim: AppClaimDomains): Observable<AccessRights> {

    switch (claim) {
      //kujali admin claims
      case AppClaimDomains.superAdmin:
        return this._superAdminActionAccess.getRights();

      case AppClaimDomains.Admin:
        return this._adminActionAccess.getRights();

      //kujali domain claims
      case AppClaimDomains.CanAddMembers:
        return this._createMembersActionsAccess.getRights();

      case AppClaimDomains.ContactData:
        return this._contactActionsAccess.getRights();

      case AppClaimDomains.ContactEdit:
        return this._editContactsActionsAccess.getRights();

      case AppClaimDomains.CompanyData:
        return this._companyActionsAccess.getRights();

      case AppClaimDomains.CompanyEdit:
        return this._editCompaniesActionsAccess.getRights();

      case AppClaimDomains.OppsData:
        return this._oppsActionsAccess.getRights();

      case AppClaimDomains.OppsEdit:
        return this._editOppsActionsAccess.getRights();

      case AppClaimDomains.InvData:
        return this._invActionsAccess.getRights();

      case AppClaimDomains.SettingsData:
        return this._settingsActionsAccess.getRights();

      case AppClaimDomains.CompanyCreate:
        return this._createCompaniesActionAccess.getRights();

      case AppClaimDomains.ContactCreate:
        return this._createContactsActionsAccess.getRights();

      case AppClaimDomains.OppsCreate:
        return this._createOppsActionsAccess.getRights();

      case AppClaimDomains.InvCreate:
        return this._createInvoicesActionsAccess.getRights();

      case AppClaimDomains.InvSend:
        return this._sendInvoicesActionsAccess.getRights();

      case AppClaimDomains.CompanyActionsView:
        return this._viewCompaniesActionsAccess.getRights();

      case AppClaimDomains.CompanyDelete:
        return this._deleteCompaniesActionsAccess.getRights();

      case AppClaimDomains.ContactDelete:
        return this._deleteContactsActionsAccess.getRights();

      case AppClaimDomains.OppsDelete:
        return this._deleteOppsActionsAccess.getRights();

      case AppClaimDomains.InvDelete:
        return this._deleteInvoicesActionsAccess.getRights();

      case AppClaimDomains.InvEdit:
        return this._editInvoicesActionsAccess.getRights();

      default:
        return this._baseActionAccess.getRights();
    }
  }
}
