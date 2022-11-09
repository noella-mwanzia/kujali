import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Frequency } from '../../model/frequency.type';

@Component({
  selector: 'app-plan-transaction-increase',
  templateUrl: './plan-transaction-increase.component.html',
  styleUrls: ['../transaction-planner-form.style.scss', './plan-transaction-increase.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class PlanTransactionIncreaseComponent implements OnInit
{
  @Input() type: 'cost' | 'income';

  // Occurence Frequency
  @Input() frequency: Frequency;

  @Input() hasIncrease: boolean;

  @Input() amountIncreaseRate: number;
  @Input() amountIncreaseConfig: 'percentage' | 'value' = 'percentage';
  @Input() amountIncreaseFrequency: Frequency = 'never';
  @Input() xTimesAmountIncreaseInterval: number;

  @Input() unitIncreaseRate: number;
  @Input() unitIncreaseConfig: 'percentage' | 'value' = 'value';
  @Input() unitIncreaseFrequency: Frequency = 'never';
  @Input() xTimesUnitIncreaseInterval: number;

  constructor() { }

  ngOnInit() { }

}
