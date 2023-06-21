import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kujali-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit {

  @Input() companiesSettingsFormGroup: FormGroup;
  @Input() roles: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
