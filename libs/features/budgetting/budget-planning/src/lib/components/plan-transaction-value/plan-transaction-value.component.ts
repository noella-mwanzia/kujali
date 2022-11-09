import { Component } from '@angular/core';

import { ControlContainer, NgForm } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-plan-transaction-value',
  templateUrl: './plan-transaction-value.component.html',
  styleUrls: ['./plan-transaction-value.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class PlanTransactionValueComponent
{
  derivative: boolean = false;
  type;

  constructor() { }

  toggleAmountConfig()
  {
    this.derivative = true;
  }

}
