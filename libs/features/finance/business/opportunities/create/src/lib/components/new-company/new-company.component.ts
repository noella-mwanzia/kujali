import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';

import { sortBy as __sortyBy } from 'lodash';

import { AppClaimDomains } from '@app/model/access-control';
import { Company } from '@app/model/finance/companies';

import { CompaniesStore } from '@app/state/finance/companies';

@Component({
  selector: 'new-company',
  templateUrl: './new-company.component.html',
  styleUrls: ['./new-company.component.scss']
})

export class NewCompanyComponent implements OnInit {
  private _sbS = new SubSink();

  @Input() companyFormGroup: FormGroup;
  @Input() activeContact: Observable<any>;

  companyList: Company[];
  filteredCompanies :  any;

  isCompanyFilled: boolean;
  showCompany: boolean;

  readonly CAN_CREATE_COMPANIES = AppClaimDomains.CompanyCreate;

  constructor(private _router$$: Router,
              private _companies$$ : CompaniesStore
  ) { }

  ngOnInit(): void {
    const page = this._router$$.url.split('/')[1];

    page == 'companies' ? this.isCompanyFilled = true : false;

    this.getCompanies();
  }


  getCompanies() {
    this._sbS.sink = this._companies$$.get().subscribe((companies) => {
      if (companies) {
        this.companyList = __sortyBy(companies, ['name']);
        this.filteredCompanies = this.companyList.slice();
      }
    });
  }

  displayCompanyFn(company: Company): string {
    return company && company.name ? company.name : '';
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  toggleCompany() {
    this.showCompany = !this.showCompany
  }
}
