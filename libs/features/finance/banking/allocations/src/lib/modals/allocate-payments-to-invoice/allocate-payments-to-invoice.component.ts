import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';
import { combineLatest, map, Observable, tap, filter } from 'rxjs';
import { merge as __merge } from 'lodash';

import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';
import { BankTransaction, Payment } from '@app/model/finance/payments';
import { PaymentAllocation } from '@app/model/finance/allocations';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';

import { PaymentsStateService } from '@app/state/finance/payments';
import { AllocationsStateService } from '@app/state/finance/allocations';
import { CALCULATE_INVOICE_TOTAL } from '@app/state/finance/invoices';

@Component({
  selector: 'app-allocate-payments-to-invoice',
  templateUrl: './allocate-payments-to-invoice.component.html',
  styleUrls: ['./allocate-payments-to-invoice.component.scss'],
})
export class AllocatePaymentsToInvoiceComponent {

  private _sbS = new SubSink();

  displayedColumns: string[] = ['select', 'bankIcon', 'fromAccName', 'toAccName', 'amount', 'source', 'mode', 'trStatus', 'allocStatus'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  startPontoOnboarding = false;

  org: Organisation;

  isLoading: boolean = false;
  redirectUrl: string = '';

  accounts$: Observable<FAccount[]>;

  showFilter: boolean = false;

  selectedPayments: any[] = [];

  allocating: boolean = false;

  alloctedAmount: number = 0;
  totalInvoiceAmount: number = 0;

  constructor(private _dialog: MatDialog,
              private _aFF: AngularFireFunctions,
              private _paymentsService: PaymentsStateService,
              private _allocsService: AllocationsStateService,
              @Inject(MAT_DIALOG_DATA) public invoice: Invoice
  ) { }

  ngOnInit(): void {
    this.totalInvoiceAmount = CALCULATE_INVOICE_TOTAL(this.invoice);

    this._sbS.sink = combineLatest([this._paymentsService.getAllPayments(),
                                    this._allocsService.getPaymentAllocations()])
      .pipe(
        filter(([trs, pAllocs]) => !!trs && !!pAllocs),
        map(([trs, pAllocs]) => this.flatMapTransactionsAndPayments(trs, pAllocs)),
        tap((data) => { this.dataSource.data = data }))
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  flatMapTransactionsAndPayments(trs: BankTransaction[], pAllocs: PaymentAllocation[]) {
    let trsAndPayments = trs.map((tr) => {
      const paymentAlloc = pAllocs.find((p) => p.id === tr.id);
      return __merge(tr, paymentAlloc);
    })
    return trsAndPayments.filter((tr) => tr.allocStatus !== 1);
  }

  filterAccountRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  paymentSelected(checked: MatCheckboxChange, payment: Payment) {
    if (checked.checked) {
      this.selectedPayments.push(payment);
    } else {
      let removedPayment = this.selectedPayments.find((paym) => paym.id == payment.id);
      this.selectedPayments.splice(this.selectedPayments.indexOf(removedPayment!), 1);
    }
    this.calculateAllocatedAmount();
  }

  calculateAllocatedAmount() {
    this.alloctedAmount = this.selectedPayments.reduce((acc, payment) => {
      return acc + payment.amount;
    }, 0);
  }

  getUnallocatedAmount(invoice: InvoiceAllocation, payAmnt: number): number {
    const amnt = invoice.allocStatus == 5 ? invoice.credit! - this.alloctedAmount: payAmnt - this.alloctedAmount;
    return amnt > 0 ? amnt : 0;
  }


  allocateInvoieToTransaction() {
    this.allocating = true;    
    this._allocsService.allocatePayments(this.selectedPayments, this.invoice)
                            .subscribe(() => this.completeAllocationActions());
  }

  completeAllocationActions() {
    this.allocating = false;
    this._dialog.closeAll();
  }
}
