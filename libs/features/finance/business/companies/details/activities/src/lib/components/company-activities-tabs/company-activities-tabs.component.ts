import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { TranslateService } from '@ngfi/multi-lang';

import { AppClaimDomains } from '@app/model/access-control';

import { CheckPermissionsService } from '../../services/check-permissions.service';


@Component({
  selector: 'companies-activities-tabs',
  templateUrl: './company-activities-tabs.component.html',
  styleUrls: ['./company-activities-tabs.component.scss']
})
export class CompaniesActivitiesTabsComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  contactsLen: string;
  oppsLen: string;
  quotesLen: string;
  ordersLen: string;
  invoicesLen: string;

  lang: 'fr' | 'en' | 'nl';

  canViewActions: Observable<boolean>;
  canViewOpps: Observable<boolean>;
  canViewInvoices: Observable<boolean>;
  canViewContacts: Observable<boolean>;

  permissionsChecked: boolean;

  readonly CAN_VIEW_COMMPANY_ACTIONS = AppClaimDomains.CompanyActionsView;

  constructor(private _router$$: Router,
              private _translateService: TranslateService,
              private _permissionsService: CheckPermissionsService
              
  ) { 

  }

  ngOnInit() {
    this.lang = this._translateService.initialise();

    this.canViewActions = this._permissionsService.checkActionsPermissions();
    this.canViewOpps = this._permissionsService.checkOppsPermissions();
    this.canViewInvoices = this._permissionsService.checkInvoicesPermissions();
    this.canViewContacts = this._permissionsService._checkContactsPermissions()
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }
  
  getContactLen(value: string) {
    this.contactsLen = 'contacts ' + `(${value})`;
  }

  getOppsLen(value: string) {
    this.oppsLen = 'opportunities ' + `(${value})`;
  }

  getQuotesLen(value: string) {
    this.quotesLen = 'quotes ' + `(${value})`;
  }
  getOrdersLen(value: string) {
    this.ordersLen = 'orders ' + `(${value})`;
  }
  getInvoicesLen(value: string) {
    this.invoicesLen = 'invoices ' + `(${value})`;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
