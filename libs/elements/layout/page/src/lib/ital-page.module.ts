import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSelectFilterModule } from 'mat-select-filter';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';
import { AccessControlModule } from '@app/elements/access-control';

import { UserMenuModule } from '@app/elements/layout/user-menu';

import { PageComponent } from './components/app-page/page.component';
import { NavbarComponent } from './components/app-navbar/navbar.component';
import { NavbarSideComponent } from './components/app-navbar-side/navbar-side.component';

import { SideNavContainerComponent } from './components/sidenav-container/nav-wrapper.component';
import { SideMenuFooterComponent } from './components/sidemenu-footer/sidemenu-footer.component';
import { SideMenuComponent } from './components/sidemenu/sidemenu.component';
import { SingleDetailInformationCardComponent } from './components/single-information-card/single-information-card.component';
import { SingleDetailInformationPageComponent } from './components/single-information-page/single-information-page.component';


/**
 *  Elewa Page Module. Shows an overview of the page.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MultiLangModule,
    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,

    MatSelectFilterModule,
    UserMenuModule,
    AccessControlModule
  ],

  declarations: [
    PageComponent,
    NavbarSideComponent,
    SideMenuComponent,
    NavbarComponent,
    SideNavContainerComponent,
    SideMenuFooterComponent,
    SingleDetailInformationCardComponent,
    SingleDetailInformationPageComponent
  ],

  providers: [],
  exports: [
    PageComponent, 
    NavbarComponent,
    SingleDetailInformationCardComponent,
    SingleDetailInformationPageComponent
  ],
})
export class iTalPageModule {}
