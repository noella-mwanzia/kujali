import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kujali-expenses-settings',
  templateUrl: './expenses-settings.component.html',
  styleUrls: ['./expenses-settings.component.scss'],
})
export class ExpensesSettingsComponent {
  @Input() expensesSettingsFormGroup: FormGroup;
  @Input() roles: string[];
}
