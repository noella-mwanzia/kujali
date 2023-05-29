import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCompanyDetailComponent } from './single-company-detail.component';

describe('SingleCompanyDetailComponent', () => {
  let component: SingleCompanyDetailComponent;
  let fixture: ComponentFixture<SingleCompanyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCompanyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
