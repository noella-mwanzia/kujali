import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kujali-budgets-settings',
  templateUrl: './budgets-settings.component.html',
  styleUrls: ['./budgets-settings.component.scss'],
})
export class BudgetsSettingsComponent {
  @Input() budgetsSettingsFormGroup: FormGroup;
  @Input() roles: string[];
}
