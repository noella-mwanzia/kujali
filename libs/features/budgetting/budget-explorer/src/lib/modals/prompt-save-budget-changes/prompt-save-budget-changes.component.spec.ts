import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptSaveBudgetChangesComponent } from './prompt-save-budget-changes.component';

describe('PromptSaveBudgetChangesComponent', () => {
  let component: PromptSaveBudgetChangesComponent;
  let fixture: ComponentFixture<PromptSaveBudgetChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromptSaveBudgetChangesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PromptSaveBudgetChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
