import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-plan-transaction-value-base-amount',
  templateUrl: './plan-transaction-value-base-amount.component.html',
  styleUrls: ['../../shared/transaction-planner-form.style.scss', ],
})
/**
 * Component that configures the value of a transaction following the base-amount strategy.
 */
export class PlanTransactionValueBaseAmountComponent
{

  @Input() planTransactionValueBaseAmountFormGroup: FormGroup;

  @Input() amount: number = 0;
  @Input() units: number = 1;

  @Input() type: 'amount' | 'units';
  @Input() viewType: string;

  formControl: string;
  
  constructor() {}

}
