import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Payment } from '@app/model/finance/payments';
@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss'],
})
export class PaymentsTableComponent implements OnInit, AfterViewInit {
  
  @Input() payments: Payment[] = [];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() selectedPayment = new EventEmitter<{checked: boolean, payment: Payment}>();

  displayedColumns: string[] = ['select', 'bankIcon', 'fromAccName', 'toAccName', 'amount', 'source', 'mode', 'trStatus', 'allocStatus'];

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.payments;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterAccountRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  paymentSelected(checked: MatCheckboxChange, payment: Payment) {
    this.selectedPayment.emit({checked: checked.checked, payment: payment});
  }
}
