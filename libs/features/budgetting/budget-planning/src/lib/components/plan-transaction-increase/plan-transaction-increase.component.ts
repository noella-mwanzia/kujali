import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
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
  @Input() frequency: number;
  @Input() hasIncrease: boolean;

  @Input() amountIncreaseRate: number;
  @Input() amountIncreaseConfig: 'percentage' | 'value' = 'percentage';
  @Input() xTimesAmountIncreaseInterval: number;

  @Input() unitIncreaseRate: number;
  @Input() unitIncreaseConfig: 'percentage' | 'value' = 'value';
  @Input() xTimesUnitIncreaseInterval: number;

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

  amountIncreaseFrequencyChanged(amountFreq: MatSelectChange) {
    this.amountIncreaseFrequency = amountFreq.value;
  }

  unitIncreaseFrequencyChanged(unitFreq: MatSelectChange) {
    this.unitIncreaseFrequency = unitFreq.value;
  }

  getTransactionFreaquency(frequency: number) {
    switch (frequency) {
      case -1:
        return 'Never';
      case 0:
        return 'Once';
      case 1:
        return 'Monthly';
      case 90:
        return 'Quarterly';
      case 365:
        return 'Yearly';
      case 999:
        return 'Every x times';
      default:
        return '';
    }
  }
}
