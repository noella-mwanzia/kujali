import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { User } from '@iote/bricks';

import { Poppers } from '../../model/side-menu-popper.model';
import { slideToggle, slideUp } from '../../providers/side-menu-const.function';
import { FormControl } from '@angular/forms';
import { OrganisationService } from '@app/state/organisation';
import { Organisation } from '@app/model/organisation';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SideMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  private _sbS = new SubSink();

  @Input() user: User;

  FIRST_SUB_MENUS_BTN: NodeListOf<Element>;


  swicthOrg: FormControl = new FormControl('');

  userOrgs: Organisation[];
  organisation: Organisation;
  filteredOrgs: Organisation[];

  constructor(private _router$$: Router,
              private _orgsService: OrganisationService,
              @Inject('ENVIRONMENT') private _env: any)
  { }

  ngOnInit() {
    this.getOrganisationDetails();

    this._sbS.sink = this.getValueChanges(this.swicthOrg).subscribe();
  }

  ngAfterViewInit(): void {
    const featureName = this._router$$.url.split('/')[1];

    this.handlerUserNavClicks();
    this.openActiveFeature(featureName);
  }

  getValueChanges(formControl: FormControl) {
    return formControl.valueChanges.pipe();
  }

  getOrganisationDetails () {
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

  handlerUserNavClicks() {

    const PoppersInstance = new Poppers();
    const SIDEBAR_EL = document.getElementById("sidebar");
    this.FIRST_SUB_MENUS_BTN = document.querySelectorAll(
      ".menu > ul > .menu-item.sub-menu > a"
    );
    const INNER_SUB_MENUS_BTN = document.querySelectorAll(
      ".menu > ul > .menu-item.sub-menu .menu-item.sub-menu > a"
    );
    const defaultOpenMenus = document.querySelectorAll(".menu-item.sub-menu.open");

    defaultOpenMenus.forEach((element: any) => {
      element.lastElementChild.style.display = "block";
    });    

    /**
     * handle top level submenu click
     */
    this.FIRST_SUB_MENUS_BTN.forEach((element) => {
      element.addEventListener("click", () => {
        if (SIDEBAR_EL?.classList.contains("collapsed"))
          PoppersInstance.togglePopper(element.nextElementSibling);
        else {
          const parentMenu = element.closest(".menu.open-current-submenu");
          if (parentMenu)
            parentMenu
              .querySelectorAll(":scope > ul > .menu-item.sub-menu > a")
              .forEach(
                (el: any) =>
                  window.getComputedStyle(el.nextElementSibling).display !==
                  "none" && slideUp(el.nextElementSibling)
              );
          slideToggle(element.nextElementSibling);
        }
      });
    });

    /**
     * handle inner submenu click
     */
    INNER_SUB_MENUS_BTN.forEach((element) => {
      element.addEventListener("click", () => {
        slideToggle(element.nextElementSibling);
      });
    });
  }

  openActiveFeature(feature: string, ) {
    const features = ['dashboard', 'business', 'operations', 'budgets'];
    const featureIndex = features.indexOf(feature);
    const featureEl = this.FIRST_SUB_MENUS_BTN[featureIndex];
    slideToggle(featureEl.nextElementSibling);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}