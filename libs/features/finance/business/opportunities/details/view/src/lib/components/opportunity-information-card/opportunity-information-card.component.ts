import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { Opportunity } from '@app/model/finance/opportunities';

import { KujaliUsersService } from '@app/state/user';
import { ActiveOpportunityStore, OpportunitiesService } from '@app/state/finance/opportunities';

@Component({
  selector: 'opportunity-information-card',
  templateUrl: './opportunity-information-card.component.html',
  styleUrls: ['./opportunity-information-card.component.scss']
})
export class OpportunityInformationCardComponent implements OnInit {

  ops$: Observable<Opportunity>

  constructor(private _router$$: Router,
              private _ops$$: ActiveOpportunityStore,
              private _opppSService: OpportunitiesService,
              private _kujaliUsersService: KujaliUsersService
    ) { }

  ngOnInit(): void {
    this.ops$ = this._ops$$.get();
  }

  getDate (date) {
    return __DateFromStorage(date).format("DD/MM/YYYY");
  }

  getContactNames(id: string): string {
    return this._opppSService.getContactNames(id);
  }

  getCompanyNames(id: string): string {
    return this._opppSService.getCompanyNames(id);
  }

  getOrgUsers(userIds: string[]): string[] {
    let users = this._kujaliUsersService.getOrgUsers(userIds);
    return users;
  }

  navigateToEditPage(oppsId: string) {
    this._router$$.navigate(['business/opportunities', oppsId, 'edit'])
  }
}
