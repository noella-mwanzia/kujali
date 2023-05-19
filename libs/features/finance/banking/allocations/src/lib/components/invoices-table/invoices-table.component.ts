import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { round as __round } from 'lodash';

import { Invoice } from '@app/model/finance/invoices';
import { Timestamp } from '@firebase/firestore-types';
import { __DateFromStorage } from '@iote/time';

import { CALCULATE_INVOICE_TOTAL, InvoicesService } from '@app/state/finance/invoices';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss'],
})
export class InvoicesTableComponent {

  @Input() invoices: Invoice[] = [];

  displayedColumns: string[] = ['select', 'number', 'amount', 'date', 'dueDate', 'customer', 'contact', 'status'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() selectedInvoice = new EventEmitter<{checked: boolean, invoice: Invoice}>();

  constructor() {}

  ngOnInit(): void {
    this.dataSource.data = this.invoices;
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

  viewInvoice(invoiceId: string) {
    console.log(invoiceId);
  }

  getDate(date: Timestamp) {
    return __DateFromStorage(date).format('DD/MM/YYYY');
  }

  getTotalAmount(invoice: Invoice) {
    return __round(CALCULATE_INVOICE_TOTAL(invoice), 2);
  }

  invoiceSelected(checked: MatCheckboxChange, invoice: Invoice) {
    this.selectedInvoice.emit({checked: checked.checked, invoice: invoice});
  }
}
