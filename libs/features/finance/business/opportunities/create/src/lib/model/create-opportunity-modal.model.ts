import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import { KuUser } from '@app/model/common/user';

import { OpportunitiesService } from '@app/state/finance/opportunities';
import { CompaniesStore } from '@app/state/finance/companies';

import {__CreateCompanyForm, __CreateContactForm, __CreateOpportunityForm,
} from './opportunity-forms.model';

/**
 * Whenever a modal is created, we use an object of this class to control it's state.
 *
 * When the modal closes, the object is deleted.
 */
export class CreateOpportunityModalModel {
  /** Mother form for creating opportunities */
  addNewOpportunityForm: FormGroup;
  orgUsers$: Observable<KuUser[]>;
  filteredUser$: Observable<KuUser[]>;

  /** Child form I  - Select/Create contact  */
  contactFormGroup: FormGroup;
  /** Child form II - Select/Create company  */
  companyFormGroup: FormGroup;

  /** Selected contact ID (on the select box) */
  selectedContactId$: Observable<string>;
  /** Selected company ID (on the select box) */
  selectedCompanyId$: Observable<string>;

  /**
   *
   * @param source Page on which the opportunity modal is loaded.
   */
  constructor(private _source: 'companies' | 'contacts',
              private _data: any,
              private _opportunities$$: OpportunitiesService,
              private _companies$$: CompaniesStore,
              _fb: FormBuilder
  ) {
    // 1) Init mother form
    this.addNewOpportunityForm = __CreateOpportunityForm(_fb);
    // this.orgUsers$ = this._initialiseOrgUsers(_org.id);
    // this.opportunityTags$ = this._initialiseTagControl();

    // 2) Init contact form
    this.contactFormGroup = __CreateContactForm(_fb);

    // 3) Init company form
    this.companyFormGroup = __CreateCompanyForm(_fb);


    if (_source === 'companies') {
      this._loadFromCompanyPage(_data);
    } else if (_source === 'contacts') {
      this._loadFromContactPage(_data);
    }

    this.selectedCompanyId$ =
    this.companyFormGroup.controls['company'].valueChanges.pipe(startWith(
      this.companyFormGroup.getRawValue().company.id ? this.companyFormGroup.getRawValue().company.id
                                                     :  this.companyFormGroup.getRawValue().company
    ));

    this.selectedContactId$ =
    this.contactFormGroup.controls['contact'].valueChanges;
  }

  _loadFromCompanyPage(data: any) {
    this.companyFormGroup.controls['company'].setValue(data);
    this.companyFormGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  _loadFromContactPage(data: any) {
    this.contactFormGroup.controls['contact'].setValue(data);
    if (data.company) {
      this.setCompany(data.company);
    }
  }

  setCompany(companyId: string) {
    this._companies$$.get().pipe(take(1))
      .subscribe((companies) => {
        let company = companies.filter((c) => {
          return c.id == companyId;
        })[0];
        this.companyFormGroup.controls['company'].setValue(company);
        this.companyFormGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      });
  }

  // --- SECTION CREATE -- //
  createOpportunity(orgId: string, tags: string[]) {
    const oppF = this.addNewOpportunityForm;
    if (oppF.valid) {
      if (this._source == 'companies') {
        oppF.value.company = this._data;
        oppF.value.contact = this.contactFormGroup.value.contact;
      } else if (this._source == 'contacts') {
        oppF.value.contact = this._data;
        oppF.value.company = this.companyFormGroup.value.company;
      }
      this._opportunities$$.submitOps(orgId, this.addNewOpportunityForm, tags, this.contactFormGroup, this.companyFormGroup);
    }
  }
}
