import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { TranslateService } from '@ngfi/multi-lang';

import { KuUser } from '@app/model/common/user';
import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/state/organisation';
import { UserStore } from '@app/state/user';

@Component({
  selector: 'kujali-org-page',
  templateUrl: './orgs-pages.component.html',
  styleUrls: ['./orgs-pages.component.scss']
})

export class OrgsPagesComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  orgFormGroup: FormGroup;

  user$: Observable<KuUser>;
  organisation: Organisation;

  activeOrg: FormControl = new FormControl();

  orgsList: string[];
  creatingOrg: boolean;

  lang: 'en' | 'fr' | 'nl'

  constructor(private _router$$: Router,
              private _fb: FormBuilder,
              private _translateService: TranslateService,
              private _userService$$: UserStore,
              private _orgService: OrganisationService
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this.user$ = this._userService$$.getUser();
    this._checkUserOrg();
    this.buildOrgForm();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  private _checkUserOrg(){
    this._sbS.sink = this.user$.subscribe((user) => {
      if (user.profile.activeOrg && user.profile.activeOrg != '') {
        this._router$$.navigate(['/home']);
      }
    })
  }

  buildOrgForm() {
    this.orgFormGroup = this._fb.group({
      name: ['', Validators.required],
      vatNo: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    })
  }

  createNewOrg() {
    this.creatingOrg = true;
    try {
      this._orgService.createOrg(this.orgFormGroup.value as Organisation);
    } catch (error) {
      throw error
    }
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
