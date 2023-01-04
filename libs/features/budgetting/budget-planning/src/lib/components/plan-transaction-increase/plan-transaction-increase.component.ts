import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { MatLegacySlideToggleChange as MatSlideToggleChange } from '@angular/material/legacy-slide-toggle';

import { BudgetItemFrequency } from '@app/model/finance/planning/budget-items';

@Component({
  selector: 'app-plan-transaction-increase',
  templateUrl: './plan-transaction-increase.component.html',
  styleUrls: ['../../shared/transaction-planner-form.style.scss', './plan-transaction-increase.component.scss'],
})
export class PlanTransactionIncreaseComponent implements OnInit
{
  // TODO Review (IAN <> JENTE)
  @Input() planTransactionIncreaseFormGroup: FormGroup;
  @Input() type!: 'cost' | 'income';

  // Occurence Frequency
  @Input() frequency: string;
  @Input() hasIncrease: boolean;

  @Input() amountIncreaseRate: number;
  @Input() amountIncreaseConfig: 'percentage' | 'value' = 'percentage';
  @Input() xTimesAmountIncreaseInterval: number;

  @Input() unitIncreaseRate: number;
  @Input() unitIncreaseConfig: 'percentage' | 'value' = 'value';
  @Input() xTimesUnitIncreaseInterval: number;

  // @Input() amountIncreaseFrequency: Frequency = 'never';
  // @Input() unitIncreaseFrequency: Frequency = 'never';

  amountIncreaseFrequency: number;
  unitIncreaseFrequency: number;

  constructor() { }

  ngOnInit() {
    this.hasIncrease = this.planTransactionIncreaseFormGroup.value.pTIncreaseFormGroup.hasIncrease;
  }

  hasIncreaseChanged(increase: MatSlideToggleChange) {
    this.hasIncrease = increase.checked;
  }

  amountIncConfigChanged(config: MatRadioChange) {
    this.amountIncreaseConfig = config.value;
  }

  unitIncConfigChanged(config: MatRadioChange) {
    this.unitIncreaseConfig = config.value;
  }

  amountIncreaseFrequencyChanged(amountFreq: MatRadioChange) {
    this.amountIncreaseFrequency = amountFreq.value;
  }

  unitIncreaseFrequencyChanged(unitFreq: MatRadioChange) {
    this.unitIncreaseFrequency = unitFreq.value;
  }

}
