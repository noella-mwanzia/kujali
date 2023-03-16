import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-single-action-message-modal',
  templateUrl: './single-action-message-modal.component.html',
  styleUrls: ['./single-action-message-modal.component.scss'],
})
export class SingleActionMessageModalComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: {dialogTitle: string, actionMessage: string, actionUrl: string}) { }

  ngOnInit() {}

  navigatetToAction() {
    window.location.href = this.data.actionUrl;
  }
}
