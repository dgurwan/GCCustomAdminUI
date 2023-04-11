import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableDetailsComponent } from './datatable-details.component';

describe('DatatableDetailsComponent', () => {
  let component: DatatableDetailsComponent;
  let fixture: ComponentFixture<DatatableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatableDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
