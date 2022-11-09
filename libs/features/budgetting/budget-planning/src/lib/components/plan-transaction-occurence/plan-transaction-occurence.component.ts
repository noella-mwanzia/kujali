import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Frequency } from '../../model/frequency.type';

import { YEARS, MONTHS } from '@elewa/portal-shared';

@Component({
  selector: 'app-plan-transaction-occurence',
  templateUrl: './plan-transaction-occurence.component.html',
  styleUrls: ['../transaction-planner-form.style.scss', './plan-transaction-occurence.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class PlanTransactionOccurenceComponent implements OnInit {

  @Input() type: 'cost' | 'income';

  years  = YEARS;
  months = MONTHS;

  @Input() yearFrom = 2020;
  @Input() monthFromPassed: number;
  @Input() monthFrom = this.months[0];
  @Input() frequency: Frequency = 'once'; 

  constructor() { }

  ngOnInit() {
    if (this.monthFromPassed)
      this.monthFrom = this.months[this.monthFromPassed - 1];
  }

}
