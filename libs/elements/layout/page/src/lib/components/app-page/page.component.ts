import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Breadcrumb } from '@iote/bricks-angular';

import { SideNavContainerComponent } from '../sidenav-container/nav-wrapper.component';
import { Router } from '@angular/router';
import { Organisation } from '@app/model/organisation';
import { FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { OrganisationService } from '@app/state/organisation';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  private _sbS = new SubSink();

  @Input() loading = false;
  @Input() backButton = false;
  @Input() breadcrumbs: Breadcrumb[];
  @Input() nomarg = false;
  @Input() noside = false;
  @Input() title: string;

  @ViewChild('page') page: ElementRef;

  @ViewChild(SideNavContainerComponent) sidnav: SideNavContainerComponent;

  swicthOrg: FormControl = new FormControl('');

  userOrgs: Organisation[];
  organisation: Organisation;
  filteredOrgs: Organisation[];

  constructor(private _router$$: Router, private _orgsService: OrganisationService) { }

  ngOnInit() {
    this.getOrganisationDetails();

    this._sbS.sink = this.getValueChanges(this.swicthOrg).subscribe();
  }

  getValueChanges(formControl: FormControl) {
    return formControl.valueChanges.pipe();
  }

  getOrganisationDetails() {
    this._sbS.sink = this._orgsService.getUserOrgDetails().subscribe(([activeOrg, userOrgs]) => {
      if (activeOrg && userOrgs) {
        this.userOrgs = userOrgs;
        this.organisation = userOrgs.filter((orgs) => { return orgs.id == activeOrg.id })[0];
        this.filteredOrgs = this.userOrgs.slice();
      }
    });
  }

  switchOrg(activeOrg: any) {
    this._orgsService.switchOrganisation(activeOrg.id);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  toggleSideNav() {
    this.sidnav.toggleSidemenu();
  }
}
