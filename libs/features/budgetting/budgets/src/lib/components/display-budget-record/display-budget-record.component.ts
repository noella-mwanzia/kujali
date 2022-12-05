import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Budget, BudgetRecord } from '@app/model/finance/planning/budgets';

import { CreateBudgetModalComponent } from '../create-budget-modal/create-budget-modal.component';
import { ShareBudgetModalComponent }  from '../share-budget-modal/share-budget-modal.component';

@Component({
  selector: 'app-display-budget-record',
  templateUrl: './display-budget-record.component.html',
  styleUrls: ['./display-budget-record.component.scss', '../budget-view-styles.scss']
})
/** 
 * Single row of the budget table. 
 * Can be a top level or childrow. The component takes care of the structural visualisation. 
 */
export class DisplayBudgetRecordComponent
{
  @Input() record!: BudgetRecord;
  @Input() count = 0;

  @Input()  canPromote = false;
  @Output() doPromote: EventEmitter<void> = new EventEmitter();

  desc = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam hic perspiciatis illum nobis, numquam quidem,veniam et...';

  constructor(private _router$$: Router,
              public dialog: MatDialog,
  ) { }
  
  /** 
   * Checks whether the user has access to a certain feature.
   * 
   * @TODO @IanOdhiambo9 - Please put proper access control architecture in place. 
   */
  access(requested:any) 
  {
    const budget = this.record.budget as any;

    switch (requested) {
      case 'view':
      case 'clone':
        return true; //budget.access.owner || budget.access.view || budget.access.edit;
      case 'edit':
        return true; // (budget.access.owner || budget.access.edit) && budget.status !== BudgetStatus.InUse && budget.status !== BudgetStatus.InUse;
    }
    
    return false;
  }

  /** Determines required styling of a row. */
  getRowClass() {
    const classes = ['record-row'];

    if (this.count == 0)
      classes.push('top-record');
    
    if (this.record.children.length == 0)
      classes.push('last-record');
    
    return classes;
  }

  /** Add 50px padding per level deeper */
  calcIndent() {
    return this.count * 25;
  }

  promote() {
    if (this.canPromote)
      this.doPromote.emit();
  }

  /** Open share screen to configure budget access. */
  openShareBudgetDialog(parent: Budget | false): void 
  {
    this.dialog.open(ShareBudgetModalComponent, {
      panelClass: 'no-pad-dialog',
      width: '600px',
      data: parent != null ? parent : false
    });
  }

  /** Open clone screen to clone and reconfigure budget. */
  openCloneBudgetDialog(parent: Budget | false): void {
    this.dialog.open(CreateBudgetModalComponent, {
      height: 'fit-content',
      width: '600px',
      data: parent != null ? parent : false
    });
  }

  goToDetail(budgetId: string, action: string) {
    this._router$$.navigate(['budgets', budgetId, action]);
  }
}
