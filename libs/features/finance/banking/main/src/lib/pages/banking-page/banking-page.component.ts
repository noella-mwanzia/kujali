import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest, map, switchMap, take, Observable, tap} from 'rxjs';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';
import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';
import { AccountsStateService } from '@app/state/finance/banking';

import { SingleActionMessageModalComponent } from '@app/features/shared/components/modals';

import { CreateNewBankAccountModalComponent } from '../../modals/create-new-bank-account-modal/create-new-bank-account-modal.component';

import { ActivatePontoBankingService } from '../../services/activate-ponto-banking.service';
@Component({
  selector: 'app-banking-page',
  templateUrl: './banking-page.component.html',
  styleUrls: ['./banking-page.component.scss'],
})

export class BankingPageComponent implements OnInit {

  private _sbS = new SubSink();

  startPontoOnboarding = false;

  org: Organisation;

  isLoading: boolean = false;
  redirectUrl: string = '';

  accounts$: Observable<FAccount[]>;

  constructor(private _dialog: MatDialog,
              private __userService: UserService<KuUser>,
              private _activeOrg: ActiveOrgStore,
              private _accontsState: AccountsStateService,
              private _bankActivateService: ActivatePontoBankingService
  ) {}

  ngOnInit() {
    this.accounts$ = this._accontsState.getFAccounts();
  }

  connectToPonto(account: FAccount) {
    this.isLoading = true;
    this.startPontoOnboarding = true;

    this.org = this.org;

    let data = { org: this.org, acc: account, isReconnect: false }

    this._sbS.sink = combineLatest([this._activeOrg.get(), this.__userService.getUser()])
                          .pipe(take(1),
                                tap(([org, user]) => {this.org = org}),
                                switchMap(([org, user]) => this._bankActivateService.pontocreateOnboardingDetails(org, user)),
                                map((res) => this._bankActivateService.pontoConstructRedirectLink(data, this.org, account, res)))
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
