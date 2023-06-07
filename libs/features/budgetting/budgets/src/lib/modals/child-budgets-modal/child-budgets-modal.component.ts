import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Budget, BudgetRecord } from '@app/model/finance/planning/budgets';
import { of } from 'rxjs';

@Component({
  selector: 'app-child-budgets-modal',
  templateUrl: './child-budgets-modal.component.html',
  styleUrls: ['./child-budgets-modal.component.scss'],
})
export class ChildBudgetsModalComponent {

  allBudgets$: any;

  constructor(@Inject(MAT_DIALOG_DATA) public budgetsData: {parent: any, children: any[]}) {
    this.allBudgets$ = of(budgetsData);
  }
}
