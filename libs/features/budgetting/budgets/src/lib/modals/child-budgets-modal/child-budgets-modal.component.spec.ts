import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildBudgetsModalComponent } from './child-budgets-modal.component';

describe('ChildBudgetsModalComponent', () => {
  let component: ChildBudgetsModalComponent;
  let fixture: ComponentFixture<ChildBudgetsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildBudgetsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChildBudgetsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
