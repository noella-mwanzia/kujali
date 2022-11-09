import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
  selector: 'app-plan-transaction-value-derivative',
  templateUrl: './plan-transaction-value-derivative.component.html',
  styleUrls: ['../transaction-planner-form.style.scss', ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
/**
 * Component that configures the value of a transaction following the derivative strategy.
 */
export class PlanTransactionValueDerivativeComponent
{
  @Input() type: string;
  @Input() viewType: string;

  constructor() { }
}
