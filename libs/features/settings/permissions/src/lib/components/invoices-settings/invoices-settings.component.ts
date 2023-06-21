import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kujali-invoices-settings',
  templateUrl: './invoices-settings.component.html',
  styleUrls: ['./invoices-settings.component.scss']
})
export class InvoicesSettingsComponent implements OnInit {

  @Input() invoicesSettingsFormGroup: FormGroup;
  @Input() roles: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
