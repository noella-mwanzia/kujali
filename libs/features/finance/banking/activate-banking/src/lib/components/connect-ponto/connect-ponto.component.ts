import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SubSink } from 'subsink';
import { combineLatest, filter, map, of, startWith, switchMap, take, tap } from 'rxjs';

import { BackendService } from '@ngfi/angular';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { PontoAccount } from '@app/model/finance/banking/ponto';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';


@Component({
  selector: 'app-connect-ponto',
  templateUrl: './connect-ponto.component.html',
  styleUrls: ['./connect-ponto.component.scss'],
})
export class ConnectPontoComponent implements OnInit {

  private _sbS = new SubSink();

  orgId: string;
  loadingAccounts = true;

  bankAccName: string;

  bankAccounts: PontoAccount[];

  newRenderAccounts: any[];

  selectedAccount: PontoAccount;

  activeAccount: ActiveAccount;

  settingBankAccount: boolean = false;

  accs: any;

  constructor(private _afFunctions: AngularFireFunctions,
              private _route: ActivatedRoute,
              private _router: Router,
              private _dialog: MatDialog,
              private _activeOrg$$: ActiveOrgStore,

              @Inject('ENVIRONMENT') private _env: any,
  ) { }

  ngOnInit() {
    const activeOrg$ = this._activeOrg$$.get().pipe(startWith());

    this._sbS.sink = combineLatest([this._route.queryParams, activeOrg$])
      .pipe(
        take(2),
        switchMap(([params, prop]) => this.getBankAccounts(params, prop)!),
        filter((val) => !!val),
        tap((accounts: any) => this.setData(accounts)),
        tap(() => this.loadingAccounts = false),
        tap(accs => {this.accs = accs})
      )
      .subscribe();
  }

  getBankAccounts(params: Params, org: Organisation) {

    const accountDetails = params['state'].split('>');
    this.orgId = accountDetails[0];

    if (params['error']) {
      this.finalize();
      return;
    }

    if (!org?.id) {
      this._router.navigate(['/accounting', this.orgId, 'ponto-landing'], { queryParams: params });
      return of(null);
    }

    const data = {
      authCode: params['code'],
      orgId: accountDetails[0],
      accountId: accountDetails[1].split(' ').join(''),
      accountName: accountDetails[2],
      redirectUrl: 'http://localhost:4200/operations/banking/connect-ponto'
    }


    if (accountDetails[3] === 'reconnect') {
      return this._afFunctions.httpsCallable('reinstatePontoAccess')(data)
        .pipe(map(() => this.finalize()));
    }


    return this._afFunctions.httpsCallable('updatePontoConnection')(data);
  }

  setData(accounts: PontoAccount[]) {
    this.bankAccounts = accounts;
    this.loadingAccounts = false;
    if (this.bankAccounts.length > 0) {
      this.bankAccName = this.bankAccounts[0].sysAccName!;
    }

    this.newRenderAccounts = this.bankAccounts.map((acc) => {return {...acc, displayData: this.createBankAccoutObject(acc)}});
  }

  setSelectedAccount(selectedAcc: PontoAccount) {
    // if (this.accs.length === 1) {
    //   this.setSelectedAccount(this.accs[0]);
    // }
    
    this.settingBankAccount = true;
    delete selectedAcc['displayData'];

    let data = {
      orgId: this.orgId,
      newBankAccount: selectedAcc,
    }

    this.confirmBankConnection(data);
  }

    //Confirm account user is selecting to connect the transactions
    confirmBankConnection(data: any)
    {
      // this.isConnecting = true;

      this._sbS.sink = this._afFunctions.httpsCallable('setSelectedBankAccount')(data)
                                           .subscribe(()=> this.finalize());
    }

  finalize() {
    this.settingBankAccount = false;
    this._router.navigate(['operations/banking']);
  }

  createBankAccoutObject(acc: any): ActiveAccount {
    this.activeAccount = acc['originalAccountInstance']['attributes'];
    return this.activeAccount;
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }

}

interface ActiveAccount extends PontoAccount {
  displayData: D;
}

interface D {
  authorizationExpirationExpectedAt : string,
  authorizedAt : string,
  availableBalance : number,
  availableBalanceChangedAt: string,
  availableBalanceReferenceDate : string,
  availableBalanceVariationObservedAt : string,
  currency : string,
  currentBalance : number,
  currentBalanceChangedAt : string,
  currentBalanceReferenceDate : string,
  currentBalanceVariationObservedAt : string,
  deprecated : boolean,
  description : string,
  holderName : string,
  internalReference : string,
  product: string,
  reference : string,
  referenceType : string,
  subtype : string
}
