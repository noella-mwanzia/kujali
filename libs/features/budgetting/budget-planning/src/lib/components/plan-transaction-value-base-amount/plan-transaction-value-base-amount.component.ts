import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
  selector: 'app-plan-transaction-value-base-amount',
  templateUrl: './plan-transaction-value-base-amount.component.html',
  styleUrls: ['../transaction-planner-form.style.scss', ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
/**
 * Component that configures the value of a transaction following the base-amount strategy.
 */
export class PlanTransactionValueBaseAmountComponent
{
  @Input() amount: number = 0;
  @Input() units: number = 1;

  @Input() type: 'amount' | 'units';
  @Input() viewType: string;
  
  constructor() { }

}
