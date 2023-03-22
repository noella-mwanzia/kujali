import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest, map, switchMap, take } from 'rxjs';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';
import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';

import { SingleActionMessageModalComponent } from '@app/features/shared/components/modals';

import { CreateNewBankAccountModalComponent } from '../../modals/create-new-bank-account-modal/create-new-bank-account-modal.component';

import { ActivatePontoBankingService } from '../../services/activate-ponto-banking.service';
@Component({
  selector: 'app-banking-page',
  templateUrl: './banking-page.component.html',
  styleUrls: ['./banking-page.component.scss'],
})
export class BankingPageComponent {

  private _sbS = new SubSink();

  startPontoOnboarding = false;

  acc: FAccount;
  org: Organisation;

  isLoading: boolean = false;
  redirectUrl: string = '';

  accounts: any;

  constructor(private _dialog: MatDialog,
              private __userService: UserService<KuUser>,
              private _activeOrg: ActiveOrgStore,
              private _bankActivateService: ActivatePontoBankingService
  ) {}

  ngOnInit() {
    this.getOrgAndUserDetails();
  }

  getOrgAndUserDetails() {
    this._sbS.sink = combineLatest([this._activeOrg.get(), this.__userService.getUser()]).pipe(take(1)).subscribe(([org, user]) => {
      if (org && user) {
        this.org = org;
        this.accounts = org.bankingInfo.accounts;
      }
    })
  }

  connectToPonto(account: string) {
    this.isLoading = true;
    this.startPontoOnboarding = true;

    this.org = this.org;
    this.acc = this.accounts[account];

    let data = { org: this.org, acc: this.acc, isReconnect: false }

    this._sbS.sink = this.__userService.getUser()
                          .pipe(take(1),
                                switchMap((user) => this._bankActivateService.pontocreateOnboardingDetails(this.org, user)),
                                map((res) => { console.log(res);
                                 return this._bankActivateService.pontoConstructRedirectLink(data, this.org, this.acc,res)}))
                          .subscribe(url => {
                            this.redirectUrl = url;                                            
                            this.openPontoDialog();
                            this.isLoading = false;
                          });
  }

  openPontoDialog() {
    this._dialog.open(SingleActionMessageModalComponent, {
      data: {
        dialogTitle: 'Finish setup on Ponto',
        actionMessage: 'Click the button below to finish setting up your Ponto account.',
        actionUrl: this.redirectUrl,
      },
    });
  }

  addAnAccount() {
    this._dialog.open(CreateNewBankAccountModalComponent, {minWidth: '700px'})
                .afterClosed().subscribe((res) => {})
  }
}
