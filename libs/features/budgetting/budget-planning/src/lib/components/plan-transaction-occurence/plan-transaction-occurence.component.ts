import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

import { BudgetItemFrequency } from '@app/model/finance/planning/budget-items';
import { YEARS, MONTHS } from '@app/model/finance/planning/time';

@Component({
  selector: 'app-plan-transaction-occurence',
  templateUrl: './plan-transaction-occurence.component.html',
  styleUrls: ['../../shared/transaction-planner-form.style.scss', './plan-transaction-occurence.component.scss'],
})
export class PlanTransactionOccurenceComponent implements OnInit {

  years  = YEARS;
  months = MONTHS;

  @Input() planTransactionOccurenceFormGroup: FormGroup;
  @Input() type!: 'cost' | 'income';

  @Input() yearFrom = 2020;
  @Input() monthFromPassed: number;
  @Input() monthFrom = this.months[0];
  @Input() frequency: string = 'Once'; 

  xTimesInterval: number;
  
  constructor() { }

  ngOnInit() {
    if (this.monthFromPassed)
      this.monthFrom = this.months[this.monthFromPassed - 1];
  }

  frequencyChanged(frequency: MatRadioChange) {
    this.frequency = frequency.value;
  }
}
