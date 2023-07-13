import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kujali-accounts-settings',
  templateUrl: './accounts-settings.component.html',
  styleUrls: ['./accounts-settings.component.scss'],
})
export class AccountsSettingsComponent {

  @Input() accountsSettingsFormGroup: FormGroup;
  @Input() roles: string[];
}
