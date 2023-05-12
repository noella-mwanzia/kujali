import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';
import { intersection as ___intersection, map as ___map, flatMap } from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { KuUser } from '@app/model/common/user';
import { Company } from '@app/model/finance/companies';
import { Contact } from '@app/model/finance/contacts';
import { Opportunity } from '@app/model/finance/opportunities';

import { OpportunitiesService } from '@app/state/finance/opportunities';
import { KujaliUsersService } from '@app/state/user';

import { OpportunitiesFilter, __NullOpportunityFilter } from './opportunities-filter.interface';

@Component({
  selector: 'kujali-opportunities-filter',
  templateUrl: './opportunities-filter.component.html',
  styleUrls: ['./opportunities-filter.component.scss']
})

export class OpportunitiesFilterComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  @Output() filterChanged = new EventEmitter<(Opps) => boolean>();

  filter: OpportunitiesFilter = __NullOpportunityFilter();

  contact$: Observable<Contact[]>;
  companies$: Observable<Company[]>;

  filterForm: FormGroup;

  assingToControl = new FormControl();
  companyControl = new FormControl();
  contactControl = new FormControl();
  typesControl = new FormControl();
  statusControl = new FormControl();
  tagsControl = new FormControl();
  searchControl = new FormControl();

  assingTo: any[];
  types: any[];
  status: any[];
  tags: any[];
  searchText: any;

  contactList: any[];
  filteredcontactsList: any[];
  assingToNames: KuUser[];
  filteredAssingToNames: KuUser[];
  tagsList: string[];
  filteredTagsList: string[];
  companiesList: Company[];
  filteredCompaniesList: Company[];

  typesList: Set<string>;
  statusList: Set<string>;

  companies: string[];
  contacts: string[];
  deadline: string;

  filterCount: number = 0;

  lang: 'fr' | 'en' | 'nl';
  sortby = 'year'

  constructor(private _translateService: TranslateService,
              private _oppsService: OpportunitiesService,
              private _kujaliUserService: KujaliUsersService
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this.getOpportunities();
    this.controlDataFetch();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getOpportunities() {
    this._sbS.sink = this._oppsService.getCompanyAndContactsList().subscribe(
      ([opps, companies, contacts]) => {
        let companyNames = opps.map((opps) => opps.company!);
        this.companiesList = companies.filter(company => companyNames.includes(company.id!));
        this.filteredCompaniesList = this.companiesList.slice();

        let contactsNames = opps.map((opps) => opps.contact!);
        this.contactList = contacts.map(c => ({ ...c, fullName: `${c.fName} ${c.lName}` }));
        this.contactList = this.contactList.filter(contacts => contactsNames.includes(contacts.id!));
        this.filteredcontactsList = this.contactList.slice();

        let assignedUsers = this.flattenArray(opps, 'assignTo');
        assignedUsers = Array.from(assignedUsers.values());
        this.assingToNames = this._kujaliUserService.getOrgUsersProperties(assignedUsers);
        this.filteredAssingToNames = this.assingToNames.slice();

        this.tagsList = this.flattenArray(opps, 'tags');
        this.tagsList = Array.from(this.tagsList.values());
        this.filteredTagsList = this.tagsList.slice();

        this.statusList = this.flattenArray(opps, 'status');
        this.typesList = this.flattenArray(opps, 'type');
      }
    )
  }

  controlDataFetch() {
    this._sbS.sink = this.getValueChanges(this.assingToControl).subscribe(cs => { this.assingTo = cs; this._rfc() });
    this._sbS.sink = this.getValueChanges(this.typesControl).subscribe(cs => { this.types = cs; this._rfc() });
    this._sbS.sink = this.getValueChanges(this.statusControl).subscribe(cs => { this.status = cs; this._rfc() });
    this._sbS.sink = this.getValueChanges(this.companyControl).subscribe(cs => { this.companies = cs; this._rfc() });
    this._sbS.sink = this.getValueChanges(this.contactControl).subscribe(cs => { this.contacts = cs; this._rfc() });
    this._sbS.sink = this.getValueChanges(this.tagsControl).subscribe(cs => { this.tags = cs; this._rfc() });

    this._sbS.sink = this.searchControl.valueChanges.subscribe(cs => { this.searchText = cs; this._rfc() });
  }

  sortBy(dateSortValue: string) {
    this.deadline = dateSortValue
    this._rfc()
  }

  /** rfc - Resolve filter change */
  private _rfc() {
    const model: OpportunitiesFilter = {
      allowedAssigned: this.assingTo ?? [],
      allowedTypes: this.types ?? [],
      allowedCompanies: this.companies ?? [],
      allowedContacts: this.contacts ?? [],
      allowedDeadline: this.deadline ?? '',
      allowedStatus: this.status ?? [],
      allowedTags: this.tags ?? [],
      search: this.searchText ?? '',

      isFiltered: false,
    }

    model.isFiltered = model.allowedAssigned.length > 0 || model.allowedTypes.length > 0 ||
      model.allowedTags.length > 0 || model.search.length > 0;

    this.filter = model;
    this.filterCount = model.allowedAssigned.length + model.allowedTypes.length + model.allowedTags.length +
      model.allowedCompanies.length + model.allowedContacts.length + model.allowedStatus.length 
      + (model.allowedDeadline ? 1 : 0)
    this.filterChanged.emit((c: Opportunity) => this._companyAppliesToFilter(c));
  }

  /** Filter is an AND filter across the different selected filter categories. 
   *    If one of the filters fails, the whole filter must fail. */
  private _companyAppliesToFilter(c: Opportunity): boolean {
    const f = this.filter;

    if (f.allowedAssigned.length > 0 && !(___intersection(f.allowedAssigned, c.assignTo).length > 0))
      return false;
    if (f.allowedTypes.length > 0 && !f.allowedTypes.find(fc => fc === c.type))
      return false;
    if (f.allowedCompanies.length > 0 && !f.allowedCompanies.find(fc => fc === c.company))
      return false;
    if (f.allowedContacts.length > 0 && !f.allowedContacts.find(fc => fc === c.contact))
      return false;
    if (f.allowedStatus.length > 0 && !f.allowedStatus.find(fc => fc === c.status))
      return false;
    if (f.allowedDeadline == 'past' && !(moment(this.getMomentdate(c.deadline)).isBefore(moment())))
      return false;
    if ((f.allowedDeadline != 'past' && f.allowedDeadline != '') && !((moment(this.getMomentdate(c.deadline)).isSame(new Date(), f.allowedDeadline))))
      return false;
    if (f.allowedTags.length > 0 && !(___intersection(f.allowedTags, c.tags).length > 0))
      return false;
    if (f.search
      && !(`${c.title}_${c.assignTo}_${c.tags}_${c.company}_${c.contact}_${c.deadline}_${c.status}`.toLowerCase()
        .indexOf(f.search.toLowerCase()) >= 0))
      return false;

    // If it made it through all the filters, we are good and the object is allowed :) :)
    // If we cannot prove the object is not a good record, it MUST be a good record.
    return true;
  }

  getMomentdate = (value: any) => { return value.seconds * 1000 }

  flattenArray = (opps: Opportunity[], fieldName: string): any => { return new Set(flatMap(opps, fieldName)) }

  getValueChanges = (formControl: FormControl) => { return formControl.valueChanges.pipe(map(v => { return [...v] })) }

  patchListControl = (control: FormControl) => { control.patchValue([]) }

  clearFIlters() {
    const controls = [this.assingToControl, this.typesControl, this.companyControl, this.contactControl, this.statusControl, this.tagsControl]
    controls.forEach(control => {
      this.patchListControl(control)
    });

    this.searchControl.patchValue('')
    this.assingTo = this.contacts = this.companies = this.status = this.types = this.tags = [];
    this.searchText = this.deadline = this.sortby = '';
    this._rfc()
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}