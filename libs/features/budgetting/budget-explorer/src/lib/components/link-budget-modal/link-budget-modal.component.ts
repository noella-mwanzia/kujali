import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Logger, ToastService } from '@iote/bricks-angular';

import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetsStore } from '@app/state/finance/budgetting/budgets';
import { BudgetQuery } from 'libs/state/finance/budgetting/rendering/src/lib/queries/budget.query';
import { of, switchMap, take } from 'rxjs';

@Component({
    selector: 'app-link-budget-modal',
    templateUrl: './link-budget-modal.component.html',
    styleUrls: ['./link-budget-modal.component.scss']
})
export class LinkBudgetModalComponent implements OnInit
{
  budget!: Budget;
  possibleChilds!: Budget[];
  selectedBudget!: Budget;

  loading = true;
  optionsAvailable = false;

  noOptions!: boolean;

  constructor(public dialogRef: MatDialogRef<LinkBudgetModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private _toastService: ToastService,
              private _budget$$: BudgetQuery,
              private _budgets$$: BudgetsStore,
              private _logger: Logger)
  { }

  ngOnInit() { 
    this._budget$$.get(this.data).pipe(take(1)).subscribe((b) => {if(b) this.getData(b)});

    // this.budget = this.data;

  }

  getData(b: Budget) {
    this.budget = b
    this._budgets$$.getChildBudgetsAddable(b)
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

  linkBudget(f: Budget)
  {
    if (this.optionsAvailable && this.selectedBudget != null) {
      // 1. Add child
      if (!this.budget.childrenList)
        this.budget.childrenList = [];
      
     this.budget.childrenList.push(this.selectedBudget.id as string);
      
      // 2. Save child
      this._budgets$$.update(this.budget)
        .subscribe(budget => {
          this._logger.log(() => `Child ${this.selectedBudget.id} added to budget ${budget.name}.`);
        });
      
      this.dialogRef.close();
    }
    else
      this._toastService.doSimpleToast('No budget selected');
  }

}
