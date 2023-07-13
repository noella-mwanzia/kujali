import { AfterContentChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { SubSink } from 'subsink';

import { take } from 'rxjs/operators';
import { difference as __difference } from 'lodash';

import { Opportunity } from '@app/model/finance/opportunities';
import { KuUser } from '@app/model/common/user';

import { AppClaimDomains } from '@app/model/access-control';

import { OpportunitiesService } from '@app/state/finance/opportunities';
import { OrganisationService } from '@app/state/organisation';
import { PermissionsStateService } from '@app/state/organisation';

import { TagsFormFieldComponent } from '@app/elements/forms/form-fields';

import { OpportunitiesEditModel } from '../../model/opportunities-edit.model';
import { OpportunitiesEditModelService } from '../../services/opportunities-edit-model.service';

@Component({
  selector: 'opportunities-edit-page',
  templateUrl: './opportunities-edit-page.component.html',
  styleUrls: ['./opportunities-edit-page.component.scss']
})
export class OpportunitiesEditPageComponent implements OnInit, OnDestroy, AfterContentChecked {
  private _sbS = new SubSink();
  public opportunityEditModel: OpportunitiesEditModel;

  @ViewChild(TagsFormFieldComponent) tagsComponent: TagsFormFieldComponent;

  orgUsers: KuUser[];
  filteredUsers: KuUser[];

  oppsData: Opportunity;

  displayTags: string[] = [];

  canEditOpps: boolean;

  readonly CAN_DELETE_OPPS = AppClaimDomains.OppsDelete;
  readonly CAN_EDIT_OPPS = AppClaimDomains.OppsEdit;

  oppsTags: string[];

  constructor(private _opportunityEditModelService: OpportunitiesEditModelService,
              private _orgsService$$: OrganisationService,
              private _oppsService: OpportunitiesService,
              private _permissionsService: PermissionsStateService
  ) {}

  ngOnInit(): void {
    this._checkPermissions();
    this.opportunityEditModel = this._opportunityEditModelService.initModalState();
    this.opportunityEditModel.getFormData();
    this._getOrgUsers();
    this.getOppsTags();
 }

ngAfterContentChecked(){
  if (this.oppsTags && this.opportunityEditModel.pageDataHasLoaded) {
    this.tagsComponent.tags = this.oppsTags;
  }
}

 getOppsTags() {
  this._oppsService.getActiveOpportunity().subscribe((opps) => {
    if (opps) {
      this.oppsTags = opps.tags;
    }
  })
 }

  private _checkPermissions() {
    this._sbS.sink = this._permissionsService
      .checkAccessRight((p: any) => p.OpportunitiesSettings.CanEditOpportunities)
      .pipe(take(1))
      .subscribe((permissions) => {
        if (!permissions) {
          this.opportunityEditModel.opportunityForm.disable();
          this.canEditOpps = permissions;
          this._permissionsService.throwInsufficientPermissions();
          this.tagsComponent.canEdit = true;
        }
      });
  }

  companyChanged(company: MatSelectChange) {           
    let contacts = this.opportunityEditModel.contactList.filter((contact) => 
      contact.company == company.value
    );
    this.opportunityEditModel.filteredContactList = contacts;
  }

  private _getOrgUsers() {
    this._sbS.sink = this._orgsService$$.getOrgUsersDetails()
      .subscribe((users) => {
        this.orgUsers = users;
        this.filteredUsers = this.orgUsers.slice();
      });
  }

  updateOpps() {
    let opps = this.opportunityEditModel.opportunityForm.value;

    if (opps.company.id) {
      opps.company = opps.company.id;
    }
    if (opps.contact.id) {
      opps.contact = opps.contact.id;
    }    

    this._oppsService.updateOpps(this.opportunityEditModel.opportunityForm);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  deleteOpportunity(opps: Opportunity) {
    this._oppsService.deleteOpportunity(opps);
  }
  
  ngOnDestroy () {
    this._sbS.unsubscribe();
    this.opportunityEditModel.opportunityForm.reset();
    this._opportunityEditModelService.endModelState();
  }
}