import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatePaymentsToInvoiceComponent } from './allocate-payments-to-invoice.component';

describe('AllocatePaymentsToInvoiceComponent', () => {
  let component: AllocatePaymentsToInvoiceComponent;
  let fixture: ComponentFixture<AllocatePaymentsToInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocatePaymentsToInvoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocatePaymentsToInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
