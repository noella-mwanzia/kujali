import { Component, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { Opportunity } from '@app/model/finance/opportunities';
import { ActiveOpportunityStore } from '@app/state/finance/opportunities';

@Component({
  selector: 'opportunity-details',
  templateUrl: './opportunity-details.component.html',
  styleUrls: ['./opportunity-details.component.scss']
})

export class OpportunityDetailsComponent implements OnInit {

  private _sbS = new SubSink();

  opps$: Observable<Opportunity>;

  opps: Opportunity;

  constructor(private _opps$$: ActiveOpportunityStore) 
  { }

  ngOnInit(): void {
    this.opps$ = this._opps$$.get()

    this._sbS.sink = this.opps$.subscribe(opps => {
      this.opps = opps
    })
  }

  getDate(date: any) : any {
    return __DateFromStorage(date).format('DD-MM-YYYY');
  }

}
