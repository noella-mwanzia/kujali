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
  selectedAccount: PontoAccount;

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
        tap(accs => {

          debugger
          if (accs.length === 1) {
            this.setSelectedAccount(accs[0]);
          }
        })
      )
      .subscribe();
  }

  getBankAccounts(params: Params, org: Organisation) {
    debugger

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

    debugger

    return this._afFunctions.httpsCallable('updatePontoConnection')(data);
  }

  setData(accounts: PontoAccount[]) {
    this.bankAccounts = accounts;
    this.loadingAccounts = false;
    if (this.bankAccounts.length > 0) {
      this.bankAccName = this.bankAccounts[0].sysAccName!;
    }
    debugger
  }

  setSelectedAccount(acc: PontoAccount) {

    let data = {
      orgId: this.orgId,
      newBankAccount: acc,
    }
    console.log(data);

    // this._dialog.open(ConfirmBankConDialogComponent, {
    //   width: '550px',
    //   height: '550px',
    //   position: { top: '20px'},
    //   data: {
    //     orgId: this.orgId,
    //     newBankAccount: acc,
    //   }
    // })
  }

  finalize() {
    this._router.navigate(['/accounting', this.orgId, 'transfers', 'currents']);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }

}
