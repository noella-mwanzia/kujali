import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Organisation } from '@app/model/organisation';
import { AppClaimDomains } from '@app/model/access-control';

import { OrganisationService } from '@app/state/organisation';

// import { FileStorageService } from '@app/features/files';

import { UpdateCompanyLogoModalComponent } from '../update-company-logo-modal/update-company-logo-modal.component';

@Component({
  selector: 'company-data',
  templateUrl: './company-data.component.html',
  styleUrls: ['./company-data.component.scss']
})
export class CompanyDataComponent implements OnInit {

  activeOrg: Organisation;
  orgDataFormGroup: FormGroup;

  activeOrgLoaded: boolean;
  editOrg: boolean = false;

  readonly CAN_PERFOM_ADMIN_ACTIONS = AppClaimDomains.Admin;

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              // private _fileStorageService$$: FileStorageService,
              private _orgService$$: OrganisationService
  ) { }

  ngOnInit(): void {
    this.getActiveOrg();
  }

  getActiveOrg() {
    this._orgService$$.getActiveOrg().subscribe((org) => {
      if (org) {
        this.activeOrgLoaded = true;
        this.activeOrg = org;
        this.buildOrgDataFormGroup(org);
      }
    })
  }

  get bankAccounts(): FormArray {
    return this.orgDataFormGroup.get('bankAccounts') as FormArray;
  }

  buildOrgDataFormGroup(orgData: Organisation) {
    this.orgDataFormGroup = this._fb.group({
      id: [orgData.id],
      logoUrl: [orgData.logoUrl ?? ''],
      name: [orgData.name ?? ''],
      address: [orgData.address ?? ''],
      email: [orgData.email ?? ''],
      vatNo: [orgData.vatNo ?? ''],
      bankAccounts: this._fb.array([])
    })
    // this.addOrgBankAccounts(orgData.bankAccounts);
    this.orgDataFormGroup.disable();
  }

  addOrgBankAccounts(accounts: string[]) {
    if (accounts.length > 0) {
      accounts.forEach((account) => {
        this.bankAccounts.push(new FormControl(account));
      })
    }
  }

  editOrgProfile() {
    this.editOrg = !this.editOrg;
    if (this.editOrg) {
      this.orgDataFormGroup.enable();
    } else {
      this.updateOrg();
      this.orgDataFormGroup.disable();
    }
  }

  updateOrg() {
    let orgFormData = this.orgDataFormGroup.value;
    this._orgService$$.updateOrgDetails(orgFormData);
  }

  newCompanyLogo() {
    this._dialog.open(UpdateCompanyLogoModalComponent, {
      data: this.activeOrg}).afterClosed().subscribe();
  }

  removePhoto() {
    // this._fileStorageService$$.deleteSingleFile(this.activeOrg.logoUrl).subscribe();
    this.activeOrg.logoUrl = '';
    this._orgService$$.updateOrgDetails(this.activeOrg);
  }

  addBankAccount() {
    this.bankAccounts.push(new FormControl());
  }

  removeAccountNumber(accountIndex: number) {
    this.bankAccounts.removeAt(accountIndex);
  }
}
