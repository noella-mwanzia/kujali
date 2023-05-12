import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { flatMap as __flatMap } from 'lodash'

import { __DateToStorage } from '@iote/time';
import { TranslateService } from '@ngfi/multi-lang';

import { OpportunityTypes } from '@app/model/finance/opportunities';

import { OpportunityTypesStore } from '@app/state/finance/opportunities';

import { _PhoneOrEmailValidator } from '@app/elements/forms/validators'
import { TagsFormFieldComponent } from '@app/elements/forms/form-fields';

import { CreateOpportunityModalStateService } from '../../services/create-opportunity-modal.state.service';
import { CreateOpportunityModalModel } from '../../model/create-opportunity-modal.model';
import { AddOpportunityModalData } from '../../model/add-opportunity-modal-data.model';

@Component({
  selector: 'add-new-opportunity',
  templateUrl: './add-new-opportunity.component.html',
  styleUrls: ['./add-new-opportunity.component.scss'],
})
export class AddNewOpportunityComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  @ViewChild(TagsFormFieldComponent) tagsComponent: TagsFormFieldComponent;

  public model: CreateOpportunityModalModel;

  opportunityTypes$: Observable<OpportunityTypes>;

  submitted: boolean;
  isLoaded = false;

  countryCode: any;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _state: CreateOpportunityModalStateService,
              private _router$$: Router,
              @Inject(MAT_DIALOG_DATA) private _data: AddOpportunityModalData,
              private _translateService: TranslateService,
              private _opportunityTypes$$: OpportunityTypesStore
  )
  {
    this.lang = this._translateService.initialise();
    this.opportunityTypes$ = this._opportunityTypes$$.get();
  }

  ngOnInit() 
  {
    const page = this._router$$.url.split('/')[1] as 'contacts' | 'companies';
    this.model = this._state.initModalState(page, this._data);
    this.isLoaded = true;
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  addNewOpportunity() {
    if(!this.submitted) {
      this.submitted = true;
      this._state.createOpportunity(this.tagsComponent.tags);
   }
  }

  onCountryChange = (country: any) => (this.countryCode = country.dialCode);

  ngOnDestroy() { 
    this._state.endModalState();
    this._sbS.unsubscribe();
  }
}