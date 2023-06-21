import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kujali-opportunities-settings',
  templateUrl: './opportunities-settings.component.html',
  styleUrls: ['./opportunities-settings.component.scss']
})
export class OpportunitiesSettingsComponent implements OnInit {

  @Input() opportunitiesSettingsFormGroup: FormGroup;
  @Input() roles: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
