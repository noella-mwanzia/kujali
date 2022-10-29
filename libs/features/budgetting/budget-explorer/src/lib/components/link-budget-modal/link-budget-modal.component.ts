import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastService, Logger } from '@elewa/angular-bricks';

import { BudgetService } from '../../../financial-planning/services/budget.service';

import { Budget } from '@elewa/portal-shared';

@Component({
    selector: 'app-link-budget-modal',
    templateUrl: './link-budget-modal.component.html',
    styleUrls: ['./link-budget-modal.component.scss']
})
export class LinkBudgetModalComponent
{
  budget: Budget;
  possibleChilds: Budget[];
  selectedBudget: Budget;

  loading = true;
  optionsAvailable = false;

  noOptions: boolean;

  constructor(public dialogRef: MatDialogRef<LinkBudgetModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Budget,
              private _toastService: ToastService,
              private _budgetService: BudgetService,
              private _logger: Logger)
  { }

  ngOnInit() { 
    this.budget = this.data;

    this._budgetService.getChildBudgetsAddable(this.budget)
      .subscribe(bs =>
      {
        this.possibleChilds = bs;
        this.optionsAvailable = bs.length > 0;
        if (this.optionsAvailable)
          this.selectedBudget = bs[0];
        
        this.loading = false;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  linkBudget(f)
  {
    if (this.optionsAvailable && this.selectedBudget != null) {
      // 1. Add child
      if (!this.budget.childrenList)
        this.budget.childrenList = [];
      
     this.budget.childrenList.push(this.selectedBudget.id);
      
      // 2. Save child
      this._budgetService.updateBudget(this.budget)
        .subscribe(budget => {
          this._logger.log(() => 'Child ' + this.selectedBudget.id + ' added to budget ' + budget.name + ' .');
        });
      
      this.dialogRef.close();
    }
    else
      this._toastService.doSimpleToast('No budget selected');
  }

}
