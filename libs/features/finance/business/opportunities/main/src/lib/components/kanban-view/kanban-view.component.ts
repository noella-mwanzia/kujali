import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { SubSink } from 'subsink';
import { combineLatest, Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { startWith } from 'rxjs/operators';

import { uniq as __uniq } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Opportunity, OpportunityTypes, TypeLabel } from '@app/model/finance/opportunities';
import { Contact } from '@app/model/finance/contacts';
import { Company } from '@app/model/finance/companies';
import { KuUser } from '@app/model/common/user';

import { OpportunitiesService, OpportunitiesStore, OpportunityTypesStore } from '@app/state/finance/opportunities';
import { KujaliUsersService } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';

const DATA: Opportunity[] = []

@Component({
  selector: 'kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrls: ['./kanban-view.component.scss']
})
export class KanbanViewComponent implements OnInit {

  @Input() filter$$: Observable<any>;
  
  dataSource = new MatTableDataSource(DATA);

  private _sbS = new SubSink();

  contacts$: Observable<Contact[]>
  companies$: Observable<Company[]>

  contactId: string;
  companyId: string;

  newOpportunityList: Opportunity[];
  inProgressOpsList: Opportunity[];
  wonOpsList: Opportunity[];
  lostOpsList: Opportunity[];

  opportunity: Opportunity;
  allTableData: Opportunity[];

  oppsTypes: TypeLabel[];

  colorsArray = {};

  pageDataLoaded: boolean = false;

  constructor(private _router$$: Router,
              private _ops$$: OpportunitiesStore,
              private _oppsService: OpportunitiesService,
              private _kujaliUsersService: KujaliUsersService,
              private _permissionsService: PermissionsStateService,
              private _oppstypes$$: OpportunityTypesStore
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData () {
    this._sbS.sink = combineLatest([this.filter$$.pipe(startWith((Opps) => true)), this._oppsService.getOpportunities(),
                                    this._oppstypes$$.get()])
    .subscribe(([filter, cs, oppsT]) => {
      const filterRecords = cs.filter(filter);
      this.dataSource.data = filterRecords;
      this.allTableData = this.dataSource.data

      this.oppsTypes = oppsT.labels;

      this.assignOppsToCards();
    });
  }

  assignOppsToCards() {
    this.newOpportunityList = this.allTableData.filter((ops) => { return ops ? ops.status == 'New' : null })!
    this.inProgressOpsList = this.allTableData.filter((ops) => { return ops ? ops.status == 'In progress' : null })!
    this.wonOpsList = this.allTableData.filter((ops) => { return ops ? ops.status == 'Won' : null })!
    this.lostOpsList = this.allTableData.filter((ops) => { return ops ? ops.status == 'Lost' : null })!

    // this.generateColors();
    this.pageDataLoaded = true;
  }

  getOppsAssignedTo(userIds : string[]) : KuUser[] {    
    let users = this._kujaliUsersService.getOrgUsersProperties(userIds);    
    return users;
  }

  getInitials(assignTo): string {
    let initials : any = assignTo
    let firstInitial = initials.toString().split(' ')[0];
    let secondInitial = initials.toString().split(' ')[1];

    return firstInitial?.charAt(0) + secondInitial?.charAt(0); 
  }

  drop(event: CdkDragDrop<any[]>, cardNo?) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const id = cardNo
      this.opportunity = event.container.data[0]

      if (id == '0') {
        this.opportunity.status = 'New'
        this.updateCard(this.opportunity)
      }
      else if (id == '1') {
        this.opportunity.status = 'In progress'
        this.updateCard(this.opportunity)
      }
      else if (id == '2') {
        this.opportunity.status = 'Won'
        this.updateCard(this.opportunity)
      }
      else if (id == '3') {
        this.opportunity.status = 'Lost'
        this.updateCard(this.opportunity)
      }

    }
  }

  updateCard(opps: Opportunity) {
    this._sbS.sink = this._ops$$.update(opps).subscribe((c) => {
      (opps = c);
    });
  }

  getDate(activityDate) {
    return __DateFromStorage(activityDate).format('DD/MM/YYYY');
  }

  getContactName(id: string): string {
    return this._oppsService.getContactNames(id);
  }

  getCompanyName(id: string): string {
    return this._oppsService.getCompanyNames(id);
  }

  goToOpps(oppsId: string) {
    this._router$$.navigate(['opportunities', oppsId]);
  }

  goToCompany(companyId: string) {
    if (companyId) {
      this._permissionsService
      .checkAccessRight((p: any) => p.CompanySettings.CanViewCompanies)
      .pipe(take(1))
      .subscribe((permissions) => {
        if (permissions == true) {
          this._router$$.navigate(['companies', companyId]);
        }
      });
    }
  }

  goToContact(contactId: string) {
    if (contactId) {
      this._permissionsService
      .checkAccessRight((p: any) => p.ContactsSettings.CanViewContacts)
      .pipe(take(1))
      .subscribe((permissions) => {
        if (permissions == true) {
          this._router$$.navigate(['contacts', contactId]);
        }
      });
    }
  }

  generateColors(label: string) {
    let color = this.oppsTypes.find((color) => color.label == label)?.color;
    return color ? color : 'var(--kujali-color-primary-blue)';
  }
}
