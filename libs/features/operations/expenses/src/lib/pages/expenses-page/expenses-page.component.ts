import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateExpensesModalComponent } from '../../modals/create-expenses-modal/create-expenses-modal.component';

@Component({
  selector: 'app-expenses-page',
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.scss'],
})
export class ExpensesPageComponent implements OnInit {

  constructor(private _matDialog: MatDialog) {}

  ngOnInit(): void {}

  createNewExpense() {
    this._matDialog.open(CreateExpensesModalComponent, {
      minWidth: '700px'
    }).afterClosed();
  }
}
