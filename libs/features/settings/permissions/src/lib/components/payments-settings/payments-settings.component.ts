import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kujali-payments-settings',
  templateUrl: './payments-settings.component.html',
  styleUrls: ['./payments-settings.component.scss'],
})
export class PaymentsSettingsComponent {
  @Input() paymentsSettingsFormGroup: FormGroup;
  @Input() roles: string[];
}
