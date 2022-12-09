import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BudgetRowType } from '@app/model/finance/planning/budget-grouping';
import { MONTHS } from '@app/model/finance/planning/time';

import { PlanTransactionModalComponent } from '@app/features/budgetting/budget-planning';

@Component({
  selector: 'app-year-focus',
  styleUrls: ['./year-focus.component.scss'],
  templateUrl: './year-focus.component.html'
})
/** 
 * Component on the side of the page which offers easy navigation between financial years.
 */
export class YearFocusComponent {
  @Input() title!: string;
  @Input() budgetId: string;
  @Input() type: BudgetRowType;

  @Output() navigateYearPressed = new EventEmitter<'prev' | 'next'>();

  constructor(private dialog: MatDialog) { }

  navigateYear(nav: 'prev' | 'next') {
    this.navigateYearPressed.emit(nav);
  }

  addCostOrIncome() {
    this.dialog.open(PlanTransactionModalComponent,
      {
        data: { isInCreateMode: true, month: MONTHS[0], type: this.type, budgetId: this.budgetId },
        minHeight: '600px'
      })
  }
}
