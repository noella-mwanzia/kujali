import { Component } from '@angular/core';
import { Router } from '@angular/router'

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngfi/multi-lang';

import { Contact } from '@app/model/finance/contacts';
import { ActiveContactStore } from '@app/state/finance/contacts';
import { OpportunitiesService } from '@app/state/finance/opportunities';

// import { PermissionsStateService } from '@app/state/organisation';


@Component({
  selector: 'contact-information-card',
  templateUrl: './contact-information-card.component.html',
  styleUrls: ['./contact-information-card.component.scss']
})
export class ContactInformationCardComponent {

  contact$: Observable<Contact>;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _translateService: TranslateService,
              // private _permissionsService: PermissionsStateService,
              private _contact$$: ActiveContactStore,
              private _oppsService: OpportunitiesService,
              private _router: Router
  ) 
  {
    this.contact$ = this._contact$$.get();
    this.lang = this._translateService.initialise();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getCompanyNames(id: string): string {
    return this._oppsService.getCompanyNames(id);
  }

  goToCompany(companyId: string) {
    // this._permissionsService
    //   .checkAccessRight(
    //     (p: any) => p.CompanySettings.CanViewCompanies
    //   )
    //   .pipe(take(1))
    //   .subscribe((permissions) => {
    //     if (permissions == true) {
    //       this._router.navigate(['companies', companyId]);
    //     }
    //   });
  }

  goToEdit(contactId: string) {
    if (contactId){
      this._router.navigate(['contacts', contactId, 'edit']);
    }
  }
}
