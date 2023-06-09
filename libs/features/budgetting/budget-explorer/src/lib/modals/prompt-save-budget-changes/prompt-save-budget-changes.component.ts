import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt-save-budget-changes',
  templateUrl: './prompt-save-budget-changes.component.html',
  styleUrls: ['./prompt-save-budget-changes.component.scss'],
})
export class PromptSaveBudgetChangesComponent {

  constructor(public dialogRef: MatDialogRef<PromptSaveBudgetChangesComponent>){ }

  saveBudgetChanges() {
    this.dialogRef.close({event: 'saveChanges'});
  }
}
