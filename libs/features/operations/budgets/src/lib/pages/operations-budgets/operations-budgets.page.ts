import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Organisation } from '@app/model/organisation';

import { OperationBudgetsQuery } from '@app/state/finance/budgetting/rendering';
import { ActiveOrgStore } from '@app/state/organisation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './operations-budgets.page.html',
  styleUrls: ['./operations-budgets.page.scss']
})
export class OperationsBudgetsPageComponent implements OnInit
{
  activeOrg: Organisation;

  monthlyOperationsLines$: Observable<any>;
  quaterlyOperationsLines$: Observable<any>;
  yeralyOperationsLines$: Observable<any>;

  constructor(private activeOrg$$: ActiveOrgStore,
              private operatiosLines$$: OperationBudgetsQuery
  ) 
  {}

  ngOnInit(): void {
    this.activeOrg$$.get().subscribe((org) => {
      if (org) {
        this.activeOrg = org
        // this.monthlyOperationsLines$ = this.operatiosLines$$.getLines(this.activeOrg.id!).pipe(map((lines) => lines.filter((li) => li.frequency == 1)));
        // this.quaterlyOperationsLines$ = this.operatiosLines$$.getLines(this.activeOrg.id!).pipe(map((lines) => lines.filter((li) => li.frequency == 90)));
        // this.yeralyOperationsLines$ = this.operatiosLines$$.getLines(this.activeOrg.id!).pipe(map((lines) => lines.filter((li) => li.frequency == 365)));
      }
    });
  }
  
}
