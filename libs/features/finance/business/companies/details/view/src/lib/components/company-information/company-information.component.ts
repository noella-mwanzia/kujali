import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TranslateService } from '@ngfi/multi-lang';

import { Company } from '@app/model/finance/companies';

import { ActiveCompanyStore } from '@app/state/finance/companies';

@Component({
  selector: 'company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss']
})
export class CompanyInformationComponent implements OnInit {

  company$: Observable<Company>;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _translateService: TranslateService,
              private _company$$: ActiveCompanyStore,
              private _router$$: Router
  )
  { }

  ngOnInit(): void {
    this.company$ = this._company$$.get();
    this.lang = this._translateService.initialise();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  goToEditPage(companyId){
    this._router$$.navigate(['business/companies', companyId, 'edit'])
  }
}
